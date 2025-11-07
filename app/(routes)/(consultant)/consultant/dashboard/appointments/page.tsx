"use client";

import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Loader2, Filter, Plus, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMyAppointments } from "@/hooks/services/use-appointment-service";
import type { AppointmentDetailResponse } from "@/services/api/appointment-service";
import { scheduleService } from "@/services/api/schedule-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { useRouter } from "next/navigation";

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

function getPaymentStatusText(paymentStatus?: string) {
  if (!paymentStatus) return "Chưa có thông tin";

  const status = paymentStatus.toLowerCase();
  switch (status) {
    case "notpaid":
      return "Chưa thanh toán";
    case "paid":
      return "Đã thanh toán";
    case "pendingpayment":
      return "Chờ thanh toán";
    case "refunded":
      return "Đã hoàn tiền";
    case "withdrawn":
      return "Đã rút tiền";
    case "failed":
      return "Thanh toán thất bại";
    default:
      return paymentStatus;
  }
}

/* ====================== Utils (Updated) ====================== */

// Thêm hàm định dạng tiền tệ
function formatCurrency(amount?: number) {
  if (amount === undefined || amount === null) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Cập nhật getPaymentStatusVariant để phù hợp với PaymentStatus enum
function getPaymentStatusVariant(paymentStatus?: string) {
  if (!paymentStatus) return "secondary" as const;

  const status = paymentStatus.toLowerCase();
  switch (status) {
    case "notpaid":
      return "secondary" as const;
    case "paid":
      return "default" as const;
    case "pendingpayment":
      return "outline" as const; // Map "warning" to "outline"
    case "refunded":
      return "outline" as const;
    case "withdrawn":
      return "destructive" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

// Hàm mới cho AppointmentStatus
function getAppointmentStatusDisplay(status?: string) {
  if (!status) return { text: "Chưa Rõ", variant: "secondary" as const };
  const lowerStatus = status.toLowerCase();

  switch (lowerStatus) {
    case "pending": // Client đặt -> chờ Consultant Confirm
      return { text: "Chờ bạn xác nhận", variant: "secondary" as const };
    case "pendingpayment": // Consultant Confirm -> chờ Client Payment
      return { text: "Chờ thanh toán", variant: "outline" as const }; // Map "warning" to "outline"
    case "paid": // Client đã TT -> sẵn sàng diễn ra
      return { text: "Đã thanh toán", variant: "default" as const };
    case "completed":
      return { text: "Đã hoàn thành", variant: "default" as const }; // Map "success" to "default"
    case "cancelled":
      return { text: "Đã hủy", variant: "destructive" as const };
    default:
      return { text: status, variant: "secondary" as const };
  }
}

// Hàm client info để lấy tên thật nếu có (sử dụng ev.client.fullName)
function getClientDisplayInfo(client?: { id?: string; fullName?: string }): {
  name: string;
  subText?: string;
} {
  if (client?.fullName) {
    return {
      name: client.fullName,
      subText: client.id ? `ID: ${client.id.slice(0, 8)}...` : undefined,
    };
  }
  return {
    name: client?.id ? `Client ${client.id.slice(0, 8)}...` : "Chưa có thông tin",
    subText: client?.id ? `ID: ${client.id}` : undefined,
  };
}

// Component để render từng appointment row
function AppointmentRow({ ev }: { ev: AppointmentDetailResponse }) {
  // --- LẤY DỮ LIỆU CẦN THIẾT ---
  const clientInfo = getClientDisplayInfo(ev.client);

  // Trạng thái Cuộc hẹn (Status)
  const appointmentStatus = getAppointmentStatusDisplay(ev.status);

  // Trạng thái Thanh toán (PaymentStatus)
  const paymentStatusText = getPaymentStatusText(ev.paymentStatus);
  const paymentStatusVariant = getPaymentStatusVariant(ev.paymentStatus);

  // Schedule Info
  const schedule = ev.schedule;
  const startTime = schedule?.startTime || ev.createdAt;
  const endTime = schedule?.endTime || ev.updatedAt;
  const price = ev.amount || schedule?.price;

  // Link họp
  const meetingLink = ev.meetingLink;

  // Lý do hủy
  const cancellationReason = ev.reasonForCancellation;

  // Ngày lấy từ date của startTime
  const appointmentDate = new Date(startTime);

  return (
    <TableRow
      key={ev.id}
      className={ev.status === "Cancelled" ? "bg-red-50/50 hover:bg-red-50" : ""}
    >
      {/* 1. Khách hàng */}
      <TableCell className="min-w-[180px]">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitials(clientInfo.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="font-medium leading-none">{clientInfo.name}</div>
            <div className="text-xs text-muted-foreground">
              {ev.client?.email || clientInfo.subText}
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

      {/* 5. Trạng thái Thanh toán */}
      <TableCell>
        <Badge variant={paymentStatusVariant}>{paymentStatusText}</Badge>
      </TableCell>

      {/* 6. Ghi chú & Hủy */}
      <TableCell className="min-w-[200px] text-sm">
        {cancellationReason ? (
          <span className="text-red-500 italic">Hủy: {cancellationReason}</span>
        ) : (
          <span className="text-muted-foreground italic line-clamp-1">
            {ev.notes || "Không có ghi chú"}
          </span>
        )}
      </TableCell>

      {/* 7. Hành động */}
      <TableCell className="text-right whitespace-nowrap">
        <div className="inline-flex flex-col gap-1 items-end">
          {meetingLink && ev.status?.toLowerCase() === "paid" ? (
            <Link
              href={meetingLink}
              target="_blank"
              className="text-sm font-medium text-green-600 hover:underline"
            >
              Vào phòng họp
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">
              {ev.status?.toLowerCase() === "paid" ? "Chưa có link" : "Chờ TT/XN"}
            </span>
          )}

          <Link
            href={`/consultant/dashboard/appointments/${ev.id}`} // Sửa lại link chi tiết nếu cần
            className="text-xs text-primary/80 hover:underline"
          >
            Xem chi tiết
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
/* ====================== Page ====================== */
export default function ConsultantAppointmentsPage() {
  const [query, setQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<"30" | "60">("30");
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  if (user?.role.toLowerCase() !== "consultant") {
    router.replace("/");
  }

  const { data, isLoading, isError, refetch } = useMyAppointments({ pageNumber: 1, pageSize: 200 });
  const appointments = data?.data || [];

  const handleCreateSchedule = async () => {
    if (!startTime) {
      toast.error("Vui lòng chọn thời gian bắt đầu");
      return;
    }

    setCreating(true);
    try {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + parseInt(duration) * 60 * 1000);

      await scheduleService.createSchedule({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      toast.success(`Tạo lịch hẹn ${duration} phút thành công!`);
      setIsCreateDialogOpen(false);
      setStartTime("");
      refetch();
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error("Không thể tạo lịch hẹn. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Lịch đã đặt</h1>
          <p className="text-sm text-muted-foreground">Danh sách các cuộc hẹn của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Tìm theo tên client, ghi chú hoặc trạng thái thanh toán..."
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
          <CardTitle className="text-base">Tổng số: {appointments.length}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Khách hàng</TableHead>
                  <TableHead>Thời gian</TableHead> <TableHead>Giá</TableHead>
                  <TableHead>Trạng thái hẹn</TableHead> <TableHead>Thanh toán</TableHead>{" "}
                  <TableHead className="min-w-[200px]">Ghi chú/Hủy</TableHead>{" "}
                  <TableHead className="text-right">Hành động</TableHead>{" "}
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <div className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang tải dữ liệu…
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {isError && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
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

                {!isLoading && !isError && appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
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

      {/* Create Schedule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
            <DialogDescription>
              Tạo một khung thời gian để khách hàng đặt lịch hẹn với bạn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Thời gian bắt đầu</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Thời lượng (phút)</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={duration === "30" ? "default" : "outline"}
                  onClick={() => setDuration("30")}
                  className="flex-1"
                >
                  30 phút
                </Button>
                <Button
                  type="button"
                  variant={duration === "60" ? "default" : "outline"}
                  onClick={() => setDuration("60")}
                  className="flex-1"
                >
                  60 phút
                </Button>
              </div>
            </div>

            {startTime && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  Bắt đầu: {new Date(startTime).toLocaleString("vi-VN")}
                  <br />
                  Kết thúc:{" "}
                  {new Date(
                    new Date(startTime).getTime() + parseInt(duration) * 60 * 1000
                  ).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setStartTime("");
              }}
              disabled={creating}
            >
              Hủy
            </Button>
            <Button onClick={handleCreateSchedule} disabled={creating || !startTime}>
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo lịch hẹn"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
