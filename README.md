# Parro shell: Capacitor vs SwiftUI

Four screens of the Parro iOS app — Home, Calendar, Chat, Settings — rebuilt twice as a UI shell:
once with Ionic and Capacitor in `ionic-capacitor/`, once in SwiftUI in `native-swift/`. The two
builds are compared on how much work each takes to go from the phone layout in the screenshots (one
column, tab bar at the bottom) to a two-pane layout with navigation in a side column, the layout a
split-screen foldable iPhone (iPhone Duo) needs.

The plan — the screens, the scope, the phases and what is compared — is
[specs/001-four-tab-shells/spec.md](specs/001-four-tab-shells/spec.md).

## Layout

| path | what |
| --- | --- |
| `_assets/` | the reference screenshots, one per screen |
| `ionic-capacitor/` | the Ionic + Capacitor build (added with its first commit) |
| `native-swift/` | the SwiftUI build (added with its first commit) |
| `specs/NNN-slug/spec.md` | the plan, the measurements and the decisions behind a change |
| `DISCOVERY.md` | the append-only log of findings, side effects, sources and decisions, in order |
| `.github/workflows/ci.yml` | the `rules` job: `AGENTS.md` and `CLAUDE.md` are byte-identical |

## Working in this repository

[AGENTS.md](AGENTS.md), which is the same file as [CLAUDE.md](CLAUDE.md), lists the rules for an
agent working here.
