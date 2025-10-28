// hooks/services/use-appointment-service.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/zustand/auth-store";
import {
  appointmentService,
  type AppointmentQueryParams,
  type AppointmentDetailResponse,
} from "@/services/api/appointment-service";
import { scheduleService } from "@/services/api/schedule-service";

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

  const payload: Record<string, unknown> = (userObj.tokenPayload ?? userObj.decoded ?? userObj.profile) as Record<string, unknown> ?? {};
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
  const r = String(role ?? "").trim().toLowerCase();
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
export const useMyAppointments = (
  queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
) => {
  const { user } = useAuthStore();

  const roleNorm = normalizeRole((user as unknown as Record<string, unknown>)?.role);
  const id = extractUserIdFromClaims(user);

  const effectiveParams: AppointmentQueryParams = {
    ...(queryParams || {}),
    ...(roleNorm === "consultant" && id ? { consultantId: id } : {}),
    ...(roleNorm !== "consultant" && id ? { clientId: id } : {}),
  };

  return useQuery({
    queryKey: ["appointments", roleNorm, id ?? "-", effectiveParams],
    enabled: !!id, // ✅ chỉ chạy khi có id
    queryFn: async () => {
      try {
        console.log("[useMyAppointments] Fetching appointments with params:", effectiveParams);
        
        // Thêm timeout cho request
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout after 8 seconds')), 8000);
        });
        
        const requestPromise = appointmentService.getAppointments(effectiveParams);
        
        const res = await Promise.race([requestPromise, timeoutPromise]) as any;
        console.log("[useMyAppointments] API response:", res);

        // Xử lý dữ liệu từ API response theo format mới
        const appointments: AppointmentDetailResponse[] = Array.isArray(res.data) 
          ? res.data 
          : [];

        // Note: Schedule information is not being fetched separately 
        // because the endpoint doesn't exist or returns 404
        // The appointments should already include schedule info if the API provides it
        
        return {
          appointments: appointments,
          message: res.message ?? "",
          isSuccess: res.isSuccess ?? true,
          status: "success",
          code: res.code,
          errors: res.errors || [],
          metaData: res.metaData,
        };
      } catch (error: unknown) {
        console.error("[useMyAppointments] Error fetching appointments:", error);
        
        // Trả về mock data khi API lỗi
        const mockAppointments: AppointmentDetailResponse[] = [
          {
            id: "mock-1",
            clientId: "client-001",
            consultantId: id || "consultant-001",
            scheduleId: "schedule-001",
            status: "confirmed",
            notes: "Tư vấn về sức khỏe tâm lý",
            paymentStatus: "paid",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            schedule: {
              id: "schedule-001",
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
              isAvailable: false
            }
          },
          {
            id: "mock-2", 
            clientId: "client-002",
            consultantId: id || "consultant-001",
            scheduleId: "schedule-002",
            status: "pending",
            notes: "Hỗ trợ stress công việc",
            paymentStatus: "pending",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            schedule: {
              id: "schedule-002",
              startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
              isAvailable: false
            }
          }
        ];
        
        const errorMessage = error instanceof Error ? error.message : "API timeout";
        
        return {
          appointments: mockAppointments,
          message: "API timeout - showing mock data",
          isSuccess: false,
          status: "error",
          code: 500,
          errors: [errorMessage],
          metaData: null,
        };
      }
    },
    select: (d) => d,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: 2, // Retry 2 lần
    retryDelay: 1000, // Delay 1 giây giữa các lần retry
  });
};
