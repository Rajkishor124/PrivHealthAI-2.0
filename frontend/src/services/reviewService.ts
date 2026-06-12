import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, DoctorReviews, Review, ReviewRequest } from '../types';

export const reviewService = {
  getForDoctor: async (doctorId: string): Promise<ApiResponse<DoctorReviews>> => {
    const res = await axiosClient.get<ApiResponse<DoctorReviews>>(
      ENDPOINTS.REVIEWS.FOR_DOCTOR(doctorId),
    );
    return res.data;
  },

  submit: async (doctorId: string, data: ReviewRequest): Promise<ApiResponse<Review>> => {
    const res = await axiosClient.post<ApiResponse<Review>>(
      ENDPOINTS.REVIEWS.FOR_DOCTOR(doctorId),
      data,
    );
    return res.data;
  },

  remove: async (reviewId: string): Promise<ApiResponse<null>> => {
    const res = await axiosClient.delete<ApiResponse<null>>(ENDPOINTS.REVIEWS.DELETE(reviewId));
    return res.data;
  },
};
