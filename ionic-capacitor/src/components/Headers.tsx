import { IonButtons, IonHeader, IonNote, IonTitle, IonToolbar } from '@ionic/react';
import type { ReactNode } from 'react';
import { subtitle } from '../fixtures/fixture';
import './Headers.css';

/** A toolbar title with a second, smaller line below it: `ion-title` has no subtitle. */
export function StackedTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <IonTitle>
      <div className="stacked-title">{title}</div>
      <div className="stacked-subtitle">{subtitle}</div>
    </IonTitle>
  );
}

/** The fixed header of a tab's root page: the title, shown once the large title scrolls away, and the trailing buttons. */
export function TabHeader({ title, buttons }: { title: string; buttons?: ReactNode }) {
  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>{title}</IonTitle>
        {buttons && <IonButtons slot="end">{buttons}</IonButtons>}
      </IonToolbar>
    </IonHeader>
  );
}

/**
 * Ionic's iOS large title, as the tabs starter writes it, with the school and child below it
 * (spec 001 §1.2). `children` are further toolbars, which scroll away with the title.
 */
export function LargeTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <IonHeader collapse="condense">
      <IonToolbar>
        <IonTitle size="large">{title}</IonTitle>
      </IonToolbar>
      <IonToolbar>
        <IonNote className="ion-padding-horizontal">{subtitle}</IonNote>
      </IonToolbar>
      {children}
    </IonHeader>
  );
}
