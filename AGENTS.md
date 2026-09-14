# Agent rules

Rules for working in this repository. What the repository builds and how it is laid out is in
[README.md](README.md).

`AGENTS.md` and `CLAUDE.md` are one file kept in two places, byte for byte. Edit `AGENTS.md`, then
`cp AGENTS.md CLAUDE.md`; [`ci.yml`](.github/workflows/ci.yml)'s `rules` job runs `cmp` on the two
and fails if they differ.

**Read first, by question:**

| you need | read |
| --- | --- |
| what is being built and why | [README.md](README.md) |
| the screens, the scope, the phases, what the comparison measures | [specs/001-four-tab-shells/spec.md](specs/001-four-tab-shells/spec.md) |
| what was found, tried, read and decided, in order | [DISCOVERY.md](DISCOVERY.md) |
| what a screen looks like | `_assets/IMG_0210.PNG` … `IMG_0213.PNG` — spec 001 §1.2 maps each file to its screen |
| the plan for any other change too big to carry in a commit message | `specs/` |

Run from the repository root:

```bash
cmp AGENTS.md CLAUDE.md   # what the `rules` job runs
```

## Two builds of one shell

- **`ionic-capacitor/` and `native-swift/` build the same four screens from the same screenshots.**
  A change to what the shell contains — a screen, a row, a tab, a layout breakpoint — lands in both
  directories in the same change, or its commit message names the directory it has not reached.
- **Each directory builds on its own toolchain.** Nothing in one directory imports, links or copies
  generated output from the other, so a build or a measurement of one stack runs without the other.
- **Placeholder data only.** The screenshots in `_assets/` show a real school name and a child's
  first name. Fixtures, previews, sample data, screenshots taken of the builds and commit messages
  use invented names; do not copy a person's or a school's name from `_assets/` into any file.
- **A measurement is recorded with how it was taken:** device or simulator model, OS version, window
  size in points, toolchain versions and the commit it was taken at. Measurements go in the spec for
  the change that produced them.

## Writing style: state facts and actions, no aphorisms

**Scope: every character of prose you produce for this project.** Specs, docs, code comments,
commit messages, PR bodies, review findings, and **your replies in chat**. There is no "informal"
channel where this relaxes.

**The test, applied to each sentence:** does it give the reader **a fact they can verify** or **an
action they can take**, with the referent named — the file, the line, the setting, the command, the
number? If it does neither, delete it. A sentence that only characterizes the work, dramatizes a
finding, or summarizes how significant something is carries no information the reader can act on.

Habits to avoid (common LLM-isms):

- **Mannered prose** substitutes metaphor and flourish for direct statement. Instead of "a parameter
  worth varying," the mannered writer produces "a dial worth turning." Instead of "this point still
  matters," they write "this point earns its keep." The phrases exist to display the writer, not to
  convey the idea, and readers can tell. That is why mannered prose irritates: it makes the reader
  work harder so the writer can perform. It is also imprecise — metaphors drag in connotations the
  writer did not choose and cannot control. **The fix is to say what you mean. When a literal phrase
  is available, use it.**
- **Aphoristic juxtapositions** ("Free now, a second migration later"). State the trade-off
  explicitly: what it costs now, what it costs later, which option you recommend.
