import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface DraftStore {
  drafts: Map<string, string>;
  /** The layout the shell renders, `phone` or `columns`. */
  layout: { current: string };
}

const DraftContext = createContext<DraftStore | null>(null);

/**
 * Unsent text per chat. A conversation holds its draft in its own state; this store carries the draft over when the
 * window crosses 672 px, where the shell mounts the conversation again in the other layout (spec 001 §19).
 */
export function DraftProvider({ layout, children }: { layout: string; children: ReactNode }) {
  const store = useRef<DraftStore>({ drafts: new Map(), layout: { current: layout } }).current;
  // Layout effects run before the clean-up of the passive effects of a conversation the layout change unmounts.
  useLayoutEffect(() => {
    store.layout.current = layout;
  }, [store, layout]);
  return <DraftContext.Provider value={store}>{children}</DraftContext.Provider>;
}

/** The draft of `chatId`: kept when the layout changes, dropped when the conversation closes in the same layout. */
export function useDraft(chatId: string): [string, (text: string) => void] {
  const store = useContext(DraftContext);
  const [draft, setDraftState] = useState(() => store?.drafts.get(chatId) ?? '');

  useEffect(() => {
    if (!store) {
      return undefined;
    }
    const layout = store.layout.current;
    return () => {
      if (store.layout.current === layout) {
        store.drafts.delete(chatId);
      }
    };
  }, [store, chatId]);

  const setDraft = (text: string) => {
    setDraftState(text);
    store?.drafts.set(chatId, text);
  };
  return [draft, setDraft];
}
