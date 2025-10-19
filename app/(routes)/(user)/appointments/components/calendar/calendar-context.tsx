'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarEvent } from './types';

export type CalendarView = 'day' | 'week' | 'month' | 'year';

interface CalendarContextType {
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;

  // Book appointment dialog state
  isBookDialogOpen: boolean;
  setIsBookDialogOpen: (open: boolean) => void;
  bookingPropertyId: string | undefined;
  setBookingPropertyId: (propertyId: string | undefined) => void;

  // Event details dialog state
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  isEventDetailsOpen: boolean;
  setIsEventDetailsOpen: (open: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Book appointment dialog state
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [bookingPropertyId, setBookingPropertyId] = useState<string | undefined>();

  // Event details dialog state
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  return (
    <CalendarContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedDate,
        setSelectedDate,
        currentMonth,
        setCurrentMonth,
        isBookDialogOpen,
        setIsBookDialogOpen,
        bookingPropertyId,
        setBookingPropertyId,
        selectedEvent,
        setSelectedEvent,
        isEventDetailsOpen,
        setIsEventDetailsOpen,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
