"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MeetingPage() {
  const params = useParams();
  const id = params?.id as string;

  // Mock detail by id; in real app fetch by id
  const meeting = {
    id,
    title: "Khám tim mạch",
    doctor: "Dr. Ethan Leo",
    time: "20/10/2025, 09:00 - 10:00",
    meetingUrl: "https://meet.google.com/xyz-1234-xyz",
    notes: "Vui lòng chuẩn bị kết quả xét nghiệm gần nhất.",
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{meeting.title}</CardTitle>
          <CardDescription>{meeting.time}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="text-sm">Bác sĩ phụ trách: <span className="font-medium">{meeting.doctor}</span></div>
          <div className="text-sm">Mã cuộc hẹn: <span className="font-mono">{meeting.id}</span></div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href={meeting.meetingUrl} target="_blank" rel="noreferrer">Tham gia phòng họp</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/history">Quay lại lịch đã đặt</Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">Ghi chú: {meeting.notes}</div>
        </CardContent>
      </Card>
    </div>
  );
}


