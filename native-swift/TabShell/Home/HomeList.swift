import SwiftUI

enum HomeRoute: Hashable {
  case group(SchoolGroup.ID)
  case previousYears, reportAbsence, privacy, news
}

/// `IMG_0210.PNG`: the groups of this school year, the actions, and the news row.
struct HomeList: View {
  @Environment(ShellModel.self) private var model

  var body: some View {
    List {
      Section {
        ForEach(model.groups) { group in
          NavigationLink(value: HomeRoute.group(group.id)) {
            GroupRow(group: group)
          }
        }
        NavigationLink(value: HomeRoute.previousYears) {
          Label("Previous school years", systemImage: "clock.arrow.circlepath")
        }
      } header: {
        VStack(alignment: .leading, spacing: 2) {
          // `Color.primary`: a header's `.primary` resolves against the header's own secondary style.
          Text("Groups")
            .font(.title3.bold())
            .foregroundStyle(Color.primary)
          Text(Fixture.schoolYear)
            .font(.subheadline)
            .foregroundStyle(Color.secondary)
        }
        .textCase(nil)
      }

      Section {
        NavigationLink(value: HomeRoute.reportAbsence) {
          Label("Report absence", systemImage: "person.badge.clock")
        }
        NavigationLink(value: HomeRoute.privacy) {
          Label("Privacy preferences", systemImage: "hand.raised")
        }
        Button {
          withAnimation { model.markAllAsRead() }
        } label: {
          Label("Mark all as read", systemImage: "checkmark.circle")
        }
        .disabled(model.unreadCount == 0)
      }

      Section {
        NavigationLink(value: HomeRoute.news) {
          Label("Parro news", systemImage: "megaphone")
        }
      }
    }
    .navigationTitle("Home")
    .navigationSubtitle(Fixture.subtitle)
    .toolbar {
      ToolbarItem(placement: .topBarTrailing) {
        Button("Search", systemImage: "magnifyingglass") {}
      }
    }
    .navigationDestination(for: HomeRoute.self) { route in
      destination(for: route)
    }
  }

  @ViewBuilder
  private func destination(for route: HomeRoute) -> some View {
    switch route {
    case .group(let id):
      PlaceholderDetail(title: model.group(id: id)?.name ?? "Group", systemImage: "person.3")
    case .previousYears:
      PlaceholderDetail(title: "Previous school years", systemImage: "clock.arrow.circlepath")
    case .reportAbsence:
      PlaceholderDetail(title: "Report absence", systemImage: "person.badge.clock")
    case .privacy:
      PlaceholderDetail(title: "Privacy preferences", systemImage: "hand.raised")
    case .news:
      PlaceholderDetail(title: "Parro news", systemImage: "megaphone")
    }
  }
}

private struct GroupRow: View {
  let group: SchoolGroup

  var body: some View {
    HStack(spacing: 8) {
      Label {
        Text(group.name)
          .lineLimit(1)
      } icon: {
        Circle()
          .fill(group.color)
          .frame(width: 12, height: 12)
      }
      Spacer(minLength: 8)
      if group.unreadCount > 0 {
        Text(group.unreadCount, format: .number)
          .font(.footnote.weight(.semibold))
          .foregroundStyle(.white)
          .padding(.horizontal, 7)
          .frame(minWidth: 22, minHeight: 22)
          .background(.tint, in: .capsule)
          .accessibilityLabel("\(group.unreadCount) unread")
      }
      if let initials = group.teacherInitials {
        InitialsBadge(initials: initials)
      }
    }
  }
}
