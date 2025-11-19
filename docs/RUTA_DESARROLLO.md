# 🛣️ RUTA LÓGICA DE DESARROLLO - Sistema de Mantenimiento de Vehículos

## 📋 Tabla de Contenidos

1. [FRONTEND](#frontend)
   - Fase 1: Landing Page
   - Fase 2: Login y Enrutamiento por Rol
   - Fase 3: Control de Acceso por Roles (RBAC)
   - Fase 3.5: Navbar Dinámico por Rol ⭐
   - Fase 4: Módulos Funcionales por Rol
2. [BACKEND](#backend)
3. [Integración API](#integración-api)
4. [Control de Acceso por Roles](#control-de-acceso-por-roles)

---

## 🎨 FRONTEND

### Fase 1: Landing Page General (Pantalla Pública)

#### Objetivo

Crear una landing page informativa para usuarios no autenticados que muestre:

- Descripción del sistema
- Opciones de login/registro
- Información general del proyecto

#### Archivos a Crear/Actualizar

```
frontend/src/
├── components/
│   ├── Hero.tsx               (Sección hero con CTA)
│   ├── Features.tsx           (Características principales)
│   └── Footer.tsx             (Pie de página)
├── modules/
│   └── landing/
│       ├── LandingPage.tsx    (Página principal pública)
│       └── styles/
│           └── landing.css
└── routes/
    └── index.tsx              (ACTUALIZAR - agregar ruta pública)
```

#### Paso 1.1: Crear Componente Hero

**Archivo**: `frontend/src/components/Hero.tsx`

```typescript
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center">
      <div className="container mx-auto px-6 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">
          Sistema de Mantenimiento Vehicular
        </h1>
        <p className="text-xl mb-8">
          Gestiona el mantenimiento de tu flota de vehículos de forma eficiente
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </section>
  );
};
```

#### Paso 1.2: Crear Página Landing

**Archivo**: `frontend/src/modules/landing/LandingPage.tsx`

```typescript
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};
```

#### Paso 1.3: Actualizar Routes

**Archivo**: `frontend/src/routes/index.tsx`

```typescript
import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/modules/landing/LandingPage";
import { LoginPage } from "@/modules/access/LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { DashboardPage } from "@/modules/dashboard/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  // Más rutas por rol aquí
]);
```

---

### Fase 2: Login y Enrutamiento por Rol

#### Objetivo

Implementar login funcional que:

- Valide credenciales contra el backend
- Almacene token JWT en localStorage
- Redirija según rol del usuario (ADMIN, OPERATOR, TECHNICIAN, SUPERVISOR)

#### Archivos a Crear/Actualizar

```
frontend/src/
├── modules/
│   └── access/
│       ├── LoginPage.tsx         (Formulario de login)
│       ├── RegisterPage.tsx      (Formulario de registro)
│       ├── components/
│       │   └── LoginForm.tsx     (Componente reutilizable)
│       └── styles/
│           └── auth.css
├── context/
│   └── AuthContext.tsx           (ACTUALIZAR - agregar lógica de roles)
├── hooks/
│   └── useAuth.ts                (Hook para autenticación)
└── types/
    └── auth.ts                   (Tipos de autenticación)
```

#### Paso 2.1: Tipos de Autenticación

**Archivo**: `frontend/src/types/auth.ts`

```typescript
export type UserRole = "ADMIN" | "OPERATOR" | "TECHNICIAN" | "SUPERVISOR";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
```

#### Paso 2.2: API de Autenticación

**Archivo**: `frontend/src/api/auth.api.ts` (ACTUALIZAR)

```typescript
import axiosInstance from "./axiosInstance";
import { User, LoginDto, RegisterDto } from "@/types/auth";

export const authApi = {
  login: async (
    credentials: LoginDto
  ): Promise<{ token: string; user: User }> => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  register: async (
    data: RegisterDto
  ): Promise<{ token: string; user: User }> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },
};
```

#### Paso 2.3: Context de Autenticación Mejorado

**Archivo**: `frontend/src/context/AuthContext.tsx` (ACTUALIZAR)

```typescript
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType, LoginDto, RegisterDto } from "@/types/auth";
import { authApi } from "@/api/auth.api";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay token al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user: userData } = await authApi.login({
        email,
        password,
      });
      localStorage.setItem("token", token);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user: userData } = await authApi.register(data);
      localStorage.setItem("token", token);
      setUser(userData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
    localStorage.removeItem("token");
    setUser(null);
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
```

#### Paso 2.4: Página de Login

**Archivo**: `frontend/src/modules/access/LoginPage.tsx`

```typescript
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./components/LoginForm";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formError, setFormError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    try {
      setFormError("");
      await login(email, password);
      // La redirección por rol ocurre en ProtectedRoute
      navigate("/dashboard");
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>
        {(error || formError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || formError}
          </div>
        )}
        <LoginForm onSubmit={handleLogin} loading={loading} />
        <p className="text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};
```

#### Paso 2.5: Componente LoginForm

**Archivo**: `frontend/src/modules/access/components/LoginForm.tsx`

```typescript
import { useState } from "react";
import { Input } from "@/components/Input";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};
```

---

### Fase 3: Control de Acceso por Roles (RBAC)

#### Objetivo

Implementar un sistema de control de acceso basado en roles que:

- Valide el rol del usuario antes de acceder a rutas
- Muestre/oculte componentes según rol
- Proteja llamadas API

#### Archivos a Crear/Actualizar

```
frontend/src/
├── routes/
│   ├── ProtectedRoute.tsx        (ACTUALIZAR - agregar validación de rol)
│   ├── RoleBasedRoute.tsx        (Componente para rutas por rol)
│   └── index.tsx                 (ACTUALIZAR - agregar rutas por rol)
├── hooks/
│   └── useRole.ts                (Hook para verificar roles)
└── guards/
    └── roleGuard.ts              (Guard functions para rutas)
```

#### Paso 3.1: RoleBasedRoute Component

**Archivo**: `frontend/src/routes/RoleBasedRoute.tsx`

```typescript
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

#### Paso 3.2: useRole Hook

**Archivo**: `frontend/src/hooks/useRole.ts`

```typescript
import { useAuth } from "./useAuth";
import { UserRole } from "@/types/auth";

export const useRole = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === "ADMIN",
    isOperator: user?.role === "OPERATOR",
    isTechnician: user?.role === "TECHNICIAN",
    isSupervisor: user?.role === "SUPERVISOR",
    hasRole: (role: UserRole | UserRole[]) => {
      if (Array.isArray(role)) {
        return user ? role.includes(user.role) : false;
      }
      return user?.role === role;
    },
    canViewUsers: user?.role === "ADMIN",
    canViewReports: user?.role === "ADMIN" || user?.role === "SUPERVISOR",
    canManageMaintenance: user?.role === "ADMIN" || user?.role === "OPERATOR",
    canViewDiagnostics: user?.role !== "OPERATOR",
  };
};
```

#### Paso 3.3: Actualizar Routes con Rol

**Archivo**: `frontend/src/routes/index.tsx` (COMPLETO)

```typescript
import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/modules/landing/LandingPage";
import { LoginPage } from "@/modules/access/LoginPage";
import { RegisterPage } from "@/modules/access/RegisterPage";
import { RoleBasedRoute } from "./RoleBasedRoute";

// Dashboard
import { DashboardPage } from "@/modules/dashboard/DashboardPage";

// Admin
import { AdminUsersPage } from "@/modules/admin/pages/AdminUsersPage";
import { AdminReportsPage } from "@/modules/admin/pages/AdminReportsPage";

// Operator
import { OperatorMaintenancePage } from "@/modules/operator/pages/OperatorMaintenancePage";
import { OperatorVehiclesPage } from "@/modules/operator/pages/OperatorVehiclesPage";

// Technician
import { TechnicianDiagnosticsPage } from "@/modules/diagnostics/pages/TechnicianDiagnosticsPage";

// Common
import { UnauthorizedPage } from "@/modules/errors/UnauthorizedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RoleBasedRoute
        allowedRoles={["ADMIN", "OPERATOR", "TECHNICIAN", "SUPERVISOR"]}
      >
        <DashboardPage />
      </RoleBasedRoute>
    ),
  },
  // ADMIN ROUTES
  {
    path: "/admin/users",
    element: (
      <RoleBasedRoute allowedRoles={["ADMIN"]}>
        <AdminUsersPage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <RoleBasedRoute allowedRoles={["ADMIN", "SUPERVISOR"]}>
        <AdminReportsPage />
      </RoleBasedRoute>
    ),
  },
  // OPERATOR ROUTES
  {
    path: "/operator/maintenance",
    element: (
      <RoleBasedRoute allowedRoles={["OPERATOR", "ADMIN"]}>
        <OperatorMaintenancePage />
      </RoleBasedRoute>
    ),
  },
  {
    path: "/operator/vehicles",
    element: (
      <RoleBasedRoute allowedRoles={["OPERATOR", "ADMIN"]}>
        <OperatorVehiclesPage />
      </RoleBasedRoute>
    ),
  },
  // TECHNICIAN ROUTES
  {
    path: "/diagnostics",
    element: (
      <RoleBasedRoute allowedRoles={["TECHNICIAN", "ADMIN"]}>
        <TechnicianDiagnosticsPage />
      </RoleBasedRoute>
    ),
  },
  // ERROR ROUTES
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <div className="text-center p-8">Página no encontrada</div>,
  },
]);
```

---

### Fase 3.5: Navbar Dinámico por Rol ⭐

#### Objetivo

Crear una barra de navegación que se adapte dinámicamente según el rol del usuario, mostrando solo los menús y opciones permitidas.

#### Archivos a Crear

```
frontend/src/
├── components/
│   ├── Navbar/
│   │   ├── Navbar.tsx                    (Componente principal)
│   │   ├── NavbarAdmin.tsx               (Menú para ADMIN)
│   │   ├── NavbarOperator.tsx            (Menú para OPERATOR)
│   │   ├── NavbarTechnician.tsx          (Menú para TECHNICIAN)
│   │   ├── NavbarSupervisor.tsx          (Menú para SUPERVISOR)
│   │   ├── UserMenu.tsx                  (Perfil + Logout)
│   │   └── styles/
│   │       └── navbar.css
│   └── Layout/
│       ├── ProtectedLayout.tsx           (Layout con Navbar para rutas protegidas)
│       └── PublicLayout.tsx              (Layout sin Navbar para rutas públicas)
```

#### Paso 3.5.1: Componente Navbar Principal

**Archivo**: `frontend/src/components/Navbar/Navbar.tsx`

```typescript
import { useRole } from "@/hooks/useRole";
import { NavbarAdmin } from "./NavbarAdmin";
import { NavbarOperator } from "./NavbarOperator";
import { NavbarTechnician } from "./NavbarTechnician";
import { NavbarSupervisor } from "./NavbarSupervisor";
import { UserMenu } from "./UserMenu";
import "./styles/navbar.css";

