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

/// Someone in a chat other than the parent using the app.
struct ChatParticipant: Hashable {
  let name: String
  let initials: String
  let color: Color
}

struct ChatMessage: Identifiable, Hashable {
  enum Content: Hashable {
    case text(String)
    /// A photo, drawn in code, with a caption below it.
    case photo(caption: String)
  }

  var id = UUID()
  /// `nil` for a message the parent using the app sent.
  let sender: ChatParticipant?
  let date: Date
  let content: Content

  var isOutgoing: Bool { sender == nil }
}

struct ChatThread: Identifiable, Hashable {
  var id = UUID()
  let title: String
  let subtitle: String
  let kind: ChatKind
  let initials: String
  let symbol: String?
  let color: Color
  var isUnread: Bool
  var messages: [ChatMessage]

  var lastMessage: ChatMessage? { messages.last }

  /// The list row's preview: the last message, with its sender's name in a group chat.
  var preview: String {
    guard let message = messages.last else { return "" }
    let body =
      switch message.content {
      case .text(let text): text
      case .photo(let caption): "Photo: \(caption)"
      }
    if message.isOutgoing {
      return "You: \(body)"
    }
    if kind == .group, let sender = message.sender {
      return "\(sender.name): \(body)"
    }
    return body
  }

  /// The same chat as a new row with its own id.
  func copy() -> ChatThread {
    var chat = self
    chat.id = UUID()
    return chat
  }
}

/// The placeholder content of every screen (spec 001 §2.2, §12.2). All names are invented, per
/// AGENTS.md §"Two builds of one shell"; the structure follows the four reference screenshots
/// described in spec 001 §1.2.
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

  static let teacher = ChatParticipant(name: "Jamie Visser", initials: "JV", color: .indigo)
  static let otherParent = ChatParticipant(name: "Priya Shah", initials: "PS", color: .mint)

  /// The three chats "+" adds in turn (spec 001 §10.2 O3), with their messages (§12.2).
  static let chats = [
    ChatThread(
      title: "Group 6/7/8 B", subtitle: "24 members", kind: .group, initials: "6B", symbol: "person.3.fill",
      color: .orange, isUnread: true,
      messages: [
        message(
          from: teacher, date(2026, 9, 11, 15, 2),
          "Good afternoon! The charity market is next Wednesday from 13:30 in the main hall."),
        message(
          from: teacher, date(2026, 9, 11, 15, 3),
          "The children are making bookmarks and cards to sell. Bring some small change if you can."),
        message(from: otherParent, date(2026, 9, 11, 15, 20), "Lovely! Do you need help setting up the stalls?"),
        message(from: teacher, date(2026, 9, 11, 15, 26), "Yes please, setup starts at 12:45."),
        message(from: nil, date(2026, 9, 11, 15, 31), "I can help from 13:00."),
        message(from: teacher, date(2026, 9, 13, 9, 41), "Please pack gym clothes for tomorrow’s PE lesson."),
      ]),
    ChatThread(
      title: "Jamie Visser", subtitle: "Teacher, Group 6/7/8 B", kind: .direct, initials: "JV", symbol: nil,
      color: .indigo, isUnread: false,
      messages: [
        message(from: nil, date(2026, 9, 12, 15, 48), "Hi Jamie, Sam has a dentist appointment on Monday morning."),
        message(from: nil, date(2026, 9, 12, 15, 48), "We’ll drop Sam off at school around 10:30. Is that okay?"),
        message(from: teacher, date(2026, 9, 12, 16, 20), "Thanks for letting me know. See you on Monday!"),
      ]),
    ChatThread(
      title: "Sam", subtitle: "Jamie Visser", kind: .child, initials: "S", symbol: nil, color: .teal,
      isUnread: true,
      messages: [
        message(from: teacher, date(2026, 9, 11, 13, 58), "Art class today was all about our school garden."),
        ChatMessage(
          sender: teacher, date: date(2026, 9, 11, 14, 5),
          content: .photo(caption: "Sam’s drawing of the sunflowers")),
      ]),
  ]

  static func date(_ year: Int, _ month: Int, _ day: Int, _ hour: Int = 0, _ minute: Int = 0) -> Date {
    calendar.date(from: DateComponents(year: year, month: month, day: day, hour: hour, minute: minute))!
  }

  /// The current time of day on the fixture's today, for a message sent from the composer.
  static func nowOnToday() -> Date {
    let time = calendar.dateComponents([.hour, .minute, .second], from: .now)
    return calendar.date(
      bySettingHour: time.hour ?? 0, minute: time.minute ?? 0, second: time.second ?? 0, of: today) ?? today
  }

  private static func event(
    _ id: String, _ title: String, _ start: Date, _ end: Date, _ initials: String
  ) -> CalendarEvent {
    CalendarEvent(id: id, title: title, start: start, end: end, isAllDay: false, organizerInitials: initials)
  }

  private static func message(from sender: ChatParticipant?, _ date: Date, _ text: String) -> ChatMessage {
    ChatMessage(sender: sender, date: date, content: .text(text))
  }
}
