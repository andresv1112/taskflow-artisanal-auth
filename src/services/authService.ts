// Capa de Lógica - Servicio de Autenticación
import { UserRepository } from "@/data/repositories/userRepository";
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from "@/types/auth";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
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
      const userWithPassword = await this.userRepository.findByUsernameWithPassword(credentials.username);
      
      if (!userWithPassword) {
        return {
          success: false,
          error: "Credenciales inválidas"
        };
      }

      // Verificar password
      const isPasswordValid = await this.userRepository.verifyPassword(
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
      const existingUser = await this.userRepository.findByUsername(credentials.username);
      if (existingUser) {
        return {
          success: false,
          error: "El username ya está en uso"
        };
      }

      // Crear nuevo usuario
      const newUser = await this.userRepository.create(credentials);
      if (!newUser) {
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