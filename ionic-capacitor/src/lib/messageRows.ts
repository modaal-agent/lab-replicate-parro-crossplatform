import type { ChatMessage } from '../fixtures/fixture';

/** A date line goes above a message sent more than this long after the one before it. */
const dateGap = 60 * 60 * 1000;

/** One message and what the conversation draws around it (spec 001 §12.1). */
export interface MessageRow {
  message: ChatMessage;
  showsDate: boolean;
  /** The first message of a run from one sender: extra space above, and the sender's name in a group. */
  startsRun: boolean;
  /** The last message of a run: in a group, the sender's avatar beside it. */
  endsRun: boolean;
  /** "Read" or "Delivered", under the parent's last message. */
  receipt?: 'Read' | 'Delivered';
}

export function messageRows(messages: ChatMessage[]): MessageRow[] {
  const lastOutgoing = messages.findLastIndex((message) => !message.sender);
  return messages.map((message, index) => {
    const previous = messages[index - 1];
    const next = messages[index + 1];
    const showsDate = !previous || message.date.getTime() - previous.date.getTime() > dateGap;
    const nextShowsDate = !next || next.date.getTime() - message.date.getTime() > dateGap;
    const row: MessageRow = {
      message,
      showsDate,
      startsRun: showsDate || previous.sender !== message.sender,
      endsRun: nextShowsDate || next.sender !== message.sender,
    };
    if (index === lastOutgoing) {
      row.receipt = messages.slice(index + 1).some((later) => later.sender) ? 'Read' : 'Delivered';
    }
    return row;
  });
}
