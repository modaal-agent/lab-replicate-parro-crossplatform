import { IonIcon, IonText } from '@ionic/react';
import './EmptyState.css';

/** An icon, a title and an optional line of text, centred in the page. */
export default function EmptyState({ icon, title, text }: { icon: string; title: string; text?: string }) {
  return (
    <div className="empty-state">
      <IonIcon icon={icon} color="medium" aria-hidden="true" />
      <h2>{title}</h2>
      {text && (
        <IonText color="medium">
          <p>{text}</p>
        </IonText>
      )}
    </div>
  );
}
