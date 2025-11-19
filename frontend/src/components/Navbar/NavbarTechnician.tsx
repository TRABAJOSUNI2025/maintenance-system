import { Link } from 'react-router-dom';

export const NavbarTechnician = () => {
  return (
    <ul className="flex gap-6 items-center list-none">
      <li>
        <Link
          to="/dashboard"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Dashboard
        </Link>
      </li>
      <li>
        <Link
          to="/diagnostics"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">diagnostics</span>
          🔍 Diagnósticos
        </Link>
      </li>
      <li>
        <Link
          to="/technician/repairs"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">build_circle</span>
          🔨 Reparaciones
        </Link>
      </li>
      <li>
        <Link
          to="/technician/reports"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">assessment</span>
          📋 Mis Reportes
        </Link>
      </li>
    </ul>
  );
};
