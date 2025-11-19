import { Link } from 'react-router-dom';

export const NavbarSupervisor = () => {
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
          to="/supervisor/reports"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">assessment</span>
          📊 Reportes
        </Link>
      </li>
      <li>
        <Link
          to="/supervisor/statistics"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">trending_up</span>
          📈 Estadísticas
        </Link>
      </li>
      <li>
        <Link
          to="/supervisor/overview"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">visibility</span>
          👁️ Supervisión
        </Link>
      </li>
    </ul>
  );
};
