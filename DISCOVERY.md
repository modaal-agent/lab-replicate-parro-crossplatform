# Discovery log

Observations, measurements, side effects, sources and decisions, in the order they happened. The
rules for this file are in [AGENTS.md](AGENTS.md) §"DISCOVERY.md is an append-only log": new entries
go at the end, and an existing entry is never edited.

---

## 2026-09-13 — Repository seeded (`d8c8f44`)

- README.md, AGENTS.md/CLAUDE.md, `.gitignore` and `.github/workflows/ci.yml` were adapted from the
  `modaal-agent-skills` repository. Left out: the skill rules and `scripts/check-skills.sh`,
  `.claude-plugin/`, the pull-request rules, CONTRIBUTING.md, SECURITY.md and LICENSE.
- `ci.yml` keeps only the `rules` job (`cmp AGENTS.md CLAUDE.md`).
- `_assets/IMG_0210.PNG` … `IMG_0213.PNG` were committed. They show a real school name and a child's
  first name. AGENTS.md §"Two builds of one shell" keeps those names out of every other file; the
  images themselves need replacing or blurring before the repository is pushed to a public remote.
- `ionic-capacitor/` and `native-swift/` were empty directories, so git does not track them.

## 2026-09-13 — `ArrangementView` and the iPad split-view idioms

- Question asked: does SwiftUI use `ArrangementView` to open master-detail pages, and is there an
  iPad split-view idiom already supported?
- `ArrangementView` is described in Apple tech talk 111463: a primary and a secondary view,
  `.arrangementViewStyle(.split)` or `.overlay`, system arrangements from iOS 27.1, no navigation
  infrastructure, and "avoid putting navigation containers like NavigationSplitView inside one".
- `grep` over the SwiftUI, SwiftUICore and UIKit `arm64e-apple-ios.swiftinterface` files of the iOS
  26.5 SDK (Xcode 26.6) and the iOS 27.0 SDK (Xcode 27.0): `ArrangementView` is in neither.
  `NavigationSplitView` (iOS 16), `Tab` and `TabRole` (iOS 18), `.sidebarAdaptable` and
  `tabBarMinimizeBehavior` (iOS 26) are in both. `defaultTabBarPlacement(_:)` and `TabRole.prominent`
  are only in the iOS 27.0 SDK. Line numbers: spec 001 §1.4.
- Outcome: list and detail use `NavigationSplitView`; `ArrangementView` is tried in phase 5 on
  Calendar (spec 001 D3).
- `https://developer.apple.com/documentation/swiftui/arrangementview` returned HTTP 404.
- Apple's HIG page "Designing for iPhone Duo" returned only its title through WebFetch.
- WebFetch returns a model-written summary of a page, not its text. Quotes in spec 001 §1.5 came
  through that summary; the transcripts need re-reading before a phase depends on an exact spelling.
- Third-party articles name APIs and dates that no Apple page read on this date confirms:
  `onHingeChange`, `sceneAccessory`, `CameraCaptureAccessory`, and an October 23 ship date. Spec 001
  does not rely on them.

## 2026-09-13 — Toolchain on this machine

- Node 20.19.5 is installed. Capacitor 8 requires Node 22 or later (Capacitor 8 upgrade guide), so
  phase 2 starts with a Node upgrade.
- Two Xcodes: 26.6 (17F113, selected by `xcode-select`) and 27.0 (27A266a) at
  `/Volumes/DATA01/DISTR/Xcode/7882741C-…/Xcode.app`.
- Side effect: `xcrun simctl list devicetypes` run with Xcode 27.0's `DEVELOPER_DIR` installed
  CoreSimulator 1171.7 over 1169.1. To inspect an Xcode bundle without installing components, read
  the files inside the bundle instead of running `simctl` through it.
- No iPhone Duo simulator device type is installed. Apple's talk 111461 places the iPhone Duo
  simulator in Device Hub in Xcode 27.1.
