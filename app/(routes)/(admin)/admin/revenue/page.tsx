"use client";

import { useState } from "react";

import { subDays } from "date-fns";
import { useDailyRevenueStatistics } from "@/hooks/services/use-daily-revenue-service";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import RevenueSummary from "./components/revenue-summary";
import RevenueChart from "./components/revenue-chart";

export default function RevenueStatisticsPage() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const startDate = dateRange.from.toISOString().split("T")[0];
  const endDate = dateRange.to.toISOString().split("T")[0];

  const { data, loading, error } = useDailyRevenueStatistics(startDate, endDate);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>

      <div className="flex items-center justify-between">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data && data.length > 0 ? (
        <>
          <RevenueSummary data={data} />
          <RevenueChart data={data} />
        </>
      ) : (
        !loading && <p>Không có dữ liệu trong khoảng thời gian này</p>
      )}
    </div>
  );
}
