// services/api/appointment-id.ts
import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

/** ===================== Types ===================== */
export interface PersonLite {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string | null;
}

export interface ScheduleLite {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price?: number;
}

export interface SessionLite {
  id: string;
  summary?: string;
  rating?: number;
  feedback?: string;
  endAt?: string;
}

export interface AppointmentDetailResponse {
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

  consultant?: PersonLite;
  client?: PersonLite;
  schedule?: ScheduleLite;

  // 🔥 bổ sung theo payload mới
  session?: SessionLite;
  reasonForCancellation?: string;
  amount?: number;
  escrowAmount?: number;
  orderCode?: number;
}

/** ===================== Helpers ===================== */
function safeJson<T>(maybeJson: unknown): T {
  if (typeof maybeJson === "string") {
    try {
      return JSON.parse(maybeJson) as T;
    } catch {
      console.warn("[appointment-id] JSON parse failed (text/plain body?)");
    }
  }
  return maybeJson as T;
}

function normalizeAppointmentData(appointment: any): AppointmentDetailResponse {
  if (!appointment) {
    // @ts-expect-error allow empty for runtime fallback
    return undefined;
  }
  return {
    id: appointment.id,
    status: appointment.status ?? "",
    notes: appointment.notes ?? "",
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    scheduleId: appointment.scheduleId,
    clientId: appointment.clientId,
    consultantId: appointment.consultantId,
    paymentUrl: appointment.paymentUrl ?? undefined,
    paymentStatus: appointment.paymentStatus ?? undefined,
    paymentDueDate: appointment.paymentDueDate ?? undefined,

    consultant: appointment.consultant
      ? {
          id: appointment.consultant.id,
          fullName: appointment.consultant.fullName,
          email: appointment.consultant.email,
          phoneNumber: appointment.consultant.phoneNumber,
          avatar: appointment.consultant.avatar ?? null,
        }
      : undefined,

    client: appointment.client
      ? {
          id: appointment.client.id,
          fullName: appointment.client.fullName,
          email: appointment.client.email,
          phoneNumber: appointment.client.phoneNumber,
          avatar: appointment.client.avatar ?? null,
        }
      : undefined,

    schedule: appointment.schedule
      ? {
          id: appointment.schedule.id,
          startTime: appointment.schedule.startTime,
          endTime: appointment.schedule.endTime,
          isAvailable: Boolean(appointment.schedule.isAvailable),
          price: appointment.schedule.price,
        }
      : undefined,

    // 🔥 map session + các trường mới
    session: appointment.session
      ? {
          id: appointment.session.id,
          summary: appointment.session.summary ?? "",
          rating: appointment.session.rating ?? 0,
          feedback: appointment.session.feedback ?? "",
          endAt: appointment.session.endAt,
        }
      : undefined,

    reasonForCancellation: appointment.reasonForCancellation ?? undefined,
    amount: typeof appointment.amount === "number" ? appointment.amount : undefined,
    escrowAmount: typeof appointment.escrowAmount === "number" ? appointment.escrowAmount : undefined,
    orderCode: typeof appointment.orderCode === "number" ? appointment.orderCode : undefined,
  };
}

/** ===================== Service ===================== */
export const appointmentsIdService = {
  async getAppointmentById(id: string): Promise<ApiResponse<AppointmentDetailResponse>> {
    const response = await apiService.get<ApiResponse<any>>(`api/appointments/${id}`);
    const wrapped = safeJson<ApiResponse<any>>(response.data);

    const hasDataProp = typeof wrapped === "object" && wrapped !== null && "data" in wrapped;
    const raw = hasDataProp ? (wrapped as any).data : wrapped;
    const normalized = normalizeAppointmentData(raw);

    return {
      ...(hasDataProp ? wrapped : { isSuccess: true, message: "", code: 200 }),
      data: normalized,
    } as ApiResponse<AppointmentDetailResponse>;
  },
};

export type { AppointmentDetailResponse as TAppointmentDetailResponse };
