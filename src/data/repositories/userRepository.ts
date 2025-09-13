// Capa de Datos - Repository para Users
import { supabase } from "@/integrations/supabase/client";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import bcrypt from "bcryptjs";

export class UserRepository {
  async findByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, created_at, updated_at')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Error finding user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      return null;
    }
  }

  async findByUsernameWithPassword(username: string): Promise<(User & { password_hash: string }) | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, password_hash, created_at, updated_at')
        .eq('username', username)
        .maybeSingle();

      if (error) {
        console.error('Error finding user with password:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in findByUsernameWithPassword:', error);
      return null;
    }
  }

  async create(userData: RegisterCredentials): Promise<User | null> {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const { data, error } = await supabase
        .from('users')
        .insert({
          username: userData.username,
          password_hash: hashedPassword
        })
        .select('id, username, created_at, updated_at')
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in create:', error);
      return null;
    }
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }
}