import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-white font-medium text-sm"
      >
        <span className="material-icons text-lg">account_circle</span>
        <span className="hidden sm:inline">{user?.nombres || user?.username}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-background-dark border border-white/10 rounded-lg shadow-lg min-w-56 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-white/10">
            <p className="font-bold text-white">{user?.nombres || user?.username}</p>
            <p className="text-sm text-gray-400">{user?.correo}</p>
            <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs mt-1 font-medium">
              {user?.role}
            </span>
          </div>

          {/* Menu Items */}
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-gray-300 hover:text-white text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-lg">person</span>
              Mi Perfil
            </span>
          </button>

          <button
            onClick={() => {
              navigate('/settings');
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-gray-300 hover:text-white text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-lg">settings</span>
              Configuración
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 hover:bg-red-600/20 transition-colors text-red-400 hover:text-red-300 text-sm border-t border-white/10"
          >
            <span className="flex items-center gap-2">
              <span className="material-icons text-lg">logout</span>
              Cerrar Sesión
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
