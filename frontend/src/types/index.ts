export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'USER' | 'DOCTOR' | 'ADMIN';
  createdAt: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialization: string;
  qualification?: string;
  experienceYears?: number;
  hospital?: string;
  city?: string;
  country?: string;
  rating?: number;
  licenseNumber: string;
  contactInfo?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AuthResponse {
  token: string;
  phone: string;
  name: string;
  userId: string;
  role: string;
}

export interface AssessmentRequest {
  symptoms: string[];
  age: number;
  gender: string;
  additionalSymptoms?: string;
}

export interface PossibleCondition {
  name: string;
  likelihood: string;
  description: string;
}

export interface MedicineSuggestion {
  name: string;
  purpose: string;
  note: string;
}

export interface AssessmentResult {
  id: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  recommendation: string;
  symptoms: string[];
  additionalSymptoms?: string;
  age: number;
  gender: string;
  createdAt: string;
  aiPowered: boolean;
  possibleConditions: PossibleCondition[];
  medicines: MedicineSuggestion[];
  recommendedSpecialization?: string;
  aiAdvice?: string;
  recommendedDoctors: Doctor[];
}

export type ChatRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ChatStructured {
  type: 'symptom' | 'info';
  reply: string;
  summary: string;
  possibleCauses: string[];
  actions: string[];
  avoid: string[];
  riskLevel: ChatRiskLevel | null;
  recommendedSpecialist: string | null;
  emergencyWarning: string[];
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  createdAt: string;
  structured?: ChatStructured | null;
}

export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  totalAssessments: number;
  totalChatMessages: number;
  totalAppointments: number;
  highRiskAssessments: number;
  criticalRiskAssessments: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  mine: boolean;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}

export interface DoctorReviews {
  averageRating: number;
  reviewCount: number;
  canReview: boolean;
  myReview?: Review | null;
  reviews: Review[];
}

export interface AdminAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialization?: string;
  appointmentTime: string;
  status: AppointmentStatus;
  reason?: string;
  createdAt: string;
}

export type AppointmentStatus = 'BOOKED' | 'CANCELLED' | 'COMPLETED';

export interface AppointmentRequest {
  doctorId: string;
  appointmentTime: string; // ISO local date-time, e.g. 2026-06-20T10:00:00
  reason?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization?: string;
  hospital?: string;
  city?: string;
  appointmentTime: string;
  reason?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface RegisterRequest {
  name: string;
  phone: string;
  email?: string;
}

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}
