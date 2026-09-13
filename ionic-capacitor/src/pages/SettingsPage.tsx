import { IonContent, IonIcon, IonItem, IonItemGroup, IonLabel, IonList, IonNote, IonPage } from '@ionic/react';
import { helpCircleOutline, openOutline } from 'ionicons/icons';
import { LargeTitle, TabHeader } from '../components/Headers';
import { aboutSettings, generalSettings, type PageRow } from './rows';

/** `IMG_0213.PNG`: the account and app settings, then what's new, downloads and support. */
export default function SettingsPage() {
  return (
    <IonPage>
      <TabHeader title="Settings" />
      <IonContent fullscreen>
        <LargeTitle title="Settings" />

        <IonList inset>
          <IonItemGroup>
            {generalSettings.map((row) => (
              <SettingsItem key={row.id} row={row} />
            ))}
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonItemGroup>
            {aboutSettings.map((row) => (
              <SettingsItem key={row.id} row={row} />
            ))}
            {/* Opens nothing in this shell (spec 001 §2.3). */}
            <IonItem button detail={false}>
              <IonIcon slot="start" icon={helpCircleOutline} aria-hidden="true" />
              <IonLabel>Parro support</IonLabel>
              <IonIcon slot="end" icon={openOutline} color="medium" aria-hidden="true" />
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
}

function SettingsItem({ row }: { row: PageRow }) {
  return (
    <IonItem routerLink={`/settings/${row.id}`}>
      <IonIcon slot="start" icon={row.icon} aria-hidden="true" />
      <IonLabel>
        {row.title}
        {row.subtitle && <p>{row.subtitle}</p>}
      </IonLabel>
      {row.value && <IonNote slot="end">{row.value}</IonNote>}
    </IonItem>
  );
}
