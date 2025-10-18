// app/appointments/page.tsx
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SecondarySidebar } from './components/secondary-sidebar';
import { CalendarMain } from './components/calendar/calendar-main';
import { CalendarProvider } from './components/calendar/calendar-context';

export default function Appointments() {
  return (
    <CalendarProvider>
      <SidebarProvider>
        <div className="flex-1 flex flex-col overflow-hidden">
          <SidebarInset>
            {/* Mobile-first responsive layout */}
            <div className="flex flex-col lg:flex-row flex-1 gap-2 sm:gap-4 p-2 sm:p-4">
              {/* Sidebar phụ - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block lg:w-64 lg:shrink-0">
                <div className="h-full border rounded-lg bg-background">
                  <SecondarySidebar />
                </div>
              </div>

              {/* Main Calendar Content */}
              <div className="flex-1 min-h-0">
                <CalendarMain />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </CalendarProvider>
  );
}
