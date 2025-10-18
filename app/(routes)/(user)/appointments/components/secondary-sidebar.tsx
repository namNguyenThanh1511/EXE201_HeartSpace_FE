// components/secondary-sidebar.tsx
import * as React from 'react';
import { DatePicker } from './date-picker';

export function SecondarySidebar() {
  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <DatePicker />
        <div className="border-t pt-4">{/* <Calendars calendars={data.calendars} /> */}</div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <button className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded-md">
          &copy; {new Date().getFullYear()} RevoLand
        </button>
      </div>
    </div>
  );
}
