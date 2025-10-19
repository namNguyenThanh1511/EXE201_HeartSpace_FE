// components/calendar/types.ts
import { Appointment } from '@/lib/api/services/fetchAppointment';

export type ViewType = 'day' | 'week' | 'month' | 'year';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  color: string;
  appointment: Appointment;
}

export interface CalendarDay {
  day: number;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
}
