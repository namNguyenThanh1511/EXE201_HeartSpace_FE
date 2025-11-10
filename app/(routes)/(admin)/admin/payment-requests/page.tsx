"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { usePaymentRequests } from "@/hooks/services/use-payment-request-service";

export default function PaymentRequestsPage() {
  const { data, loading, error } = usePaymentRequests();
  console.log(data);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Processed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Danh sách yêu cầu rút tiền</h1>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : data.length === 0 ? (
        <p>Không có yêu cầu rút tiền nào.</p>
      ) : (
        <Table>
          <TableCaption>Danh sách các yêu cầu rút tiền từ Consultant</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Ngân hàng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày xử lý</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-mono text-xs">{request.id}</TableCell>
                <TableCell className="text-sm">{request.appointmentId}</TableCell>
                <TableCell className="font-medium">
                  {request.requestAmount.toLocaleString("vi-VN")} ₫
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{request.bankName}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.bankAccount || "Chưa có thông tin"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(request.createdAt), "dd/MM/yyyy HH:mm")}</TableCell>
                <TableCell>
                  {request.processedAt
                    ? format(new Date(request.processedAt), "dd/MM/yyyy HH:mm")
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
