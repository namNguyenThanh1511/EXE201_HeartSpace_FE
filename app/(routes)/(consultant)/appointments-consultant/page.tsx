"use client";

import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

function getClientDisplayInfo(clientId?: string): { name: string; subText?: string } {
  // Fallback to clientId if no name available
  return {
    name: clientId ? `Client ${clientId.slice(0, 8)}...` : "Chưa có thông tin",
    subText: clientId ? `ID: ${clientId}` : undefined
  };
}

function getPaymentStatusText(paymentStatus?: string) {
  if (!paymentStatus) return "Chưa có thông tin";
  
  const status = paymentStatus.toLowerCase();
  switch (status) {
    case "pendingpayment":
    case "pending":
      return "Chờ thanh toán";
    case "paid":
      return "Đã thanh toán";
    case "failed":
      return "Thanh toán thất bại";
    default:
      return paymentStatus;
  }
}

function getPaymentStatusVariant(paymentStatus?: string) {
  if (!paymentStatus) return "secondary" as const;
  
  const status = paymentStatus.toLowerCase();
  switch (status) {
    case "paid":
      return "default" as const;
    case "pendingpayment":
    case "pending":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

// Component để render từng appointment row
function AppointmentRow({ ev }: { ev: AppointmentDetailResponse }) {
  // Get client info
  const clientInfo = getClientDisplayInfo(ev.clientId);
  const paymentStatusText = getPaymentStatusText(ev.paymentStatus);
  const paymentStatusVariant = getPaymentStatusVariant(ev.paymentStatus);
  
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
            <AvatarFallback>
              {getInitials(clientInfo.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="font-medium leading-none">
              {clientInfo.name}
            </div>
            {clientInfo.subText && (
              <div className="text-xs text-muted-foreground">
                {clientInfo.subText}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {toLocalHM(startTime)}
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {toLocalHM(endTime)}
      </TableCell>

      <TableCell className="whitespace-nowrap">
        {appointmentDate.toLocaleDateString('vi-VN')}
      </TableCell>

      <TableCell>
        <Badge variant={paymentStatusVariant}>
          {paymentStatusText}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="inline-flex items-center gap-3">
          <Link
            href={`/meeting/${ev.id}`}
            className="text-sm text-primary hover:underline"
          >
            Mở
          </Link>
          <Link
            href={`/user/consultants/${ev.consultant?.id || ev.consultantId}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            Chi tiết
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
  
  const { data, isLoading, isError, refetch } = useMyAppointments({ pageNumber: 1, pageSize: 200 });

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

  const handleQuickCreate = (hours: number) => {
    const now = new Date();
    now.setHours(hours, 0, 0, 0);
    if (now < new Date()) {
      now.setDate(now.getDate() + 1);
    }
    const dateStr = now.toISOString().slice(0, 16);
    setStartTime(dateStr);
    setIsCreateDialogOpen(true);
  };

  // Search theo tên client/ghi chú/trạng thái thanh toán
  const items = useMemo(() => {
    const rawItems = (data?.appointments || []) as AppointmentDetailResponse[];
    if (!query.trim()) return rawItems;
    const q = query.toLowerCase();
    return rawItems.filter((ev) => {
      const clientInfo = getClientDisplayInfo(ev.clientId);
      const clientName = clientInfo.name.toLowerCase();
      const notes = ev.notes?.toLowerCase() || "";
      const paymentStatus = ev.paymentStatus?.toLowerCase() || "";
      const clientId = ev.clientId?.toLowerCase() || "";
      return clientName.includes(q) || notes.includes(q) || paymentStatus.includes(q) || clientId.includes(q);
    });
  }, [data?.appointments, query]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Lịch đã đặt</h1>
          <p className="text-sm text-muted-foreground">
            Danh sách các cuộc hẹn của bạn
          </p>
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
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo lịch hẹn
          </Button>
        </div>
      </div>

      {/* Quick action buttons */}
      <div className="mb-6 flex gap-2">
        <Button variant="outline" onClick={() => handleQuickCreate(9)} className="flex-1">
          <Clock className="h-4 w-4 mr-2" />
          Sáng 9h - 30p
        </Button>
        <Button variant="outline" onClick={() => { setDuration("60"); handleQuickCreate(9); }} className="flex-1">
          <Clock className="h-4 w-4 mr-2" />
          Sáng 9h - 60p
        </Button>
        <Button variant="outline" onClick={() => handleQuickCreate(14)} className="flex-1">
          <Clock className="h-4 w-4 mr-2" />
          Chiều 14h - 30p
        </Button>
        <Button variant="outline" onClick={() => { setDuration("60"); handleQuickCreate(14); }} className="flex-1">
          <Clock className="h-4 w-4 mr-2" />
          Chiều 14h - 60p
        </Button>
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
                  ? (data?.message || "Danh sách các cuộc hẹn với khách hàng.")
                  : `❌ Lỗi: ${data?.message || "Không thể tải dữ liệu"}`}
          </CardDescription>
          {data?.errors && data.errors.length > 0 && (
            <div className="text-sm text-red-600 mt-2">
              Chi tiết lỗi: {data.errors.join(", ")}
            </div>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Bắt đầu</TableHead>
                  <TableHead>Kết thúc</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
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

                {!isLoading && !isError && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      Chưa có lịch hẹn nào.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  items.map((ev) => (
                    <AppointmentRow key={ev.id} ev={ev} />
                  ))}
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
                  Bắt đầu: {new Date(startTime).toLocaleString('vi-VN')}
                  <br />
                  Kết thúc: {new Date(new Date(startTime).getTime() + parseInt(duration) * 60 * 1000).toLocaleString('vi-VN')}
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

