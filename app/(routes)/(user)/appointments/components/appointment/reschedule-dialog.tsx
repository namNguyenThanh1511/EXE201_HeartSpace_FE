'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, User, AlertCircle } from 'lucide-react';
import { format, isBefore, startOfDay, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

import { toast } from 'sonner';
import { useRescheduleAppointment } from '@/hooks/useAppointment';
import { Appointment } from '@/lib/api/services/fetchAppointment';

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
  onSuccess?: () => void;
}

export function RescheduleDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: RescheduleDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const rescheduleAppointment = useRescheduleAppointment();

  // Time slots available (có thể customize theo business logic)
  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
  ];

  const formatOriginalDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, dd MMMM yyyy - HH:mm', { locale: vi });
  };

  const formatNewDate = () => {
    if (!selectedDate || !selectedTime) return '';
    const [hours, minutes] = selectedTime.split(':');
    const newDate = new Date(selectedDate);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    return format(newDate, 'EEEE, dd MMMM yyyy - HH:mm', { locale: vi });
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    return isBefore(date, tomorrow); // Chỉ cho phép chọn từ ngày mai trở đi
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Vui lòng chọn ngày và giờ mới');
      return;
    }

    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do yêu cầu chuyển lịch');
      return;
    }

    try {
      // Tạo ISO string cho ngày giờ mới
      const [hours, minutes] = selectedTime.split(':');
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await rescheduleAppointment.mutateAsync({
        id: appointment.id,
        request: {
          newDate: newDateTime.toISOString(),
          reason: reason.trim(),
        },
      });

      // Reset form sau khi thành công
      setSelectedDate(undefined);
      setSelectedTime('');
      setReason('');

      onSuccess?.();
    } catch (error) {
      // Error đã được handle trong hook useRescheduleAppointment
      console.error('Reschedule error:', error);
    }
  };

  const handleCancel = () => {
    setSelectedDate(undefined);
    setSelectedTime('');
    setReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" />
            Yêu cầu chuyển lịch hẹn
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Appointment Info */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                      Lịch hẹn hiện tại
                    </Badge>
                    <span className="text-sm text-gray-600 font-mono">
                      #{appointment.id.slice(-8)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{formatOriginalDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{appointment.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-700">
                        Khách hàng: {appointment.customer.fullName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Chọn ngày mới</Label>
              <Card>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    locale={vi}
                    className="rounded-md border-0"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Chọn giờ mới</Label>
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* New Appointment Preview */}
          {selectedDate && selectedTime && (
            <Card className="bg-green-50/50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                    Lịch hẹn mới
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{formatNewDate()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Lý do yêu cầu chuyển lịch *
            </Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do chuyển lịch hẹn..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">Lý do này sẽ được gửi thông báo đến khách hàng</p>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={rescheduleAppointment.isPending}
            className="w-full sm:w-auto"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={
              !selectedDate || !selectedTime || !reason.trim() || rescheduleAppointment.isPending
            }
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {rescheduleAppointment.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang gửi yêu cầu chuyển lịch ...
              </>
            ) : (
              <>
                <CalendarDays className="h-4 w-4 mr-2" />
                Xác nhận yêu cầu chuyển lịch
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
