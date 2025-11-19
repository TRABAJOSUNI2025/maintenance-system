import { Link } from 'react-router-dom';
import { useRole } from '@/hooks/useRole';
import { NavbarAdmin } from './NavbarAdmin';
import { NavbarOperator } from './NavbarOperator';
import { NavbarTechnician } from './NavbarTechnician';
import { NavbarSupervisor } from './NavbarSupervisor';
import { UserMenu } from './UserMenu';

export const Navbar = () => {
  const { isAdmin, isOperator, isTechnician, isSupervisor } = useRole();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/10 px-4 sm:px-6 md:px-10 py-4 bg-background-dark/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-4 text-white">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-primary">
            <span className="material-symbols-outlined text-4xl">directions_car</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            AutoSystem
          </h2>
        </Link>
      </div>

      {/* Menú dinámico por rol */}
      <div className="flex-1 mx-8 hidden lg:block">
        {isAdmin && <NavbarAdmin />}
        {isOperator && !isAdmin && <NavbarOperator />}
        {isTechnician && !isAdmin && <NavbarTechnician />}
        {isSupervisor && !isAdmin && <NavbarSupervisor />}
      </div>

      {/* Menú de usuario */}
      <UserMenu />
    </header>
  );
};
