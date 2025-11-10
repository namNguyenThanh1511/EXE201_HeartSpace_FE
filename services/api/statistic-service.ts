import { ApiResponse } from "@/types/api-type";
import apiService from "./core";

export interface DailyRevenueDto {
  date: string; // ISO string từ backend (DateTime)
  totalRevenue: number;
  consultantRevenue: number;
  systemRevenue: number;
}

export const statisticService = {
  /**
   * Lấy thống kê doanh thu theo ngày trong khoảng thời gian
   * @param startDate - Ngày bắt đầu (ISO string)
   * @param endDate - Ngày kết thúc (ISO string)
   */
  getDailyRevenue: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<DailyRevenueDto[]>> => {
    const response = await apiService.get<ApiResponse<DailyRevenueDto[]>>(
      `/api/statistics/daily-revenue?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },
};

export default statisticService;
