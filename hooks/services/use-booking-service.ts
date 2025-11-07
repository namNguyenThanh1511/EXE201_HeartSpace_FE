import {
  AppointmentBookingRequest,
  AppointmentQueryParams,
  bookingService,
} from "@/services/api/booking-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AppointmentBookingRequest) => bookingService.bookAppointment(request),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Đặt lịch thành công!");
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
        queryClient.invalidateQueries({ queryKey: ["consultants"] });
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi đặt lịch");
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi đặt lịch";
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook để lấy danh sách appointments của consultant
 */
export const useConsultantAppointments = (queryParams?: AppointmentQueryParams) => {
  return useQuery({
    queryKey: ["appointments", "consultant", queryParams],
    queryFn: () => bookingService.getAppointments(queryParams),
    select: (data) => ({
      appointments: data.data,
      message: data.message,
      isSuccess: data.isSuccess,
    }),
  });
};

/**
 * Hook để cập nhật trạng thái appointment
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn expects an object: { id, payload }
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      bookingService.updateAppointmentStatus(id, payload),
    onSuccess: (data) => {
      if (data.isSuccess) {
        toast.success("Cập nhật trạng thái thành công!");
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments", "consultant"] });
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi cập nhật trạng thái");
      }
    },
    onError: (error: unknown) => {
      // Surface API error messages if available
      let errorMessage = "Có lỗi xảy ra khi cập nhật trạng thái";
      if (error && typeof error === "object") {
        const anyErr = error as { status?: number; message?: string; error?: { message?: string } };
        const apiMsg = anyErr.error?.message || anyErr.message;
        if (apiMsg) errorMessage = `${apiMsg} (mã lỗi ${anyErr.status ?? 400})`;
      }
      toast.error(errorMessage);
      if (process.env.NODE_ENV === "development") {
        console.debug("[useUpdateAppointment] onError:", error);
      }
    },
  });
};
