# Parro shell: Capacitor vs SwiftUI

Four screens of the Parro iOS app — Home, Calendar, Chat, Settings — rebuilt twice as a UI shell:
once with Ionic and Capacitor in `ionic-capacitor/`, once in SwiftUI in `native-swift/`. The two
builds are compared on how much work each takes to go from the phone layout in the screenshots (one
column, tab bar at the bottom) to a two-pane layout with navigation in a side column, the layout a
split-screen foldable iPhone (called iPhone Duo in this repository) would need.

## Goal

1. Build the four screens in `_assets/` in each stack, to the scope below.
2. Add a wide layout to each: a side navigation column instead of the bottom tab bar, and a list
   next to its detail wherever a screen has both.
3. Record, for each stack, what step 2 cost and what it broke, using the measures under
   [What is compared](#what-is-compared).

The wide layout is tested on hardware that runs today: an iPad simulator in Split View and Stage
Manager, where the window width can be changed at runtime.

## The four screens

The screenshots are 1179 × 2556 px (393 × 852 pt at @3x) and were taken on 2026-09-13.

| screen | reference | what it contains |
| --- | --- | --- |
| Home | [`_assets/IMG_0210.PNG`](_assets/IMG_0210.PNG) | header with the school name, the child's name and a search button; "Groups" section for the current school year, one row per group with a colour dot, an unread-count badge and a teacher-initials badge; "Previous school years" disclosure row; action rows "Report absence", "Privacy preferences", "Mark all as read"; "Parro news" row |
| Calendar | [`_assets/IMG_0211.PNG`](_assets/IMG_0211.PNG) | header with a calendar button; Mon–Sun week strip with today highlighted and a drag handle below it; agenda list grouped by month (pill label) and by week ("Week 38, September 14 - September 20"); event cards with title, time range and initials badge; "There are no events today" row under today |
| Chat | [`_assets/IMG_0212.PNG`](_assets/IMG_0212.PNG) | header with a search button; horizontally scrolling filter chips "Unread", "Child chat", "Group chat", "Private chat"; empty state with an illustration, a title and body text; floating "+" button at the bottom right |
| Settings | [`_assets/IMG_0213.PNG`](_assets/IMG_0213.PNG) | rows with leading icons: Account, My children, Connect calendar, Notifications, Reminders, Pin code security, Accessibility, Language (with subtitle); a second group: What's new? and Download files (with subtitles), Parro support (with a trailing external-link icon) |

All four share a bottom tab bar (Home, Calendar, Chat, Settings; the selected tab in the accent
colour; a numeric badge on Home) and a header with the screen title in the accent colour above a
"school • child" subtitle.

## Scope

- **In:** the four tab screens, the tab bar, the headers, static placeholder data, light mode.
- **Out:** backend, login, push notifications, real data, localisation.

Open:

- Whether tapping a row opens a placeholder detail screen. The two-pane layout needs one to show a
  list next to its detail.
- Whether dark mode is in scope.

## What is compared

Both stacks are measured the same way.

| measure | how it is taken |
| --- | --- |
| fidelity | screenshot at 393 × 852 pt, next to the matching file in `_assets/` |
| size of the wide-layout change | `git diff --stat` between the last phone-only commit and the commit that adds the side navigation |
| state across a resize | whether the selected tab, the scroll position and the navigation stack are unchanged after the window width crosses between compact and wide at runtime |
| navigation primitives | which built-in components carry the layout and which parts needed custom code. Starting candidates: SwiftUI `TabView` with `.sidebarAdaptable` and `NavigationSplitView`; Ionic `ion-tabs`, `ion-split-pane` and `ion-menu` |
| toolchain and build | Xcode, Node and Capacitor versions; clean build time; installed app size |

## Layout

| path | what |
| --- | --- |
| `_assets/` | the reference screenshots, one per screen |
| `ionic-capacitor/` | the Ionic + Capacitor build (added with its first commit) |
| `native-swift/` | the SwiftUI build (added with its first commit) |
| `specs/NNN-slug/spec.md` | the plan, the measurements and the decisions behind a change |
| `.github/workflows/ci.yml` | the `rules` job: `AGENTS.md` and `CLAUDE.md` are byte-identical |

## Working in this repository

[AGENTS.md](AGENTS.md), which is the same file as [CLAUDE.md](CLAUDE.md), lists the rules for an
agent working here.
