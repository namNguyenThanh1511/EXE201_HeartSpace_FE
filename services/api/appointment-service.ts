// services/api/appointment-service.ts
import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

/** ===================== Types ===================== */
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
  paymentUrl?: string;
  paymentStatus?: string;
  paymentDueDate?: string;
}

export interface AppointmentDetailResponse extends AppointmentResponseItem {
  consultant?: {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    avatar: string | null;
  };
  schedule?: {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  };
}

/** ===================== Helpers ===================== */
function buildParams(params?: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null)
  ) as Record<string, string | number | boolean | string[]>;
}

// Xử lý dữ liệu từ API response theo format mới
function normalizeAppointmentData(appointment: any): AppointmentDetailResponse {
  return {
    id: appointment.id,
    status: appointment.status,
    notes: appointment.notes,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    scheduleId: appointment.scheduleId,
    clientId: appointment.clientId,
    consultantId: appointment.consultantId,
    paymentUrl: appointment.paymentUrl,
    paymentStatus: appointment.paymentStatus,
    paymentDueDate: appointment.paymentDueDate,
    // Thêm thông tin consultant và schedule nếu có
    consultant: appointment.consultant || undefined,
    schedule: appointment.schedule || undefined,
  };
}

/** ===================== Service ===================== */
export const appointmentService = {
  async getAppointments(
    queryParams?: AppointmentQueryParams
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> {
    console.log("[appointmentService] getAppointments called with params:", queryParams);
    console.log("[appointmentService] buildParams result:", buildParams(queryParams));
    
    const response = await apiService.get<ApiResponse<AppointmentDetailResponse[]>>(
      "api/appointments",
      buildParams(queryParams)
    );
    
    console.log("[appointmentService] Raw API response:", response);

    // Xử lý dữ liệu từ API response
    const appointments = Array.isArray(response.data.data) 
      ? response.data.data.map(normalizeAppointmentData)
      : [];

    return {
      ...response.data,
      data: appointments,
    };
  },

  async getMyAppointments(
    queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> {
    return appointmentService.getAppointments(queryParams as AppointmentQueryParams);
  },
};

export type { AppointmentDetailResponse as TAppointmentDetailResponse };
