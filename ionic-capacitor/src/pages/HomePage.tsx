import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
} from '@ionic/react';
import { checkmarkCircleOutline, ellipse, searchOutline } from 'ionicons/icons';
import { LargeTitle, TabHeader } from '../components/Headers';
import { schoolYear } from '../fixtures/fixture';
import { useShell } from '../model/ShellModel';
import { homeRows, type PageRow } from './rows';

/** `IMG_0210.PNG`: the groups of this school year, the actions, and the news row. */
export default function HomePage() {
  const { groups, unreadCount, markAllAsRead } = useShell();

  return (
    <IonPage>
      <TabHeader
        title="Home"
        buttons={
          <IonButton aria-label="Search">
            <IonIcon slot="icon-only" icon={searchOutline} />
          </IonButton>
        }
      />
      <IonContent fullscreen>
        <LargeTitle title="Home" />

        <IonListHeader>
          <IonLabel>
            <h2>Groups</h2>
            <p>{schoolYear}</p>
          </IonLabel>
        </IonListHeader>
        <IonList inset>
          <IonItemGroup>
            {groups.map((group) => (
              <IonItem key={group.id} routerLink={`/home/groups/${group.id}`}>
                <IonIcon slot="start" icon={ellipse} style={{ color: group.color }} aria-hidden="true" />
                <IonLabel>{group.name}</IonLabel>
                {group.unreadCount > 0 && (
                  <IonBadge slot="end" aria-label={`${group.unreadCount} unread`}>
                    {group.unreadCount}
                  </IonBadge>
                )}
                {group.teacherInitials && (
                  <IonBadge slot="end" color="light" aria-label={`Teacher ${group.teacherInitials}`}>
                    {group.teacherInitials}
                  </IonBadge>
                )}
              </IonItem>
            ))}
            <PageItem row={homeRows.previousYears} />
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonItemGroup>
            <PageItem row={homeRows.reportAbsence} />
            <PageItem row={homeRows.privacy} />
            <IonItem button detail={false} disabled={unreadCount === 0} onClick={markAllAsRead}>
              <IonIcon slot="start" icon={checkmarkCircleOutline} aria-hidden="true" />
              <IonLabel>Mark all as read</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonItemGroup>
            <PageItem row={homeRows.news} />
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function PageItem({ row }: { row: PageRow }) {
  return (
    <IonItem routerLink={`/home/${row.id}`}>
      <IonIcon slot="start" icon={row.icon} aria-hidden="true" />
      <IonLabel>{row.title}</IonLabel>
    </IonItem>
  );
}
