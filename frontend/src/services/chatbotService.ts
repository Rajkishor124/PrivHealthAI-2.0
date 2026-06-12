import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import type { ApiResponse, ChatMessage } from '../types';

export const chatbotService = {
  sendMessage: async (message: string): Promise<ApiResponse<ChatMessage>> => {
    const res = await axiosClient.post<ApiResponse<ChatMessage>>(
      ENDPOINTS.CHATBOT.CHAT,
      { message }
    );
    return res.data;
  },
};
