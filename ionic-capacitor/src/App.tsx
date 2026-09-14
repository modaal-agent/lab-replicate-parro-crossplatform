import { matchPath, Navigate, Route, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonBadge,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import TabMenu from './components/TabMenu';
import { menuWhen, useColumns, watchWindowed } from './lib/layout';
import { shellTabs, useTabPaths } from './lib/tabs';
import { DraftProvider } from './model/Drafts';
import { ShellProvider, useShell } from './model/ShellModel';
import CalendarPage from './pages/CalendarPage';
import ChatPage from './pages/ChatPage';
import ConversationPage from './pages/ConversationPage';
import HomePage from './pages/HomePage';
import { EventDetail, GroupDetail, HomeDetail, SettingsDetail } from './pages/PlaceholderPage';
import SettingsPage from './pages/SettingsPage';
import { CalendarColumns, ChatColumns, HomeColumns, SettingsColumns } from './pages/TabColumns';

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
import { attachTabBarEffect, ionicConfig } from '@style/setup';
import { useEffect } from 'react';

setupIonicReact(ionicConfig);

const App: React.FC = () => (
  <IonApp>
    <ShellProvider>
      <IonReactRouter>
        <Shell />
      </IonReactRouter>
    </ShellProvider>
  </IonApp>
);

/** Below 672 px: each list, and the pages behind its rows pushed over it (spec 001 §4.3, §12). */
const phoneRoutes = [
  <Route key="home" path="/home" element={<HomePage />} />,
  <Route key="group" path="/home/groups/:groupId" element={<GroupDetail />} />,
  <Route key="home-page" path="/home/:pageId" element={<HomeDetail />} />,
  <Route key="calendar" path="/calendar" element={<CalendarPage />} />,
  <Route key="event" path="/calendar/:eventId" element={<EventDetail />} />,
  <Route key="chat" path="/chat" element={<ChatPage />} />,
  <Route key="conversation" path="/chat/:chatId" element={<ConversationPage />} />,
  <Route key="settings" path="/settings" element={<SettingsPage />} />,
  <Route key="setting" path="/settings/:settingId" element={<SettingsDetail />} />,
];

/** From 672 px: one route per tab, which shows the list beside the page of the selected row (spec 001 §19). */
const columnRoutes = [
  <Route key="home" path="/home/*" element={<HomeColumns />} />,
  <Route key="calendar" path="/calendar/*" element={<CalendarColumns />} />,
  <Route key="chat" path="/chat/*" element={<ChatColumns />} />,
  <Route key="settings" path="/settings/*" element={<SettingsColumns />} />,
];

/**
 * The tabs, and the menu that lists them from 992 px (spec 001 §4.3, §19). The split pane is mounted at every width,
 * so the tab bar keeps the page each tab showed last when the window is resized.
 */
function Shell() {
  const columns = useColumns();
  const tabPaths = useTabPaths();
  useEffect(watchWindowed, []);

  return (
    <DraftProvider layout={columns ? 'columns' : 'phone'}>
      {/*
        `ios-theme-disabled` is the theme's opt-out: `matched`'s theme lays the menu over the page and pads the page by
        the menu's width, which covers the list column. `stock` has no rule for it.
      */}
      <IonSplitPane contentId="tabs" when={menuWhen} className="ios-theme-disabled">
        <TabMenu contentId="tabs" paths={tabPaths} />
        {/* The split pane's main element; `core.css` positions an `.ion-page` main beside the menu. */}
        <div id="tabs" className="ion-page">
          <Tabs columns={columns} />
        </div>
      </IonSplitPane>
    </DraftProvider>
  );
}

/** The four tabs, each with its list and the pages behind its rows (spec 001 §4.3, §12). */
function Tabs({ columns }: { columns: boolean }) {
  const { unreadCount } = useShell();
  const { pathname } = useLocation();
  // `matched` hides the tab bar in a conversation with this class (spec 001 §13.6 D14); `stock` has no rule for it.
  // A conversation in the detail column keeps the bar, as `ChatDetail.swift` does in regular width.
  const inConversation = !columns && matchPath('/chat/:chatId', pathname) !== null;

  useEffect(() => {
    const tabBar = document.querySelector<HTMLElement>('ion-tab-bar');
    return tabBar ? attachTabBarEffect(tabBar) : undefined;
  }, []);

  return (
    <IonTabs>
      {/* The two layouts have different routes; each has its own outlet, which starts from the current path. */}
      <IonRouterOutlet key={columns ? 'columns' : 'phone'}>
        {columns ? columnRoutes : phoneRoutes}
        <Route path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className={inConversation ? 'tab-bar-conversation' : undefined}>
        {shellTabs.map((tab) => (
          <IonTabButton key={tab.id} tab={tab.id} href={tab.href}>
            <IonIcon aria-hidden="true" icon={tab.icon} />
            <IonLabel>{tab.title}</IonLabel>
            {tab.id === 'home' && unreadCount > 0 && <IonBadge>{unreadCount}</IonBadge>}
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
}

export default App;
