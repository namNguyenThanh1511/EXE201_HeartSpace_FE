"use client";

import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Filter } from "lucide-react";

// ⚠️ Dùng đúng hook và type từ appointment-service bạn đã tạo
import { useMyAppointments } from "@/hooks/services/use-appointment-service";
import type { AppointmentDetailResponse } from "@/services/api/appointment-service";
import { consultantService } from "@/services/api/consultant-service";
import { useQuery } from "@tanstack/react-query";

/* ====================== Utils ====================== */
function toLocalHM(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getConsultantDisplayInfo(
  consultantId?: string,
  consultant?: { fullName?: string; email?: string }
): { name: string; subText?: string } {
  // Try to get consultant name from the consultant object
  if (consultant?.fullName) {
    return {
      name: consultant.fullName,
      subText: consultant.email || consultantId ? `ID: ${consultantId?.slice(0, 8)}...` : undefined,
    };
  }

  // Fallback to consultantId if no name available
  return {
    name: consultantId ? `Consultant ${consultantId.slice(0, 8)}...` : "Chưa có thông tin",
    subText: consultantId ? `ID: ${consultantId}` : undefined,
  };
}

function formatAppointmentStatus(status?: string) {
  switch (status) {
    case "Pending":
      return {
        text: "Chờ xác nhận",
        variant: "secondary" as const,
      };
    case "PendingPayment":
      return {
        text: "Chờ thanh toán",
        variant: "outline" as const,
      };
    case "Paid":
      return {
        text: "Đã thanh toán",
        variant: "default" as const,
      };
    case "Completed":
      return {
        text: "Hoàn thành",
        variant: "default" as const,
      };
    case "Cancelled":
      return {
        text: "Đã hủy",
        variant: "destructive" as const,
      };
    default:
      return {
        text: "Chưa xác định",
        variant: "secondary" as const,
      };
  }
}

function formatPaymentStatus(paymentUrl?: string, paymentStatus?: string) {
  if (paymentUrl) {
    return {
      type: "button" as const,
      text: "Thanh toán",
      url: paymentUrl,
    };
  }

  if (paymentStatus) {
    return {
      type: "status" as const,
      text:
        paymentStatus === "PendingPayment"
          ? "Chờ thanh toán"
          : paymentStatus === "Paid"
          ? "Đã thanh toán"
          : paymentStatus === "Failed"
          ? "Thanh toán thất bại"
          : paymentStatus,
      variant: (paymentStatus === "Paid"
        ? "default"
        : paymentStatus === "PendingPayment"
        ? "secondary"
        : "destructive") as "default" | "secondary" | "destructive",
    };
  }

  return {
    type: "status" as const,
    text: "Chưa có thông tin",
    variant: "secondary" as const,
  };
}

// Component để render từng appointment row
function AppointmentRow({ ev }: { ev: AppointmentDetailResponse }) {
  const paymentInfo = formatPaymentStatus(ev.paymentUrl, ev.paymentStatus);
  const statusInfo = formatAppointmentStatus(ev.status);

  // Fetch consultant info if not already available
  const { data: fetchedConsultant, isLoading: isLoadingConsultant } = useQuery({
    queryKey: ["consultant", ev.consultantId],
    enabled: !!ev.consultantId && !ev.consultant,
    queryFn: async () => {
      if (!ev.consultantId) return null;
      try {
        const res = await consultantService.getConsultantById(ev.consultantId);
        return res.data;
      } catch {
        return null;
      }
    },
  });

  // Use consultant from appointment first, then from fetched data
  const consultant = ev.consultant || fetchedConsultant;
  const consultantInfo = getConsultantDisplayInfo(ev.consultantId, consultant || undefined);

  // Endpoint /api/schedules/{scheduleId} trả về 404, vì vậy không fetch schedule nữa
  // Sử dụng schedule có sẵn trong appointment nếu có, nếu không thì dùng createdAt và updatedAt
  const schedule = ev.schedule;

  // Xác định start và end time
  // Nếu có schedule trong appointment thì dùng schedule.startTime và schedule.endTime
  // Nếu không có thì fallback về createdAt và updatedAt
  const startTime = schedule?.startTime || ev.createdAt;
  const endTime = schedule?.endTime || ev.updatedAt;

  // Ngày lấy từ date của startTime
  const appointmentDate = new Date(startTime);

  return (
    <TableRow key={ev.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={consultant?.avatar || undefined} alt={consultantInfo.name} />
            <AvatarFallback>
              {isLoadingConsultant ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getInitials(consultantInfo.name)
              )}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="font-medium leading-none">{consultantInfo.name}</div>
            {consultantInfo.subText && (
              <div className="text-xs text-muted-foreground">{consultantInfo.subText}</div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap">{toLocalHM(startTime)}</TableCell>

      <TableCell className="whitespace-nowrap">{toLocalHM(endTime)}</TableCell>

      <TableCell className="whitespace-nowrap">
        {appointmentDate.toLocaleDateString("vi-VN")}
      </TableCell>

      <TableCell>
        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
      </TableCell>

      <TableCell>
        {paymentInfo.type === "button" ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(paymentInfo.url, "_blank")}
          >
            {paymentInfo.text}
          </Button>
        ) : (
          <Badge variant={paymentInfo.variant}>{paymentInfo.text}</Badge>
        )}
      </TableCell>

      <TableCell className="text-right">
        <div className="inline-flex items-center gap-3">
          <Link href={`/meeting/${ev.id}`} className="text-sm text-primary hover:underline">
            Mở
          </Link>
          <Link
            href={`/user/consultants/${ev.consultant?.id || ev.consultantId}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            Hồ sơ
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ====================== Page ====================== */
export default function AppointmentsPage() {
  const [query, setQuery] = useState("");
  // Có thể truyền filter/pagination tại đây nếu muốn
  const { data, isLoading, isError } = useMyAppointments({ pageNumber: 1, pageSize: 200 });

  // Search theo tên consultant/ghi chú/trạng thái thanh toán
  const items = useMemo(() => {
    const rawItems = (data?.appointments || []) as AppointmentDetailResponse[];
    if (!query.trim()) return rawItems;
    const q = query.toLowerCase();
    return rawItems.filter((ev) => {
      const consultantInfo = getConsultantDisplayInfo(ev.consultantId, ev.consultant);
      const consultantName = consultantInfo.name.toLowerCase();
      const notes = ev.notes?.toLowerCase() || "";
      const paymentStatus = ev.paymentStatus?.toLowerCase() || "";
      const consultantId = ev.consultantId?.toLowerCase() || "";
      return (
        consultantName.includes(q) ||
        notes.includes(q) ||
        paymentStatus.includes(q) ||
        consultantId.includes(q)
      );
    });
  }, [data?.appointments, query]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Lịch đã đặt</h1>
          <p className="text-sm text-muted-foreground">Danh sách các cuộc hẹn của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo tên consultant, ghi chú hoặc trạng thái thanh toán..."
            className="w-72"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tổng số: {items.length}</CardTitle>
          <CardDescription>
            {isLoading
              ? "Đang tải dữ liệu lịch hẹn…"
              : isError
              ? "❌ Lỗi kết nối API. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau."
              : data?.isSuccess
              ? data?.message || "Bạn có thể mở phòng họp hoặc xem hồ sơ chuyên gia."
              : `❌ Lỗi: ${data?.message || "Không thể tải dữ liệu"}`}
          </CardDescription>
          {data?.errors && data.errors.length > 0 && (
            <div className="text-sm text-red-600 mt-2">Chi tiết lỗi: {data.errors.join(", ")}</div>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Bắt đầu</TableHead>
                  <TableHead>Kết thúc</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải dữ liệu…
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {isError && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      <div className="text-red-600">
                        <div className="font-semibold mb-2">❌ Không thể tải dữ liệu</div>
                        <div className="text-sm">
                          Có thể do lỗi CORS hoặc server không phản hồi.
                          <br />
                          Vui lòng kiểm tra console để xem chi tiết lỗi.
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      Chưa có lịch hẹn nào.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  items.map((ev) => <AppointmentRow key={ev.id} ev={ev} />)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
