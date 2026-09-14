import {
  calendar,
  calendarOutline,
  chatbubble,
  chatbubbleOutline,
  home,
  homeOutline,
  settings,
  settingsOutline,
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isMatched } from './variant';

export type TabId = 'home' | 'calendar' | 'chat' | 'settings';

export interface ShellTab {
  id: TabId;
  title: string;
  /** The tab's first page. */
  href: string;
  icon: string;
}

/** The four tabs. `matched` draws filled icons, as `native-swift/`'s tab bar draws its SF Symbols (spec 001 §13.3). */
export const shellTabs: ShellTab[] = [
  { id: 'home', title: 'Home', href: '/home', icon: isMatched ? home : homeOutline },
  { id: 'calendar', title: 'Calendar', href: '/calendar', icon: isMatched ? calendar : calendarOutline },
  { id: 'chat', title: 'Chat', href: '/chat', icon: isMatched ? chatbubble : chatbubbleOutline },
  { id: 'settings', title: 'Settings', href: '/settings', icon: isMatched ? settings : settingsOutline },
];

/** The tab a path is in. */
export function tabOf(pathname: string): TabId | undefined {
  return shellTabs.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`))?.id;
}

export type TabPaths = Record<TabId, string>;

/** The path each tab showed last. The menu opens it, as `IonTabBar` does for a tab button (spec 001 §19). */
export function useTabPaths(): TabPaths {
  const { pathname } = useLocation();
  const [paths, setPaths] = useState(
    () => Object.fromEntries(shellTabs.map((tab) => [tab.id, tab.href])) as TabPaths,
  );
  useEffect(() => {
    const tab = tabOf(pathname);
    if (tab) {
      setPaths((current) => (current[tab] === pathname ? current : { ...current, [tab]: pathname }));
    }
  }, [pathname]);
  return paths;
}
