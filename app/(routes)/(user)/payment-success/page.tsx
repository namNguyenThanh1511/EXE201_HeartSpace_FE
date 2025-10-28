import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-sky-50" />
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(theme(colors.emerald.300)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        <Card className="w-full border-0 bg-white/70 backdrop-blur-md shadow-xl">
          <CardHeader className="items-center space-y-4 pb-2">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-emerald-100 ring-8 ring-emerald-50 flex items-center justify-center animate-[pulse_2.5s_ease-in-out_infinite]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-10 w-10 text-emerald-600">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-emerald-500/10 blur-2xl" />
            </div>

            <CardTitle className="text-3xl md:text-4xl font-semibold tracking-tight text-emerald-700">Thanh toán thành công</CardTitle>
            <CardDescription className="max-w-2xl text-base md:text-lg leading-relaxed">
              Cảm ơn bạn đã hoàn tất thanh toán. Đội ngũ HeartSpace sẽ sớm liên hệ để kích hoạt và bàn giao dịch vụ cho bạn.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="mx-auto grid max-w-xl gap-3 text-sm text-muted-foreground">
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="sm:min-w-56">
              <Link href="/">Bắt đầu sử dụng</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="sm:min-w-56">
              <Link href="/history">Xem lịch sử</Link>
            </Button>
          </CardFooter>
        </Card>
        <p className="text-xs text-muted-foreground">Mọi thắc mắc, vui lòng liên hệ hỗ trợ của HeartSpace.</p>
      </div>
    </div>
  );
}


