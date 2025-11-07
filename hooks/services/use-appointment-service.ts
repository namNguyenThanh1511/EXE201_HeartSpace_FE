// hooks/services/use-appointment-service.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/zustand/auth-store";
import {
  appointmentService,
  type AppointmentQueryParams,
  type AppointmentDetailResponse,
  AppointmentUpdateRequest,
} from "@/services/api/appointment-service";
import { scheduleService } from "@/services/api/schedule-service";
import { toast } from "sonner";
import { m } from "framer-motion";

/** Lấy userId từ nhiều claim phổ biến (kể cả .NET nameidentifier) */
function extractUserIdFromClaims(user: unknown): string | undefined {
  if (!user) return undefined;

  const userObj = user as Record<string, unknown>;
  const directId =
    userObj.id ??
    userObj.userId ??
    userObj.sub ??
    userObj.nameid ??
    userObj.clientId ??
    userObj.consultantId ??
    userObj["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  if (directId) return String(directId);

  const payload: Record<string, unknown> =
    ((userObj.tokenPayload ?? userObj.decoded ?? userObj.profile) as Record<string, unknown>) ?? {};
  if (!payload) return undefined;

  const nestedId =
    payload.id ??
    payload.userId ??
    payload.sub ??
    payload.nameid ??
    payload.clientId ??
    payload.consultantId ??
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  return nestedId ? String(nestedId) : undefined;
}

function normalizeRole(role: unknown): "consultant" | "client" | "unknown" {
  const r = String(role ?? "")
    .trim()
    .toLowerCase();
  if (r === "consultant") return "consultant";
  if (r === "client" || r === "customer" || r === "user") return "client";
  return "unknown";
}

/**
 * Hook: lấy danh sách lịch hẹn theo user hiện tại
 * - Consultant → gắn consultantId, còn lại → clientId
 * - Chỉ gọi API khi đã có id
 * - Trả về { appointments, message, isSuccess }
 */
export const useMyAppointments = (queryParams?: AppointmentQueryParams) => {
  return useQuery({
    queryKey: ["myAppointments", queryParams],
    queryFn: async () => {
      const response = await appointmentService.getMyAppointments(queryParams);
      return {
        data: response.data,
      };
    },
  });
};

export const useGetAppointmentDetails = (id: string) => {
  // Giả định bạn đang sử dụng TanStack Query (React Query)
  const { data, ...query } = useQuery({
    queryKey: ["appointmentDetails", id],
    queryFn: () => appointmentService.getAppointmentDetails(id),
    enabled: !!id && id !== "loading" && id !== "error", // Chỉ fetch khi ID hợp lệ
  });

  return { data: data?.data, ...query };
};

// Update Appointment Hook
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: AppointmentUpdateRequest }) =>
      appointmentService.updateAppointment(id, request),
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        toast.success(data.message || "Cập nhật cuộc hẹn thành công");

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["appointmentDetails", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
      } else {
        toast.error(data.message || "Cập nhật cuộc hẹn thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật cuộc hẹn");
    },
  });
};

// Convenience hooks for specific actions
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.confirmAppointment(id),
    onSuccess: (data, id) => {
      if (data.isSuccess) {
        toast.success("Đã xác nhận cuộc hẹn thành công");
        queryClient.invalidateQueries({ queryKey: ["appointmentDetails", id] });
        queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      } else {
        toast.error(data.message || "Xác nhận cuộc hẹn thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi xác nhận cuộc hẹn");
    },
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.completeAppointment(id),
    onSuccess: (data, id) => {
      if (data.isSuccess) {
        toast.success("Đã hoàn thành cuộc hẹn");
        queryClient.invalidateQueries({ queryKey: ["appointmentDetails", id] });
        queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      } else {
        toast.error(data.message || "Hoàn thành cuộc hẹn thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi hoàn thành cuộc hẹn");
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      appointmentService.cancelAppointment(id, reason),
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        toast.success("Đã hủy cuộc hẹn thành công");
        queryClient.invalidateQueries({ queryKey: ["appointmentDetails", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      } else {
        toast.error(data.message || "Hủy cuộc hẹn thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi hủy cuộc hẹn");
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newScheduleId }: { id: string; newScheduleId: string }) =>
      appointmentService.rescheduleAppointment(id, newScheduleId),
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        toast.success("Đã đổi lịch hẹn thành công");
        queryClient.invalidateQueries({ queryKey: ["appointmentDetails", variables.id] });
        queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      } else {
        toast.error(data.message || "Đổi lịch hẹn thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi đổi lịch hẹn");
    },
  });
};

export const useAddNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      appointmentService.addNotes(id, notes),
    onSuccess: (data, variables) => {
      if (data.isSuccess) {
        toast.success("Đã thêm ghi chú thành công");
        queryClient.invalidateQueries({ queryKey: ["appointmentDetails", variables.id] });
      } else {
        toast.error(data.message || "Thêm ghi chú thất bại");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi thêm ghi chú");
    },
  });
};

// Hook to check if user can perform specific actions
export const useAppointmentActions = (appointment: AppointmentDetailResponse | undefined) => {
  const canConfirm = appointment?.status === "Pending";
  const canComplete = appointment?.status === "Paid";
  const canCancel =
    (appointment?.status === "Pending" || appointment?.status === "PendingPayment") &&
    !appointment?.reasonForCancellation;
  const canReschedule =
    appointment?.status === "PendingPayment" &&
    appointment?.schedule?.startTime &&
    new Date(appointment.schedule.startTime).getTime() - Date.now() > 8 * 60 * 60 * 1000;
  const canAddNotes = true; // Always allowed

  return {
    canConfirm,
    canComplete,
    canCancel,
    canReschedule,
    canAddNotes,
    isPending: appointment?.status === "Pending",
    isPendingPayment: appointment?.status === "PendingPayment",
    isConfirmed: appointment?.status === "Confirmed",
    isCompleted: appointment?.status === "Completed",
    isCancelled: appointment?.status === "Cancelled",
  };
};

export const useCancelAppointmentsAfterPayment = () => {
  return useMutation({
    mutationFn: (orderCode: number) =>
      appointmentService.cancelledAfterPaymentAppointments(orderCode),
  });
};

export const usePayingAppointment = () => {
  return useMutation({
    mutationFn: (orderCode: number) => appointmentService.payingAppointments(orderCode),
  });
};
