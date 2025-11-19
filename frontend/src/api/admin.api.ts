import axiosInstance from './axiosInstance';

export const adminApi = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data.data;
  },

  getUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/admin/users', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getVehicles: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/admin/vehicles', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getMaintenance: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/admin/maintenance', {
      params: { page, limit },
    });
    return response.data.data;
  },

  getTickets: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get('/admin/tickets', {
      params: { page, limit },
    });
    return response.data.data;
  },
};
