import axiosInstance from './axiosInstance';

export const operatorApi = {
  getProfile: async () => {
    const response = await axiosInstance.get('/operator/profile');
    return response.data;
  },

  getAssignedTickets: async () => {
    const response = await axiosInstance.get('/operator/assigned-tickets');
    return response.data;
  },

  getMaintenancePerformed: async () => {
    const response = await axiosInstance.get('/operator/maintenance-performed');
    return response.data;
  },

  getDiagnosticsPerformed: async () => {
    const response = await axiosInstance.get('/operator/diagnostics-performed');
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get('/operator/stats');
    return response.data;
  },

  getRecentWork: async () => {
    const response = await axiosInstance.get('/operator/recent-work');
    return response.data;
  },
};
