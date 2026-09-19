/** Date arithmetic and formatting for the calendar and the chats, in the device's locale and time zone. */

const dayMs = 24 * 60 * 60 * 1000;

/**
 * The hour cycle of the device's region, which the iOS shell sets before the page's scripts run
 * (`TraitBridgeViewController.swift`, spec 001 §21.5 D24); undefined in a browser, where the language decides.
 */
const hourCycle = document.documentElement.dataset.hourCycle as Intl.DateTimeFormatOptions['hourCycle'];

const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: 'short', hourCycle });
const weekdayShortFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
const weekdayLongFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long' });
const monthFormat = new Intl.DateTimeFormat(undefined, { month: 'long' });
const dayMonthFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
const mediumDateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const fullDateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' });

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes());
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

/** The Monday of the ISO 8601 week holding `date`. */
export function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  return addDays(day, -((day.getDay() + 6) % 7));
}

/** The ISO 8601 week number: 7–13 September 2026 is week 37, as in `IMG_0211.PNG`. */
export function isoWeek(date: Date): number {
  const thursday = addDays(startOfWeek(date), 3);
  const firstThursday = addDays(startOfWeek(new Date(thursday.getFullYear(), 0, 4)), 3);
  return 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * dayMs));
}

export const formatTime = (date: Date) => timeFormat.format(date);
export const formatTimeRange = (start: Date, end: Date) => timeFormat.formatRange(start, end);
export const formatWeekdayShort = (date: Date) => weekdayShortFormat.format(date);
export const formatMonth = (date: Date) => monthFormat.format(date);
export const formatFullDate = (date: Date) => fullDateFormat.format(date);

/** "Week 38 · 14–20 Sep", in the device's locale. */
export function weekTitle(weekStart: Date): string {
  return `Week ${isoWeek(weekStart)} · ${dayMonthFormat.formatRange(weekStart, addDays(weekStart, 6))}`;
}

/** "Today", "Yesterday", the weekday within the last week, or the date, relative to `today`. */
export function dayName(date: Date, today: Date): string {
  if (isSameDay(date, today)) {
    return 'Today';
  }
  if (isSameDay(date, addDays(today, -1))) {
    return 'Yesterday';
  }
  if (date >= startOfDay(addDays(today, -6))) {
    return weekdayLongFormat.format(date);
  }
  return mediumDateFormat.format(date);
}

/** The time for a message from today, otherwise the day. */
export function listTimestamp(date: Date, today: Date): string {
  return isSameDay(date, today) ? formatTime(date) : dayName(date, today);
}
