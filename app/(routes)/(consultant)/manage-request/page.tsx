"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useConsultantAppointments, useUpdateAppointment } from "@/hooks/services/use-booking-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { AppointmentDetailResponse } from "@/services/api/booking-service";




function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
      return "secondary";
    case "Approved":
      return "default";
    case "Rejected":
      return "destructive";
    case "Completed":
      return "outline";
    case "Cancelled":
      return "destructive";
    default:
      return "secondary";
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

export default function ManageRequestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<AppointmentDetailResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  
  const { user } = useAuthStore();
  
  // API hooks
  const { data: appointmentsData, isLoading, error } = useConsultantAppointments({
    consultantId: user?.id,
    pageNumber: 1,
    pageSize: 50,
  });
  
  const updateAppointmentMutation = useUpdateAppointment();
  
  const requests = useMemo(() => appointmentsData?.appointments || [], [appointmentsData?.appointments]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const clientName = request.consultant?.fullName || "";
      const clientEmail = request.consultant?.email || "";
      const service = "Tư vấn tâm lý"; // Default service name
      
      const matchesSearch = 
        clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleViewDetails = (request: AppointmentDetailResponse) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const handleAction = (request: AppointmentDetailResponse, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setActionType(action);
    setResponseNotes("");
    setIsActionOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    // If rejecting, require a meaningful reason to avoid backend validation errors
    if (actionType === "reject") {
      const reason = responseNotes?.trim() || "";
      if (reason.length < 5) {
        toast.error("Lý do từ chối phải có ít nhất 5 ký tự");
        return;
      }
    }

    try {
      const trimmedNotes = responseNotes?.trim() || "";
      if (actionType === "approve") {
        const approvePayload = trimmedNotes
          ? { for: "confirmAppointment", notes: trimmedNotes }
          : { for: "confirmAppointment" };

        if (process.env.NODE_ENV === "development") {
          console.debug("[ManageRequest] Approve payload:", { id: selectedRequest.id, approvePayload });
        }

        await updateAppointmentMutation.mutateAsync({
          id: selectedRequest.id,
          payload: approvePayload,
        });
      } else {
        // Reject flow: try lowercase action first, then PascalCase fallback for backend variants
        const reasonVariants = {
          reasonForCancellation: trimmedNotes,
          cancellationReason: trimmedNotes,
          reason: trimmedNotes,
          rejectReason: trimmedNotes,
        } as const;
        const rejectPrimary = { for: "rejectAppointment", ...reasonVariants } as Record<string, unknown>;
        const rejectFallback = { for: "RejectAppointment", ...reasonVariants } as Record<string, unknown>;

        if (process.env.NODE_ENV === "development") {
          console.debug("[ManageRequest] Reject primary payload:", { id: selectedRequest.id, rejectPrimary });
        }

        try {
          await updateAppointmentMutation.mutateAsync({ id: selectedRequest.id, payload: rejectPrimary });
        } catch (err: unknown) {
          const e = err as { status?: number; message?: string };
          if (e?.status === 400) {
            if (process.env.NODE_ENV === "development") {
              console.debug("[ManageRequest] 400 on primary, retrying with fallback payload", { rejectFallback });
            }
            await updateAppointmentMutation.mutateAsync({ id: selectedRequest.id, payload: rejectFallback });
          } else {
            throw err;
          }
        }
      }

      setIsActionOpen(false);
      setSelectedRequest(null);
      setActionType(null);
      setResponseNotes("");
    } catch (finalErr) {
      if (process.env.NODE_ENV === "development") {
        console.debug("[ManageRequest] updateAppointmentMutation failed", finalErr);
      }
    }
  };

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => normalizeStatus(r.status) === "Pending").length;
    const approved = requests.filter(r => normalizeStatus(r.status) === "Approved").length;
    const completed = requests.filter(r => normalizeStatus(r.status) === "Completed").length;
    
    return { total, pending, approved, completed };
  }, [requests]);

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Quản lý yêu cầu đặt lịch</h1>
        <p className="text-muted-foreground mt-2">
          Xem và xử lý các yêu cầu đặt lịch từ khách hàng
        </p>
        {appointmentsData?.message?.includes("API không khả dụng") && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Chế độ phát triển:</strong> {appointmentsData.message}
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng yêu cầu</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Danh sách yêu cầu đặt lịch</CardTitle>
          <CardDescription>
            Quản lý và xử lý các yêu cầu đặt lịch từ khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên, email, dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Pending">Chờ duyệt</SelectItem>
                <SelectItem value="Approved">Đã duyệt</SelectItem>
                <SelectItem value="Rejected">Đã từ chối</SelectItem>
                <SelectItem value="Completed">Hoàn thành</SelectItem>
                <SelectItem value="Cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Ngày giờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang tải dữ liệu...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-red-500">
                        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Không tìm thấy yêu cầu nào</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => {
                    const startTime = request.schedule?.startTime ? new Date(request.schedule.startTime) : null;
                    const endTime = request.schedule?.endTime ? new Date(request.schedule.endTime) : null;
                    const dateStr = startTime ? startTime.toLocaleDateString("vi-VN") : "N/A";
                    const timeStr = startTime && endTime 
                      ? `${startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${endTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                      : "N/A";

                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.consultant?.fullName || "N/A"}</div>
                            <div className="text-sm text-muted-foreground">{request.consultant?.email || "N/A"}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate">Tư vấn tâm lý</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dateStr}</div>
                            <div className="text-sm text-muted-foreground">{timeStr}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDateTime(request.createdAt)}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem
                            </Button>
                            {request.status === "Pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleAction(request, "approve")}
                                >
                                  {updateAppointmentMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Duyệt
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleAction(request, "reject")}
                                >
                                  {updateAppointmentMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Từ chối
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu đặt lịch</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về yêu cầu đặt lịch từ khách hàng
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Mã yêu cầu</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                      {getStatusText(selectedRequest.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tên khách hàng</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.consultant?.fullName || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.consultant?.email || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Số điện thoại</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.consultant?.phoneNumber || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dịch vụ</Label>
                  <p className="text-sm text-muted-foreground">Tư vấn tâm lý</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Ngày hẹn</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.schedule?.startTime 
                      ? new Date(selectedRequest.schedule.startTime).toLocaleDateString("vi-VN")
                      : "N/A"
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Thời gian</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.schedule?.startTime && selectedRequest.schedule?.endTime
                      ? `${new Date(selectedRequest.schedule.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(selectedRequest.schedule.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                      : "N/A"
                    }
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Ghi chú từ khách hàng</Label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                  {selectedRequest.notes || "Không có ghi chú"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Ngày tạo yêu cầu</Label>
                <p className="text-sm text-muted-foreground">{formatDateTime(selectedRequest.createdAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionOpen} onOpenChange={setIsActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Duyệt yêu cầu đặt lịch" : "Từ chối yêu cầu đặt lịch"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Bạn có chắc chắn muốn duyệt yêu cầu đặt lịch này không?" 
                : "Bạn có chắc chắn muốn từ chối yêu cầu đặt lịch này không?"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{selectedRequest.consultant?.fullName || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Tư vấn tâm lý</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.schedule?.startTime 
                    ? `${new Date(selectedRequest.schedule.startTime).toLocaleDateString("vi-VN")} - ${new Date(selectedRequest.schedule.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                    : "N/A"
                  }
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="response-notes">
                {actionType === "reject" ? "Lý do từ chối (tối thiểu 5 ký tự)" : "Ghi chú phản hồi (tùy chọn)"}
              </Label>
              <Textarea
                id="response-notes"
                placeholder={actionType === "reject" ? "Nhập lý do từ chối..." : "Nhập ghi chú phản hồi cho khách hàng..."}
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                className="mt-1"
              />
              {actionType === "reject" && (
                <p className="text-xs text-muted-foreground mt-1">Cần nhập ít nhất 5 ký tự để từ chối.</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionOpen(false)}>
              Hủy
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              onClick={handleConfirmAction}
              disabled={updateAppointmentMutation.isPending || (actionType === "reject" && (responseNotes?.trim().length || 0) < 5)}
              title={actionType === "reject" && (responseNotes?.trim().length || 0) < 5 ? "Nhập lý do tối thiểu 5 ký tự để từ chối" : undefined}
            >
              {updateAppointmentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                actionType === "approve" ? "Duyệt" : "Từ chối"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

