"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentFailPage() {
  const params = useSearchParams();
  const code = params.get("code");
  const cancel = params.get("cancel");
  const message = params.get("message");

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-orange-50" />
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(theme(colors.rose.300)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        <Card className="w-full border-0 bg-white/70 backdrop-blur-md shadow-xl">
          <CardHeader className="items-center space-y-4 pb-2">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-rose-100 ring-8 ring-rose-50 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-10 w-10 text-rose-600"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-rose-500/10 blur-2xl" />
            </div>

            <CardTitle className="text-3xl md:text-4xl font-semibold tracking-tight text-rose-700">
              Thanh toán thất bại
            </CardTitle>
            <CardDescription className="max-w-2xl text-base md:text-lg leading-relaxed">
              Giao dịch chưa được xử lý. Vui lòng thử lại hoặc chọn phương thức khác.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {code && (
              <p>
                <span className="font-medium text-foreground">Mã phản hồi:</span> {code}
              </p>
            )}
            {message && (
              <p>
                <span className="font-medium text-foreground">Thông báo:</span> {message}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="sm:min-w-56">
              <Link href="/">Về trang chủ</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="sm:min-w-56">
              <Link href="/payment">Thử lại thanh toán</Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-xs text-muted-foreground">
          Nếu vẫn gặp sự cố, vui lòng liên hệ hỗ trợ HeartSpace.
        </p>
      </div>
    </div>
  );
}
