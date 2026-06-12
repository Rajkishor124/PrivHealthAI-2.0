import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  AuthResponse,
  RegisterRequest,
  SendOtpRequest,
  VerifyOtpRequest,
} from '../types';

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<null>> => {
    const response = await axiosClient.post<ApiResponse<null>>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data;
  },

  sendOtp: async (data: SendOtpRequest): Promise<ApiResponse<null>> => {
    const response = await axiosClient.post<ApiResponse<null>>(
      ENDPOINTS.AUTH.SEND_OTP,
      data
    );
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
    return response.data;
  },
};
