import { IonBadge, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { shellTabs, tabOf, type TabPaths } from '../lib/tabs';
import { useShell } from '../model/ShellModel';

/**
 * The four tabs as a menu, which the split pane shows as a column from 992 px wide in place of the tab bar
 * (spec 001 §19). Each item opens the page its tab showed last.
 */
export default function TabMenu({ contentId, paths }: { contentId: string; paths: TabPaths }) {
  const { unreadCount } = useShell();
  const currentTab = tabOf(useLocation().pathname);

  return (
    // Below 992 px nothing opens the menu; without the swipe gesture an edge swipe goes to swipe back only.
    <IonMenu contentId={contentId} swipeGesture={false}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>TabShell</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {shellTabs.map((tab) => {
            const selected = tab.id === currentTab;
            return (
              <IonItem
                key={tab.id}
                className={selected ? 'selected' : undefined}
                aria-current={selected ? 'page' : undefined}
                routerLink={paths[tab.id]}
                routerDirection="none"
                detail={false}
                lines="none"
              >
                <IonIcon slot="start" icon={tab.icon} aria-hidden="true" />
                <IonLabel>{tab.title}</IonLabel>
                {tab.id === 'home' && unreadCount > 0 && <IonBadge slot="end">{unreadCount}</IonBadge>}
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
}
