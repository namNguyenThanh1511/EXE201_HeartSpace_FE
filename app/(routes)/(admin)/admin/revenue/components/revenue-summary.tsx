import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DailyRevenueDto } from "@/services/api/statistic-service";

interface Props {
  data: DailyRevenueDto[];
}

export default function RevenueSummary({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.totalRevenue, 0);
  const consultant = data.reduce((sum, d) => sum + d.consultantRevenue, 0);
  const system = data.reduce((sum, d) => sum + d.systemRevenue, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tổng doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-blue-600">{total.toLocaleString()} ₫</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu tư vấn viên</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{consultant.toLocaleString()} ₫</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doanh thu hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-amber-600">{system.toLocaleString()} ₫</p>
        </CardContent>
      </Card>
    </div>
  );
}
