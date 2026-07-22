# AI Learning Coach — Entry Router (AGENT.md)

> **Sole entrypoint**. Before any task, read this file and use the routing table to decide which files to load.  
> **Do not** bulk-load large files under `knowledge/` before the task type is confirmed.  
>  
> **Lifecycle**: this file has two forms —  
> 1. **Blank template mode** (current): guides Phase 0 intake and conversion.  
> 2. **Subject project mode** (after Phase 0 confirm): AI rewrites this file per “Post-Bootstrap rewrite” below, removes template boilerplate, and writes subject routing + status.

---

## Current project status (must update after every Phase)

**Current status**: `Phase 0 ready — awaiting subject intake` | Subject: _(unset)_ | Modality preset: _(not chosen)_ | YYYY-MM-DD
> Next: user says “bootstrap / I want to learn…” → load `protocols/intake_checklist.md` for confirmed intake  
> After that: run “Post-Bootstrap rewrite” → say “what should I study today” to enter **Phase 1**

---

## Task routing table

| User command keywords | Triggers Phase | Must load | On demand |
| :--- | :--- | :--- | :--- |
| “I want to learn…” / “bootstrap” / “set subject” / “Bootstrap” / first use | **Phase 0** | `protocols/p0_bootstrap.md` + **`protocols/intake_checklist.md`** + `knowledge/modality_presets.md` + `knowledge/profile.md` + `protocols/project_lifecycle.md` | `desire` / `domain_map` / `calendar` / `gaps` |
| “update profile” / “fill TBD” / “change goals/gaps/time” | **Phase 0 · patch** | `intake_checklist.md` (changed slots only) + `profile.md` | related state/knowledge |
| “switch to textbook / magazine / hybrid” / “change modality” | **Modality switch** | `knowledge/modality_presets.md` + `knowledge/profile.md` + this file’s status area | — |
| “new subject” / “copy template” / “add track” / “how to archive” | **Lifecycle** | `protocols/project_lifecycle.md` + `domain_map.md` if needed | `intake_checklist` (new-track slots only) |
| “check knowledge map” / “this concept” / “what are my gaps” | **Knowledge Query** | matching `domain_map.md` / `gaps.md` / `coach_reference.md` | `log.md` |
| “what should I study today” / “schedule” / “next unit proposal” / “next issue” | **Phase 1** | `protocols/p1_propose.md` + `knowledge/calendar.md` + `knowledge/desire.md` + `knowledge/modality_presets.md` + `state/log.md` + `state/gaps.md` + `notes.json` | `profile` / `warehouse` / `domain_map` |
| “generate magazine” / “write long-form” / “generate unit” / “write textbook” / after confirming a proposal | **Phase 2** | `protocols/p2_generate.md` + `protocols/tech_spec.md` + **`protocols/visual_arsenal.md`** + `knowledge/calendar.md` + `knowledge/modality_presets.md` | `profile` / `coach_reference` / `warehouse` / `templates/*` |
| “grade” / “explain highlights” / “correct this” | **Phase 3** | `protocols/p3_review.md` + `protocols/tech_spec.md` + current content file + `notes.json` | `log` / `gaps` / `coach_reference` |
| “more drills” / “extra practice” / “yes” (only when asked after grading and user agrees) | **Phase 3 · extra drills** | same as above; **must already have clear user consent** — never auto-generate drills after grading | current mistakes / `gaps` |
| “debug” / “broken images” / “render error” / “sidebar / jump / note locate” | **Tech Debug** | `protocols/tech_spec.md` + `protocols/frontend_spec.md` | error messages |
| “check progress” / “what have I mastered” / “calendar” | **Progress Check** | `knowledge/calendar.md` + `state/log.md` + `state/gaps.md` | `desire` |

---

<!-- TEMPLATE_BOOTSTRAP_START -->
## Post-Bootstrap rewrite (blank template → this subject’s learning project)

