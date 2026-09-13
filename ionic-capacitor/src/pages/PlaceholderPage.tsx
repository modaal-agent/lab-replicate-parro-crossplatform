import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { calendarOutline, homeOutline, peopleOutline, settingsOutline } from 'ionicons/icons';
import { useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { events } from '../fixtures/fixture';
import { useShell } from '../model/ShellModel';
import { aboutSettings, generalSettings, homeRows } from './rows';

/** The page behind a row (spec 001 §2.3): the row's title and one line of placeholder text. */
export default function PlaceholderPage({ title, icon, backHref }: { title: string; icon: string; backHref: string }) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={backHref} />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <EmptyState icon={icon} title={title} text="Placeholder content for this page." />
      </IonContent>
    </IonPage>
  );
}

export function GroupDetail() {
  const { groupId } = useParams();
  const group = useShell().groups.find((candidate) => candidate.id === groupId);
  return <PlaceholderPage title={group?.name ?? 'Group'} icon={peopleOutline} backHref="/home" />;
}

export function HomeDetail() {
  const { pageId } = useParams();
  const row = Object.values(homeRows).find((candidate) => candidate.id === pageId);
  return <PlaceholderPage title={row?.title ?? 'Home'} icon={row?.icon ?? homeOutline} backHref="/home" />;
}

export function EventDetail() {
  const { eventId } = useParams();
  const event = events.find((candidate) => candidate.id === eventId);
  return <PlaceholderPage title={event?.title ?? 'Event'} icon={calendarOutline} backHref="/calendar" />;
}

export function SettingsDetail() {
  const { settingId } = useParams();
  const row = [...generalSettings, ...aboutSettings].find((candidate) => candidate.id === settingId);
  return <PlaceholderPage title={row?.title ?? 'Settings'} icon={row?.icon ?? settingsOutline} backHref="/settings" />;
}