export const Navbar = () => {
  const { isAdmin, isOperator, isTechnician, isSupervisor } = useRole();

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">🚗 Maintenance</span>
        </div>

        {/* Menú dinámico por rol */}
        <div className="flex-1 mx-8">
          {isAdmin && <NavbarAdmin />}
          {isOperator && !isAdmin && <NavbarOperator />}
          {isTechnician && !isAdmin && <NavbarTechnician />}
          {isSupervisor && !isAdmin && <NavbarSupervisor />}
        </div>

        {/* Menú de usuario */}
        <UserMenu />
      </div>
    </nav>
  );
};
```

#### Paso 3.5.2: NavbarAdmin (Menú Administrador)

**Archivo**: `frontend/src/components/Navbar/NavbarAdmin.tsx`

```typescript
import { Link } from "react-router-dom";

export const NavbarAdmin = () => {
  return (
    <ul className="flex gap-6 items-center list-none">
      <li>
        <Link to="/dashboard" className="hover:text-blue-200 transition">
          Dashboard
        </Link>
      </li>
      <li className="relative group">
        <button className="hover:text-blue-200 transition">Gestión</button>
        <div className="hidden group-hover:block absolute left-0 bg-blue-800 rounded shadow-lg min-w-48 z-50">
          <Link
            to="/admin/users"
            className="block px-4 py-2 hover:bg-blue-700 w-full text-left"
          >
            👥 Usuarios
          </Link>
          <Link
            to="/admin/vehicles"
            className="block px-4 py-2 hover:bg-blue-700 w-full text-left"
          >
            🚙 Vehículos
          </Link>
          <Link
            to="/admin/settings"
            className="block px-4 py-2 hover:bg-blue-700 w-full text-left"
          >
            ⚙️ Configuración
          </Link>
        </div>
      </li>
      <li>
        <Link to="/admin/reports" className="hover:text-blue-200 transition">
          📊 Reportes
        </Link>
      </li>
    </ul>
  );
};
```

#### Paso 3.5.3: NavbarOperator (Menú Operario)

**Archivo**: `frontend/src/components/Navbar/NavbarOperator.tsx`

```typescript
import { Link } from "react-router-dom";