> After the Phase 0 confirmation card passes, the AI **must** rewrite this `AGENT.md` (and the cleanup below) so the repo becomes “this subject’s learning project” instead of a generic template.  
> Do not enter Phase 2 body generation until the rewrite is done.

### Must rewrite

| Location | Change to |
| :--- | :--- |
| H1 title | `AI Learning Coach — [Subject name]` |
| Top “Current status” | Subject, modality preset (T/M/H/C), Phase 1 ready, date |
| Opening blurb | Remove “blank template” boilerplate; one-line subject goal from profile |
| content note in file map | May note primary modality (e.g. “Magazine-primary”) |
| Golden rule #8 | Replace template-mode “do not prefill personal info” with: “Profile is authoritative; do not invent unprovided info” |

> [!IMPORTANT]
> **Auto cleanup**: after the Phase 0 confirmation card passes, browser/server files are generated, and `start.bat` is configured, the AI **must** load and read `protocols/cleanup_template.md`, run its template cleanup, fully convert the project to subject-owned mode, and **self-delete** that cleanup protocol file when done.

### May slim / archive

| Action | Note |
| :--- | :--- |
| Keep `intake_checklist.md` | Still useful for “fill slots / redo profile”; routing may mark Phase 0 as “only when filling TBD” |
| Keep `modality_presets.md` | Still needed for modality switches |
| Keep `DESIGN.md` | Design notes; **do not** put in the reader TOC |
| Do not delete protocols | Rules layer stays; if a subject never uses Magazine, note “Mag disabled” in status — don’t delete files |
| `templates/` | Keep as generation skeletons |

### Suggested routing shape after rewrite

- Phase 0 row: only when profile has `TBD` or user says “update profile”.  
- Default welcome / next step: Phase 1.  
- If modality is **T**: Phase 1 notes default Unit proposals.  
- If modality is **M**: Phase 1 notes default Magazine proposals.  

### Rewrite done checklist

- [ ] Title includes subject name  
- [ ] Status area has no “unset”  
- [ ] Modality preset written  
- [ ] Confirmation card left traces (profile / desire / gaps / calendar / domain_map no longer all TBD)  
- [ ] Loaded `protocols/cleanup_template.md` and ran template cleanup (cleanup file auto-deleted)  
- [ ] Next step points to Phase 1  
<!-- TEMPLATE_BOOTSTRAP_END -->

---

## Project file map

```
AGENT.md                          ← entry router (this file; rewritten after Bootstrap)
start.bat                         ← one-click browser + local server start
│
├── protocols/
│   ├── intake_checklist.md       ← Phase0: intake confirmation checklist (mandatory)
│   ├── p0_bootstrap.md           ← Phase0: write + AGENT rewrite flow
│   ├── cleanup_template.md       ← Phase0: one-shot template cleanup (self-deletes)
│   ├── project_lifecycle.md      ← copy new subject / archive / mother-template upgrade
│   ├── p1_propose.md
│   ├── p2_generate.md
│   ├── p3_review.md
│   ├── tech_spec.md              ← md / exercise types / notes fields
│   ├── visual_arsenal.md         ← visual arsenal (flow/tree/blocks/SVG…) hard syntax
│   └── frontend_spec.md          ← reader: sort / sidebar / notes / diagram render contract
│
├── knowledge/
│   ├── profile.md
│   ├── modality_presets.md       ← T / M / H / C presets (switchable)
│   ├── desire.md
│   ├── calendar.md
│   ├── domain_map.md
│   └── coach_reference.md
│
├── state/          log.md · gaps.md · warehouse.md
├── content/        magazines/ · units/
├── images/
├── scripts/        download_images.py …
├── templates/      magazine_skeleton · unit_skeleton
├── notes.json
├── review.md                     ← Phase3 long retrospective archive (append per issue)
├── DESIGN.md
└── README.md
```

---

## Document responsibility boundaries (mixing these = bad scheduling)

