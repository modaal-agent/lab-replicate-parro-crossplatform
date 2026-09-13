import SwiftUI

enum AppTab: Hashable {
  case home, calendar, chat, settings
}

/// The four tabs, each with its own navigation stack (spec 001 §3.2, phase 1).
struct RootTabView: View {
  @Environment(ShellModel.self) private var model
  @State private var selectedTab: AppTab = .home

  var body: some View {
    TabView(selection: $selectedTab) {
      Tab("Home", systemImage: "house", value: AppTab.home) {
        NavigationStack { HomeList() }
      }
      .badge(model.unreadCount)

      Tab("Calendar", systemImage: "calendar", value: AppTab.calendar) {
        NavigationStack { CalendarList() }
      }

      Tab("Chat", systemImage: "bubble.left", value: AppTab.chat) {
        NavigationStack { ChatList() }
      }

      Tab("Settings", systemImage: "gearshape", value: AppTab.settings) {
        NavigationStack { SettingsList() }
      }
    }
  }
}
