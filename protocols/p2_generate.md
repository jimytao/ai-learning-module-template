# Phase 2: Content Generation (p2_generate.md)

> **Trigger**: User confirms a proposal, or “generate magazine”, “write long-form”, “generate unit”, “write textbook”.  
> **Must load**: this file + `protocols/tech_spec.md` + `protocols/visual_arsenal.md` + `knowledge/calendar.md` + `knowledge/modality_presets.md`  
> **On demand**: `knowledge/profile.md` / `knowledge/coach_reference.md` / `state/warehouse.md` / `knowledge/domain_map.md` / `templates/*`

---

## Design philosophy (dual mode + presets)

| Mode | Role | Size | Exercises |
| :--- | :--- | :--- | :--- |
| **Magazine** | Rich input: landscape, mechanisms, data, literature excerpts, narrative insight (popular-science / research reading feel) | Total **2000–3500 words**, fixed **3 articles** (~600–1000 each) | Few by default; optional ≤5 Quick Checks at end |
| **Unit** | Fast textbook: definitions, contrasts, worked examples, interaction, gap fill | **800–2000 words** (T preset may compress to 800–1500) + exercise zone | **Must** include at least three of: blanks, open answers, MCQ, T-F |

> Magazine makes people learn because they want to read; Unit makes people learn because they must practice. Visuals always go through `visual_arsenal.md` (flow/tree/blocks/formula, etc.). **Do not** prop up every concept with photos + tables alone.

---

## 0. Visual arsenal (mandatory awareness)

Before generating, ask: does this piece need at least one diagram for “relation / process / structure”?

- Yes → pick Type via `visual_arsenal.md` §3 decision tree; write declaration header + prescribed syntax.  
- Contrast → `table`; branching process → `flow`; hierarchy → `tree`; module interfaces → `blocks`; geometric sketch → `svg-lite`; real scene → `photo`.  
- **Do not** invent unregistered HTML/SVG/diagram dialects.  
- Final self-check: `visual_arsenal.md` §7.
---

## A. Magazine generation rules

### File

```
content/magazines/magazine[NN]_[topic_slug].md
Example: content/magazines/magazine01_health_systems_overview.md
```

### Structure (required)

```
# [Subject] Learning Magazine
## Magazine.NN: [issue title]
### Block 1: Articles
#### Article A / B / C
##### Informative H5 subheads × 3–4
(after each article) 📚 Key Ideas from This Article
(optional sticky-note: data / literature excerpt / pitfall)
### Block 2: How Do I Apply This? (scenario / phrase bank / action cards, 2–3)
### Block 3: Module from warehouse (optional mini-topic)
### (optional) Block 4: Quick Check — MCQ / T-F (≤5)
```

### Hard article rules

1. **Hook opening**: First paragraph must be a counterintuitive question, a live scene, or suspense — never a flat definition dump.  
2. **Narrative arc**: phenomenon → mechanism/evidence → turn or insight → actionable close.  
3. **Literature / data feel** (for professional subjects): ≥1 verifiable data point, guideline name, classic phrasing, or study takeaway per issue; sticky-note or inline source type (guideline / review / textbook consensus). If unsure, mark “needs verification” and confirm via search after generation — never fabricate citations.  
4. **Key Ideas table**: 4–6 core concepts per article; short gloss, memory hook, one in-context line. Recurrence terms get `🔁`.  
5. **Adaptive**: Weave Phase 1 previewed weaknesses into the prose naturally; do not spoil with heavy bold.  
6. **Images / diagrams**: Photos via `imageQuery`; flow/tree/blocks/formula must follow `visual_arsenal.md` — photos alone are not enough.

### Magazine hard bans

- Long role-play essays or blank-heavy main lines (that’s Unit work)  
- Watered-down structures beyond the agreed blocks  
- Textbook-TOC openings with no hook  

---

## B. Unit (textbook unit) generation rules

### File

```
content/units/unit[NN]_[topic_slug].md
Example: content/units/unit01_acid_base_basics.md
```

### Recommended structure

```
# Unit.NN: [title]
## Part 0: Cold Start Recall (unaided recall of prior 2–3 points)
## Part 1: Core Concepts (5–12, optional visuals)
## Part 2: Guided Questions ([Your Answer])
## Part 3: Worked Scenario / Case (may advance with ___ blanks)
## Part 4: Objective Checks
   - Multiple Choice (≥3)
   - True / False (≥3)
## Part 5: Application Write-up (open production 1–2 items)
## Part 6: Submit & Next (prompt: “grade my work”)
```

### Exercise minimums

| Type | Marker | Minimum (Unit) |
| :--- | :--- | :--- |
| Blank | `___` | ≥3 |
| Open answer | `**[Your Answer]**` | ≥2 |
| MCQ | see tech_spec §MCQ | ≥3 |
| T/F | see tech_spec §True/False | ≥3 |

### Storyline (optional but recommended)

Thread Parts 1→5 with one case / patient / project / experiment timeline. Core concepts must reappear in Scenario and drills.

### Concept entry format

```markdown
### 1. Concept name
- Definition: …
- Why it matters: …
- Easy to confuse: … vs …
- Plain Option (optional): a non-jargon one-liner (reduces term anxiety; mastery still judged by professional phrasing)
<!-- imageQuery: "concrete visual scene 3-6 words" | target: "concept_slug.jpg" -->
<img src="images/concept_slug.jpg" height="150" />
```

> **Plain Option**: from the English-project Basic/Survival Option, generalized for any subject — “say it clearly first, then upgrade terminology”. On grading: correct Plain Option → understanding pass, still show the professional phrasing for passive intake; do not mark “professional expression mastered” from plain speech alone.

---

## C. Post-generation wrap-up (do not skip)

1. Run image download script if this round has `imageQuery`: check X/N; rewrite failed queries and retry.  
2. If a validator exists: run and pass.  
3. Run `node scripts/validate_content.js` (required ✅ when content files exist).  
4. Update `state/log.md`: add a progress row (Unread / Not studied).  
5. Update `knowledge/calendar.md`: issued table + current cursor.  
6. If a warehouse theme was used: mark `[x] used · Magazine/Unit NN`.  
7. Append new concept summaries to `log.md` Concept Ledger (if the table exists).  
8. Update `AGENT.md` top status:

```
**Current status**: `Phase 2 complete — awaiting study` | Magazine/Unit NN | YYYY-MM-DD
> Next: after reading / drills / highlights, say “grade my work” → Phase 3
```
