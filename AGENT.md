# AI Learning Coach — Entry Router (AGENT.md)

> **Sole entrypoint**. Before any task, read this file and use the routing table to decide which files to load.  
> **Do not** bulk-load large files under `knowledge/` before the task type is confirmed.  
>  
> **Lifecycle**: this file has two forms —
> 1. **Blank template mode** (current): on a first run, read **`SETUP.md`** in the repository root (environment prep → Phase 0 intake → rewrite of this file).
> 2. **Subject project mode** (after Phase 0 confirm): AI rewrites this file per `SETUP.md` Step 5, removes template boilerplate, and writes subject routing + status.

---

## Current project status (must update after every Phase)

**Current status**: `Phase 0 ready — awaiting subject intake` | Subject: _(unset)_ | Modality preset: _(not chosen)_ | YYYY-MM-DD
> Next: user says “bootstrap / I want to learn…” → read `SETUP.md` in the repository root, starting at Step 0 (environment prep)
> After that: rewrite this file per `SETUP.md` Step 5 → say “what should I study today” to enter **Phase 1**

---

## Task routing table

| User command keywords | Triggers Phase | Must load | On demand |
| :--- | :--- | :--- | :--- |
| “I want to learn…” / “bootstrap” / “set subject” / “Bootstrap” / first use — **only when this project is not yet initialized; see golden rule 18** | **Phase 0** | **`SETUP.md`** (repo root, includes environment prep) + `protocols/p0_bootstrap.md` + **`protocols/intake_checklist.md`** + `knowledge/modality_presets.md` + `knowledge/profile.md` + `protocols/project_lifecycle.md` | `desire` / `domain_map` / `calendar` / `gaps` |
| “update profile” / “fill TBD” / “change goals/gaps/time” | **Phase 0 · patch** | `intake_checklist.md` (changed slots only) + `profile.md` | related state/knowledge |
| “change explanation language” / “use my strongest language for explanations” | **Phase 0 · patch** | `intake_checklist.md` (language slots only) + `profile.md` | — |
| “change images” / “change question types” / “more diagrams” / “no open Q&A” / “change layout preferences” | **Phase 0 · patch** | `intake_checklist.md` (section H only) + `knowledge/profile.md` §Content format preferences | `visual_arsenal` / `tech_spec` |
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

## Project file map

```
AGENT.md                          ← entry router (this file; rewritten after Phase 0)
SETUP.md                          ← first run: environment prep + Phase 0 intake + rewrite of this file (kept)
ui-strings.js                     ← reader UI language pack (sole source of copy; Step 5.5 translates it)
start.bat                         ← one-click Windows browser + local server start
│
├── protocols/
│   ├── intake_checklist.md       ← Phase0: intake confirmation checklist (mandatory)
│   ├── p0_bootstrap.md           ← Phase0: write-in detail (fields, domain_map, calendar init)
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
├── scripts/        download_images.py · validate_content.js · verify_reader.js …
├── templates/      magazine_skeleton · unit_skeleton · reader_skeleton.html
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
8. **Blank-template discipline (template mode only)**: do not prefill real personal info; after Phase 0 confirm, this becomes “profile is authoritative; do not invent”. Confirmed explanation language is durable profile data and must never be cleared by any later step.
9. **Extra drills after correction require asking first**: no new items without clear consent.  
10. **Intake must confirm**: Phase 0 must follow `SETUP.md` end to end and use the `intake_checklist` confirmation card; no body generation and no AGENT subject rewrite before confirm.  
11. **Frontend details must not be lost**: when migrating/debugging the reader, follow `frontend_spec.md` (sort, Notes sidebar, full-sentence context locate, multi-doc isolation, **diagram render contract**).  
12. **Do not guess intent**: if the user’s command is not in the routing table, ask first — never start writing files unilaterally.  
13. **Verifiable sources**: before recommending videos/podcasts/papers/data, search to confirm they exist; never fabricate citations. If unsure, mark “needs verification”.  
14. **log table column lock**: once the frontend depends on headers like Concept Ledger in `log.md`, do not rename/reorder columns (see tech_spec).  
15. **Project organization headroom**: single subject / multi-track in one project (related courses) / folder copy (unrelated) are all OK — see `project_lifecycle.md`. Domains like Digital Health can start multi-track in one project and add Tracks as the profile clarifies.  
16. **Visuals only from the arsenal**: Phase 2 uses only Types registered in `visual_arsenal.md`; no invented syntax that causes inconsistent or broken renders.  
17. **Blanks and open answers are mutually exclusive**: never use inline `___` / `__filled__` and `**[Your Answer]**` on the same item (dual input boxes cause grading to read the wrong field). Generation follows tech_spec §1.1; grading prefers inline blanks (see `p3_review.md` §1.1); `validate_content.js` reports dual input.
18. **Phase 0 re-entry guard — never silently re-bootstrap**: before running Phase 0, check whether this project is already initialized. It is if **any** of these hold: `state/log.md` has an `Initialized …` line, the status bar names a subject, or `knowledge/profile.md` has a subject and modality that are not `TBD`.  
    * **Already initialized** → Phase 0 is **patch-only**. Fill `TBD` slots and change what the user asked about. **Never** overwrite a confirmed value, wipe `desire` / `gaps` / `calendar` / `domain_map`, or re-run the full interview without saying plainly “this project is already set up for *[subject]* — do you want to update a few fields, or start a completely new subject?” and getting an answer. Starting a new subject in the same folder is the archive route in `project_lifecycle.md`, not a Phase 0 rerun.  
    * **Not initialized** → run Phase 0 normally.  
    * A user saying “I want to learn X” in an initialized project is far more often a Phase 1 request than a re-bootstrap. Ask; do not assume.
19. **Content format preferences drive Phase 2**: Image density, visual diagram tier, sticky note callouts, and exercise selection are governed by `knowledge/profile.md` section §Content format preferences (see execution details in `p2_generate.md` §0.5). If unchosen, use defaults and inform the user they can be changed; **no preference set may reduce exercise types to a single category** (violating rule 6).

---

## Full learning loop

```
Phase 0  SETUP.md: environment prep → intake → confirmation card → write profile → rewrite AGENT as subject project
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
