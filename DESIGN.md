# Design Notes Distilled from Two Source Projects (DESIGN.md)

> This document explains: what core logic from two English-learning projects is **truly reusable**, how it was generalized into a subject-agnostic template, and how files in this repo collaborate.  
> Removed: English-specific content, Melbourne life scenes, and private profile data (scores / interests / blogs).

---

## 1. What each source project did

### A. English learning for Melbourne ≈ **Unit / Textbook engine**

| Layer | Role |
| :--- | :--- |
| `AGENT.md` | Sole entry + task routing — stops AI from bulk-loading huge files |
| `protocols/p1–p3 + tech_spec` | Executable rules: propose → generate lesson → grade |
| `state/` (calendar, log, desire, worries) | Daily read/write of progress, pain points, wishes |
| `knowledge/` (plan + specialized knowledge) | Profile, outline, deep references loaded on demand |
| `docs/WeekN/DayXX_*.md` | Outputs: scene threads + vocab + blanks + open answers |
| `notes.json` + preview frontend | Highlights/notes → AI writes explanations back |
| Image scripts + validate | Generation wrap-up automation |

**Strengths**: storyline threading, productive drills (`___` / `[Your Answer]`), rigorous grading (passive understanding vs active production), weakness Kanban, cold-start recall, post-grade state write-back.

**Limits (for professional learning)**: sized for “daily fragment lessons”; long literature feel / industry-landscape narrative is not its home field.

### B. Melbourne culture magazine ≈ **Magazine / rich-input engine**

| Layer | Role |
| :--- | :--- |
| Same AGENT + three-phase protocols | Isomorphic with A — lower cognitive load |
| `desire` / `calendar` / `plan` duty split | Want ≠ progress ≠ outdated idea bank |
| `issues/magazineXX_*.md` | 2000–3500 words, 3 articles, hook openings + narrative arc + sticky-notes |
| Weaknesses from `notes.json` recur into the next issue | Reading blockers auto-enter the queue; `+` marks highest priority |
| Magazines deliberately de-emphasize big drills | Input immersion; drilling belongs to the other project |

**Strengths**: long-form readability rules, editorial-calendar authority, annotation-driven adaptive recurrence, concept ledger, clear cross-doc duties.

**Limits**: almost no MCQ / T-F / blank main line; alone it cannot support “learn and be tested”.

### Shared skeleton already proven

```
AGENT entry router
  → Phase1 propose (read progress + desire + weaknesses)
  → Phase2 generate (hard format rules + images + state write-back)
  → user studies / annotates
  → Phase3 grade (inline + notes.aiReview + gaps/log write-back)
  → next Phase1
```

That is the “operating system” this template keeps. Swap the content domain to any professional subject.

---

## 2. Core elements after de-Englishing

### 2.1 Operating-system layer (must keep)

1. **Single entry router** — every task starts with `AGENT.md`  
2. **Four-layer directories** — `protocols` / `knowledge` / `state` / `content`  
3. **Three-phase loop** — propose → generate → grade (this template adds **Phase 0 Bootstrap**)  
4. **Document duty boundaries** — calendar = progress, desire = wants, gaps = weaknesses, profile = level, domain_map = subject tree  
5. **Load on demand** — prevent context bloat  
6. **tech_spec** — hard constraints for interactive format and JSON fields  
7. **State write-back discipline** — each Phase end must move pointers or the loop breaks  

### 2.2 Content layer (must keep; modality mix adjustable)

| Source practice | General form in this template |
| :--- | :--- |
| Daily lesson Parts | **Unit**: short textbook + high-intensity drills |
| Magazine 3 articles + hooks + narrative arc | **Magazine**: professional long-form (landscape/mechanism/data/literature feel) |
| Vocab + memory imagery | **Key Ideas / Concept** tables + memory paradigms |
| Sticky notes | Data / guideline / pitfall stickies |
| imageQuery images | Kept |
| Storyline scene threading | Case timelines (patient/project/experiment) |
| Cold start recall | Part 0 unaided recall |
| Weakness recurrence over 2–3 issues + decay | Fully kept |
| `+` explicit lookup flag | Fully kept |
| Anti-praise / ability layers | Fully kept, extended to MCQ≠mastery |

### 2.3 Interaction layer (keep + enhance)

