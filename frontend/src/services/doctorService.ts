import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, Doctor, PageResponse } from '../types';

export const doctorService = {
  search: async (params: {
    specialization?: string;
    city?: string;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<Doctor>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Doctor>>>(
      ENDPOINTS.DOCTORS.SEARCH,
      { params }
    );
    return response.data;
  },

  getAll: async (
    page = 0,
    size = 20
  ): Promise<ApiResponse<PageResponse<Doctor>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<Doctor>>>(
      ENDPOINTS.DOCTORS.LIST,
      { params: { page, size } }
    );
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Doctor>> => {
    const response = await axiosClient.get<ApiResponse<Doctor>>(
      ENDPOINTS.DOCTORS.BY_ID(id)
    );
    return response.data;
  },
};
