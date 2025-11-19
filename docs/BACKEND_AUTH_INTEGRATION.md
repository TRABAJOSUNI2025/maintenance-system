# 🔗 Integración Frontend-Backend - Autenticación

## Descripción

Guía para conectar el frontend React con el backend NestJS para login y registro de usuarios.

---

## 📊 Endpoints Disponibles

### Base URL

```
http://localhost:3000/api  (en desarrollo)
```

### 1. Registrar Usuario

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "password": "password123",
  "role": "CLIENTE"  // opcional
}

Response (201):
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CLIENTE"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 2. Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CLIENTE"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 3. Refrescar Token

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "success": true,
  "message": "Token refrescado",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 4. Obtener Perfil

```http
GET /auth/profile
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "user": {
    "id": "...",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "CLIENTE",
    "status": true,
    "createdAt": "2024-11-16T..."
  }
}
```

---

## 🔄 Actualizar axiosInstance

**Archivo**: `frontend/src/api/axiosInstance.ts`

```typescript
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar refresh token automático
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        // Reintentar solicitud original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh falló, redirigir a login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 🔐 Actualizar AuthContext

**Archivo**: `frontend/src/context/AuthContext.tsx`

```typescript
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../api/axiosInstance";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SUPERVISOR" | "OPERATOR" | "TECHNICIAN" | "CLIENTE";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay sesión guardada al montar
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          await getProfile();
        } catch (error) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error en el login";
      throw new Error(message);
    }
  };

  const register = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role = "CLIENTE"
  ) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        firstName,
        lastName,
        password,
        role,
      });

      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error en el registro";
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getProfile = async () => {
    try {
      const response = await axiosInstance.get("/auth/profile");
      const { user } = response.data;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
```

---

## 🔗 Actualizar auth.api.ts

**Archivo**: `frontend/src/api/auth.api.ts`

```typescript
import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    axiosInstance.post("/auth/login", payload).then((res) => res.data),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    axiosInstance.post("/auth/register", payload).then((res) => res.data),

  refreshToken: (refreshToken: string) =>
    axiosInstance
      .post("/auth/refresh", { refreshToken })
      .then((res) => res.data),

  getProfile: () => axiosInstance.get("/auth/profile").then((res) => res.data),

  changePassword: (oldPassword: string, newPassword: string) =>
    axiosInstance
      .post("/auth/change-password", { oldPassword, newPassword })
      .then((res) => res.data),

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
```

---

## 🧪 Actualizar LoginPage

**Archivo**: `frontend/src/modules/access/LoginPage.tsx`

```typescript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error en el login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101322] flex items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-white text-center font-['Space_Grotesk']">
            Login
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded">
              {error}
            </div>
          )}

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>

          <p className="text-center text-gray-400">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#0d33f2] hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
```

---

## 🧪 Actualizar RegisterPage

**Archivo**: `frontend/src/modules/access/RegisterPage.tsx`

```typescript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/Input";
import Button from "../../components/Button";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.firstName,
        formData.lastName,
        formData.password,
        "CLIENTE" // El rol es CLIENTE por defecto
      );
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error en el registro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101322] flex items-center justify-center">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-3xl font-bold text-white text-center font-['Space_Grotesk']">
            Crear Cuenta
          </h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded">
              {error}
            </div>
          )}

          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <Input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </Button>

          <p className="text-center text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#0d33f2] hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
```

---

## 🌍 Variable de Entorno

Crear archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🔒 Almacenamiento de Tokens

### localStorage (Recomendado para persistencia)

```typescript
localStorage.setItem("accessToken", token);
localStorage.setItem("refreshToken", refreshToken);

const token = localStorage.getItem("accessToken");
localStorage.removeItem("accessToken");
```

### sessionStorage (Solo en sesión actual)

```typescript
sessionStorage.setItem("accessToken", token);
```

---

## 🚨 Flujo de Error

### Login Fallido

```
POST /auth/login
{
  "email": "invalid@example.com",
  "password": "wrongpassword"
}

Response (401):
{
  "statusCode": 401,
  "message": "Email o contraseña incorrectos",
  "error": "Unauthorized"
}
```

### Token Expirado

```
GET /auth/profile
Authorization: Bearer <expired_token>

Response (401):
{
  "statusCode": 401,
  "message": "Token inválido o expirado",
  "error": "Unauthorized"
}

// El interceptor intenta refrescar automáticamente
```

### Email Duplicado (Register)

```
POST /auth/register
{
  "email": "existing@example.com",
  ...
}

Response (409):
{
  "statusCode": 409,
  "message": "El email ya está registrado",
  "error": "Conflict"
}
```

---

## 📋 Checklist de Integración

- [ ] Actualizar `.env` con `VITE_API_URL`
- [ ] Actualizar `axiosInstance.ts` con interceptores
- [ ] Actualizar `AuthContext.tsx` con métodos backend
- [ ] Actualizar `auth.api.ts` con endpoints
- [ ] Actualizar `LoginPage.tsx` para usar API
- [ ] Actualizar `RegisterPage.tsx` para usar API
- [ ] Probar login con usuario: admin@maintenance.local / password123
- [ ] Probar registro de nuevo usuario
- [ ] Probar refresh automático de token
- [ ] Probar logout
- [ ] Verificar que tokens se guardan en localStorage
- [ ] Verificar que los dashboards se cargan después del login

---

## 🧪 Usuarios de Prueba (Seed)

```
Email                           Password    Rol
admin@maintenance.local         password123 ADMIN
supervisor@maintenance.local    password123 SUPERVISOR
technician@maintenance.local    password123 TECHNICIAN
operator@maintenance.local      password123 OPERATOR
cliente@maintenance.local       password123 CLIENTE
```

---

## ✅ Validar Conexión

### 1. Backend corriendo

```bash
cd backend
npm install
npm run start:dev
```

### 2. Frontend corriendo

```bash
cd frontend
npm run dev
```

### 3. Probar en navegador

- Ir a `http://localhost:5173/login`
- Ingresar: `cliente@maintenance.local` / `password123`
- Deberías redirigir a `/dashboard` con datos del usuario

---

**Estado**: ✅ **LISTO PARA INTEGRACIÓN**

Frontend-Backend están completamente configurados para autenticación.
