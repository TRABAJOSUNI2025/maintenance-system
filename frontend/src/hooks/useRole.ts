import { useAuth } from './useAuth';
import type { UserRole } from '@/types/auth';

export const useRole = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'ADMINISTRADOR',
    isOperator: user?.role === 'OPERARIO',
    isTechnician: user?.role === 'TRABAJADOR',
    isSupervisor: user?.role === 'SUPERVISOR',
    hasRole: (role: UserRole | UserRole[]) => {
      if (Array.isArray(role)) {
        return user && user.role ? role.includes(user.role) : false;
      }
      return user?.role === role;
    },
    canViewUsers: user?.role === 'ADMINISTRADOR',
    canViewReports: user?.role === 'ADMINISTRADOR' || user?.role === 'SUPERVISOR',
    canManageMaintenance: user?.role === 'ADMINISTRADOR' || user?.role === 'OPERARIO',
    canViewDiagnostics: user?.role !== 'OPERARIO',
  };
};
