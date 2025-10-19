"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AccountRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "User" | "Mentor" | "Admin";
  status: "Active" | "Blocked";
  createdAt: string; // ISO
};

const ACCOUNTS: AccountRow[] = [
  {
    id: "u-1001",
    name: "Nguyễn Văn A",
    email: "usera@example.com",
    phone: "+84 912 111 222",
    role: "User",
    status: "Active",
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "m-2001",
    name: "Dr. Alex Mentor",
    email: "mentor@example.com",
    phone: "+84 933 333 444",
    role: "Mentor",
    status: "Active",
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: "u-1002",
    name: "Trần Thị B",
    email: "tranb@example.com",
    phone: "+84 955 555 666",
    role: "User",
    status: "Blocked",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "a-01",
    name: "Admin Root",
    email: "admin@example.com",
    phone: "+84 900 000 000",
    role: "Admin",
    status: "Active",
    createdAt: new Date(Date.now() - 200 * 86400000).toISOString(),
  },
];

function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AdminManageUserPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AccountRow | null>(null);

  const rows = useMemo(() => {
    return ACCOUNTS.filter((a) => (role === "all" ? true : a.role === role))
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) => (a.name + a.email + a.phone + a.id).toLowerCase().includes(q.toLowerCase()));
  }, [q, role, status]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Accounts Management</h1>
        <p className="text-muted-foreground mt-2">Quản lý tài khoản User/Mentor/Admin trong hệ thống.</p>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Accounts</CardTitle>
          <CardDescription>Tìm kiếm, lọc theo vai trò & trạng thái, thao tác nhanh</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Input placeholder="Tìm theo tên, email, SĐT..." value={q} onChange={(e) => setQ(e.target.value)} className="w-full sm:w-80" />
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Mentor">Mentor</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableBody>
                {rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="w-12">
                      <Avatar>
                        <AvatarImage src={a.avatar || "/images/landing-bg.png"} alt={a.name} />
                        <AvatarFallback>{a.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="min-w-56">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-muted-foreground text-xs">{a.email} • {a.phone}</div>
                    </TableCell>
                    <TableCell className="w-28"><Badge variant="secondary">{a.role}</Badge></TableCell>
                    <TableCell className="w-44">{fmtDateTime(a.createdAt)}</TableCell>
                    <TableCell className="w-28"><Badge variant={a.status === "Active" ? "secondary" : "outline"}>{a.status}</Badge></TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setSelected(a); setOpen(true); }}>View</Button>
                      <Button size="sm" variant="ghost">{a.status === "Active" ? "Block" : "Unblock"}</Button>
                      <Button size="sm">Reset Password</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>Thông tin tài khoản</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="flex items-start gap-4">
              <Avatar className="size-14">
                <AvatarImage src={selected.avatar || "/images/landing-bg.png"} alt={selected.name} />
                <AvatarFallback>{selected.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="text-sm space-y-1">
                <div><span className="text-muted-foreground">Họ tên:</span> {selected.name}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">SĐT:</span> {selected.phone}</div>
                <div><span className="text-muted-foreground">Vai trò:</span> {selected.role}</div>
                <div><span className="text-muted-foreground">Trạng thái:</span> {selected.status}</div>
                <div><span className="text-muted-foreground">Tạo lúc:</span> {fmtDateTime(selected.createdAt)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


