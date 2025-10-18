'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CalendarDays, MapPin, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { toast } from 'sonner';
import { useCancelAppointment } from '@/hooks/useAppointment';
import { Appointment, CancelAppointmentRequest } from '@/lib/api/services/fetchAppointment';

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
  onSuccess?: () => void;
}

export function CancelAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: CancelAppointmentDialogProps) {
  const [cancellationReason, setCancellationReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const cancelAppointment = useCancelAppointment();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, dd MMMM yyyy - HH:mm', { locale: vi });
  };

  const handleCancel = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy cuộc hẹn');
      return;
    }

    if (cancellationReason.trim().length < 5) {
      toast.error('Lý do hủy phải có ít nhất 5 ký tự');
      return;
    }

    try {
      const request: CancelAppointmentRequest = {
        cancellationReason: cancellationReason.trim(),
        notes: notes.trim() || undefined,
      };

      await cancelAppointment.mutateAsync({
        id: appointment.id,
        request,
      });

      // Reset form sau khi thành công
      setCancellationReason('');
      setNotes('');

      onSuccess?.();
    } catch (error) {
      // Error đã được handle trong hook
      console.error('Cancel appointment error:', error);
    }
  };

  const handleClose = () => {
    setCancellationReason('');
    setNotes('');
    onOpenChange(false);
  };

  const isFormValid = cancellationReason.trim().length >= 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Hủy cuộc hẹn
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning */}
          <Card className="bg-red-50/50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium text-red-900">
                    Bạn có chắc chắn muốn hủy cuộc hẹn này?
                  </p>
                  <p className="text-sm text-red-700">
                    Hành động này không thể hoàn tác. Khách hàng sẽ nhận được thông báo về việc hủy
                    cuộc hẹn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Info */}
          <Card className="bg-gray-50/50 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                    Thông tin cuộc hẹn
                  </Badge>
                  <span className="text-sm text-gray-600 font-mono">
                    #{appointment.id.slice(-8)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">{appointment.customer.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{appointment.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Reason */}
          <div className="space-y-2">
            <Label
              htmlFor="cancellationReason"
              className="text-base font-semibold flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-red-600" />
              Lý do hủy cuộc hẹn *
            </Label>
            <Textarea
              id="cancellationReason"
              placeholder="Vui lòng nhập lý do hủy cuộc hẹn (tối thiểu 5 ký tự)..."
              value={cancellationReason}
              onChange={e => setCancellationReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Lý do này sẽ được gửi thông báo đến khách hàng
              </p>
              <p className="text-xs text-gray-400">{cancellationReason.length}/500</p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-semibold">
              Ghi chú thêm (tùy chọn)
            </Label>
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú nếu cần..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">Ghi chú nội bộ, không gửi đến khách hàng</p>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={cancelAppointment.isPending}
            className="w-full sm:w-auto"
          >
            Không hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={!isFormValid || cancelAppointment.isPending}
            className="w-full sm:w-auto"
          >
            {cancelAppointment.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang hủy cuộc hẹn...
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Xác nhận hủy cuộc hẹn
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
