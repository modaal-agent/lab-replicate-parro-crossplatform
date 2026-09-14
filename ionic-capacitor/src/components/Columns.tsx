import { IonContent, IonPage } from '@ionic/react';
import type { ReactNode } from 'react';
import EmptyState from './EmptyState';
import './Columns.css';

/**
 * A tab's list beside the page of its selected row, on a window at least 672 px wide (spec 001 §4.3, §19). Each column
 * is an element with the `ion-page` class, in which a header, content and footer lay out as they do in a page. The
 * columns are not `IonPage`s, because an `IonPage` registers itself with the router outlet.
 */
export default function Columns({ list, detail }: { list: ReactNode; detail: ReactNode }) {
  return (
    <IonPage className="columns">
      <div className="ion-page columns-list">{list}</div>
      <div className="ion-page columns-detail">{detail}</div>
    </IonPage>
  );
}

/** The detail column while no row is selected, as the `ContentUnavailableView`s of `native-swift/`. */
export function NoSelection({ icon, title }: { icon: string; title: string }) {
  return (
    <IonContent>
      <EmptyState icon={icon} title={title} />
    </IonContent>
  );
}
