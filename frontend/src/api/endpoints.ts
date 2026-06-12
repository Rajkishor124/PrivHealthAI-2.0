export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  DOCTORS: {
    LIST: '/doctors',
    SEARCH: '/doctors/search',
    BY_ID: (id: string) => `/doctors/${id}`,
  },
  ASSESSMENT: {
    SUBMIT: '/assessment',
  },
  CHATBOT: {
    CHAT: '/chatbot',
  },
  APPOINTMENTS: {
    BOOK: '/appointments',
    MINE: '/appointments/me',
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
  },
  REVIEWS: {
    FOR_DOCTOR: (doctorId: string) => `/doctors/${doctorId}/reviews`,
    DELETE: (reviewId: string) => `/reviews/${reviewId}`,
  },
  FAVORITES: {
    LIST: '/favorites',
    STATUS: (doctorId: string) => `/favorites/${doctorId}`,
    TOGGLE: (doctorId: string) => `/favorites/${doctorId}/toggle`,
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    DOCTORS: '/admin/doctors',
    APPOINTMENTS: '/admin/appointments',
  },
} as const;
