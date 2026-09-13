import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonPage,
  IonTextarea,
  IonToolbar,
} from '@ionic/react';
import { add, arrowUpCircle, chatbubbleOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatAvatar from '../components/ChatAvatar';
import EmptyState from '../components/EmptyState';
import { StackedTitle } from '../components/Headers';
import SunflowerDrawing from '../components/SunflowerDrawing';
import { today, type ChatMessage } from '../fixtures/fixture';
import { dayName, formatTime } from '../lib/dates';
import { messageRows, type MessageRow } from '../lib/messageRows';
import { useShell } from '../model/ShellModel';
import './ConversationPage.css';

/** A conversation (spec 001 §12.1): the chat's messages in bubbles above a composer. */
export default function ConversationPage() {
  const { chatId = '' } = useParams();
  const { chats, markRead, send } = useShell();
  const chat = chats.find((candidate) => candidate.id === chatId);
  const [draft, setDraft] = useState('');
  const content = useRef<HTMLIonContentElement>(null);
  const messageCount = chat?.messages.length ?? 0;
  const shownCount = useRef(0);

  // Opening a chat marks it read (spec 001 §12.3 D11).
  useEffect(() => {
    markRead(chatId);
  }, [chatId, markRead]);

  // Opens at the last message, and scrolls to each message sent.
  useEffect(() => {
    content.current?.scrollToBottom(shownCount.current === 0 ? 0 : 300);
    shownCount.current = messageCount;
  }, [messageCount]);

  if (!chat) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/chat" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <EmptyState icon={chatbubbleOutline} title="No chat" text="This chat is not in the list." />
        </IonContent>
      </IonPage>
    );
  }

  const canSend = draft.trim().length > 0;
  const submit = () => {
    const text = draft.trim();
    if (text) {
      send(chat.id, text);
      setDraft('');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/chat" />
          </IonButtons>
          <StackedTitle title={chat.title} subtitle={chat.subtitle} />
          {/*
            `ios-theme-disabled` is the theme's opt-out: it keeps the glass capsule from the avatar, which
            `ChatDetail.swift` draws without one (`sharedBackgroundVisibility(.hidden)`). `stock` has no rule for it.
          */}
          <IonButtons slot="end" className="ios-theme-disabled">
            <ChatAvatar initials={chat.initials} icon={chat.icon} color={chat.color} size={32} label={chat.title} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={content}>
        <div className="message-list">
          {messageRows(chat.messages).map((row) => (
            <MessageRowView key={row.message.id} row={row} showsSenders={chat.kind === 'group'} />
          ))}
        </div>
      </IonContent>

      <IonFooter className="composer">
        <IonToolbar>
          <IonButtons slot="start">
            {/* Opens nothing in this shell (spec 001 §12.1). */}
            <IonButton aria-label="Add attachment">
              <IonIcon slot="icon-only" icon={add} />
            </IonButton>
          </IonButtons>
          <IonTextarea
            className="composer-field"
            aria-label="Message"
            placeholder="Message"
            rows={1}
            autoGrow
            value={draft}
            onIonInput={(event) => setDraft(event.detail.value ?? '')}
          />
          {canSend && (
            <IonButtons slot="end" className="composer-send">
              <IonButton aria-label="Send" onClick={submit}>
                <IonIcon slot="icon-only" icon={arrowUpCircle} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

function MessageRowView({ row, showsSenders }: { row: MessageRow; showsSenders: boolean }) {
  const { message } = row;
  const sender = message.sender;
  const direction = sender ? 'incoming' : 'outgoing';

  return (
    <div className={row.startsRun && !row.showsDate ? 'message-row starts-run' : 'message-row'}>
      {row.showsDate && (
        <p className="message-date">
          <strong>{dayName(message.date, today)}</strong> {formatTime(message.date)}
        </p>
      )}
      {showsSenders && row.startsRun && sender && <p className="message-sender">{sender.name}</p>}
      <div className={`message-line ${direction}`}>
        {showsSenders &&
          sender &&
          (row.endsRun ? (
            <ChatAvatar initials={sender.initials} color={sender.color} size={28} />
          ) : (
            <span className="message-avatar-space" />
          ))}
        <MessageBubble message={message} direction={direction} tail={row.endsRun} />
      </div>
      {row.receipt && <p className="message-receipt">{row.receipt}</p>}
    </div>
  );
}

/** `tail` marks the last bubble of a run; `matched` draws a tail on it, `stock` has no rule for the class. */
function MessageBubble({ message, direction, tail }: { message: ChatMessage; direction: string; tail: boolean }) {
  const bubbleClass = `message-bubble ${direction}${tail ? ' tail' : ''}`;
  if (message.content.type === 'photo') {
    return (
      <div className={`message-photo ${direction}`}>
        <SunflowerDrawing />
        <div className={bubbleClass}>{message.content.caption}</div>
      </div>
    );
  }
  return <div className={bubbleClass}>{message.content.text}</div>;
}
