import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { operatorApi } from '@/api/operator.api';

interface OperatorProfile {
  id: number;
  dni: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  especialidad: string;
}

interface Ticket {
  codOperarioTicket: string;
  codTicket: string;
  fecha: string;
  cliente: string;
  vehiculo: string;
  estado: string;
}

interface Maintenance {
  codMantenimiento: string;
  codTicket: string;
  fecha: string;
  cliente: string;
  vehiculo: string;
  servicio: string;
  monto: number;
  estado: string;
  observaciones: string;
}

interface Diagnostic {
  codDiagnostico: string;
  codMantenimiento: string;
  cliente: string;
  vehiculo: string;
  area: string;
  problemas: string;
  motivoDerivacion: string;
  fecha: string;
  hora: string;
}

const getStatusColor = (estado: string): string => {
  const estadoLower = estado?.toLowerCase() || '';
  if (estadoLower.includes('completado') || estadoLower.includes('completada')) return 'bg-green-500/20 text-green-400';
  if (estadoLower.includes('pendiente')) return 'bg-yellow-500/20 text-yellow-400';
  if (estadoLower.includes('cancelado') || estadoLower.includes('cancelada')) return 'bg-red-500/20 text-red-400';
  if (estadoLower.includes('proceso')) return 'bg-violet-500/20 text-violet-400';
  return 'bg-gray-500/20 text-gray-400';
};

const calculateEfficiency = (stats: any): number => {
  if (!stats || !stats.ticketsAsignados) return 0;
  const total = stats.ticketsAsignados || 1;
  const completed = stats.mantenimientosCompletados || 0;
  return Math.round((completed / total) * 100);
};

