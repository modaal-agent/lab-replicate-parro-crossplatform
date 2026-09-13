import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import { calendarOutline } from 'ionicons/icons';
import { Fragment, useRef, useState } from 'react';
import { StackedTitle } from '../components/Headers';
import WeekStrip from '../components/WeekStrip';
import { events, subtitle, today } from '../fixtures/fixture';
import { agendaMonths, dayAnchor, weekStarts, type AgendaDay } from '../lib/agenda';
import { formatMonth, formatTimeRange, formatWeekdayShort, isSameDay, startOfDay, weekTitle } from '../lib/dates';
import './CalendarPage.css';

const months = agendaMonths(events, today);
const agendaDays = months.flatMap((month) => month.weeks.flatMap((week) => week.days));
const weeks = weekStarts(today, new Date(Math.max(...events.map((event) => event.start.getTime()))));
const eventDays = new Set(events.map((event) => startOfDay(event.start).getTime()));

/** `IMG_0211.PNG`: a week strip above an agenda grouped by month and week. */
export default function CalendarPage() {
  const content = useRef<HTMLIonContentElement>(null);
  const [selectedDay, setSelectedDay] = useState(today);

  /** Selects `day` in the week strip and scrolls the agenda to it, or to the next day it lists. */
  const select = async (day: Date) => {
    setSelectedDay(day);
    const target = agendaDays.find((agendaDay) => agendaDay.date >= startOfDay(day)) ?? agendaDays.at(-1);
    const row = target && document.getElementById(dayAnchor(target.date));
    const scroller = await content.current?.getScrollElement();
    if (!row || !scroller || !content.current) {
      return;
    }
    const top = row.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    const divider = row.closest('ion-item-group')?.querySelector('ion-item-divider');
    const headerHeight = parseFloat(getComputedStyle(content.current).getPropertyValue('--offset-top')) || 0;
    await content.current.scrollToPoint(0, top - headerHeight - (divider?.offsetHeight ?? 0), 300);
  };

  return (
    <IonPage>
      {/*
        The week strip is a second toolbar in the fixed header, so it stays on screen while the agenda
        scrolls to the selected day; a large title would scroll away with it.
      */}
      <IonHeader>
        <IonToolbar>
          <StackedTitle title="Calendar" subtitle={subtitle} />
          <IonButtons slot="end">
            <IonButton aria-label="Today" onClick={() => select(today)}>
              <IonIcon slot="icon-only" icon={calendarOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <WeekStrip weeks={weeks} selectedDay={selectedDay} today={today} eventDays={eventDays} onSelect={select} />
        </IonToolbar>
      </IonHeader>
      <IonContent ref={content}>
        <IonList>
          {months.map((month) => (
            <IonItemGroup key={month.start.getTime()}>
              <IonItemDivider sticky>
                <IonLabel>{formatMonth(month.start)}</IonLabel>
              </IonItemDivider>
              {month.weeks.map((week) => (
                <Fragment key={week.start.getTime()}>
                  <IonItem lines="none">
                    <IonNote>{weekTitle(week.start)}</IonNote>
                  </IonItem>
                  {week.days.map((day) => (
                    <DayItems key={day.date.getTime()} day={day} />
                  ))}
                </Fragment>
              ))}
            </IonItemGroup>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function DayItems({ day }: { day: AgendaDay }) {
  const isToday = isSameDay(day.date, today);
  if (day.events.length === 0) {
    return (
      <IonItem id={dayAnchor(day.date)}>
        <DayLabel date={day.date} isToday={isToday} />
        <IonLabel color="medium">No events today</IonLabel>
      </IonItem>
    );
  }
  return day.events.map((event, index) => (
    <IonItem key={event.id} id={index === 0 ? dayAnchor(day.date) : undefined} routerLink={`/calendar/${event.id}`}>
      <DayLabel date={day.date} isToday={isToday} hidden={index > 0} />
      <IonLabel className="ion-text-wrap">
        <h2>{event.title}</h2>
        <p>{event.isAllDay ? 'All day' : formatTimeRange(event.start, event.end)}</p>
      </IonLabel>
      <IonBadge slot="end" color="light" aria-label={`Teacher ${event.organizerInitials}`}>
        {event.organizerInitials}
      </IonBadge>
    </IonItem>
  ));
}

function DayLabel({ date, isToday, hidden = false }: { date: Date; isToday: boolean; hidden?: boolean }) {
  const classes = ['agenda-day', isToday && 'today', hidden && 'repeated'];
  return (
    <div slot="start" className={classes.filter(Boolean).join(' ')} aria-hidden={hidden ? 'true' : undefined}>
      <span className="agenda-day-weekday">{formatWeekdayShort(date)}</span>
      <span className="agenda-day-number">{date.getDate()}</span>
    </div>
  );
}
