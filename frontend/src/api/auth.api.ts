import axiosInstance from './axiosInstance';
import type { User, LoginResponse, RegisterClienteDto } from '@/types/auth';

export const authApi = {
  login: async (email: string, password: string, userType?: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
      userType: userType || 'CLIENTE',
    });
    return response.data;
  },

  register: async (data: RegisterClienteDto): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/register', {
      nombre: data.nombre,
      apePaterno: data.apePaterno,
      apeMaterno: data.apeMaterno || undefined,
      correo: data.correo,
      password: data.password,
      telefono: data.telefono || undefined,
    });
    return response.data;
  },

  getProfile: async (): Promise<{ success: boolean; user: User }> => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/refresh', {
      token: refreshToken,
    });
    return response.data;
  },
};

