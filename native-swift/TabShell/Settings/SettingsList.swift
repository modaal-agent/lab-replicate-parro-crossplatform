import SwiftUI

enum SettingsRoute: Hashable, Identifiable {
  case account, children, connectCalendar, notifications, reminders, pinCode, accessibility, language
  case whatsNew, downloads

  var id: Self { self }

  var title: String {
    switch self {
    case .account: "Account"
    case .children: "My children"
    case .connectCalendar: "Connect calendar"
    case .notifications: "Notifications"
    case .reminders: "Reminders"
    case .pinCode: "Pin code security"
    case .accessibility: "Accessibility"
    case .language: "Language"
    case .whatsNew: "What’s new?"
    case .downloads: "Download files"
    }
  }

  var subtitle: String? {
    switch self {
    case .whatsNew: "View all our new features"
    case .downloads: "Per school year and per group"
    default: nil
    }
  }

  var systemImage: String {
    switch self {
    case .account: "person.crop.circle.fill"
    case .children: "figure.2.and.child.holdinghands"
    case .connectCalendar: "calendar.badge.plus"
    case .notifications: "bell.badge.fill"
    case .reminders: "alarm.fill"
    case .pinCode: "lock.fill"
    case .accessibility: "accessibility"
    case .language: "globe"
    case .whatsNew: "sparkles"
    case .downloads: "arrow.down.doc.fill"
    }
  }

  var tileColor: Color {
    switch self {
    case .account: .gray
    case .children: .green
    case .connectCalendar: .orange
    case .notifications: .red
    case .reminders: .indigo
    case .pinCode: .green
    case .accessibility: .blue
    case .language: .teal
    case .whatsNew: .purple
    case .downloads: .blue
    }
  }
}

/// `IMG_0213.PNG`: the account and app settings, then what's new, downloads and support.
struct SettingsList: View {
  private static let general: [SettingsRoute] = [
    .account, .children, .connectCalendar, .notifications, .reminders, .pinCode, .accessibility, .language,
  ]
  private static let about: [SettingsRoute] = [.whatsNew, .downloads]

  var body: some View {
    List {
      Section {
        ForEach(Self.general) { route in
          link(to: route)
        }
      }

      Section {
        ForEach(Self.about) { route in
          link(to: route)
        }
        // Opens nothing in this shell (spec 001 §2.3).
        Button {} label: {
          HStack {
            SettingsLabel(title: "Parro support", systemImage: "questionmark", color: .accentColor)
            Spacer()
            Image(systemName: "arrow.up.forward")
              .font(.footnote.weight(.semibold))
              .foregroundStyle(.tertiary)
          }
          // A button label takes the tint; `Color.primary` makes `.primary` and `.tertiary` grey levels.
          .foregroundStyle(Color.primary)
        }
      }
    }
    .navigationTitle("Settings")
    .navigationSubtitle(Fixture.subtitle)
    .navigationDestination(for: SettingsRoute.self) { route in
      PlaceholderDetail(title: route.title, systemImage: route.systemImage)
    }
  }

  private func link(to route: SettingsRoute) -> some View {
    NavigationLink(value: route) {
      if route == .language {
        LabeledContent {
          Text("English")
        } label: {
          SettingsLabel(route: route)
        }
      } else {
        SettingsLabel(route: route)
      }
    }
  }
}

private struct SettingsLabel: View {
  let title: String
  var subtitle: String?
  let systemImage: String
  let color: Color

  init(title: String, subtitle: String? = nil, systemImage: String, color: Color) {
    self.title = title
    self.subtitle = subtitle
    self.systemImage = systemImage
    self.color = color
  }

  init(route: SettingsRoute) {
    self.init(title: route.title, subtitle: route.subtitle, systemImage: route.systemImage, color: route.tileColor)
  }

  var body: some View {
    Label {
      VStack(alignment: .leading, spacing: 2) {
        Text(title)
          .foregroundStyle(.primary)
        if let subtitle {
          Text(subtitle)
            .font(.subheadline)
            .foregroundStyle(.secondary)
        }
      }
    } icon: {
      Image(systemName: systemImage)
        .font(.system(size: 16, weight: .semibold))
        .foregroundStyle(.white)
        .frame(width: 30, height: 30)
        .background(color.gradient, in: .rect(cornerRadius: 7, style: .continuous))
    }
  }
}
