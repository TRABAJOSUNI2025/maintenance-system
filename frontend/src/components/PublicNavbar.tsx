import { Link } from 'react-router-dom';

export const PublicNavbar = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/10 px-4 sm:px-6 md:px-10 py-4 bg-background-dark/80 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center gap-4 text-white">
        <div className="text-primary">
          <span className="material-icons text-4xl">directions_car</span>
        </div>
        <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
          AutoSystem
        </h2>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:flex items-center gap-6">
        <a
          href="#features"
          className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          Características
        </a>
        <a
          href="#about"
          className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          Nosotros
        </a>
      </nav>

      {/* Auth Buttons */}
      <div className="flex gap-2">
        <Link
          to="/login"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/40 transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
        >
          Registrarse
        </Link>
      </div>
    </header>
  );
};
