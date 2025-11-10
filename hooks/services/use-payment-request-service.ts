import paymentRequestService, {
  PaymentRequestResponse,
} from "@/services/api/payment-request-service";
import { useEffect, useState } from "react";

export function usePaymentRequests() {
  const [data, setData] = useState<PaymentRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await paymentRequestService.getAll();
        console.log(response);
        setData(response.data || []);
      } catch (err: any) {
        setError(err.message ?? "Đã xảy ra lỗi khi tải danh sách yêu cầu rút tiền.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
