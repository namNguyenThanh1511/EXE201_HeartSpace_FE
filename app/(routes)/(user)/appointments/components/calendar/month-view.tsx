// components/calendar/month-view.tsx
import { cn } from '@/lib/utils';
import { CalendarEvent, CalendarDay } from './types';
import { getEventsForDate } from './utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MonthViewProps {
  events: CalendarEvent[];
  currentMonth: Date;
  selectedDate: Date;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function MonthView({
  events,
  currentMonth,
  selectedDate,
  onDateClick,
  onEventClick,
}: MonthViewProps) {
  const currentMonthValue = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();
  const today = new Date();

  // Clear time để tránh timezone issues
  today.setHours(0, 0, 0, 0);
  const selectedDateNormalized = new Date(selectedDate);
  selectedDateNormalized.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(currentYear, currentMonthValue, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonthValue + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays: CalendarDay[] = [];

  // Previous month days
  if (firstDayWeekday > 0) {
    const prevMonthLastDay = new Date(currentYear, currentMonthValue, 0);
    const prevMonthDaysCount = prevMonthLastDay.getDate();

    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = prevMonthDaysCount - i;
      const date = new Date(currentYear, currentMonthValue - 1, day);
      date.setHours(0, 0, 0, 0); // Normalize time

      calendarDays.push({
        day,
        date,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: date.getTime() === selectedDateNormalized.getTime(),
        events: getEventsForDate(events, date),
      });
    }
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonthValue, day);
    calendarDays.push({
      day,
      date,
      isCurrentMonth: true,
      isToday:
        day === today.getDate() &&
        currentMonthValue === today.getMonth() &&
        currentYear === today.getFullYear(),
      isSelected:
        day === selectedDate.getDate() &&
        currentMonthValue === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear(),
      events: getEventsForDate(events, date),
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear, currentMonthValue + 1, day);
    calendarDays.push({
      day,
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected:
        day === selectedDate.getDate() &&
        currentMonthValue + 1 === selectedDate.getMonth() &&
        currentYear === selectedDate.getFullYear(),
      events: getEventsForDate(events, date),
    });
  }

  const weekDays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  return (
    <TooltipProvider>
      <div className="flex-1">
        {/* Week headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map(day => (
            <div key={day} className="p-3 text-sm font-medium text-muted-foreground text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 auto-rows-fr h-full">
          {calendarDays.map((calendarDay, index) => (
            <div
              key={index}
              className={cn(
                'border-r border-b p-2 min-h-[120px] hover:bg-muted/50 cursor-pointer transition-colors',
                !calendarDay.isCurrentMonth && 'text-muted-foreground bg-muted/20',
                calendarDay.isToday && 'bg-blue-50 border-blue-200',
                calendarDay.isSelected &&
                  !calendarDay.isToday &&
                  'bg-primary/10 border-primary/30 ring-1 ring-primary/20',
                calendarDay.isSelected &&
                  calendarDay.isToday &&
                  'bg-blue-100 border-blue-300 ring-1 ring-blue-300'
              )}
              onClick={() => onDateClick?.(calendarDay.date)}
            >
              <div
                className={cn(
                  'text-sm font-medium mb-2 w-6 h-6 flex items-center justify-center rounded-full',
                  calendarDay.isToday && 'text-blue-600 bg-blue-100',
                  calendarDay.isSelected && !calendarDay.isToday && 'text-primary bg-primary/20',
                  calendarDay.isSelected && calendarDay.isToday && 'text-blue-700 bg-blue-200'
                )}
              >
                {calendarDay.day}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {calendarDay.events.slice(0, 3).map(event => (
                  <Tooltip key={event.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'text-xs px-2 py-1 rounded truncate cursor-pointer border-l-2 transition-colors hover:opacity-80',
                          event.color
                        )}
                        onClick={e => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                      >
                        {event.time} - {event.appointment.customer.fullName}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm">Thời gian: {event.time}</p>
                        <p className="text-sm">Khách hàng: {event.appointment.customer.fullName}</p>
                        <p className="text-sm">Nhân viên: {event.appointment.saler.fullName}</p>
                        <p className="text-sm">Trạng thái: {event.appointment.status}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {calendarDay.events.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2">
                    +{calendarDay.events.length - 3} lịch hẹn khác
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
