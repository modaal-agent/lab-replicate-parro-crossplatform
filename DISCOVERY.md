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

## 2026-09-13 — Node 24 installed; state before phase 1

- From the user: "I installed Node 24 via nvm, and uninstalled Brew node."
- `nvm ls`: v20.19.5 and v24.21.0 are installed, `lts/krypton -> v24.21.0`, and
  `default -> 20 (-> v20.19.5)`. A new interactive shell (`zsh -ic 'which node; node --version'`)
  still resolves `/Users/admin/.nvm/versions/node/v20.19.5/bin/node`, v20.19.5, npm 11.6.2. Phase 2
  runs `nvm use 24` first, unless the default alias is changed with `nvm alias default 24`.
- Under v24.21.0 (`nvm use 24`): npm 11.19.0; `npm ls -g --depth=0` lists only `corepack@0.36.0` and
  `npm@11.19.0`. The eleven global packages under v20.19.5 (among them `@openai/codex`,
  `firebase-tools`, `xcodebuildmcp`, `pnpm`) are not installed under v24.21.0.
- `brew list --versions node` exits 1, and `/opt/homebrew/bin/node` does not exist.
- The repository has no `.nvmrc` (`ls -a` at the root).
- Spec 001 §0 item 6 and §1.3 give Node 20.19.5, below Capacitor 8's "Node 22 or greater"; v24.21.0
  meets it. Recorded in spec 001 as §10.6.
- Git: branch `001-four-tab-shells` at `00a38f5`, working tree clean (`git status --short`).
- Unchanged since the entry "Machine changes since the first toolchain read": macOS 26.6.2 (25G83),
  Xcode 26.6 (17F113) selected, Swift 6.3.3, XcodeGen 2.45.4 (`sw_vers`, `xcode-select -p`,
  `xcodebuild -version`, `swift --version`, `xcodegen --version`).
- `xcrun simctl list runtimes` (Xcode 26.6): iOS 18.6 (22G86), iOS 26.5 (23F77), iOS 27.0 (24A434),
  watchOS 26.5 and 27.0. Spec 001 §1.3 listed two iOS 27.0 builds, 24A5370g and 24A5390f; one build,
  24A434, is listed now.
- From the user, on phase 1: "clear to implement phase 1. Please iterate on the UI extensively (run
  in the simulator, analyze screenshots) to achieve visually pleasing UI, potentially improving the
  reference - making it look like native iOS." Recorded in spec 001 as §10.7.

## 2026-09-13 — Phase 1 prerequisites read

- `xcrun simctl list devices available` (Xcode 26.6): every iPhone 16 simulator runs iOS 18.6. The
  iOS 26.5 runtime has iPhone 17, 17 Pro, 17 Pro Max, 17e, Air and six iPads. D4's deployment
  target, iOS 26.0, does not install on iOS 18.6, and spec 001 §5 takes fidelity screenshots in the
  iPhone 16 simulator (393 × 852 pt).
- `xcrun simctl list -j runtimes`: the iOS 26.5 runtime lists `iPhone 16` among its supported device
  types.
- Machine change: `xcrun simctl create "iPhone 16 (iOS 26.5)" com.apple.CoreSimulator.SimDeviceType.iPhone-16 com.apple.CoreSimulator.SimRuntime.iOS-26-5`
  with Xcode 26.6 created device `70D15E5B-3D95-4290-B3E9-970F68617BE8`.
- iOS 26.5 SDK, SwiftUI `arm64-apple-ios-simulator.swiftinterface` (the simulator file; §1.4 of spec
  001 read the `arm64e-apple-ios` file, so line numbers differ): `navigationSubtitle(_:)` at `:17637`,
  in an extension marked `@available(iOS 26.0, …)` at `:17632`. Spec 001 §3.3's fallback, the
  subtitle as the list's first row, is not needed.
- The same file declares, `@available` lines not read: `safeAreaBar(edge:alignment:spacing:content:)`
  `:16455`, `ButtonStyle.glassProminent` `:3265`, `ButtonStyle.glass` `:1208`, `ContentUnavailableView`
  `:16639`, `ToolbarSpacer` `:21574`, `scrollEdgeEffectStyle(_:for:)` `:11770`,
  `ToolbarTitleDisplayMode.inlineLarge` `:19694`, `scrollPosition(id:anchor:)` `:21438`.
- Colours sampled from `_assets/` with a CoreGraphics script run from the session scratchpad (not
  committed), at pixel coordinates of the 1179 × 2556 px files:

  | file | element | pixel | colour |
  | --- | --- | --- | --- |
  | `IMG_0210.PNG` | title text, Home tab icon | (240, 236), (130, 2345) | `#D13C63` |
  | `IMG_0211.PNG` | today circle | (1062, 612) | `#D13C63` |
  | `IMG_0212.PNG` | "+" button, chip border | (990, 2090), (50, 418) | `#D13C63` |
  | `IMG_0210.PNG` | header avatar background | (60, 225) | `#D6EAE1` |
  | `IMG_0210.PNG` | group dots | (83, 612), (83, 768) | `#E8436E`, `#C89409` |
  | `IMG_0210.PNG` | unread badge | (945, 769) | `#4C1138` |
  | `IMG_0210.PNG` | initials badge background | (1043, 736) | `#E8E2FC` |
  | `IMG_0210.PNG` | page background below the rows | (512, 1920) | `#EFEFEF` |
  | `IMG_0211.PNG` | event card background | (512, 1446) | `#DFD0DA` |
  | `IMG_0211.PNG` | "There are no events today" | (230, 1085) | `#5F1546` |
  | `IMG_0211.PNG` | week label | (205, 960) | `#6E6E6E` |