| Already had | Added in this template |
| :--- | :--- |
| `___` blanks | **MCQ** (`- [ ] A/B/C/D` + HTML comment answers) |
| `[Your Answer]` open items | **True/False** (+ `flaw` for wrong cause) |
| Highlight notes → AI explain | **Extra drills after correction** (Remediation Drill) |
| feedback-panel grading | Explicit “recognition vs production” split reports |

### 2.4 Explicitly deleted / not migrated

- IELTS scores, personal interest lists, city-survival scenes, speech-rhythm markers (`//` `↗↘`)  
- Aussie slang / preposition imagery banks and other English-only knowledge  
- Cross-project hardcoded paths  
- Personal plan numbers like “must study 4–6 hours daily”  
- Treating an outdated `plan.md` as a day calendar (calendar is authoritative; this template uses `domain_map` + `calendar`, no fake Day01–30 progress)

---

## 3. Key upgrades vs the source projects

### 3.1 Phase 0 Bootstrap + intake confirmation checklist

Source profiles were hardcoded. The template instead:

1. AI loads `protocols/intake_checklist.md` and collects slots A–G (subject/level/gaps/interests/time/**modality preset**/reader prefs).  
2. Outputs a confirmation card; **writes only after the user confirms**.  
3. After write, follows `AGENT.md` “Post-Bootstrap rewrite” to turn this file from a blank template into **this subject’s learning project** (title, status, slim Phase 0 routing, etc.).

### 3.2 Switchable learning modality presets

`knowledge/modality_presets.md` ships:

| Code | Meaning |
| :--- | :--- |
| **T** | Textbook-first: short, fast, drill-dense |
| **M** | Magazine-first: long, slow, popular-science / research reading feel |
| **H** | Hybrid: recommended default — Mag carries themes + Unit consolidates |
| **C** | Custom: user-defined rules |

Later, “make it more textbook/magazine” switches without a full Phase 0 rerun.

### 3.3 Magazine / Unit dual mode (preset-driven)

| Need | Mode |
| :--- | :--- |
| Industry landscape, mechanisms, data, literature excerpts, intuition | Magazine |
| Solid definitions, confuse-pairs, gap fill, exam-style drills | Unit |
| Big-theme weeks | Mag first, then Unit |

Exact mix comes from the current **T/M/H/C** preset — not a hard “always Mag-primary”.

### 3.4 Objective items filled in

Source textbook already had blanks and open answers; magazine once had T/F then removed them. Professional learning needs a fast “did you understand?” check, so **Units require MCQ+T/F**, Magazines only optional Quick Check, and the grading protocol locks: all objective correct ≠ can apply.

### 3.5 Stronger grading loop

Keep inline HTML grading + notes.aiReview, and standardize:

1. Remediation explanation (cause, not just answer)  
2. Write gaps  
3. **Ask first** about extra drills → only after clear consent generate a mini “more drills” patch (no auto-drills after grading; no ask-and-generate in the same reply)

### 3.6 Reader details must be kept

See `protocols/frontend_spec.md`: TOC newest/oldest, Notes sidebar + click jump, multi-doc `file` isolation, annotations force full-sentence `context` + `contextOffset`, internal protocol files stay out of the reading TOC. Accept against that file when migrating the frontend.

---

## 4. Logical workflow (for future AI / you)

```
[User] I want to learn 《subject》…
        ↓
Phase 0  intake checklist → confirmation card → write profile/modality → rewrite AGENT as subject project
        ↓
Phase 1  propose by T/M/H/C + gaps/notes
        ↓ confirm
Phase 2  generate from skeleton → download images → update calendar/log
        ↓
[User] read / drill / highlight (context full-sentence locate → notes.json)
        ↓
Phase 3  grade → write back → **ask about extra drills** → (only if agreed) more items
        ↓
back to Phase 1
```

### Phase 1 decision pseudocode

```
candidates = uncovered Core(domain_map)
           ∪ unchecked desire
           ∪ due gaps
           ∪ notes weakness queue

if needs_rich_context(candidate): mode = Magazine
elif needs_drill(candidate):       mode = Unit
else:                             mode = Magazine then Unit

proposal = pick(top by P0 gaps + Core dependency + user intent)
wait for confirm
```

---

## 5. Repo mapping table

