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

## 2026-09-13 — Pass 2b: building `matched` in `ionic-capacitor/`

- From the user, after pass 2a was committed as `93ad230`: "Please take pass 2b when ready."
- `npm install @rdlabo/ionic-theme-ios26@9.2.0` took 1.65 s real. `npm ls --depth=0`, saved before and
  after in the session scratchpad, differs in one line: `@rdlabo/ionic-theme-ios26@9.2.0`.
- `npm view @rdlabo/ionic-theme-ios26@9.2.0`: peer dependency `@ionic/core >=8.8.1 <10`, unpacked size
  644,741 bytes, last modified 2026-09-10.
- **Sources read:**

  | source | how it was read | what was taken |
  | --- | --- | --- |
  | `node_modules/@rdlabo/ionic-theme-ios26/README.md` | read | the four CSS imports; the `setupIonicReact` animation options behind `isPlatform('ios')`; the pairing of Ionic's dark palette with the theme's dark stylesheet |
  | `…/docs/special-markup.md`, `using-ion-item-group.md`, `features.md`, `experimental-animation.md` | read | the `ios-theme-disabled` opt-out class; `ion-item-group` inside `ion-list inset`; the `api.glass-background` mixin; `registerTabBarEffect(tabBar)` and `destroy()` |
  | `…/src/styles/default-variables.scss`, `ionic-theme-ios26.scss`, `utils/api.scss`, `utils/translucent.scss`, `utils/structured-list.scss` | read | the glass values (72 % white, `blur(2px) saturate(360%)`, the two shadows); the content fade behind the tab bar; group radius 24 px |
  | `…/src/styles/components/ion-tabs.scss`, `ion-toolbar.scss`, `ion-list.scss`, `ion-fab.scss`, `ion-inputs.scss`, `ion-button.scss`, `ion-content.scss` | read | tab bar width `100% - 36px - 60px - 12px`, bottom `max(10px, safe area - 12px)`; toolbar `--min-height: 68px` except with a large title; item `--min-height: 52px`; FAB 61 px white glass; `ion-buttons` glass capsule; content bottom padding `60px + floating safe area` |
  | `…/dist/index.d.ts`, `dist/utils.d.ts` | read | the exported animations and `registerTabBarEffect` |
  | `node_modules/@ionic/core/dist/collection/components/item/item.js` | `grep part:` | `ion-item` parts `native`, `inner`, `container`, `detail-icon` |
  | `…/toolbar/toolbar.js`, `…/tab-bar/tab-bar.js`, `…/footer/footer.js` | read, `render()` | toolbar parts `background`, `container`, `content`; `tab-bar-hidden` while the keyboard is visible; `footer-toolbar-padding` only when no bottom `ion-tab-bar` exists and the keyboard is closed |
  | `…/title/title.ios.css`, `…/header/header.ios.css`, `…/item/item.ios.css`, `…/footer/footer.ios.css`, `…/textarea/textarea.ios.css` | read, `grep` | title padding 90 px, large title padding 2 px and 4 px; sticky condensed toolbars; slotted start margin 16 px; footer safe-area padding; `ion-textarea` `z-index: 2` |
  | `node_modules/@ionic/react/dist/index.js` | `grep IonTabBar` | `IonTabBar` passes its props, `className` included, to `ion-tab-bar` |
  | `node_modules/ionicons/icons/index.d.ts` | `grep` | `home`, `calendar`, `chatbubble`, `settings`, `help`, `arrowUpCircle` are exported |
  | `native-swift/TabShell/` Swift files: `RootTabView.swift`, `HomeList.swift`, `SettingsList.swift`, `ChatList.swift`, `ChatDetail.swift`, `MessageBubble.swift`, `CalendarList.swift`, `WeekStrip.swift`, `Agenda.swift`, `InitialsBadge.swift`, `PlaceholderDetail.swift`, `Fixture.swift` lines 58–72 | read | sizes, paddings and colours for `index.css`; `BubbleShape`'s horn path; the preview rule |
  | the installed `native-swift/` app in the group chat | `axe describe-ui` | the composer's "+" and text field frames |

- **Rounds** in `iPhone 16 (iOS 26.5)` with Xcode 26.6, compared with the `native-swift/` screenshots in copies
  scaled with `sips -Z 900`:

  | round | what the screenshots or probes showed | change |
  | --- | --- | --- |
  | m1 | the theme's glass tab bar, buttons and inset groups applied. Row icons in 36 px boxes: `ion-icon` sets `box-sizing: content-box !important`. The subtitle 20 pt below native's and 4 pt to the right. "School year" bold. The tab bar 5 pt wider than set. Calendar's and Chat's bars grey: `ion-tabs` has the `ion-page` class and holds the Home page, so `.ion-page:has(ion-list.list-inset)` matched it. The unread dot over the chat title. "+" 5 pt closer to the edge. Week titles close under the month capsule | icon sizes as content sizes; `!important` min-height on the subtitle toolbar; `font-weight: 400`; tab bar width `100% - 47px`; `ion-router-outlet >`; FAB `right: 25px`; week title padding |
  | m2 | icons in place; the subtitle still 20 pt low; no unread dots; the Sam preview on one line where native wraps it; the group avatar's icon small. Probing for "Group 6/7/8 B" and "Sam" in the chat list found nothing: the rows' accessibility labels start with the preview | temporary outlines on header toolbars and titles; the dot as a `radial-gradient` on `::part(native)`; label margin 8 px; avatar icon 26 px; fixed tap coordinates for the chat rows |
  | m3 | the outlines: the subtitle toolbar one line high, and the large title's box ending 20 px below its text. Tails drawn. Bubbles 8 pt wider than native's: `HStack(spacing: 8)` also spaces the bubble from the 60 pt spacer. A short conversation at the top of the page. Calendar positions within 3 px of native | subtitle toolbar `margin-top: -20px`, above the title toolbar, transparent background; `padding-right` and `padding-left` 68 px; `.message-list` `min-height: 100%` and `justify-content: flex-end`; outlines removed |
  | m4 | Home and Settings title, subtitle and first group within 2 px of native; bubbles break at the same words as native. The refraction page (spec 001 §15.4). Composer frames: "+" x 16, y 757; text x 84, y 768, 285 wide; `native-swift/`: "+" x 21, y 766; text x 94, y 777, 267 wide | toolbar `--padding-start: 21px`; field margin 12 px; the safe-area padding without the extra 8 px, which `--padding-bottom` already puts on the toolbar's container |
  | m5 | "+" at x 21, y 765; text 280 wide. The send button drawn under the field's glass, and probing at x 355 did not find it. The swipe at y 150 did not page the week strip, so Wednesday 9 was selected. Home unchanged with `registerTabBarEffect` | textarea `width: auto`; send button `position: relative`, margins adding up to zero; Calendar scroll offset by the week title in `matched` |
  | m5b | a swipe at y 187 paged the strip to week 38, and a second one to week 39; a swipe along the tab bar from Home to Settings selected Settings; `native-swift/`'s push screenshot, started 0.1 s after the tap, showed the finished push | the script swipes at y 187 |
  | m6 | text x 93, 268 wide. The send button still drawn under the field; with "Hi" typed, probes at x 345–365 returned the text area and x 375 returned Send (x 333, y 468, 33 × 32). The selected day stopped about 60 pt short of the top: the agenda ended 7 pt above the tab bar, native's 35 pt | send button `z-index: 3`, above `ion-textarea`'s `z-index: 2`; Calendar content bottom padding `94px + floating safe area` |
  | m7 | send drawn inside the field and tapped in both chats; week 38 at the top after selecting the 16th. A black Dynamic Island shape in `chat-group-typing` and `chat-list-after` (pixel 588, 88 black) | — |
  | r2b | `stock` rebuilt and its pass 2a script run again; compared with the committed screenshots in spec 001 §15.1 | — |
  | m8 | the script without a rebuild; 15 screenshots, pixel 588, 88 not black in any | copied to `specs/001-four-tab-shells/screenshots/` |

