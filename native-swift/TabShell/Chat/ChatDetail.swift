import SwiftUI

/// A conversation (spec 001 §12.1): the chat's messages in bubbles above a composer. With no chat
/// selected, in the detail column of a regular-width window, a prompt.
struct ChatDetail: View {
  /// A bubble's widest, so that lines stay readable in a wide detail column.
  private static let maxBubbleWidth: CGFloat = 520

  let chatID: ChatThread.ID?
  @Environment(ShellModel.self) private var model
  @Environment(\.horizontalSizeClass) private var horizontalSizeClass
  @State private var contentWidth: CGFloat = 0
  @State private var draft = ""
  @State private var position = ScrollPosition(edge: .bottom)
  @FocusState private var isComposerFocused: Bool

  var body: some View {
    if let chatID, let chat = model.chat(id: chatID) {
      conversation(chat)
    } else if model.chats.isEmpty {
      // The list column already shows the empty state; a second prompt beside it has nothing to select.
      Color.clear
    } else {
      ContentUnavailableView("Select a chat", systemImage: "bubble.left")
    }
  }

  private func conversation(_ chat: ChatThread) -> some View {
    ScrollView {
      LazyVStack(spacing: 0) {
        ForEach(MessageRow.rows(for: chat.messages)) { row in
          MessageRowView(
            row: row, showsSenders: chat.kind == .group,
            minSpacerLength: max(60, contentWidth - Self.maxBubbleWidth))
        }
      }
      .onGeometryChange(for: CGFloat.self) { $0.size.width } action: { contentWidth = $0 }
      // 14 pt leaves the 4 pt tail tip 10 pt from the screen edge.
      .padding(.horizontal, 14)
      .padding(.bottom, 8)
    }
    .defaultScrollAnchor(.bottom)
    .scrollPosition($position)
    .scrollDismissesKeyboard(.interactively)
    // With the soft effect, bubbles scrolled under the bar showed through the title and subtitle.
    .scrollEdgeEffectStyle(.hard, for: .top)
    .safeAreaBar(edge: .bottom) {
      ChatComposer(draft: $draft, isFocused: $isComposerFocused) {
        send(to: chat)
      }
    }
    .navigationTitle(chat.title)
    .navigationSubtitle(chat.subtitle)
    .navigationBarTitleDisplayMode(.inline)
    // On a compact-width window the conversation covers the tab bar; beside the list the tabs stay.
    .toolbar(horizontalSizeClass == .compact ? .hidden : .automatic, for: .tabBar)
    .toolbar {
      ToolbarItem(placement: .topBarTrailing) {
        Avatar(initials: chat.initials, symbol: chat.symbol, color: chat.color, size: 36)
          .accessibilityLabel(chat.title)
      }
      .sharedBackgroundVisibility(.hidden)
    }
    .onAppear {
      model.markRead(chatID: chat.id)
    }
  }

  private func send(to chat: ChatThread) {
    let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !text.isEmpty else { return }
    withAnimation(.snappy) {
      model.send(text, to: chat.id)
      draft = ""
      position.scrollTo(edge: .bottom)
    }
  }
}

/// One message and what the conversation draws around it.
struct MessageRow: Identifiable {
  /// A date line goes above a message sent more than this long after the one before it.
  static let dateGap: TimeInterval = 60 * 60

  let message: ChatMessage
  let showsDate: Bool
  /// The first message of a run from one sender: extra space above, and the sender's name in a group.
  let startsRun: Bool
  /// The last message of a run: its bubble has a tail, and in a group the sender's avatar.
  let endsRun: Bool
  /// "Read" or "Delivered", under the parent's last message.
  let receipt: String?

  var id: ChatMessage.ID { message.id }

