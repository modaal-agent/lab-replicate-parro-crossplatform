import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { chatTemplates, groups as fixtureGroups, nowOnToday, type ChatThread, type SchoolGroup } from '../fixtures/fixture';

/**
 * The app's only mutable state: the unread counts "Mark all as read" clears, the chats "+" adds,
 * and the messages sent in them. Held in memory, so a relaunch starts from the fixture again
 * (spec 001 §10.2 O3, §12.3 D10). The same state as `native-swift/TabShell/Fixtures/ShellModel.swift`.
 */
interface ShellState {
  groups: SchoolGroup[];
  chats: ChatThread[];
  addedChatCount: number;
}

type ShellAction =
  | { type: 'markAllAsRead' }
  | { type: 'addChat' }
  | { type: 'markRead'; chatId: string }
  | { type: 'send'; chatId: string; text: string; date: Date };

export interface Shell extends ShellState {
  unreadCount: number;
  markAllAsRead: () => void;
  /** Adds the next of the three fixture chats, in turn, as a new row at the top. */
  addChat: () => void;
  markRead: (chatId: string) => void;
  /** Appends a message from the parent, dated now on the fixture's today and never before the last message. */
  send: (chatId: string, text: string) => void;
}

function reduce(state: ShellState, action: ShellAction): ShellState {
  switch (action.type) {
    case 'markAllAsRead':
      return { ...state, groups: state.groups.map((group) => ({ ...group, unreadCount: 0 })) };
    case 'addChat': {
      const template = chatTemplates[state.addedChatCount % chatTemplates.length];
      const id = `chat-${state.addedChatCount + 1}`;
      const chat: ChatThread = {
        ...template,
        id,
        messages: template.messages.map((message, index) => ({ ...message, id: `${id}-${index}` })),
      };
      return { ...state, chats: [chat, ...state.chats], addedChatCount: state.addedChatCount + 1 };
    }
    case 'markRead':
      if (!state.chats.some((chat) => chat.id === action.chatId && chat.isUnread)) {
        return state;
      }
      return {
        ...state,
        chats: state.chats.map((chat) => (chat.id === action.chatId ? { ...chat, isUnread: false } : chat)),
      };
    case 'send':
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.id !== action.chatId) {
            return chat;
          }
          const last = chat.messages.at(-1);
          const earliest = last ? last.date.getTime() + 60_000 : -Infinity;
          const message = {
            id: `${chat.id}-${chat.messages.length}`,
            date: new Date(Math.max(action.date.getTime(), earliest)),
            content: { type: 'text' as const, text: action.text },
          };
          return { ...chat, messages: [...chat.messages, message] };
        }),
      };
  }
}

const ShellContext = createContext<Shell | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, { groups: fixtureGroups, chats: [], addedChatCount: 0 });
  const actions = useMemo(
    () => ({
      markAllAsRead: () => dispatch({ type: 'markAllAsRead' }),
      addChat: () => dispatch({ type: 'addChat' }),
      markRead: (chatId: string) => dispatch({ type: 'markRead', chatId }),
      send: (chatId: string, text: string) => dispatch({ type: 'send', chatId, text, date: nowOnToday() }),
    }),
    [],
  );
  const shell = useMemo<Shell>(
    () => ({
      ...state,
      ...actions,
      unreadCount: state.groups.reduce((sum, group) => sum + group.unreadCount, 0),
    }),
    [state, actions],
  );
  return <ShellContext.Provider value={shell}>{children}</ShellContext.Provider>;
}

export function useShell(): Shell {
  const shell = useContext(ShellContext);
  if (!shell) {
    throw new Error('useShell needs a ShellProvider above it');
  }
  return shell;
}
