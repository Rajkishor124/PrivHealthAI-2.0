import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, AssessmentRequest, AssessmentResult } from '../types';

export const assessmentService = {
  submit: async (data: AssessmentRequest): Promise<ApiResponse<AssessmentResult>> => {
    const res = await axiosClient.post<ApiResponse<AssessmentResult>>(
      ENDPOINTS.ASSESSMENT.SUBMIT,
      data
    );
    return res.data;
  },
};
