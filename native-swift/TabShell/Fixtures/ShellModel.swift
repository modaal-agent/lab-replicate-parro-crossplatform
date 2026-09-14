import Observation
import SwiftUI

/// The app's only mutable state: the unread counts "Mark all as read" clears, the chats "+" adds,
/// and the messages sent in them. Held in memory, so a relaunch starts from the fixture again
/// (spec 001 §10.2 O3, §12.3 D10).
@MainActor
@Observable
final class ShellModel {
  private(set) var groups: [SchoolGroup] = Fixture.groups
  private(set) var chats: [ChatThread] = []
  private var addedChatCount = 0

  var unreadCount: Int {
    groups.reduce(0) { $0 + $1.unreadCount }
  }

  func group(id: SchoolGroup.ID) -> SchoolGroup? {
    groups.first { $0.id == id }
  }

  func markAllAsRead() {
    for index in groups.indices {
      groups[index].unreadCount = 0
    }
  }

  func chat(id: ChatThread.ID) -> ChatThread? {
    chats.first { $0.id == id }
  }

  /// Adds the next of the three fixture chats, in turn, as a new row at the top.
  func addChat() {
    let template = Fixture.chats[addedChatCount % Fixture.chats.count]
    addedChatCount += 1
    chats.insert(template.copy(), at: 0)
  }

  func markRead(chatID: ChatThread.ID) {
    guard let index = chats.firstIndex(where: { $0.id == chatID }), chats[index].isUnread else { return }
    chats[index].isUnread = false
  }

  /// Appends a message from the parent, dated now on the fixture's today and never before the last message.
  func send(_ text: String, to chatID: ChatThread.ID) {
    guard let index = chats.firstIndex(where: { $0.id == chatID }) else { return }
    let earliest = chats[index].lastMessage?.date.addingTimeInterval(60) ?? .distantPast
    let message = ChatMessage(sender: nil, date: max(Fixture.nowOnToday(), earliest), content: .text(text))
    chats[index].messages.append(message)
  }
}
