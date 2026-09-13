import SwiftUI

/// The Monday-to-Sunday strip at the top of `IMG_0211.PNG`, paging one week at a time.
struct WeekStrip: View {
  @Binding var selectedDay: Date
  let today: Date
  let eventDays: Set<Date>
  let weeks: [Date]
  let onSelect: (Date) -> Void
  @State private var visibleWeek: Date?

  private let calendar = Fixture.calendar

  init(
    selectedDay: Binding<Date>, today: Date, eventDays: Set<Date>, weeks: [Date],
    onSelect: @escaping (Date) -> Void
  ) {
    _selectedDay = selectedDay
    self.today = today
    self.eventDays = eventDays
    self.weeks = weeks
    self.onSelect = onSelect
    _visibleWeek = State(initialValue: Fixture.calendar.dateInterval(of: .weekOfYear, for: selectedDay.wrappedValue)?.start)
  }

  var body: some View {
    VStack(spacing: 6) {
      Text(monthOfVisibleWeek, format: .dateTime.month(.wide))
        .font(.headline)
      ScrollView(.horizontal) {
        LazyHStack(spacing: 0) {
          ForEach(weeks, id: \.self) { week in
            HStack(spacing: 0) {
              ForEach(0..<7, id: \.self) { offset in
                dayButton(calendar.date(byAdding: .day, value: offset, to: week)!)
              }
            }
            .padding(.horizontal, 8)
            .containerRelativeFrame(.horizontal)
          }
        }
        .scrollTargetLayout()
      }
      .scrollTargetBehavior(.paging)
      .scrollIndicators(.hidden)
      .scrollPosition(id: $visibleWeek)
      // A horizontal scroll view takes all the height it is offered; the bar needs the row's height.
      .frame(height: 76)
    }
    .padding(.vertical, 6)
    // The hard scroll edge effect is translucent; the agenda showed through the day numbers.
    .background(.background)
    .onChange(of: selectedDay) {
      withAnimation(.snappy) {
        visibleWeek = calendar.dateInterval(of: .weekOfYear, for: selectedDay)?.start
      }
    }
  }

  /// The month of the visible week's Thursday, so a week spanning two months takes the month most of it lies in.
  private var monthOfVisibleWeek: Date {
    let week = visibleWeek ?? weeks.first ?? today
    return calendar.date(byAdding: .day, value: 3, to: week)!
  }

  private func dayButton(_ day: Date) -> some View {
    let isSelected = calendar.isDate(day, inSameDayAs: selectedDay)
    let isToday = calendar.isDate(day, inSameDayAs: today)
    let isWeekend = calendar.isDateInWeekend(day)
    let hasEvents = eventDays.contains(calendar.startOfDay(for: day))

    return Button {
      onSelect(day)
    } label: {
      VStack(spacing: 4) {
        Text(day, format: .dateTime.weekday(.abbreviated))
          .font(.caption)
          .foregroundStyle(isWeekend ? Color.secondary : Color.primary)
        Text(day, format: .dateTime.day())
          .font(.title3.weight(isToday || isSelected ? .semibold : .regular))
          .foregroundStyle(isSelected ? Color.white : isToday ? Color.accentColor : isWeekend ? Color.secondary : Color.primary)
          .frame(width: 40, height: 40)
          .background {
            if isSelected {
              Circle().fill(isToday ? Color.accentColor : Color.primary)
            }
          }
        Circle()
          .fill(hasEvents ? Color.secondary : Color.clear)
          .frame(width: 5, height: 5)
      }
      .frame(maxWidth: .infinity)
      .contentShape(.rect)
    }
    .buttonStyle(.plain)
    .accessibilityLabel(day.formatted(date: .complete, time: .omitted))
    .accessibilityAddTraits(isSelected ? .isSelected : [])
  }
}
