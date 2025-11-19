import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '@/api/admin.api';

interface DashboardStats {
  totals: {
    users: number;
    vehicles: number;
    maintenance: number;
    diagnostics: number;
    tickets: number;
  };
  monthlyTotals?: {
    maintenance: number;
    diagnostics: number;
    tickets: number;
    month: number;
  };
  maintenanceByStatus: Array<{ status: string; count: number }>;
  ticketsByStatus: Array<{ status: string; count: number }>;
  recentActivities: Array<any>;
  monthlyTickets?: {
    year: number;
    data: number[];
    total: number;
    months: string[];
  };
}

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expandedMenuIds, setExpandedMenuIds] = useState<Set<string>>(new Set());
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setLoading] = useState(false);

  const doLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Cargar datos del dashboard al inicio
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await adminApi.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const toggleMenu = (menuId: string) => {
    const newSet = new Set(expandedMenuIds);
    if (newSet.has(menuId)) {
      newSet.delete(menuId);
    } else {
      newSet.add(menuId);
    }
    setExpandedMenuIds(newSet);
  };

  const getMaintenancePercentage = () => {
    if (!dashboardStats || dashboardStats.totals.maintenance === 0) return 0;
    const finalized = dashboardStats.maintenanceByStatus
      .find(s => String(s.status).toLowerCase() === 'finalizado')?.count || 0;
    return Math.round((finalized / dashboardStats.totals.maintenance) * 100);
  };

  const CircularProgressChart = ({ percentage, label, color }: { percentage: number; label: string; color: string }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-white">{percentage}%</span>
            <span className="text-sm text-gray-400">{label}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col flex-shrink-0">
        {/* Profile Section */}
        <div className="p-4 border-b border-white/10">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
            <img
              alt={`Avatar de ${user?.username || 'admin'}`}
              className="w-12 h-12 rounded-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'admin'}`}
            />
            <div>
              <p className="font-bold text-white text-sm">{user?.username || 'Administrador'}</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-2 py-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="material-icons flex-shrink-0">bar_chart</span>
                <span>Estadísticas</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="material-icons flex-shrink-0">history_toggle_off</span>
                <span>Generación de tickets</span>
              </a>
            </li>
            <li>
              <button
                onClick={() => toggleMenu('maintenance')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
              >
                <span className="material-icons flex-shrink-0">build_circle</span>
                <span className="flex-1">Mantenimiento parámetros</span>
                <span className={`material-icons text-sm flex-shrink-0 transition-transform ${expandedMenuIds.has('maintenance') ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {expandedMenuIds.has('maintenance') && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">description</span>
                      <span>Políticas</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">rule</span>
                      <span>Reglas</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">schema</span>
                      <span>Protocolos</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <button
                onClick={() => toggleMenu('catalogs')}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-left"
              >
                <span className="material-icons flex-shrink-0">grid_view</span>
                <span className="flex-1">Catálogos</span>
                <span className={`material-icons text-sm flex-shrink-0 transition-transform ${expandedMenuIds.has('catalogs') ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {expandedMenuIds.has('catalogs') && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">build</span>
                      <span>Componentes</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">local_offer</span>
                      <span>Marcas</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">construction</span>
                      <span>Herramientas</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">place</span>
                      <span>Zonas</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">assignment</span>
                      <span>Actividades</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">build_circle</span>
                      <span>Tipos de Mantenimiento</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">group</span>
                      <span>Personal</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center gap-3 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <span className="material-icons text-xs flex-shrink-0">miscellaneous_services</span>
                      <span>Servicios</span>
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={doLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
          >
            <span className="material-icons text-base">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12.7171 7.21711C12.4242 6.92421 11.9493 6.92421 11.6564 7.21711L7.21705 11.6564C6.92416 11.9493 6.92416 12.4242 7.21705 12.7171C7.50995 13.0099 7.98482 13.0099 8.27772 12.7171L11.1818 9.81295V16.5C11.1818 16.9142 11.5176 17.25 11.9318 17.25C12.346 17.25 12.6818 16.9142 12.6818 16.5V9.81295L15.5859 12.7171C15.8788 13.0099 16.3537 13.0099 16.6466 12.7171C16.9395 12.4242 16.9395 11.9493 16.6466 11.6564L12.7171 7.21711Z" fillRule="evenodd"></path>
              </svg>
              <h1 className="text-xl font-bold text-white">AutoCare OS</h1>
            </div>
            <div className="relative hidden sm:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
              Nuevo Ticket
            </button>
            <img
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-slate-700"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'admin'}`}
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando datos...</p>
                </div>
              </div>
            )}

            {/* Dashboard Home */}
            {!isLoading && dashboardStats && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo, {user?.username}</h2>
                  <p className="text-gray-400">Este es tu panel de control. Selecciona una opción del menú para comenzar.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  {/* Total Cards - Sin color */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Total Usuarios</p>
                    <p className="text-3xl font-bold text-white">{dashboardStats.totals.users}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Total Vehículos</p>
                    <p className="text-3xl font-bold text-white">{dashboardStats.totals.vehicles}</p>
                  </div>
                </div>

                {/* Monthly Stats Cards - Con colores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Monthly Maintenance - Blue */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-blue-200">
                        Mantenimientos ({dashboardStats.monthlyTotals?.month ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][dashboardStats.monthlyTotals.month - 1] : 'Mes'})
                      </p>
                      <span className="text-blue-400 text-xl">🔧</span>
                    </div>
                    <p className="text-3xl font-bold text-cyan-400">{dashboardStats.monthlyTotals?.maintenance || 0}</p>
                  </div>

                  {/* Monthly Diagnostics - Green */}
                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-lg p-4 hover:border-green-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-green-200">
                        Diagnósticos ({dashboardStats.monthlyTotals?.month ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][dashboardStats.monthlyTotals.month - 1] : 'Mes'})
                      </p>
                      <span className="text-green-400 text-xl">🔍</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">{dashboardStats.monthlyTotals?.diagnostics || 0}</p>
                  </div>

                  {/* Monthly Tickets - Orange/Red */}
                  <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-orange-200">
                        Tickets ({dashboardStats.monthlyTotals?.month ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][dashboardStats.monthlyTotals.month - 1] : 'Mes'})
                      </p>
                      <span className="text-orange-400 text-xl">🎫</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-400">{dashboardStats.monthlyTotals?.tickets || 0}</p>
                  </div>

                  {/* Total Maintenance - All Time Stats */}
                  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-purple-200">Total Mantenimientos</p>
                      <span className="text-purple-400 text-xl">📊</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{dashboardStats.totals.maintenance}</p>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {/* Total Diagnostics - All Time */}
                  <div className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 border border-teal-500/30 rounded-lg p-4 hover:border-teal-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-teal-200">Total Diagnósticos</p>
                      <span className="text-teal-400 text-xl">📋</span>
                    </div>
                    <p className="text-3xl font-bold text-teal-400">{dashboardStats.totals.diagnostics}</p>
                  </div>

                  {/* Total Tickets - All Time */}
                  <div className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 border border-rose-500/30 rounded-lg p-4 hover:border-rose-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-rose-200">Total Tickets</p>
                      <span className="text-rose-400 text-xl">🎯</span>
                    </div>
                    <p className="text-3xl font-bold text-rose-400">{dashboardStats.totals.tickets}</p>
                  </div>

                  {/* Maintenance by Status Summary */}
                  <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/40 border border-amber-500/30 rounded-lg p-4 hover:border-amber-500/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-amber-200">Estados Activos</p>
                      <span className="text-amber-400 text-xl">⚡</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">{dashboardStats.maintenanceByStatus.length}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bar Chart - Tickets por Mes */}
                  <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Tickets por Mes - {dashboardStats.monthlyTickets?.year}
                      </h3>
                      <div className="text-sm text-gray-400">
                        Total: {dashboardStats.monthlyTickets?.total || 0} tickets
                      </div>
                    </div>
                    <div className="h-80 flex gap-2 sm:gap-4 items-end">
                      <div className="h-full flex flex-col justify-between w-10 text-right text-xs text-gray-500">
                        <span>{Math.max(...(dashboardStats.monthlyTickets?.data || [0])) || 10}</span>
                        <span>{Math.max(...(dashboardStats.monthlyTickets?.data || [0])) * 0.75 || 7}</span>
                        <span>{Math.max(...(dashboardStats.monthlyTickets?.data || [0])) * 0.5 || 5}</span>
                        <span>{Math.max(...(dashboardStats.monthlyTickets?.data || [0])) * 0.25 || 2}</span>
                        <span>0</span>
                      </div>
                      <div className="flex-1 h-full grid gap-1 sm:gap-2 border-l border-dashed border-slate-700 pl-2" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                        {(dashboardStats.monthlyTickets?.data || Array(12).fill(0)).map((count, idx) => {
                          const maxValue = Math.max(...(dashboardStats.monthlyTickets?.data || [1]));
                          const percentage = (count / (maxValue || 1)) * 100;
                          const monthName = dashboardStats.monthlyTickets?.months[idx] || '';
                          
                          // Colores intercalados o gradiente
                          const colors = [
                            'bg-blue-500',
                            'bg-cyan-500',
                            'bg-blue-500',
                            'bg-cyan-500',
                            'bg-blue-500',
                            'bg-cyan-500',
                            'bg-blue-500',
                            'bg-cyan-500',
                            'bg-blue-500',
                            'bg-cyan-500',
                            'bg-blue-500',
                            'bg-cyan-500',
                          ];
                          
                          const barColor = colors[idx % colors.length];
                          
                          return (
                            <div key={idx} className="flex flex-col items-center justify-end group">
                              <div className="relative w-full flex-1 flex items-end justify-center">
                                <div
                                  className={`w-full ${barColor} rounded-t-sm group-hover:opacity-75 transition-opacity`}
                                  style={{ height: `${percentage}%`, minHeight: count > 0 ? '4px' : '0' }}
                                  title={`${monthName}: ${count} tickets`}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-2">{monthName.substring(0, 3)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Circular Chart */}
                  <div className="bg-white/5 border border-green-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 text-center">Estado de Mantenimientos</h3>
                    <CircularProgressChart
                      percentage={getMaintenancePercentage()}
                      label="Finalizados"
                      color="#10b981"
                    />
                    <div className="w-full space-y-2 mt-6">
                      {dashboardStats.maintenanceByStatus && dashboardStats.maintenanceByStatus.length > 0 ? (
                        dashboardStats.maintenanceByStatus.map((item, idx) => {
                          // Color mapping for each status
                          const statusColors: Record<string, string> = {
                            'Pendiente': 'bg-yellow-500/20',
                            'Diagnosticado': 'bg-blue-500/20',
                            'Ejecución': 'bg-purple-500/20',
                            'Finalizado': 'bg-green-500/20',
                            'En Revisión': 'bg-orange-500/20',
                            'Cancelado': 'bg-red-500/20',
                          };
                          
                          const bgColor = statusColors[item.status] || 'bg-gray-500/20';
                          
                          return (
                            <div key={idx} className={`${bgColor} border border-white/10 rounded p-2 flex justify-between items-center text-sm`}>
                              <div className="flex items-center">
                                <span className="text-gray-300">{item.status}</span>
                              </div>
                              <span className="font-medium text-white">{item.count}</span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-400 py-4">
                          <p>No hay datos disponibles</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
