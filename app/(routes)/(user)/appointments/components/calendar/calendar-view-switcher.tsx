// components/calendar/calendar-view-switcher.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCalendar } from './calendar-context';
import { ViewType } from './types';

export function CalendarViewSwitcher() {
  const { currentView, setCurrentView } = useCalendar();

  const views: { key: ViewType; label: string; shortLabel: string }[] = [
    { key: 'day', label: 'Ngày', shortLabel: 'Ngày' },
    { key: 'week', label: 'Tuần', shortLabel: 'Tuần' },
    { key: 'month', label: 'Tháng', shortLabel: 'Tháng' },
    { key: 'year', label: 'Năm', shortLabel: 'Năm' },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {views.map(view => (
        <Button
          key={view.key}
          variant={currentView === view.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCurrentView(view.key)}
          className="text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
        >
          <span className="sm:hidden">{view.shortLabel}</span>
          <span className="hidden sm:inline">{view.label}</span>
        </Button>
      ))}
    </div>
  );
}
