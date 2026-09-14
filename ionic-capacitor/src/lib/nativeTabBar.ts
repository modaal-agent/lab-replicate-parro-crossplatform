import { Capacitor } from '@capacitor/core';
import { NativeNavigation } from '@capgo/capacitor-native-navigation';
import { useEffect } from 'react';
import { shellTabs, type TabId } from './tabs';
import { isMatched } from './variant';

/**
 * Whether UIKit draws the tab bar, through `@capgo/capacitor-native-navigation` (spec 001 §6, phase 7): in `matched` on
 * iOS. `stock`, and `matched` in a browser, show `IonTabBar`.
 */
export const usesNativeTabBar = isMatched && Capacitor.getPlatform() === 'ios';

/** The accent colour, `#D13C63` (spec 001 D16). */
const accent = '#D13C63';

interface NativeTabBarState {
  selectedTab: TabId;
  hidden: boolean;
  homeBadge: number;
}

/**
 * Shows the native tab bar with the tab on screen selected, or hides it. `IonTabBar` stays in the page, hidden by
 * `matched/index.css`, and keeps choosing the page a tab opens: a tap on a native tab clicks the `IonTabButton` of the
 * same tab, which opens the page that tab showed last, or the tab's first page when the tab is already selected.
 */
export function useNativeTabBar({ selectedTab, hidden, homeBadge }: NativeTabBarState) {
  useEffect(() => {
    if (!usesNativeTabBar) {
      return undefined;
    }
    document.documentElement.classList.add('native-tab-bar');
    const listener = NativeNavigation.addListener('tabSelect', ({ id }) => {
      document.querySelector<HTMLElement>(`ion-tab-button[tab="${id}"]`)?.click();
    });
    return () => {
      document.documentElement.classList.remove('native-tab-bar');
      void listener.then((handle) => handle.remove());
    };
  }, []);

  useEffect(() => {
    if (!usesNativeTabBar) {
      return;
    }
    void NativeNavigation.setTabbar({
      hidden,
      selectedId: selectedTab,
      colors: { tint: accent },
      tabs: shellTabs.map((tab) => ({
        id: tab.id,
        title: tab.title,
        icon: { ios: { sfSymbol: tab.symbol } },
        badge: tab.id === 'home' && homeBadge > 0 ? homeBadge : undefined,
      })),
    });
  }, [selectedTab, hidden, homeBadge]);
}
