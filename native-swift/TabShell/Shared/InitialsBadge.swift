import SwiftUI

/// A teacher's initials, as on the group rows and event cards in `IMG_0210.PNG` and `IMG_0211.PNG`.
struct InitialsBadge: View {
  let initials: String

  var body: some View {
    Text(initials)
      .font(.caption.weight(.semibold))
      .foregroundStyle(Color(red: 0.33, green: 0.27, blue: 0.55))
      .frame(width: 32, height: 32)
      .background(Color(red: 0.910, green: 0.886, blue: 0.988), in: .rect(cornerRadius: 8, style: .continuous))
      .accessibilityLabel("Teacher \(initials)")
  }
}
