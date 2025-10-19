"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { scheduleService, ScheduleSlot, CreateScheduleRequest } from "@/services/api/schedule-service";
import { useAuthStore } from "@/store/zustand/auth-store";

// Mock existing schedules for fallback
const mockExistingSchedules: ScheduleSlot[] = [
  { id: "1", startTime: "2025-01-22T09:00:00.000Z", endTime: "2025-01-22T10:00:00.000Z", isAvailable: true },
  { id: "2", startTime: "2025-01-22T14:00:00.000Z", endTime: "2025-01-22T15:00:00.000Z", isAvailable: true },
  { id: "3", startTime: "2025-01-23T10:00:00.000Z", endTime: "2025-01-23T11:00:00.000Z", isAvailable: false },
];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuthStore();

  const loadSchedules = useCallback(async () => {
    if (!user?.userName) return;

    setLoading(true);
    try {
      const response = await scheduleService.getConsultantSchedules({
        consultantId: user.userName,
        pageNumber: 1,
        pageSize: 50,
      });
      setSchedules(response.data);
    } catch (error) {
      console.error("Failed to load schedules:", error);
      setSchedules(mockExistingSchedules);
    } finally {
      setLoading(false);
    }
  }, [user?.userName]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleAddSchedule = async () => {
    if (!startTime || !endTime) return;

    setCreating(true);
    try {
      const scheduleData: CreateScheduleRequest = {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      };

      const response = await scheduleService.createSchedule(scheduleData);
      setSchedules([...schedules, response.data]);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Failed to create schedule:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    setDeleting(id);
    try {
      await scheduleService.deleteSchedule(id);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleAvailability = async (id: string) => {
    const schedule = schedules.find((s) => s.id === id);
    if (!schedule) return;

    setUpdating(id);
    try {
      const response = await scheduleService.updateScheduleAvailability(id, !schedule.isAvailable);
      setSchedules(schedules.map((s) => (s.id === id ? response.data : s)));
    } catch (error) {
      console.error("Failed to update schedule availability:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatScheduleTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateStr = start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const startTimeStr = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const endTimeStr = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return { date: dateStr, time: `${startTimeStr} - ${endTimeStr}` };
  };

  // Group schedules by date
  const groupedSchedules = schedules.reduce((groups, schedule) => {
    const date = new Date(schedule.startTime).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    if (!groups[date]) groups[date] = [];
    groups[date].push(schedule);
    return groups;
  }, {} as Record<string, ScheduleSlot[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Schedule</h1>
          <p className="text-purple-200">Manage your available time slots for consultations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Schedule Form */}
          <div>
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-600/30 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-purple-300" />
                  Add New Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-purple-200">
                    Start Time
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
                  <Label htmlFor="endTime" className="text-purple-200">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-black/30 border-purple-600/30 text-white placeholder-purple-400 focus:border-purple-400"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddSchedule}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg border border-purple-400/50"
                    disabled={!startTime || !endTime || creating}
                  >
                    {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                    {creating ? "Creating..." : "Add Schedule"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStartTime("");
                      setEndTime("");
                    }}
                    className="text-purple-300 hover:text-white hover:bg-purple-800/30"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Options */}
            <Card className="bg-gradient-to-r from-purple-800/40 to-blue-800/40 border-purple-600/30 backdrop-blur-sm shadow-2xl mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-300" />
                  Quick Add Common Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Morning (9-10 AM)", start: "09:00", end: "10:00" },
                    { label: "Morning (10-11 AM)", start: "10:00", end: "11:00" },
                    { label: "Afternoon (2-3 PM)", start: "14:00", end: "15:00" },
                    { label: "Afternoon (3-4 PM)", start: "15:00", end: "16:00" },
                  ].map((slot) => (
                    <Button
                      key={slot.label}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const today = new Date().toISOString().split("T")[0];
                        setStartTime(`${today}T${slot.start}`);
                        setEndTime(`${today}T${slot.end}`);
                      }}
                      className="text-purple-200 hover:text-white hover:bg-purple-700/40 border border-purple-600/20"
                    >
                      {slot.label}
                    </Button>
                  ))}
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
                  Your Time Slots ({schedules.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
                    <p className="text-purple-200">Loading schedules...</p>
                  </div>
                ) : schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-200">No time slots created yet</p>
                    <p className="text-purple-300 text-sm">Add your first available time slot to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {Object.entries(groupedSchedules).map(([date, dateSchedules]) => (
                      <div key={date}>
                        <h3 className="text-lg font-semibold text-white mb-3 border-b border-purple-600/30 pb-1">
                          {date}
                        </h3>
                        <div className="space-y-2">
                          {dateSchedules.map((schedule) => {
                            const { time } = formatScheduleTime(schedule.startTime, schedule.endTime);
                            return (
                              <div
                                key={schedule.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-black/30 border border-purple-600/20 hover:bg-purple-700/40 transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col">
                                    <div className="font-medium text-white">{time}</div>
                                    <Badge
                                      className={`w-fit ${
                                        schedule.isAvailable
                                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                      }`}
                                    >
                                      {schedule.isAvailable ? "Available" : "Booked"}
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
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
