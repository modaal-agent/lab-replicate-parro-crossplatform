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

## 2026-09-13 — Phase 1 committed; chat detail screen requested

- From the user, answering "Commit?": "Please commit." Committed as `f88d70e`, 27 files. The question
  whether to include the seven screenshots got no separate answer; they were part of the proposed
  commit and went in.
- O6 (spec 001 §10.7) has no answer yet.
- From the user, next: "add one screen and a fixture for the chat details screen - with corresponding
  fixtures. Messages come in bubbles. Iterate on the chat screen until the UI is high fidelity.
  Record screenshots." No reference screenshot shows a conversation (spec 001 §1.2). Recorded in
  spec 001 as §12.
- iOS 26.5 SDK, `arm64-apple-ios-simulator.swiftinterface`, `@available` lines not read:
  `defaultScrollAnchor(_:)` SwiftUI `:11576`, `scrollDismissesKeyboard(_:)` SwiftUI `:11856`,
  `toolbar(_:for:)` SwiftUI `:9564`, `scrollPosition(_:anchor:)` SwiftUI `:21433`,
  `Glass.interactive(_:)` SwiftUICore `:5764`, `UnevenRoundedRectangle` SwiftUICore `:10241`,
  `GlassEffectContainer` SwiftUICore `:9045`.

## 2026-09-13 — Chat detail: iterating in the simulator

- **Method:** a second script in the session scratchpad (not committed), built like the phase 1
  script. It finds a chat row by the prefix of its accessibility label in `axe describe-ui` output,
  adds the three chats, opens each one, types and sends. Five rounds, c1 to c5, in
  `iPhone 16 (iOS 26.5)` with Xcode 26.6.
- **c1:** the tab bar is hidden in the conversation, a conversation shorter than the screen sits at
  the bottom, and returning to the list clears the unread dots of the chats that were opened.
- **Each round, what the screenshots showed and the change that followed:**

  | round | what the screenshots showed | change |
  | --- | --- | --- |
  | c1 | a tail whose curve started inside the bubble's rounded corner drew as a flat sliver below the corner; the outgoing tail tip sat about 7 pt from the screen edge | the tail runs down the bubble's side edge, fills the corner, and has a notch beside the tip; side padding 14 pt (c2) |
  | c1 | `axe tap --label Message` matched nothing: `axe describe-ui` gives the composer's `TextField` no `AXLabel`, and its placeholder "Message" as `AXValue` | the script taps the field at (227, 788) pt |
  | c2 | `axe type "…" --udid …` exited 0 and entered no text while the software keyboard was on screen | the script taps the keyboard's keys at their accessibility frames: letter keys are labelled in upper case, the space bar " " (c3) |
  | c3 | with the keyboard up, bubbles scrolled under the navigation bar showed through the title and subtitle | `.scrollEdgeEffectStyle(.hard, for: .top)` on the conversation (c4) |
  | c3 | messages sent at 21:24 appeared below a status bar overridden to 9:41 | the chat script overrides the status bar clock with the current time (c4) |
  | c3, c4 | the first tapped letter arrived in lower case while the keyboard showed upper-case keys; waiting 2.5 s after focusing the field made no difference | typed messages start with "I ", which autocorrect capitalises (c5) |

- `axe describe-ui` lists the keyboard's "Next keyboard" key with the value "Nederlands": a Dutch
  keyboard is installed in the simulator besides English.
- **Results:** spec 001 §12.4.

## 2026-09-13 — Chat round committed; O6 answered with two styling variants

- From the user: "Please commit the current round." Committed as `b28c7d2`, 15 files. The question
  whether to keep D10 and D11 (spec 001 §12.3) got no separate answer; both were part of the commit.
- From the user, answering O6 (spec 001 §10.7): "I'd like to actually build two variants of the
  styling in the Capacitor app - one close to the reference screenshots (or, rather, any
  standard/default/plain/simple style/template that you'd get by following some standard predefined
  path/component library, just apply the color scheme), and another as close to the native Swift ones
  as possible. If the two variants varrant architectural differences - please record the costs, and
  plan two passes on the Capacitor app - spec work." Recorded in spec 001 as §13.
