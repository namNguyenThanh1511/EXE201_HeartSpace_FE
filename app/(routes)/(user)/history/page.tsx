"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Booking = {
  id: string;
  title: string;
  doctor: string;
  start: string; // ISO
  end: string;   // ISO
  meetingUrl: string;
  location?: string;
};

const mockBookings: Booking[] = [
  {
    id: "bk-1001",
    title: "Khám tim mạch",
    doctor: "Dr. Ethan Leo",
    start: new Date().toISOString().slice(0, 10) + "T09:00:00",
    end: new Date().toISOString().slice(0, 10) + "T10:00:00",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/abc",
    location: "Online",
  },
  {
    id: "bk-1002",
    title: "Tư vấn da liễu",
    doctor: "Dr. Ava Stone",
    start: new Date(Date.now() + 86400000).toISOString().slice(0, 10) + "T19:30:00",
    end: new Date(Date.now() + 86400000).toISOString().slice(0, 10) + "T20:30:00",
    meetingUrl: "https://meet.google.com/xyz-1234-xyz",
    location: "Online",
  },
  {
    id: "bk-1003",
    title: "Khám nhi",
    doctor: "Dr. Liam Park",
    start: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) + "T08:00:00",
    end: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10) + "T09:00:00",
    meetingUrl: "https://zoom.us/j/1234567890",
    location: "Phòng khám số 2",
  },
];

function formatDayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function toLocalHM(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPage() {
  const grouped = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of mockBookings) {
      const key = formatDayKey(new Date(b.start));
      if (!map[key]) map[key] = [];
      map[key].push(b);
    }
    return map;
  }, []);

  const days = useMemo(() => {
    const start = new Date();
    // start from Monday of current week
    const day = start.getDay();
    const diff = (day === 0 ? -6 : 1 - day); // Monday index 1
    const monday = new Date(start);
    monday.setDate(start.getDate() + diff);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold">Lịch đã đặt</h1>
        <p className="text-muted-foreground mt-2">Xem lịch theo tuần. Nhấn vào sự kiện để mở phòng họp và chi tiết.</p>
      </div>

      {/* Week grid inspired by Google Calendar */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {days.map((d) => {
          const key = formatDayKey(d);
          const isToday = formatDayKey(new Date()) === key;
          const events = grouped[key] || [];
          return (
            <Card key={key} className={isToday ? "border-primary" : undefined}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {d.toLocaleDateString([], { weekday: "short" })} {d.getDate()}/{d.getMonth() + 1}
                </CardTitle>
                {isToday && <CardDescription>Hôm nay</CardDescription>}
              </CardHeader>
              <CardContent className="pt-0">
                {events.length === 0 ? (
                  <div className="text-muted-foreground text-sm">Không có lịch</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {events.map((ev) => (
                      <Link key={ev.id} href={`/meeting/${ev.id}`} className="rounded-md border p-3 hover:bg-accent">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{ev.title}</div>
                          <Badge variant="secondary">{toLocalHM(ev.start)} - {toLocalHM(ev.end)}</Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">{ev.doctor} • {ev.location || "Online"}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


