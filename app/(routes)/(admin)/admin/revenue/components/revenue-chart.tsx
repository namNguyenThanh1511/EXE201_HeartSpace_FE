"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DailyRevenueDto } from "@/services/api/statistic-service";

interface RevenueChartProps {
  data: DailyRevenueDto[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Biểu đồ doanh thu theo ngày</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#2563eb"
              name="Tổng doanh thu"
              strokeWidth={2}
              dot
            />
            <Line
              type="monotone"
              dataKey="consultantRevenue"
              stroke="#22c55e"
              name="Doanh thu tư vấn viên"
              strokeWidth={2}
              dot
            />
            <Line
              type="monotone"
              dataKey="systemRevenue"
              stroke="#f59e0b"
              name="Doanh thu hệ thống"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
