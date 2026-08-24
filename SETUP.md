# First run — environment prep and Phase 0 intake (SETUP.md)

> **For the AI**: this is the only file you need to read the **first** time a user opens
> this repository. Clear the "Check this before reading on" gate below, then work through
> Step 0 → Step 6 in order.
>
> **This file stays in place when you are done.** Do not delete it, and do not let a later
> session delete it. It doubles as the single-step reference for "fill in my profile /
> change the language / change preferences".

---

## Check this before reading on: has this project already been initialized?

> **This is the first gate in this file, and it must never be skipped.**
> This file is a one-time opening procedure. Running it again on a project that has
> already been set up will wipe the profile, interests, gaps, and calendar the user
> already confirmed — the worst class of accident in this project.
>
> Do not decide this by checking whether `AGENT.md` still points here. **Decide it
> from this file.**

Look at these three places. **Any one of them matching** means the project is
already initialized:

| Evidence | Where |
| :--- | :--- |
| An `Initialized …` line | `state/log.md` |
| The status block names a subject (not "unset") | top of `AGENT.md` |
| Subject and modality are not `TBD` | `knowledge/profile.md` |

### Already initialized → **stop immediately, do not continue**

Instead, jump straight to the single step that matches what the user actually wants:

| What the user wants | Where to go |
| :--- | :--- |
| Fill in `TBD` slots / change goal, gaps, time budget | `protocols/intake_checklist.md`, asking **only about the slots being changed** |
| Change the interface language | **Step 5.5** of this file, editing only `ui-strings.js` |
| Change image / exercise / layout preferences | `intake_checklist.md` §H + `knowledge/profile.md` |
| The environment is broken and nothing runs | **Step 0** of this file — fix the environment only, **do not touch the profile** |
| Start a **completely new subject** | The archive flow in `protocols/project_lifecycle.md`, **not** a re-run of this file |

> The full "I want to change X → where to find it" index is the **"Settings index"**
> section of `AGENT.md`.

When the request is ambiguous, ask this before doing anything:

> "This project is already set up for **[subject]**. Do you want to change a few fields,
> or start a completely new subject?"

In an initialized project, "I want to learn X" is **almost always a Phase 1 scheduling
request**, not a request to re-initialize. Ask, do not guess.

### Not initialized → start at Step 0

---

## Step 0: Environment prep and launcher matching (required on a fresh machine)

The user has most likely just downloaded this repository onto a machine with no runtime
installed at all. **Get the environment working before you ask any questions.**

### 0.1 Look at what is already installed before installing anything

> **The default action is to install nothing.** The user's machine is not this project's
> property — upgrading or downgrading their global Node can break their other projects.
> **Find out what is there, then make the smallest change that works.**

Check the current environment:

```bash
node -v
npm -v
```

Then check for a version manager (having one makes "Path A" below much easier):

```bash
nvm --version      # nvm / nvm-windows
fnm --version
volta --version
```

Handle what you find in one of three ways:

| What you found | What to do |
| :--- | :--- |
| **Node ≥ 20 already present** | **Install nothing.** Go straight to 0.2 |
| **No Node at all** | Install it (table below) — this is the only case where installing globally is right |
| **Node present but older than 20** | **Do not touch their global version.** Pick a path per 0.1.1 |

Installation, for the "no Node at all" case only:

| Platform | How |
| :--- | :--- |
| Windows | Download the LTS installer from <https://nodejs.org/>, or `winget install OpenJS.NodeJS.LTS` |
| macOS | Download the LTS installer from <https://nodejs.org/>, or `brew install node` |

After installing, have the user **open a new terminal** before checking `node -v` again —
an existing terminal will not pick up the new PATH.

> Node.js is the only requirement. This project does not need Python unless the user later
> wants `scripts/download_images.py` to fetch illustrations.

#### 0.1.1 Node is present but the version does not match — you pick the path

Do **not** turn around and ask the user "should I upgrade Node?" — they usually cannot
answer, and touching the global version should never be the default anyway. Decide
yourself, then tell them in one line which path you took and why.

**Path A — install a copy for this project only (prefer this)**

Leave the global version alone and give only this project the version it needs:

1. nvm / fnm / volta already present → write a version pin (`20` in `.nvmrc`, or run
   `volta pin node@20`).
2. No version manager → install one (`fnm` is the lightest), or unpack a portable Node
   archive into the project directory (and add that directory to `.gitignore`).
3. **You must also update `start.bat`** so it switches to that version before starting
   the server — otherwise a double-click still runs the old global version and the work
   was pointless.

**Path B — adapt the project to the version that is already there**

