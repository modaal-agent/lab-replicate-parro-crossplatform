import Observation
import SwiftUI

/// The app's only mutable state: the unread counts "Mark all as read" clears, and the chats "+"
/// adds. Held in memory, so a relaunch starts from the fixture again (spec 001 §10.2 O3).
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

  /// Adds the next of the three fixture chats, in turn, as a new row at the top.
  func addChat() {
    let template = Fixture.chats[addedChatCount % Fixture.chats.count]
    addedChatCount += 1
    chats.insert(template.copy(), at: 0)
  }
}
