import SwiftUI

/// `IMG_0211.PNG`: a week strip above an agenda grouped by month and week.
struct CalendarList: View {
  @Binding var selection: CalendarEvent.ID?
  private let calendar = Fixture.calendar
  private let months = Agenda.months(events: Fixture.events, today: Fixture.today)
  private let weeks = Agenda.weekStarts(
    from: Fixture.today, through: Fixture.events.map(\.start).max() ?? Fixture.today)
  private let eventDays = Set(Fixture.events.map { Fixture.calendar.startOfDay(for: $0.start) })
  @State private var selectedDay = Fixture.today

  var body: some View {
    ScrollViewReader { proxy in
      ScrollView {
        LazyVStack(alignment: .leading, spacing: 0) {
          ForEach(months) { month in
            MonthPill(date: month.start)
            ForEach(month.weeks) { week in
              WeekSection(week: week, today: Fixture.today, selection: $selection)
            }
          }
        }
        .padding(.horizontal)
        .padding(.bottom, 24)
      }
      // The soft edge effect leaves the agenda readable through the week strip's day numbers.
      .scrollEdgeEffectStyle(.hard, for: .top)
      .safeAreaBar(edge: .top) {
        WeekStrip(selectedDay: $selectedDay, today: Fixture.today, eventDays: eventDays, weeks: weeks) { day in
          select(day, proxy: proxy)
        }
      }
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          Button("Today") {
            select(Fixture.today, proxy: proxy)
          }
        }
      }
    }
    .navigationTitle("Calendar")
    .navigationSubtitle(Fixture.subtitle)
    // A large title below the navigation bar is covered by the week strip's scroll edge effect.
    .toolbarTitleDisplayMode(.inlineLarge)
  }

  /// Selects `day` in the week strip and scrolls the agenda to it, or to the next day it lists.
  private func select(_ day: Date, proxy: ScrollViewProxy) {
    selectedDay = day
    let days = months.flatMap { $0.weeks.flatMap(\.days) }
    guard let target = days.first(where: { $0.date >= day }) ?? days.last else { return }
    withAnimation(.snappy) {
      proxy.scrollTo(target.id, anchor: .top)
    }
  }
}

private struct MonthPill: View {
  let date: Date

  var body: some View {
    Text(date, format: .dateTime.month(.wide))
      .font(.subheadline.weight(.semibold))
      .padding(.horizontal, 14)
      .padding(.vertical, 6)
      .glassEffect(.regular, in: .capsule)
      .frame(maxWidth: .infinity)
      .padding(.vertical, 8)
  }
}

/// The page an event card opens, or, in the detail column before a card is selected, a prompt.
struct EventDetail: View {
  let eventID: CalendarEvent.ID?

  var body: some View {
    if let event = Fixture.events.first(where: { $0.id == eventID }) {
      PlaceholderDetail(title: event.title, systemImage: "calendar")
    } else {
      ContentUnavailableView("Select an event", systemImage: "calendar")
    }
  }
}

private struct WeekSection: View {
  let week: AgendaWeek
  let today: Date
  @Binding var selection: CalendarEvent.ID?

  var body: some View {
    VStack(alignment: .leading, spacing: 10) {
      Text(Agenda.weekTitle(week.start))
        .font(.footnote.weight(.medium))
        .foregroundStyle(.secondary)
        .padding(.leading, 56)
      ForEach(week.days) { day in
        HStack(alignment: .top, spacing: 12) {
          DayLabel(date: day.date, isToday: Fixture.calendar.isDate(day.date, inSameDayAs: today))
          VStack(spacing: 8) {
            if day.events.isEmpty {
              Text("No events today")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 14)
                .frame(maxWidth: .infinity, minHeight: 52, alignment: .leading)
                .overlay {
                  RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .strokeBorder(.separator, style: StrokeStyle(lineWidth: 1, dash: [4, 3]))
                }
            }
            ForEach(day.events) { event in
              Button {
                selection = event.id
              } label: {
                EventCard(event: event, isSelected: selection == event.id)
              }
              .buttonStyle(.plain)
            }
          }
        }
        .id(day.id)
      }
    }
    .padding(.vertical, 10)
  }
}

private struct DayLabel: View {
  let date: Date
  let isToday: Bool

  var body: some View {
    VStack(spacing: 2) {
      Text(date, format: .dateTime.weekday(.abbreviated))
        .font(.caption.weight(.semibold))
        .foregroundStyle(isToday ? Color.accentColor : Color.secondary)
      Text(date, format: .dateTime.day())
        .font(.title3.weight(isToday ? .bold : .regular))
        .foregroundStyle(isToday ? Color.white : Color.primary)
        .frame(width: 36, height: 36)
        .background {
          if isToday {
            Circle().fill(.tint)
          }
        }
    }
    .frame(width: 44)
  }
}

private struct EventCard: View {
  let event: CalendarEvent
  let isSelected: Bool

  var body: some View {
    HStack(spacing: 12) {
      Capsule()
        .fill(.tint)
        .frame(width: 4)
      VStack(alignment: .leading, spacing: 2) {
        Text(event.title)
          .font(.headline)
          .lineLimit(2)
          .multilineTextAlignment(.leading)
        Group {
          if event.isAllDay {
            Text("All day")
          } else {
            Text(event.start..<event.end, format: .interval.hour().minute())
          }
        }
        .font(.subheadline)
        .foregroundStyle(.secondary)
      }
      Spacer(minLength: 8)
      InitialsBadge(initials: event.organizerInitials)
    }
    .padding(.vertical, 12)
    .padding(.leading, 10)
    .padding(.trailing, 12)
    .frame(maxWidth: .infinity, alignment: .leading)
    .background(.tint.opacity(isSelected ? 0.25 : 0.1), in: .rect(cornerRadius: 16, style: .continuous))
    .overlay {
      if isSelected {
        RoundedRectangle(cornerRadius: 16, style: .continuous)
          .strokeBorder(.tint, lineWidth: 2)
      }
    }
    .contentShape(.rect(cornerRadius: 16, style: .continuous))
    .accessibilityAddTraits(isSelected ? .isSelected : [])
  }
}
