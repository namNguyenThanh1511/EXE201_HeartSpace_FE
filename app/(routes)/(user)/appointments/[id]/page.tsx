// app/consultant/appointments/[id]/page.tsx
"use client";

import { useMemo } from "react";
import {
  Loader2,
  Calendar,
  Clock,
  DollarSign,
  User,
  XCircle,
  FileText,
  CheckCircle,
  MapPin,
  Video,
  MessageCircle,
  Star,
  Shield,
  CreditCard,
  CalendarClock,
  UserCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetAppointmentDetails } from "@/hooks/services/use-appointment-service";
import { useParams } from "next/navigation";

import { useAuthStore } from "@/store/zustand/auth-store";
import { AppointmentActions } from "@/components/features/consultant/appointment-actions";

/* ====================== Utilities ====================== */

function formatCurrency(amount?: number) {
  if (amount === undefined || amount === null) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getAppointmentStatusDisplay(status?: string) {
  if (!status)
    return {
      text: "Chưa Rõ",
      variant: "secondary" as const,
      Icon: FileText,
      color: "text-gray-500",
    };
  const lowerStatus = status.toLowerCase();

  switch (lowerStatus) {
    case "pending":
      return {
        text: "Chờ xác nhận",
        variant: "secondary" as const,
        Icon: Clock,
        color: "text-yellow-500",
      };
    case "pendingpayment":
      return {
        text: "Chờ thanh toán",
        variant: "secondary" as const,
        Icon: Clock,
        color: "text-orange-500",
      };
    case "confirmed":
      return {
        text: "Đã xác nhận",
        variant: "default" as const,
        Icon: CheckCircle,
        color: "text-green-500",
      };
    case "completed":
      return {
        text: "Đã hoàn thành",
        variant: "default" as const,
        Icon: CheckCircle,
        color: "text-blue-500",
      };
    case "cancelled":
      return {
        text: "Đã hủy",
        variant: "destructive" as const,
        Icon: XCircle,
        color: "text-red-500",
      };
    case "noshow":
      return {
        text: "Không tham gia",
        variant: "destructive" as const,
        Icon: XCircle,
        color: "text-red-500",
      };
    default:
      return {
        text: status,
        variant: "secondary" as const,
        Icon: FileText,
        color: "text-gray-500",
      };
  }
}

function getPaymentStatusDisplay(status?: string) {
  if (!status)
    return { text: "Chưa thanh toán", variant: "secondary" as const, color: "text-gray-500" };
  const lowerStatus = status.toLowerCase();

  switch (lowerStatus) {
    case "paid":
      return { text: "Đã thanh toán", variant: "default" as const, color: "text-green-500" };
    case "pending":
      return { text: "Chờ thanh toán", variant: "secondary" as const, color: "text-yellow-500" };
    case "failed":
      return {
        text: "Thanh toán thất bại",
        variant: "destructive" as const,
        color: "text-red-500",
      };
    case "refunded":
      return { text: "Đã hoàn tiền", variant: "outline" as const, color: "text-blue-500" };
    default:
      return { text: status, variant: "secondary" as const, color: "text-gray-500" };
  }
}

/* ====================== Page Component ====================== */

export default function AppointmentDetailsPage() {
  const params = useParams();
  const appointmentId = params.id as string;
  const { user } = useAuthStore();

  const {
    data: appointmentResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAppointmentDetails(appointmentId);
  const appointment = appointmentResponse;

  const statusInfo = getAppointmentStatusDisplay(appointment?.status);
  const paymentStatusInfo = getPaymentStatusDisplay(appointment?.paymentStatus);

  const startTime = appointment?.schedule?.startTime;
  const endTime = appointment?.schedule?.endTime;
  const client = appointment?.client;
  const consultant = appointment?.consultant;
  const session = appointment?.session;

  // Kiểm tra xem user hiện tại có phải là consultant của cuộc hẹn này không
  const isCurrentUserConsultant = user?.id === consultant?.id;
  const isCurrentUserClient = user?.id === client?.id;
  const isAdmin = user?.role === "Admin";

  // Tính thời gian còn lại đến cuộc hẹn
  const timeUntilAppointment = useMemo(() => {
    if (!startTime) return null;
    const now = new Date();
    const appointmentTime = new Date(startTime);
    const diffMs = appointmentTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffMs < 0) return { text: "Đã qua", color: "text-gray-500" };
    if (diffHours < 1) return { text: `${diffMinutes} phút`, color: "text-red-500" };
    if (diffHours < 24) return { text: `${diffHours} giờ`, color: "text-orange-500" };
    return { text: `${Math.floor(diffHours / 24)} ngày`, color: "text-green-500" };
  }, [startTime]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 text-lg">Đang tải chi tiết cuộc hẹn...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy Cuộc hẹn</h2>
            <p className="text-gray-600">ID: {appointmentId}. Vui lòng kiểm tra lại đường dẫn.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header với Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm border">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Chi tiết Cuộc hẹn</h1>
                <p className="text-gray-600 mt-1">Mã cuộc hẹn: {appointment.id}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Badge variant={statusInfo.variant} className="text-base px-4 py-2">
                <statusInfo.Icon className="h-5 w-5 mr-2" />
                {statusInfo.text}
              </Badge>
              {timeUntilAppointment && (
                <Badge variant="outline" className="text-base px-4 py-2">
                  <Clock className="h-5 w-5 mr-2" />
                  Còn {timeUntilAppointment.text}
                </Badge>
              )}
            </div>

            {/* Hiển thị Actions nếu user có quyền */}
            {(isCurrentUserConsultant || isCurrentUserClient || isAdmin) && (
              <AppointmentActions appointment={appointment} onActionComplete={refetch} />
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cột 1: Thông tin người tham gia */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client Card */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4 border-4 border-white shadow-lg">
                  {client?.avatar ? (
                    <AvatarImage src={client.avatar} alt={client.fullName} />
                  ) : (
                    <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(client?.fullName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {client?.fullName || "N/A"}
                </h3>
                <p className="text-gray-600 mb-2">{client?.email}</p>
                {client?.phoneNumber && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {client.phoneNumber}
                  </p>
                )}
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nhắn tin
                </Button>
              </CardContent>
            </Card>

            {/* Consultant Card */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Tư vấn viên
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4 border-4 border-white shadow-lg">
                  {consultant?.avatar ? (
                    <AvatarImage src={consultant.avatar} alt={consultant.fullName} />
                  ) : (
                    <AvatarFallback className="text-lg bg-gradient-to-br from-green-500 to-teal-600 text-white">
                      {getInitials(consultant?.fullName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {consultant?.fullName || "N/A"}
                </h3>
                <p className="text-gray-600 mb-2">{consultant?.email}</p>
                <div className="flex items-center gap-1 text-sm text-yellow-600 mb-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span>4.9 (72 đánh giá)</span>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Liên hệ
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            {(isCurrentUserConsultant || isCurrentUserClient || isAdmin) && (
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Hành động nhanh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointment.meetingLink && (
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Video className="h-4 w-4 mr-2" />
                        Tham gia cuộc họp
                      </Button>
                    )}

                    {appointment.paymentUrl &&
                      appointment.paymentStatus?.toLowerCase() === "pending" &&
                      isCurrentUserClient && (
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Thanh toán ngay
                        </Button>
                      )}

                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Liên hệ hỗ trợ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cột 2 & 3: Chi tiết cuộc hẹn */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin cuộc hẹn */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-purple-600" />
                  Thông tin cuộc hẹn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<Calendar className="h-5 w-5 text-blue-600" />}
                    label="Ngày hẹn"
                    value={
                      startTime
                        ? new Date(startTime).toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"
                    }
                  />
                  <DetailItem
                    icon={<Clock className="h-5 w-5 text-green-600" />}
                    label="Thời gian"
                    value={
                      startTime && endTime
                        ? `${new Date(startTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${new Date(endTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "N/A"
                    }
                  />
                </div>

                <Separator />

                {appointment.meetingLink && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Video className="h-6 w-6 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900">Link tham gia cuộc họp</p>
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm break-all"
                        >
                          {appointment.meetingLink}
                        </a>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open(appointment.meetingLink!, "_blank")}
                      >
                        Tham gia ngay
                      </Button>
                    </div>
                  </div>
                )}

                <DetailItem
                  icon={<FileText className="h-5 w-5 text-gray-600" />}
                  label="Ghi chú từ khách hàng"
                  value={appointment.notes || "Không có ghi chú"}
                  fullWidth
                />

                {appointment.reasonForCancellation && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <DetailItem
                      icon={<XCircle className="h-5 w-5 text-red-600" />}
                      label="Lý do hủy"
                      value={appointment.reasonForCancellation}
                      fullWidth
                      className="text-red-700"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thông tin thanh toán */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<DollarSign className="h-5 w-5 text-green-600" />}
                    label="Tổng tiền"
                    value={formatCurrency(appointment.amount)}
                    className="text-xl font-bold text-green-600"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</span>
                    <Badge variant={paymentStatusInfo.variant} className="w-fit">
                      <span className={paymentStatusInfo.color}>{paymentStatusInfo.text}</span>
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <DetailItem
                    icon={<Shield className="h-5 w-5 text-orange-600" />}
                    label="Tiền giữ tạm"
                    value={formatCurrency(appointment.escrowAmount)}
                  />
                  <DetailItem
                    icon={<FileText className="h-5 w-5 text-blue-600" />}
                    label="Mã đơn hàng"
                    value={appointment.orderCode?.toString() || "N/A"}
                  />
                </div>

                {appointment.paymentDueDate && (
                  <DetailItem
                    icon={<Clock className="h-5 w-5 text-orange-600" />}
                    label="Hạn thanh toán"
                    value={new Date(appointment.paymentDueDate).toLocaleDateString("vi-VN")}
                  />
                )}

                {appointment.paymentUrl &&
                  appointment.paymentStatus?.toLowerCase() === "pending" && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-orange-900">Chờ thanh toán</p>
                          <p className="text-orange-700 text-sm">Vui lòng hoàn tất thanh toán</p>
                        </div>
                        <Button
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => window.open(appointment.paymentUrl!, "_blank")}
                        >
                          Thanh toán ngay
                        </Button>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Thông tin phiên tư vấn (nếu có) */}
            {session && (
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Kết quả phiên tư vấn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{session.rating}/5</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Kết thúc lúc: {new Date(session.endAt).toLocaleString("vi-VN")}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Tóm tắt phiên tư vấn:</p>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{session.summary}</p>
                  </div>

                  {session.feedback && (
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">Đánh giá từ khách hàng:</p>
                      <p className="text-gray-700 bg-blue-50 rounded-lg p-3">{session.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function DetailItem({
  icon,
  label,
  value,
  className = "",
  fullWidth = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3 ${fullWidth ? "col-span-full" : ""}`}>
      <div className="mt-1 text-gray-500">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className={`text-gray-900 ${className}`}>{value}</p>
      </div>
    </div>
  );
}
