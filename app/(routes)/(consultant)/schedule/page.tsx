"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Edit, Loader2, Users, Clock } from "lucide-react";
import { scheduleService, CreateScheduleRequest } from "@/services/api/schedule-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { useConsultant } from "@/hooks/services/use-consultant-service";
import { useMyAppointments } from "@/hooks/services/use-appointment-service";
import { toast } from "sonner";

export default function SchedulePage() {
  const [startTime, setStartTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuthStore();
  
  // Debug: Check user data first
  console.log("[SchedulePage] User from authStore:", user);
  console.log("[SchedulePage] UserName for API call:", user?.userName || user?.id);
  
  // Sử dụng useConsultant để lấy thông tin consultant và freeSchedules
  // Use userName or id as fallback
  const consultantId = user?.userName || user?.id || "";
  const { data: consultantResponse, isLoading: consultantLoading, error: consultantError } = useConsultant(consultantId);
  const consultant = consultantResponse?.data;
  
  // Lấy schedules từ consultant.freeSchedules thay vì từ scheduleService
  const allSchedules = consultant?.freeSchedules || [];
  
  // Filter schedules: Bảng "Khung thời gian" hiển thị TẤT CẢ schedules
  const schedules = allSchedules;
  
  // Bảng "Lịch đã tạo" hiển thị các lịch có sẵn (available) để khách hàng có thể đặt
  const availableSchedules = allSchedules.filter((schedule) => schedule.isAvailable);
  
  // Fetch appointments
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useMyAppointments({
    pageNumber: 1,
    pageSize: 50
  });
  
  const appointments = appointmentsData?.appointments || [];
  
  // Debug logging
  console.log("[SchedulePage Debug] User:", user);
  console.log("[SchedulePage Debug] UserName:", user?.userName);
  console.log("[SchedulePage Debug] Consultant:", consultant);
  console.log("[SchedulePage Debug] AllSchedules:", allSchedules);
  console.log("[SchedulePage Debug] Schedules:", schedules);
  console.log("[SchedulePage Debug] AvailableSchedules:", availableSchedules);
  console.log("[SchedulePage Debug] Appointments:", appointments);
  console.log("[SchedulePage Debug] AppointmentsData:", appointmentsData);
  console.log("[SchedulePage Debug] Loading:", consultantLoading);
  console.log("[SchedulePage Debug] Error:", consultantError);

  // Hàm tính toán thời gian kết thúc dựa trên thời gian bắt đầu và duration
  const calculateEndTime = (start: string, duration: 30 | 60): Date => {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
    return endDate;
  };

  const handleAddSchedule = async () => {
    if (!startTime || !selectedDuration) {
      toast.error("Vui lòng chọn thời gian bắt đầu và thời lượng");
      return;
    }

    setCreating(true);
    try {
      const calculatedEndTime = calculateEndTime(startTime, selectedDuration);
      const scheduleData: CreateScheduleRequest = {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(calculatedEndTime).toISOString(),
      };

      await scheduleService.createSchedule(scheduleData);
      setStartTime("");
      setSelectedDuration(null);
      toast.success("Tạo lịch hẹn thành công!");
      // Refresh consultant data để cập nhật freeSchedules
      window.location.reload(); // Simple refresh để cập nhật data
    } catch (error) {
      console.error("Failed to create schedule:", error);
      toast.error("Không thể tạo lịch hẹn. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    setDeleting(id);
    try {
      await scheduleService.deleteSchedule(id);
      toast.success("Xóa lịch hẹn thành công!");
      // Refresh consultant data để cập nhật freeSchedules
      window.location.reload(); // Simple refresh để cập nhật data
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      toast.error("Không thể xóa lịch hẹn. Vui lòng thử lại.");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;

    setUpdating(id);
    try {
      await scheduleService.updateScheduleAvailability(id, !schedule.isAvailable);
      toast.success("Cập nhật trạng thái lịch thành công!");
      // Refresh consultant data để cập nhật freeSchedules
      window.location.reload(); // Simple refresh để cập nhật data
    } catch (error) {
      console.error("Failed to update schedule availability:", error);
      toast.error("Không thể cập nhật trạng thái lịch. Vui lòng thử lại.");
    } finally {
      setUpdating(null);
    }
  };


  const formatSchedule = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
    })} • ${start.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Lịch hẹn của tôi</h1>
          <p className="text-purple-200">Quản lý các khung thời gian có sẵn để tư vấn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Schedule Form */}
          <div>
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-600/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-300" />
                  Thêm khung thời gian mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-purple-200">
                    Thời gian bắt đầu
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-black/30 border-purple-600/30 text-white placeholder-purple-400 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-purple-200">
                    Thời lượng
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={selectedDuration === 30 ? "default" : "outline"}
                      onClick={() => setSelectedDuration(30)}
                      className="flex-1"
                    >
                      30 phút
                    </Button>
                    <Button
                      type="button"
                      variant={selectedDuration === 60 ? "default" : "outline"}
                      onClick={() => setSelectedDuration(60)}
                      className="flex-1"
                    >
                      60 phút
                    </Button>
                  </div>
                </div>

                {startTime && selectedDuration && (
                  <div className="p-3 bg-black/30 rounded-md border border-purple-600/20">
                    <p className="text-sm text-purple-200">
                      <strong>Thời gian bắt đầu:</strong> {new Date(startTime).toLocaleString('vi-VN', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    <p className="text-sm text-purple-200">
                      <strong>Thời gian kết thúc:</strong> {calculateEndTime(startTime, selectedDuration).toLocaleString('vi-VN', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddSchedule}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg border border-purple-400/50"
                    disabled={!startTime || !selectedDuration || creating}
                  >
                    {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    {creating ? "Đang tạo..." : "Thêm lịch hẹn"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStartTime("");
                      setSelectedDuration(null);
                    }}
                    className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                  >
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing Schedules */}
          <div>
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/ turbo-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-300" />
                  Khung thời gian của bạn ({schedules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {consultantLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
                    <p className="text-purple-200">Đang tải lịch hẹn...</p>
                  </div>
                ) : consultantError ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-200">Không thể tải thông tin consultant</p>
                    <p className="text-red-300 text-sm">Vui lòng thử lại sau</p>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-200">Chưa tạo khung thời gian nào</p>
                    <p className="text-purple-300 text-sm">Thêm khung thời gian đầu tiên để bắt đầu</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="w-full p-4 rounded-lg border-2 transition-all duration-200 bg-slate-800/30 border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-slate-600">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {formatSchedule(schedule.startTime, schedule.endTime)}
                              </div>
                              <div className="text-sm text-slate-400">
                                Thời lượng: {Math.round((new Date(schedule.endTime).getTime() - new Date(schedule.startTime).getTime()) / (1000 * 60))} phút
                              </div>
                              <Badge
                                className={`mt-1 ${
                                  schedule.isAvailable
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                }`}
                              >
                                {schedule.isAvailable ? "Có sẵn" : "Đã đặt"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleAvailability(schedule.id)}
                              disabled={updating === schedule.id}
                              className={`${
                                schedule.isAvailable
                                  ? "text-orange-400 hover:text-orange-300 hover:bg-orange-500/20"
                                  : "text-green-400 hover:text-green-300 hover:bg-green-500/20"
                              }`}
                            >
                              {updating === schedule.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Edit className="h-4 w-4" />
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              disabled={deleting === schedule.id}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              {deleting === schedule.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointments List */}
          <div>
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-600/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-300" />
                  Lịch đã được đặt ({appointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingAppointments ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
                    <p className="text-purple-200">Đang tải lịch hẹn...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-200">Chưa có lịch hẹn nào</p>
                    <p className="text-purple-300 text-sm">Chưa có khách hàng đặt lịch</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {appointments.map((appointment) => {
                      const schedule = appointment.schedule;
                      const startTime = schedule?.startTime || appointment.createdAt;
                      const endTime = schedule?.endTime || appointment.updatedAt;
                      
                      return (
                        <div
                          key={appointment.id}
                          className="w-full p-4 rounded-lg border-2 transition-all duration-200 bg-slate-800/30 border-slate-600 hover:border-slate-500 hover:bg-slate-700/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-purple-600">
                                <Clock className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium text-white">
                                  {formatSchedule(startTime, endTime)}
                                </div>
                                <div className="text-sm text-slate-400">
                                  Client ID: {appointment.clientId?.slice(0, 8) || "N/A"}...
                                </div>
                                <Badge
                                  className={`mt-1 ${
                                    appointment.paymentStatus === "paid"
                                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                      : appointment.paymentStatus === "pending"
                                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                                      : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                  }`}
                                >
                                  {appointment.paymentStatus === "paid" ? "Đã thanh toán" : 
                                   appointment.paymentStatus === "pending" ? "Chờ thanh toán" : 
                                   "Chưa thanh toán"}
                                </Badge>
                                {appointment.notes && (
                                  <div className="text-xs text-slate-400 mt-1">
                                    {appointment.notes.slice(0, 40)}...
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* (Đã xoá API Integration Status card) */}
      </div>
    </div>
  );
}
