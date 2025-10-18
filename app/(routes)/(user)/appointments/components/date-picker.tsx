// components/date-picker.tsx
'use client';

import { SidebarGroup, SidebarGroupContent } from '@/components/ui/sidebar';
import { useCalendar } from './calendar/calendar-context';
import { Calendar } from './calendar/calendar-locale';
import { vi } from 'date-fns/locale';

export function DatePicker() {
  const { selectedDate, setSelectedDate, setCurrentView, setCurrentMonth } = useCalendar();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCurrentMonth(date);
      // Automatically switch to day view when a date is selected
      setCurrentView('day');
    }
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          locale={vi}
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="p-0 [&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
          initialFocus
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
