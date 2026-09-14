import {
  accessibility,
  accessibilityOutline,
  alarm,
  alarmOutline,
  calendar,
  calendarOutline,
  download,
  downloadOutline,
  globe,
  globeOutline,
  handLeftOutline,
  lockClosed,
  lockClosedOutline,
  megaphoneOutline,
  notifications,
  notificationsOutline,
  people,
  peopleOutline,
  personCircle,
  personCircleOutline,
  personRemoveOutline,
  sparkles,
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
  /** The filled icon `matched` draws on a tile of `tileColor`, as `SettingsList.swift` does. Home rows have none. */
  filledIcon?: string;
  tileColor?: string;
}

/** iOS 26 system colours in the light appearance, for the tile colours of `SettingsList.swift`. */
export const systemColors = {
  gray: '#8e8e93',
  green: '#34c759',
  orange: '#ff8d28',
  red: '#ff383c',
  indigo: '#6155f5',
  blue: '#0088ff',
  teal: '#00c3d0',
  purple: '#cb30e0',
};

export const homeRows = {
  previousYears: { id: 'previous-years', title: 'Previous school years', icon: timeOutline },
  reportAbsence: { id: 'report-absence', title: 'Report absence', icon: personRemoveOutline },
  privacy: { id: 'privacy', title: 'Privacy preferences', icon: handLeftOutline },
  news: { id: 'news', title: 'Parro news', icon: megaphoneOutline },
} satisfies Record<string, PageRow>;

export const generalSettings: PageRow[] = [
  { id: 'account', title: 'Account', icon: personCircleOutline, filledIcon: personCircle, tileColor: systemColors.gray },
  { id: 'children', title: 'My children', icon: peopleOutline, filledIcon: people, tileColor: systemColors.green },
  {
    id: 'connect-calendar',
    title: 'Connect calendar',
    icon: calendarOutline,
    filledIcon: calendar,
    tileColor: systemColors.orange,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: notificationsOutline,
    filledIcon: notifications,
    tileColor: systemColors.red,
  },
  { id: 'reminders', title: 'Reminders', icon: alarmOutline, filledIcon: alarm, tileColor: systemColors.indigo },
  { id: 'pin-code', title: 'Pin code security', icon: lockClosedOutline, filledIcon: lockClosed, tileColor: systemColors.green },
  {
    id: 'accessibility',
    title: 'Accessibility',
    icon: accessibilityOutline,
    filledIcon: accessibility,
    tileColor: systemColors.blue,
  },
  { id: 'language', title: 'Language', value: 'English', icon: globeOutline, filledIcon: globe, tileColor: systemColors.teal },
];

export const aboutSettings: PageRow[] = [
  {
    id: 'whats-new',
    title: 'What’s new?',
    subtitle: 'View all our new features',
    icon: sparklesOutline,
    filledIcon: sparkles,
    tileColor: systemColors.purple,
  },
  {
    id: 'downloads',
    title: 'Download files',
    subtitle: 'Per school year and per group',
    icon: downloadOutline,
    filledIcon: download,
    tileColor: systemColors.blue,
  },
];
