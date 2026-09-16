# Contributing

This repository is public and frozen. It holds one comparison — the same four screens built twice,
in `ionic-capacitor/` and in `native-swift/` — and the record of how each build was made and
measured. [README.md](README.md) lists what is here;
[specs/001-four-tab-shells/spec.md](specs/001-four-tab-shells/spec.md) holds the plan, the
measurements and the decisions; [DISCOVERY.md](DISCOVERY.md) logs what was observed, in order.

The measurements in spec 001 were taken at the commits that spec names. The tree stays at those
commits so a number can be checked against the code it came from.

## Pull requests are not accepted

A pull request opened here is closed without review and without merge. This covers every change: a
typo, a dependency bump, a fifth screen, a port to another toolchain.

Fork it instead. [LICENSE](LICENSE) is MIT; §"What the licence does not cover" below lists what it
does not reach.

## Issues and discussions are open

Open either. **An answer is not guaranteed**, and an issue may be closed without one. Nothing here
carries a response time or a support commitment.

Worth reporting:

- **A measurement that does not reproduce.** Name the spec section and the number in it, what you
  ran and what you got, with your device or simulator model, OS version, window size in points and
  toolchain versions — the fields [AGENTS.md](AGENTS.md) §"Two builds of one shell" requires of a
  measurement recorded here.
- **A build that fails**, with the commit, the command and the full error.
- **A wrong claim** in `specs/` or in `DISCOVERY.md`, named by section, or by date and heading.

A vulnerability, a credential in the history, or personal data in a committed file does not go in an
issue. [SECURITY.md](SECURITY.md) says where it goes.

## Building either stack

Both need Xcode with the iOS 26 SDK: `native-swift/xcodegen.yml` sets `deploymentTarget: '26.0'`,
and spec 001 D4 gives the reason. Pick a simulator UDID from `xcrun simctl list devices available`
and pass it as `id=`; spec 001 §10.6 records `name=` failing to match on the machine the
measurements were taken on.

`native-swift/` needs [XcodeGen](https://github.com/yonaskolb/XcodeGen). `TabShell.xcodeproj` is
generated and not committed (`.gitignore:16`). From the repository root:

```bash
xcodegen generate --spec native-swift/xcodegen.yml
xcodebuild -project native-swift/TabShell.xcodeproj -scheme TabShell \
  -destination 'platform=iOS Simulator,id=<UDID>' build
```

`ionic-capacitor/` needs Node 22 or later, which is what Capacitor 8 requires. It builds in two
styling variants, `stock` and `matched` (spec 001 §13.6 D13). From `ionic-capacitor/`:

```bash
npm ci
npm run build                          # npm run build:matched for the matched variant
npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App \
  -destination 'platform=iOS Simulator,id=<UDID>' build
```

`screenshots/index-<device>.html` reads `screenshots/manifest.js`. After adding or removing a
screenshot folder, rewrite it with `./screenshots/build-index.sh`.

## What the licence does not cover

- **`_assets/IMG_0210.PNG` … `IMG_0213.PNG`** are screenshots of the Parro iOS app, kept as the
  reference the two builds were made from. Its interface, wording and icons belong to its
  publisher, and [LICENSE](LICENSE) grants nothing in them.
- **The dependencies** declared in `ionic-capacitor/package.json` and resolved in
  `ionic-capacitor/package-lock.json` and in
  `ionic-capacitor/ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved`
  carry their own licences.
