# Phase 1: Schedule Proposal (p1_propose.md)

> **Trigger**: “what should I study today”, “schedule”, “next issue”, “next unit”.  
> **Must load**: this file + `knowledge/calendar.md` + `knowledge/desire.md` + `knowledge/modality_presets.md` + `state/log.md` + `state/gaps.md` + `notes.json`  
> **On demand**: `knowledge/profile.md` (read modality) / `knowledge/domain_map.md` / `state/warehouse.md`

---

## Step 1: Read state (in order)

0. `profile.md` §Learning modality + `modality_presets.md` → current T/M/H/C (sets default proposal shape)  
1. `calendar.md` → cursor, issued table, forward queue  
2. `log.md` → latest Retro + Hard Points Tracker  
3. `gaps.md` → items with Status `⏳ queued` / `🔄 in progress` whose Target is due  
4. `desire.md` → unchecked `[ ]` items  
5. `notes.json` → extract annotation weaknesses from already-read content (rules below)  
6. `domain_map.md` → Core nodes not yet Covered  
7. `warehouse.md` → first unused `[ ]` small module (if needed this round)

### 1.1 Annotation weakness signals

| Signal | Meaning | Recurrence weight |
| :--- | :--- | :--- |
| Highlight only, no note | New / uncertain concept | Medium |
| Note present and AI marks wrong / partial | Misconception | High |
| Note starts with `+` | User explicitly wants reinforcement | **Highest** |
| Reappeared 2–3 times with no further annotation | Decay; may leave queue | — |
| Annotated again on recurrence | Reset cycle; keep recurring | High |

> Only analyze annotations tied to content whose Status is read / reviewed.

### 1.2 Choose content modality (preset first, then content)

1. Read current preset (T/M/H/C) from `profile`; apply Phase 1 rules in `modality_presets.md` for **default bias**.  
2. Then fine-tune by content type:

| Situation | Within preset allowance |
| :--- | :--- |
| Landscape / mechanism / data / literature feel / narrative | Bias **Magazine** |
| Definitions / easy-to-confuse contrasts / drills / gap fill | Bias **Unit** |
| Big theme + needs consolidation | **Mix** (common under H; under T/M explain the exception in the proposal) |

If gap pressure pushes you to break the preset (e.g. push a Unit under M), **state the reason in the proposal and ask for confirmation** — never silently change pacing.

### 1.3 Magazine weakness → Unit consolidation (explicit link)

If notes/gaps show a Magazine theme was “read but still weak”:

- Prefer a **Unit** drilling that point (when the preset allows); or  
- Under Hybrid, write: “prior Mag.0N weakness → this Unit gap-fill”  

Do not keep opening new Mag themes while old annotated weaknesses pile up forever.

### 1.4 warehouse

Each proposal should say whether to mount one unused module from `warehouse.md` (especially Magazine Block 3). If not used, write “no warehouse this round”.

---

## Step 2: Output the proposal

The proposal must include:

| Field | Requirement |
| :--- | :--- |
| ID & title | e.g. `Magazine.01: …` or `Unit.01: …` |
| Track | Track served this round (single-subject: subject name; cross-track must be stated) |
| Current preset | T / M / H / C (from profile) |
| This-round mode | Magazine / Unit / Mix (if different from preset default, explain why) |
| Domain nodes covered | Align with `domain_map` |
| Outline | Magazine: 3 article titles + hook direction; Unit: Part preview |
| Weakness recurrence | 2–4 points from gaps/notes |
| Upgrade pairs | 2–3 “plain phrasing → professional phrasing” previews (optional) |
| Exercise budget | Unit required: blank / open / MCQ / T-F counts; Magazine default few or none |
| warehouse module | If used, name the theme |
| Size estimate | Magazine 2000–3500 words; Unit 800–2000 by depth |

---

## Step 3: Wait for confirmation

- Confirm → mark `calendar` / `AGENT.md` as `Phase 2 — generating`, enter Phase 2  
- Edit → sync affected desire / gaps Target / calendar queue items  
- **Do not** treat an unchecked desire item as a locked final title without confirmation  
- **Do not** treat forward-queue “suggested order” as a locked due date
