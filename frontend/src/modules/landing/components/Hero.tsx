import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 px-4 min-h-screen flex items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 z-0"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDDWcJbZ-5yqhSttr1NLZKmMtzp6j_xZ9fGNEeOWRTsbBp4AQnfNpFUFvopxi7Bliy1bSHZCKC18R0qpPxdVtOmg8lX_uid_k2ntXAlrocNSUIV7RGHi1M2XGWz2s5X1juOgc3buVjsa6LLCZ89ZvekXaSibWdzPdViaukSSL50zH_FtIHWizhwfXmUw8Pi6tneUPhXofCnLNcTHbna5QlCVTN9LSyQpz9XJJaI0g20FRC6E2J6F8h-V4bc2hoePJv46OAXoIjM0Q")',
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl">
            El Futuro del Mantenimiento de tu Vehículo
          </h1>
          <p className="text-gray-300 text-base font-normal leading-normal max-w-2xl sm:text-lg">
            Toma el control con diagnósticos predictivos y gestión inteligente de servicios.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <Link
              to="/register"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              Registrarse
            </Link>
            <Link
              to="/login"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-white/10 backdrop-blur-sm text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-white/20 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
