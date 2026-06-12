import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, AdminAppointment, AdminStats, Doctor, PageResponse, User } from '../types';

export const adminService = {
  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const res = await axiosClient.get<ApiResponse<AdminStats>>(ENDPOINTS.ADMIN.STATS);
    return res.data;
  },

  getUsers: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<User>>> => {
    const res = await axiosClient.get<ApiResponse<PageResponse<User>>>(
      ENDPOINTS.ADMIN.USERS,
      { params: { page, size } }
    );
    return res.data;
  },

  getDoctors: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<Doctor>>> => {
    const res = await axiosClient.get<ApiResponse<PageResponse<Doctor>>>(
      ENDPOINTS.ADMIN.DOCTORS,
      { params: { page, size } }
    );
    return res.data;
  },

  getAppointments: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<AdminAppointment>>> => {
    const res = await axiosClient.get<ApiResponse<PageResponse<AdminAppointment>>>(
      ENDPOINTS.ADMIN.APPOINTMENTS,
      { params: { page, size } }
    );
    return res.data;
  },
};