export const OperatorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'tickets' | 'detalles' | 'perfil' | null>(null);
  
  // State para datos
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile | null>(null);
  const [ticketsList, setTicketsList] = useState<Ticket[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [diagnosticsList, setDiagnostics] = useState<Diagnostic[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  const [recentWork, setRecentWork] = useState<any[]>([]);

  const doLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Cargar perfil y estadísticas al montar
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [profileData, statsData, recentData] = await Promise.all([
          operatorApi.getProfile(),
          operatorApi.getStats(),
          operatorApi.getRecentWork(),
        ]);
        setOperatorProfile(profileData.operator);
        setStats(statsData.stats);
        setRecentWork(recentData.recent || []);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, []);

  // Cargar datos según sección activa
  useEffect(() => {
    const loadSectionData = async () => {
      setLoading(true);
      try {
        switch (activeSection) {
          case 'tickets':
            const ticketsData = await operatorApi.getAssignedTickets();
            setTicketsList(ticketsData.tickets || []);
            break;
          case 'detalles':
            const [maintenanceData, diagnosticsData] = await Promise.all([
              operatorApi.getMaintenancePerformed(),
              operatorApi.getDiagnosticsPerformed(),
            ]);
            setMaintenanceList(maintenanceData.mantenimientos || []);
            setDiagnostics(diagnosticsData.diagnosticos || []);
            break;
          case 'perfil':
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeSection} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (activeSection !== null) {
      loadSectionData();
    }
  }, [activeSection]);

  return (
    <div className="flex h-screen bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col flex-shrink-0">
        {/* Profile Card */}
        <div className="p-4 border-b border-white/10">
          <div className="p-3 bg-violet-600/10 border border-violet-600/20 rounded-lg flex items-center gap-3">
            <img
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
            />
            <div>
              <p className="font-bold text-white text-sm">{operatorProfile?.nombre || user?.username}</p>
              <p className="text-xs text-gray-400">Operario</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-2 p-3">
            <li>
              <button
                onClick={() => setActiveSection('tickets')}
                className={`flex items-center p-3 rounded-lg transition-colors w-full text-left ${
                  activeSection === 'tickets'
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-lg">description</span>
                <span className="text-sm">Tickets Asignados</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('detalles')}
                className={`flex items-center p-3 rounded-lg transition-colors w-full text-left ${
                  activeSection === 'detalles'
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-lg">receipt_long</span>
                <span className="text-sm">Detalles de Ticket</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('perfil')}
                className={`flex items-center p-3 rounded-lg transition-colors w-full text-left ${
                  activeSection === 'perfil'
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-lg">person</span>
                <span className="text-sm">Mi Perfil</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-white/10 px-3 pb-4">
          <button
            onClick={doLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 flex-shrink-0 sticky top-0 z-10">
          <div className="flex items-center">
            <div className="flex items-center mr-8">
              <span className="material-symbols-outlined text-violet-600 text-3xl mr-2">directions_car</span>
              <h1 className="text-xl font-bold text-white">AutoCare OS</h1>
            </div>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
              <input
                type="text"
                placeholder="Buscar ticket, cliente..."
                className="bg-background-dark border border-white/10 rounded-lg pl-10 pr-4 py-2 w-64 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-violet-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-base">add</span>
              <span className="hidden sm:inline text-sm">Agendar Nuevo</span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <img
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover cursor-pointer border border-white/10"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
            />
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-background-dark">
          <div className="max-w-7xl mx-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando datos...</p>
                </div>
              </div>
            )}

            {/* Welcome Dashboard */}
            {!isLoading && activeSection === null && (
              <>
                <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo, {operatorProfile?.nombre || user?.username}</h2>
                <p className="text-gray-400 mb-8">Panel de control del operario. Selecciona una opción para comenzar.</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-violet-600/50 transition-colors">
                    <p className="text-gray-400 text-sm mb-2">Tickets Asignados</p>
                    <p className="text-4xl font-bold text-white">{stats?.ticketsAsignados || 0}</p>
                    <p className="text-gray-500 text-xs mt-2">Pendientes de diagnóstico</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-violet-600/50 transition-colors">
                    <p className="text-gray-400 text-sm mb-2">Mantenimientos</p>
                    <p className="text-4xl font-bold text-white">{stats?.mantenimientosCompletados || 0}</p>
                    <p className="text-gray-500 text-xs mt-2">Completados</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-violet-600/50 transition-colors">
                    <p className="text-gray-400 text-sm mb-2">Diagnósticos</p>
                    <p className="text-4xl font-bold text-white">{stats?.diagnosticosRealizados || 0}</p>
                    <p className="text-gray-500 text-xs mt-2">Realizados</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-violet-600/50 transition-colors">
                    <p className="text-gray-400 text-sm mb-2">Trabajos Recientes</p>
                    <p className="text-4xl font-bold text-white">{stats?.tareasRecientes || 0}</p>
                    <p className="text-gray-500 text-xs mt-2">Últimos 7 días</p>
                  </div>
                </div>

                {/* Quick Access */}
                <h3 className="text-xl font-bold text-white mb-4">Accesos Rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveSection('tickets')}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-violet-600 hover:bg-white/10 transition-all duration-300 text-left group"
                  >
                    <span className="material-symbols-outlined text-violet-600 text-2xl mb-2 block group-hover:scale-110 transition-transform">description</span>
                    <p className="font-semibold text-white">Tickets Asignados</p>
                    <p className="text-xs text-gray-400">Evaluar vehículos</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('detalles')}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-violet-600 hover:bg-white/10 transition-all duration-300 text-left group"
                  >
                    <span className="material-symbols-outlined text-violet-600 text-2xl mb-2 block group-hover:scale-110 transition-transform">receipt_long</span>
                    <p className="font-semibold text-white">Detalles de Trabajos</p>
                    <p className="text-xs text-gray-400">Ver historial</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('perfil')}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-violet-600 hover:bg-white/10 transition-all duration-300 text-left group"
                  >
                    <span className="material-symbols-outlined text-violet-600 text-2xl mb-2 block group-hover:scale-110 transition-transform">person</span>
                    <p className="font-semibold text-white">Mi Perfil</p>
                    <p className="text-xs text-gray-400">Información personal</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('tickets')}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-violet-600 hover:bg-white/10 transition-all duration-300 text-left group"
                  >
                    <span className="material-symbols-outlined text-violet-600 text-2xl mb-2 block group-hover:scale-110 transition-transform">build</span>
                    <p className="font-semibold text-white">Todas las Tareas</p>
                    <p className="text-xs text-gray-400">Ver más</p>
                  </button>
                </div>

                {/* Performance Chart */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6">Distribución de Trabajos</h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 flex flex-col items-center justify-center">
                      <div className="relative w-64 h-64 mb-6">
                        <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 120 120">
                          {/* Background circle */}
                          <circle
                            className="stroke-current text-white/10"
                            cx="60"
                            cy="60"
                            fill="none"
                            r="54"
                            strokeWidth="12"
                          ></circle>
                          {/* Completed progress circle */}
                          <circle
                            className="stroke-current text-violet-500 transition-all duration-700"
                            cx="60"
                            cy="60"
                            fill="none"
                            r="54"
                            strokeDasharray="339.292"
                            strokeDashoffset={339.292 - (339.292 * calculateEfficiency(stats)) / 100}
                            strokeLinecap="round"
                            strokeWidth="12"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-bold text-white">{calculateEfficiency(stats)}%</span>
                          <span className="text-gray-400 text-sm">Eficiencia</span>
                        </div>
                      </div>
                      <p className="text-center text-gray-400 max-w-sm">
                        Tasa de completación de mantenimientos. {stats?.mantenimientosCompletados || 0} de {stats?.ticketsAsignados || 0} trabajos completados.
                      </p>
                    </div>
                  </div>

                  {/* Stats Breakdown */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">Resumen de Actividad</h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Tickets Pendientes</span>
                          <span className="text-2xl font-bold text-yellow-400">{stats?.ticketsAsignados || 0}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Completados</span>
                          <span className="text-2xl font-bold text-green-400">{stats?.mantenimientosCompletados || 0}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${calculateEfficiency(stats)}%` }}></div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Diagnósticos</span>
                          <span className="text-2xl font-bold text-blue-400">{stats?.diagnosticosRealizados || 0}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400 text-sm">Recientes (7 días)</span>
                          <span className="text-2xl font-bold text-violet-400">{stats?.tareasRecientes || 0}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-violet-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Work */}
                {recentWork && recentWork.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-4">Actividad Reciente</h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-white/10 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Fecha</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Actividad</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Cliente</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {recentWork.slice(0, 5).map((work: any, idx: number) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-3 text-gray-400 text-xs">{new Date(work.fecha).toLocaleDateString()}</td>
                              <td className="px-6 py-3 text-white">{work.tipo || 'Tarea'}</td>
                              <td className="px-6 py-3 text-gray-400">{work.cliente || 'N/A'}</td>
                              <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(work.estado || '')}`}>
                                  {work.estado || 'Pendiente'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Tickets Section */}
            {!isLoading && activeSection === 'tickets' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-violet-600 text-2xl">description</span>
                  <h2 className="text-2xl font-bold text-white">Tickets Asignados para Diagnóstico</h2>
                </div>
                {ticketsList.length > 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-white/10 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">Código</th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">Cliente</th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">Vehículo</th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">Fecha</th>
                          <th className="px-6 py-3 text-left text-gray-400 font-semibold">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {ticketsList.map((ticket, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-3 text-violet-400 font-mono text-xs">{ticket.codTicket}</td>
                            <td className="px-6 py-3 text-white">{ticket.cliente}</td>
                            <td className="px-6 py-3 text-gray-400">{ticket.vehiculo}</td>
                            <td className="px-6 py-3 text-gray-400 text-xs">{new Date(ticket.fecha).toLocaleDateString()}</td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(ticket.estado)}`}>
                                {ticket.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
                    <p className="text-gray-400">No hay tickets asignados en este momento</p>
                  </div>
                )}
              </div>
            )}

            {/* Details Section */}
            {!isLoading && activeSection === 'detalles' && (
              <div className="space-y-8">
                {/* Maintenance */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-violet-600 text-2xl">build</span>
                    <h2 className="text-2xl font-bold text-white">Mantenimientos Realizados</h2>
                  </div>
                  {maintenanceList.length > 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-white/10 border-b border-white/10">
                          <tr>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Código</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Cliente</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Vehículo</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Servicio</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Monto</th>
                            <th className="px-6 py-3 text-left text-gray-400 font-semibold">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {maintenanceList.map((m, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-3 text-violet-400 font-mono text-xs">{m.codMantenimiento}</td>
                              <td className="px-6 py-3 text-white">{m.cliente}</td>
                              <td className="px-6 py-3 text-gray-400">{m.vehiculo}</td>
                              <td className="px-6 py-3 text-gray-400">{m.servicio}</td>
                              <td className="px-6 py-3 text-violet-400 font-semibold">S/. {m.monto.toFixed(2)}</td>
                              <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(m.estado)}`}>
                                  {m.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                      <p className="text-gray-400">No hay mantenimientos registrados</p>
                    </div>
                  )}
                </div>

                {/* Diagnostics */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-violet-600 text-2xl">search</span>
                    <h2 className="text-2xl font-bold text-white">Diagnósticos Realizados</h2>
                  </div>
                  {diagnosticsList.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {diagnosticsList.map((diag, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-violet-600/50 transition-colors">
                          <h3 className="font-bold text-white mb-2">{diag.cliente}</h3>
                          <p className="text-violet-400 text-xs font-mono mb-3">{diag.codDiagnostico}</p>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Vehículo</p>
                              <p className="text-white">{diag.vehiculo}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Área</p>
                              <p className="text-white">{diag.area}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Problemas</p>
                              <p className="text-gray-400">{diag.problemas}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Fecha</p>
                              <p className="text-white">{new Date(diag.fecha).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                      <p className="text-gray-400">No hay diagnósticos registrados</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Section */}
            {!isLoading && activeSection === 'perfil' && operatorProfile && (
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-violet-600 text-2xl">person</span>
                  <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Nombre</p>
                      <p className="text-white font-semibold text-lg">{operatorProfile.nombre}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Apellido Paterno</p>
                      <p className="text-white font-semibold text-lg">{operatorProfile.apellidoPaterno}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Apellido Materno</p>
                      <p className="text-white font-semibold text-lg">{operatorProfile.apellidoMaterno}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">DNI</p>
                      <p className="text-white font-semibold text-lg">{operatorProfile.dni}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Teléfono</p>
                      <p className="text-white font-semibold text-lg">{operatorProfile.telefono || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Especialidad</p>
                      <p className="text-white font-semibold text-lg">{operatorProfile.especialidad || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
