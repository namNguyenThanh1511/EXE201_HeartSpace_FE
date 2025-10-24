"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMyAppointments } from "@/hooks/services/use-appointment-service";
import type { AppointmentDetailResponse } from "@/services/api/booking-service";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function formatDayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function toLocalHM(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeStatus(status: string): "Pending" | "Approved" | "Rejected" | "Completed" | "Cancelled" {
  const s = (status || "").toLowerCase();
  if (s === "pending") return "Pending";
  if (s === "approved" || s === "approve" || s === "confirm" || s === "confirmed") return "Approved";
  if (s === "rejected" || s === "reject") return "Rejected";
  if (s === "completed" || s === "complete") return "Completed";
  if (s === "cancelled" || s === "canceled" || s === "cancel") return "Cancelled";
  return "Pending";
}

function getStatusBadgeVariant(status: string) {
  switch (normalizeStatus(status)) {
    case "Pending":
      return "secondary" as const;
    case "Approved":
      return "default" as const;
    case "Rejected":
      return "destructive" as const;
    case "Completed":
      return "outline" as const;
    case "Cancelled":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

function getStatusText(status: string) {
  switch (normalizeStatus(status)) {
    case "Pending":
      return "Chờ duyệt";
    case "Approved":
      return "Đã duyệt";
    case "Rejected":
      return "Đã từ chối";
    case "Completed":
      return "Hoàn thành";
    case "Cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

export default function HistoryPage() {
  const { data, isLoading } = useMyAppointments({ pageNumber: 1, pageSize: 200 });
  const items: AppointmentDetailResponse[] = (data?.appointments || []).map((a) => ({
    ...a,
    schedule: a.schedule || {
      id: a.scheduleId,
      startTime: a.createdAt,
      endTime: a.updatedAt,
      isAvailable: false,
    },
  })) as AppointmentDetailResponse[];

  function daysBetween(startIso?: string, endIso?: string) {
    if (!startIso || !endIso) return 0;
    const s = new Date(startIso);
    const e = new Date(endIso);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Lịch đã đặt</h1>
          <p className="text-sm text-muted-foreground">Danh sách các cuộc hẹn của bạn</p>
        </div>
        <div className="flex items-center space-x-3">
          <Input placeholder="Tìm kiếm" className="w-64" />
          <Button variant="outline">Filter</Button>
          <Button>Form</Button>
        </div>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Ngày nhận</TableHead>
                  <TableHead>Ngày trả</TableHead>
                  <TableHead>Số ngày</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Đang tải dữ liệu...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Không có lịch</TableCell>
                  </TableRow>
                ) : (
                  items.map((ev) => (
                    <TableRow key={ev.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={ev.consultant?.avatar || undefined} alt={ev.consultant?.fullName || "A"} />
                            <AvatarFallback>{(ev.consultant?.fullName || "U").charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{ev.consultant?.fullName || "Khách"}</div>
                            <div className="text-xs text-muted-foreground">{ev.consultant?.email || ""}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell> Tư vấn tâm lý </TableCell>
                      <TableCell className="max-w-xs truncate">{ev.notes || "-"}</TableCell>
                      <TableCell>{ev.schedule?.startTime ? new Date(ev.schedule.startTime).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>{ev.schedule?.endTime ? new Date(ev.schedule.endTime).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>{daysBetween(ev.schedule?.startTime, ev.schedule?.endTime)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/meeting/${ev.id}`} className="text-sm text-primary hover:underline">Mở</Link>
                          <Link href={`/user/consultants/${ev.consultant?.id || ""}`} className="text-sm text-muted-foreground hover:underline">Hồ sơ</Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


