import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Pages
import { LandingPage } from '@/modules/landing/LandingPage';
import { LoginPage } from '@/modules/access/LoginPage';
import { RegisterPage } from '@/modules/access/RegisterPage';
import { ClientDashboard } from '@/modules/client/ClientDashboard';
import { OperatorDashboard } from '@/modules/operator/OperatorDashboard';
import { AdminDashboard } from '@/modules/admin/AdminDashboard';
import { SupervisorDashboard } from '@/modules/dashboard/SupervisorDashboard';
import { RoleBasedRoute } from './RoleBasedRoute';

// Placeholder pages
const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMINISTRADOR') {
    return <AdminDashboard />;
  }
  if (user?.role === 'OPERARIO') {
    return <OperatorDashboard />;
  }
  if (user?.role === 'SUPERVISOR') {
    return <SupervisorDashboard />;
  }
  return <ClientDashboard />;
};

const UnauthorizedPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-background-dark">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Acceso Denegado</h1>
      <p className="text-gray-400 mb-6">No tienes permisos para acceder a esta página</p>
      <a
        href="/dashboard"
        className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
      >
        Volver al Dashboard
      </a>
    </div>
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <RoleBasedRoute allowedRoles={['ADMINISTRADOR', 'OPERARIO', 'SUPERVISOR', 'CLIENTE']}>
        <DashboardRouter />
      </RoleBasedRoute>
    ),
  },
  // ADMIN ROUTES
  {
    path: '/admin/users',
    element: (
      <RoleBasedRoute allowedRoles={['ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Admin Users (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/admin/vehicles',
    element: (
      <RoleBasedRoute allowedRoles={['ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Admin Vehicles (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <RoleBasedRoute allowedRoles={['ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Admin Settings (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/admin/reports',
    element: (
      <RoleBasedRoute allowedRoles={['ADMINISTRADOR', 'SUPERVISOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Admin Reports (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  // OPERATOR ROUTES
  {
    path: '/operator/vehicles',
    element: (
      <RoleBasedRoute allowedRoles={['OPERARIO', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Operator Vehicles (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/operator/maintenance',
    element: (
      <RoleBasedRoute allowedRoles={['OPERARIO', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Operator Maintenance (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/operator/schedule',
    element: (
      <RoleBasedRoute allowedRoles={['OPERARIO', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Operator Schedule (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  // TECHNICIAN ROUTES
  {
    path: '/diagnostics',
    element: (
      <RoleBasedRoute allowedRoles={['OPERARIO', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Diagnostics (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/technician/repairs',
    element: (
      <RoleBasedRoute allowedRoles={['OPERARIO', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Technician Repairs (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/technician/reports',
    element: (
      <RoleBasedRoute allowedRoles={['OPERARIO', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Technician Reports (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  // SUPERVISOR ROUTES
  {
    path: '/supervisor/reports',
    element: (
      <RoleBasedRoute allowedRoles={['SUPERVISOR', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Supervisor Reports (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/supervisor/statistics',
    element: (
      <RoleBasedRoute allowedRoles={['SUPERVISOR', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Supervisor Statistics (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  {
    path: '/supervisor/overview',
    element: (
      <RoleBasedRoute allowedRoles={['SUPERVISOR', 'ADMINISTRADOR']}>
        <div className="flex items-center justify-center min-h-screen bg-background-dark text-white">Supervisor Overview (En desarrollo)</div>
      </RoleBasedRoute>
    ),
  },
  // ERROR ROUTES
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-background-dark">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6">Página no encontrada</p>
          <a
            href="/"
            className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    ),
  },
];

export const router = createBrowserRouter(routes);
