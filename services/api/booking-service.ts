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
      Object.entries(queryParams || {}).filter(([, v]) => v !== undefined && v !== null)
    );

    const response = await apiService.get<ApiResponse<AppointmentDetailResponse[]>>(
      "/api/appointments",
      params as Record<string, string | number | boolean | string[]>
    );
    // Normalize items: some backends return only flat IDs (scheduleId, consultantId) without nested objects
    // Ensure UI-friendly shape by adding minimal `schedule` and `consultant` objects when missing
    try {
      const items = Array.isArray(response.data.data)
        ? response.data.data.map((it: unknown) => {
            const item = it as Record<string, unknown>;
            return {
              ...item,
              schedule:
                item.schedule ||
                (item.scheduleId
                  ? {
                      id: item.scheduleId,
                      startTime: item.startTime || item.createdAt,
                      endTime: item.endTime || item.updatedAt,
                      isAvailable: false,
                    }
                  : undefined),
              consultant:
                item.consultant ||
                (item.consultantId
                  ? {
                      id: item.consultantId,
                      fullName: undefined,
                      email: undefined,
                      phoneNumber: undefined,
                      avatar: null,
                    }
                  : undefined),
            } as AppointmentDetailResponse;
          })
        : (response.data.data as AppointmentDetailResponse[]);

      return {
        ...response.data,
        data: items,
      } as ApiResponse<AppointmentDetailResponse[]>;
    } catch {
      return response.data;
    }
  },

  // Cancel an appointment
  cancelAppointment: async (id: string): Promise<ApiResponse<AppointmentResponse>> => {
    const response = await apiService.patch<ApiResponse<AppointmentResponse>>(
      `/api/appointments/${id}/cancel`
    );
    return response.data;
  },

  // Update appointment (confirm/reject/reschedule) — use PATCH /api/appointments/{id}
  // Payload example: { for: 'ConfirmAppointment', notes?: string }
  updateAppointmentStatus: async (
    id: string,
    payload: Record<string, unknown>
  ): Promise<ApiResponse<AppointmentResponse>> => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[bookingService] updateAppointmentStatus payload:", { id, payload });
    }

    try {
      // Backend expects the body shape: { request: { ...fields } }
      const response = await apiService.patch<ApiResponse<AppointmentResponse>>(
        `/api/appointments/${id}`,
        { request: payload }
      );

      if (process.env.NODE_ENV === "development") {
        console.debug("[bookingService] updateAppointmentStatus response:", response?.data || response);
      }

      return response.data;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[bookingService] updateAppointmentStatus error:", error);
      }
      throw error;
    }
  },

  // Get my appointments (for current user)
  getMyAppointments: async (
    queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> => {
    const params = Object.fromEntries(
      Object.entries(queryParams || {}).filter(([, v]) => v !== undefined && v !== null)
    );

    try {
      const response = await apiService.get<ApiResponse<AppointmentDetailResponse[]>>(
        "/api/appointments/my-appointments",
        params as Record<string, string | number | boolean | string[]>
      );
      return response.data;
    } catch (err) {
      // If GET fails (405 or other), try POST fallback
      try {
        const response = await apiService.post<ApiResponse<AppointmentDetailResponse[]>>(
          "/api/appointments/my-appointments",
          params as Record<string, unknown>
        );
        return response.data;
      } catch (postErr) {
        throw postErr || err;
      }
    }
  },
};
