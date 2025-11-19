export const Features = () => {
  const features = [
    {
      icon: 'build_circle',
      title: 'Mantenimiento Predictivo',
      description: 'Recibe alertas impulsadas por IA antes de que ocurran los problemas, ahorrando tiempo y dinero.',
    },
    {
      icon: 'history',
      title: 'Historial Digital Completo',
      description: 'Accede a todos los registros de servicio de tu vehículo al instante y desde cualquier lugar.',
    },
    {
      icon: 'event_available',
      title: 'Citas Automatizadas',
      description: 'Agenda citas con mecánicos certificados de forma rápida y sencilla a través de la app.',
    },
  ];

  return (
    <section className="px-4 py-16 sm:py-24 max-w-7xl mx-auto" id="features">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-white tracking-tight text-3xl font-bold leading-tight sm:text-4xl sm:font-black sm:leading-tight sm:tracking-[-0.033em] max-w-3xl mx-auto">
            Características Clave
          </h1>
          <p className="text-gray-400 text-base font-normal leading-normal max-w-2xl mx-auto">
            Descubre cómo nuestra plataforma revoluciona el cuidado de tu automóvil.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all"
            >
              {/* Icon */}
              <div className="text-primary">
                <span className="material-icons text-4xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <h2 className="text-white text-lg font-bold leading-tight">{feature.title}</h2>
                <p className="text-gray-400 text-sm font-normal leading-normal">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