export const NavbarOperator = () => {
  return (
    <ul className="flex gap-6 items-center list-none">
      <li>
        <Link to="/dashboard" className="hover:text-blue-200 transition">
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/operator/vehicles"
          className="hover:text-blue-200 transition"
        >
          🚙 Mi Flota
        </Link>
      </li>
      <li>
        <Link
          to="/operator/maintenance"
          className="hover:text-blue-200 transition"
        >
          🔧 Mantenimiento
        </Link>
      </li>
      <li>
        <Link
          to="/operator/schedule"
          className="hover:text-blue-200 transition"
        >
          📅 Calendario
        </Link>
      </li>
    </ul>
  );
};
```

#### Paso 3.5.4: NavbarTechnician (Menú Técnico)

**Archivo**: `frontend/src/components/Navbar/NavbarTechnician.tsx`

```typescript
import { Link } from "react-router-dom";

export const NavbarTechnician = () => {
  return (
    <ul className="flex gap-6 items-center list-none">
      <li>
        <Link to="/dashboard" className="hover:text-blue-200 transition">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/diagnostics" className="hover:text-blue-200 transition">
          🔍 Diagnósticos
        </Link>
      </li>
      <li>
        <Link
          to="/technician/repairs"
          className="hover:text-blue-200 transition"
        >
          🔨 Reparaciones
        </Link>
      </li>
      <li>
        <Link
          to="/technician/reports"
          className="hover:text-blue-200 transition"
        >
          📋 Mis Reportes
        </Link>
      </li>
    </ul>
  );
};
```

#### Paso 3.5.5: NavbarSupervisor (Menú Supervisor)

**Archivo**: `frontend/src/components/Navbar/NavbarSupervisor.tsx`

```typescript
import { Link } from "react-router-dom";

