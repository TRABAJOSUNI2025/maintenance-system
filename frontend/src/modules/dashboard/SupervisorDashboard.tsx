import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/components/Navbar/UserMenu';

type SupervisorSection = 'reporteTickets' | 'consultaCliente' | 'reporteVehiculos' | 'consultaMantenimiento' | 'protocolos' | 'validacion';

export const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SupervisorSection>('reporteTickets');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'reporteTickets', label: 'Reporte de Tickets', icon: 'description' },
    { id: 'consultaCliente', label: 'Consulta de Clientes', icon: 'person' },
    { id: 'reporteVehiculos', label: 'Reporte de Vehículos', icon: 'directions_car' },
    { id: 'consultaMantenimiento', label: 'Consulta Mantenimiento', icon: 'build' },
    { id: 'protocolos', label: 'Protocolos', icon: 'assignment' },
    { id: 'validacion', label: 'Validación de Servicios', icon: 'task_alt' },
  ];

  const tickets = [
    { cod: 'T001', servicio: 'S0001', rampa: 'Z0001', fecha: '2025-01-10', hora: '08:30', precio: '150.00' },
    { cod: 'T002', servicio: 'S0002', rampa: 'Z0002', fecha: '2025-01-11', hora: '10:00', precio: '200.00' },
    { cod: 'T003', servicio: 'S0003', rampa: 'Z0003', fecha: '2025-01-12', hora: '14:15', precio: '175.50' },
    { cod: 'T004', servicio: 'S0004', rampa: 'Z0004', fecha: '2025-01-13', hora: '09:45', precio: '300.00' },
    { cod: 'T005', servicio: 'S0005', rampa: 'Z0005', fecha: '2025-01-14', hora: '11:30', precio: '250.00' },
    { cod: 'T006', servicio: 'S0006', rampa: 'Z0006', fecha: '2025-01-15', hora: '16:00', precio: '180.75' },
    { cod: 'T007', servicio: 'S0007', rampa: 'Z0007', fecha: '2025-01-16', hora: '13:20', precio: '220.00' },
    { cod: 'T008', servicio: 'S0008', rampa: 'Z0008', fecha: '2025-01-17', hora: '15:45', precio: '190.50' },
    { cod: 'T009', servicio: 'S0009', rampa: 'Z0009', fecha: '2025-01-18', hora: '08:00', precio: '260.00' },
    { cod: 'T010', servicio: 'S0010', rampa: 'Z0010', fecha: '2025-01-19', hora: '17:10', precio: '210.00' },
  ];

  return (
    <div className="flex h-screen bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col flex-shrink-0">
        {/* Profile Section */}
        <div className="p-4 border-b border-white/10">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
            <img
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
            />
            <div>
              <p className="font-bold text-white text-sm">{user?.nombres || user?.username}</p>
              <p className="text-xs text-gray-400">Supervisor</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-2 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id as SupervisorSection)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-icons text-base">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
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
        <header className="sticky top-0 z-10 bg-background-dark/80 backdrop-blur-sm border-b border-white/10 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="material-icons text-primary text-2xl">directions_car</span>
              <h1 className="text-xl font-bold text-white">AutoSystem</h1>
            </div>
            <div className="relative hidden sm:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">search</span>
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeSection === 'reporteTickets' && 'Reporte de Tickets Asignados'}
                {activeSection === 'consultaCliente' && 'Consulta de Clientes'}
                {activeSection === 'reporteVehiculos' && 'Reporte de Vehículos'}
                {activeSection === 'consultaMantenimiento' && 'Consulta de Mantenimiento'}
                {activeSection === 'protocolos' && 'Protocolos'}
                {activeSection === 'validacion' && 'Validación de Servicios'}
              </h2>
              <p className="text-gray-400 text-sm">
                {activeSection === 'reporteTickets' && 'Visualiza todos los tickets y su estado'}
                {activeSection === 'consultaCliente' && 'Busca y consulta información de clientes'}
                {activeSection === 'reporteVehiculos' && 'Visualiza el reporte de vehículos registrados'}
                {activeSection === 'consultaMantenimiento' && 'Consulta el registro de mantenimientos realizados'}
                {activeSection === 'protocolos' && 'Gestiona los protocolos de servicio'}
                {activeSection === 'validacion' && 'Valida y aprueba servicios completados'}
              </p>
            </div>

            {/* Reporte Tickets Section */}
            {activeSection === 'reporteTickets' && (
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Ticket</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Servicio</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Rampa</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Fecha</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Hora</th>
                        <th className="px-4 py-3 text-right text-gray-300 font-semibold text-xs uppercase">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {tickets.map((ticket, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white text-sm">{ticket.cod}</td>
                          <td className="px-4 py-3 text-white text-sm">{ticket.servicio}</td>
                          <td className="px-4 py-3 text-white text-sm">{ticket.rampa}</td>
                          <td className="px-4 py-3 text-white text-sm">{ticket.fecha}</td>
                          <td className="px-4 py-3 text-white text-sm">{ticket.hora}</td>
                          <td className="px-4 py-3 text-right text-primary font-medium text-sm">${ticket.precio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 border-t border-white/10 bg-white/5">
                  <p className="text-sm text-gray-400">Mostrando 1-10 de {tickets.length} tickets</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors font-medium text-sm">
                      Atrás
                    </button>
                    <button className="px-4 py-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors font-medium text-sm">
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Consulta Clientes Section */}
            {activeSection === 'consultaCliente' && (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Buscar Clientes</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Buscar por DNI o nombre..."
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                    <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                      Buscar
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">DNI</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Nombre</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Teléfono</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Correo</th>
                          <th className="px-4 py-3 text-center text-gray-300 font-semibold text-xs uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white text-sm">12345678</td>
                          <td className="px-4 py-3 text-white text-sm">Juan Pérez</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">987654321</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">juan@gmail.com</td>
                          <td className="px-4 py-3 text-center">
                            <button className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors text-sm">
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Reporte Vehículos Section */}
            {activeSection === 'reporteVehiculos' && (
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Placa</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Marca</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Modelo</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Propietario</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Fecha Registro</th>
                        <th className="px-4 py-3 text-center text-gray-300 font-semibold text-xs uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-white text-sm font-medium">ABC123</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">Toyota</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">Corolla</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">Juan Pérez</td>
                        <td className="px-4 py-3 text-gray-300 text-sm">2025-01-15</td>
                        <td className="px-4 py-3 text-center">
                          <button className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors text-sm">
                            Ver Historial
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Consulta Mantenimiento Section */}
            {activeSection === 'consultaMantenimiento' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Mantenimientos</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">256</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Pendientes</p>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">12</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Completados</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">244</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Código</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Vehículo</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Tipo</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Fecha</th>
                          <th className="px-4 py-3 text-left text-gray-300 font-semibold text-xs uppercase">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white text-sm">MAN00001</td>
                          <td className="px-4 py-3 text-white text-sm">Toyota Corolla</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">Preventivo</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">2025-01-15</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">Completado</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Protocolos Section */}
            {activeSection === 'protocolos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">Protocolo Frenos</h3>
                    <span className="material-icons text-yellow-400 text-sm">build</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Revisión y reemplazo de pastillas, discos y líquido de frenos.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs hover:bg-blue-500/20 transition-colors">
                      Ver
                    </button>
                    <button className="flex-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs hover:bg-purple-500/20 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">Protocolo Motor</h3>
                    <span className="material-icons text-green-400 text-sm">settings</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Inspección de aceite, filtros, bujías y sistema de refrigeración.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs hover:bg-blue-500/20 transition-colors">
                      Ver
                    </button>
                    <button className="flex-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs hover:bg-purple-500/20 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">Protocolo Suspensión</h3>
                    <span className="material-icons text-blue-400 text-sm">directions_car</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Inspección de amortiguadores, rótulas y alineamiento.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs hover:bg-blue-500/20 transition-colors">
                      Ver
                    </button>
                    <button className="flex-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs hover:bg-purple-500/20 transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Validación Section */}
            {activeSection === 'validacion' && (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white/5 border border-white/10 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">Servicio #{item}</p>
                      <p className="text-sm text-gray-400">Toyota Corolla - Cambio de Aceite</p>
                      <p className="text-xs text-primary mt-1">Completado - Pendiente de aprobación</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors text-sm">
                        Rechazar
                      </button>
                      <button className="px-3 py-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors text-sm">
                        Aprobar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
