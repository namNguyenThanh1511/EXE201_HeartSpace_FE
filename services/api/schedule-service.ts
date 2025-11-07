import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

// Schedule data structure based on API
export interface ScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Create schedule request
export interface CreateScheduleRequest {
  startTime: string;
  endTime: string;
}

// Get consultant schedules request
export interface GetConsultantSchedulesRequest {
  consultantId: string;
}

export const scheduleService = {
  // Create a new schedule slot
  createSchedule: async (payload: CreateScheduleRequest): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await apiService.post<ApiResponse<ScheduleSlot>, CreateScheduleRequest>(
      "/api/schedules",
      payload
    );
    return response.data;
  },

  // Get consultant schedules
  getConsultantSchedules: async (
    params: GetConsultantSchedulesRequest
  ): Promise<ApiResponse<ScheduleSlot[]>> => {
    const { consultantId } = params;

    const response = await apiService.get<ApiResponse<ScheduleSlot[]>>(
      `/api/schedules/consultant/${consultantId}`
    );
    return response.data;
  },

  // Update schedule availability
  updateScheduleAvailability: async (
    scheduleId: string,
    isAvailable: boolean
  ): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await apiService.patch<ApiResponse<ScheduleSlot>, { isAvailable: boolean }>(
      `/api/schedules/${scheduleId}`,
      { isAvailable }
    );
    return response.data;
  },

  // Delete schedule
  deleteSchedule: async (scheduleId: string): Promise<ApiResponse<null>> => {
    const response = await apiService.delete<ApiResponse<null>>(`/api/schedules/${scheduleId}`);
    return response.data;
  },

  // Get schedule by ID
  getScheduleById: async (scheduleId: string): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await apiService.get<ApiResponse<ScheduleSlot>>(
      `/api/schedules/${scheduleId}`
    );
    return response.data;
  },
};

export default scheduleService;
