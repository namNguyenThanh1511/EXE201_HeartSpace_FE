// components/calendar/calendar-main.tsx
'use client';

import { CalendarHeader } from './calendar-header';
import { useEffect, useState } from 'react';
import { CalendarViewSwitcher } from './calendar-view-switcher';
import { MonthView } from './month-view';
import { WeekView } from './week-view';
import { DayView } from './day-view';

import { appointmentToCalendarEvent } from './utils';
import { CalendarEvent } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendar } from './calendar-context';
import {
  useGetUserAppointmentsByDate,
  useGetUserAppointmentsByDates,
} from '@/hooks/useAppointment';

import { EventDetailsDialog } from '../appointment/appointment-details-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CalendarMain() {
  const {
    currentView,
    selectedDate,
    currentMonth,
    setSelectedDate,
    setIsBookDialogOpen,
    // Event details dialog state
    selectedEvent,
    setSelectedEvent,
    isEventDetailsOpen,
    setIsEventDetailsOpen,
  } = useCalendar();

  // Fetch appointments filtered by selected date (YYYY-MM-DD)
  const selectedDateStr = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  const [status, setStatus] = useState<string | undefined>(undefined);

  const {
    data: dayAppointments = [],
    isLoading: isDayLoading,
    error: dayError,
    refetch: refetchDay,
    isRefetching: isDayRefetching,
  } = useGetUserAppointmentsByDate({
    date: selectedDateStr,
    status, // nếu bạn có filter status
    enabled: currentView === 'day',
  });

  // Week range strings YYYY-MM-DD
  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  });

  const {
    data: weekAppointments = [],
    isLoading: isWeekLoading,
    error: weekError,
    isRefetching: isWeekRefetching,
    refetchAll: refetchWeek,
  } = useGetUserAppointmentsByDates({
    dates: weekDates,
    status, // truyền thêm nếu có filter trạng thái
    enabled: currentView === 'week',
  });

  // Month range strings YYYY-MM-DD
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    return `${year}-${monthStr}-${day}`;
  });

  const {
    data: monthAppointments = [],
    isLoading: isMonthLoading,
    error: monthError,
    isRefetching: isMonthRefetching,
    refetchAll: refetchMonth,
  } = useGetUserAppointmentsByDates({
    dates: monthDates,
    status, // truyền thêm nếu có filter trạng thái
    enabled: currentView === 'month',
  });

  const dayEvents: CalendarEvent[] = dayAppointments.map(appointmentToCalendarEvent);
  const weekEvents: CalendarEvent[] = weekAppointments.map(appointmentToCalendarEvent);
  const monthEvents: CalendarEvent[] = monthAppointments.map(appointmentToCalendarEvent);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsBookDialogOpen(true);
  };

  // Refetch when switching views to ensure fresh data even if cached
  // Runs only on view change, avoiding continuous refetch
  useEffect(() => {
    if (currentView === 'day') {
      refetchDay();
    } else if (currentView === 'week') {
      refetchWeek();
    } else if (currentView === 'month') {
      refetchMonth();
    }
  }, [currentView, selectedDate]);

  const renderCalendarView = () => {
    if (
      currentView === 'day' ? isDayLoading : currentView === 'week' ? isWeekLoading : isMonthLoading
    ) {
      return <CalendarSkeleton view={currentView} />;
    }

    if (currentView === 'day' ? dayError : currentView === 'week' ? weekError : monthError) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <Alert className="max-w-md w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <p className="mb-3">Không thể tải dữ liệu lịch hẹn.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  currentView === 'day'
                    ? refetchDay()
                    : currentView === 'week'
                      ? refetchWeek()
                      : refetchMonth()
                }
                disabled={
                  currentView === 'day'
                    ? isDayRefetching
                    : currentView === 'week'
                      ? isWeekRefetching
                      : isMonthRefetching
                }
                className="w-full sm:w-auto"
              >
                {currentView === 'day' ? (
                  isDayRefetching ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    'Thử lại'
                  )
                ) : currentView === 'week' ? (
                  isWeekRefetching ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    'Thử lại'
                  )
                ) : isMonthRefetching ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  'Thử lại'
                )}
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    switch (currentView) {
      case 'day':
        return (
          <DayView events={dayEvents} selectedDate={selectedDate} onEventClick={handleEventClick} />
        );
      case 'week':
        return <WeekView events={weekEvents} onEventClick={handleEventClick} />;
      case 'month':
        return (
          <MonthView
            events={monthEvents}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
      case 'year':
        return (
          <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
            <div className="text-center">
              <p className="text-sm sm:text-base">Chế độ xem năm sẽ sớm được cập nhật...</p>
            </div>
          </div>
        );
      default:
        return (
          <MonthView
            events={monthEvents}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border">
      <CalendarHeader />

      {/* Controls Section - Responsive */}
      <div className="p-2 sm:p-4 border-b">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
          {/* View Switcher */}
          <div className="w-full sm:w-auto flex gap-2">
            <CalendarViewSwitcher />

            {/* ✅ Status Filter */}
            <Select
              value={status || 'ALL'}
              onValueChange={value => setStatus(value === 'ALL' ? undefined : value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="APPROVED">Đã xác nhận</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            {/* Loading Indicator */}
            {(currentView === 'day'
              ? isDayRefetching
              : currentView === 'week'
                ? isWeekRefetching
                : isMonthRefetching) && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="hidden sm:inline">Đang cập nhật...</span>
                <span className="sm:hidden">Đang tải...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 flex flex-col overflow-hidden">{renderCalendarView()}</div>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={isEventDetailsOpen}
        onOpenChange={setIsEventDetailsOpen}
        event={selectedEvent}
      />
    </div>
  );
}

// Loading skeleton component - Responsive
function CalendarSkeleton({ view }: { view: string }) {
  if (view === 'month') {
    return (
      <div className="flex-1 p-2 sm:p-4">
        {/* Header skeleton */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-6 sm:h-8" />
          ))}
        </div>
        {/* Calendar grid skeleton */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-16 sm:h-24" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 sm:p-4">
      <Skeleton className="h-full w-full" />
    </div>
  );
}
