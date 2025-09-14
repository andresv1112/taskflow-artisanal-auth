// Capa de Lógica - Servicio de Autenticación
import { supabase } from "@/integrations/supabase/client";
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from "@/types/auth";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor() {
    // No dependencies needed, direct access to data layer
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validaciones básicas
      if (!credentials.username || !credentials.password) {
        return {
          success: false,
          error: "Username y password son requeridos"
        };
      }

      // Buscar usuario con password
      const { data: userWithPassword, error } = await supabase
        .from('users')
        .select('id, username, password_hash, created_at, updated_at')
        .eq('username', credentials.username)
        .maybeSingle();

      if (error || !userWithPassword) {
        return {
          success: false,
          error: "Credenciales inválidas"
        };
      }

      // Verificar password
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        userWithPassword.password_hash
      );

      if (!isPasswordValid) {
        return {
          success: false,
          error: "Credenciales inválidas"
        };
      }

      // Retornar usuario sin password
      const user: User = {
        id: userWithPassword.id,
        username: userWithPassword.username,
        created_at: userWithPassword.created_at,
        updated_at: userWithPassword.updated_at
      };

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Error in login service:', error);
      return {
        success: false,
        error: "Error interno del servidor"
      };
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Validaciones básicas
      if (!credentials.username || !credentials.password) {
        return {
          success: false,
          error: "Username y password son requeridos"
        };
      }

      if (credentials.username.length < 3) {
        return {
          success: false,
          error: "El username debe tener al menos 3 caracteres"
        };
      }

      if (credentials.password.length < 6) {
        return {
          success: false,
          error: "El password debe tener al menos 6 caracteres"
        };
      }

      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', credentials.username)
        .maybeSingle();

      if (existingUser) {
        return {
          success: false,
          error: "El username ya está en uso"
        };
      }

      // Crear nuevo usuario
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(credentials.password, saltRounds);

      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          username: credentials.username,
          password_hash: hashedPassword
        })
        .select('id, username, created_at, updated_at')
        .single();

      if (error || !newUser) {
        return {
          success: false,
          error: "Error al crear el usuario"
        };
      }

      return {
        success: true,
        user: newUser
      };
    } catch (error) {
      console.error('Error in register service:', error);
      return {
        success: false,
        error: "Error interno del servidor"
      };
    }
  }
}