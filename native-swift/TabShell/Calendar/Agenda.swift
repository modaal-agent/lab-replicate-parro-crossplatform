import Foundation

/// A day the agenda lists: today, or a day with at least one event.
struct AgendaDay: Identifiable {
  let date: Date
  let events: [CalendarEvent]
  var id: Date { date }
}

struct AgendaWeek: Identifiable {
  let monthStart: Date
  let start: Date
  let days: [AgendaDay]
  var id: String { "\(monthStart.timeIntervalSince1970)-\(start.timeIntervalSince1970)" }
}

struct AgendaMonth: Identifiable {
  let start: Date
  let weeks: [AgendaWeek]
  var id: Date { start }
}

/// Groups the fixture's events by month and by week, as the agenda in `IMG_0211.PNG` does.
enum Agenda {
  static func months(events: [CalendarEvent], today: Date, calendar: Calendar = Fixture.calendar) -> [AgendaMonth] {
    var eventsByDay: [Date: [CalendarEvent]] = [calendar.startOfDay(for: today): []]
    for event in events {
      eventsByDay[calendar.startOfDay(for: event.start), default: []].append(event)
    }
    let days = eventsByDay.keys.sorted().map { date in
      AgendaDay(date: date, events: eventsByDay[date, default: []].sorted { $0.start < $1.start })
    }
    let daysByMonth = Dictionary(grouping: days) { calendar.dateInterval(of: .month, for: $0.date)!.start }
    return daysByMonth.keys.sorted().map { monthStart in
      let daysByWeek = Dictionary(grouping: daysByMonth[monthStart, default: []]) {
        calendar.dateInterval(of: .weekOfYear, for: $0.date)!.start
      }
      let weeks = daysByWeek.keys.sorted().map { weekStart in
        AgendaWeek(monthStart: monthStart, start: weekStart, days: daysByWeek[weekStart, default: []])
      }
      return AgendaMonth(start: monthStart, weeks: weeks)
    }
  }

  /// The Monday of every week from the week holding `first` to the week holding `last`.
  static func weekStarts(from first: Date, through last: Date, calendar: Calendar = Fixture.calendar) -> [Date] {
    guard var week = calendar.dateInterval(of: .weekOfYear, for: first)?.start else { return [] }
    var weeks: [Date] = []
    while week <= last {
      weeks.append(week)
      week = calendar.date(byAdding: .weekOfYear, value: 1, to: week)!
    }
    return weeks
  }

  /// "Week 38 · Sep 14 – 20"
  static func weekTitle(_ weekStart: Date, calendar: Calendar = Fixture.calendar) -> String {
    let number = calendar.component(.weekOfYear, from: weekStart)
    let end = calendar.date(byAdding: .day, value: 6, to: weekStart)!
    let range = (weekStart..<end).formatted(.interval.month(.abbreviated).day())
    return "Week \(number) · \(range)"
  }
}
