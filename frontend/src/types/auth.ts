export type UserRole = 'ADMINISTRADOR' | 'OPERARIO' | 'SUPERVISOR' | 'CLIENTE' | 'TRABAJADOR';

export type UserType = 'CLIENTE' | 'TRABAJADOR';

export interface User {
  id: number;
  email?: string;
  correo?: string;
  username: string;
  nombres?: string;
  status?: boolean;
  role?: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterClienteDto {
  nombre: string;
  apePaterno: string;
  apeMaterno?: string;
  correo: string;
  password: string;
  telefono?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType?: string) => Promise<LoginResponse>;
  register: (data: RegisterClienteDto) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

