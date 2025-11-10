import statisticService, { DailyRevenueDto } from "@/services/api/statistic-service";
import { useEffect, useState } from "react";

interface UseDailyRevenueStatisticsReturn {
  data: DailyRevenueDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để lấy thống kê doanh thu theo ngày
 */
export function useDailyRevenueStatistics(
  startDate: string,
  endDate: string
): UseDailyRevenueStatisticsReturn {
  const [data, setData] = useState<DailyRevenueDto[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await statisticService.getDailyRevenue(startDate, endDate);
      setData(res.data || []);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Lỗi khi tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) fetchData();
  }, [startDate, endDate]);

  return { data, loading, error, refetch: fetchData };
}
