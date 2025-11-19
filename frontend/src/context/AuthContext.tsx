import type { ReactNode } from 'react';
import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '@/api/auth.api';
import type { User, AuthContextType, RegisterClienteDto } from '@/types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay token al montar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Cargar usuario actual del backend
      getProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const getProfile = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.user);
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, userType?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(email, password, userType);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userType', response.user.role || 'CLIENTE');
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterClienteDto) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al crear la cuenta';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      // Limpiar de todas formas
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
