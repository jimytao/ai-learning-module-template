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
4. **Learning modality preset T / M / H / C** (see `modality_presets.md`)  
5. (Recommended) Reader sort / Notes scope preferences  

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
| `knowledge/profile.md` | Subject, goals, level, known, constraints, **modality preset**, reader prefs |
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

## Step 4: Rewrite AGENT.md (critical)

Follow `AGENT.md` section **“Post-Bootstrap rewrite”** strictly:

1. Title includes subject name  
2. Status area: Subject + modality + `Phase 1 ready`  
3. Remove blank-template boilerplate; write one-line subject goal  
4. Narrow Phase 0 routing to “fill TBD / update profile” only  
5. Note default proposal bias by modality  
6. **Load and execute `protocols/cleanup_template.md`**, strip template guidance, and self-delete that cleanup file.  

After rewrite, this repo is a **subject learning project**, not a blank template.

---

## Step 5: Bootstrap summary (send once after rewrite)

| Field | Content |
| :--- | :--- |
| Subject & goals | … |
| Modality preset | T/M/H/C + one-line meaning |
| Domain map | Top-level themes |
| Next 5 queued | Mag/Unit labeled by modality |
| Initial gaps | 3–5 items |
| AGENT | Converted to subject-project mode ✅ |
| Pending TBD | … |

Next prompt: say “what should I study today” or “schedule” → Phase 1.

---

## Step 6: Status marker example

```
**Current status**: `Phase 0 complete — Phase 1 ready` | Subject: [subject] | Modality: H-Hybrid | YYYY-MM-DD
> Next: “schedule” → Phase 1
```
