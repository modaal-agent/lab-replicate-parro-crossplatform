import type { setupIonicReact } from '@ionic/react';

/** The `setupIonicReact` options of the `stock` variant: Ionic's defaults (spec 001 §13.6 D16). */
export const ionicConfig: Parameters<typeof setupIonicReact>[0] = {};

/** `stock` adds nothing to Ionic's tab bar, and returns no clean-up. */
export const attachTabBarEffect: (tabBar: HTMLElement) => (() => void) | undefined = () => undefined;
