import SwiftUI

enum HomeRoute: Hashable {
  case group(SchoolGroup.ID)
  case previousYears, reportAbsence, privacy, news
}

/// `IMG_0210.PNG`: the groups of this school year, the actions, and the news row.
struct HomeList: View {
  @Binding var selection: HomeRoute?
  @Environment(ShellModel.self) private var model

  var body: some View {
    List(selection: $selection) {
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
        .foregroundStyle(.tint)
        .disabled(model.unreadCount == 0)
      }

      Section {
        NavigationLink(value: HomeRoute.news) {
          Label("Parro news", systemImage: "megaphone")
        }
      }
    }
    // A list with a selection draws its row icons and buttons in the primary colour.
    .labelStyle(TintedIconLabelStyle())
    .navigationTitle("Home")
    .navigationSubtitle(Fixture.subtitle)
    .toolbar {
      ToolbarItem(placement: .topBarTrailing) {
        Button("Search", systemImage: "magnifyingglass") {}
      }
    }
  }
}

/// The page a Home row opens, or, in the detail column before a row is selected, a prompt.
struct HomeDetail: View {
  let route: HomeRoute?
  @Environment(ShellModel.self) private var model

  var body: some View {
    switch route {
    case nil:
      ContentUnavailableView("Select a group or a page", systemImage: "house")
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

private struct TintedIconLabelStyle: LabelStyle {
  func makeBody(configuration: Configuration) -> some View {
    Label {
      configuration.title
    } icon: {
      configuration.icon.foregroundStyle(.tint)
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
