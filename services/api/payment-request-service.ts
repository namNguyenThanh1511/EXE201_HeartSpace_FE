import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

// Data structure returned by the API
export interface PaymentRequestResponse {
  id: string;
  appointmentId: string;
  requestAmount: number;
  bankAccount: string;
  bankName: string;
  status: "Pending" | "Approved" | "Rejected" | "Processed";
  createdAt: string;
  processedAt?: string | null;
}

// Payment request service
export const paymentRequestService = {
  // Get all payment requests (for admin)
  getAll: async (): Promise<ApiResponse<PaymentRequestResponse[]>> => {
    const response = await apiService.get<ApiResponse<PaymentRequestResponse[]>>(
      "/api/payment-requests"
    );

    return response.data;
  },

  // Optionally: get a single request by ID
  getById: async (id: string): Promise<ApiResponse<PaymentRequestResponse>> => {
    const response = await apiService.get<ApiResponse<PaymentRequestResponse>>(
      `/api/payment-requests/${id}`
    );
    return response.data;
  },

  // Optionally: approve or reject a request
  updateStatus: async (
    id: string,
    status: "Approved" | "Rejected" | "Processed"
  ): Promise<ApiResponse<PaymentRequestResponse>> => {
    const response = await apiService.patch<
      ApiResponse<PaymentRequestResponse>,
      { status: string }
    >(`/api/payment-requests/${id}/status`, { status });
    return response.data;
  },
};

export default paymentRequestService;
