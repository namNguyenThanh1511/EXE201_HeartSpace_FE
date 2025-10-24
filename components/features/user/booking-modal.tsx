"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { useBookAppointment } from "@/hooks/services/use-booking-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: string;
  consultantId: string;
  scheduleTime: string;
  consultantName: string;
  consultantSpecialization?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  scheduleId,
  consultantId,
  scheduleTime,
  consultantName,
  consultantSpecialization,
}: BookingModalProps) {
  const { user } = useAuthStore();
  const { mutate: bookAppointment, isPending } = useBookAppointment();
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!user?.id) {
    //   toast.error("Vui lòng đăng nhập để đặt lịch");
    //   return;
    // }

    const bookingRequest = {
      scheduleId,
      notes: notes.trim(),
    };
    bookAppointment(bookingRequest, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          onClose();
          setNotes("");
        }
      },
    });
  };

  const handleClose = () => {
    if (!isPending) {
      setNotes("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Đặt lịch tư vấn
          </DialogTitle>
          <DialogDescription className="text-slate-300 mt-2">
            Hoàn tất thông tin để đặt lịch tư vấn với chuyên gia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Consultant Information */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-semibold text-white">{consultantName}</h4>
                {consultantSpecialization && (
                  <p className="text-sm text-slate-400">{consultantSpecialization}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-slate-300 text-sm">{scheduleTime}</span>
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-white font-medium">
              Thông tin cần tư vấn
            </Label>
            <Textarea
              id="notes"
              placeholder="Mô tả chi tiết vấn đề bạn muốn được tư vấn...
Ví dụ:
- Vấn đề cụ thể bạn đang gặp phải
- Mục tiêu bạn muốn đạt được
- Thông tin bổ sung cần chia sẻ"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 min-h-[120px] resize-none focus:border-blue-500 transition-colors"
              required
            />
            <p className="text-xs text-slate-400">
              Cung cấp thông tin chi tiết sẽ giúp tư vấn viên chuẩn bị tốt hơn cho buổi tư vấn
            </p>
          </div>

          {/* Authentication Alert */}
          {!user && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-800">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>Vui lòng đăng nhập để đặt lịch tư vấn</AlertDescription>
            </Alert>
          )}

          {/* Current User Info */}
          {user && (
            <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700">
              <p className="text-sm text-slate-300">
                Đặt lịch với tư cách:{" "}
                <span className="font-semibold text-white">{user.fullName || user.email}</span>
              </p>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 sm:flex-none border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending || !notes.trim() || !user}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </div>
              ) : (
                "Xác nhận đặt lịch"
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Additional Information */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 space-y-1">
            <p>• Bạn sẽ nhận được email xác nhận đặt lịch</p>
            <p>• Có thể hủy lịch trước 24 giờ</p>
            <p>• Tư vấn viên sẽ liên hệ qua email/điện thoại</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
