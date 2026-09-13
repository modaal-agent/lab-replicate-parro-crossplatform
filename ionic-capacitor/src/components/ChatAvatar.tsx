import { IonAvatar, IonIcon } from '@ionic/react';
import type { CSSProperties } from 'react';
import './ChatAvatar.css';

interface ChatAvatarProps {
  initials: string;
  icon?: string;
  color: string;
  size?: number;
  slot?: string;
  /** Read by assistive technology; without it the avatar is hidden from it. */
  label?: string;
}

/** A round avatar with an icon or initials, for chats and for the people in them. */
export default function ChatAvatar({ initials, icon, color, size = 40, slot, label }: ChatAvatarProps) {
  const style = { '--chat-avatar-color': color, width: size, height: size, fontSize: size * 0.38 } as CSSProperties;
  return (
    <IonAvatar
      slot={slot}
      className="chat-avatar"
      style={style}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      {icon ? <IonIcon icon={icon} /> : initials}
    </IonAvatar>
  );
}
