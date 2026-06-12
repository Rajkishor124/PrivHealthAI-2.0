import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, Doctor } from '../types';

interface FavoriteState {
  favorited: boolean;
}

export const favoriteService = {
  getMine: async (): Promise<ApiResponse<Doctor[]>> => {
    const res = await axiosClient.get<ApiResponse<Doctor[]>>(ENDPOINTS.FAVORITES.LIST);
    return res.data;
  },

  getStatus: async (doctorId: string): Promise<ApiResponse<FavoriteState>> => {
    const res = await axiosClient.get<ApiResponse<FavoriteState>>(
      ENDPOINTS.FAVORITES.STATUS(doctorId),
    );
    return res.data;
  },

  toggle: async (doctorId: string): Promise<ApiResponse<FavoriteState>> => {
    const res = await axiosClient.post<ApiResponse<FavoriteState>>(
      ENDPOINTS.FAVORITES.TOGGLE(doctorId),
    );
    return res.data;
  },
};
