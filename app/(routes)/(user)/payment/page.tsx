"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: integrate with real payment API
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Payment</h1>
        <p className="text-muted-foreground mt-2">Xác nhận thông tin và thanh toán đặt lịch khám.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_360px]">
        {/* Payment form */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Nhập thông tin bệnh nhân và phương thức thanh toán</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input id="fullname" name="fullname" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" name="phone" placeholder="09xx xxx xxx" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Ngày sinh</Label>
                  <Input id="dob" name="dob" type="date" />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Phương thức thanh toán</Label>
                <Tabs defaultValue="card" className="w-full">
                  <TabsList>
                    <TabsTrigger value="card">Thẻ</TabsTrigger>
                    <TabsTrigger value="momo">Ví Momo</TabsTrigger>
                    <TabsTrigger value="transfer">Chuyển khoản</TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Số thẻ</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">Tên in trên thẻ</Label>
                      <Input id="nameOnCard" placeholder="NGUYEN VAN A" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exp">Hạn</Label>
                      <Input id="exp" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </TabsContent>

                  <TabsContent value="momo" className="mt-4">
                    <p className="text-sm text-muted-foreground">Bạn sẽ được chuyển sang ứng dụng Momo để xác nhận thanh toán.</p>
                  </TabsContent>

                  <TabsContent value="transfer" className="mt-4">
                    <p className="text-sm">Vui lòng chuyển khoản theo thông tin hiển thị sau khi xác nhận. Nội dung: <span className="font-medium">BOOKING-[MÃ ĐƠN]</span>.</p>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Thanh toán"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="h-fit">
          <CardHeader className="border-b">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Thông tin lịch khám</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Bác sĩ</span>
              <span className="font-medium">Dr. Ethan Leo</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Chuyên khoa</span>
              <span className="font-medium">Cardiology</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ngày/giờ</span>
              <span className="font-medium">20/10/2025, 09:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Phí khám</span>
              <span className="font-medium">400.000đ</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between text-base">
              <span>Tổng</span>
              <span className="font-semibold">400.000đ</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