| Source concept | Template path |
| :--- | :--- |
| AGENT router | `AGENT.md` (rewritten to subject mode after Bootstrap) |
| (new) Intake confirm | `protocols/intake_checklist.md` |
| p0–p3/tech_spec | `protocols/*` |
| (new) Reader spec | `protocols/frontend_spec.md` |
| (new) Modality presets | `knowledge/modality_presets.md` |
| plan user profile | `knowledge/profile.md` |
| desire / calendar | `knowledge/desire.md` / `calendar.md` |
| Subject tree | `knowledge/domain_map.md` |
| worries | `state/gaps.md` |
| log / warehouse | `state/log.md` / `warehouse.md` |
| docs / issues | `content/units/` · `content/magazines/` |
| notes + context | `notes.json` (full-sentence context locate) |

---

## 6. How to use this blank template

1. Open this repo in Cursor and tell the AI: “Follow AGENT.md and run Phase 0 / bootstrap.”  
2. AI asks subject, level, gaps, interests, time, **T/M/H/C modality**, etc. via `intake_checklist.md`, then shows a confirmation card.  
3. You say “confirm” → AI writes the profile and **rewrites AGENT into this subject’s project**.  
4. Say “schedule” → confirm proposal → “start generating”.  
5. Read in the preview frontend (after migrate it must meet `frontend_spec.md`: sort, Notes jump, context locate, multi-doc isolation).  
6. “Grade my work”; extra drills only after being asked and agreeing.

---

## 7. Design tradeoffs & known deferrals

### Consciously not doing / deferred

| Item | Why |
| :--- | :--- |
| Shipping the full preview frontend | Large, path-coupled; spec lives in `frontend_spec.md` — accept against the checklist on migrate |
| Audio / TTS / shadowing | English-specific; other subjects can add optional modules later |
| Cross-repo hardcoded coupling | Subject projects should be self-contained; multi-subject via folder copy (`project_lifecycle.md`) |
| Personal blog as profile source | Privacy and subject-irrelevant |

### Gaps already filled in this audit round

- `project_lifecycle.md` (copy new subject / archive)  
- `review.md` + Phase 3 append  
- `validate_content.js`  
- Routing: update profile / Knowledge Query / new subject  
- Golden rules: don’t guess intent, verifiable sources, log column lock, new-subject copy  
- Mag weakness → Unit consolidate link; warehouse status each issue  
- Plain Option; Smart Merge; TOC lifecycle aligned with word selection  
- GFM table rules  
- **`visual_arsenal.md` + `viz.css`**: flow/tree/seq/state/blocks/SVG-lite/formula; frontend render contract; validator checks declaration headers  

### “One course one folder” vs multi-track

Three legal forms (see `project_lifecycle.md`):

1. One project, one subject  
2. **One project, multi-track** (related courses, e.g. several Digital Health modules — add Tracks as the profile clarifies)  
3. Unrelated courses → copy folders to isolate  

Both “one customized copy per course” and “related courses together” are supported — pick as needed.

---

## 8. Final checklist (anything missing?)

### Protocols / learning loop — complete

- [x] AGENT routing + Phase 0–3 + ask before extra drills  
- [x] Intake confirmation card, modality T/M/H/C, Bootstrap rewrite of AGENT  
- [x] calendar / desire / gaps / domain_map / log / warehouse  
- [x] Magazine + Unit dual mode and skeletons  
- [x] MCQ / T-F / blanks / open + tech_spec  
- [x] notes context locate, review.md, validate_content  
- [x] visual_arsenal + viz.css + frontend render contract  
- [x] Single subject / multi-track / folder copy organization  

### Consciously deferred (known, not missing design)

- [ ] Full preview frontend migrate (`index.html` / server / Mermaid) — spec ready  
- [ ] Math KaTeX (arsenal already has `formula`; engine optional)  
- [ ] Audio / TTS (not default)  
- [ ] Auto protocol-sync script between mother template and subject projects  

### Optional enhancements (fine to add when actually using Digital Health)

- Track grouping/filters in the sidebar (frontend)  
- Small citation DB for papers/guidelines  
- Export a weekly learning report  

**Conclusion**: as a blank template, protocols and content specs are usable now; the largest remaining physical gap is still the **reader implementation**, not more MD rules.

---

## 8. One-sentence summary

> **Keep the OS of “AGENT routing + state-machine loop + annotation-driven recurrence + rigorous grading”; turn the content engine into “Magazine-rich input primary, Unit drills secondary”; use Phase 0 to make personal profile fillable blank slots; add MCQ/T-F; after correction, extra drills require asking and clear consent before generation.**

That is the general template distilled from two English projects into `learningTextbookModule`.