export const NavbarSupervisor = () => {
  return (
    <ul className="flex gap-6 items-center list-none">
      <li>
        <Link to="/dashboard" className="hover:text-blue-200 transition">
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/supervisor/reports"
          className="hover:text-blue-200 transition"
        >
          📊 Reportes
        </Link>
      </li>
      <li>
        <Link
          to="/supervisor/statistics"
          className="hover:text-blue-200 transition"
        >
          📈 Estadísticas
        </Link>
      </li>
      <li>
        <Link
          to="/supervisor/overview"
          className="hover:text-blue-200 transition"
        >
          👁️ Supervisión
        </Link>
      </li>
    </ul>
  );
};
```

#### Paso 3.5.6: Componente UserMenu

**Archivo**: `frontend/src/components/Navbar/UserMenu.tsx`

```typescript
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
      >
        👤 {user?.name}
      </button>

      {isOpen && (
        <div className="absolute right-0 bg-blue-800 rounded shadow-lg min-w-48 z-50">
          <div className="px-4 py-3 border-b border-blue-700">
            <p className="font-bold">{user?.name}</p>
            <p className="text-sm text-blue-200">{user?.email}</p>
            <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs mt-1">
              {user?.role}
            </span>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="block w-full text-left px-4 py-2 hover:bg-blue-700 transition"
          >
            👤 Mi Perfil
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="block w-full text-left px-4 py-2 hover:bg-blue-700 transition"
          >
            ⚙️ Configuración
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-red-600 transition border-t border-blue-700"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};
```

#### Paso 3.5.7: ProtectedLayout

**Archivo**: `frontend/src/components/Layout/ProtectedLayout.tsx`

```typescript
import { ReactNode } from "react";
import { Navbar } from "../Navbar/Navbar";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
```

#### Paso 3.5.8: Actualizar Rutas para usar ProtectedLayout

**Archivo**: `frontend/src/routes/index.tsx` (ACTUALIZAR)

```typescript
import { ProtectedLayout } from "@/components/Layout/ProtectedLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RoleBasedRoute
        allowedRoles={["ADMIN", "OPERATOR", "TECHNICIAN", "SUPERVISOR"]}
      >
        <ProtectedLayout>
          <DashboardPage />
        </ProtectedLayout>
      </RoleBasedRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RoleBasedRoute allowedRoles={["ADMIN"]}>
        <ProtectedLayout>
          <AdminUsersPage />
        </ProtectedLayout>
      </RoleBasedRoute>
    ),
  },
  // Resto de rutas con ProtectedLayout...
]);
```

---

### Fase 4: Módulos Funcionales por Rol

#### 4.1 Dashboard General

```
frontend/src/modules/dashboard/
├── DashboardPage.tsx
├── components/
│   ├── Widgets/
│   │   ├── StatsCard.tsx        (Tarjetas de estadísticas)
│   │   ├── RecentActivity.tsx   (Actividad reciente)
│   │   └── QuickActions.tsx     (Acciones rápidas por rol)
│   └── Navbar.tsx               (Barra de navegación con rol)
└── styles/
    └── dashboard.css
