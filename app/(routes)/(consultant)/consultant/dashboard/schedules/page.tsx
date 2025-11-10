"use client";

import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Edit, Loader2, Users, Clock } from "lucide-react";
import {
  scheduleService,
  CreateScheduleRequest,
  GetConsultantSchedulesRequest,
} from "@/services/api/schedule-service";
import { useAuthStore } from "@/store/zustand/auth-store";
import { useConsultant } from "@/hooks/services/use-consultant-service";

import { toast } from "sonner";
import { useGetConsultantSchedules } from "@/hooks/services/use-schedule-service";

export default function SchedulePage() {
  const [startTime, setStartTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuthStore();

  const { data: schedulesResponse } = useGetConsultantSchedules({
    consultantId: user?.id || "",
  });
  const schedules = schedulesResponse?.data || [];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 inline-block">
            <h1 className="text-3xl font-bold mb-2 text-slate-800">Lịch hẹn của tôi</h1>
            <p className="text-slate-600">Quản lý các khung thời gian có sẵn để tư vấn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Schedule Form */}
          <div>
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-2 border border-white/30">
                    <Plus className="h-5 w-5 text-blue-600" />
                  </div>
                  Thêm khung thời gian mới
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-slate-700">
                    Thời gian bắt đầu
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-white/30 backdrop-blur-sm border border-white/40 text-slate-800 placeholder-slate-500 focus:border-blue-400 focus:bg-white/40 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">Thời lượng</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={selectedDuration === 30 ? "default" : "outline"}
                      onClick={() => setSelectedDuration(30)}
                      className={`flex-1 transition-all duration-200 ${
                        selectedDuration === 30
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border border-white/20"
                          : "bg-white/30 backdrop-blur-sm border border-white/40 text-slate-700 hover:bg-white/40"
                      }`}
                    >
                      30 phút
                    </Button>
                    <Button
                      type="button"
                      variant={selectedDuration === 60 ? "default" : "outline"}
                      onClick={() => setSelectedDuration(60)}
                      className={`flex-1 transition-all duration-200 ${
                        selectedDuration === 60
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border border-white/20"
                          : "bg-white/30 backdrop-blur-sm border border-white/40 text-slate-700 hover:bg-white/40"
                      }`}
                    >
                      60 phút
                    </Button>
                  </div>
                </div>

                {startTime && selectedDuration && (
                  <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
                    <p className="text-sm text-slate-700">
                      <strong>Thời gian bắt đầu:</strong>{" "}
                      {new Date(startTime).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-slate-700">
                      <strong>Thời gian kết thúc:</strong>{" "}
                      {calculateEndTime(startTime, selectedDuration).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddSchedule}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg border border-white/20 backdrop-blur-sm rounded-xl flex-1 transition-all duration-200"
                    disabled={!startTime || !selectedDuration || creating}
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {creating ? "Đang tạo..." : "Thêm lịch hẹn"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartTime("");
                      setSelectedDuration(null);
                    }}
                    className="text-slate-600 hover:text-slate-800 hover:bg-white/40 border border-white/40 backdrop-blur-sm rounded-xl transition-all duration-200"
                  >
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Existing Schedules */}
          <div className="lg:col-span-2">
            <Card className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-2 border border-white/30">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  Khung thời gian của bạn ({schedules?.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {schedulesResponse === undefined ? (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                    </div>
                    <p className="text-slate-600">Đang tải lịch hẹn...</p>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-slate-600">Chưa tạo khung thời gian nào</p>
                    <p className="text-slate-500 text-sm">
                      Thêm khung thời gian đầu tiên để bắt đầu
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-sm ${
                          schedule.isAvailable
                            ? "bg-white/30 border-white/40 hover:border-blue-300 hover:bg-white/40"
                            : "bg-slate-100/30 border-slate-200/40 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full backdrop-blur-sm ${
                                schedule.isAvailable
                                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/40"
                                  : "bg-slate-200/50 border border-slate-300/40"
                              }`}
                            >
                              <Clock
                                className={`w-4 h-4 ${
                                  schedule.isAvailable ? "text-blue-600" : "text-slate-500"
                                }`}
                              />
                            </div>
                            <div>
                              <div
                                className={`font-medium ${
                                  schedule.isAvailable ? "text-slate-800" : "text-slate-600"
                                }`}
                              >
                                {formatSchedule(schedule.startTime, schedule.endTime)}
                              </div>
                              <div
                                className={`text-sm ${
                                  schedule.isAvailable ? "text-slate-600" : "text-slate-500"
                                }`}
                              >
                                Thời lượng:{" "}
                                {Math.round(
                                  (new Date(schedule.endTime).getTime() -
                                    new Date(schedule.startTime).getTime()) /
                                    (1000 * 60)
                                )}{" "}
                                phút
                              </div>
                              <Badge
                                className={`mt-1 border border-white/20 backdrop-blur-sm ${
                                  schedule.isAvailable
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                    : "bg-gradient-to-r from-slate-500 to-slate-600 text-white"
                                }`}
                              >
                                {schedule.isAvailable ? "Có sẵn" : "Đã đặt hoặc quá hạn"}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              disabled={deleting === schedule.id}
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/20 border border-red-200/40 backdrop-blur-sm rounded-lg transition-all duration-200"
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
        </div>
      </div>
    </div>
  );
}
