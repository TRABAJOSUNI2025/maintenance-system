import { Link } from 'react-router-dom';

export const NavbarAdmin = () => {
  return (
    <ul className="flex gap-6 items-center list-none">
      <li>
        <Link
          to="/dashboard"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white"
        >
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Dashboard
          </span>
        </Link>
      </li>
      <li className="relative group">
        <button className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1">
          <span className="material-symbols-outlined text-lg">manage_accounts</span>
          Gestión
        </button>
        <div className="hidden group-hover:block absolute left-0 bg-background-dark border border-white/10 rounded-lg shadow-lg min-w-48 z-50">
          <Link
            to="/admin/users"
            className="block px-4 py-2 hover:bg-white/5 w-full text-left text-gray-300 hover:text-white text-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">people</span>
              👥 Usuarios
            </span>
          </Link>
          <Link
            to="/admin/vehicles"
            className="block px-4 py-2 hover:bg-white/5 w-full text-left text-gray-300 hover:text-white text-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">directions_car</span>
              🚙 Vehículos
            </span>
          </Link>
          <Link
            to="/admin/settings"
            className="block px-4 py-2 hover:bg-white/5 w-full text-left text-gray-300 hover:text-white text-sm transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">settings</span>
              ⚙️ Configuración
            </span>
          </Link>
        </div>
      </li>
      <li>
        <Link
          to="/admin/reports"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">assessment</span>
          📊 Reportes
        </Link>
      </li>
    </ul>
  );
};
