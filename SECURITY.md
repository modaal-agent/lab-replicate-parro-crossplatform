# Security

Report through GitHub's private vulnerability reporting on this repository
(**Security → Report a vulnerability**). Do not open a public issue for it.

This repository is frozen and takes no pull requests ([CONTRIBUTING.md](CONTRIBUTING.md)). A report
is read; a fix is not guaranteed, and there is no response time. There are no releases and no tags,
so `main` at its current commit is the only version there is to fix.

## What is here, for the purpose of a report

Two iOS UI shells and the record of building them. Neither build opens a network connection: at
`168575f`, `ionic-capacitor/src/` and `native-swift/TabShell/` contain no `fetch`,
`XMLHttpRequest`, `WebSocket` or `URLSession` call. There is no server, no account and no
credential. Every name, message and event on screen comes from
`ionic-capacitor/src/fixtures/fixture.ts` and `native-swift/TabShell/Fixtures/Fixture.swift`, and
each one is invented.

What a report is about, then, is what someone runs when they build this tree, or what this tree
publishes about a real person.

## What to report

- **Anything in the tree that fetches and runs code from a URL** during install, build or test,
  beyond the package managers resolving `ionic-capacitor/package-lock.json` and
  `ionic-capacitor/ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved`.
- **A dependency version pinned in either lock file that has a published advisory** affecting a
  build made from this tree.
- **A script here that writes outside the directory it is run in**, or that stages, commits or
  pushes with `git`. The one committed script is `screenshots/build-index.sh`, which writes
  `screenshots/manifest.js` and `screenshots/index-<device>.html`.
- **Personal data in a committed file**: a real person's or a real school's name, an address, an
  email, a phone number, or an account or device identifier — in `_assets/`, in `screenshots/`, or
  in any text file. [AGENTS.md](AGENTS.md) §"Two builds of one shell" requires invented names.
- **A reference a reader cannot resolve**: a local filesystem path, a private repository or project
  name, or a private document, in a file or in a commit message.
- **A credential, token or private key** anywhere in the history.

## What is not reported here

- A measurement that does not reproduce, a build failure, or a wrong claim in `specs/` or
  `DISCOVERY.md`. Those go in an issue ([CONTRIBUTING.md](CONTRIBUTING.md)).
- A dependency that is merely out of date. The lock files are pinned at the commits the
  measurements in [specs/001-four-tab-shells/spec.md](specs/001-four-tab-shells/spec.md) were taken
  at, and they are not bumped.
