import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { addDays, formatFullDate, formatMonth, formatWeekdayShort, isSameDay, isWeekend, startOfDay, startOfWeek } from '../lib/dates';
import './WeekStrip.css';

interface WeekStripProps {
  /** The Monday of each week the strip pages through. */
  weeks: Date[];
  selectedDay: Date;
  today: Date;
  /** `startOfDay(…).getTime()` of each day with an event. */
  eventDays: Set<number>;
  onSelect: (day: Date) => void;
}

/** The Monday-to-Sunday strip at the top of `IMG_0211.PNG`, paging one week at a time. */
export default function WeekStrip({ weeks, selectedDay, today, eventDays, onSelect }: WeekStripProps) {
  const pages = useRef<HTMLDivElement>(null);
  const selectedWeek = Math.max(
    0,
    weeks.findIndex((week) => isSameDay(week, startOfWeek(selectedDay))),
  );
  const [visibleWeek, setVisibleWeek] = useState(selectedWeek);

  useLayoutEffect(() => {
    const element = pages.current;
    if (element) {
      element.scrollLeft = selectedWeek * element.clientWidth;
    }
    // Only on mount; later selections page with an animation below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const element = pages.current;
    if (element) {
      element.scrollTo({ left: selectedWeek * element.clientWidth, behavior: 'smooth' });
    }
  }, [selectedWeek]);

  const onScroll = () => {
    const element = pages.current;
    if (element && element.clientWidth > 0) {
      setVisibleWeek(Math.round(element.scrollLeft / element.clientWidth));
    }
  };

  // The month of the visible week's Thursday, so a week spanning two months takes the month most of it lies in.
  const month = formatMonth(addDays(weeks[visibleWeek] ?? today, 3));

  return (
    <div className="week-strip">
      <div className="week-strip-month">{month}</div>
      <div className="week-strip-pages" ref={pages} onScroll={onScroll}>
        {weeks.map((week) => (
          <div className="week-strip-page" key={week.getTime()}>
            {Array.from({ length: 7 }, (_, offset) => {
              const day = addDays(week, offset);
              const classes = [
                'week-strip-day',
                isSameDay(day, selectedDay) && 'selected',
                isSameDay(day, today) && 'today',
                isWeekend(day) && 'weekend',
                eventDays.has(startOfDay(day).getTime()) && 'has-events',
              ];
              return (
                <button
                  type="button"
                  key={offset}
                  className={classes.filter(Boolean).join(' ')}
                  aria-label={formatFullDate(day)}
                  aria-pressed={isSameDay(day, selectedDay)}
                  onClick={() => onSelect(day)}
                >
                  <span className="week-strip-weekday">{formatWeekdayShort(day)}</span>
                  <span className="week-strip-number">{day.getDate()}</span>
                  <span className="week-strip-dot" />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
