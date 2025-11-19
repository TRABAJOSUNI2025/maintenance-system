import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '@/components/Navbar/UserMenu';
import { clientApi } from '@/api/client.api';

interface ClientProfile {
  nombre: string;
  apellidoPaterno: string;
  correo: string;
  dnicliente: string;
  apepaterno: string;
  apematerno: string;
  telefono: string;
  codcuentacliente: string;
  totalpendientes: number;
  totalcancelados: number;
  totalrealizados: number;
}

interface Vehicle {
  codVehiculo: string;
  placa: string;
  marca: string;
  modelo: string;
  serviciosPendientes: number;
  serviciosRealizados: number;
  kilometraje: string;
  fechafabricacion: string;
}

interface Diagnostic {
  codDiagnostico: string;
  vehiculo: string;
  area: string;
  problemas: string;
  fecha: string;
}

interface DiagnosticRequested {
  codTicket: string;
  fecha: string;
  horainicio: string;
  horafin: string;
  estado: string;
  vehiculo: string;
  rampa: string;
  supervisor: string;
  operario: string;
  loteTicket: string;
}

interface CorrectiveService {
  codservicio: string;
  descripcion: string;
  tipomantenimiento: string;
  tarifa: number;
  duracion: number;
  marca: string;
  modelo: string;
}

interface RecentServiceItem {
  id: string;
  vehiculo: string;
  status: string;
}