- **Dramatic reversals and punchlines** ("that direction has reversed"; "upgraded those steps from
  redundant to breaking"). Give the before value, the after value, and the date measured.
- **Negative-space phrasing** ("checked by nobody"; "not cosmetic"; "not the thing to move"). Say
  which check is missing, in which file, what it costs, and when to add it. If the point is that X
  is wrong, name what to do instead — "move the sidebar into `RootView.swift`", not "`ContentView`
  is not the place for it".
- **Metaphor or personification as the load-bearing content** ("a fresh repository has no code to
  fight"; "the gate now has teeth"; "what the spec still owes"). A metaphor may decorate a point
  already stated literally; it may not be the only statement of that point. Documents do not owe,
  want, or know things — name who does the work, in which file, by when.
- **Rhetorical contrast standing in for content** ("verified, not merely committed"; "it is not that
  X, it is that Y"). State both facts separately and drop the contrast.
- **The closing paragraph that generalizes the lesson.** This is where aphorisms concentrate: a
  section ends, and the urge is to extract a portable moral. Either write a concrete rule with a
  named home — the check to add, the file to add it to — or write nothing.

## Git state — confirm every commit

- **Never commit, amend, push or rewrite history without confirmation in the current turn.**
  "Build the Calendar screen", or approval of a *previous* commit, is not authorization for the next
  one. When work is ready: stop, summarize what changed, ask.
- **Never touch the index or restore the tree.** `git add`, `git reset`, `git stash`,
  `git checkout -- <path>`: off-limits unless asked for in this turn. Staged versus unstaged is the
  reviewer's record of how far they have read, and reverting your own edits to "recover" discards
  work they have not seen. If a commit is authorized and the index is partly staged, ask which scope
  before running anything.
- **Subject line:** imperative, naming the change — "Show the Settings rows in a side column on wide
  windows". Work backed by a spec carries the slug, **and the commit that writes the spec is the
  first such commit**. So a spec numbered 002 produces:

  ```
  [002-sidebar-navigation] Specify the breakpoint and what each stack replaces the tab bar with
  [002-sidebar-navigation] Replace the tab bar with a sidebar in native-swift
  [002-sidebar-navigation] Replace the tab bar with ion-split-pane in ionic-capacitor
  ```

  The slug names the feature and the rest names what that commit does, so the subject after the
  bracket does not repeat the slug. No spec in play, no prefix — do not invent one.

## Specs are a decision record

- **While the feature is being worked on, a spec may be edited in place** to keep the plan current.
  Where later work overturns an important earlier decision, leave a short note saying what it
  replaced and why.
- **Once the feature is done, a spec is amended by addition.** An addition that supersedes an
  existing claim names it by section, and the superseded section takes a line pointing forward to
  the addition.
- **A closed spec may take a follow-up file beside it** instead of an appended section —
  `specs/001-<slug>/followup-<topic>.md`. The rule inside it is the same: additions only, and it
  names by section what it supersedes.
- **A new spec names what it obsoletes**, by number and section ("obsoletes 001 §4.6").
- **Writing a spec is not authorization to implement it.** When the task is a spec, produce only the
  spec document — no source, project file or workflow edit, not even the one line that looks ready.
  When it is written, stop and ask.

## DISCOVERY.md is an append-only log

- **Record in [DISCOVERY.md](DISCOVERY.md) every observation that changes what someone would do
  next:** a measurement, a tool behaving differently from its documentation, a side effect on the
  machine, a source read and what was taken from it, an approach tried and dropped, and each decision
  or answer the user gives. Add the entry in the same change that acts on it.
- **Append only.** A new entry goes at the end of the file under `## YYYY-MM-DD — <what happened>`.
  Do not edit or delete an existing entry, not to fix a typo or a path. A correction is a new entry
  that names the entry it corrects by date and heading.
- **Each bullet names where it came from:** the command run, the file and line, or the URL. A claim
  taken from a third-party page, a search result summary or a summarizing fetch says which.
- **Sources read for a spec are listed in a DISCOVERY.md entry** as a table: the source, whether it
  was fetched or seen only in a search result, and what was taken from it.
- **A discovery that changes a spec is written in both files.** The DISCOVERY.md entry records what
  was found and names the spec section; the spec takes the change under §"Specs are a decision
  record".
- **A user's answer is recorded in their words** when it is short, and the entry names the question
  it answers.

## What goes in which document

- **README.md** — the goal, the layout, and a link to the spec that holds the current plan. The
  screens, the scope and what is compared live in the spec.
- **AGENTS.md / CLAUDE.md** — rules only, and one file in two places. If you are about to write a
  paragraph explaining what something *is*, it belongs in README.md or a spec.
- **specs/`NNN-slug`/spec.md** — the plan for a change too big to carry in a commit message: what is
  true now (measured, with file and line references), what the change becomes, the phasing, the
  decisions and what stays open. Written before the change and left in place after it, as the record
  of why. It never becomes the place a *rule* is stated — that is here.
- **DISCOVERY.md** — the dated log of observations, measurements, side effects, sources and user
  answers, in the order they happened. The plan that follows from an entry goes in the spec; a rule
  that follows from it goes here.
- **`_assets/`** — the reference screenshots. They are inputs and are not edited; a new reference
  screenshot is added beside them and described in the spec that uses it, as an addition, in the
  same commit.
