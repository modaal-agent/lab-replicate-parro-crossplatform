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
import { rowSelection } from '../lib/layout';
import { useShell } from '../model/ShellModel';
import { homeRows, type PageRow } from './rows';

/** `IMG_0210.PNG`: the groups of this school year, the actions, and the news row. */
export default function HomePage() {
  return (
    <IonPage>
      <HomeList />
    </IonPage>
  );
}

/**
 * The Home screen's header and list, in a page or in the list column (spec 001 §19). `selectedPath` is the page the
 * detail column shows.
 */
export function HomeList({ selectedPath }: { selectedPath?: string }) {
  const { groups, unreadCount, markAllAsRead } = useShell();

  return (
    <>
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
            {groups.map((group) => {
              const href = `/home/groups/${group.id}`;
              return (
                <IonItem key={group.id} routerLink={href} {...rowSelection(href, selectedPath)}>
                  <IonIcon slot="start" className="group-dot" icon={ellipse} style={{ color: group.color }} aria-hidden="true" />
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
              );
            })}
            <PageItem row={homeRows.previousYears} selectedPath={selectedPath} />
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonItemGroup>
            <PageItem row={homeRows.reportAbsence} selectedPath={selectedPath} />
            <PageItem row={homeRows.privacy} selectedPath={selectedPath} />
            <IonItem
              className="action-item"
              button
              detail={false}
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
            >
              <IonIcon slot="start" icon={checkmarkCircleOutline} aria-hidden="true" />
              <IonLabel>Mark all as read</IonLabel>
            </IonItem>
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonItemGroup>
            <PageItem row={homeRows.news} selectedPath={selectedPath} />
          </IonItemGroup>
        </IonList>
      </IonContent>
    </>
  );
}

function PageItem({ row, selectedPath }: { row: PageRow; selectedPath?: string }) {
  const href = `/home/${row.id}`;
  return (
    <IonItem routerLink={href} {...rowSelection(href, selectedPath)}>
      <IonIcon slot="start" icon={row.icon} aria-hidden="true" />
      <IonLabel>{row.title}</IonLabel>
    </IonItem>
  );
}
