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
  pageNumber?: number;
  pageSize?: number;
}

// API response wrapper structure
export interface ScheduleApiResponse {
  status: string;
  message: string;
  code: number;
  errors: Array<{
    message: string;
    code: number;
    field: string;
  }>;
  metaData: string;
  isSuccess: boolean;
  data: ScheduleSlot | ScheduleSlot[];
}

export const scheduleService = {
  // Create a new schedule slot
  createSchedule: async (
    payload: CreateScheduleRequest
  ): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await apiService.post<ScheduleApiResponse, CreateScheduleRequest>(
      "/api/schedules",
      payload
    );

    // Extract the schedule data from the API response wrapper
    const createdSchedule = (response.data as ScheduleApiResponse).data as ScheduleSlot;

    return {
      data: createdSchedule,
      status: response.status,
      headers: response.headers
    };
  },

  // Get consultant schedules
  getConsultantSchedules: async (
    params: GetConsultantSchedulesRequest
  ): Promise<ApiResponse<ScheduleSlot[]>> => {
    const { consultantId, pageNumber = 1, pageSize = 10 } = params;

    const response = await apiService.get<ScheduleApiResponse>(
      `/api/schedules/consultant/${consultantId}`,
      {
        PageNumber: pageNumber,
        PageSize: pageSize
      }
    );

    // Extract the schedule data from the API response wrapper
    const scheduleList = (response.data as ScheduleApiResponse).data as ScheduleSlot[];

    return {
      data: Array.isArray(scheduleList) ? scheduleList : [scheduleList],
      status: response.status,
      headers: response.headers
    };
  },

  // Update schedule availability
  updateScheduleAvailability: async (
    scheduleId: string,
    isAvailable: boolean
  ): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await apiService.patch<ScheduleApiResponse, { isAvailable: boolean }>(
      `/api/schedules/${scheduleId}`,
      { isAvailable }
    );

    // Extract the schedule data from the API response wrapper
    const updatedSchedule = (response.data as ScheduleApiResponse).data as ScheduleSlot;

    return {
      data: updatedSchedule,
      status: response.status,
      headers: response.headers
    };
  },

  // Delete schedule
  deleteSchedule: async (scheduleId: string): Promise<ApiResponse<null>> => {
    const response = await apiService.delete<null>(`/api/schedules/${scheduleId}`);
    return {
      data: response.data,
      status: response.status,
      headers: response.headers
    };
  },

  // Get schedule by ID
  getScheduleById: async (scheduleId: string): Promise<ApiResponse<ScheduleSlot>> => {
    const response = await apiService.get<ScheduleApiResponse>(`/api/schedules/${scheduleId}`);
    
    // Extract the schedule data from the API response wrapper
    const scheduleData = (response.data as ScheduleApiResponse).data as ScheduleSlot;

    return {
      data: scheduleData,
      status: response.status,
      headers: response.headers
    };
  },

  // Get multiple schedules by IDs
  getSchedulesByIds: async (scheduleIds: string[]): Promise<ApiResponse<ScheduleSlot[]>> => {
    // Since there might not be a batch endpoint, we could fetch them individually
    // For now, let's assume we have a batch endpoint or implement sequential fetching
    const schedules: ScheduleSlot[] = [];
    
    for (const scheduleId of scheduleIds) {
      try {
        const response = await apiService.get<ScheduleApiResponse>(`/api/schedules/${scheduleId}`);
        const scheduleData = (response.data as ScheduleApiResponse).data as ScheduleSlot;
        schedules.push(scheduleData);
      } catch (error) {
        console.error(`Failed to fetch schedule ${scheduleId}:`, error);
      }
    }

    return {
      data: schedules,
      status: 200,
      headers: {}
    };
  }
};

export default scheduleService;