Only when Path A clearly will not work (a locked-down work machine that forbids installing
anything, for example). How:

1. Just run `npm install` and `npm test` first and see whether the existing version
   actually works — the `20` in `engines` is often conservative, and older versions
   frequently run fine.
2. **It works** → lower `engines.node` in `package.json` to the version you actually
   tested, and note "machine runs Node X, verified passing" in `state/log.md`.
3. **It does not work** → change the newer syntax or APIs that failed, and `npm test` must
   be fully green afterwards. **Never make it "pass" by deleting tests or weakening
   assertions.**

Whichever path you take, come back to 0.3 to get the launcher right, and record what you
actually did in the Step 6 summary so it can be reproduced on another machine.

### 0.2 Install project dependencies

From the repository root:

```bash
npm install
```

This is safe to run: `npm install` is idempotent, so an existing install is only verified,
not re-downloaded. Dependencies land in the project's own `node_modules/` and do not
affect anything global.

### 0.3 Match the launcher to this platform

The repository has two one-click launchers, and **a branch should carry only the one that
matches its platform**:

| Platform | Launcher | Notes |
| :--- | :--- | :--- |
| Windows | `start.bat` | Double-click to run |
| macOS | `start.command` | Double-click to run; restore the executable bit with `chmod +x start.command` if it is lost |

**This branch targets Windows, so the launcher is `start.bat`.** Check that:

1. `start.bat` really exists at the repository root;
2. the port it references matches `DEFAULT_PORT` in `server.js`;
3. if the user is actually on macOS, they cloned the wrong branch — point them at the
   `macos-english` branch, or write an equivalent `start.command` for them.

Do not leave both scripts in place while testing only one of them.

### 0.4 Smoke test

```bash
npm test
node scripts/validate_content.js
```

