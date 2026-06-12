import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, Appointment, AppointmentRequest } from '../types';

export const appointmentService = {
  book: async (data: AppointmentRequest): Promise<ApiResponse<Appointment>> => {
    const res = await axiosClient.post<ApiResponse<Appointment>>(
      ENDPOINTS.APPOINTMENTS.BOOK,
      data,
    );
    return res.data;
  },

  getMine: async (): Promise<ApiResponse<Appointment[]>> => {
    const res = await axiosClient.get<ApiResponse<Appointment[]>>(ENDPOINTS.APPOINTMENTS.MINE);
    return res.data;
  },

  cancel: async (id: string): Promise<ApiResponse<Appointment>> => {
    const res = await axiosClient.patch<ApiResponse<Appointment>>(
      ENDPOINTS.APPOINTMENTS.CANCEL(id),
    );
    return res.data;
  },
};
