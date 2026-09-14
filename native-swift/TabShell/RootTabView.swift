import SwiftUI

enum AppTab: Hashable {
  case home, calendar, chat, settings
}

/// The four tabs, each a list and its detail (spec 001 §3.2). On a compact-width window the tabs are a
/// tab bar and a row pushes its detail, as in phase 1. On a regular-width window the tabs can be shown
/// as a sidebar, and each list is a column beside its detail.
struct RootTabView: View {
  @Environment(ShellModel.self) private var model
  @Environment(\.horizontalSizeClass) private var horizontalSizeClass
  @State private var selectedTab: AppTab = .home
  // Held here, outside the split views, so that a selection stays when the window changes width.
  @State private var homeSelection: HomeRoute?
  @State private var eventSelection: CalendarEvent.ID?
  @State private var calendarColumn = NavigationSplitViewColumn.sidebar
  @State private var chatSelection: ChatThread.ID?
  @State private var settingsSelection: SettingsRoute?

  var body: some View {
    TabView(selection: $selectedTab) {
      Tab("Home", systemImage: "house", value: AppTab.home) {
        NavigationSplitView {
          HomeList(selection: $homeSelection)
            .listColumn()
        } detail: {
          HomeDetail(route: homeSelection)
        }
      }
      .badge(model.unreadCount)

      Tab("Calendar", systemImage: "calendar", value: AppTab.calendar) {
        NavigationSplitView(preferredCompactColumn: $calendarColumn) {
          CalendarList(selection: $eventSelection)
            .listColumn()
        } detail: {
          EventDetail(eventID: eventSelection)
        }
        // The event cards are buttons, not the rows of a `List`, so on a compact-width window a
        // selection shows the detail only through the compact column. Going back clears the selection,
        // so the same card opens it again.
        .onChange(of: eventSelection) {
          if eventSelection != nil { calendarColumn = .detail }
        }
        .onChange(of: calendarColumn) {
          if calendarColumn != .detail, horizontalSizeClass == .compact { eventSelection = nil }
        }
      }

      Tab("Chat", systemImage: "bubble.left", value: AppTab.chat) {
        NavigationSplitView {
          ChatList(selection: $chatSelection)
            .listColumn()
        } detail: {
          // A new identity per chat, so a draft and a scroll position stay with the chat they belong to.
          ChatDetail(chatID: chatSelection)
            .id(chatSelection)
        }
      }

      Tab("Settings", systemImage: "gearshape", value: AppTab.settings) {
        NavigationSplitView {
          SettingsList(selection: $settingsSelection)
            .listColumn()
        } detail: {
          SettingsDetail(route: settingsSelection)
        }
      }
    }
    .tabViewStyle(.sidebarAdaptable)
  }
}

private extension View {
  /// A tab's list beside its detail. The tab view's own button shows and hides the sidebar, so the
  /// split view's second one is removed and the list stays on screen.
  func listColumn() -> some View {
    toolbar(removing: .sidebarToggle)
      .navigationSplitViewColumnWidth(min: 320, ideal: 375, max: 420)
  }
}
