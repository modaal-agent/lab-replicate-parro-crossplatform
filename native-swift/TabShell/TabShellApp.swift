import SwiftUI

@main
struct TabShellApp: App {
  @State private var model = ShellModel()

  var body: some Scene {
    WindowGroup {
      RootTabView()
        .environment(model)
    }
  }
}