  static func rows(for messages: [ChatMessage]) -> [MessageRow] {
    let lastOutgoing = messages.lastIndex(where: \.isOutgoing)
    return messages.indices.map { index in
      let message = messages[index]
      let previous = index > messages.startIndex ? messages[index - 1] : nil
      let next = index + 1 < messages.endIndex ? messages[index + 1] : nil
      let showsDate = previous.map { message.date.timeIntervalSince($0.date) > dateGap } ?? true
      let nextShowsDate = next.map { $0.date.timeIntervalSince(message.date) > dateGap } ?? true
      var receipt: String?
      if index == lastOutgoing {
        receipt = messages[(index + 1)...].contains { !$0.isOutgoing } ? "Read" : "Delivered"
      }
      return MessageRow(
        message: message,
        showsDate: showsDate,
        startsRun: showsDate || previous?.sender != message.sender,
        endsRun: nextShowsDate || next?.sender != message.sender,
        receipt: receipt)
    }
  }
}

private struct MessageRowView: View {
  let row: MessageRow
  let showsSenders: Bool
  /// The space kept free beside a bubble: 60 pt, or more where that would make the bubble too wide.
  let minSpacerLength: CGFloat

  private let avatarSize: CGFloat = 28
  private let avatarSpacing: CGFloat = 8

  var body: some View {
    let message = row.message
    VStack(spacing: 0) {
      if row.showsDate {
        DateLine(date: message.date)
          .padding(.top, 16)
          .padding(.bottom, 10)
      }
      if showsSenders, row.startsRun, let sender = message.sender {
        Text(sender.name)
          .font(.caption)
          .foregroundStyle(.secondary)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.leading, avatarSize + avatarSpacing + 12)
          .padding(.bottom, 3)
      }
      HStack(alignment: .bottom, spacing: avatarSpacing) {
        if message.isOutgoing {
          Spacer(minLength: minSpacerLength)
        } else if showsSenders {
          if row.endsRun, let sender = message.sender {
            Avatar(initials: sender.initials, color: sender.color, size: avatarSize)
          } else {
            Color.clear.frame(width: avatarSize, height: avatarSize)
          }
        }
        MessageBubble(message: message, hasTail: row.endsRun)
        if !message.isOutgoing {
          Spacer(minLength: minSpacerLength)
        }
      }
      if let receipt = row.receipt {
        Text(receipt)
          .font(.caption2.weight(.medium))
          .foregroundStyle(.secondary)
          .frame(maxWidth: .infinity, alignment: .trailing)
          .padding(.top, 4)
          .padding(.trailing, 4)
      }
    }
    .padding(.top, row.startsRun && !row.showsDate ? 10 : 2)
  }
}

/// "**Friday** 15:02" above a message, as in Messages.
private struct DateLine: View {
  let date: Date

  var body: some View {
    Text("\(Text(ChatDates.dayName(date)).fontWeight(.semibold)) \(ChatDates.time(date))")
      .font(.caption)
      .foregroundStyle(.secondary)
      .frame(maxWidth: .infinity)
  }
}

private struct ChatComposer: View {
  @Binding var draft: String
  var isFocused: FocusState<Bool>.Binding
  let onSend: () -> Void

  private var canSend: Bool {
    !draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
  }

  var body: some View {
    HStack(alignment: .bottom, spacing: 8) {
      // Opens nothing in this shell.
      Button {} label: {
        Image(systemName: "plus")
          .font(.system(size: 18, weight: .semibold))
          .frame(width: 30, height: 30)
      }
      .buttonStyle(.glass)
      .buttonBorderShape(.circle)
      .accessibilityLabel("Add attachment")

      HStack(alignment: .bottom, spacing: 4) {
        TextField("Message", text: $draft, axis: .vertical)
          .lineLimit(1...5)
          .focused(isFocused)
          .padding(.vertical, 11)
          .padding(.leading, 16)
          .padding(.trailing, canSend ? 0 : 16)
        if canSend {
          Button(action: onSend) {
            Image(systemName: "arrow.up")
              .font(.system(size: 15, weight: .bold))
              .foregroundStyle(.white)
              .frame(width: 32, height: 32)
              .background(.tint, in: .circle)
          }
          .padding(6)
          .accessibilityLabel("Send")
          .transition(.scale.combined(with: .opacity))
        }
      }
      .glassEffect(.regular.interactive(), in: .rect(cornerRadius: 22))
    }
    .padding(.horizontal, 16)
    .padding(.vertical, 8)
    .animation(.snappy, value: canSend)
  }
}
