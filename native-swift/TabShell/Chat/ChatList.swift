import SwiftUI

enum ChatFilter: CaseIterable, Identifiable {
  case unread, child, group, direct

  var id: Self { self }

  var title: String {
    switch self {
    case .unread: "Unread"
    case .child: "Child chat"
    case .group: "Group chat"
    case .direct: "Private chat"
    }
  }

  var systemImage: String {
    switch self {
    case .unread: "envelope.badge"
    case .child: "figure.child"
    case .group: "person.3"
    case .direct: "person"
    }
  }

  func includes(_ chat: ChatThread) -> Bool {
    switch self {
    case .unread: chat.isUnread
    case .child: chat.kind == .child
    case .group: chat.kind == .group
    case .direct: chat.kind == .direct
    }
  }
}

/// A chat row's navigation value. The conversation reads the chat from `ShellModel` by id, so it
/// shows messages sent after the row was tapped.
struct ChatRoute: Hashable {
  let id: ChatThread.ID
}

/// `IMG_0212.PNG`: filter chips, the chat list or its empty state, and "+" to add a chat.
struct ChatList: View {
  @Environment(ShellModel.self) private var model
  @State private var filter: ChatFilter?

  private var visibleChats: [ChatThread] {
    guard let filter else { return model.chats }
    return model.chats.filter(filter.includes)
  }

  var body: some View {
    content
      .safeAreaBar(edge: .top) {
        FilterChips(selection: $filter)
      }
      .overlay(alignment: .bottomTrailing) {
        addButton
      }
      .navigationTitle("Chat")
      .navigationSubtitle(Fixture.subtitle)
      // A large title below the navigation bar is covered by the chips' scroll edge effect.
      .toolbarTitleDisplayMode(.inlineLarge)
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          Button("Search", systemImage: "magnifyingglass") {}
        }
      }
      .navigationDestination(for: ChatRoute.self) { route in
        ChatDetail(chatID: route.id)
      }
  }

  @ViewBuilder
  private var content: some View {
    if model.chats.isEmpty {
      ContentUnavailableView {
        Label("Your chats will appear here", systemImage: "bubble.left.and.text.bubble.right")
      } description: {
        Text("When a teacher sends you a message, you will find it here.")
      }
    } else if let filter, visibleChats.isEmpty {
      ContentUnavailableView(
        "No \(filter.title.lowercased())s", systemImage: filter.systemImage,
        description: Text("Chats that match this filter will appear here."))
    } else {
      List(visibleChats) { chat in
        NavigationLink(value: ChatRoute(id: chat.id)) {
          ChatRow(chat: chat)
        }
        // The wider leading inset leaves room for the unread dot, as in Messages.
        .listRowInsets(EdgeInsets(top: 8, leading: 30, bottom: 8, trailing: 20))
      }
      .listStyle(.plain)
      .contentMargins(.bottom, 88, for: .scrollContent)
    }
  }

  private var addButton: some View {
    Button {
      withAnimation(.snappy) { model.addChat() }
    } label: {
      Image(systemName: "plus")
        .font(.title3.weight(.semibold))
        .frame(width: 26, height: 26)
    }
    .buttonStyle(.glassProminent)
    .buttonBorderShape(.circle)
    .controlSize(.large)
    .padding(.trailing, 20)
    .padding(.bottom, 16)
    .accessibilityLabel("New chat")
  }
}

private struct FilterChips: View {
  @Binding var selection: ChatFilter?

  var body: some View {
    ScrollViewReader { proxy in
      ScrollView(.horizontal) {
        HStack(spacing: 8) {
          ForEach(ChatFilter.allCases) { filter in
            chip(filter)
              .id(filter)
          }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
      }
      .scrollIndicators(.hidden)
      .onChange(of: selection) {
        guard let selection else { return }
        withAnimation(.snappy) {
          proxy.scrollTo(selection, anchor: .center)
        }
      }
    }
  }

  @ViewBuilder
  private func chip(_ filter: ChatFilter) -> some View {
    let toggle = {
      withAnimation(.snappy) {
        selection = selection == filter ? nil : filter
      }
    }
    let label = Text(filter.title).font(.subheadline.weight(.medium))
    if selection == filter {
      Button(action: toggle) { label }
        .buttonStyle(.glassProminent)
    } else {
      Button(action: toggle) { label }
        .buttonStyle(.glass)
    }
  }
}

private struct ChatRow: View {
  let chat: ChatThread

  var body: some View {
    HStack(spacing: 12) {
      Avatar(initials: chat.initials, symbol: chat.symbol, color: chat.color)
      VStack(alignment: .leading, spacing: 3) {
        HStack(alignment: .firstTextBaseline) {
          Text(chat.title)
            .font(.headline)
            .lineLimit(1)
          Spacer(minLength: 8)
          if let date = chat.lastMessage?.date {
            Text(ChatDates.listTimestamp(date))
              .font(.subheadline)
              .foregroundStyle(chat.isUnread ? Color.accentColor : Color.secondary)
          }
        }
        Text(chat.preview)
          .font(.subheadline)
          .foregroundStyle(.secondary)
          .lineLimit(2)
      }
      // Every separator starts under the text, whichever row it follows.
      .alignmentGuide(.listRowSeparatorLeading) { $0[.leading] }
    }
    .padding(.vertical, 4)
    .overlay(alignment: .leading) {
      if chat.isUnread {
        Circle()
          .fill(.tint)
          .frame(width: 10, height: 10)
          .offset(x: -20)
          .accessibilityLabel("Unread")
      }
    }
  }
}

/// A round avatar with a symbol or initials, for chats and for the people in them.
struct Avatar: View {
  let initials: String
  var symbol: String?
  let color: Color
  var size: CGFloat = 44

  var body: some View {
    Group {
      if let symbol {
        Image(systemName: symbol)
          .font(.system(size: size * 0.4, weight: .semibold))
      } else {
        Text(initials)
          .font(.system(size: size * 0.38, weight: .semibold))
      }
    }
    .foregroundStyle(.white)
    .frame(width: size, height: size)
    .background(color.gradient, in: .circle)
  }
}

/// Dates as Messages shows them, relative to the fixture's today.
enum ChatDates {
  static func time(_ date: Date) -> String {
    date.formatted(date: .omitted, time: .shortened)
  }

  /// "Today", "Yesterday", the weekday within the last week, or the date.
  static func dayName(_ date: Date) -> String {
    let calendar = Fixture.calendar
    if calendar.isDate(date, inSameDayAs: Fixture.today) {
      return "Today"
    }
    if let yesterday = calendar.date(byAdding: .day, value: -1, to: Fixture.today),
      calendar.isDate(date, inSameDayAs: yesterday)
    {
      return "Yesterday"
    }
    if let weekAgo = calendar.date(byAdding: .day, value: -6, to: Fixture.today), date >= weekAgo {
      return date.formatted(.dateTime.weekday(.wide))
    }
    return date.formatted(.dateTime.day().month(.abbreviated).year())
  }

  /// The time for a message from today, otherwise the day.
  static func listTimestamp(_ date: Date) -> String {
    Fixture.calendar.isDate(date, inSameDayAs: Fixture.today) ? time(date) : dayName(date)
  }
}
