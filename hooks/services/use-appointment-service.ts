// hooks/services/use-appointment-service.ts
"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/zustand/auth-store";
import {
  appointmentService,
  type AppointmentQueryParams,
  type AppointmentDetailResponse,
} from "@/services/api/appointment-service";

/** --- Helpers: Ưu tiên lấy userId từ store/context --- */
function extractUserIdFromStoreContext(storeUser: unknown): string | undefined {
  if (!storeUser) return undefined;
  const u = storeUser as Record<string, unknown>;
  // Các khả năng phổ biến khi app lưu user vào store
  return (
    (u.userId as string) ||
    (u.id as string) ||
    (u.profile as any)?.id ||
    (u.context as any)?.userId ||
    (u.account as any)?.id ||
    undefined
  );
}

/** Fallback: Lấy userId từ các claim (giữ nguyên cách cũ) */
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
    ((userObj.tokenPayload ?? userObj.decoded ?? userObj.profile) as Record<
      string,
      unknown
    >) ?? {};

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
 * - Ưu tiên userId từ store/context; fallback claims; cuối cùng tới localStorage("lastUserId")
 * - Consultant → gắn consultantId, còn lại → clientId
 * - Chỉ gọi API khi đã có id
 */
export const useMyAppointments = (
  queryParams?: Omit<AppointmentQueryParams, "clientId" | "consultantId">
) => {
  // Lấy user & role từ store (context) — KHÔNG phụ thuộc token
  const { user } = useAuthStore();

  // 1) Ưu tiên id từ store/context
  const idFromStore = useMemo(() => extractUserIdFromStoreContext(user), [user]);

  // 2) Fallback: id từ claims/token (cách cũ, phòng khi store không chứa thẳng id)
  const idFromClaims = useMemo(() => extractUserIdFromClaims(user), [user]);

  // 3) Fallback cuối: localStorage (để “nhớ” ngay sau khi thanh toán/logout)
  const idFromStorage =
    typeof window !== "undefined" ? window.localStorage.getItem("lastUserId") ?? undefined : undefined;

  // id hiệu lực theo thứ tự ưu tiên
  const id = idFromStore || idFromClaims || idFromStorage || undefined;

  // Ghi nhớ id vào localStorage mỗi khi có id mới từ store/claims
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = idFromStore || idFromClaims;
    if (next) {
      try {
        window.localStorage.setItem("lastUserId", String(next));
      } catch {
        /* ignore quota */
      }
    }
  }, [idFromStore, idFromClaims]);

  // Lấy role từ store/context (nếu không có coi là unknown)
  const roleNorm = normalizeRole((user as any)?.role);

  // Xây params gắn id theo role
  const effectiveParams: AppointmentQueryParams = {
    ...(queryParams || {}),
    ...(roleNorm === "consultant" && id ? { consultantId: id } : {}),
    ...(roleNorm !== "consultant" && id ? { clientId: id } : {}),
  };

  return useQuery({
    queryKey: ["appointments", roleNorm, id ?? "-", effectiveParams],
    // Nếu muốn block khi role chưa xác định, đổi thành: !!id && roleNorm !== "unknown"
    enabled: !!id,
    queryFn: async () => {
      try {
        console.log("[useMyAppointments] Params:", effectiveParams);

        // Timeout bảo vệ UI
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timeout after 8 seconds")), 8000);
        });

        const requestPromise = appointmentService.getAppointments(effectiveParams);
        const res = (await Promise.race([requestPromise, timeoutPromise])) as any;

        const appointments: AppointmentDetailResponse[] = Array.isArray(res.data) ? res.data : [];

        return {
          appointments,
          message: res.message ?? "",
          isSuccess: res.isSuccess ?? true,
          status: "success",
          code: res.code,
          errors: res.errors || [],
          metaData: res.metaData,
        };
      } catch (error: unknown) {
        console.error("[useMyAppointments] Error:", error);

        // Mock tối thiểu để UI không vỡ (cân nhắc bỏ nếu không cần)
        const now = Date.now();
        const mockAppointments: AppointmentDetailResponse[] = [
          {
            id: "mock-1",
            clientId: roleNorm === "consultant" ? "client-001" : id || "client-001",
            consultantId: roleNorm === "consultant" ? id || "consultant-001" : "consultant-001",
            scheduleId: "schedule-001",
            status: "confirmed",
            notes: "Tư vấn về sức khỏe tâm lý",
            paymentStatus: "paid",
            createdAt: new Date(now).toISOString(),
            updatedAt: new Date(now).toISOString(),
            schedule: {
              id: "schedule-001",
              startTime: new Date(now).toISOString(),
              endTime: new Date(now + 30 * 60 * 1000).toISOString(),
              isAvailable: false,
            },
          },
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
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};
