'use client';

import { useState } from 'react';
import { CalendarEvent } from '../calendar/types';
import { useConfirmAppointment } from '@/hooks/useAppointment';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/authStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CalendarDays, CheckCircle, MapPin, MessageSquare, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RescheduleDialog } from './reschedule-dialog';
import { CancelAppointmentDialog } from './cancel-appointment-dialog';

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
}

export function EventDetailsDialog({ open, onOpenChange, event }: EventDetailsDialogProps) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const confirmMutation = useConfirmAppointment();
  const currentUser = useAuthStore().user; // { id, role, ... }
  console.log(currentUser);

  if (!event) return null;
  const appointment = event.appointment;
  console.log(appointment);

  const now = new Date();
  const appointmentDate = new Date(appointment.date);
  const canConfirm =
    appointment.status.toLowerCase() === 'pending' && appointment.userId !== currentUser?.id;
  const canComplete =
    appointment.status.toLowerCase() === 'confirmed' &&
    now > appointmentDate &&
    appointment.status.toLowerCase() !== 'cancelled';

  const canReschedule =
    appointment.status.toLowerCase() !== 'cancelled' &&
    appointment.status.toLowerCase() !== 'completed';

  const canCancel = canReschedule;

  // --- Handlers ---
  const handleConfirm = () => {
    if (!canConfirm) {
      toast.error('Không thể xác nhận lịch hẹn này');
      return;
    }
    confirmMutation.mutate(appointment.id);
  };

  const handleComplete = () => {
    if (!canComplete) {
      toast.error('Chỉ có thể hoàn thành lịch đã được xác nhận và đã qua thời gian hẹn');
      return;
    }
    toast.success('Cuộc hẹn đã được hoàn thành');
    // TODO: Gọi API hoàn thành (useCompleteAppointment)
  };

  const handleEdit = () => toast.info('Chức năng chỉnh sửa đang phát triển...');
  const handleCancelSuccess = () => {
    setCancelOpen(false);
    onOpenChange(false);
  };
  const handleRescheduleSuccess = () => setRescheduleOpen(false);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">Chi tiết cuộc hẹn</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">#{appointment.id.slice(-8)}</p>
              </div>
              <Badge className={`${getStatusColor(appointment.status)} text-white`}>
                {getStatusText(appointment.status)}
              </Badge>
            </div>
          </DialogHeader>

          {/* Nội dung chính */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thời gian */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Thời gian cuộc hẹn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>{formatDate(appointment.date)}</span>
                    <span>{formatTime(appointment.date)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tạo lúc: {formatDate(appointment.createdAt)}
                  </p>
                </CardContent>
              </Card>

              {/* Thông tin địa điểm */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Địa điểm & Bất động sản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{appointment.location}</p>
                  <Link
                    href={`/properties/${appointment.propertyId}`}
                    className="text-sm text-blue-600 underline"
                  >
                    Xem bất động sản #{appointment.propertyId}
                  </Link>
                </CardContent>
              </Card>

              {appointment.lastStatusChange && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" /> Thay đổi trạng thái gần nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Trạng thái cũ:</span>
                      <span>{getStatusText(appointment.lastStatusChange.previousStatus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Trạng thái mới:</span>
                      <span>{getStatusText(appointment.lastStatusChange.newStatus)}</span>
                    </div>
                    {appointment.lastStatusChange.reason && (
                      <div>
                        <p className="font-medium text-muted-foreground">Lý do:</p>
                        <p className="mt-1">{appointment.lastStatusChange.reason}</p>
                      </div>
                    )}
                    {appointment.lastStatusChange.notes && (
                      <div>
                        <p className="font-medium text-muted-foreground">Ghi chú:</p>
                        <p className="mt-1">{appointment.lastStatusChange.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Thời gian thay đổi:</span>
                      <span>
                        {new Date(appointment.lastStatusChange.changedAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tin nhắn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> Tin nhắn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appointment.messages?.length ? (
                    <ul className="space-y-2 text-sm">
                      {appointment.messages.map((msg, idx) => (
                        <li key={idx} className="p-2 rounded bg-muted">
                          {msg}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Chưa có tin nhắn</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Saler */}
              <Card>
                <CardHeader>
                  <CardTitle>Nhân viên bán hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(appointment.saler.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.saler.fullName}</p>
                      <p className="text-xs text-muted-foreground">{appointment.saler.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer */}
              <Card>
                <CardHeader>
                  <CardTitle>Khách hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(appointment.customer.fullName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.customer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{appointment.customer.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {canConfirm && (
                    <Button
                      className="w-full"
                      onClick={handleConfirm}
                      disabled={confirmMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Xác nhận lịch hẹn
                    </Button>
                  )}
                  <Button className="w-full" onClick={handleComplete} disabled={!canComplete}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Hoàn thành cuộc hẹn
                  </Button>
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => setRescheduleOpen(true)}
                    disabled={!canReschedule}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" /> Dời lịch hẹn
                  </Button>
                  <Separator />
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => setCancelOpen(true)}
                    disabled={!canCancel}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Hủy cuộc hẹn
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog phụ */}
      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        appointment={appointment}
        onSuccess={handleRescheduleSuccess}
      />
      <CancelAppointmentDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        appointment={appointment}
        onSuccess={handleCancelSuccess}
      />
    </>
  );
}