```

#### 4.2 Módulo Admin

```
frontend/src/modules/admin/
├── pages/
│   ├── AdminUsersPage.tsx
│   ├── AdminReportsPage.tsx
│   └── AdminSettingsPage.tsx
├── components/
│   ├── UserTable.tsx            (CRUD de usuarios)
│   ├── UserModal.tsx            (Modal crear/editar usuario)
│   ├── ReportsChart.tsx         (Gráficos de reportes)
│   └── RoleSelector.tsx         (Selector de roles)
└── styles/
    └── admin.css
```

#### 4.3 Módulo Operator

```
frontend/src/modules/operator/
├── pages/
│   ├── OperatorMaintenancePage.tsx
│   ├── OperatorVehiclesPage.tsx
│   └── OperatorSchedulePage.tsx
├── components/
│   ├── MaintenanceTable.tsx
│   ├── VehicleCard.tsx
│   ├── MaintenanceModal.tsx
│   └── StatusBadge.tsx
└── styles/
    └── operator.css
```

#### 4.4 Módulo Technician

```
frontend/src/modules/diagnostics/
├── pages/
│   └── TechnicianDiagnosticsPage.tsx
├── components/
│   ├── DiagnosticsList.tsx
│   ├── DiagnosticForm.tsx
│   ├── FindingsInput.tsx
│   └── SeverityIndicator.tsx
└── styles/
    └── diagnostics.css
```

---

## 🔌 BACKEND

### Fase 1: Módulo de Autenticación (Auth)

#### Objetivo

Implementar autenticación JWT con:

- Login y registro de usuarios
- Validación de credenciales
- Generación y validación de tokens
- Estrategia JWT con Passport

#### Archivos a Crear/Actualizar

```
backend/src/modules/access/
├── auth.controller.ts           (ACTUALIZAR - login, register, logout)
├── auth.service.ts              (ACTUALIZAR - lógica de autenticación)
├── auth.module.ts               (ACTUALIZAR - importar ConfigModule, DatabaseModule)
├── dto/
│   ├── login.dto.ts
│   ├── register.dto.ts
│   └── auth-response.dto.ts
├── strategies/
│   └── jwt.strategy.ts           (Estrategia JWT)
├── guards/
│   ├── jwt.guard.ts             (Guard JWT)
│   └── roles.guard.ts           (Guard para validar roles)
└── decorators/
    └── roles.decorator.ts       (Decorador @Roles())
```

#### Paso 1.1: DTOs de Autenticación

**Archivo**: `backend/src/modules/access/dto/login.dto.ts`

```typescript
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**Archivo**: `backend/src/modules/access/dto/register.dto.ts`

```typescript
import { IsEmail, IsString, MinLength, IsPhoneNumber } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;
}
```

**Archivo**: `backend/src/modules/access/dto/auth-response.dto.ts`

```typescript
export class AuthResponseDto {
  access_token: string;

  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "OPERATOR" | "TECHNICIAN" | "SUPERVISOR";
  };
}
```

#### Paso 1.2: JWT Strategy

**Archivo**: `backend/src/modules/access/strategies/jwt.strategy.ts`

```typescript
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "@/config/database.config";

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "your-secret-key",
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
```

