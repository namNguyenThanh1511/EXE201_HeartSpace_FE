"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type BookingRow = {
  id: string;
  user: string;
  email: string;
  phone: string;
  service: string;
  date: string; // ISO start
  end: string; // ISO end
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
  meetingUrl: string;
  notes?: string;
};

const MOCK: BookingRow[] = [
  {
    id: "bk-1001",
    user: "Nguyễn Văn A",
    email: "usera@example.com",
    phone: "+84 912 111 222",
    service: "Cardio Consultation",
    date: new Date().toISOString().slice(0, 10) + "T09:00:00",
    end: new Date().toISOString().slice(0, 10) + "T10:00:00",
    status: "Scheduled",
    meetingUrl: "https://meet.google.com/xyz-1234-xyz",
    notes: "Khó thở nhẹ khi vận động.",
  },
  {
    id: "bk-1002",
    user: "Trần Thị B",
    email: "tranb@example.com",
    phone: "+84 933 333 444",
    service: "Nutrition Coaching",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10) + "T14:00:00",
    end: new Date(Date.now() + 86400000).toISOString().slice(0, 10) + "T15:00:00",
    status: "Scheduled",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    notes: "Theo dõi chế độ ăn 2 tuần.",
  },
  {
    id: "bk-0998",
    user: "Lê C",
    email: "lec@example.com",
    phone: "+84 955 555 666",
    service: "Follow-up",
    date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + "T08:00:00",
    end: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10) + "T09:00:00",
    status: "Completed",
    meetingUrl: "https://zoom.us/j/1234567890",
    notes: "Tái khám sau điều trị.",
  },
];

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ManageBookingPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BookingRow | null>(null);

  const rows = useMemo(() => {
    return MOCK.filter((r) => (status === "all" ? true : r.status === status)).filter((r) =>
      (r.user + r.service + r.id).toLowerCase().includes(q.toLowerCase())
    );
  }, [q, status]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Manage Bookings</h1>
        <p className="text-muted-foreground mt-2">Danh sách buổi hẹn người dùng đã đặt với bạn.</p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Lọc theo trạng thái và tìm kiếm nhanh</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Tìm theo tên, dịch vụ, mã lịch..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-80" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No-Show">No-Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="w-40 font-mono">{r.id}</TableCell>
                    <TableCell className="min-w-48">
                      <div className="font-medium">{r.user}</div>
                      <div className="text-muted-foreground text-xs">{r.service}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{fmtDate(r.date)}</Badge>
                        <span>{fmtTime(r.date)} - {fmtTime(r.end)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="w-28">
                      <Badge variant={r.status === "Completed" ? "default" : r.status === "Scheduled" ? "secondary" : "outline"}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/meeting/${r.id}`} target="_blank">Open</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={r.meetingUrl} target="_blank">Join</Link>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setSelected(r); setOpen(true); }}>Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Thông tin người đặt và buổi họp</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Người đặt</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 pt-2">
                  <div><span className="text-muted-foreground">Họ tên:</span> {selected.user}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                  <div><span className="text-muted-foreground">SĐT:</span> {selected.phone}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Buổi hẹn</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 pt-2">
                  <div><span className="text-muted-foreground">Dịch vụ:</span> {selected.service}</div>
                  <div><span className="text-muted-foreground">Ngày:</span> {fmtDate(selected.date)}</div>
                  <div><span className="text-muted-foreground">Giờ:</span> {fmtTime(selected.date)} - {fmtTime(selected.end)}</div>
                  <div><span className="text-muted-foreground">Trạng thái:</span> {selected.status}</div>
                  <div><span className="text-muted-foreground">Ghi chú:</span> {selected.notes || "-"}</div>
                  <div className="pt-2 flex gap-2">
                    <Button asChild>
                      <Link href={selected.meetingUrl} target="_blank">Tham gia phòng họp</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/meeting/${selected.id}`} target="_blank">Xem chi tiết</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


