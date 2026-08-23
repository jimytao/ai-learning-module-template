# Phase 0: Subject Intake & Blank Fill (p0_bootstrap.md)

> **Trigger**: User says “I want to learn…”, “bootstrap”, “set subject”, or profile/calendar is still blank.  
> **Must load first**: `protocols/intake_checklist.md` + `knowledge/modality_presets.md`  
> **Goal**: Collect → **user confirms** → write → **rewrite AGENT.md into a subject project** → only then allow Phase 1.

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

## Step 3.5: Verify the reader (owner of the browser/server files)

> **This branch ships a working reader** (`index.html`, `app.js`, `reader-core.js`, `server.js`,
> `styles.css`). So this step **verifies** it rather than building it. `cleanup_template.md` requires a
> verified reader, so if this step is skipped, cleanup can never legitimately run.

1. Install once if needed (`npm install`), then launch with `start.command` and open the page.
   An empty TOC is expected before Phase 2 — "loads without error" is the acceptance bar here,
   not "shows lessons".
2. **Run `npm test`.** The suite covers interactive-markdown round-tripping, server path safety,
   Smart Merge, and the annotation anchoring rule (`ReaderCore.annotationMatches`).
3. **Run `node scripts/verify_reader.js`. It must report no FAIL.** It checks the contracts that
   silently rot: theme carrier and FOUC guard, locked storage keys and routes, the `data-primary`
   anchoring rule, excluded features (no Git UI), and `notes.json` consistency. Fix every FAIL against
   `frontend_spec.md` rather than editing the checks.
4. `templates/reader_skeleton.html` is kept as the **reference shell**, not as a thing to copy here —
   the shipped reader already implements what it demonstrates. Consult it when extending the UI.
5. If `start.command` lost its executable bit after a copy, restore it with `chmod +x start.command`.

Outcome of this step decides Gate B in Step 4 below.

---

## Step 4: Rewrite AGENT.md (critical) — two gates

The rewrite happens in **two independent gates**. Gate A converts the project and unblocks learning;
Gate B only removes one-shot template text. **Never make Gate B a precondition for learning** — the
Bootstrap block is inert prompt text, and leaving it in place costs the user nothing.

### Gate A — immediately after the confirmation card passes (mandatory)

Follow `AGENT.md` section **“Post-Bootstrap rewrite”** strictly:

1. Title includes subject name  
2. Status area: Subject + modality + `Phase 1 ready`  
3. Remove blank-template boilerplate; write one-line subject goal  
4. **Narrow the Phase 0 routing row** to “fill TBD / update profile” only, and add the re-entry guard
   (see `AGENT.md` golden rule on Phase 0 re-entry)  
5. Note default proposal bias by modality  

Gate A owns every edit above. `cleanup_template.md` deliberately does **not** touch the routing table,
so if Gate A skips item 4 nothing else will do it.

**After Gate A the project is a subject learning project, and Phase 1 / Phase 2 are unblocked.**

### Gate B — after the reader is verified (deferred, not urgent)

Run only when Step 3.5 verification passed: `start.command` launches the reader, `npm test` is green,
and `verify_reader.js` reports no FAIL. Then **load and execute `protocols/cleanup_template.md`**: it strips the one-shot
Phase 0 interview guidance from `AGENT.md`, retains all confirmed profile data (including explanation
language), and self-deletes.

If Gate B cannot run yet, say so in one line and move on to Phase 1 — do not stall the user, and do
not run cleanup with unmet preconditions.

---

## Step 5: Bootstrap summary (send once after Gate A)

| Field | Content |
| :--- | :--- |
| Subject & goals | … |
| Modality preset | T/M/H/C + one-line meaning |
| Domain map | Top-level themes |
| Next 5 queued | Mag/Unit labeled by modality |
| Initial gaps | 3–5 items |
| AGENT | Converted to subject-project mode ✅ (Gate A) |
| Reader | shipped reader verified (start.command · npm test · verify_reader) |
| Template cleanup | done (Gate B) / deferred until the reader is verified |
| Pending TBD | … |

Next prompt: say “what should I study today” or “schedule” → Phase 1.

---

## Step 6: Status marker example

```
**Current status**: `Phase 0 complete — Phase 1 ready` | Subject: [subject] | Modality: H-Hybrid | YYYY-MM-DD
> Next: “schedule” → Phase 1
```