- Round m1's Home screenshot was taken with `xcrun simctl status_bar … override --time 9:41`; the chat
  screenshots of m5 to m8 use the time the script ran, as in pass 2a.
- `xcrun simctl list devices booted` at the start of the pass also listed `iPhone 18 Pro`
  (`F2DD4D68-FC30-4AC7-9774-7C55D6C7DD44`). This pass did not use it.
- **Side effects on the simulator:**
  - `dev.modaal.lab.tabshell.matched` is installed on `70D15E5B-3D95-4290-B3E9-970F68617BE8`.
  - `dev.modaal.lab.tabshell.refraction` was installed and uninstalled.
  - `ios/App/App/public/index.html`, ignored by `ios/.gitignore`, was replaced by the refraction page and
    restored with `npx cap copy ios`; `grep -c 'backdrop-filter url() check'` over it then printed 0.
- **Bundle files:** the theme's `dist/` has 20 `import … from '@ionic/core'` statements
  (`grep -rhoE "from ['\"]@ionic/[a-z/-]+['\"]"`). `matched`'s `dist/assets` has 202 files against
  `stock`'s 19 in `dist/`, among them 104 `*.entry` chunks of `@ionic/core`'s lazy-loading build,
  2108 KiB (`du -ck`). The modern `index-*.js` grows from 1,395.52 kB to 1,430.59 kB. Whether the web view
  requests any `.entry` chunk at runtime was not measured.
- **Machine load:** the first timing run gave a clean `stock` web build of 25.65 s real, against 3.31 s in
  pass 2a. `uptime` then read load averages 14.79, 17.56, 15.80, and `ps -Ao pcpu,comm -r` listed `rg` at
  721.5 % CPU, VS Code's `Code Helper (Renderer)` at 185.6 %, `java` at 117.6 % and `com.docker.backend`
  at 62.6 %. This session did not start those processes. The timings of that run are not used; spec 001
  §15.3 records the run taken after the one-minute load average fell below 4.
- Two user messages during the pass: "I installed ImageMagick from Homebrew", and "Also you can install PIL
  if you need to". `magick -version` prints ImageMagick 7.1.2-31. PIL was not installed. A Swift image
  comparison script written to the scratchpad before the first message was not used.
- `npx eslint src`: one warning, `react-refresh/only-export-components` at `src/model/ShellModel.tsx:97`, as
  in pass 2a. `npx vitest run`: 1 of 1 passed. `npm audit --json`: 10 vulnerabilities, 8 moderate and 2 high,
  as in pass 2a.

## 2026-09-14 — Effort comparison requested; `matched` build timings deferred