- **Sources read for spec 001 §13:**

  | source | how it was read | what was taken |
  | --- | --- | --- |
  | `npm view <package> version` under Node 24.21.0 for `@ionic/core`, `@ionic/react`, `@ionic/react-router`, `@ionic/cli`, `@capacitor/core`, `@capacitor/ios`, `@capacitor/keyboard` | command | 9.0.3, 9.0.3, 9.0.3, 7.2.1, 8.5.2, 8.5.2, 8.0.5; the Ionic and Capacitor versions in spec 001 §1.3 are unchanged |
  | `npm search --json "ionic liquid glass"` | command | `@rdlabo/*` does not appear; `@capgo/capacitor-native-navigation` 8.3.1 does; `liquid-glass-web-react` 0.1.1, `@samasante/liquid-glass` 0.1.1 and `simple-liquid-glass` 5.3.0 describe DOM or WebGL refraction for React (read no further than the description) |
  | [Ionic Framework 9 announcement](https://ionic.io/blog/announcing-ionic-framework-9) | fetched, WebFetch summary | no change to theming, modes, the tab bar, the toolbar or Liquid Glass is listed |
  | [Ionic docs, Colors](https://ionicframework.com/docs/theming/colors) | fetched, WebFetch summary | the six variables of a colour; the Color Generator |
  | [Ionic docs, React Navigation](https://ionicframework.com/docs/react/navigation) | fetched, WebFetch summary | a tab's further routes are sibling routes with the tab as prefix; no description of hiding the tab bar; a modal suggested for content shared between tabs |
  | [`ion-header`](https://ionicframework.com/docs/api/header), [`ion-tab-bar`](https://ionicframework.com/docs/api/tab-bar), [`ion-textarea`](https://ionicframework.com/docs/api/textarea) | fetched, WebFetch summary | `collapse="condense"` is iOS only; `ion-header` has no custom properties or shadow parts; `ion-tab-bar` has `--background`, `--border`, `--color` and no shadow parts; `autoGrow` |
  | [Ionic docs, Components](https://ionicframework.com/docs/components) | fetched, WebFetch summary | the component list; no chat, message or bubble component |
  | `github.com/ionic-team/starters/tree/main/react-vite/official/tabs` | fetched | the page returned a loading error and no file tree; replaced by the next row |
  | `gh api` on `repos/ionic-team/starters`: the tree, `react-vite/official/tabs/src/App.tsx`, `pages/Tab1.tsx`, `components/ExploreContainer.tsx`, `react-vite/base/src/theme/variables.css`, `base/package.json`, `base/src/main.tsx` | command | spec 001 §13.2 "Tabs starter"; the last commit on the tabs path is `5acc9da`, 2026-08-19; `base/` has no `capacitor.config.ts` |
  | `npm pack @ionic/core@9.0.3` in the session scratchpad | command | `tabs.css`, `tab-bar.ios.css`; `grep -ril "liquid\|glass"` over `dist/collection` prints nothing |
  | WebSearch "Ionic Framework Liquid Glass theme iOS 26 community theme ion-tab-bar" | search result | `@rdlabo/ionic-theme-ios26`, `rdlabo-dev/ionic-theme-ios27`, and a Medium article by the theme's author (not fetched) |
  | `github.com/rdlabo-team/ionic-theme-ios26` | fetched, WebFetch summary | the page served the iOS 27 README of `rdlabo-dev/ionic-theme-ios27`: CSS imports, animation options, "Requires @ionic/core 8.8.1 or later (Ionic 8 and 9)" |
  | [`rdlabo-dev/ionic-theme-ios27`](https://github.com/rdlabo-dev/ionic-theme-ios27) | fetched, WebFetch summary | the iOS 26 theme lives on branch `ios26`; "All versions before 1.0.0 are release candidates (RC)." |
  | `gh api "repos/rdlabo-dev/ionic-theme-ios27/readme?ref=ios26"` and the branch heads | command | the iOS 26 README: install, imports, `setupIonicReact` options, `ion-item-group` markup, dark mode files; `ios26` at `f187d7f` (2026-09-10), `main` at `1932f29` (2026-09-13) |
  | `npm view` and `npm pack @rdlabo/ionic-theme-ios26@9.2.0`; its bundled `docs/features.md`, `docs/experimental-animation.md`, `docs/ios-18.md` and `dist/index.d.ts` | command | peer range, licence, file list, `ion-*` selectors per CSS file, `backdrop-filter` values, exports, the Sass mixin, the experimental tab bar effect |
  | [Theme docs, Special markup](https://docs.rdlabo.dev/projects/ionic-theme-ios26/docs/special-markup) | fetched, WebFetch summary | opt-in classes `.segment-expand`, `.searchbar-classic`, `.toolbar-searchbar`, `.ios-theme-disabled`; two-line items from `ion-label` beside `ion-note` |
  | WebSearch "Safari WebKit backdrop-filter url() SVG filter support displacement liquid glass" | search result | a third-party summary states that `backdrop-filter` runs an SVG displacement filter only in Chromium, and that Safari and Firefox fall back to a flat blur |
  | [WebKit bug 245510](https://bugs.webkit.org/show_bug.cgi?id=245510) | fetched, WebFetch summary | status NEW, last modified 2026-09-05, pull requests 68613, 68614 and 69566 uploaded |
  | [`Cap-go/capacitor-native-navigation`](https://github.com/Cap-go/capacitor-native-navigation) README | fetched, WebFetch summary | UIKit navigation and tab bars; events; "Your router still owns route state and page rendering."; no Ionic-specific integration mentioned |
  | `npm view @capgo/capacitor-native-navigation`; `gh api repos/<repo>` for `rdlabo-team/ionic-theme-ios26`, `rdlabo-dev/ionic-theme-ios27`, `alistairheath/stay-liquid`, `Cap-go/capacitor-native-navigation` | command | versions, licences, stars, last push dates in spec 001 §13.2 |

- `gh api repos/rdlabo-team/ionic-theme-ios26` returns `full_name` `rdlabo-dev/ionic-theme-ios27`, and
  `npm view @rdlabo/ionic-theme-ios26 repository.url` names the same repository.
- In `ionic-theme-ios26.css`, `grep -o <name> | wc -l` prints 0 for `ion-chip`, `ion-avatar` and
  `ion-badge`, 15 for `ion-textarea` and 10 for `ion-fab-button`.
- `native-swift/xcodegen.yml:39` sets `PRODUCT_BUNDLE_IDENTIFIER: dev.modaal.lab.tabshell`, the
  identifier D1 gives both builds. Spec 001 §13.9 O8 proposes separate identifiers.
- `npm pack` added the `@ionic/core` 9.0.3 and `@rdlabo/ionic-theme-ios26` 9.2.0 tarballs to npm's
  cache under `~/.npm`. Nothing was written under `ionic-capacitor/`.

## 2026-09-13 — O7 and O8 answered; spec work committed

- From the user, answering O7 (spec 001 §13.9, which variants phases 4, 6 and 7 cover): "agree (both
  variants for 4 (wide layout) and 6 (dark mode), and only matched for 7 (native tab bar))".
- From the user, answering O8 (spec 001 §13.9, bundle identifiers): "agree to use distinct bundle IDs
  for capactor app variants". The identifiers proposed in §13.9, `dev.modaal.lab.tabshell.stock` and
  `dev.modaal.lab.tabshell.matched`, got no objection and are recorded as the answer.
- From the user: "Please resolve open questions and commit the spec work." Both answers are recorded
  in spec 001 §13.10. Spec 001 now has no open question. The §13 spec work is committed together with
  this entry.

## 2026-09-13 — Pass 2a: building `stock` in `ionic-capacitor/`

- From the user: "Please take 2a (stock) now." Spec 001 §13.7, pass 2a. The spec work was committed as
  `445751c`. Results: spec 001 §14.
- **Creating the project:**
  - `npx --yes @ionic/cli@7.2.1 start --help` lists `--project-id` ("used for the directory name and
    package name") and `--package-id` ("the bundle ID/application ID for your app").
  - `npx --yes @ionic/cli@7.2.1 start TabShell tabs --type=react --capacitor
    --project-id=ionic-capacitor --package-id=dev.modaal.lab.tabshell.stock --no-git
    --no-interactive` took 52.32 s real. Its `npm i` printed "10 vulnerabilities (8 moderate, 2 high)"
    and "3 packages have install scripts not yet covered by allowScripts": `core-js@3.50.0`,
    `cypress@13.17.0`, `fsevents@2.3.3`.
  - `capacitor.config.ts` got `appId: 'dev.modaal.lab.tabshell.stock'`, `appName: 'TabShell'` and
    `webDir: 'dist'`.
  - **Side effect:** `ionic start` created `~/.ionic/config.json` with `"telemetry": true`.
    `~/.capacitor` does not exist after `cap add` and `cap sync`.
  - `grep -rn "@capacitor" src` printed nothing. The starter's plugins `@capacitor/app`,
    `@capacitor/haptics`, `@capacitor/keyboard` and `@capacitor/status-bar` were uninstalled.
    `@capacitor/keyboard` was installed again after round r3.
  - `npx cap add ios` printed "[error] Could not find the ios platform. You must install it in your
    project first, e.g. w/ npm install @capacitor/ios". After `npm install @capacitor/ios@8.5.2` it
    added the platform.
  - The template project has `TARGETED_DEVICE_FAMILY = "1,2"` and `IPHONEOS_DEPLOYMENT_TARGET = 15.0`.
    `CapApp-SPM/Package.swift` takes `capacitor-swift-pm` from GitHub with `exact: "8.5.2"`.
  - The root `.gitignore:16`, `*.xcodeproj`, matched `ionic-capacitor/ios/App/App.xcodeproj`. After the
    negation line, `git check-ignore -v` on its `project.pbxproj` prints nothing.
  - The first `xcodebuild` of the app took 10.07 s real and succeeded.
- **Sources read:**

  | source | how it was read | what was taken |
  | --- | --- | --- |
  | `native-swift/TabShell/` Swift files: `Fixture.swift`, `ShellModel.swift`, `RootTabView.swift`, `HomeList.swift`, `Agenda.swift`, `CalendarList.swift`, `WeekStrip.swift`, `ChatList.swift`, `SettingsList.swift`, `PlaceholderDetail.swift`, `InitialsBadge.swift`, `MessageBubble.swift` | read | the fixture, model, rows, date rules and drawing, ported to TypeScript |
  | `gh api repos/ionic-team/ionic-docs/contents/src/components/page/theming/_utils/color.ts`, last commit on the file `07f9946` (2026-09-02) | command | `shade(weight = 0.12)` mixes in black, `tint(weight = 0.1)` mixes in white, `contrast()` picks black or white by contrast ratio |
  | `node_modules/@ionic/core/dist/collection/components/textarea/textarea.ios.css` | read | `--padding-start` and `--padding-end` apply to `.textarea-wrapper`; `:host` sets `--padding-start: 0px` |
  | `node_modules/@ionic/react/dist/types/components/index.d.ts` | read | `setupIonicReact: (config?: IonicConfig) => void`, with `IonicConfig` imported from `@ionic/core/components` |

- **AXe and the web view:**
  - `axe describe-ui --udid …` lists the `Application` element and four scroll bar sliders, and no web
    content.
  - `axe describe-ui --point x,y --udid …` returns the web element at that point:
    - `Link` for an `IonItem` with `routerLink`, labelled with its texts and `aria-label`s joined, for
      example "Group 6/7/8 B 1 unread Teacher JV";
    - `Button` for an `IonItem button`;
    - `CheckBox` for a `<button aria-pressed>`;
    - `TextArea` "Message" for the `IonTextarea`.
  - The session scratchpad's screenshot script therefore taps coordinates. It finds targets that move
    (the week strip's days, the Send button) by probing points in 6 pt steps.
  - After `xcrun simctl launch` with the native TabShell app in front, the status bar showed a
    "◀ TabShell" back link. Terminating both apps before the launch removed it.
- **Rounds** in `iPhone 16 (iOS 26.5)` with Xcode 26.6, what the screenshots showed and the change that
  followed:

  | round | what the screenshots or probes showed | change |
  | --- | --- | --- |
  | r1 | the chat list printed "9:41" while the agenda printed "09:15 – 09:40": `hour: 'numeric'` in `format`, and `formatRange` | `timeStyle: 'short'` (r2) |
  | r2 | selecting Wednesday 16 scrolled the whole page: the week strip, inside the large title's condensed header, left the screen with the title | a fixed `IonHeader` on Calendar with a two-line title and the strip as a second toolbar (r3) |
  | r2 | the composer's placeholder touched the field's border; the field ran to the screen edge; the header avatar touched the screen edge | selectors `ion-textarea.composer-field`, because Ionic's `:host` padding variables load after the app's CSS and won at equal specificity; `margin-inline-end`; a margin on the header avatar (r3, s1) |
  | r3 | without `@capacitor/keyboard`, focusing the composer scrolled the web view up and put the navigation bar under the status bar; only the keyboard's accessory bar (up, down, ✓) appeared, with no keys; key taps entered nothing | `npm install @capacitor/keyboard@8.0.5`, `npx cap sync ios` (k1) |
  | k1 | a caret in the field and no keyboard; `axe type "…"` exited 0 and entered nothing | — |
  | k2, k3 | text copied with `xcrun simctl pbcopy`; tapping the field showed an edit menu with Paste and AutoFill; `axe tap --label Paste` matched nothing (AXe lists the item as `GenericElement`); a coordinate tap on Paste entered nothing | — |
  | k4 | AppleScript clicked the Simulator app's I/O › Keyboard › Toggle Software Keyboard; `keys.py` then found the keys at y 964 pt, below the 852 pt screen | — |
  | k5 | the menu item Connect Hardware Keyboard read `AXMenuItemMarkChar` "✓"; after a click on it the mark still read "✓"; the keys moved to y 595 pt, and iOS's "Speed up your typing by sliding your finger across the letters to compose a word." sheet with Continue covered the keyboard | `axe tap --label Continue` (k7) |
  | k7 | key taps typed the message; Send was found at y 462 pt and sent it; "wednesday" stayed lower case, because Send was tapped before autocorrect committed "Wednesday" | a trailing space after the typed text; sending trims it (s1) |
  | s1 | the 15 screenshots spec 001 §14.3 lists | — |

- **Side effect on the machine:** the Simulator app's I/O › Keyboard menu was clicked twice, on Toggle
  Software Keyboard and on Connect Hardware Keyboard. Which of the two clicks brought the software
  keyboard up was not isolated. Afterwards the menu still showed Connect Hardware Keyboard checked.
- With `@capacitor/keyboard` installed (k5, s1 `group-typing`): the web view shrinks above the
  keyboard, the composer sits on it, the navigation bar stays in place, and Ionic hides the tab bar.
- `defaults read com.apple.iphonesimulator DevicePreferences` has no entry for
  `70D15E5B-3D95-4290-B3E9-970F68617BE8`.
- `npm audit --json`: 10 vulnerabilities, 8 moderate and 2 high. Not acted on.
- Measurements and fidelity: spec 001 §14.3 and §14.5.
- The user asked whether the table comparing `native-swift/` and `stock` build times and sizes was
  recorded; it was not, as a table. From the user: "Please append, and then comit." Spec 001 §14.3 takes
  the table, and pass 2a is committed together with this entry.
- The question whether to turn off Ionic CLI telemetry (`~/.ionic/config.json`) got no answer;
  telemetry stays on.
