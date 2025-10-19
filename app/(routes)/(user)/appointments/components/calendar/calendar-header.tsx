// components/calendar/calendar-header.tsx
'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useCalendar } from './calendar-context';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function CalendarHeader() {
  const { currentMonth, setCurrentMonth, setSelectedDate } = useCalendar();

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="p-3 sm:p-4 border-b">
      <div className="flex items-center justify-between">
        {/* Navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* Current Month/Year */}
        <div className="flex-1 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy', { locale: vi })}
          </h2>
        </div>

        {/* Today Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Hôm nay</span>
          <span className="sm:hidden">Nay</span>
        </Button>
      </div>
    </div>
  );
}
