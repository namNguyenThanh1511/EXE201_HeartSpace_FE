// services/api/appointment-service.ts
import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

// Re-declare the minimal types used by UI (aligned with booking-service)
export interface AppointmentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  clientId?: string;
  consultantId?: string;
}

export interface AppointmentResponseItem {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  scheduleId: string;
  clientId: string;
  consultantId: string;
}

export interface AppointmentDetailResponse extends AppointmentResponseItem {
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

export const appointmentService = {
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
    // Normalize items: ensure nested objects exist for UI display when backend returns only IDs
    try {
      const items = Array.isArray(response.data.data)
        ? response.data.data.map((it: unknown) => {
            const item = it as Record<string, unknown>;
            return {
              ...item,
              schedule:
                (item.schedule as any) ||
                (item.scheduleId
                  ? {
                      id: item.scheduleId,
                      startTime: (item as any).startTime || (item as any).createdAt,
                      endTime: (item as any).endTime || (item as any).updatedAt,
                      isAvailable: false,
                    }
                  : undefined),
              consultant:
                (item.consultant as any) ||
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

  // Prefer backend endpoint if available; keep for parity with other services
  getMyAppointments: async (
    queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> => {
    const params = Object.fromEntries(
      Object.entries(queryParams || {}).filter(([, v]) => v !== undefined && v !== null)
    );

    // Some backends expose /my-appointments only via POST (or disable GET). Try GET first and fall back to POST on 405.
    try {
      const response = await apiService.get<ApiResponse<AppointmentDetailResponse[]>>(
        "/api/appointments/my-appointments",
        params as Record<string, string | number | boolean | string[]>
      );

      if (process.env.NODE_ENV === "development") {
        console.debug("[appointmentService] GET /my-appointments response:", response?.data || response);
      }

      const items = Array.isArray(response.data.data)
        ? response.data.data.map((it: unknown) => {
            const item = it as Record<string, unknown>;
            return {
              ...item,
              schedule:
                (item.schedule as any) ||
                (item.scheduleId
                  ? {
                      id: item.scheduleId,
                      startTime: (item as any).startTime || (item as any).createdAt,
                      endTime: (item as any).endTime || (item as any).updatedAt,
                      isAvailable: false,
                    }
                  : undefined),
              consultant:
                (item.consultant as any) ||
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
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[appointmentService] GET /my-appointments failed:", err);
      }
      // On any GET failure, attempt POST fallback because some servers require POST for this route
      try {
        const response = await apiService.post<ApiResponse<AppointmentDetailResponse[]>>(
          "/api/appointments/my-appointments",
          params as Record<string, unknown>
        );

        if (process.env.NODE_ENV === "development") {
          console.debug("[appointmentService] POST /my-appointments response:", response?.data || response);
        }

        const items = Array.isArray(response.data.data)
          ? response.data.data.map((it: unknown) => {
              const item = it as Record<string, unknown>;
              // @ts-expect-error - normalization from unknown api shape
              const schedule = item.schedule || (item.scheduleId ? { id: (item as any).scheduleId, startTime: (item as any).startTime || (item as any).createdAt, endTime: (item as any).endTime || (item as any).updatedAt, isAvailable: false } : undefined);
              // @ts-expect-error - normalization from unknown api shape
              const consultant = item.consultant || (item.consultantId ? { id: (item as any).consultantId, fullName: undefined, email: undefined, phoneNumber: undefined, avatar: null } : undefined);
              return {
                ...item,
                // @ts-expect-error
                schedule,
                // @ts-expect-error
                consultant,
              } as AppointmentDetailResponse;
            })
          : (response.data.data as AppointmentDetailResponse[]);

        return {
          ...response.data,
          data: items,
        } as ApiResponse<AppointmentDetailResponse[]>;
      } catch (postErr) {
        // rethrow the original error or the post error
        throw postErr || err;
      }
    }
  },
};


