import { useSyncExternalStore } from 'react';

/**
 * The window width from which each tab shows its list beside its detail (spec 001 §19). `native-swift/` changes to
 * regular width between 666 and 672 pt (§18.2); the web view's viewport is the device width at scale 1 (`index.html`).
 */
export const columnsQuery = '(min-width: 672px)';

/**
 * The split pane's `when`: from 992 px, Ionic's `lg`, the menu lists the tabs beside the columns and the tab bar is
 * hidden (spec 001 §19).
 */
export const menuWhen = 'lg';

/** Ionic's `lg` as a media query, the width from which the split pane shows the menu. */
export const menuQuery = '(min-width: 992px)';

function subscribeTo(media: string) {
  return (onChange: () => void) => {
    const query = window.matchMedia(media);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  };
}

const subscribeToColumns = subscribeTo(columnsQuery);
const subscribeToMenu = subscribeTo(menuQuery);

/** Whether the window is at least 672 px wide, updated as the window is resized. */
export function useColumns(): boolean {
  return useSyncExternalStore(subscribeToColumns, () => window.matchMedia(columnsQuery).matches);
}

/** Whether the window is at least 992 px wide, where the split pane shows the menu in place of the tab bar. */
export function useMenu(): boolean {
  return useSyncExternalStore(subscribeToMenu, () => window.matchMedia(menuQuery).matches);
}

/**
 * Sets the `windowed` class on the root element while the web view is narrower than the screen. iPadOS then draws its
 * window controls over the leading end of the window's top bar and gives the web view no safe-area inset for them
 * (spec 001 §19); `Columns.css` moves the top bar's content past them. Returns the clean-up.
 *
 * `screen` keeps the portrait size in landscape, so a full-screen web view is as wide as one of its two sides. Only the
 * width is compared: the keyboard shrinks the web view's height (`@capacitor/keyboard`).
 */
export function watchWindowed(): () => void {
  const update = () => {
    const windowed = innerWidth !== screen.width && innerWidth !== screen.height;
    document.documentElement.classList.toggle('windowed', windowed);
  };
  update();
  addEventListener('resize', update);
  return () => removeEventListener('resize', update);
}

/**
 * The class names and ARIA attribute of a list row that opens `href`. The row is selected while the detail column
 * shows `selectedPath` (spec 001 §19); in the phone layout `selectedPath` is undefined and the row keeps `className`.
 */
export function rowSelection(href: string, selectedPath: string | undefined, className?: string) {
  const selected = href === selectedPath;
  return {
    className: [className, selected && 'selected'].filter(Boolean).join(' ') || undefined,
    'aria-current': selected ? ('page' as const) : undefined,
  };
}
