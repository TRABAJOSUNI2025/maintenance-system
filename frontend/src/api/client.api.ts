import axiosInstance from './axiosInstance';

const API_BASE = '/client';

export const clientApi = {
  /**
   * Obtener perfil del cliente
   */
  getProfile: async () => {
    const response = await axiosInstance.get(`${API_BASE}/profile`);
    return response.data;
  },

  /**
   * Obtener vehículos del cliente
   */
  getVehicles: async () => {
    const response = await axiosInstance.get(`${API_BASE}/vehicles`);
    return response.data;
  },

  /**
   * Obtener mantenimientos correctivos
   */
  getMaintenanceCorrectivo: async () => {
    const response = await axiosInstance.get(`${API_BASE}/maintenance-correctivo`);
    return response.data;
  },

  /**
   * Obtener mantenimientos preventivos
   */
  getMaintenancePreventivo: async () => {
    const response = await axiosInstance.get(`${API_BASE}/maintenance-preventivo`);
    return response.data;
  },

  /**
   * Obtener diagnósticos
   */
  getDiagnostics: async () => {
    const response = await axiosInstance.get(`${API_BASE}/diagnostics`);
    return response.data;
  },

  /**
   * Obtener diagnósticos solicitados
   */
  getDiagnosticsRequested: async () => {
    const response = await axiosInstance.get(`${API_BASE}/diagnostics/requested`);
    return response.data;
  },

  /**
   * Obtener servicios recientes
   */
  getRecentServices: async () => {
    const response = await axiosInstance.get(`${API_BASE}/recent-services`);
    return response.data;
  },

  /**
   * Registrar nuevo vehículo
   */
  registerVehicle: async (vehicleData: {
    placa: string;
    marca: string;
    modelo: string;
    fechafabricacion: string;
    kilometraje: number;
  }) => {
    const response = await axiosInstance.post(`${API_BASE}/vehicles/register`, vehicleData);
    return response.data;
  },

  /**
   * Actualizar datos personales del cliente
   */
  updateProfile: async (profileData: {
    nombre?: string;
    apepaterno?: string;
    apematerno?: string;
    telefono?: string;
    correo?: string;
  }) => {
    const response = await axiosInstance.post(`${API_BASE}/profile/update`, profileData);
    return response.data;
  },

  /**
   * Obtener horarios disponibles para una fecha específica
   */
  getAvailableSchedules: async (fecha: string) => {
    const response = await axiosInstance.get(`${API_BASE}/diagnostics/schedules`, {
      params: { fecha },
    });
    return response.data;
  },

  /**
   * Solicitar diagnóstico
   */
  requestDiagnostic: async (diagnosticData: {
    codvehiculo: string;
    fecha: string;
    horainicio: string;
    horafin: string;
    idempleado?: number;
  }) => {
    const response = await axiosInstance.post(`${API_BASE}/diagnostics/request`, diagnosticData);
    return response.data;
  },

  /**
   * Obtener servicios correctivos
   */
  getCorrectiveServices: async () => {
    const response = await axiosInstance.get(`${API_BASE}/corrective-services`);
    return response.data;
  },

  /**
   * Obtener operario disponible para una fecha y hora
   */
  getAvailableOperario: async (fecha: string, horainicio: string) => {
    const response = await axiosInstance.get(`${API_BASE}/operario/${fecha}/${horainicio}`);
    return response.data;
  },

  /**
   * Solicitar servicio correctivo
   */
  requestCorrectiveService: async (correctiveData: {
    codvehiculo: string;
    codservicio: string;
    fecha: string;
    horainicio: string;
    idempleado?: number;
  }) => {
    const response = await axiosInstance.post(`${API_BASE}/corrective-service/request`, correctiveData);
    return response.data;
  },

  /**
   * Solicitar servicio preventivo
   */
  requestPreventiveService: async (preventiveData: {
    codvehiculo: string;
    codhorariodisp: string;
    kilometraje: number;
  }) => {
    const response = await axiosInstance.post(`${API_BASE}/preventive-service/request`, preventiveData);
    return response.data;
  },
};