- Capacitor 8's `npx cap add ios` creates a Swift Package Manager project by default.
- The XcodeGen reference, `modaal-agent/duet-tutorials` at `511b22b`, ignores `*.xcodeproj`
  (`.gitignore:10`) and generates the project from `tutorial3-start/src-ios/App/xcodegen.yml`.

## 2026-09-13 — Ionic and a Liquid Glass tab bar

- Ionic Framework 8.8's announcement states that no official Liquid Glass theme is planned. Ionic 9
  (announced 2026-08-19, 9.0.3 on npm) uses React Router 6 for `@ionic/react-router`.
- `ion-tab-bar` is HTML rendered in the web view.
- `alistairheath/stay-liquid` draws a native Liquid Glass tab bar over the web view. It installs from
  its GitHub URL, renders only the tab bar, had 48 stars, and its README does not mention an iPad
  sidebar.
- The tab bar in the screenshots is flat and full-width. A system SwiftUI `TabView` built with the
  iOS 26 SDK draws the floating Liquid Glass bar, so the two differ (spec 001 D8).

## 2026-09-13 — Sources read for spec 001

"Fetched" means read with WebFetch (a summary of the page). "Search result" means seen only in a web
search result summary.

| source | read | what was taken from it |
| --- | --- | --- |
| [Get Ready for iPhone Duo](https://developer.apple.com/iphone-duo/) | fetched | Xcode 27.1 beta and "Preparing your app for iPhone Duo" listed as "coming later this month"; links to talks 111461–111466 |
| [Prepare your app for iPhone Duo (111461)](https://developer.apple.com/videos/play/tech-talks/111461/) | fetched | inner display regular in both size classes, ignores supported orientations; containers "fully adaptive across every pose"; `defaultTabBarPlacement(.sidebar)`; vertical bars with the iOS 27.1 SDK; Device Hub simulator in Xcode 27.1 |
| [Raise the bar with iPhone Duo (111462)](https://developer.apple.com/videos/play/tech-talks/111462/) | fetched | bars on a vertical axis; `toolbarVerticalCompressionBehavior(.prefersToolbarItems)`; `toolbarVerticalBehavior(.disabled)` |
| [Strike a pose with adaptive layouts on iPhone Duo (111463)](https://developer.apple.com/videos/play/tech-talks/111463/) | fetched | `ArrangementView`, `.split`/`.overlay`, `UIArrangementViewController`, iOS 27.1, reserved regions `.division` and `.occlusion`, do not nest `NavigationSplitView` |
| [Leverage multiple displays and scenes (111464)](https://developer.apple.com/videos/play/tech-talks/111464/), [camera (111465)](https://developer.apple.com/videos/play/tech-talks/111465/), [Design for iPhone Duo (111466)](https://developer.apple.com/videos/play/tech-talks/111466/) | search result | not read |
| [HIG: Designing for iPhone Duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo) | fetched | title only |
| [WWDC25: Build a SwiftUI app with the new design](https://developer.apple.com/videos/play/wwdc2025/323/) | search result | standard bars take Liquid Glass when built with the iOS 26 SDK |
| [Capacitor: Updating to 8.0](https://capacitorjs.com/docs/updating/8-0) | fetched | Xcode 26.0+, Node 22+, iOS deployment target 15.0, SPM default, `--packagemanager CocoaPods` |
| [Capacitor: Swift Package Manager](https://capacitorjs.com/docs/ios/spm) | fetched | SPM selectable since Capacitor 6, `npx cap add ios --packagemanager SPM` |
| [Announcing Ionic Framework 9](https://ionic.io/blog/announcing-ionic-framework-9) | fetched | 2026-08-19; React 18+ with React Router 6; Vue 3.5+ with Vue Router 5; Angular 18–22 |
| [Announcing Ionic Framework 8.8](https://ionic.io/blog/announcing-ionic-framework-8-8) | search result | no official Liquid Glass theme planned |
| [ion-split-pane](https://ionicframework.com/docs/api/split-pane) | fetched | `when` default `(min-width: 992px)`; `xs`–`xl` breakpoints; `contentId` |
| [ionic start](https://ionicframework.com/docs/cli/commands/start) | fetched | command syntax, `--type`, `tabs` template, `--capacitor` |
| [alistairheath/stay-liquid](https://github.com/alistairheath/stay-liquid) | fetched | native tab bar over the web view; GitHub-URL install; iOS 26+; 48 stars |
| [dev.to: iPhone Duo for iOS Developers](https://dev.to/arshtechpro/iphone-duo-for-ios-developers-what-actually-changes-in-your-swift-code-5gc5) | fetched | third party; API names cross-checked against Apple's talks, the rest not relied on |
| [Swift with Majid: SwiftUI after WWDC26](https://swiftwithmajid.com/2026/06/08/what-is-new-in-swiftui-after-wwdc26/) | fetched | `Tab(…, role: .prominent)`; no mention of `ArrangementView` |
| [Exploring tab bars on iOS 26 with Liquid Glass](https://www.donnywals.com/exploring-tab-bars-on-ios-26-with-liquid-glass/), [blakecrosley.com: iPhone Duo for Developers](https://blakecrosley.com/blog/iphone-duo-for-developers), [byteiota: iPhone Duo layout fixes](https://byteiota.com/iphone-duo-ios-developer-layout-fixes/), [Capawesome: upgrade to Capacitor 8](https://capawesome.io/blog/how-to-upgrade-your-capacitor-app-to-capacitor-8/) | search result | third party; not relied on |
| SDK `arm64e-apple-ios.swiftinterface` files in Xcode 26.6 and Xcode 27.0 | `grep` | API presence, `@available` lines, line numbers (spec 001 §1.4) |
| `modaal-agent/duet-tutorials` at `511b22b`, `tutorial3-start/src-ios/App/` | read | `xcodegen.yml` keys and line numbers (spec 001 §1.7) |

## 2026-09-13 — Plan moved from README.md into spec 001

- README.md §"Goal", §"The four screens", §"Scope" and §"What is compared" moved into
  `specs/001-four-tab-shells/spec.md`. README.md keeps the goal paragraph and the layout table.
- Spec 001 was written with decisions D1–D9 and open questions O1–O5.

## 2026-09-13 — Decisions confirmed and open questions answered

- From the user: D7 confirmed (system navigation bar). D9 changed to "Xcode 26.6 or Xcode 27 RC". The
  other decisions confirmed as written.
- O1: Ionic React. O2: dark mode in scope, as a separate step. O4: as recommended. O5: try a native
  tab bar in the Capacitor build, and measure and report its setup cost.
- O3 was first answered "None"; asked which reading was meant, the user answered: "Initial state: no
  chats. '+' adds a chat (three prepopulated fixtures, rotating)".
- Recorded in spec 001 as the addition §10, with a pointer line under each superseded section.

## 2026-09-13 — Machine changes since the first toolchain read

- macOS is 26.6.2 (25G83); the first read the same day gave 26.5.1 (25F80). `sw_vers`.
- The Xcode 27.0 build 27A266a is at `/Volumes/DATA01/DISTR/Xcode/Xcode_27_RC.app`; `mdfind` no longer
  finds the `7882741C-…` path. `xcode-select -p` still names Xcode 26.6.
- In the 27.0 RC SDK, `grep` finds `defaultTabBarPlacement(_:)` at SwiftUI `.swiftinterface:31224` and
  no match for `ArrangementView`, `arrangementViewStyle`, `reservedRegions`, `ReservedRegion` or
  `UIArrangementViewController`.
- No `.simdevicetype` matching "Duo" or "Fold" under either Xcode's `Contents/Developer/Platforms` or
  in `/Library/Developer/CoreSimulator/Profiles/DeviceTypes`. Read with `find` and `ls`, not `simctl`.
