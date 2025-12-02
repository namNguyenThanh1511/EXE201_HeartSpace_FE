// FILE ĐÃ SỬA ĐỔI: app/appointments/page.tsx (Dành cho Người Dùng/Client)

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Filter } from "lucide-react";

// Import hook service (Giả định hook này đã được tạo)
import { useMyAppointments } from "@/hooks/services/use-appointment-service";
import type { AppointmentDetailResponse } from "@/services/api/appointment-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { useRouter } from "next/navigation";

// Nếu cần fetch chi tiết consultant (ví dụ khi appointment không có sẵn info)
// import { useQuery } from "@tanstack/react-query";
// import { consultantService } from "@/services/api/consultant-service";

/* ====================== Utils ====================== */
function toLocalHM(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name?.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatCurrency(amount?: number) {
  if (amount === undefined || amount === null) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Hàm lấy thông tin Consultant (áp dụng cho Client View)
function getConsultantDisplayInfo(consultant?: {
  id?: string;
  fullName?: string;
  email?: string;
}): {
  name: string;
  subText?: string;
} {
  if (consultant?.fullName) {
    return {
      name: consultant.fullName,
      subText:
        consultant.email || (consultant.id ? `ID: ${consultant.id.slice(0, 8)}...` : undefined),
    };
  }
  return {
    name: consultant?.id ? `Chuyên gia ${consultant.id.slice(0, 8)}...` : "Chưa có thông tin",
    subText: consultant?.id ? `ID: ${consultant.id}` : undefined,
  };
}

// Hàm hiển thị trạng thái Cuộc hẹn (Client View)
function getAppointmentStatusDisplay(status?: string) {
  if (!status) return { text: "Chưa Rõ", variant: "secondary" as const };
  const lowerStatus = status.toLowerCase();

  switch (lowerStatus) {
    case "pending": // Client đặt -> chờ Consultant Confirm
      return { text: "Chờ chuyên gia xác nhận", variant: "secondary" as const };
    case "pendingpayment": // Consultant Confirm -> chờ Client Payment
      return { text: "Chờ bạn thanh toán", variant: "outline" as const }; // Dùng warning/outline để nổi bật
    case "paid": // Client đã TT -> sẵn sàng diễn ra
      return { text: "Đã thanh toán", variant: "default" as const };
    case "completed":
      return { text: "Đã hoàn thành", variant: "default" as const };
    case "cancelled":
      return { text: "Đã hủy", variant: "destructive" as const };
    default:
      return { text: status, variant: "secondary" as const };
  }
}

// Hàm xử lý hiển thị cột Thanh toán, bao gồm NÚT THANH TOÁN
function formatPaymentStatusDisplay(paymentUrl?: string | null, paymentStatus?: string) {
  const statusLower = paymentStatus?.toLowerCase();

  // 1. Ưu tiên hiển thị nút thanh toán nếu status là PendingPayment và có URL
  if (statusLower === "pendingpayment" && paymentUrl) {
    return {
      type: "button" as const, // Dùng type "button" để render nút
      text: "Thanh toán ngay",
      url: paymentUrl,
      variant: "default" as const,
    };
  }

  // 2. Nếu không có URL hoặc không phải PendingPayment, hiển thị trạng thái Badge
  let text = "Chưa có thông tin";
  let variant = "secondary" as const;

  switch (statusLower) {
    case "notpaid":
      text = "Chưa thanh toán";
      break;
    case "paid":
      text = "Đã thanh toán";
      variant = "secondary";
      break;
    case "pendingpayment":
      text = "Chờ thanh toán";
      variant = "secondary";
      break;
    case "refunded":
      text = "Đã hoàn tiền";
      variant = "secondary";
      break;
    case "failed":
      text = "Thanh toán thất bại";
      variant = "secondary";
      break;
    case "withdrawn":
      text = "Đã rút tiền";
      variant = "secondary";
      break;
  }

  return {
    type: "status" as const,
    text: text,
    variant: variant,
  };
}

// Component để render từng appointment row
function AppointmentRow({ ev }: { ev: AppointmentDetailResponse }) {
  // --- LẤY DỮ LIỆU CẦN THIẾT ---
  const consultantInfo = getConsultantDisplayInfo(ev.consultant);

  // Trạng thái Cuộc hẹn (Status)
  const appointmentStatus = getAppointmentStatusDisplay(ev.status);

  // Xử lý hiển thị cột Thanh toán
  const paymentDisplay = formatPaymentStatusDisplay(ev.paymentUrl, ev.paymentStatus);

  // Schedule Info
  const schedule = ev.schedule;
  const startTime = schedule?.startTime || ev.createdAt;
  const endTime = schedule?.endTime || ev.updatedAt;
  const price = ev.amount || schedule?.price;

  // Ngày lấy từ date của startTime
  const appointmentDate = new Date(startTime);

  // Link Chi tiết
  const detailLink = `/appointments/${ev.id}`;
  // Link hồ sơ Consultant
  const consultantProfileLink = `/user/consultants/${ev.consultant?.id || ev.consultantId}`;

  return (
    <TableRow
      key={ev.id}
      className={ev.status === "Cancelled" ? "bg-red-50/50 hover:bg-red-50" : ""}
    >
      {/* 1. Chuyên gia */}
      <TableCell className="min-w-[180px]">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {/* Giả định ev.consultant có avatar image */}
            <AvatarFallback>{getInitials(consultantInfo.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="font-medium leading-none">{consultantInfo.name}</div>
            <div className="text-xs text-muted-foreground">
              {ev.consultant?.email || consultantInfo.subText}
            </div>
          </div>
        </div>
      </TableCell>

      {/* 2. Thời gian */}
      <TableCell className="whitespace-nowrap">
        <div className="font-semibold">
          {toLocalHM(startTime)} - {toLocalHM(endTime)}
        </div>
        <div className="text-xs text-muted-foreground">
          {appointmentDate.toLocaleDateString("vi-VN")}
        </div>
      </TableCell>

      {/* 3. Giá */}
      <TableCell className="text-sm font-medium whitespace-nowrap">
        {formatCurrency(price)}
      </TableCell>

      {/* 4. Trạng thái Cuộc hẹn */}
      <TableCell>
        <Badge variant={appointmentStatus.variant}>{appointmentStatus.text}</Badge>
      </TableCell>

      {/* 5. Trạng thái Thanh toán (Có nút Thanh toán) */}
      <TableCell className="min-w-[150px]">
        {paymentDisplay.type === "button" ? (
          <Button
            size="sm"
            variant={paymentDisplay.variant}
            onClick={() => window.open(paymentDisplay.url, "_blank")}
          >
            {paymentDisplay.text}
          </Button>
        ) : (
          <Badge variant={paymentDisplay.variant}>{paymentDisplay.text}</Badge>
        )}
      </TableCell>

      {/* 6. Ghi chú & Hủy */}
      <TableCell className="min-w-[200px] text-sm">
        {ev.reasonForCancellation ? (
          <span className="text-red-500 italic">Hủy: {ev.reasonForCancellation}</span>
        ) : (
          <span className="text-muted-foreground italic line-clamp-1">
            {ev.notes || "Không có ghi chú"}
          </span>
        )}
      </TableCell>

      {/* 7. Hành động */}
      <TableCell className="text-right whitespace-nowrap">
        <div className="inline-flex flex-col gap-1 items-end">
          {ev.status?.toLowerCase() === "paid" && ev.meetingLink ? (
            <Link
              href={ev.meetingLink}
              target="_blank"
              className="text-sm font-medium text-green-600 hover:underline"
            >
              Vào phòng họp
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">
              {ev.status?.toLowerCase() === "paid" ? "Chưa có link" : "Chờ XN/TT"}
            </span>
          )}

          <Link href={detailLink} className="text-xs text-primary/80 hover:underline">
            Xem chi tiết
          </Link>
          <Link
            href={consultantProfileLink}
            className="text-xs text-muted-foreground hover:underline"
          >
            Hồ sơ chuyên gia
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ====================== Page ====================== */
export default function AppointmentsPage() {
  const [query, setQuery] = useState("");
  const { user } = useAuthStore();
  const router = useRouter();
  if (user?.role.toLocaleLowerCase() !== "client") {
    router.push("/consultant/dashboard/appointments");
  }

  // Lấy lịch hẹn của user đang đăng nhập (Client)
  const { data, isLoading, isError } = useMyAppointments({ pageNumber: 1, pageSize: 200 });
  const appointments = data?.data || [];

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Lịch đã đặt của tôi</h1>
          <p className="text-sm text-muted-foreground">Danh sách các cuộc hẹn với chuyên gia</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo tên chuyên gia, email, ghi chú hoặc trạng thái thanh toán..."
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
          <CardTitle className="text-base">Tổng số: {appointments?.length}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Chuyên gia</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái hẹn</TableHead>
                  <TableHead className="min-w-[150px]">Thanh toán</TableHead>
                  <TableHead className="min-w-[200px]">Ghi chú/Hủy</TableHead>
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
                          Vui lòng kiểm tra console để xem chi tiết lỗi.
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      Chưa có lịch hẹn nào.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  appointments.map((ev) => <AppointmentRow key={ev.id} ev={ev} />)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
