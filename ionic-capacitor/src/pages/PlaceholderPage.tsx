import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { calendarOutline, homeOutline, peopleOutline, settingsOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { events } from '../fixtures/fixture';
import { useShell } from '../model/ShellModel';
import { aboutSettings, generalSettings, homeRows } from './rows';

interface PlaceholderProps {
  title: string;
  icon: string;
  /** The back button's destination in a pushed page; the detail column has no back button (spec 001 §19). */
  backHref?: string;
}

/** The header and content of the page behind a row (spec 001 §2.3): the row's title and one line of placeholder text. */
export function Placeholder({ title, icon, backHref }: PlaceholderProps) {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          {backHref && (
            <IonButtons slot="start">
              <IonBackButton defaultHref={backHref} />
            </IonButtons>
          )}
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <EmptyState icon={icon} title={title} text="Placeholder content for this page." />
      </IonContent>
    </>
  );
}

export function GroupPlaceholder({ groupId, backHref }: { groupId?: string; backHref?: string }) {
  const group = useShell().groups.find((candidate) => candidate.id === groupId);
  return <Placeholder title={group?.name ?? 'Group'} icon={peopleOutline} backHref={backHref} />;
}

export function HomePlaceholder({ pageId, backHref }: { pageId?: string; backHref?: string }) {
  const row = Object.values(homeRows).find((candidate) => candidate.id === pageId);
  return <Placeholder title={row?.title ?? 'Home'} icon={row?.icon ?? homeOutline} backHref={backHref} />;
}

export function EventPlaceholder({ eventId, backHref }: { eventId?: string; backHref?: string }) {
  const event = events.find((candidate) => candidate.id === eventId);
  return <Placeholder title={event?.title ?? 'Event'} icon={calendarOutline} backHref={backHref} />;
}

export function SettingPlaceholder({ settingId, backHref }: { settingId?: string; backHref?: string }) {
  const row = [...generalSettings, ...aboutSettings].find((candidate) => candidate.id === settingId);
  return <Placeholder title={row?.title ?? 'Settings'} icon={row?.icon ?? settingsOutline} backHref={backHref} />;
}

export function GroupDetail() {
  const { groupId } = useParams();
  return (
    <IonPage>
      <GroupPlaceholder groupId={groupId} backHref="/home" />
    </IonPage>
  );
}

export function HomeDetail() {
  const { pageId } = useParams();
  return (
    <IonPage>
      <HomePlaceholder pageId={pageId} backHref="/home" />
    </IonPage>
  );
}

export function EventDetail() {
  const { eventId } = useParams();
  return (
    <IonPage>
      <EventPlaceholder eventId={eventId} backHref="/calendar" />
    </IonPage>
  );
}

export function SettingsDetail() {
  const { settingId } = useParams();
  return (
    <IonPage>
      <SettingPlaceholder settingId={settingId} backHref="/settings" />
    </IonPage>
  );
}
