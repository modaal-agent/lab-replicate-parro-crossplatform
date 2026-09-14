import { people } from 'ionicons/icons';

/**
 * The placeholder content of every screen (spec 001 §2.2, §12.2): the same content as
 * `native-swift/TabShell/Fixtures/Fixture.swift`. All names are invented, per AGENTS.md
 * §"Two builds of one shell"; the structure follows `_assets/IMG_0210.PNG` … `IMG_0213.PNG`.
 */

export interface SchoolGroup {
  id: string;
  name: string;
  color: string;
  unreadCount: number;
  teacherInitials?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  organizerInitials: string;
}

export type ChatKind = 'child' | 'group' | 'direct';

/** Someone in a chat other than the parent using the app. */
export interface ChatParticipant {
  name: string;
  initials: string;
  color: string;
}

export type MessageContent =
  | { type: 'text'; text: string }
  /** A photo, drawn in code, with a caption below it. */
  | { type: 'photo'; caption: string };

export interface ChatMessage {
  id: string;
  /** Absent for a message the parent using the app sent. */
  sender?: ChatParticipant;
  date: Date;
  content: MessageContent;
}

export interface ChatThread {
  id: string;
  title: string;
  subtitle: string;
  kind: ChatKind;
  initials: string;
  /** An ionicon shown in the avatar in place of the initials. */
  icon?: string;
  color: string;
  isUnread: boolean;
  messages: ChatMessage[];
}

/** A chat as "+" adds it, before it gets its id and its messages get theirs. */
export type ChatTemplate = Omit<ChatThread, 'id' | 'messages'> & {
  messages: Omit<ChatMessage, 'id'>[];
};

/** Months count from 1, as in the Swift fixture. Dates are in the device's time zone. */
export function date(year: number, month: number, day: number, hour = 0, minute = 0): Date {
  return new Date(year, month - 1, day, hour, minute);
}

/** Approximations of SwiftUI's `.orange`, `.indigo`, `.mint` and `.teal` in light appearance. */
const systemColors = {
  orange: '#ff8d28',
  indigo: '#6155f5',
  mint: '#00c8b3',
  teal: '#00c3d0',
};

export const schoolName = 'Brightwater Montessori';
export const childName = 'Sam';
export const subtitle = `${schoolName} • ${childName}`;
export const schoolYear = 'School year 2026/2027';

/** The calendar's today: the day the reference screenshots were taken. */
export const today = date(2026, 9, 13);

export const groups: SchoolGroup[] = [
  { id: 'school', name: schoolName, color: '#e8436e', unreadCount: 0 },
  { id: 'group-678b', name: 'Group 6/7/8 B', color: '#c89409', unreadCount: 1, teacherInitials: 'JV' },
];

export const events: CalendarEvent[] = [
  event('charity-market', 'Charity market', date(2026, 9, 16, 13, 30), date(2026, 9, 16, 16, 0), 'JV'),
  event(
    'book-week',
    'Book week opening assembly in the main hall',
    date(2026, 9, 28, 9, 15),
    date(2026, 9, 28, 9, 40),
    'JV',
  ),
  {
    id: 'purple-friday',
    title: 'Purple Friday',
    start: date(2026, 10, 9),
    end: date(2026, 10, 10),
    isAllDay: true,
    organizerInitials: 'JV',
  },
  event('parent-evening', 'Parent–teacher evening', date(2026, 10, 22, 19, 0), date(2026, 10, 22, 20, 30), 'AB'),
];

export const teacher: ChatParticipant = { name: 'Jamie Visser', initials: 'JV', color: systemColors.indigo };
export const otherParent: ChatParticipant = { name: 'Priya Shah', initials: 'PS', color: systemColors.mint };

/** The three chats "+" adds in turn (spec 001 §10.2 O3), with their messages (§12.2). */
export const chatTemplates: ChatTemplate[] = [
  {
    title: 'Group 6/7/8 B',
    subtitle: '24 members',
    kind: 'group',
    initials: '6B',
    icon: people,
    color: systemColors.orange,
    isUnread: true,
    messages: [
      text(
        teacher,
        date(2026, 9, 11, 15, 2),
        'Good afternoon! The charity market is next Wednesday from 13:30 in the main hall.',
      ),
      text(
        teacher,
        date(2026, 9, 11, 15, 3),
        'The children are making bookmarks and cards to sell. Bring some small change if you can.',
      ),
      text(otherParent, date(2026, 9, 11, 15, 20), 'Lovely! Do you need help setting up the stalls?'),
      text(teacher, date(2026, 9, 11, 15, 26), 'Yes please, setup starts at 12:45.'),
      text(undefined, date(2026, 9, 11, 15, 31), 'I can help from 13:00.'),
      text(teacher, date(2026, 9, 13, 9, 41), 'Please pack gym clothes for tomorrow’s PE lesson.'),
    ],
  },
  {
    title: 'Jamie Visser',
    subtitle: 'Teacher, Group 6/7/8 B',
    kind: 'direct',
    initials: 'JV',
    color: systemColors.indigo,
    isUnread: false,
    messages: [
      text(undefined, date(2026, 9, 12, 15, 48), 'Hi Jamie, Sam has a dentist appointment on Monday morning.'),
      text(undefined, date(2026, 9, 12, 15, 48), 'We’ll drop Sam off at school around 10:30. Is that okay?'),
      text(teacher, date(2026, 9, 12, 16, 20), 'Thanks for letting me know. See you on Monday!'),
    ],
  },
  {
    title: 'Sam',
    subtitle: 'Jamie Visser',
    kind: 'child',
    initials: 'S',
    color: systemColors.teal,
    isUnread: true,
    messages: [
      text(teacher, date(2026, 9, 11, 13, 58), 'Art class today was all about our school garden.'),
      {
        sender: teacher,
        date: date(2026, 9, 11, 14, 5),
        content: { type: 'photo', caption: 'Sam’s drawing of the sunflowers' },
      },
    ],
  },
];

/** The list row's preview: the last message, with its sender's name in a group chat. */
export function chatPreview(chat: ChatThread): string {
  const message = chat.messages.at(-1);
  if (!message) {
    return '';
  }
  const body = message.content.type === 'text' ? message.content.text : `Photo: ${message.content.caption}`;
  if (!message.sender) {
    return `You: ${body}`;
  }
  if (chat.kind === 'group') {
    return `${message.sender.name}: ${body}`;
  }
  return body;
}

/** The current time of day on the fixture's today, for a message sent from the composer. */
export function nowOnToday(): Date {
  const now = new Date();
  const result = new Date(today);
  result.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
  return result;
}

function event(id: string, title: string, start: Date, end: Date, organizerInitials: string): CalendarEvent {
  return { id, title, start, end, isAllDay: false, organizerInitials };
}

function text(sender: ChatParticipant | undefined, date: Date, text: string): Omit<ChatMessage, 'id'> {
  return { sender, date, content: { type: 'text', text } };
}