Then launch the reader (double-click `start.bat`, or run `npm start` and open
<http://127.0.0.1:4173> yourself). **An empty sidebar before Phase 2 is expected** — what
this step accepts is "the page loads", not "the page shows a lesson".

Only move on to Step 1 once all of Step 0 passes.

---

## Step 1: Run the intake checklist

Load **`protocols/intake_checklist.md`** (all slots, A–H) and
`knowledge/modality_presets.md`, and work through the questions with the user.

At minimum you must come away with:

1. Subject + a testable goal
2. Level + known material + gaps
3. Interests (a few is fine) + time constraints
4. **Primary explanation language / most fluent language**, confirmed **separately** from
   the learning-content language
5. **Learning modality preset T / M / H / C** (see `modality_presets.md`)
6. (Recommended) reader sort order / Notes scope preferences
7. **Content format preferences**: image density / diagram tier / sticky notes / exercise
   mix (`intake_checklist.md` §H)

Rules:

- Ask about whatever is missing; **do not invent anything**.
- `TBD` may stand for now, but every `TBD` must be listed on the confirmation card.
- **Before you print a confirmation card and the user confirms it: do not write the real
  profile, do not edit `AGENT.md`, and do not generate any lesson content.**

---

## Step 2: Print the confirmation card and wait

Use the confirmation-card template in `intake_checklist.md`.

- User wants changes → update the card and wait again.
- User says `confirm` → go to Step 3.

---

## Step 3: Write the knowledge base and state

Field-level detail and the `domain_map` / `calendar` initialization rules live in
**`protocols/p0_bootstrap.md` Step 3**. Write targets:

| Target | Source |
| :--- | :--- |
| `knowledge/profile.md` | subject, goal, level, known material, constraints, **explanation language + content language**, modality preset, reader preferences, **§content format preferences** |
| `knowledge/desire.md` | interests and topics to cover (`[ ]`) |
| `state/gaps.md` | initial weak-point Kanban |
| `knowledge/domain_map.md` | draft subject tree; known nodes marked Covered |
| `knowledge/calendar.md` | pointer + Wave lookahead (T leans Unit / M leans Mag / H mixed) |
| `state/warehouse.md` | small-module pool renamed for the subject |
| `state/log.md` | empty dashboard + a note that nothing has started |
| `notes.json` | left as `[]` |

---

## Step 4: Reader acceptance

Step 0.4 already ran `npm test`. This adds the last contract check:

```bash
node scripts/verify_reader.js
```

**It must report no FAIL.** It checks the contracts that rot silently: the theme carrier and
FOUC guard, the locked storage keys and routes, the `data-primary` anchoring rule, excluded
features (no Git UI), and `notes.json` consistency. On a FAIL, fix the implementation per
`protocols/frontend_spec.md` — **do not edit the check**.

`templates/reader_skeleton.html` is a reference shell; you do not need to copy anything from
it, because the bundled reader already implements what it demonstrates.

---

## Step 5: Rewrite AGENT.md into this subject's project

> **Mandatory** once the confirmation card passes. This is what turns the repository from a
> generic template into this subject's learning project, and it is what unlocks Phase 1 / 2.

### Must rewrite

| Location | Change it to |
| :--- | :--- |
| H1 title | `AI Learning Coach — [subject]` |
| Top "Current status" | Subject, modality preset (T/M/H/C), `Phase 1 ready`, date |
| Opening blurb | Drop the "blank template" boilerplate; write a one-line goal for this subject (from profile) |
| The content note in the file map | May state the subject's main modality (e.g. "mostly Magazine") |
| Phase 0 row of the routing table | **Narrow it** to "only when profile has `TBD` or the user says *update profile*", keeping the re-entry guard (golden rule 18) |
| Golden rule 8 | Change template-mode "do not prefill personal info" to "profile is authoritative; do not invent what was not provided" |

Record the Phase 1 default by modality: **T** → propose Units by default; **M** → propose
Magazines by default; **H** → alternate Mag/Unit.

### Rewrite done checklist

- [ ] Title contains the subject name
- [ ] Status block has no "unset"
- [ ] Modality preset written
- [ ] Phase 0 routing narrowed to "fill TBD / update profile", with the re-entry guard in place
- [ ] The entrypoints in `AGENT.md` that send a reader through **all of** this file are
      narrowed (lifecycle note, the status block's "Next", the Phase 0 routing row); the
      file-map line stays — this file is kept, it just stops being the entrypoint
- [ ] Confirmation-card evidence archived (profile / desire / gaps / calendar / domain_map are no longer all TBD)
- [ ] `profile.md` confirms the primary explanation language and the learning-content language **separately**
- [ ] `profile.md` §content format preferences written (image density / diagram tier / sticky notes / exercise mix)
- [ ] Next step points at Phase 1

---

## Step 5.5: Translate the reader interface into the user's own language

> Intake already captured the **primary explanation language** — do not leave the user
> studying against a foreign-language interface.

Every string in the interface lives in **`ui-strings.js`** at the repository root
(`index.html` and `app.js` contain no hard-coded copy). To localize:

1. Open `ui-strings.js` and translate every value into the user's **primary explanation
   language** (not the learning-content language — a Chinese speaker studying English
   should get a Chinese interface).
2. Set `lang` to the matching BCP-47 code (`zh-CN` / `en` / `ja` / `ko` / `es` …); it is
   written to `<html lang>`.
3. **Change only the values on the right of the colon, never the keys.** The keys are a
   code contract.
4. Leave the icon characters (`○ ● ◌ ✓ ⚠ ☰ ☀ 🧭 ⬇ 🔍 📖 🗂 📝 ⟳`) as they are — they carry state
   semantics (`frontend_spec.md` §6.3), they are not translatable text.
5. Run `node scripts/verify_reader.js`: it reconciles every key referenced by
   `index.html` / `app.js` against the pack. A dropped key shows the raw key name in the
   interface.
6. Reload the browser and look at it.

When the primary explanation language already matches this branch's documentation
language, just confirm this step — no edit needed.

If the user later says "switch the interface to language X", redo this step. No other
file needs to change.

---

## Step 6: Write the initialization marker and send one summary

**First**, append a line to `state/log.md`:

```
Initialized [subject] — modality [T/M/H/C] — YYYY-MM-DD
```

That line is the durable evidence that this project has been initialized, and the
idempotency marker that stops a later session from re-running Phase 0 (golden rule 18 in
`AGENT.md`).

Then set the status block to:

```
**Current status**: `Phase 0 complete — Phase 1 ready` | Subject: [subject] | Modality: H-Hybrid | YYYY-MM-DD
> Next: “schedule” → Phase 1
```

Finally, send the bootstrap summary once:

| Field | Content |
| :--- | :--- |
| Subject and goal | … |
| Modality preset | T/M/H/C + one line on what it means |
| Knowledge map | top-level topics |
| Next 5 scheduled | already marked Mag/Unit by modality |
| Initial gaps | 3–5 items |
| Environment | Node version · what was installed vs. reused · `start.bat` verified |
| Interface language | `ui-strings.js` translated into [primary explanation language] |
| Reader | `npm test` passing · `verify_reader.js` no FAIL |
| AGENT | rewritten into subject-project mode ✅ |
| Open TBDs | … |

**Your closing line must tell the user how to open every future session:**

```text
Read AGENT.md first, then <what you want>
```

**Saying "what should I study today" or "schedule" enters Phase 1.**
