import {
  accessibilityOutline,
  alarmOutline,
  calendarOutline,
  downloadOutline,
  globeOutline,
  handLeftOutline,
  lockClosedOutline,
  megaphoneOutline,
  notificationsOutline,
  peopleOutline,
  personCircleOutline,
  personRemoveOutline,
  sparklesOutline,
  timeOutline,
} from 'ionicons/icons';

/** A list row that opens a placeholder page (spec 001 §2.3). */
export interface PageRow {
  id: string;
  title: string;
  subtitle?: string;
  /** Shown on the trailing side of the row. */
  value?: string;
  icon: string;
}

export const homeRows = {
  previousYears: { id: 'previous-years', title: 'Previous school years', icon: timeOutline },
  reportAbsence: { id: 'report-absence', title: 'Report absence', icon: personRemoveOutline },
  privacy: { id: 'privacy', title: 'Privacy preferences', icon: handLeftOutline },
  news: { id: 'news', title: 'Parro news', icon: megaphoneOutline },
} satisfies Record<string, PageRow>;

export const generalSettings: PageRow[] = [
  { id: 'account', title: 'Account', icon: personCircleOutline },
  { id: 'children', title: 'My children', icon: peopleOutline },
  { id: 'connect-calendar', title: 'Connect calendar', icon: calendarOutline },
  { id: 'notifications', title: 'Notifications', icon: notificationsOutline },
  { id: 'reminders', title: 'Reminders', icon: alarmOutline },
  { id: 'pin-code', title: 'Pin code security', icon: lockClosedOutline },
  { id: 'accessibility', title: 'Accessibility', icon: accessibilityOutline },
  { id: 'language', title: 'Language', value: 'English', icon: globeOutline },
];

export const aboutSettings: PageRow[] = [
  { id: 'whats-new', title: 'What’s new?', subtitle: 'View all our new features', icon: sparklesOutline },
  { id: 'downloads', title: 'Download files', subtitle: 'Per school year and per group', icon: downloadOutline },
];
