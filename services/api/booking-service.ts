// services/api/booking-service.ts
import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

export interface AppointmentBookingRequest {
  scheduleId: string;
  clientId?: string;
  notes: string;
}

export interface AppointmentResponse {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  scheduleId: string;
  clientId: string;
  consultantId: string;
}

export interface AppointmentDetailResponse extends AppointmentResponse {
  consultant?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar: string | null;
  };
  schedule?: {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  };
}

export interface AppointmentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  clientId?: string;
  consultantId?: string;
}

export const bookingService = {
  // Book an appointment
  bookAppointment: async (request: AppointmentBookingRequest): Promise<any> => {
    try {
      console.log("➡️ Booking Request:", request);
      const response = await apiService.post("/api/appointments", request);
      console.log("✅ Booking Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Booking Error:", error);
      // Nếu backend trả về lỗi dạng { message, isSuccess: false, ... }
      if (error.error) {
        return error.error; // để onError/onSuccess vẫn nhận được body backend
      }
      throw error;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id: string): Promise<ApiResponse<AppointmentDetailResponse>> => {
    const response = await apiService.get<ApiResponse<AppointmentDetailResponse>>(
      `/api/appointments/${id}`
    );
    return response.data;
  },

  // Get appointments with filtering and pagination
  getAppointments: async (
    queryParams?: AppointmentQueryParams
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> => {
    const params = Object.fromEntries(
      Object.entries(queryParams || {}).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await apiService.get<ApiResponse<AppointmentDetailResponse[]>>(
      "/api/appointments",
      params as Record<string, string | number | boolean | string[]>
    );
    return response.data;
  },

  // Cancel an appointment
  cancelAppointment: async (id: string): Promise<ApiResponse<AppointmentResponse>> => {
    const response = await apiService.patch<ApiResponse<AppointmentResponse>>(
      `/api/appointments/${id}/cancel`
    );
    return response.data;
  },

  // Update appointment status (for consultants)
  updateAppointmentStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<AppointmentResponse>> => {
    const response = await apiService.patch<ApiResponse<AppointmentResponse>>(
      `/api/appointments/${id}/status`,
      { status }
    );
    return response.data;
  },

  // Get my appointments (for current user)
  getMyAppointments: async (
    queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> => {
    const params = Object.fromEntries(
      Object.entries(queryParams || {}).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await apiService.get<ApiResponse<AppointmentDetailResponse[]>>(
      "/api/appointments/my-appointments",
      params as Record<string, string | number | boolean | string[]>
    );
    return response.data;
  },
};
