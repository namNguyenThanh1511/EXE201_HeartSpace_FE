import { AppointmentBookingRequest, bookingService } from "@/services/api/booking-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  console.log("hshs");
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
    onError: (error: any) => {
      toast.error(error.message || "Có lỗi xảy ra khi đặt lịch");
    },
  });
};