#### Paso 1.3: Guards y Decoradores

**Archivo**: `backend/src/modules/access/guards/roles.guard.ts`

```typescript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      "roles",
      context.getHandler()
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        "No tienes permiso para acceder a este recurso"
      );
    }

    return true;
  }
}
```

**Archivo**: `backend/src/modules/access/decorators/roles.decorator.ts`

```typescript
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

#### Paso 1.4: Auth Controller

**Archivo**: `backend/src/modules/access/auth.controller.ts` (ACTUALIZAR)

```typescript
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login usuario" })
  @ApiResponse({ status: 200, description: "Usuario autenticado exitosamente" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("register")
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario registrado exitosamente" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Obtener usuario actual" })
  async getCurrentUser(@Request() req) {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Cerrar sesión" })
  async logout() {
    return { message: "Sesión cerrada exitosamente" };
  }
}
```

#### Paso 1.5: Auth Service

**Archivo**: `backend/src/modules/access/auth.service.ts` (CREAR COMPLETO)

```typescript
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/config/database.config";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Email o contraseña incorrectos");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Email o contraseña incorrectos");
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        phone: registerDto.phone,
        role: "OPERATOR", // Rol por defecto
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
```

#### Paso 1.6: Auth Module

**Archivo**: `backend/src/modules/access/auth.module.ts` (ACTUALIZAR)

```typescript
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PrismaService } from "@/config/database.config";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "your-secret-key",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

---

### Fase 2: Módulo de Usuarios (Users) con CRUD

#### Objetivo

CRUD completo para gestión de usuarios con:

- Listar usuarios
- Crear usuarios
- Actualizar usuarios
- Eliminar usuarios
- Asignar roles

#### Archivos a Crear/Actualizar

```
backend/src/modules/users/
├── users.controller.ts          (CRUD endpoints)
├── users.service.ts             (CRUD logic)
├── users.module.ts
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   └── user.dto.ts
└── entities/
    └── user.entity.ts
```

#### Paso 2.1: Users DTOs

**Archivo**: `backend/src/modules/users/dto/user.dto.ts`

```typescript
export class UserDto {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "ADMIN" | "OPERATOR" | "TECHNICIAN" | "SUPERVISOR";
  createdAt: Date;
  updatedAt: Date;
}
```

**Archivo**: `backend/src/modules/users/dto/create-user.dto.ts`

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsEnum,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsPhoneNumber()
  phone: string;

  @IsEnum(["ADMIN", "OPERATOR", "TECHNICIAN", "SUPERVISOR"])
  role: string;
}
```

**Archivo**: `backend/src/modules/users/dto/update-user.dto.ts`

```typescript
import { IsOptional, IsString, IsPhoneNumber, IsEnum } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsEnum(["ADMIN", "OPERATOR", "TECHNICIAN", "SUPERVISOR"])
  role?: string;
}
```

#### Paso 2.2: Users Controller

**Archivo**: `backend/src/modules/users/users.controller.ts` (CREAR)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../access/guards/jwt.guard";
import { RolesGuard } from "../access/guards/roles.guard";
import { Roles } from "../access/decorators/roles.decorator";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Listar todos los usuarios" })
  @ApiResponse({ status: 200, description: "Lista de usuarios" })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Obtener usuario por ID" })
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Crear nuevo usuario" })
  @ApiResponse({ status: 201, description: "Usuario creado" })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Actualizar usuario" })
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Eliminar usuario" })
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
```

#### Paso 2.3: Users Service

**Archivo**: `backend/src/modules/users/users.service.ts` (CREAR)

```typescript
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/config/database.config";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("El email ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: `Usuario eliminado exitosamente` };
  }
}
```

#### Paso 2.4: Users Module

**Archivo**: `backend/src/modules/users/users.module.ts` (CREAR)

```typescript
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "@/config/database.config";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

### Fase 3: Módulo de Vehículos (Vehicles)

```
backend/src/modules/vehicles/
├── vehicles.controller.ts
├── vehicles.service.ts
├── vehicles.module.ts
├── dto/
│   ├── create-vehicle.dto.ts
│   ├── update-vehicle.dto.ts
│   └── vehicle.dto.ts
└── entities/
    └── vehicle.entity.ts
