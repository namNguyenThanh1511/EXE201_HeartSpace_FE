// components/calendar/utils.ts
import { Appointment } from '@/lib/api/services/fetchAppointment';
import { CalendarEvent } from './types';

export function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  const appointmentDate = new Date(appointment.date);

  // Determine color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-500';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };
  console.log(appointment);

  return {
    id: appointment.id,
    title: `${appointment.customer.fullName} - ${appointment.saler.fullName}`,
    date: appointmentDate,
    time: appointmentDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    color: getStatusColor(appointment.status),
    appointment,
  };
}

export function groupEventsByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  return events.reduce(
    (acc, event) => {
      const dateKey = event.date.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, CalendarEvent[]>
  );
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dateKey = date.toDateString();
  return events.filter(event => event.date.toDateString() === dateKey);
}

export function getEventsForWeek(events: CalendarEvent[], startDate: Date): CalendarEvent[] {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return events.filter(event => event.date >= startDate && event.date <= endDate);
}
