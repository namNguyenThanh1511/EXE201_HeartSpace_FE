// components/calendar/week-view.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './types';
import { getEventsForDate } from './utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WeekViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function WeekView({ events, onEventClick }: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekDays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  // Get current week dates
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getEventsForHour = (date: Date, hour: number): CalendarEvent[] => {
    const dayEvents = getEventsForDate(events, date);
    return dayEvents.filter(event => {
      const eventHour = event.date.getHours();
      return eventHour === hour;
    });
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-3 border-r"></div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-3 text-center border-r">
              <div className="text-sm text-muted-foreground">{weekDays[index]}</div>
              <div
                className={cn(
                  'text-lg font-medium',
                  date.toDateString() === currentDate.toDateString() && 'text-blue-600'
                )}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-8">
            {hours.map(hour => (
              <React.Fragment key={hour}>
                <div className="p-2 border-r border-b text-xs text-muted-foreground text-right">
                  {hour === 0
                    ? '12 SA'
                    : hour < 12
                      ? `${hour} SA`
                      : hour === 12
                        ? '12 CH'
                        : `${hour - 12} CH`}
                </div>
                {weekDates.map((date, dayIndex) => {
                  const hourEvents = getEventsForHour(date, hour);
                  return (
                    <div
                      key={`${hour}-${dayIndex}`}
                      className="border-r border-b min-h-[60px] hover:bg-muted/50 cursor-pointer relative p-1"
                    >
                      {hourEvents.map((event, eventIndex) => (
                        <Tooltip key={event.id}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                'absolute inset-1 p-1 rounded text-xs border-l-4 cursor-pointer',
                                event.color,
                                eventIndex > 0 && 'top-8' // Stack multiple events
                              )}
                              onClick={() => onEventClick?.(event)}
                            >
                              <div className="font-medium truncate">
                                {event.appointment.customer.fullName}
                              </div>
                              <div className="truncate">{event.time}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm">Thời gian: {event.time}</p>
                              <p className="text-sm">
                                Khách hàng: {event.appointment.customer.fullName}
                              </p>
                              <p className="text-sm">
                                Nhân viên: {event.appointment.saler.fullName}
                              </p>
                              <p className="text-sm">Trạng thái: {event.appointment.status}</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
