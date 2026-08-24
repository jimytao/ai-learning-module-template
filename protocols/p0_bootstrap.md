# Phase 0: Subject Intake & Blank Fill (p0_bootstrap.md)

> **Trigger**: User says “I want to learn…”, “bootstrap”, “set subject”, or profile/calendar is still blank.  
> **The entrypoint is `SETUP.md` in the repository root** — start there on a first run; its
> Step 0 (environment prep) has no equivalent in this file.
> This file is the Phase 0 **detail layer**: write-in fields, domain_map / calendar init rules.
> **Must load first**: `protocols/intake_checklist.md` + `knowledge/modality_presets.md`
> **Goal**: Collect → **user confirms** → write → **rewrite AGENT.md per `SETUP.md` Step 5** → only then allow Phase 1.

---

## Step 1: Collect via intake checklist

Full slots and checkboxes: **`protocols/intake_checklist.md`** (A–G).

Minimum required:

1. Subject + testable goals  
2. Level + known strengths + weak spots  
3. Interests (can be short) + time constraints  
4. **Primary explanation language / strongest language**, separately from the learning-content language
5. **Learning modality preset T / M / H / C** (see `modality_presets.md`)
6. (Recommended) Reader sort / Notes scope preferences

Rules:

- Ask only for what’s missing; do not invent.  
- TBD is allowed temporarily, but must appear on the confirmation card.  
- **Before outputting a confirmation card and getting user “confirm”: do not write formal profile data, do not rewrite AGENT, do not generate body content.**

---

## Step 2: Output confirmation card and wait

Use the “Confirmation card template” in `intake_checklist.md`.

- User requests edits → update the card and wait again.  
- User confirms → go to Step 3.

---

## Step 3: Write knowledge base and state

| Write target | Content source |
| :--- | :--- |
| `knowledge/profile.md` | Subject, goals, level, known, constraints, **explanation + content languages**, modality preset, reader prefs |
| `knowledge/desire.md` | Interests and topics to cover (`[ ]`) |
| `state/gaps.md` | Initial weak-spot Kanban |
| `knowledge/domain_map.md` | Draft subject tree; mark known nodes Covered |
| `knowledge/calendar.md` | Cursor + Wave forward queue (by modality: T → Unit-heavy, M → Mag-heavy, H → mix) |
| `state/warehouse.md` | Small-module pool renamed for the subject |
| `state/log.md` | Empty Dashboard + note that learning has not started |
| `notes.json` | Keep `[]` or clear |

### domain_map requirements

- 3–8 top-level themes; Core / Elective; depth M/U; dependency edges.

### calendar init by modality

| Preset | Wave A suggestion |
| :--- | :--- |
| T | Mostly Unit drafts |
| M | Mostly Magazine drafts |
| H | Mag/Unit interleaved |
| C | Per custom rules |

---

## Step 3.5: Verify the reader (sole owner of the browser/server files)

> **This branch ships a working reader** (`index.html`, `app.js`, `reader-core.js`,
> `server.js`, `styles.css`), so this step **verifies** rather than builds.

1. Install dependencies if needed (`npm install`), then launch with `start.bat` and open the page.
   An empty listing before Phase 2 is normal — this step accepts "it loads", not "it shows a lesson".
2. **Run `npm test`.** It covers interactive-Markdown round-trip write-back, server path
   safety, Smart Merge, and the annotation anchoring rule (`ReaderCore.annotationMatches`).
3. **Run `node scripts/verify_reader.js`; it must report no FAIL.** It checks the contracts
   that rot silently: theme carrier and FOUC guard, locked storage keys and routes, the
   `data-primary` anchoring rule, excluded features (no Git UI), and `notes.json`
   consistency. On a FAIL, fix the implementation per `frontend_spec.md`, not the check.
4. `templates/reader_skeleton.html` stays in this branch as a **reference shell**; nothing
   needs copying from it, because the bundled reader already implements what it shows.

---

## Step 4: Rewrite AGENT.md (critical)

Mandatory once the confirmation card passes. The full checklist lives in **`SETUP.md`
Step 5**. In short:

1. Title now contains the subject name
2. Status block gets Subject + modality + `Phase 1 ready`
3. Blank-template boilerplate removed; one-line subject goal written
4. **Narrow the Phase 0 route** to "fill in / update profile", keeping the re-entry guard
   (golden rule 18 in `AGENT.md`)
5. Record the default proposal leaning for the chosen modality

Item 4 is the one that gets skipped — and nothing else will put it back.

**Once the rewrite is done, this repository is that subject's learning project, and
Phase 1 / Phase 2 are unlocked.**

Then follow `SETUP.md` Step 6 and append the `Initialized …` line to `state/log.md`. That
line is the durable proof this project was initialized and the idempotency marker that
stops a later session from re-running Phase 0.

---

## Step 5: Bootstrap summary (send once after the rewrite)

| Field | Content |
| :--- | :--- |
| Subject & goals | … |
| Modality preset | T/M/H/C + one-line meaning |
| Domain map | Top-level themes |
| Next 5 queued | Mag/Unit labeled by modality |
| Initial gaps | 3–5 items |
| AGENT | Converted to subject-project mode ✅ |
| Reader | shipped reader verified (start.bat · npm test · verify_reader) |
| Pending TBD | … |

Next prompt: say “what should I study today” or “schedule” → Phase 1.

---

## Step 6: Status marker example

```
**Current status**: `Phase 0 complete — Phase 1 ready` | Subject: [subject] | Modality: H-Hybrid | YYYY-MM-DD
> Next: “schedule” → Phase 1
```
