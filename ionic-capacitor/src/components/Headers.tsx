import { IonButtons, IonHeader, IonNote, IonTitle, IonToolbar } from '@ionic/react';
import type { ReactNode } from 'react';
import { subtitle } from '../fixtures/fixture';
import { isMatched } from '../lib/variant';
import './Headers.css';

/**
 * A toolbar title with a second, smaller line below it: `ion-title` has no subtitle. `large` marks the title that
 * `matched` draws larger at the leading edge, as `.toolbarTitleDisplayMode(.inlineLarge)` in `native-swift/`.
 */
export function StackedTitle({ title, subtitle, large = false }: { title: string; subtitle: string; large?: boolean }) {
  return (
    <IonTitle className={large ? 'stacked-title-large' : undefined}>
      <div className="stacked-title">{title}</div>
      <div className="stacked-subtitle">{subtitle}</div>
    </IonTitle>
  );
}

/**
 * The fixed header of a tab's root page: the title, shown once the large title scrolls away, and the trailing buttons.
 * In `matched` the title keeps the subtitle, as `navigationSubtitle` does in `native-swift/`.
 */
export function TabHeader({ title, buttons }: { title: string; buttons?: ReactNode }) {
  return (
    <IonHeader>
      <IonToolbar>
        {isMatched ? <StackedTitle title={title} subtitle={subtitle} /> : <IonTitle>{title}</IonTitle>}
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
      <IonToolbar className="large-title-subtitle">
        <IonNote className="ion-padding-horizontal">{subtitle}</IonNote>
      </IonToolbar>
      {children}
    </IonHeader>
  );
}
