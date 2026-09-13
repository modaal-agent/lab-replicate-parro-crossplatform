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
      .navigationDestination(for: ChatThread.self) { chat in
        PlaceholderDetail(title: chat.title, systemImage: "bubble.left.and.bubble.right")
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
        NavigationLink(value: chat) {
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
      ChatAvatar(chat: chat)
      VStack(alignment: .leading, spacing: 3) {
        HStack(alignment: .firstTextBaseline) {
          Text(chat.title)
            .font(.headline)
            .lineLimit(1)
          Spacer(minLength: 8)
          Text(timestamp)
            .font(.subheadline)
            .foregroundStyle(chat.isUnread ? Color.accentColor : Color.secondary)
        }
        Text(chat.lastMessage)
          .font(.subheadline)
          .foregroundStyle(.secondary)
          .lineLimit(2)
      }
      // Every separator starts under the text, whichever row it follows.
      .alignmentGuide(.listRowSeparatorLeading) { $0[.leading] }
    }
    .padding(.vertical, 4)
    .overlay(alignment: .leading) {
      unreadDot
    }
  }

  /// The time for a message from the fixture's today, "Yesterday", or the weekday, as Messages shows them.
  private var timestamp: String {
    let calendar = Fixture.calendar
    let date = chat.lastMessageDate
    if calendar.isDate(date, inSameDayAs: Fixture.today) {
      return date.formatted(date: .omitted, time: .shortened)
    }
    if let yesterday = calendar.date(byAdding: .day, value: -1, to: Fixture.today),
      calendar.isDate(date, inSameDayAs: yesterday)
    {
      return "Yesterday"
    }
    return date.formatted(.dateTime.weekday(.wide))
  }

  @ViewBuilder
  private var unreadDot: some View {
    if chat.isUnread {
      Circle()
        .fill(.tint)
        .frame(width: 10, height: 10)
        .offset(x: -20)
        .accessibilityLabel("Unread")
    }
  }
}

private struct ChatAvatar: View {
  let chat: ChatThread

  var body: some View {
    Group {
      if let symbol = chat.symbol {
        Image(systemName: symbol)
          .font(.system(size: 18, weight: .semibold))
      } else {
        Text(chat.initials)
          .font(.system(size: 17, weight: .semibold))
      }
    }
    .foregroundStyle(.white)
    .frame(width: 44, height: 44)
    .background(chat.color.gradient, in: .circle)
  }
}
