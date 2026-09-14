import { isPlatform, type setupIonicReact } from '@ionic/react';
import {
  iosTransitionAnimation,
  popoverEnterAnimation,
  popoverLeaveAnimation,
  registerTabBarEffect,
} from '@rdlabo/ionic-theme-ios26';

/**
 * The `setupIonicReact` options of the `matched` variant (spec 001 §13.3): the theme's transitions, as its README
 * configures them, and a back button without text, as the chevron-only back button of `native-swift/`.
 */
export const ionicConfig: Parameters<typeof setupIonicReact>[0] = {
  navAnimation: isPlatform('ios') ? iosTransitionAnimation : undefined,
  popoverEnter: isPlatform('ios') ? popoverEnterAnimation : undefined,
  popoverLeave: isPlatform('ios') ? popoverLeaveAnimation : undefined,
  backButtonText: '',
};

/** The theme's experimental moving selection on the tab bar (spec 001 §13.3); returns its clean-up. */
export const attachTabBarEffect = (tabBar: HTMLElement): (() => void) | undefined => {
  const effect = registerTabBarEffect(tabBar);
  return effect ? () => effect.destroy() : undefined;
};
