import { IonContent, IonIcon, IonItem, IonItemGroup, IonLabel, IonList, IonNote, IonPage } from '@ionic/react';
import { help, helpCircleOutline, openOutline } from 'ionicons/icons';
import type { CSSProperties } from 'react';
import { LargeTitle, TabHeader } from '../components/Headers';
import { rowSelection } from '../lib/layout';
import { isMatched } from '../lib/variant';
import { aboutSettings, generalSettings, type PageRow } from './rows';

/** `IMG_0213.PNG`: the account and app settings, then what's new, downloads and support. */
export default function SettingsPage() {
  return (
    <IonPage>
      <SettingsList />
    </IonPage>
  );
}

/**
 * The Settings screen's header and list, in a page or in the list column (spec 001 §19). `selectedPath` is the page
 * the detail column shows.
 */
export function SettingsList({ selectedPath }: { selectedPath?: string }) {
  return (
    <>
      <TabHeader title="Settings" />
      <IonContent fullscreen>
        <LargeTitle title="Settings" />

        <IonList inset>
          <IonItemGroup>
            {generalSettings.map((row) => (
              <SettingsItem key={row.id} row={row} selectedPath={selectedPath} />
            ))}
          </IonItemGroup>
        </IonList>

        <IonList inset>
          <IonItemGroup>
            {aboutSettings.map((row) => (
              <SettingsItem key={row.id} row={row} selectedPath={selectedPath} />
            ))}
            {/* Opens nothing in this shell (spec 001 §2.3). */}
            <IonItem button detail={false}>
              <SettingsIcon icon={helpCircleOutline} filledIcon={help} tileColor="var(--ion-color-primary)" />
              <IonLabel>Parro support</IonLabel>
              <IonIcon slot="end" icon={openOutline} color="medium" aria-hidden="true" />
            </IonItem>
          </IonItemGroup>
        </IonList>
      </IonContent>
    </>
  );
}

function SettingsItem({ row, selectedPath }: { row: PageRow; selectedPath?: string }) {
  const href = `/settings/${row.id}`;
  return (
    <IonItem routerLink={href} {...rowSelection(href, selectedPath)}>
      <SettingsIcon icon={row.icon} filledIcon={row.filledIcon} tileColor={row.tileColor} />
      <IonLabel>
        {row.title}
        {row.subtitle && <p>{row.subtitle}</p>}
      </IonLabel>
      {row.value && <IonNote slot="end">{row.value}</IonNote>}
    </IonItem>
  );
}

/** An outline icon in `stock`; in `matched`, a filled icon on a coloured tile, as `SettingsList.swift` draws it. */
function SettingsIcon({ icon, filledIcon, tileColor }: { icon: string; filledIcon?: string; tileColor?: string }) {
  if (isMatched && filledIcon) {
    const style = { '--tile-color': tileColor } as CSSProperties;
    return <IonIcon slot="start" className="settings-tile" icon={filledIcon} style={style} aria-hidden="true" />;
  }
  return <IonIcon slot="start" icon={icon} aria-hidden="true" />;
}
