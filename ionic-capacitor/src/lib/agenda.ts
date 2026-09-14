import type { CalendarEvent } from '../fixtures/fixture';
import { addDays, startOfDay, startOfWeek } from './dates';

/** A day the agenda lists: today, or a day with at least one event. */
export interface AgendaDay {
  date: Date;
  events: CalendarEvent[];
}

export interface AgendaWeek {
  start: Date;
  days: AgendaDay[];
}

export interface AgendaMonth {
  start: Date;
  weeks: AgendaWeek[];
}

/** Groups the events by month and by week, as the agenda in `IMG_0211.PNG` does. */
export function agendaMonths(events: CalendarEvent[], today: Date): AgendaMonth[] {
  const eventsByDay = new Map<number, CalendarEvent[]>([[startOfDay(today).getTime(), []]]);
  for (const event of events) {
    const key = startOfDay(event.start).getTime();
    eventsByDay.set(key, [...(eventsByDay.get(key) ?? []), event]);
  }

  const months: AgendaMonth[] = [];
  for (const key of [...eventsByDay.keys()].sort((a, b) => a - b)) {
    const date = new Date(key);
    const dayEvents = [...(eventsByDay.get(key) ?? [])].sort((a, b) => a.start.getTime() - b.start.getTime());

    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    let month = months.at(-1);
    if (!month || month.start.getTime() !== monthStart.getTime()) {
      month = { start: monthStart, weeks: [] };
      months.push(month);
    }

    const weekStart = startOfWeek(date);
    let week = month.weeks.at(-1);
    if (!week || week.start.getTime() !== weekStart.getTime()) {
      week = { start: weekStart, days: [] };
      month.weeks.push(week);
    }
    week.days.push({ date, events: dayEvents });
  }
  return months;
}

/** The Monday of every week from the week holding `first` to the week holding `last`. */
export function weekStarts(first: Date, last: Date): Date[] {
  const weeks: Date[] = [];
  for (let week = startOfWeek(first); week <= last; week = addDays(week, 7)) {
    weeks.push(week);
  }
  return weeks;
}

/** The element id of a day's first agenda row, which the week strip scrolls to. */
export function dayAnchor(date: Date): string {
  return `agenda-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
