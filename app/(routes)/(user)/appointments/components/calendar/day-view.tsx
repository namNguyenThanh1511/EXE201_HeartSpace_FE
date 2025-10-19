// components/calendar/day-view.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './types';
import { getEventsForDate } from './utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DayViewProps {
  events: CalendarEvent[];
  selectedDate?: Date;
  onEventClick?: (event: CalendarEvent) => void;
}

export function DayView({ events, selectedDate = new Date(), onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = getEventsForDate(events, selectedDate);

  const getEventsForHour = (hour: number): CalendarEvent[] => {
    return dayEvents.filter(event => {
      const eventHour = event.date.getHours();
      return eventHour === hour;
    });
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col">
        {/* Day header */}
        <div className="p-4 border-b">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long' })}
            </div>
            <div className="text-2xl font-bold">
              {selectedDate.getDate()} tháng {selectedDate.getMonth() + 1}
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-0">
            {hours.map(hour => {
              const hourEvents = getEventsForHour(hour);
              return (
                <div key={hour} className="flex border-b">
                  <div className="w-20 p-2 text-xs text-muted-foreground text-right border-r">
                    {hour === 0
                      ? '12 SA'
                      : hour < 12
                        ? `${hour} SA`
                        : hour === 12
                          ? '12 CH'
                          : `${hour - 12} CH`}
                  </div>
                  <div className="flex-1 min-h-[60px] hover:bg-muted/50 cursor-pointer relative p-2">
                    {hourEvents.map((event, index) => (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'mb-1 p-2 rounded border-l-4 cursor-pointer',
                              event.color,
                              index > 0 && 'ml-2' // Offset multiple events
                            )}
                            onClick={() => onEventClick?.(event)}
                          >
                            <div className="text-sm font-medium">
                              {event.appointment.customer.fullName}
                            </div>
                            <div className="text-xs">
                              {event.time} - {event.appointment.saler.fullName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {event.appointment.status}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm">Thời gian: {event.time}</p>
                            <p className="text-sm">
                              Khách hàng: {event.appointment.customer.fullName}
                            </p>
                            <p className="text-sm">SĐT: {event.appointment.customer.phoneNumber}</p>
                            <p className="text-sm">Email: {event.appointment.customer.email}</p>
                            <p className="text-sm">Nhân viên: {event.appointment.saler.fullName}</p>
                            <p className="text-sm">Trạng thái: {event.appointment.status}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
