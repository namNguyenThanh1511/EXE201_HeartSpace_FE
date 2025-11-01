"use client";

import { useQuery } from "@tanstack/react-query";
import {
  appointmentsIdService,
  type AppointmentDetailResponse,
} from "@/services/api/appointment-id";

/** Hook: lấy chi tiết appointment theo ID */
export const useAppointmentById = (id?: string) => {
  return useQuery({
    queryKey: ["appointment-id", id ?? "-"],
    enabled: !!id,
    queryFn: async () => {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout after 8 seconds")), 8000)
        );
        const requestPromise = appointmentsIdService.getAppointmentById(id as string);
        const res = (await Promise.race([requestPromise, timeoutPromise])) as any;

        const appointment: AppointmentDetailResponse | undefined = res?.data ?? undefined;

        return {
          appointment,
          message: res.message ?? "",
          isSuccess: res.isSuccess ?? true,
          status: "success",
          code: res.code,
          errors: res.errors || [],
          metaData: res.metaData,
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "API timeout";
        return {
          appointment: undefined as unknown as AppointmentDetailResponse,
          message: "API timeout - no data",
          isSuccess: false,
          status: "error",
          code: 500,
          errors: [errorMessage],
          metaData: null,
        };
      }
    },
    select: (d) => d,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};