| Document | One-line duty | Authority |
| :--- | :--- | :--- |
| **`protocols/intake_checklist.md`** | What Phase 0 must ask and how to confirm | Intake authority |
| **`knowledge/modality_presets.md`** | T/M/H/C learning pace and mix | Modality authority |
| **`knowledge/calendar.md`** | Generated content + cursor + forward queue | Progress authority |
| **`knowledge/desire.md`** | What you want to learn | Desire authority |
| **`knowledge/profile.md`** | Level / goals / constraints / current modality | Profile authority |
| **`knowledge/domain_map.md`** | Subject tree | Structure authority |
| **`state/gaps.md`** | Weakness recurrence | Gap authority |
| **`state/log.md`** | Retrospectives and concept ledger | Retro authority |
| **`notes.json`** | Annotations + AI reviews (with context) | Micro signals |
| **`protocols/frontend_spec.md`** | Reader behavior acceptance | Frontend authority |

### Scheduling information flow

```
intake confirm → profile + modality
  + desire + gaps + notes + domain_map + calendar + warehouse
        ↓
Phase 1 proposes by modality preset → user confirms
        ↓
Phase 2 generates → Phase 3 grades (extra drills require asking first)
```

---

## Golden rules

1. **Routing first**: do not start a task before reading this file.  
2. **Load on demand**: only files named by the routing table.  
3. **Phase-status driven**: after each Phase, update this file’s top status + `calendar.md`.  
4. **tech_spec first**: load it before writing `.md` / `notes.json`.  
5. **notes field boundaries**: AI writes only allowed fields; keep `context`; never overwrite user raw notes.  
6. **Rigorous assessment, no praise inflation**: all MCQ/T-F correct ≠ can apply.  
7. **Modality-preset driven**: Phase 1/2 obey T/M/H/C in `profile`; changing modality needs explicit user request or confirm.  
8. **Blank-template discipline (template mode only)**: do not prefill real personal info; after Phase 0 confirm, this becomes “profile is authoritative; do not invent”.  
9. **Extra drills after correction require asking first**: no new items without clear consent.  
10. **Intake must confirm**: Phase 0 must use `intake_checklist` confirmation card; no body generation and no AGENT subject rewrite before confirm.  
11. **Frontend details must not be lost**: when migrating/debugging the reader, follow `frontend_spec.md` (sort, Notes sidebar, full-sentence context locate, multi-doc isolation, **diagram render contract**).  
12. **Do not guess intent**: if the user’s command is not in the routing table, ask first — never start writing files unilaterally.  
13. **Verifiable sources**: before recommending videos/podcasts/papers/data, search to confirm they exist; never fabricate citations. If unsure, mark “needs verification”.  
14. **log table column lock**: once the frontend depends on headers like Concept Ledger in `log.md`, do not rename/reorder columns (see tech_spec).  
15. **Project organization headroom**: single subject / multi-track in one project (related courses) / folder copy (unrelated) are all OK — see `project_lifecycle.md`. Domains like Digital Health can start multi-track in one project and add Tracks as the profile clarifies.  
16. **Visuals only from the arsenal**: Phase 2 uses only Types registered in `visual_arsenal.md`; no invented syntax that causes inconsistent or broken renders.  
17. **Blanks and open answers are mutually exclusive**: never use inline `___` / `__filled__` and `**[Your Answer]**` on the same item (dual input boxes cause grading to read the wrong field). Generation follows tech_spec §1.1; grading prefers inline blanks (see `p3_review.md` §1.1); `validate_content.js` reports dual input.

---

## Full learning loop

```
Phase 0  intake checklist → confirmation card → write profile → rewrite AGENT as subject project
   ↓
Phase 1  schedule proposal by modality preset
   ↓ user confirms
Phase 2  generate content → images → update state
   ↓ user reads / drills / highlights (context full-sentence locate)
Phase 3  grade → remediate → **ask first** about extra drills
   ↓ only when user clearly agrees
   (extra drills) more items → …
   ↓ write back gaps / log / calendar / desire
Next Phase 1 …
```
