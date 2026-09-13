import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendarOutline, chatbubbleOutline, homeOutline, settingsOutline } from 'ionicons/icons';
import { ShellProvider, useShell } from './model/ShellModel';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import ConversationPage from './pages/ConversationPage';
import HomePage from './pages/HomePage';
import { EventDetail, GroupDetail, HomeDetail, SettingsDetail } from './pages/PlaceholderPage';
import SettingsPage from './pages/SettingsPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* The styling variant's CSS and Ionic options, through the `@style` alias in vite.config.ts (spec 001 §13.4, D13) */
import '@style/index.css';
import { ionicConfig } from '@style/setup';

setupIonicReact(ionicConfig);

const App: React.FC = () => (
  <IonApp>
    <ShellProvider>
      <IonReactRouter>
        <Tabs />
      </IonReactRouter>
    </ShellProvider>
  </IonApp>
);

/** The four tabs, each with its list and the pages behind its rows (spec 001 §4.3, §12). */
function Tabs() {
  const { unreadCount } = useShell();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/groups/:groupId" element={<GroupDetail />} />
        <Route path="/home/:pageId" element={<HomeDetail />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/:eventId" element={<EventDetail />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatId" element={<ConversationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/:settingId" element={<SettingsDetail />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon aria-hidden="true" icon={homeOutline} />
          <IonLabel>Home</IonLabel>
          {unreadCount > 0 && <IonBadge>{unreadCount}</IonBadge>}
        </IonTabButton>
        <IonTabButton tab="calendar" href="/calendar">
          <IonIcon aria-hidden="true" icon={calendarOutline} />
          <IonLabel>Calendar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chat" href="/chat">
          <IonIcon aria-hidden="true" icon={chatbubbleOutline} />
          <IonLabel>Chat</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/settings">
          <IonIcon aria-hidden="true" icon={settingsOutline} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default App;
