"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Calendar, FileText, Clock } from "lucide-react";
import {
  useConfirmAppointment,
  useCompleteAppointment,
  useCancelAppointment,
  useRescheduleAppointment,
  useAddNotes,
  useAppointmentActions,
} from "@/hooks/services/use-appointment-service";
import { AppointmentDetailResponse } from "@/services/api/appointment-service";
import { toast } from "sonner";

interface AppointmentActionsProps {
  appointment: AppointmentDetailResponse;
  onActionComplete?: () => void;
}

export function AppointmentActions({ appointment, onActionComplete }: AppointmentActionsProps) {
  const [cancelReason, setCancelReason] = useState("");
  const [notes, setNotes] = useState(appointment.notes || "");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  const {
    canConfirm,
    canComplete,
    canCancel,
    canReschedule,
    canAddNotes,
    isPending,
    isPendingPayment,
  } = useAppointmentActions(appointment);

  const { mutate: confirmAppointment, isPending: isConfirming } = useConfirmAppointment();
  const { mutate: completeAppointment, isPending: isCompleting } = useCompleteAppointment();
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  const { mutate: addNotes, isPending: isAddingNotes } = useAddNotes();

  const handleConfirm = () => {
    confirmAppointment(appointment.id, {
      onSuccess: () => {
        onActionComplete?.();
      },
    });
  };

  const handleComplete = () => {
    completeAppointment(appointment.id, {
      onSuccess: () => {
        onActionComplete?.();
      },
    });
  };

  const handleCancel = () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy");
      return;
    }
    cancelAppointment(
      { id: appointment.id, reason: cancelReason },
      {
        onSuccess: () => {
          setIsCancelDialogOpen(false);
          setCancelReason("");
          onActionComplete?.();
        },
      }
    );
  };

  const handleAddNotes = () => {
    if (!notes.trim()) {
      toast.error("Vui lòng nhập ghi chú");
      return;
    }
    addNotes(
      { id: appointment.id, notes },
      {
        onSuccess: () => {
          setIsNotesDialogOpen(false);
          onActionComplete?.();
        },
      }
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Confirm Button - Only for consultants/admins */}
      {canConfirm && (
        <Button
          onClick={handleConfirm}
          disabled={isConfirming}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isConfirming ? "Đang xác nhận..." : "Xác nhận cuộc hẹn"}
        </Button>
      )}

      {/* Complete Button */}
      {canComplete && (
        <Button
          onClick={handleComplete}
          disabled={isCompleting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {isCompleting ? "Đang hoàn thành..." : "Hoàn thành cuộc hẹn"}
        </Button>
      )}

      {/* Cancel Button */}
      {canCancel && (
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              <XCircle className="w-4 h-4 mr-2" />
              Hủy cuộc hẹn
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hủy cuộc hẹn</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancel-reason">Lý do hủy *</Label>
                <Textarea
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy cuộc hẹn..."
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                  disabled={isCancelling}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isCancelling || !cancelReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isCancelling ? "Đang hủy..." : "Xác nhận hủy"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Notes Button */}
      {canAddNotes && (
        <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Thêm ghi chú
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm ghi chú</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Ghi chú *</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập ghi chú cho cuộc hẹn..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsNotesDialogOpen(false)}
                  disabled={isAddingNotes}
                >
                  Hủy
                </Button>
                <Button onClick={handleAddNotes} disabled={isAddingNotes || !notes.trim()}>
                  {isAddingNotes ? "Đang lưu..." : "Lưu ghi chú"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Status Badges */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {isPending && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span>Đang chờ xác nhận</span>
          </div>
        )}
        {isPendingPayment && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Chờ thanh toán</span>
          </div>
        )}
      </div>
    </div>
  );
}