- From the user, after pass 2b's results were reported: "Please also reflect and record on the effort
  required to achieve native look and feel (matched) vs just writing native Swift. Also include your
  estimations on how much of the Ionic-capacitor project was scaffolded and how much had to be written by
  hand VS native Swift (# of modules / files / lines)." Spec 001 §16 takes the comparison.
- From the user, during the timing runs below: "timings are still affected by other background processes,
  defer for now". Spec 001 §15.3 records pass 2b's build times as deferred.
- **Timing runs not used** (`/usr/bin/time -p`, new `-derivedDataPath`, load average from
  `sysctl -n vm.loadavg` before each step):
  - A background loop polled the load every 20 s and ended when the one-minute average was 3.36.
  - **00:07:13 to 00:07:33, one-minute load 4.09 to 4.72, `matched`:**
    - web build 4.60 s real (Vite 3.45 s);
    - `npx cap sync ios` 0.64 s;
    - clean Debug build 10.09 s, clean Release build 4.77 s;
    - Debug `.app` 11296 KiB, Release `.app` 11152 KiB.
  - **00:07:59 to 00:09:04, one-minute load rising from 4.15 to 11.73, `stock`:**
    - web build 14.07 s (Vite 8.95 s);
    - `npx cap sync ios` 6.01 s;
    - clean Debug build 15.80 s, clean Release build 8.80 s;
    - Debug `.app` 8064 KiB, Release `.app` 7920 KiB.
  - **The same run, `native-swift/` at `HEAD`:**
    - clean Debug build 9.44 s, clean Release build 10.77 s;
    - Debug `.app` 1940 KiB, Release `.app` 1308 KiB. §11.2's 1524 and 1024 KiB were measured before the
      chat round.
- After the timing runs, `git status --short` listed pass 2b's change set as staged: 32 entries, `M ` and `A `.
  This session ran no `git add`.
- **Sources read for spec 001 §16:**

  | source | how it was read | what was taken |
  | --- | --- | --- |
  | `gh api repos/ionic-team/starters/tarball/557f7c44de5b995f5cc9d65e04299c7c4907d0ba`, main, committed 2026-08-19 ("fix(angular): keep ng generate working with angular-toolkit 13 (#1887)") | fetched, unpacked in the session scratchpad | `react-vite/base`, 22 files, and `react-vite/official/tabs`, 10 files, compared file by file with `ionic-capacitor/` |
  | `ionic-capacitor/node_modules/@capacitor/cli/assets/ios-spm-template.tar.gz` (8.5.2) | unpacked | 20 files, compared with `ionic-capacitor/ios/` |
  | the session transcript, `~/.claude/projects/-Volumes-DATA01-Projects-lab-replicate-parro-crossplatform/4276af08-dfbc-4979-8dbb-6757d935c8d5.jsonl` | Python: entries deduplicated by `uuid`, tool calls by `tool_use` id | prompt timestamps; tool calls, tool names and active time between prompts |
  | `git log --format='%h %cI %s'` | command | commit times |
  | `git ls-files`, `wc -l`, Python `difflib` | command | files and lines by origin |
  | `python3 -c` over `package-lock.json`'s `packages`; `du -sh node_modules` | command | 779 packages; 344 MB |

- The starter was fetched from GitHub. The download that `ionic start` made in pass 2a was not kept, so it
  was not compared with GitHub's `main`.
- **Transcript entries per hour (local time):**
  - 2026-09-13: 98 at 09:00, 478 at 10:00, none from 11:00 to 15:59, 1023 at 16:00, 2 at 17:00, none
    from 18:00 to 20:59, 619 at 21:00, 654 at 22:00, 525 at 23:00;
  - 2026-09-14: 93 at 00:00.

  Phase 1 was committed at 21:11 (`f88d70e`), so its tool calls are not in the transcript. The transcript
  has no sidechain entries.
- **Tool calls between prompts** (unique ids; active time from the first to the last call, with no gap
  over 10 minutes in these intervals):

  | work | tool calls | active time | calls by tool |
  | --- | --- | --- | --- |
  | chat detail in `native-swift/` | 58 | 19 min | Read 21, Edit 16, Bash 12, Write 9 |
  | spec 001 §13 | 49 | 24 min | Edit 16, Bash 15, WebFetch 13, Read 2, WebSearch 2, ToolSearch 1 |
  | pass 2a | 141 | 47 min | Read 53, Write 35, Bash 34, Edit 19 |
  | pass 2b, to 00:04 | 202 | 65 min | Read 77, Bash 58, Edit 53, Write 13, ToolSearch 1 |

- `ionic-capacitor/` classification, from the `difflib` comparison:
  - 33 files unchanged from the templates;
  - 10 edited: 3 by tools only, 7 by hand;
  - 29 new by hand in `src/`, plus `capacitor.config.ts`, which `ionic start --capacitor` writes;
  - 2 lock files;
  - 8 template files deleted.
- `src/styles/matched/index.css`: `grep -oE '(-?[0-9]+(\.[0-9]+)?)px'` counts 174 values, and 84 lines start
  a comment or continue one.
- From the user, answering the deferral: "clear to run timings now if needed." The timing run went ahead;
  spec 001 §15.3 takes the results.
- **The run, 00:24:28 to 00:25:09.** It used `measure-matched.sh` from the session scratchpad, then the same
  steps for `stock` and `native-swift/`.
  - **Load before the run:** one-minute load average 2.86. `ps -Ao pcpu,comm -r` listed `launchd` at 46.0 %,
    the Claude Code extension at 13.1 % and `WindowServer` at 11.9 %; the `rg` search of the pass 2b entry
    was no longer in the list.
  - **Load during the run:** 3.03 before `matched`'s Debug build, 4.87 before its Release build, 7.08 before
    `native-swift/`'s Debug build, and 6.45 at the end.
  - **Results:**
    - `matched`: web build 4.02 s real (Vite 3.05 s), `npx cap sync ios` 0.57 s, clean Debug build 7.45 s,
      clean Release build 4.27 s;
    - `stock`: web build 2.71 s (Vite 1.94 s), `npx cap sync ios` 0.36 s, clean Debug build 5.11 s, clean
      Release build 4.19 s;
    - `native-swift/`: clean Debug build 5.14 s, clean Release build 4.84 s.
  - **Sizes:** `matched`'s `.app` sizes were 11296 and 11152 KiB, the same as in the run at 00:07:13.
- **npm install scripts (not recorded in the pass 2b entry):** `npm install @rdlabo/ionic-theme-ios26@9.2.0`
  printed `npm warn install-scripts` for three packages:
  - `core-js@3.50.0` (postinstall);
  - `cypress@13.17.0` (postinstall: `node index.js --exec install`);
  - `fsevents@2.3.3` (install).

  It followed with "Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow."
  Whether the Cypress binary is installed was not checked, and Cypress has not been run in either pass.

## 2026-09-14 — Screenshots moved to `screenshots/`; §10.3 merged into §6

- **From the user, before phases 3–7:**

  > Before running phases 3-7 please reorganize the screenshots folder:
  > - move to the root of the repo
  > - organize by platform-variant-version/surface-state.png (variant=matched|stock for capacitor, empty for swift; version = v1/v2/v3/... in case of re-iterations; surface=home|chat|...; state=empty|selected|...) - select the naming scheme that will encompass existing and future screenshots, and be extensible for more platforms, more surfaces, more variants (dark)
  > - record the naming scheme in the spec.
  >
  > Additionally, merge §10.3 "Phases added" with the original §6 Phasing in the spec.
  >
  > Then commit.

- **The move.**
  - A shell loop wrote 45 old and new paths to `screenshot-map.txt` in the session scratchpad; the 45 new
    paths are distinct.
  - `shasum -a 256` ran over the old files, `mv -n` moved each file, and `shasum -a 256` ran over each new
    file: 0 mismatches.
  - The old folders `phase1/`, `phase2/` and `chat/` held only PNG files, and `rmdir` removed them and
    `specs/001-four-tab-shells/screenshots/`.
  - `du -sh` and `ls | wc -l` per new folder: `native-swift-v1` 1.9 MB, 7 files; `native-swift-v2` 2.2 MB, 8
    files; `ionic-capacitor-stock-v1` 3.4 MB, 15 files; `ionic-capacitor-matched-v1` 4.3 MB, 15 files.
- **Where the scheme in spec 001 §17 differs from the request:**
  - The first part is named `build` and takes the repository directory name. Both current names contain a
    `-`, so every other part's values are kept free of `-`, and a folder name splits one way only.
  - `appearance` (`dark`) and `device` are parts of their own after `style`. `dark` then combines with
    `stock` and `matched`, and iPad and iPhone Duo screenshots in phases 3–5 have a part to go in. Both are
    omitted for the four current folders.
  - `native-swift/` has two versions. Its phase 1 set (round v6, added in `f88d70e`) and its chat set
    (round c5, added in `b28c7d2`) were built from different trees; `Chat/ChatList.swift` went from 227 to
    248 lines between them (spec 001 §12.4).
  - `surface` is the tab. The file names keep the old screen names without the build and style prefix, so
    `home-detail` and `chat-group-typing` read as a surface and a state.
- **Spec paths.** Spec 001 §11.2, §12.4, §13.1, §13.7, §13.8, §14.3, §15.3 and §15.6 still name the old
  paths, as AGENTS.md §"Specs are an append-only decision ledger" requires. Each takes an "Added
  2026-09-14" line pointing to §17.3, which maps old paths to new. The round m8 row in this file's entry
  "2026-09-13 — Pass 2b: building `matched` in `ionic-capacitor/`" names the old folder and is not edited.
- **§10.3 merged into §6.** Removing §10.3's text is a revision that AGENTS.md §"Specs are an append-only
  decision ledger" does not allow on an agent's own initiative; the user asked for it in this request.
  - §6 takes §10.3's note on D17 and O7, the rows for phases 6 and 7, and the two paragraphs under the
    table, with an "Added 2026-09-14" line naming the merge.
  - §10.3 keeps its heading and a line pointing to §6. Its text as first written is at `187bd6e`.
  - §10.2 O2 and O5, §13's opening list, §13.6 D17, §13.9 O7 and §13.10 still cite §10.3 and are not
    edited.
- **README.md:** the layout table takes a row for `screenshots/`.
- **`ionic-capacitor/src/styles/matched/index.css`:** `git grep -n 'screenshots/\(phase1\|phase2\|chat\)'`
  outside spec 001 and this file found the old folders in the header comment, lines 3–4. The comment now
  names `screenshots/native-swift-v1/` and `screenshots/native-swift-v2/`.

## 2026-09-14 — `native-swift-v2` merged into `native-swift-v1`

This corrects the entry "2026-09-14 — Screenshots moved to `screenshots/`; §10.3 merged into §6", in its
bullet "`native-swift/` has two versions".

- From the user, after `f6f36dc`: "native-swift-v2 and native-swift-v1 can be merged into *-v1 IMHO -
  they're all distinct, they are to *remakes* of the same screen?" The next message, "*not*", corrects
  "to" to "not". None of the 8 file names in
  `native-swift-v2/` exists in `native-swift-v1/`.
- **The move:**
  - `shasum -a 256` over the 8 files;
  - a check that no target name existed;
  - `mv -n` into `native-swift-v1/` and `rmdir screenshots/native-swift-v2`;
  - `shasum -a 256 -c` in `native-swift-v1/`: 0 failures, and `ls | wc -l` gives 15 files.
- **Spec 001 §17.4** records the changed rule and the rounds `native-swift-v1` now holds. Under the rule,
  `v<N>` goes up only when a round retakes a screen already in the newest version. §17.1, §17.2 and §17.3
  each take a line pointing to §17.4.
- `chat-three` (round v6, `f88d70e`) and `chat-list` (round c5, `b28c7d2`) are now in one folder. Both show
  the Chat list built from different trees; §17.4 names the round of each file.
- The header comment of `ionic-capacitor/src/styles/matched/index.css` now names only
  `screenshots/native-swift-v1/`.

## 2026-09-14 — Phase 3: iterating on the wide layout of `native-swift/`

- **From the user, after `242ad0d`:** "please take phase 3 - native-swift ipad/wide layout. iterate t achive
  high fidelity UI, apply best UX/design practices, save screenshots."
- **Simulators:** `iPad Pro 13-inch (M5)` on iOS 26.5, `7A47789D-1FBC-45E2-821B-8209177A6C67`, 1032 × 1376 pt,
  booted for this phase; `iPhone 16 (iOS 26.5)` for the compact-width check. A third simulator, `iPhone 18 Pro`
  on iOS 27.0, was already booted and was not used. Xcode 26.6 (17F113), XcodeGen 2.45.4.
- **Before the change** (tree at `242ad0d`, `TARGETED_DEVICE_FAMILY: '1'`): the app runs on the iPad in a
  390 × 844 pt window (`axe describe-ui`, application frame). Clean builds on that tree: Debug 5.47 s, Release
  5.12 s (`/usr/bin/time -p`, new `-derivedDataPath`). A first attempt, with the timing output piped to
  `tail`, printed no timings; the second wrote them to files.
- **iPadOS 26.5 opens the app in a window.** The first launch drew TabShell in a 635 pt wide window at x = 199 pt,
  in compact width, with window controls at its top leading corner. `axe describe-ui` reports frames relative
  to the window.
- **AXe 1.7.1 input does not reach the iPad simulators on iOS 26.5.** `axe tap` by label and by coordinates,
  and `axe button home`, printed success and changed nothing on `iPad Pro 13-inch (M5)`, before and after
  `xcrun simctl shutdown` and `boot`, and on `iPad Air 11-inch (M4)` (iOS 26.5, booted for the test and shut
  down after). `axe tap` on `iPhone 16 (iOS 26.5)` in the same session worked. `axe drag` stops with
  "FBSimulatorHIDEvent does not support touch move events."
- **XCUITest drives the iPad instead.** A project in the session scratchpad (not committed) has a host app
  and a UI test bundle that drives `dev.modaal.lab.tabshell` by bundle identifier:
  - `springboard.buttons["Zoom-button"]`, after a tap on the window's collapsed controls, makes the window
    1032 × 1376 pt; SpringBoard also lists `Close-button` and `Minimize-button`.
  - `press(forDuration:thenDragTo:)` from 5 pt inside the window's bottom trailing corner resizes the window.
    A drag of 6 pt changed nothing; each resize also moves the window's origin. With the software keyboard up,
    the drag did not resize the window.
  - `XCUIDevice.shared.orientation = .landscapeLeft` rotates the device. `XCUIScreen.main.screenshot()` in
    landscape is stored rotated a quarter turn; `sips -r 270` turns it upright.
  - The tab bar's sidebar button has the label "Toggle sidebar"; with the sidebar shown it is "Hide Sidebar",
    identifier `ToggleSidebar`. A query by the identifier `ToggleSideBar`, read from an earlier element dump,
    matched nothing.
  - `xcodebuild test` stayed running about 10 minutes after a failed test; `-collect-test-diagnostics never`
    was used afterwards.
- **The window width at which the layout changes**, in `iPad Pro 13-inch (M5)` portrait, window height
  1376 pt, read from `app.windows.firstMatch.frame` after each drag; "regular" means the tab bar's "Toggle
  sidebar" button exists, "compact" that the bottom tab bar exists:
  - Narrowing in drags of 12 pt, each of which changed the width by 6 pt: 702, 696, 690, 684, 678 and 672 pt
    regular; 666, 660, 654, 648, 642, 636 and 630 pt compact.
  - Widening in the same drags: 636 to 666 pt compact; 672, 678, 684 and 690 pt regular.
  - The switch lies between 666 and 672 pt in both directions. A first run with drags to absolute widths
    (`testResize`) gave 715 pt regular, 661 pt compact, and a narrowest window of 375 pt. A second run with
    absolute widths from 760 pt gave widths alternating between about 500 and 905 pt and was not used.
- **Rounds.** The compact-width check in each round retook screens on `iPhone 16 (iOS 26.5)` with AXe and
  compared them with `screenshots/native-swift-v1/` by `imgdiff.swift` (session scratchpad), below the top
  162 px.

  | round | what the screenshots or checks showed | change |
  | --- | --- | --- |
  | w1 | on iPhone, `home` differed in 0.419 % of pixels: in `List(selection:)` the row icons and "Mark all as read" drew in the primary colour instead of the accent colour. `home-detail` differed in the Home badge only, because the v1 script had tapped "Mark all as read" first; retaken that way it matched | `.listItemTint(Color.accentColor)`, and `.foregroundStyle(.tint)` on the button (w2) |
  | w2 | `home` still differed in the icon column (x 93–175 px): `listItemTint` did not change the icons | a `LabelStyle` that sets `.foregroundStyle(.tint)` on the icon, in place of `listItemTint` (w3); `home` then matched |
  | w3 | on the zoomed iPad window: the tabs as a bar at the top with "Toggle sidebar"; each list column carried a second button, "Hide Sidebar"; the list column was about 320 pt and cut "Book week opening assembly…" to "Book week opening asse…"; opening a chat hid the tab bar; bubbles ran about 830 pt wide; the keyboard showed a "Type English and Dutch" tip after sending | `toolbar(removing: .sidebarToggle)` and `navigationSplitViewColumnWidth(min: 320, ideal: 375, max: 420)` on each list; the conversation hides the tab bar only in compact width; bubbles at most 520 pt (w4) |
  | w4 | on iPhone, a tapped event card opened nothing (no back button, no placeholder text in `axe describe-ui`) | `preferredCompactColumn` bound for the Calendar split view (w5) |
  | w5 | on iPhone, the card opens its detail, back returns to a screen equal to `calendar`, and the same card opens it again; on iPad, "Select a chat" stood beside the list's "Your chats will appear here" | an empty detail column while there are no chats (w6) |
  | w6 | 10 iPhone screens equal to `native-swift-v1` | none |
  | w7 | `.defaultAdaptableTabBarPlacement(.sidebar)` on the `TabView`: in portrait the sidebar opened over the dimmed content at every launch; after it closed, the tab bar at the top lay over the list column's navigation bar and its "Home" title; in landscape, with the sidebar shown, the sidebar, the list and the detail stood side by side | removed (w8, the w6 code), for the overlay at every launch |
  | w8 | the tour showed the same overlap after it opened and closed the sidebar, without the modifier. `testOverlay` on a new install (`xcrun simctl uninstall`, then `install`): before the overlay the detail's navigation bar is at y 86 pt and the list's at y 150 pt; after the overlay closes by a tap on the dimmed content, by the sidebar's button or by a tab in the sidebar, both are at y 42 pt, under the tab bar, in two passes, 1.5 s and 5 s after, and after switching to Calendar | none. The overlap named in the w7 row has this cause, not the modifier |
  | w9 | `toolbar(removing: .sidebarToggle)` removed as a trial: the same y values in every step; after a rotation to landscape and back to portrait, the bars are at y 86 and 150 pt again | restored (w10, the w8 code) |
  | w10 | 10 iPhone screens equal to `native-swift-v1`; the state and screenshot runs below | none |

- **`defaultAdaptableTabBarPlacement(_:)` is available on iOS.** Its declaration at SwiftUI `:23021` of the iOS
  26.5 simulator SDK is in an extension marked `@available(iOS 18.0, *)` (`:23015`). An earlier read in this
  phase printed the ranges `:19955`–`:19975` and `:23018`–`:23050` one after the other and took the
  `@available(visionOS 2.0, *)` and `@available(iOS, unavailable)` lines at `:19972`–`:19973`, which belong to
  `extension SwiftUICore.CustomHoverEffect` (`hoverEffectGroup`), for the modifier's own.
  `TabViewCustomization`'s `subscript(sidebarVisibility:)` (`:19625`) sets whether one tab is listed in the
  sidebar.
- **State across a resize, round w10, on a new install:** Home with "Group 6/7/8 B" selected, narrowed to
  567 pt, shows the group's detail with a back button; Calendar with "Charity market" selected, at 596 pt, shows
  the event's detail; Chat with "Group 6/7/8 B" open and a draft typed, at 586 pt, shows the conversation with
  the draft. Back at 1032 pt, each has its selection and its detail. Spec 001 §18.3.
- **Screenshots, round w10:** 12 files in `screenshots/native-swift-ipad-v1/` (3436 KiB), 4 in
  `native-swift-ipadlandscape-v1/` (1228 KiB), 3 in `native-swift-ipadnarrow-v1/` (8156 KiB; each file holds
  the home screen wallpaper around the narrowed window). `shasum -a 256` finds no two equal files among them.
  - The copy script took the landscape Settings screenshot as `settings-detail.png`; it showed the Home tab
    with the same SHA-256 as `home-detail.png`, because the tour switches to Home before rotating. The file was
    deleted from `screenshots/native-swift-ipadlandscape-v1/` before it was committed.
  - A background script in zsh that used the glob qualifier `(N)` stopped at "no matches found" before
    rotating the landscape screenshots and before the clean builds; both were run again by hand.
- **Clean builds at round w10:** Debug 6.08 s, Release 5.00 s; Debug `.app` 2156 KiB, Release `.app` 1444 KiB;
  one `warning:` line per build, from `appintentsmetadataprocessor`.
- **Results and the open overlap:** spec 001 §18.

## 2026-09-14 — Phase 4: iterating on the wide layout of `ionic-capacitor/`

- **From the user, after phase 3 was reported:** "Please commit and take phase 4". Phase 3 was committed as `1a4b99f`.
- **The breakpoint question, asked before the first edit** (AskUserQuestion): spec 001 §4.3 shows the `IonMenu` column,
  hides the tab bar and splits each tab into list and detail at one width, 672 px (§10.2 O4). Three columns do not fit
  at 672 px: `@ionic/core/dist/collection/components/split-pane/split-pane.ios.css` sets `--side-min-width: 270px` and
  `--side-max-width: 28%`; `@rdlabo/ionic-theme-ios26/src/styles/default-variables.scss:22` sets
  `--ios26-menu-width: 360px`; `native-swift/TabShell/RootTabView.swift:80` gives the list column 320 to 420 pt.
  Options: "Menu from 992 px (Recommended)", "Overlay menu below 992", "Menu from 672, columns 992", "As written, all at
  672". **Answer:** "Menu from 992 px (Recommended)". Spec 001 §19.1 records what it amends.
- **Simulators:** `iPhone 16 (iOS 26.5)` `70D15E5B-3D95-4290-B3E9-970F68617BE8` and `iPad Pro 13-inch (M5)` on iOS 26.5
  `7A47789D-1FBC-45E2-821B-8209177A6C67`, both booted from phase 3. `iPhone 18 Pro` on iOS 27.0 was booted and not used.
  Xcode 26.6 (17F113), Node 24.21.0 (`nvm use 24`), XcodeGen 2.45.4.
- **Baseline before the first edit:** both variants built at `1a4b99f` and installed on `iPhone 16 (iOS 26.5)`; the pass
  2 screenshot scripts in the session scratchpad (`shoot-ionic.sh`, `shoot-matched.sh`) took round b0: 15 `stock` and
  16 `matched` screenshots.
- **Sources read:**

  | source | how it was read | what was taken |
  | --- | --- | --- |
  | `node_modules/@ionic/react-router/dist/index.js:681–774` | read | a view item for a route whose path ends in `/*` is reused when the path below it changes (`:734`) |
  | `node_modules/@ionic/react/dist/index.js:1971–2107` (`PageManager`, `IonPage`) | read | an `IonPage` renders `div.ion-page` and calls the outlet's `registerIonPage` in `componentDidMount`; `IonTabs` in a router renders its own `PageManager` |
  | `node_modules/@ionic/react/dist/index.js:2291–2410`, `:2474–2560` (`IonTabs`, `IonTabBar`) | read | `IonTabs` finds the outlet among its children by type; the tab bar keeps each tab's current `href` |
  | `node_modules/@ionic/core/dist/collection/components/split-pane/split-pane.js`, `split-pane.ios.css` | read | `when` defaults to `lg`, `(min-width: 992px)`, through `matchMedia`; the main element is found by `contentId` among the direct children |
  | `node_modules/@ionic/core/dist/collection/components/menu/menu.js` | `grep` | `menu-pane-visible` while the split pane shows the menu |
  | `node_modules/@ionic/react/css/core.css` | `grep split-pane` | `.split-pane-visible>.ion-page.split-pane-main{position:relative}` |
  | `node_modules/@ionic/core/dist/collection/components/footer/footer.ios.css:64`, `footer.js:116` | `grep` | a footer's last toolbar is padded for the home indicator only while no bottom `ion-tab-bar` is in the tabs and the keyboard is closed |
  | `node_modules/@rdlabo/ionic-theme-ios26/src/styles/components/ion-menu.scss`, `ion-tabs.scss`, `default-variables.scss` | read | the theme's menu is absolute with `z-index: 999` and pads the split pane's main content by the menu width; floating tab bar `max-width: 474px` |
  | `ionic-capacitor/index.html:11–12` | `grep viewport` | `width=device-width, initial-scale=1.0` |
  | `screenshots/native-swift-ipad-v1/`, `screenshots/native-swift-ipadlandscape-v1/` | viewed; `magick … txt:-` pixel rows and columns | the geometry and colours in spec 001 §19.5 |
  | `node_modules/@ionic/core/dist/esm/ion-item_8.entry.js:397`, `:474` | `sed -n`, `grep -o` | `labelIosCss`, the label style Ionic injects at run time: `.item .sc-ion-label-ios-h{--color:initial;…;color:var(--color)}` |
  | `node_modules/@rdlabo/ionic-theme-ios26/dist/css/` (all `.css` files) | Python scan of each rule | no rule whose selector names `ion-label` or `ion-menu` sets `color` on a menu item's label |
  | `ionic-capacitor/src/lib/messageRows.ts:4`, `:23`; `src/fixtures/fixture.ts:190–195` | read | `dateGap` of one hour and the date line above a message sent more than an hour after the one before; `nowOnToday()` dates a sent message with the clock time |
  | `screenshots/native-swift-ipadlandscape-v1/*.png` | Python walk over the PNG chunks | the orientation stored in the `eXIf` chunk (tag `0x0112`) and in the XMP `iTXt` chunk (`tiff:Orientation`) |

- **TypeScript:** `npx tsc --noEmit` rejected `id` on `IonTabs` (`Property 'id' does not exist`); the split pane's main
  element is a `div` with `id="tabs"` and the `ion-page` class.
- **XCUITest reads the web content on the iPad** (round e1, `testExplore` in the session scratchpad's `p4-driver`):
  `IonItem` rows with `routerLink` are links labelled with their texts joined ("Group 6/7/8 B 1 unread Teacher JV"),
  the menu's items are links "Home 1", "Calendar", "Chat", "Settings", and each `ion-content` is an element labelled
  "main" whose frame gives the column. At 1032 pt the stock menu is 289 pt wide, 28 % of 1032.
- **Rounds** on `iPad Pro 13-inch (M5)`:

  | round | build | what the screenshots or layout notes showed | change |
  | --- | --- | --- | --- |
  | e1 | stock | menu 0–289 pt, list column 288–664 pt, detail 663–1032 pt; "Select a group or a page"; the status bar's "◀ TabShell", because native TabShell was in front before the launch | the tours terminate `dev.modaal.lab.tabshell` first |
  | t1 | stock | 1032 and 1376 pt as e1 (menu 385 pt in landscape); at ≥992 px the composer lay on the home indicator; landscape bubbles wider than 520 pt; the driver's resize stopped at 915 pt for 820 and 684 pt for 600 | the footer padding rule in `Columns.css`; the bubble cap in `ConversationPage.css` and `matched/index.css`; the driver steps by absolute drags |
  | m1 | matched, built 10:12:28 before t1's CSS changes | the theme's menu over the list column: the list's subtitle one letter per line, and every row, "New chat", the message field and "Send" not hittable; at 839 pt the window controls over the list's "Chat" title | `ios-theme-disabled` on `IonSplitPane`; the menu `position: relative`, 320 px, no header (matched CSS) |
  | t2 | stock | the composer above the home indicator; landscape bubbles within 520 pt; 816 pt: two columns and the tab bar; 605 pt: the phone layout with the conversation pushed, the window controls over the back button's label; zoomed back to 1032 pt: menu, list and the same conversation | — |

- **The phase 3 landscape screenshots carry a stale orientation.** `magick identify -verbose` on each of the four files
  in `screenshots/native-swift-ipadlandscape-v1/` (committed in `1a4b99f`) prints 2752 × 2064 px and `Orientation:
  LeftBottom`; `native-swift-ipad-v1/home.png` prints `TopLeft`. `magick …/calendar-event-sidebar.png -orient TopLeft`
  draws the screen upright. The raw XCUITest landscape screenshot (round t1, `t1-l-home-detail.png`) is 2064 × 2752 px
  with `LeftBottom`. So `sips -r 270` in phase 3 rotated the pixels and left the tag, and a viewer that applies the tag
  turns those four files a quarter turn; the image viewer of this session did so for a `sips -Z` copy. This corrects
  the entry "Phase 3: iterating on the wide layout of `native-swift/`" of 2026-09-14, which records the files as turned
  upright. `magick -strip` does not remove the orientation.
- **Question:** in the chat report, the four files could have their orientation tag rewritten in place or corrected
  copies could go in a new `-v2` folder, since spec 001 §17.2 does not allow replacing files in a version. **Answer:**
  "Please update the screenshots (the orientation tag) in place."
- **The orientation was changed in place.**
  - A Python walk over the PNG chunks of each file found the orientation twice: EXIF tag `0x0112`, SHORT, value 8 in the
    `eXIf` chunk, and `<tiff:Orientation>8</tiff:Orientation>` in the XMP `iTXt` chunk (`XML:com.adobe.xmp`,
    uncompressed). `sips -g orientation` prints `<nil>` for these PNGs.
  - `exiftool` and `exiv2` are not installed (`which`). A `magick` rewrite re-encodes `IDAT`, so `p4-orient.py` in the
    session scratchpad sets both values to 1 and recomputes the two CRCs, after checking every chunk's CRC.
  - Per file: the size is unchanged; `cmp -l` against the copy saved before counts 10 bytes; the SHA-256 of the `IDAT`
    data is unchanged; `magick compare -metric AE` counts 0; `magick identify` prints 2752 × 2064 `TopLeft`, EXIF 1.
    A 20 % `magick -auto-orient` preview of `calendar-event-sidebar.png` shows the screen upright.
  - `find screenshots -name '*.png' | xargs magick identify -format '%[orientation]'`: all 64 PNGs `TopLeft` or
    `Undefined` after the change.
  - The XMP still gives `exif:PixelXDimension` 2064 and `exif:PixelYDimension` 2752, the portrait size; the EXIF chunk
    gives 2752 × 2064. Left as they are.
- **Rounds after t2:**

  | round | build | what the screenshots or notes showed | change |
  | --- | --- | --- | --- |
  | m2 | matched, web build 10:22:28: the menu fix at 320 px | rows, "New chat", the field and "Send" hittable; the menu a glass card in its own column; the list column still the phone's grouped cards; no highlight on the selected row or chat; at 816 pt the floating tab bar over the composer; at 605 pt the window controls where the back button is | the panel, selection and 280 px sidebar CSS; the composer above the floating bar between 672 and 991 px |
  | x1 | stock with a probe in the copied web assets, bundle `dev.modaal.lab.tabshell.probe` (`p4-probe-build.sh`) | `innerWidth` × `innerHeight` equal to the window in points: 1032 × 1376, 821 × 1376, 610 × 1376, 1376 × 1032; `env(safe-area-inset-*)` top 32 px, left 0, right 0, bottom 20 px in every state; `screen` 1032 × 1376 throughout | `watchWindowed()` and 72 px of leading padding in a window smaller than the screen |
  | t3 | stock, `testThreshold`, build of t2 | two columns at 673 pt, the phone layout at 667 pt, narrowing and widening in 6 pt steps; from the zoomed 1032 pt window a 12 pt drag did not move the corner, so the steps across 992 px stayed at 1032 pt; narrowest window 375 pt | the steps across 992 px start from about 968 pt |
  | t4 | stock, `testState`, build of t2 | Home's and Calendar's selections shown at 598 pt with a back button and at 1032 pt again; the chat draft already gone at 1032 pt, after the menu's Home and Chat ended the field's focus | `testDraftTabs` |
  | d1 | stock, `testDraftTabs`, build of t2 | at 1032 pt the draft gone after each switch through the menu; at 817 pt the keyboard hid the tab bar, so a switch through the tab bar was not exercised | the fix below |

- **Why a tab switch closed the conversation.** `@ionic/react-router/dist/index.js`:
  - `renderViewItem` (`:924–947`) renders each view's element inside a route context built from
    `match || viewItem.routeData.match` (`:931`), so a hidden view keeps its own last match;
  - `shouldUnmountLeavingView` (`:1570–1589`) keeps the leaving view for a push with direction `none`, and a transition
    between two routes ending in `/*` skips removal (`:1915–1918`, `:1991–1993`).
  - `TabColumns.tsx` read `useLocation()`, which gives the current path. The hidden Chat view rendered with `/home`,
    matched no chat, and replaced `Conversation` with the empty state; `useDraft`'s clean-up then deleted the draft.
    `useViewPath()` now builds the path from `useParams()['*']`.
- **iPhone comparisons** (`p4-iphone.sh` in the session scratchpad: the pass 2 scripts on the installed build, then
  `imgdiff.swift` against round b0 below the top 162 px):
  - p1 `stock` (build of t2): 13 of 15 screens with 0 pixels different. `list-after` and `child-sent` differ in the
    send times: 10:03 and 10:02 against 10:22 and 10:21, "Today 10:03" against "Today 10:22" (crops of both images).
  - p1 `matched` (build of m2) and p2 `matched` (build with the panel CSS): 14 of 16 screens with 0 pixels different;
    `chat-child-sent` and `chat-list-after` differ in the send times, 10:05 and 10:04 against 10:27 and 10:26.
  - p3 `stock` and `matched` (build with the first `watchWindowed()`, which compared the web view's area with the
    screen's): `group-typing` 0.180 % and `chat-group-typing` 0.233 % different, in the header. A crop shows the back
    button 216 px (72 pt) to the right in p3: the keyboard shrinks `innerHeight` (`@capacitor/keyboard`), so the area
    test set `windowed` on the iPhone. `watchWindowed()` now compares the width only.
- **Final code, first pass** (`p4-run-final.sh` in the session scratchpad: builds at 10:39:00 and 10:41:42):
  - p4 `stock`: 13 of 15 screens with 0 pixels different, `group-typing` among them; `child-sent` and `list-after`
    differ in the send times (crops: 10:03 and 10:02 against 10:41 and 10:40).
  - p4 `matched`, and its retake p5: 13 of 16 screens with 0 pixels different; `chat-child-sent` and
    `chat-list-after` differ in the send times; `chat-group-sent` differs in 27.848 %. Its p4 screenshot has a date line
    "Today 10:43" above the sent message and the messages above drawn higher. `src/lib/messageRows.ts:4` sets
    `dateGap` to one hour and `:23` draws a date line above a message sent more than an hour after the one before;
    `nowOnToday()` (`src/fixtures/fixture.ts:190–195`) dates a sent message with the clock time on the fixture's day.
    The message before is dated 09:41; b0 sent at 10:03, p4 at 10:43, and stock's p4 at 10:40.
  - t5 `stock` tour: at 605 pt the back buttons lie after the window controls. At 816 pt the list column's large title
    "Chat" also moved 72 px: the selector `.columns-list ion-header ion-toolbar:first-of-type` matched the large title's
    header inside `ion-content` as well → `.columns-list > ion-header`; the tours and the iPhone comparisons are taken
    again after a rebuild (t8, m6, p6).
  - d2 `stock`: the draft in the field after the menu's Home and Chat and after Settings and Chat at 1032 pt, and at
    816 pt after the resize. The keyboard hid the tab bar at 816 pt, so a switch through the tab bar was not exercised.
    The typed text went in before the existing draft: the driver's tap put the caret at the start.
  - t6 `stock`, `testThreshold`: two columns at 673 pt, the phone layout at 667 pt, narrowing and widening. Across
    992 px from 968 pt (resized to 973 pt): no menu at 990 pt, the menu at 996 pt; the next 12 pt drag took the window
    to 1032 pt, and the eight narrowing steps from there stayed at 1032 pt. `testThreshold` now drags back to about
    1000 pt before narrowing (round t9). Narrowest window 375 pt.
  - t7 `stock`, `testState`: at 1032, 816 and 598 pt and back at 1032 pt, the conversation with "Draft kept across a
    resize" in the field; at 598 pt Home and Calendar each show the selected row's placeholder, its title and a back
    button, with the tab bar's tab selected; back at 1032 pt the placeholders and titles in the detail column.
    `selectedTabs()` reads no tab at 1032 pt: the menu's current link has `aria-current` and XCUITest does not report it
    as selected.
  - m3 `matched` tour: menu 0–290 pt, list 290–665 pt, detail 675–1032 pt at 1032 pt; detail to 1376 pt in landscape;
    816 pt two columns and the tab bar; 605 pt the phone layout; zoomed back, the three columns. Screenshots: at 1032 pt
    the chat sent at 10:53 has a date line "Today 10:53" (`dateGap`, as p4); at 816 pt the "Calendar" title and at
    605 pt the back button lie after the window controls.
  - m4 `matched`, `testThreshold`: widening, no menu at 991 pt and the menu at 997 pt; narrowing from 996 pt, no menu at
    990 pt; two columns at 675 pt and the phone layout at 669 pt, narrowing and widening; narrowest window 375 pt.
  - m5 `matched`, `testState`: the draft in the field at 1032, 816 and 605 pt and back at 1032 pt. At 605 pt the
    conversation hides the tab bar, as `matched` does on iPhone (`src/styles/matched/index.css:875`), and the driver
    noted "tab not found: Home" and "tab not found: Calendar"; the Home and Calendar rows below 672 pt were not read. At
    816 pt `layout()` listed one `main` frame, 504+421; the screenshot `m5-state-chat-820.png` shows the list and the
    conversation side by side and the tab bar. `testState` now taps the back button when no tab is hittable (round m7).
- **Final code, retake** (`p4-retake.sh` in the session scratchpad; `stock` built at 11:00:13, `matched` at 11:04:43,
  after the `.columns-list > ion-header` selector):
  - t8 `stock` tour: menu 0–288 pt, list 288–664 pt, detail 663–1032 pt at 1032 pt; menu 385 pt in landscape; 816 pt
    two columns and the tab bar; 605 pt the phone layout; zoomed back, the three columns. `t8-n-chat-group-sent.png`:
    at 816 pt the large title "Chat" at the list column's usual inset, and the collapsed top bar's search button and
    the window controls above it.
  - p6 `stock`: 12 of 15 screens with 0 pixels different. `child-sent` (0.095 %) and `list-after` (0.128 %) differ in
    the send times. `group-sent` differs in 26.762 %: side by side (`magick +append`), b0 sent at 10:02 with no date
    line above the sent message, p6 sent at 11:03 with "Today 11:03" above it and the messages above drawn higher, the
    `dateGap` case recorded for `matched` p4 above.
  - m6 `matched` tour: menu 0–290 pt, list 290–665 pt, detail 675–1032 pt at 1032 pt, detail to 1376 pt in landscape;
    `resize(to: 820)` stopped at 827 pt (two columns, the tab bar) and `resize(to: 600)` at 594 pt (the phone layout),
    where round m3 stopped at 816 and 605 pt; zoomed back, the three columns.
  - p6 `matched`: 13 of 16 screens with 0 pixels different; `chat-child-sent` (0.094 %) and `chat-list-after`
    (0.093 %) differ in the send times; `chat-group-sent` (27.848 %) has the date line, as in p4.
  - t9 `stock`, `testThreshold` with the narrowing steps from about 1000 pt: widening, no menu at 991 pt and the menu at
    997 pt; narrowing from 996 pt, no menu at 990 pt. Across 672 px the drags stopped at 675 pt: step 4 of the
    narrowing and step 8 across 992 px did not move the corner, so t9 did not cross 672 px; t3 and t6 did.
  - m7 `matched`, `testState` with the back button step, on the 11:04:43 build (`p4-after.sh` in the session
    scratchpad): the draft in the field at 1032 and 816 pt and in the conversation at 598 pt; there the driver noted
    "no tab in the conversation at compact width; back button true", and the Chat list showed the tab bar with Chat
    selected. At 598 pt Home and Calendar each showed the selected row's placeholder, its title and a back button;
    back at 1032 pt both in the detail column without a back button. Chat at 1032 pt: no conversation and no field,
    since the back button had closed the conversation (`Drafts.tsx:29–35` removes the draft then). At 816 pt
    `layout()` again listed one `main` frame, as in m5.
- **Screenshots copied** (`p4-copy.sh` in the session scratchpad, which maps the tour's `p-`, `l-`, `n-` and `c-`
  shots to the `ipad`, `ipadlandscape`, `ipadmedium` and `ipadnarrow` folders, turns landscape shots upright with
  `magick -auto-orient` and stops if a shot is older than the build's `public/index.html`): t8 into the four
  `ionic-capacitor-stock-ipad*-v1` folders, m6 into the four `ionic-capacitor-matched-ipad*-v1` folders. `magick
  identify`: portrait 2064 × 2752, landscape 2752 × 2064, all `TopLeft`. `shasum -a 256`: no two files equal across
  these folders and the `native-swift-ipad*-v1` folders. Contact sheets (`magick +append`) of stock's landscape
  `settings-detail` (Settings, Notifications open), medium `home-detail` and both narrow files showed the screens the
  names give.
- **`matched`'s selected menu label was black.** Pixel rows of round m3's screenshots (colour runs within 2 levels):
  the selected tab's icon (209,60,99), its label (0,0,0); `native-swift-ipadlandscape-v1/calendar-event-sidebar.png`
  draws both in (209,60,99). The rule `ion-menu ion-item.selected ion-icon, ion-menu ion-item.selected ion-label
  { color: var(--ion-color-primary) }` was in the built bundle (`dist/assets/index-CFmh4dPU.css`, rule 1662), and no
  rule in the bundle set `color` on `ion-label` at a higher specificity. Ionic injects the label's style at run time:
  `labelIosCss` in `node_modules/@ionic/core/dist/esm/ion-item_8.entry.js:397` begins
  `.item.sc-ion-label-ios-h,.item .sc-ion-label-ios-h{--color:initial;display:block;color:var(--color);…}`,
  specificity (0,2,0), above the menu rule's (0,1,3) and below the list rule `.columns-list ion-item.selected
  ion-label` (0,2,2), whose label m3 draws in the accent. The menu label's selector is now
  `ion-menu ion-item.item.selected ion-label`, (0,2,3); `matched` is built again and its tour and iPhone comparison
  taken again as rounds m8 and p7 (`p4-fix.sh` in the session scratchpad). Round m7 runs `testState` on the build
  before this change, which reads no colours.
- **Clean builds** (`p4-measure.sh` in the session scratchpad, 11:14:58 to 11:15:35, `matched` then `stock`, on the
  working tree with the menu label selector; `/usr/bin/time -p`; new derived data per `xcodebuild`; simulator
  `iPhone 16 (iOS 26.5)`):
  - `matched`: web build 4.75 s real (Vite 3.66 s), `cap sync` 0.73 s, Debug 9.15 s, Release 6.34 s; `dist/` 6276 KiB,
    205 files; Debug `.app` 11320 KiB, Release `.app` 11176 KiB.
  - `stock`: web build 4.55 s (Vite 3.23 s), `cap sync` 0.54 s, Debug 5.86 s, Release 4.65 s; `dist/` 3088 KiB,
    19 files; Debug `.app` 8084 KiB, Release `.app` 7940 KiB.
  - Load average (`sysctl -n vm.loadavg`): 8.07 at the start, 10.61 at its highest; `ps -Ao pcpu,comm -r` listed
    Visual Studio Code's renderer at 43.2 % CPU first.
  - One Xcode `warning:` line per build, from `appintentsmetadataprocessor`; 20 `lightningcss` lines and the chunk size
    warning per web build.
  - Side effect: the run left `dist/` and `ios/App/App/public/` with `stock`'s build; `p4-fix.sh` builds `matched`
    again. Derived data in `dd-p4-t-*` in the session scratchpad.
- **After the menu label selector** (`p4-fix.sh` in the session scratchpad; `matched` built at 11:15:49):
  - m8 `matched` tour: the same layouts as m6; `resize(to: 820)` stopped at 816 pt and `resize(to: 600)` at 594 pt.
    In `m8-p-home-detail.png` the darkest pixel of rows y 66, 68 and 70 pt between x 80 and 150 pt, the selected
    "Home" label, is (209,60,99), and no pixel there is darker; in m3 the label was (0,0,0).
  - `p4-copy.sh matched m8` stopped at its first file with "exists: …/ionic-capacitor-matched-ipad-v1/home.png" and
    wrote nothing. `git status --porcelain` listed the 20 files of the four `ionic-capacitor-matched-ipad*-v1` folders
    as untracked, `git ls-files` none, and `cmp` found the 16 portrait files identical to round m6's shots; the four
    folders were removed and `p4-copy.sh matched m8` copied again. `magick identify`: portrait 2064 × 2752, landscape
    2752 × 2064, all `TopLeft`; `shasum -a 256`: no two files equal across the `ionic-capacitor-*-ipad*-v1` and
    `native-swift-ipad*-v1` folders.
- **Folder sizes** (`du -sk`): the four `ionic-capacitor-stock-ipad*-v1` folders 13536 KiB, 20 files; the four
  `ionic-capacitor-matched-ipad*-v1` folders 14864 KiB, 20 files.
- **p7 `matched`** (`p4-fix.sh`, on the 11:15:49 build): 13 of 16 screens with 0 pixels different; `chat-child-sent`
  (0.097 %) and `chat-list-after` (0.118 %) differ in the send times; `chat-group-sent` (27.847 %) has the date line.
- **Checks on the final code:** `npx tsc --noEmit` exit 0; `npx eslint src` 0 errors and 2 warnings
  (`Drafts.tsx:25`, `ShellModel.tsx:97`); `npx vitest run` 1 of 1 passed; `cmp AGENTS.md CLAUDE.md` prints nothing.
- **Side effects on the machine:**
  - `dev.modaal.lab.tabshell.probe` was installed on the iPad at 10:27 and uninstalled at 10:43
    (`xcrun simctl uninstall`).
  - `dev.modaal.lab.tabshell.stock` (built 11:00:13) and `dev.modaal.lab.tabshell.matched` (built 11:15:49) are
    installed on `iPhone 16 (iOS 26.5)` and `iPad Pro 13-inch (M5)`.
  - The iPad's status bar time is overridden to 9:41 (`xcrun simctl status_bar … override --time 9:41` in
    `p4-retake.sh` and `p4-fix.sh`).
  - `ionic-capacitor/dist/` and `ionic-capacitor/ios/App/App/public/` hold `matched`'s 11:15:49 web build.
  - Derived data (`dd-p4-*`), round screenshots, notes and logs are in the session scratchpad.
