import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonToolbar,
} from '@ionic/react';
import {
  add,
  chatbubblesOutline,
  ellipse,
  happyOutline,
  mailUnreadOutline,
  peopleOutline,
  personOutline,
  searchOutline,
} from 'ionicons/icons';
import { useState } from 'react';
import ChatAvatar from '../components/ChatAvatar';
import EmptyState from '../components/EmptyState';
import { LargeTitle, StackedTitle, TabHeader } from '../components/Headers';
import { chatPreview, subtitle, today, type ChatThread } from '../fixtures/fixture';
import { listTimestamp } from '../lib/dates';
import { isMatched } from '../lib/variant';
import { useShell } from '../model/ShellModel';
import './ChatPage.css';

interface ChatFilter {
  id: string;
  title: string;
  icon: string;
  includes: (chat: ChatThread) => boolean;
}

const filters: ChatFilter[] = [
  { id: 'unread', title: 'Unread', icon: mailUnreadOutline, includes: (chat) => chat.isUnread },
  { id: 'child', title: 'Child chat', icon: happyOutline, includes: (chat) => chat.kind === 'child' },
  { id: 'group', title: 'Group chat', icon: peopleOutline, includes: (chat) => chat.kind === 'group' },
  { id: 'direct', title: 'Private chat', icon: personOutline, includes: (chat) => chat.kind === 'direct' },
];

/** `IMG_0212.PNG`: filter chips, the chat list or its empty state, and "+" to add a chat. */
export default function ChatPage() {
  const { chats, addChat } = useShell();
  const [filterId, setFilterId] = useState<string>();
  const filter = filters.find((candidate) => candidate.id === filterId);
  const visibleChats = filter ? chats.filter(filter.includes) : chats;

  let body;
  if (chats.length === 0) {
    body = (
      <EmptyState
        icon={chatbubblesOutline}
        title="Your chats will appear here"
        text="When a teacher sends you a message, you will find it here."
      />
    );
  } else if (filter && visibleChats.length === 0) {
    body = (
      <EmptyState
        icon={filter.icon}
        title={`No ${filter.title.toLowerCase()}s`}
        text="Chats that match this filter will appear here."
      />
    );
  } else {
    body = (
      <IonList>
        {visibleChats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </IonList>
    );
  }

  const searchButton = (
    <IonButton aria-label="Search">
      <IonIcon slot="icon-only" icon={searchOutline} />
    </IonButton>
  );

  const chips = (
    <div className="chip-row">
      {filters.map((candidate) => (
        <IonChip
          key={candidate.id}
          role="button"
          color="primary"
          outline={candidate.id !== filterId}
          aria-pressed={candidate.id === filterId}
          onClick={() => setFilterId(candidate.id === filterId ? undefined : candidate.id)}
        >
          <IonLabel>{candidate.title}</IonLabel>
        </IonChip>
      ))}
    </div>
  );

  if (isMatched) {
    // `ChatList.swift` keeps the title and the chips on screen while the list scrolls (`.inlineLarge`, `safeAreaBar`).
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <StackedTitle title="Chat" subtitle={subtitle} large />
            <IonButtons slot="end">{searchButton}</IonButtons>
          </IonToolbar>
          <IonToolbar className="chip-toolbar">{chips}</IonToolbar>
        </IonHeader>
        <IonContent>
          {body}
          <AddChatButton onClick={addChat} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <TabHeader title="Chat" buttons={searchButton} />
      <IonContent fullscreen>
        <LargeTitle title="Chat">
          <IonToolbar>{chips}</IonToolbar>
        </LargeTitle>

        {body}

        <AddChatButton onClick={addChat} />
      </IonContent>
    </IonPage>
  );
}

function AddChatButton({ onClick }: { onClick: () => void }) {
  return (
    <IonFab slot="fixed" vertical="bottom" horizontal="end">
      <IonFabButton aria-label="New chat" onClick={onClick}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
  );
}

function ChatItem({ chat }: { chat: ChatThread }) {
  const last = chat.messages.at(-1);
  return (
    // `matched` shows the chevron `ChatList.swift`'s `NavigationLink` draws.
    <IonItem className="chat-item" routerLink={`/chat/${chat.id}`} detail={isMatched}>
      <ChatAvatar slot="start" initials={chat.initials} icon={chat.icon} color={chat.color} />
      <IonLabel className="ion-text-wrap">
        <h2>{chat.title}</h2>
        <p>{chatPreview(chat)}</p>
      </IonLabel>
      {last && (
        <IonNote slot="end" className="chat-time" color={chat.isUnread ? 'primary' : undefined}>
          {listTimestamp(last.date, today)}
        </IonNote>
      )}
      {chat.isUnread && (
        <IonIcon slot="end" className="chat-unread" icon={ellipse} color="primary" size="small" aria-label="Unread" />
      )}
    </IonItem>
  );
}