- The XcodeGen reference `modaal-agent/duet-tutorials` ignores the generated `Info.plist` as well as
  `*.xcodeproj` (`.gitignore:10`, `:13`), since `info.properties` in `xcodegen.yml` writes it.
- `xcodebuildmcp` 2.6.2, installed globally under Node 20.19.5, bundles AXe 1.7.1 at
  `…/node_modules/xcodebuildmcp/bundled/axe` (`axe --version`). It taps, swipes and reads the
  accessibility tree of a booted simulator. `which axe idb` finds neither on `PATH`.

## 2026-09-13 — Phase 1: iterating on `native-swift/` in the simulator

- Method: a script in the session scratchpad (not committed) runs `xcodegen generate`, `xcodebuild`
  with `-derivedDataPath` in the scratchpad, `xcrun simctl install` and `launch`, taps with AXe 1.7.1
  by accessibility label, and `xcrun simctl io … screenshot`. The status bar was fixed with
  `xcrun simctl status_bar … override --time "9:41" --batteryState charged --batteryLevel 100`. Six
  rounds of screenshots, v1 to v6, all in `iPhone 16 (iOS 26.5)`, 393 × 852 pt, built with Xcode 26.6.
- v1: the first launch on the new simulator showed a system "Ready for Apple Intelligence" banner
  over the navigation bar. It was gone by v2.
- `axe describe-ui`: the tab bar's items are `RadioButton` elements labelled "Home", "Calendar",
  "Chat", "Settings". `axe tap --label Calendar --element-type Button` matched nothing (v2).
- iOS 26.5 SDK behaviour seen in the screenshots, each with the change that fixed it:

  | round | what the screenshot showed | change |
  | --- | --- | --- |
  | v1 | `.foregroundStyle(.primary)` on a `Section` header's text drew it grey | `Color.primary` (v2): `.primary` resolves against the header's own secondary style |
  | v3 | a horizontal `ScrollView` inside `safeAreaBar(edge: .top)` took most of the screen height and pushed the agenda below the tab bar | `.frame(height: 76)` on the scroll view (v4) |
  | v3 | with `safeAreaBar(edge: .top)` over a scrolling list, the large title and subtitle were drawn faded, on Calendar and on Chat with rows; Chat's empty state, which does not scroll, drew them at full contrast | `.toolbarTitleDisplayMode(.inlineLarge)` on Calendar and Chat (v4) |
  | v3 | in a plain `List`, separators started at different x positions per row; an unread dot offset left of the avatar touched the screen edge | `.alignmentGuide(.listRowSeparatorLeading)` on the text column; `.listRowInsets` leading 30 (v4) |
  | v4 | `.foregroundStyle(.primary)` inside a `List` `Button` label drew "Parro support" in the accent tint | `.foregroundStyle(Color.primary)` on the label (v5) |
  | v4 | glass month pills as pinned `LazyVStack` section headers overlapped the week label below the bar | month pills not pinned (v5) |
  | v4 | chat times were fixed strings ("9:41 AM"); `Date` formatting of events showed 24-hour times ("13:30–16:00") | chat times stored as `Date` and formatted with the locale (v5) |
  | v5 | with `scrollEdgeEffectStyle(.hard, for: .top)` the scrolled agenda still showed through the week strip | `.background(.background)` on the strip (v6) |

- Spec 001 §3.1's build command, `-destination 'platform=iOS Simulator,name=iPhone 16'`, waited
  about 60 s and failed: "Unable to find a device matching the provided destination specifier". The
  only device named exactly "iPhone 16" runs iOS 18.6, below the 26.0 deployment target. The same
  run logged "IDERunDestination: Supported platforms for the buildables in the current scheme is
  empty."
- `AppIcon.png` was drawn by a Swift script in the session scratchpad (AppKit, not committed): SF
  Symbol `rectangle.split.2x1.fill` in white on a vertical gradient from `#E2557B` to `#B92B53`,
  1024 × 1024 px; `sips -g hasAlpha` reports `no`.

## 2026-09-13 — Phase 1 measurements

- `xcodebuild … -destination 'platform=iOS Simulator,name=iPhone 16 (iOS 26.5)' build` printed
  `iPhone 16 (iOS 26.5)` under "Available destinations", reported no matching device, and exited
  after 60.88 s real without building; the Release run did the same (60.65 s). The same builds with
  `id=70D15E5B-3D95-4290-B3E9-970F68617BE8` succeeded. Spec 001 §11.1 gives the working command.
- Clean builds with a new `-derivedDataPath`, timed with `/usr/bin/time -p`: Debug 6.47 s real,
  Release 4.31 s real. Their user and sys times (0.65 s and 0.25 s for Debug) cover only the
  `xcodebuild` process, so they do not measure the compile work.
- `du -sk` on the simulator products: Debug `.app` 1524 KiB, Release `.app` 1024 KiB. The Debug
  bundle holds `TabShell.debug.dylib` (1,290,688 bytes) and `__preview.dylib`; the Release bundle
  holds neither.
- Each build log has one line matching `warning:`, from `appintentsmetadataprocessor`.
- Values and the fidelity list: spec 001 §11.2 and §11.3.
