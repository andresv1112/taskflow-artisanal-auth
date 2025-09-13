// Capa de Lógica - Context para manejo de estado de autenticación
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth';
import { AuthService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  // Cargar usuario desde localStorage al inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('todo_app_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('todo_app_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('todo_app_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error in login:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await authService.register(credentials);
      
      if (response.success && response.user) {
        setUser(response.user);
        localStorage.setItem('todo_app_user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Error in register:', error);
      return {
        success: false,
        error: 'Error interno del servidor'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('todo_app_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};