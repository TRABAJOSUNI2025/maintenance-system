import { Link } from 'react-router-dom';

export const NavbarOperator = () => {
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
          to="/operator/vehicles"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">directions_car</span>
          Mi Flota
        </Link>
      </li>
      <li>
        <Link
          to="/operator/maintenance"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">build</span>
          🔧 Mantenimiento
        </Link>
      </li>
      <li>
        <Link
          to="/operator/schedule"
          className="hover:text-primary transition-colors text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-lg">event_note</span>
          📅 Calendario
        </Link>
      </li>
    </ul>
  );
};