```

**Estructura similar al módulo de Usuarios con CRUD completo**

---

### Fase 4: Módulo de Mantenimiento (Maintenance)

```
backend/src/modules/maintenance/
├── maintenance.controller.ts
├── maintenance.service.ts
├── maintenance.module.ts
├── dto/
│   ├── create-maintenance.dto.ts
│   ├── update-maintenance.dto.ts
│   └── maintenance.dto.ts
└── entities/
    └── maintenance.entity.ts
```

**Con relaciones a Vehicle y Technician**

---

### Fase 5: Módulo de Diagnósticos (Diagnostics)

```
backend/src/modules/diagnostics/
├── diagnostics.controller.ts
├── diagnostics.service.ts
├── diagnostics.module.ts
├── dto/
│   ├── create-diagnostic.dto.ts
│   ├── update-diagnostic.dto.ts
│   └── diagnostic.dto.ts
└── entities/
    └── diagnostic.entity.ts
```

---

### Fase 6: Módulo de Reportes (Reports)

```
backend/src/modules/admin/
├── reports/
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   └── dto/
│       └── report.dto.ts
├── statistics/
│   ├── statistics.controller.ts
│   ├── statistics.service.ts
│   └── dto/
│       └── statistics.dto.ts
└── admin.module.ts
```

---

### Fase 7: Middleware y Guards Globales

#### Archivo: `backend/src/main.ts` (ACTUALIZAR)

```typescript
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Maintenance System API")
    .setDescription("API for vehicle maintenance system management")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  // Global prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
```

---

## 📊 Resumen de Orden de Desarrollo

### FRONTEND

1. ✅ Landing Page (Página pública)
2. ✅ Login & Registro
3. ✅ Control de Acceso por Roles (RBAC)
4. ⭐ **Navbar Dinámico por Rol** (NavbarAdmin, NavbarOperator, NavbarTechnician, NavbarSupervisor + UserMenu)
5. Dashboard General
6. Módulo Admin (Gestión de Usuarios)
7. Módulo Operator (Mantenimiento)
8. Módulo Technician (Diagnósticos)
9. Módulo Supervisor (Reportes)

### BACKEND

1. ✅ Autenticación JWT
2. CRUD Usuarios
3. CRUD Vehículos
4. CRUD Mantenimiento
5. CRUD Diagnósticos
6. Reportes y Estadísticas
7. Validación de Roles Globales

---

## 🔐 Control de Acceso por Rol

### Frontend

- `useRole()` Hook → Verifica permisos
- `RoleBasedRoute` Component → Protege rutas
- Condicionales en JSX → Muestra/oculta elementos

### Backend

- `@Roles()` Decorator → Define permisos por endpoint
- `RolesGuard` → Valida rol del usuario
- `JwtAuthGuard` → Valida token JWT

---

## 🎨 Características Clave de Interfaz

### ⭐ Navbars Personalizados por Rol

| Rol            | Menús Disponibles                                               | Descripción                       |
| -------------- | --------------------------------------------------------------- | --------------------------------- |
| **ADMIN**      | Dashboard, Gestión (Usuarios/Vehículos/Configuración), Reportes | Acceso total al sistema           |
| **OPERATOR**   | Dashboard, Mi Flota, Mantenimiento, Calendario                  | Gestión operativa de vehículos    |
| **TECHNICIAN** | Dashboard, Diagnósticos, Reparaciones, Mis Reportes             | Gestión técnica de reparaciones   |
| **SUPERVISOR** | Dashboard, Reportes, Estadísticas, Supervisión                  | Visualización y análisis de datos |

### 🎯 Componentes Comunes

- **UserMenu**: Perfil, Configuración, Cerrar Sesión (visible en todos los roles)
- **ProtectedLayout**: Wrapper que incluye Navbar + contenido principal
- **RoleBasedRoute**: Valida rol antes de renderizar página

---

## 📝 Próximas Acciones

1. **Frontend**: Crear Landing Page + Login + RoleBasedRoute + **Navbars por Rol**
2. **Backend**: Implementar Auth Module + Users CRUD
3. **Integración**: Conectar frontend login con backend auth + pruebas de navbar según rol
4. **Testing**: Verificar flujo login y navbar correcto para cada rol
5. **Módulos**: Construir CRUD para cada entidad según orden
