import { calendarOutline, chatbubbleOutline, homeOutline, settingsOutline } from 'ionicons/icons';
import { matchPath, useParams } from 'react-router-dom';
import Columns, { NoSelection } from '../components/Columns';
import { useShell } from '../model/ShellModel';
import { CalendarList } from './CalendarPage';
import { ChatList } from './ChatPage';
import { Conversation } from './ConversationPage';
import { HomeList } from './HomePage';
import { EventPlaceholder, GroupPlaceholder, HomePlaceholder, SettingPlaceholder } from './PlaceholderPage';
import { SettingsList } from './SettingsPage';

/*
 * The route of each tab on a window at least 672 px wide (spec 001 §19): the list, and in the detail column the page
 * of the row the path selects, or a prompt to select a row. The paths are the phone layout's, so the selection stays
 * when the window is resized across 672 px.
 */

/**
 * The path this tab's view shows. While another tab is shown, `useLocation` gives that tab's path; the route's `*`
 * parameter comes from the view's own match, which Ionic's router keeps for a hidden view (`renderViewItem` in
 * `@ionic/react-router`). Reading `useLocation` here closed a hidden conversation, and its draft, on a tab switch.
 */
function useViewPath(base: string): string {
  const rest = useParams()['*'];
  return rest ? `${base}/${rest}` : base;
}

export function HomeColumns() {
  const pathname = useViewPath('/home');
  const groupId = matchPath('/home/groups/:groupId', pathname)?.params.groupId;
  const pageId = matchPath('/home/:pageId', pathname)?.params.pageId;
  let detail = <NoSelection icon={homeOutline} title="Select a group or a page" />;
  if (groupId) {
    detail = <GroupPlaceholder groupId={groupId} />;
  } else if (pageId) {
    detail = <HomePlaceholder pageId={pageId} />;
  }
  return <Columns list={<HomeList selectedPath={pathname} />} detail={detail} />;
}

export function CalendarColumns() {
  const pathname = useViewPath('/calendar');
  const eventId = matchPath('/calendar/:eventId', pathname)?.params.eventId;
  const detail = eventId ? (
    <EventPlaceholder eventId={eventId} />
  ) : (
    <NoSelection icon={calendarOutline} title="Select an event" />
  );
  return <Columns list={<CalendarList selectedPath={pathname} />} detail={detail} />;
}

export function ChatColumns() {
  const pathname = useViewPath('/chat');
  const { chats } = useShell();
  const chatId = matchPath('/chat/:chatId', pathname)?.params.chatId;
  let detail = null;
  if (chatId) {
    // A new instance per chat, so a draft and the scroll position stay with their chat.
    detail = <Conversation key={chatId} chatId={chatId} />;
  } else if (chats.length > 0) {
    // With no chats the detail column stays empty beside the list's own empty state, as in `ChatDetail.swift`.
    detail = <NoSelection icon={chatbubbleOutline} title="Select a chat" />;
  }
  return <Columns list={<ChatList selectedPath={pathname} />} detail={detail} />;
}

export function SettingsColumns() {
  const pathname = useViewPath('/settings');
  const settingId = matchPath('/settings/:settingId', pathname)?.params.settingId;
  const detail = settingId ? (
    <SettingPlaceholder settingId={settingId} />
  ) : (
    <NoSelection icon={settingsOutline} title="Select a setting" />
  );
  return <Columns list={<SettingsList selectedPath={pathname} />} detail={detail} />;
}