export const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'profile' | 'registerVehicle' | 'vehicles' | 'correctivo' | 'preventivo' | 'diagnostics' | 'diagnosticsRequested' | 'terms' | 'vehicleHistory' | 'serviceRequest' | null>(null);
  
  // Estado para los datos
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [diagnosticsList, setDiagnostics] = useState<Diagnostic[]>([]);
  const [diagnosticsRequestedList, setDiagnosticsRequested] = useState<DiagnosticRequested[]>([]);
  const [recentServicesList, setRecentServices] = useState<RecentServiceItem[]>([]);
  const [isLoading, setLoading] = useState(false);

  // Estado para filtrado de diagnósticos solicitados
  const [selectedVehicleForDiagnostics, setSelectedVehicleForDiagnostics] = useState<Vehicle | null>(null);
  const [filteredDiagnosticsRequested, setFilteredDiagnosticsRequested] = useState<DiagnosticRequested[]>([]);

  // Estado para servicios correctivos
  const [correctiveServicesList, setCorrectiveServices] = useState<CorrectiveService[]>([]);
  const [selectedCorrectiveService, setSelectedCorrectiveService] = useState<string>('');
  const [showCorrectiveServiceDetails, setShowCorrectiveServiceDetails] = useState(false);
  const [selectedCorrectiveServiceData, setSelectedCorrectiveServiceData] = useState<CorrectiveService | null>(null);
  const [correctiveServiceDates, setCorrectiveServiceDates] = useState<{ [key: string]: { fecha: string; hora: string } }>({});
  const [correctiveServiceOperario, setCorrectiveServiceOperario] = useState<{ [key: string]: any }>({});

  // Estado para servicios preventivos
  const [selectedPreventiveVehicle, setSelectedPreventiveVehicle] = useState<Vehicle | null>(null);
  const [preventiveSearchDate, setPreventiveSearchDate] = useState<string>('');
  const [availablePreventiveSchedules, setAvailablePreventiveSchedules] = useState<any[]>([]);
  const [selectedPreventiveSchedule, setSelectedPreventiveSchedule] = useState<any>(null);
  const [isLoadingPreventiveSchedules, setIsLoadingPreventiveSchedules] = useState(false);
  const [preventiveKilometraje, setPreventiveKilometraje] = useState<number>(0);

  // Estado para modal de detalles de reserva preventivo
  const [showPreventiveReservationDetails, setShowPreventiveReservationDetails] = useState(false);
  const [preventiveReservationData, setPreventiveReservationData] = useState<any>({});

  // Estado para el formulario de registro de vehículos
  const [vehicleForm, setVehicleForm] = useState({
    placa: '',
    marca: '',
    modelo: '',
    fechafabricacion: '',
    kilometraje: 0,
  });
  const [isSubmittingVehicle, setSubmittingVehicle] = useState(false);
  const [vehicleMessage, setVehicleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estado para editar perfil
  const [isEditingProfile, setEditingProfile] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    nombre: '',
    apepaterno: '',
    apematerno: '',
    telefono: '',
    correo: '',
  });
  const [isSubmittingProfile, setSubmittingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estado para el modal de solicitar servicio
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);

  // Estado para la sección de diagnóstico
  const [selectedDateForDiagnostic, setSelectedDateForDiagnostic] = useState<string>('');
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);

  // Estado para el modal de detalles de reserva
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [reservationData, setReservationData] = useState<{
    codticket?: string;
    marca?: string;
    modelo?: string;
    fechafabricacion?: string;
    tipoServicio?: string;
    precio?: number;
    codigoRampa?: string;
    ubicacion?: string;
    encargado?: string;
    fecha?: string;
    horaInicio?: string;
    horaFin?: string;
  }>({});

  const doLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Cargar perfil al montar
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await clientApi.getProfile();
        setClientProfile(data.cliente);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  // Cargar datos según la sección activa
  useEffect(() => {
    const loadSectionData = async () => {
      setLoading(true);
      try {
        switch (activeSection) {
          case 'profile':
            break;
          case 'vehicles':
            const vehiclesData = await clientApi.getVehicles();
            setVehiclesList(vehiclesData.vehiculos || []);
            break;
          case 'correctivo':
            const correctivoServicesData = await clientApi.getCorrectiveServices();
            setCorrectiveServices(correctivoServicesData.servicios || []);
            break;
          case 'preventivo':
            const preventivosData = await clientApi.getVehicles();
            setVehiclesList(preventivosData.vehiculos || []);
            break;
          case 'diagnostics':
            const diagnosticsData = await clientApi.getDiagnostics();
            setDiagnostics(diagnosticsData.diagnosticos || []);
            break;
          case 'diagnosticsRequested':
            const [vehiclesRequestedData, diagnosticsRequestedData] = await Promise.all([
              clientApi.getVehicles(),
              clientApi.getDiagnosticsRequested()
            ]);
            setVehiclesList(vehiclesRequestedData.vehiculos || []);
            setDiagnosticsRequested(diagnosticsRequestedData.diagnosticos || []);
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeSection} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (activeSection) {
      loadSectionData();
    }
  }, [activeSection]);

  // Cargar servicios recientes al inicio
  useEffect(() => {
    const loadRecentServices = async () => {
      try {
        const data = await clientApi.getRecentServices();
        setRecentServices(data.servicios || []);
      } catch (error) {
        console.error('Error loading recent services:', error);
      }
    };
    loadRecentServices();
  }, []);

  // Cargar horarios disponibles cuando cambia la fecha
  useEffect(() => {
    const loadSchedules = async () => {
      if (!selectedDateForDiagnostic || !selectedVehicle) {
        setAvailableSchedules([]);
        return;
      }

      try {
        setIsLoadingSchedules(true);
        console.log('Cargando horarios para la fecha:', selectedDateForDiagnostic);
        const data = await clientApi.getAvailableSchedules(selectedDateForDiagnostic);
        console.log('Respuesta del servidor:', data);
        setAvailableSchedules(data.schedules || []);
      } catch (error) {
        console.error('Error loading schedules:', error);
        setAvailableSchedules([]);
      } finally {
        setIsLoadingSchedules(false);
      }
    };
    loadSchedules();
  }, [selectedDateForDiagnostic, selectedVehicle]);

  // Cargar operario disponible cuando se abre el modal de detalles correctivo
  useEffect(() => {
    const loadOperario = async () => {
      if (!showCorrectiveServiceDetails || !correctiveServiceDates[selectedCorrectiveService || '']) {
        return;
      }

      const { fecha, hora } = correctiveServiceDates[selectedCorrectiveService || ''];
      
      try {
        const data = await clientApi.getAvailableOperario(fecha, hora);
        if (data.success && data.operario) {
          setCorrectiveServiceOperario((prev) => ({
            ...prev,
            [selectedCorrectiveService]: data.operario,
          }));
        }
      } catch (error) {
        console.error('Error loading operario:', error);
      }
    };
    loadOperario();
  }, [showCorrectiveServiceDetails, selectedCorrectiveService, correctiveServiceDates]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'finalizado':
      case 'completado':
        return 'bg-green-900/50 text-green-400 border-green-500/50';
      case 'en progreso':
      case 'ejecución':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-500/50';
      case 'en revisión':
      case 'atención requerida':
        return 'bg-red-900/50 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  // Manejadores del formulario de registro de vehículos
  const handleVehicleInputChange = (field: string, value: any) => {
    setVehicleForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegisterVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleMessage(null);

    // Validación básica
    if (!vehicleForm.placa || !vehicleForm.marca || !vehicleForm.modelo || !vehicleForm.fechafabricacion) {
      setVehicleMessage({
        type: 'error',
        text: 'Por favor completa todos los campos requeridos',
      });
      return;
    }

    try {
      setSubmittingVehicle(true);
      await clientApi.registerVehicle({
        placa: vehicleForm.placa.toUpperCase(),
        marca: vehicleForm.marca,
        modelo: vehicleForm.modelo,
        fechafabricacion: vehicleForm.fechafabricacion,
        kilometraje: vehicleForm.kilometraje,
      });

      setVehicleMessage({
        type: 'success',
        text: 'Vehículo registrado exitosamente',
      });

      // Resetear formulario
      setVehicleForm({
        placa: '',
        marca: '',
        modelo: '',
        fechafabricacion: '',
        kilometraje: 0,
      });

      // Recargar lista de vehículos
      const vehiclesData = await clientApi.getVehicles();
      setVehiclesList(vehiclesData.vehiculos || []);

      // Cerrar la sección después de 2 segundos
      setTimeout(() => {
        setActiveSection(null);
      }, 2000);
    } catch (error: any) {
      setVehicleMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Error al registrar el vehículo',
      });
    } finally {
      setSubmittingVehicle(false);
    }
  };

  // Iniciar edición de perfil
  const handleStartEditProfile = () => {
    if (clientProfile) {
      setEditProfileForm({
        nombre: clientProfile.nombre || '',
        apepaterno: clientProfile.apepaterno || '',
        apematerno: clientProfile.apematerno || '',
        telefono: clientProfile.telefono || '',
        correo: clientProfile.correo || '',
      });
      setEditingProfile(true);
      setProfileMessage(null);
    }
  };

  // Cambiar valor en el formulario de edición
  const handleEditProfileChange = (field: string, value: string) => {
    setEditProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Cancelar edición
  const handleCancelEditProfile = () => {
    setEditingProfile(false);
    setProfileMessage(null);
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async () => {
    setProfileMessage(null);
    try {
      setSubmittingProfile(true);
      await clientApi.updateProfile(editProfileForm);

      setProfileMessage({
        type: 'success',
        text: 'Perfil actualizado exitosamente',
      });

      // Recargar perfil
      const profileData = await clientApi.getProfile();
      setClientProfile(profileData.cliente);

      // Cerrar edición después de 2 segundos
      setTimeout(() => {
        setEditingProfile(false);
      }, 2000);
    } catch (error: any) {
      setProfileMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Error al actualizar el perfil',
      });
    } finally {
      setSubmittingProfile(false);
    }
  };

  // Manejar confirmación de servicio correctivo
  const handleConfirmCorrectiveService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCorrectiveService || !selectedVehicle) {
      alert('Por favor selecciona un servicio y un vehículo');
      return;
    }

    const serviceData = correctiveServiceDates[selectedCorrectiveService];
    if (!serviceData || !serviceData.fecha || !serviceData.hora) {
      alert('Por favor selecciona fecha y hora para el servicio');
      return;
    }

    const operario = correctiveServiceOperario[selectedCorrectiveService];
    if (!operario) {
      alert('No hay operario disponible para la fecha y hora seleccionada');
      return;
    }

    try {
      const payload = {
        codvehiculo: selectedVehicle.codVehiculo,
        codservicio: selectedCorrectiveService,
        fecha: serviceData.fecha,
        horainicio: serviceData.hora,
        idempleado: operario.idempleado,
      };

      const response = await clientApi.requestCorrectiveService(payload);

      alert(`¡Servicio correctivo solicitado exitosamente! Ticket: ${response.ticket?.codticket}`);

      // Resetear formulario
      setSelectedCorrectiveService('');
      setSelectedVehicle(null);
      setCorrectiveServiceDates({});
      setCorrectiveServiceOperario({});

      // Volver a la sección de diagnósticos
      setActiveSection('diagnosticsRequested');
    } catch (error: any) {
      console.error('Error confirmando servicio correctivo:', error);
      const mensajeError = error.response?.data?.message || (error as any).message || 'Error al confirmar el servicio';
      alert(mensajeError);
    }
  };

  const handleConfirmPreventiveService = async () => {
    if (!selectedPreventiveVehicle) {
      alert('Por favor selecciona un vehículo');
      return;
    }

    if (!selectedPreventiveSchedule) {
      alert('Por favor selecciona un horario disponible');
      return;
    }

    if (preventiveKilometraje <= 0) {
      alert('Por favor ingresa el kilometraje actual');
      return;
    }

    // Preparar datos para mostrar en modal
    const reservationInfo = {
      codticket: `P${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 900) + 100}`.substring(0, 8),
      marca: selectedPreventiveVehicle.marca,
      modelo: selectedPreventiveVehicle.modelo,
      año: new Date(selectedPreventiveVehicle.fechafabricacion).getFullYear() || new Date().getFullYear(),
      tipoServicio: 'Preventivo ' + selectedPreventiveVehicle.marca + ' ' + selectedPreventiveVehicle.modelo,
      precio: selectedPreventiveSchedule.tarifa || 0,
      codigoRampa: 'Z0001', // Esto vendría del horario si está disponible
      ubicacion: selectedPreventiveSchedule.rampadescripcion || 'Centro de servicio',
      encargado: selectedPreventiveSchedule.operario || 'Por asignar',
      fecha: selectedPreventiveSchedule.fecha,
      horainicio: selectedPreventiveSchedule.horainicio,
      horafin: selectedPreventiveSchedule.horafin,
      kilometraje: preventiveKilometraje,
    };

    setPreventiveReservationData(reservationInfo);
    setShowPreventiveReservationDetails(true);
  };

  const handleConfirmReservationModal = async () => {
    try {
      const payload = {
        codvehiculo: selectedPreventiveVehicle!.codVehiculo,
        codhorariodisp: selectedPreventiveSchedule!.codhorariodisp,
        kilometraje: preventiveKilometraje,
      };

      const response = await clientApi.requestPreventiveService(payload);

      alert(`¡Servicio preventivo reservado exitosamente! Ticket: ${response.ticket?.codticket}`);

      // Resetear formulario
      setSelectedPreventiveVehicle(null);
      setPreventiveSearchDate('');
      setSelectedPreventiveSchedule(null);
      setPreventiveKilometraje(0);
      setAvailablePreventiveSchedules([]);
      setShowPreventiveReservationDetails(false);

      // Volver a diagnósticos
      setActiveSection('diagnosticsRequested');
    } catch (error: any) {
      console.error('Error confirmando servicio preventivo:', error);
      const mensajeError = error.response?.data?.message || (error as any).message || 'Error al confirmar la reserva';
      alert(mensajeError);
    }
  };

  return (
    <div className="flex h-screen bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex flex-col flex-shrink-0 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-4 border-b border-white/10">
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
            <img
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
            />
            <div>
              <p className="font-bold text-white text-sm">{user?.username}</p>
              <p className="text-xs text-gray-400">Cliente</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-2 py-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'profile'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">person</span>
                <span className="truncate text-sm">Perfil Cliente</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('registerVehicle')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'registerVehicle'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">add_circle</span>
                <span className="truncate text-sm">Registrar Vehículo</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('vehicles')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'vehicles'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">directions_car</span>
                <span className="truncate text-sm">Vehículos Registrados</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('correctivo')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'correctivo'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">build</span>
                <span className="truncate text-sm">Correctivo</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('preventivo')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'preventivo'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">event_note</span>
                <span className="truncate text-sm">Preventivo</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('diagnostics')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'diagnostics'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">find_in_page</span>
                <span className="truncate text-sm">Diagnóstico</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('diagnosticsRequested')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'diagnosticsRequested'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">assignment</span>
                <span className="truncate text-sm">Diagnósticos Solicitados</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('terms')}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all overflow-hidden ${
                  activeSection === 'terms'
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons flex-shrink-0">description</span>
                <span className="truncate text-sm">Términos y Condiciones</span>
              </button>
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
              <span className="material-icons text-primary text-2xl">directions_car</span>
              <h1 className="text-xl font-bold text-white">AutoSystem</h1>
            </div>
            <div className="relative hidden sm:block">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
              Agendar Servicio
            </button>
            <UserMenu />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome & Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando datos...</p>
                </div>
              </div>
            )}

            {!isLoading && activeSection === null && (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo, {user?.username}</h2>
                  <p className="text-gray-400">Este es tu panel de control. Selecciona una opción del menú para comenzar.</p>
                </div>

                {/* Quick Access */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-white mb-4">Accesos Rápidos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { icon: 'directions_car', title: 'Vehículos', action: 'vehicles', desc: 'Ver tus vehículos', bgColor: 'from-blue-900/40 to-cyan-900/40', borderColor: 'border-blue-500/30', textColor: 'text-blue-400' },
                      { icon: 'build', title: 'Correctivo', action: 'correctivo', desc: 'Reparación de daños', bgColor: 'from-orange-900/40 to-red-900/40', borderColor: 'border-orange-500/30', textColor: 'text-orange-400' },
                      { icon: 'event_note', title: 'Preventivo', action: 'preventivo', desc: 'Revisión periódica', bgColor: 'from-green-900/40 to-emerald-900/40', borderColor: 'border-green-500/30', textColor: 'text-green-400' },
                      { icon: 'find_in_page', title: 'Diagnósticos', action: 'diagnostics', desc: 'Ver análisis del vehículo', bgColor: 'from-purple-900/40 to-indigo-900/40', borderColor: 'border-purple-500/30', textColor: 'text-purple-400' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSection(item.action as any)}
                        className={`bg-gradient-to-br ${item.bgColor} border ${item.borderColor} p-4 rounded-lg hover:opacity-90 transition-all text-left group`}
                      >
                        <div className="flex items-center justify-center w-10 h-10 mb-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                          <span className={`material-icons ${item.textColor}`}>{item.icon}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Services */}
                {recentServicesList.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Servicios Recientes</h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                      <ul className="divide-y divide-white/10">
                        {recentServicesList.map((service: RecentServiceItem, idx: number) => (
                          <li key={idx} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-white">{service.vehiculo}</p>
                              <p className="text-xs text-gray-400">ID: {service.id}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Profile Section */}
            {!isLoading && activeSection === 'profile' && clientProfile && (
              <div>
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Resumen de Cuenta</h1>
                    <p className="text-gray-400">Bienvenido, aquí tienes un resumen de tu información personal y de cuenta.</p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={handleStartEditProfile}
                      className="bg-primary hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-opacity flex items-center gap-2"
                    >
                      <span className="material-icons text-lg">edit</span>
                      Editar Perfil
                    </button>
                  )}
                </div>

                {/* Mensajes de éxito/error */}
                {profileMessage && (
                  <div
                    className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                      profileMessage.type === 'success'
                        ? 'bg-green-900/30 border-green-500/50 text-green-400'
                        : 'bg-red-900/30 border-red-500/50 text-red-400'
                    }`}
                  >
                    <span className="material-icons text-lg flex-shrink-0">
                      {profileMessage.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    <p>{profileMessage.text}</p>
                  </div>
                )}

                {isEditingProfile ? (
                  // Modo Edición
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 text-white">Editar Datos Personales</h3>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Nombre *</label>
                          <input
                            type="text"
                            value={editProfileForm.nombre}
                            onChange={(e) => handleEditProfileChange('nombre', e.target.value)}
                            disabled={isSubmittingProfile}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Apellido Paterno</label>
                          <input
                            type="text"
                            value={editProfileForm.apepaterno}
                            onChange={(e) => handleEditProfileChange('apepaterno', e.target.value)}
                            disabled={isSubmittingProfile}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Apellido Materno</label>
                          <input
                            type="text"
                            value={editProfileForm.apematerno}
                            onChange={(e) => handleEditProfileChange('apematerno', e.target.value)}
                            disabled={isSubmittingProfile}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Teléfono</label>
                          <input
                            type="text"
                            value={editProfileForm.telefono}
                            onChange={(e) => handleEditProfileChange('telefono', e.target.value)}
                            disabled={isSubmittingProfile}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Correo Electrónico</label>
                          <input
                            type="email"
                            value={editProfileForm.correo}
                            onChange={(e) => handleEditProfileChange('correo', e.target.value)}
                            disabled={isSubmittingProfile}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                        <button
                          onClick={handleCancelEditProfile}
                          disabled={isSubmittingProfile}
                          className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors font-medium disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSubmittingProfile}
                          className="flex-1 bg-primary hover:opacity-90 text-white font-bold py-2 rounded-lg transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isSubmittingProfile ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <span className="material-icons text-lg">save</span>
                              Guardar
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Datos de Cuenta Cliente */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 text-white">Datos de Cuenta Cliente</h3>
                      <div className="space-y-5">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Cód. Cuenta Cliente</span>
                          <span className="bg-slate-700 text-gray-300 text-xs font-mono px-2 py-1 rounded">
                            {clientProfile.codcuentacliente || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Mantenimientos Pendientes</span>
                          <span className="font-bold text-lg text-yellow-500">{clientProfile.totalpendientes || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Mantenimientos Cancelados</span>
                          <span className="font-bold text-lg text-red-500">{clientProfile.totalcancelados || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="text-gray-400">Mantenimientos Realizados</span>
                          <span className="font-bold text-lg text-green-500">{clientProfile.totalrealizados || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Modo Lectura
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Datos Personales */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 text-white">Datos Personales</h3>
                      <div className="space-y-5">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">DNI</span>
                          <span className="font-medium text-white">{clientProfile.dnicliente || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Nombre</span>
                          <span className="font-medium text-white">{clientProfile.nombre || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Apellido Paterno</span>
                          <span className="font-medium text-white">{clientProfile.apepaterno || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Apellido Materno</span>
                          <span className="font-medium text-white">{clientProfile.apematerno || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Teléfono</span>
                          <span className="font-medium text-white">{clientProfile.telefono || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="text-gray-400">Correo Electrónico</span>
                          <span className="font-medium text-white">{clientProfile.correo || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Datos de Cuenta Cliente */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <h3 className="text-xl font-semibold mb-6 text-white">Datos de Cuenta Cliente</h3>
                      <div className="space-y-5">
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Cód. Cuenta Cliente</span>
                          <span className="bg-slate-700 text-gray-300 text-xs font-mono px-2 py-1 rounded">
                            {clientProfile.codcuentacliente || 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Mantenimientos Pendientes</span>
                          <span className="font-bold text-lg text-yellow-500">{clientProfile.totalpendientes || 0}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                          <span className="text-gray-400">Mantenimientos Cancelados</span>
                          <span className="font-bold text-lg text-red-500">{clientProfile.totalcancelados || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                          <span className="text-gray-400">Mantenimientos Realizados</span>
                          <span className="font-bold text-lg text-green-500">{clientProfile.totalrealizados || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Vehicles Section */}
            {!isLoading && activeSection === 'vehicles' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Vehículos Registrados</h2>
                {vehiclesList.length > 0 ? (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden mb-6">
                      <table className="w-full text-sm">
                        <thead className="bg-white/10 border-b border-white/10">
                          <tr>
                            <th className="text-left p-4 text-white font-semibold">Matrícula</th>
                            <th className="text-left p-4 text-white font-semibold">Marca</th>
                            <th className="text-left p-4 text-white font-semibold">Modelo</th>
                            <th className="text-left p-4 text-white font-semibold">Kilometraje</th>
                            <th className="text-left p-4 text-white font-semibold">Fabricación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehiclesList.map((vehicle: Vehicle, idx: number) => (
                            <tr 
                              key={idx} 
                              onClick={() => setSelectedVehicle(selectedVehicle?.placa === vehicle.placa ? null : vehicle)}
                              className={`border-b border-white/10 cursor-pointer transition-colors ${
                                selectedVehicle?.placa === vehicle.placa 
                                  ? 'bg-primary/30 border-primary/50' 
                                  : idx % 2 === 0 
                                    ? 'bg-indigo-900/20 hover:bg-indigo-900/40' 
                                    : 'bg-white/5 hover:bg-white/10'
                              }`}
                            >
                              <td className="p-4 text-white font-medium">{vehicle.placa}</td>
                              <td className="p-4 text-gray-300">{vehicle.marca}</td>
                              <td className="p-4 text-gray-300">{vehicle.modelo}</td>
                              <td className="p-4 text-gray-300">{vehicle.kilometraje}</td>
                              <td className="p-4 text-gray-300">{vehicle.fechafabricacion ? new Date(vehicle.fechafabricacion).toLocaleDateString() : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {selectedVehicle && (
                      <div className="bg-primary/10 border border-primary/50 rounded-lg p-4 mb-6">
                        <p className="text-white mb-4">
                          <span className="font-semibold">Vehículo seleccionado:</span> {selectedVehicle.marca} {selectedVehicle.modelo} ({selectedVehicle.placa})
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => setActiveSection('vehicleHistory')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            <span className="material-icons text-sm">history</span>
                            Ver historial
                          </button>
                          <button 
                            onClick={() => setShowServiceRequestModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                          >
                            <span className="material-icons text-sm">build</span>
                            Solicitar nuevo servicio
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setActiveSection('registerVehicle')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                    >
                      <span className="material-icons text-sm">add</span>
                      Agregar vehículo
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400 mb-6">No tienes vehículos registrados</p>
                )}
              </div>
            )}

            {/* Correctivo Section */}
            {!isLoading && activeSection === 'correctivo' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">Solicitar Servicio Correctivo</h2>
                
                {/* Vehicle Selection */}
                {selectedVehicle && (
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Vehículo Seleccionado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Marca</label>
                        <div className="bg-white/5 p-2 rounded text-white font-medium">{selectedVehicle.marca}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Modelo</label>
                        <div className="bg-white/5 p-2 rounded text-white font-medium">{selectedVehicle.modelo}</div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Placa</label>
                        <div className="bg-white/5 p-2 rounded text-white font-medium">{selectedVehicle.placa}</div>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => setSelectedVehicle(null)}
                          className="w-full mt-6 px-3 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors text-sm"
                        >
                          Cambiar Vehículo
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedVehicle ? (
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <p className="text-gray-400 mb-4">Selecciona un vehículo para continuar</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {vehiclesList.map((vehicle, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedVehicle(vehicle)}
                          className="w-full text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-primary/20 hover:border-primary/50 transition-colors"
                        >
                          <div className="font-medium text-white">{vehicle.marca} {vehicle.modelo}</div>
                          <div className="text-xs text-gray-400">{vehicle.placa}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleConfirmCorrectiveService} className="space-y-8">
                    {correctiveServicesList.length > 0 ? (
                      correctiveServicesList
                        .filter((servicio: CorrectiveService) => {
                          if (!selectedVehicle) return true;
                          const marcaCompatible = !servicio.marca || servicio.marca === selectedVehicle.marca;
                          const modeloCompatible = !servicio.modelo || servicio.modelo === selectedVehicle.modelo;
                          return marcaCompatible && modeloCompatible;
                        })
                        .length > 0 ? (
                        correctiveServicesList
                          .filter((servicio: CorrectiveService) => {
                            if (!selectedVehicle) return true;
                            const marcaCompatible = !servicio.marca || servicio.marca === selectedVehicle.marca;
                            const modeloCompatible = !servicio.modelo || servicio.modelo === selectedVehicle.modelo;
                            return marcaCompatible && modeloCompatible;
                          })
                          .map((servicio: CorrectiveService, idx: number) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-lg">
                              <div className="flex items-center mb-4">
                                <input
                                  type="radio"
                                  id={`servicio-${idx}`}
                                  name="servicio"
                                  value={servicio.codservicio}
                                  onChange={(e) => setSelectedCorrectiveService(e.target.value)}
                                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 bg-white/5"
                                />
                                <label htmlFor={`servicio-${idx}`} className="ml-3 text-lg font-medium text-white">
                                  {servicio.descripcion}
                                </label>
                              </div>

                              {/* Fecha y Hora */}
                              <div className="flex items-center gap-4 mb-4">
                                <div className="relative flex-1">
                                  <input
                                    type="date"
                                    onChange={(e) => {
                                      const hora = correctiveServiceDates[servicio.codservicio]?.hora || '';
                                      setCorrectiveServiceDates((prev) => ({
                                        ...prev,
                                        [servicio.codservicio]: { fecha: e.target.value, hora },
                                      }));
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                  />
                                  <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                    calendar_today
                                  </span>
                                </div>
                                <div className="relative flex-1">
                                  <input
                                    type="time"
                                    onChange={(e) => {
                                      const fecha = correctiveServiceDates[servicio.codservicio]?.fecha || '';
                                      setCorrectiveServiceDates((prev) => ({
                                        ...prev,
                                        [servicio.codservicio]: { fecha, hora: e.target.value },
                                      }));
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                  />
                                  <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                    schedule
                                  </span>
                                </div>
                              </div>

                              {/* Tabla de Servicio */}
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1 overflow-x-auto">
                                  <table className="w-full text-sm text-left text-gray-400 border border-white/10 rounded-lg">
                                    <thead className="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
                                      <tr>
                                        <th className="px-6 py-3">Código Servicio</th>
                                        <th className="px-6 py-3">Descripción</th>
                                        <th className="px-6 py-3">Precio Aprox</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="bg-white/5 border-b border-white/10 hover:bg-white/10">
                                        <td className="px-6 py-4 font-medium text-white">{servicio.codservicio}</td>
                                        <td className="px-6 py-4 text-white">{servicio.descripcion}</td>
                                        <td className="px-6 py-4 text-white">${servicio.tarifa}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCorrectiveServiceData(servicio);
                                    setShowCorrectiveServiceDetails(true);
                                  }}
                                  className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors font-medium whitespace-nowrap"
                                >
                                  Ver Detalle
                                </button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-gray-400">
                          No hay servicios correctivos disponibles para {selectedVehicle.marca} {selectedVehicle.modelo}
                        </p>
                      )
                    ) : (
                      <p className="text-gray-400">Cargando servicios correctivos...</p>
                    )}

                    {/* Botón Confirmar */}
                    {correctiveServicesList
                      .filter((servicio: CorrectiveService) => {
                        if (!selectedVehicle) return true;
                        const marcaCompatible = !servicio.marca || servicio.marca === selectedVehicle.marca;
                        const modeloCompatible = !servicio.modelo || servicio.modelo === selectedVehicle.modelo;
                        return marcaCompatible && modeloCompatible;
                      })
                      .length > 0 && (
                      <div className="flex justify-end pt-4">
                        <button
                          type="submit"
                          disabled={!selectedCorrectiveService}
                          className={`${
                            selectedCorrectiveService
                              ? 'bg-primary hover:bg-green-700 shadow-lg hover:shadow-primary/50'
                              : 'bg-gray-600 cursor-not-allowed'
                          } text-white font-bold py-3 px-10 rounded-lg transition-all duration-300 text-lg`}
                        >
                          Confirmar
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* Preventivo Section */}
            {!isLoading && activeSection === 'preventivo' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Solicitar Servicio Preventivo</h2>

                {/* Contenedor principal como en HTML */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Seleccionar vehículo</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Matrícula (Dropdown) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Matrícula</label>
                      <select
                        value={selectedPreventiveVehicle?.codVehiculo || ''}
                        onChange={(e) => {
                          const vehicle = vehiclesList.find(v => v.codVehiculo === e.target.value);
                          setSelectedPreventiveVehicle(vehicle || null);
                        }}
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-primary focus:border-primary text-gray-800 dark:text-gray-200"
                      >
                        <option value="">-- Seleccionar Matrícula --</option>
                        {vehiclesList.map((vehicle) => (
                          <option key={vehicle.codVehiculo} value={vehicle.codVehiculo}>
                            {vehicle.placa}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kilometraje con botón Actualizar */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kilometraje</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={preventiveKilometraje > 0 ? preventiveKilometraje : ''}
                          onChange={(e) => setPreventiveKilometraje(Number(e.target.value) || 0)}
                          placeholder="Actualiza el kilometraje*"
                          className="flex-grow bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l focus:ring-primary focus:border-primary text-gray-800 dark:text-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedPreventiveVehicle?.kilometraje) {
                              setPreventiveKilometraje(Number(selectedPreventiveVehicle.kilometraje));
                            }
                          }}
                          className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 rounded-r border border-l-0 border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-sm"
                        >
                          Actualizar
                        </button>
                      </div>
                    </div>

                    {/* Modelo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Modelo</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedPreventiveVehicle?.modelo || ''}
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200 cursor-not-allowed"
                      />
                    </div>

                    {/* Marca */}
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Marca</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedPreventiveVehicle?.marca || ''}
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Fecha y Búsqueda */}
                {selectedPreventiveVehicle && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
                        <input
                          type="date"
                          value={preventiveSearchDate}
                          onChange={(e) => {
                            setPreventiveSearchDate(e.target.value);
                            setSelectedPreventiveSchedule(null);
                          }}
                          min={new Date().toISOString().split('T')[0]}
                          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-primary focus:border-primary pl-4 pr-10 py-2 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                      <div className="self-end">
                        <button
                          type="button"
                          onClick={async () => {
                            if (!preventiveSearchDate) {
                              alert('Por favor selecciona una fecha');
                              return;
                            }
                            try {
                              setIsLoadingPreventiveSchedules(true);
                              const data = await clientApi.getAvailableSchedules(preventiveSearchDate);
                              setAvailablePreventiveSchedules(data.schedules || []);
                            } catch (error) {
                              console.error('Error loading schedules:', error);
                              setAvailablePreventiveSchedules([]);
                            } finally {
                              setIsLoadingPreventiveSchedules(false);
                            }
                          }}
                          className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          Buscar
                        </button>
                      </div>
                    </div>

                    {/* Tabla de Horarios Disponibles */}
                    {(isLoadingPreventiveSchedules || availablePreventiveSchedules.length > 0) && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-200 dark:border-gray-700">
                          Fechas disponibles
                        </h3>
                        <div className="overflow-x-auto">
                          {isLoadingPreventiveSchedules ? (
                            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                              Cargando horarios disponibles...
                            </div>
                          ) : (
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-700 dark:text-gray-400 uppercase">
                                <tr>
                                  <th className="px-6 py-3">Fecha_servicio</th>
                                  <th className="px-6 py-3">Dirección</th>
                                  <th className="px-6 py-3">Hora_servicio</th>
                                  <th className="px-6 py-3">Precio</th>
                                  <th className="px-6 py-3"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {availablePreventiveSchedules.map((schedule, idx) => (
                                  <tr
                                    key={idx}
                                    onClick={() => setSelectedPreventiveSchedule(schedule)}
                                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                                      selectedPreventiveSchedule?.codhorariodisp === schedule.codhorariodisp
                                        ? 'bg-blue-100 dark:bg-blue-900/50'
                                        : ''
                                    }`}
                                  >
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{schedule.fecha}</td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                                      {schedule.rampadescripcion || 'Centro de servicio'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{schedule.horainicio}</td>
                                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">${schedule.tarifa}</td>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="radio"
                                        name="preventivo-schedule"
                                        checked={selectedPreventiveSchedule?.codhorariodisp === schedule.codhorariodisp}
                                        onChange={() => setSelectedPreventiveSchedule(schedule)}
                                        className="h-4 w-4 accent-blue-600"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    )}

                    {preventiveSearchDate && !isLoadingPreventiveSchedules && availablePreventiveSchedules.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        No hay horarios disponibles para la fecha seleccionada
                      </div>
                    )}

                    {/* Botón Reservar */}
                    {selectedPreventiveSchedule && (
                      <div className="mt-8 flex justify-end">
                        <button
                          onClick={handleConfirmPreventiveService}
                          className="bg-primary hover:opacity-90 text-white font-bold py-3 px-12 rounded-lg transition-opacity text-lg"
                        >
                          Reservar
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Modal Detalles Reserva Preventivo */}
            {showPreventiveReservationDetails && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                      Detalles Reserva
                    </h3>

                    {/* Grid de información */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Código Ticket</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.codticket}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Marca</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.marca}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Modelo</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.modelo}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Año</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.año}</p>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de servicio</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.tipoServicio}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Precio</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">${preventiveReservationData.precio}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Código Rampa</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.codigoRampa || 'N/A'}</p>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Ubicación</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.ubicacion}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Encargado</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.encargado}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Fecha</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.fecha}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Hora Inicio</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.horainicio}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Kilometraje</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white font-semibold">{preventiveReservationData.kilometraje}</p>
                      </div>
                    </div>

                    {/* Botones Cancelar y Ok */}
                    <div className="flex justify-end gap-4 mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <button
                        onClick={() => setShowPreventiveReservationDetails(false)}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm transition-colors"
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirmReservationModal}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors"
                        type="button"
                      >
                        Ok
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnostics Section */}
            {!isLoading && activeSection === 'diagnostics' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Diagnósticos</h2>
                {diagnosticsList.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {diagnosticsList.map((diag: Diagnostic, idx: number) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="mb-3">
                          <h3 className="font-bold text-white">{diag.vehiculo}</h3>
                          <p className="text-sm text-gray-400">ID: {diag.codDiagnostico}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-400">Área</p>
                            <p className="text-white">{diag.area}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Problemas Encontrados</p>
                            <p className="text-white">{diag.problemas}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Fecha</p>
                            <p className="text-white">{new Date(diag.fecha).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No hay diagnósticos registrados</p>
                )}
              </div>
            )}

            {/* Diagnostics Requested Section */}
            {!isLoading && activeSection === 'diagnosticsRequested' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Diagnósticos Solicitados</h2>
                
                {/* Vehicle Selection Filter */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Vehículo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    {/* Matrícula */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Matrícula</label>
                      <select
                        value={selectedVehicleForDiagnostics?.codVehiculo || ''}
                        onChange={(e) => {
                          const vehicle = vehiclesList.find(v => v.codVehiculo === e.target.value);
                          setSelectedVehicleForDiagnostics(vehicle || null);
                          if (vehicle) {
                            const filtered = diagnosticsRequestedList.filter(d => d.vehiculo.includes(vehicle.placa));
                            setFilteredDiagnosticsRequested(filtered);
                          }
                        }}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="" className="text-gray-900">-- Seleccionar Matrícula --</option>
                        {vehiclesList.map((v) => (
                          <option key={v.codVehiculo} value={v.codVehiculo} className="text-gray-900">
                            {v.placa}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Kilometraje */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Kilometraje</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedVehicleForDiagnostics?.kilometraje || ''}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 cursor-not-allowed"
                      />
                    </div>

                    {/* Modelo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Modelo</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedVehicleForDiagnostics?.modelo || ''}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 cursor-not-allowed"
                      />
                    </div>

                    {/* Marca */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Marca</label>
                      <input
                        type="text"
                        readOnly
                        value={selectedVehicleForDiagnostics?.marca || ''}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white/60 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Botón Limpiar Filtro */}
                  {selectedVehicleForDiagnostics && (
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => {
                          setSelectedVehicleForDiagnostics(null);
                          setFilteredDiagnosticsRequested([]);
                        }}
                        className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors text-sm"
                      >
                        Limpiar Filtro
                      </button>
                    </div>
                  )}
                </div>

                {/* Diagnostics Table */}
                {diagnosticsRequestedList.length > 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-6 overflow-x-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">Diagnóstico</h3>
                    <table className="w-full text-sm text-left text-gray-400 border-collapse">
                      <thead className="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-6 py-3 font-semibold rounded-l-md w-1/6">Área</th>
                          <th className="px-6 py-3 font-semibold w-2/5">Problemas</th>
                          <th className="px-6 py-3 font-semibold rounded-r-md w-2/5">Motivo de Derivación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedVehicleForDiagnostics ? filteredDiagnosticsRequested : diagnosticsRequestedList).length > 0 ? (
                          (selectedVehicleForDiagnostics ? filteredDiagnosticsRequested : diagnosticsRequestedList).map(
                            (_diag: DiagnosticRequested, idx: number) => (
                              <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">Motor</td>
                                <td className="px-6 py-4 text-white">Vibraciones, pérdida de potencia, ruidos extraños, humo excesivo</td>
                                <td className="px-6 py-4 text-white">Revisión necesaria de componentes como inyectores, bujías, sensores o correas</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-400">
                              No hay diagnósticos disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400">No hay diagnósticos solicitados</p>
                )}

                {/* Action Button */}
                {selectedVehicleForDiagnostics && filteredDiagnosticsRequested.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        setSelectedVehicle(selectedVehicleForDiagnostics);
                        setActiveSection('correctivo');
                      }}
                      className="bg-primary hover:opacity-90 text-gray-900 font-bold py-3 px-8 rounded-lg transition-opacity shadow-lg shadow-primary/20"
                    >
                      Solicitar Mantenimiento Correctivo
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Register Vehicle Section */}
            {!isLoading && activeSection === 'registerVehicle' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Registro de Vehículo</h2>
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  {/* Mensajes de éxito/error */}
                  {vehicleMessage && (
                    <div
                      className={`mb-6 p-4 rounded-lg border ${
                        vehicleMessage.type === 'success'
                          ? 'bg-green-900/30 border-green-500/50 text-green-400'
                          : 'bg-red-900/30 border-red-500/50 text-red-400'
                      }`}
                    >
                      <p className="flex items-center gap-2">
                        <span className="material-icons text-sm">
                          {vehicleMessage.type === 'success' ? 'check_circle' : 'error'}
                        </span>
                        {vehicleMessage.text}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleRegisterVehicle} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Matrícula */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Matrícula <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ABC-123"
                          value={vehicleForm.placa}
                          onChange={(e) => handleVehicleInputChange('placa', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          disabled={isSubmittingVehicle}
                          maxLength={6}
                        />
                      </div>

                      {/* Marca */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Marca <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Honda, Toyota, Ford"
                          value={vehicleForm.marca}
                          onChange={(e) => handleVehicleInputChange('marca', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          disabled={isSubmittingVehicle}
                          maxLength={20}
                        />
                      </div>

                      {/* Modelo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Modelo <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Civic"
                          value={vehicleForm.modelo}
                          onChange={(e) => handleVehicleInputChange('modelo', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          disabled={isSubmittingVehicle}
                          maxLength={20}
                        />
                      </div>

                      {/* Fecha de Fabricación */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Año de Fabricación <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          value={vehicleForm.fechafabricacion}
                          onChange={(e) => handleVehicleInputChange('fechafabricacion', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          disabled={isSubmittingVehicle}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      {/* Kilometraje */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Kilometraje
                        </label>
                        <input
                          type="text"
                          placeholder="0"
                          value={vehicleForm.kilometraje}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, '');
                            handleVehicleInputChange('kilometraje', value ? parseFloat(value) : 0);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                          disabled={isSubmittingVehicle}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setActiveSection(null)}
                        className="px-8 py-3 rounded-lg border border-white/20 text-gray-300 hover:text-white hover:border-white/40 transition-colors font-medium disabled:opacity-50"
                        disabled={isSubmittingVehicle}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingVehicle}
                        className="bg-primary hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmittingVehicle ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Registrando...
                          </>
                        ) : (
                          'Registrar Vehículo'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Diagnostics Section */}
            {!isLoading && activeSection === 'diagnostics' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Solicitar Diagnóstico</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Panel: Vehicle and Date Selection */}
                  <div className="space-y-6">
                    {/* Vehicle Selection */}
                    <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Vehículo</h3>
                      {selectedVehicle ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-400">Placa</label>
                            <div className="bg-white/5 p-2 rounded text-white">{selectedVehicle.placa}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Marca</label>
                            <div className="bg-white/5 p-2 rounded text-white">{selectedVehicle.marca}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Modelo</label>
                            <div className="bg-white/5 p-2 rounded text-white">{selectedVehicle.modelo}</div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Kilometraje</label>
                            <div className="bg-white/5 p-2 rounded text-white">{selectedVehicle.kilometraje}</div>
                          </div>
                          <button
                            onClick={() => setSelectedVehicle(null)}
                            className="w-full mt-4 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                          >
                            Cambiar Vehículo
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {vehiclesList.map((vehicle, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedVehicle(vehicle)}
                              className="w-full text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-primary/20 hover:border-primary/50 transition-colors"
                            >
                              <div className="font-medium text-white">{vehicle.marca} {vehicle.modelo}</div>
                              <div className="text-xs text-gray-400">{vehicle.placa}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Date Selection */}
                    {selectedVehicle && (
                      <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Fecha</h3>
                        <input
                          type="date"
                          value={selectedDateForDiagnostic}
                          onChange={(e) => {
                            setSelectedDateForDiagnostic(e.target.value);
                            setSelectedSchedule(null);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Panel: Available Schedules */}
                  {selectedVehicle && selectedDateForDiagnostic && (
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-4">Horarios Disponibles</h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {isLoadingSchedules ? (
                          <div className="text-center py-8">
                            <p className="text-gray-400">Cargando horarios disponibles...</p>
                          </div>
                        ) : availableSchedules.length > 0 ? (
                          availableSchedules.map((schedule, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedSchedule(schedule)}
                              className={`w-full text-left p-4 rounded-lg transition-colors border ${
                                selectedSchedule?.codhorariodisp === schedule.codhorariodisp
                                  ? 'bg-primary/30 border-primary/50'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-white">
                                    {schedule.horainicio} - {schedule.horafin}
                                  </div>
                                  <div className="text-sm text-gray-400">{schedule.rampadescripcion || 'Centro de servicio'}</div>
                                </div>
                                <div className="text-primary font-semibold">${schedule.tarifa || '150'}</div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-8">No hay horarios disponibles para esta fecha</p>
                        )}
                      </div>

                      {selectedSchedule && (
                        <button
                          onClick={() => {
                            // Solo preparar datos, no crear ticket aún
                            const reserva = {
                              codticket: '',
                              marca: selectedVehicle.marca,
                              modelo: selectedVehicle.modelo,
                              fechafabricacion: selectedVehicle.fechafabricacion,
                              tipoServicio: 'Diagnóstico',
                              precio: selectedSchedule.tarifa || 150.00,
                              codigoRampa: selectedSchedule.codhorariodisp,
                              ubicacion: selectedSchedule.rampadescripcion || 'Centro de servicio',
                              encargado: selectedSchedule.operario || 'Por asignar',
                              fecha: selectedDateForDiagnostic,
                              horaInicio: selectedSchedule.horainicio,
                              horaFin: selectedSchedule.horafin,
                            };
                            
                            setReservationData(reserva);
                            setShowReservationDetails(true);
                          }}
                          className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Reservar Diagnóstico
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Terms and Conditions Section */}
            {!isLoading && activeSection === 'terms' && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Términos y Condiciones</h2>
                <div className="space-y-4 text-gray-300 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-bold text-white">1. Aceptación de Términos</h3>
                  <p>Al utilizar la plataforma AutoSystem, usted acepta todos los términos y condiciones establecidos en este documento. Si no está de acuerdo, por favor no utilice nuestros servicios.</p>

                  <h3 className="text-lg font-bold text-white">2. Servicios Ofrecidos</h3>
                  <p>AutoSystem ofrece servicios de mantenimiento vehicular, diagnósticos técnicos y asesoría en reparaciones. Nos comprometemos a mantener los más altos estándares de calidad en cada servicio.</p>

                  <h3 className="text-lg font-bold text-white">3. Responsabilidades del Cliente</h3>
                  <p>El cliente es responsable de proporcionar información precisa sobre su vehículo y mantener sus credenciales de acceso seguras. Cualquier daño causado por información incorrecta será responsabilidad del cliente.</p>

                  <h3 className="text-lg font-bold text-white">4. Tarifas y Pagos</h3>
                  <p>Las tarifas serán establecidas de acuerdo con el tipo de servicio solicitado. El cliente aceptará los términos de pago antes de confirmar cualquier servicio.</p>

                  <h3 className="text-lg font-bold text-white">5. Política de Cancelación</h3>
                  <p>Las cancelaciones deben realizarse con al menos 24 horas de anticipación. Las cancelaciones tardías pueden estar sujetas a cargos.</p>

                  <h3 className="text-lg font-bold text-white">6. Garantía de Servicios</h3>
                  <p>AutoSystem ofrece garantía en todos los servicios realizados. Para reportar problemas, contacte a nuestro equipo dentro de 30 días después del servicio.</p>

                  <h3 className="text-lg font-bold text-white">7. Privacidad de Datos</h3>
                  <p>Nos comprometemos a proteger su información personal de acuerdo con las leyes de protección de datos vigentes.</p>

                  <h3 className="text-lg font-bold text-white">8. Limitación de Responsabilidad</h3>
                  <p>AutoSystem no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de sus servicios.</p>

                  <h3 className="text-lg font-bold text-white">9. Cambios en los Términos</h3>
                  <p>AutoSystem se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma.</p>

                  <h3 className="text-lg font-bold text-white">10. Contacto</h3>
                  <p>Para consultas sobre estos términos, contacte a nuestro equipo de soporte a través de la plataforma.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal para solicitar servicio */}
        {showServiceRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-8 max-w-md w-full mx-4 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Seleccionar Tipo de Mantenimiento</h3>
              
              <p className="text-gray-300 mb-6">
                ¿Qué tipo de servicio deseas solicitar para tu vehículo {selectedVehicle?.marca} {selectedVehicle?.modelo}?
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowServiceRequestModal(false);
                    setActiveSection('preventivo');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-900/30 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-900/50 hover:border-blue-400 transition-colors"
                >
                  <span className="material-icons">shield</span>
                  <div className="text-left">
                    <div className="font-semibold">Mantenimiento Preventivo</div>
                    <div className="text-xs text-blue-400">Mantenimiento programado</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowServiceRequestModal(false);
                    setActiveSection('correctivo');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-900/50 hover:border-red-400 transition-colors"
                >
                  <span className="material-icons">build</span>
                  <div className="text-left">
                    <div className="font-semibold">Mantenimiento Correctivo</div>
                    <div className="text-xs text-red-400">Reparaciones urgentes</div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowServiceRequestModal(false)}
                className="w-full mt-6 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Detalles de Reserva */}
        {showReservationDetails && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg shadow-2xl max-w-2xl w-full border border-white/10 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-900 to-slate-800 p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="material-icons text-indigo-400">receipt_long</span>
                  Detalles de Reserva
                </h2>
              </div>

              {/* Contenido */}
              <div className="p-8 space-y-6 max-h-96 overflow-y-auto">
                {/* Tabla de Detalles */}
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-white/10 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">CódigoTicket</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Marca</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Modelo</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Año</th>
                        <th className="px-4 py-3 text-left text-gray-300 font-semibold">Tipo Servicio</th>
                        <th className="px-4 py-3 text-right text-gray-300 font-semibold">Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4 text-white font-medium">{reservationData.codticket}</td>
                        <td className="px-4 py-4 text-white">{reservationData.marca}</td>
                        <td className="px-4 py-4 text-white">{reservationData.modelo}</td>
                        <td className="px-4 py-4 text-white">{new Date(reservationData.fechafabricacion || '').getFullYear()}</td>
                        <td className="px-4 py-4 text-white">{reservationData.tipoServicio}</td>
                        <td className="px-4 py-4 text-right text-indigo-400 font-semibold">${reservationData.precio?.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Información de Ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Código Rampa</label>
                    <div className="text-white font-medium">{reservationData.codigoRampa}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Ubicación</label>
                    <div className="text-white font-medium">{reservationData.ubicacion}</div>
                  </div>
                </div>

                {/* Información de Cita */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Encargado</label>
                    <div className="text-white font-medium">{reservationData.encargado}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Fecha</label>
                    <div className="text-white font-medium flex items-center gap-2">
                      <span className="material-icons text-sm text-indigo-400">calendar_today</span>
                      {(() => {
                        const fecha = reservationData.fecha || '';
                        if (typeof fecha === 'string' && fecha.includes('-')) {
                          // Si es un string YYYY-MM-DD, formatearlo directamente
                          const [year, month, day] = fecha.split('-');
                          return new Date(year + '-' + month + '-' + day + 'T00:00:00').toLocaleDateString('es-ES');
                        }
                        // Si es otro formato, intentar convertir
                        return new Date(fecha).toLocaleDateString('es-ES');
                      })()}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Hora</label>
                    <div className="text-white font-medium flex items-center gap-2">
                      <span className="material-icons text-sm text-indigo-400">schedule</span>
                      {reservationData.horaInicio}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="bg-white/5 border-t border-white/10 p-6 flex justify-between gap-4">
                <button
                  onClick={() => {
                    setShowReservationDetails(false);
                    setSelectedVehicle(null);
                    setSelectedDateForDiagnostic('');
                    setSelectedSchedule(null);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">close</span>
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    try {
                      const payload = {
                        codvehiculo: selectedVehicle?.codVehiculo || '',
                        fecha: reservationData.fecha || '',
                        horainicio: reservationData.horaInicio || '',
                        horafin: reservationData.horaFin || '',
                        idempleado: selectedSchedule?.idempleado,
                      };
                      
                      const response = await clientApi.requestDiagnostic(payload);
                      
                      alert(`¡Diagnóstico reservado exitosamente! Ticket: ${response.ticket?.codticket}`);
                      
                      setShowReservationDetails(false);
                      setSelectedVehicle(null);
                      setSelectedDateForDiagnostic('');
                      setSelectedSchedule(null);
                      setReservationData({});
                    } catch (error: any) {
                      console.error('Error confirmando reserva:', error);
                      const mensajeError = error.response?.data?.message || (error as any).message || 'Error al confirmar la reserva';
                      alert(mensajeError);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-green-600/20 border border-green-500/50 text-green-300 rounded-lg hover:bg-green-600/30 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <span className="material-icons text-sm">check_circle</span>
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detalles Servicio Correctivo */}
        {showCorrectiveServiceDetails && selectedCorrectiveServiceData && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-white/10 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 border-b border-white/10 flex items-center justify-between sticky top-0">
                <h3 className="text-2xl font-bold text-white">Detalles del Servicio</h3>
                <button
                  onClick={() => {
                    setShowCorrectiveServiceDetails(false);
                    setSelectedCorrectiveServiceData(null);
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              {/* Contenido */}
              <div className="p-6 space-y-6">
                {/* Información del Vehículo */}
                {selectedVehicle && (
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <span className="material-icons">directions_car</span>
                      Información del Vehículo
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-400">Marca</label>
                        <p className="text-white font-medium">{selectedVehicle.marca}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-400">Modelo</label>
                        <p className="text-white font-medium">{selectedVehicle.modelo}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-400">Placa</label>
                        <p className="text-white font-medium">{selectedVehicle.placa}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-400">Año</label>
                        <p className="text-white font-medium">{selectedVehicle.fechafabricacion?.split('-')[0] || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Información General */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Código de Servicio</label>
                    <p className="text-white font-medium text-lg">{selectedCorrectiveServiceData.codservicio}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Tipo de Mantenimiento</label>
                    <p className="text-white font-medium text-lg">{selectedCorrectiveServiceData.tipomantenimiento}</p>
                  </div>
                </div>

                {/* Descripción */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Descripción</label>
                  <p className="text-white font-medium">{selectedCorrectiveServiceData.descripcion}</p>
                </div>

                {/* Detalles Técnicos */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Tarifa</label>
                    <p className="text-green-400 font-bold text-2xl">${selectedCorrectiveServiceData.tarifa}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Duración (minutos)</label>
                    <p className="text-blue-400 font-bold text-2xl">{selectedCorrectiveServiceData.duracion || 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Marca</label>
                    <p className="text-purple-400 font-bold text-lg">{selectedCorrectiveServiceData.marca || 'Todas'}</p>
                  </div>
                </div>

                {/* Operario Asignado */}
                {correctiveServiceOperario[selectedCorrectiveService] && (
                  <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <span className="material-icons">person</span>
                      Operario Asignado
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-400">Nombre Completo</label>
                        <p className="text-white font-medium">{correctiveServiceOperario[selectedCorrectiveService].nombreCompleto}</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-400">Especialidad</label>
                        <p className="text-white font-medium">{correctiveServiceOperario[selectedCorrectiveService].especialidad}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modelo */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Modelo</label>
                  <p className="text-white font-medium">{selectedCorrectiveServiceData.modelo || 'Aplicable a todos los modelos'}</p>
                </div>

                {/* Tabla de Resumen */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300 border border-white/10 rounded-lg">
                    <thead className="text-xs text-gray-300 uppercase bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3">Atributo</th>
                        <th className="px-4 py-3">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white/5 border-b border-white/10 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Código Servicio</td>
                        <td className="px-4 py-3 text-white">{selectedCorrectiveServiceData.codservicio}</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Descripción</td>
                        <td className="px-4 py-3 text-white">{selectedCorrectiveServiceData.descripcion}</td>
                      </tr>
                      <tr className="bg-white/5 border-b border-white/10 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Tarifa</td>
                        <td className="px-4 py-3 font-bold text-green-400">${selectedCorrectiveServiceData.tarifa}</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Duración</td>
                        <td className="px-4 py-3 text-white">{selectedCorrectiveServiceData.duracion} minutos</td>
                      </tr>
                      <tr className="bg-white/5 border-b border-white/10 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Marca</td>
                        <td className="px-4 py-3 text-white">{selectedCorrectiveServiceData.marca || 'Todas'}</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Modelo</td>
                        <td className="px-4 py-3 text-white">{selectedCorrectiveServiceData.modelo || 'Todos'}</td>
                      </tr>
                      <tr className="bg-white/5 hover:bg-white/10">
                        <td className="px-4 py-3 font-medium text-gray-300">Tipo de Mantenimiento</td>
                        <td className="px-4 py-3 text-white font-medium">{selectedCorrectiveServiceData.tipomantenimiento}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Botones */}
              <div className="bg-white/5 border-t border-white/10 p-6 flex justify-end gap-4 sticky bottom-0">
                <button
                  onClick={() => {
                    setShowCorrectiveServiceDetails(false);
                    setSelectedCorrectiveServiceData(null);
                  }}
                  className="px-6 py-2 bg-gray-600/30 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-colors font-medium"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowCorrectiveServiceDetails(false);
                  }}
                  className="px-6 py-2 bg-primary hover:bg-green-600 text-gray-900 rounded-lg transition-colors font-bold"
                >
                  Seleccionar Servicio
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

};
