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
  [key: string]: string | number | undefined; // Add index signature
}

// services/api/appointment-service.ts

/** ===================== Types (Updated) ===================== */
// ... (AppointmentQueryParams giữ nguyên)

export interface AppointmentResponseItem {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  scheduleId: string;
  clientId: string;
  consultantId: string;

  // Thêm các trường nghiệp vụ:
  reasonForCancellation: string | null; // NEW: Lý do hủy
  amount: number; // NEW: Giá tiền (Decimal trong C# -> number/decimal trong TS)
  escrowAmount: number; // NEW: Tiền giữ tạm
  orderCode: number; // NEW: Mã đơn hàng/thanh toán
  meetingLink: string | null; // NEW: Link họp

  // Payment fields
  paymentUrl?: string | null;
  paymentStatus?: string;
  paymentDueDate?: string | null;
}

// services/api/appointment-service.ts

export interface AppointmentDetailResponse extends AppointmentResponseItem {
  // Thêm chi tiết UserDetails cho Client và Consultant
  client?: {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string | null;
    avatar: string | null;
  };
  consultant?: {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string | null;
    avatar: string | null;
  };

  // Cập nhật cấu trúc Schedule (thêm price)
  schedule?: {
    id: string;
    startTime: string;
    endTime: string;
    price: number; // NEW: Giá tiền của slot
    isAvailable: boolean;
  };

  // Thêm Session Details
  session?: {
    id: string;
    summary: string;
    rating: number;
    feedback: string;
    endAt: string;
  } | null; // Session có thể null
}

/** ===================== Helpers ===================== */
function buildParams(params?: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null)
  ) as Record<string, string | number | boolean | string[]>;
}

// Xử lý dữ liệu từ API response theo format mới
// services/api/appointment-service.ts

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

    // NEW: Thêm các trường nghiệp vụ
    reasonForCancellation: appointment.reasonForCancellation,
    amount: appointment.amount,
    escrowAmount: appointment.escrowAmount,
    orderCode: appointment.orderCode,
    meetingLink: appointment.meetingLink,

    // Payment fields
    paymentUrl: appointment.paymentUrl,
    paymentStatus: appointment.paymentStatus,
    paymentDueDate: appointment.paymentDueDate,

    // Thêm thông tin nested objects (Client, Consultant, Schedule, Session)
    client: appointment.client || undefined, // NEW: Thêm Client
    consultant: appointment.consultant || undefined,
    schedule: appointment.schedule || undefined,
    session: appointment.session || null, // NEW: Thêm Session
  };
}
// Update Appointment Types
export enum UpdateFor {
  ConfirmAppointment = "ConfirmAppointment",
  CompleteAppointment = "CompleteAppointment",
  CancelAppointment = "CancelAppointment",
  RescheduleAppointment = "RescheduleAppointment",
  AddNotes = "AddNotes",
}
export interface AppointmentUpdateRequest {
  for: UpdateFor;
  notes?: string;
  reasonForCancellation?: string;
  newScheduleId?: string;
  [key: string]: unknown; // Add index signature
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
    queryParams?: AppointmentQueryParams
  ): Promise<ApiResponse<AppointmentDetailResponse[]>> {
    return appointmentService.getAppointments(queryParams as AppointmentQueryParams);
  },
  async getAppointmentDetails(id: string): Promise<ApiResponse<AppointmentDetailResponse>> {
    const response = await apiService.get<ApiResponse<AppointmentDetailResponse>>(
      `api/appointments/${id}` // Endpoint API dự kiến
    );
    return response.data;
  },
  // Update Appointment
  async updateAppointment(
    id: string,
    request: AppointmentUpdateRequest
  ): Promise<ApiResponse<string>> {
    const response = await apiService.patch<ApiResponse<string>>(`api/appointments/${id}`, request);
    return response.data;
  },

  // Convenience methods for specific update types
  async confirmAppointment(id: string): Promise<ApiResponse<string>> {
    return this.updateAppointment(id, {
      for: UpdateFor.ConfirmAppointment,
    });
  },

  async completeAppointment(id: string): Promise<ApiResponse<string>> {
    return this.updateAppointment(id, {
      for: UpdateFor.CompleteAppointment,
    });
  },

  async cancelAppointment(id: string, reason: string): Promise<ApiResponse<string>> {
    return this.updateAppointment(id, {
      for: UpdateFor.CancelAppointment,
      reasonForCancellation: reason,
    });
  },

  async rescheduleAppointment(id: string, newScheduleId: string): Promise<ApiResponse<string>> {
    return this.updateAppointment(id, {
      for: UpdateFor.RescheduleAppointment,
      newScheduleId,
    });
  },

  async addNotes(id: string, notes: string): Promise<ApiResponse<string>> {
    return this.updateAppointment(id, {
      for: UpdateFor.AddNotes,
      notes,
    });
  },
  async cancelledAfterPaymentAppointments(orderCode: number): Promise<ApiResponse<string>> {
    const response = await apiService.patch<ApiResponse<string>>("api/appointments/cancel", {
      orderCode,
    });
    return response.data;
  },
  async payingAppointments(orderCode: number): Promise<ApiResponse<string>> {
    const response = await apiService.post<ApiResponse<string>>("api/appointments/paying", {
      orderCode,
    });
    return response.data;
  },
};
export type { AppointmentDetailResponse as TAppointmentDetailResponse };
