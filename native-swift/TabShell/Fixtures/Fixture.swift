import SwiftUI

struct SchoolGroup: Identifiable, Hashable {
  let id: String
  let name: String
  let color: Color
  var unreadCount: Int
  let teacherInitials: String?
}

struct CalendarEvent: Identifiable, Hashable {
  let id: String
  let title: String
  let start: Date
  let end: Date
  let isAllDay: Bool
  let organizerInitials: String
}

enum ChatKind: Hashable {
  case child, group, direct
}

struct ChatThread: Identifiable, Hashable {
  var id = UUID()
  let title: String
  let kind: ChatKind
  let lastMessage: String
  let lastMessageDate: Date
  let isUnread: Bool
  let initials: String
  let symbol: String?
  let color: Color

  /// The same chat as a new row with its own id.
  func copy() -> ChatThread {
    var chat = self
    chat.id = UUID()
    return chat
  }
}

/// The placeholder content of every screen (spec 001 §2.2). All names are invented, per AGENTS.md
/// §"Two builds of one shell"; the structure follows `_assets/IMG_0210.PNG` … `IMG_0213.PNG`.
enum Fixture {
  static let schoolName = "Brightwater Montessori"
  static let childName = "Sam"
  static let subtitle = "Brightwater Montessori • Sam"
  static let schoolYear = "School year 2026/2027"

  /// Weeks start on Monday and are numbered as in `IMG_0211.PNG`: 7–13 September 2026 is week 37.
  static let calendar = Calendar(identifier: .iso8601)

  /// The calendar's today: the day the reference screenshots were taken.
  static let today = date(2026, 9, 13)

  static let groups = [
    SchoolGroup(
      id: "school", name: schoolName, color: Color(red: 0.910, green: 0.263, blue: 0.431),
      unreadCount: 0, teacherInitials: nil),
    SchoolGroup(
      id: "group-678b", name: "Group 6/7/8 B", color: Color(red: 0.784, green: 0.580, blue: 0.035),
      unreadCount: 1, teacherInitials: "JV"),
  ]

  static let events = [
    event("charity-market", "Charity market", date(2026, 9, 16, 13, 30), date(2026, 9, 16, 16, 0), "JV"),
    event(
      "book-week", "Book week opening assembly in the main hall", date(2026, 9, 28, 9, 15),
      date(2026, 9, 28, 9, 40), "JV"),
    CalendarEvent(
      id: "purple-friday", title: "Purple Friday", start: date(2026, 10, 9), end: date(2026, 10, 10),
      isAllDay: true, organizerInitials: "JV"),
    event(
      "parent-evening", "Parent–teacher evening", date(2026, 10, 22, 19, 0), date(2026, 10, 22, 20, 30),
      "AB"),
  ]

  /// The three chats "+" adds in turn (spec 001 §10.2 O3).
  static let chats = [
    ChatThread(
      title: "Group 6/7/8 B", kind: .group,
      lastMessage: "Jamie Visser: Please pack gym clothes for tomorrow’s PE lesson.",
      lastMessageDate: date(2026, 9, 13, 9, 41), isUnread: true, initials: "6B", symbol: "person.3.fill",
      color: .orange),
    ChatThread(
      title: "Jamie Visser", kind: .direct, lastMessage: "Thanks for letting me know. See you on Monday!",
      lastMessageDate: date(2026, 9, 12, 16, 20), isUnread: false, initials: "JV", symbol: nil, color: .indigo),
    ChatThread(
      title: "Sam", kind: .child, lastMessage: "Sam shared a drawing from art class.",
      lastMessageDate: date(2026, 9, 11, 14, 5), isUnread: true, initials: "S", symbol: nil, color: .teal),
  ]

  static func date(_ year: Int, _ month: Int, _ day: Int, _ hour: Int = 0, _ minute: Int = 0) -> Date {
    calendar.date(from: DateComponents(year: year, month: month, day: day, hour: hour, minute: minute))!
  }

  private static func event(
    _ id: String, _ title: String, _ start: Date, _ end: Date, _ initials: String
  ) -> CalendarEvent {
    CalendarEvent(id: id, title: title, start: start, end: end, isAllDay: false, organizerInitials: initials)
  }
}
