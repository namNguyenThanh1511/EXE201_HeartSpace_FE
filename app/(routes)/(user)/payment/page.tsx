"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCancelAppointmentsAfterPayment,
  usePayingAppointment,
} from "@/hooks/services/use-appointment-service";

// PayOS returns query like: ?code=00&orderCode=...&transactionId=...
// This page reads the code and redirects to success/fail pages.
export default function PaymentRedirectHandler() {
  const router = useRouter();
  const params = useSearchParams();
  const orderCode = params.get("orderCode");
  const { mutate: payingAppointment } = usePayingAppointment();
  const { mutate: cancelAppointmentsAfterPayment } = useCancelAppointmentsAfterPayment();

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
      router.replace("/payment-fail?reason=missing_code");
      return;
    }

    if (code === "00") {
      payingAppointment(Number(orderCode), {
        onSuccess: () => {
          router.replace("/payment-success" + buildForwardParams(params));
        },
      });
    } else {
      cancelAppointmentsAfterPayment(Number(orderCode));
      router.replace("/payment-fail" + buildForwardParams(params));
    }
  }, [cancelAppointmentsAfterPayment, orderCode, params, payingAppointment, router]);

  return null;
}

function buildForwardParams(params: ReturnType<typeof useSearchParams>) {
  const allowed = ["code", "orderCode", "transactionId", "amount", "message"];
  const entries = allowed
    .map((k) => [k, params.get(k)] as const)
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`);
  return entries.length ? `?${entries.join("&")}` : "";
}
