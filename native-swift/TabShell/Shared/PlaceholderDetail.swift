import SwiftUI

/// The page behind a row (spec 001 §2.3): the row's title and one line of placeholder text.
struct PlaceholderDetail: View {
  let title: String
  let systemImage: String

  var body: some View {
    ContentUnavailableView {
      Label(title, systemImage: systemImage)
    } description: {
      Text("Placeholder content for this page.")
    }
    .navigationTitle(title)
    .navigationBarTitleDisplayMode(.inline)
  }
}
