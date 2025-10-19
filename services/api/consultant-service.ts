import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

export interface ConsultantResponse {
  id: string;
  fullName: string;
  bio: string;
  email: string;
  phoneNumber: string;
  username: string;
  dateOfBirth: string;
  avatar: string | null;
  role: string;
  gender: boolean;
  isActive: boolean;
  createdAt: string;
  consultantInfo: ConsultantDetailResponse;
  freeSchedules: FreeScheduleResponse[];
}

export interface ConsultantDetailResponse {
  consultingIn: ConsultingsResponse[];
  specialization: string;
  experienceYears: number;
  hourlyRate: number | null;
  certifications: string | null;
}

export interface ConsultingsResponse {
  id: string;
  name: string;
  description: string;
}

export interface FreeScheduleResponse {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Metadata interface for pagination
export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

// Query parameters for filtering consultants
export interface ConsultantQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  gender?: boolean;
  consultingsAt?: number[];
}

export const consultantService = {
  getConsultants: async (
    queryParams?: ConsultantQueryParams
  ): Promise<ApiResponse<ConsultantResponse[]>> => {
    const params = Object.fromEntries(
      Object.entries(queryParams || {}).filter(([_, v]) => v !== undefined && v !== null)
    );

    const response = await apiService.get<ApiResponse<ConsultantResponse[]>>(
      "/api/consultants",
      params as Record<string, string | number | boolean | string[]>
    );

    return response.data; // ✅ fix: unwrap apiService’s response
  },

  getConsultantById: async (id: string): Promise<ApiResponse<ConsultantResponse>> => {
    const response = await apiService.get<ApiResponse<ConsultantResponse>>(
      `/api/consultants/${id}`
    );
    return response.data;
  },

  // Optional: Get all available consulting categories
  getConsultingCategories: async (): Promise<ApiResponse<ConsultingsResponse[]>> => {
    const response = await apiService.get<ApiResponse<ConsultingsResponse[]>>(
      "/api/consultings" // Assuming this endpoint exists
    );
    return response.data;
  },
};
