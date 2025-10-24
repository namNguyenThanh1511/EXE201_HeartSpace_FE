import { AppointmentQueryParams } from "@/services/api/appointment-service";
import { appointmentService } from "@/services/api/appointment-service";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/zustand/auth-store";

/**
 * useMyAppointments: Lấy danh sách các cuộc hẹn của người dùng hiện tại
 * Theo convention của project: hook mỏng gọi service ở services/api
 */
export const useMyAppointments = (
  queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
) => {
  const { user } = useAuthStore();
  const clientId = user?.id;

  return useQuery({
    queryKey: ["my-appointments", { ...queryParams, clientId }],
    // Robust fallback chain to maximize compatibility across environments
    queryFn: async () => {
      // Attempt 1: dedicated endpoint /my-appointments (may return 405)
      try {
        const res = await appointmentService.getMyAppointments(queryParams);
        if (Array.isArray(res.data)) return res;
      } catch (err: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.debug("[useMyAppointments] getMyAppointments failed, falling back", err);
        }
      }

      // Attempt 2: filter by clientId on /appointments
      try {
        const resClientId = await appointmentService.getAppointments({ ...(queryParams || {}), clientId });
        if (Array.isArray(resClientId.data) && resClientId.data.length > 0) return resClientId;
      } catch (err: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.debug("[useMyAppointments] getAppointments with clientId failed", err);
        }
      }

      // Attempt 3: alternate param name (clientID)
      try {
        const altParams: Record<string, unknown> = { ...(queryParams || {}) };
        if (clientId) altParams["clientID"] = clientId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resAlt = await appointmentService.getAppointments(altParams as any);
        if (Array.isArray(resAlt.data) && resAlt.data.length > 0) return resAlt;
      } catch (err: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.debug("[useMyAppointments] getAppointments with clientID failed", err);
        }
      }

      // Final attempt: unfiltered list (server may scope by token)
      try {
        return await appointmentService.getAppointments(queryParams);
      } catch (err: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error("[useMyAppointments] all attempts failed", err);
        }
        // Return an empty, safe ApiResponse shape so UI renders empty list
        return {
          data: [],
          message: "",
          isSuccess: false,
        } as { data: unknown[]; message?: string; isSuccess: boolean };
      }
    },
    select: (data) => ({
      appointments: data.data,
      message: data.message,
      isSuccess: data.isSuccess,
    }),
    // Allow the query to run even if clientId is not present in the token.
    // The backend's /my-appointments endpoint should scope data using the auth token.
    enabled: true,
  });
};


 