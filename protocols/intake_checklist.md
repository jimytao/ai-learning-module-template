# Phase 0 Intake Confirmation Checklist (intake_checklist.md)

> **Mandatory interview sheet for the AI.** Load this file at the start of Phase 0.  
> Goal: before any subject content is generated, clarify the learner and learning style, and get the user to **confirm item by item**.  
> Do not fill the profile by guessing.

---

## How to use

1. AI asks A→G below (may combine into one ask, but no slots omitted).  
2. After answers, AI fills the “confirmation card” echo and asks the user to say “confirm” or point out edits.  
3. **Only after user confirmation** write `profile.md` / `desire.md` / `gaps.md` / `domain_map.md` / `calendar.md`, then run `AGENT.md` “Post-Bootstrap rewrite”.  
4. Before confirmation: discussion and advice are fine, but **do not** generate Magazine/Unit body content.

---

## A. Subject & goals

| # | Must ask | Example prompt | Write to |
| :--- | :--- | :--- | :--- |
| A1 | What will you study? | Single subject name, or domain label (e.g. Digital Health) + whether multi-track | profile + domain_map |
| A1b | If multi-track: initial tracks? Keep related courses in one project? | See `project_lifecycle` form ②; far-apart subjects → copy folder | domain_map Tracks + profile |
| A2 | What should you be able to do when done? (testable) | Analyze chord progressions / read certain abstracts / pass an exam… | profile §Goals |
| A3 | Time horizon | 4-week sprint / one semester / long slow study | profile |

- [ ] User answered  
- [ ] Written (check only after confirm)

---

## B. Level & known

| # | Must ask | Example prompt | Write to |
| :--- | :--- | :--- | :--- |
| B1 | Overall stage | Beginner / some foundation / advanced | profile §Level |
| B2 | Gap between passive understanding and active production | “I get it when I hear it but can’t do it” / “I can recite definitions but can’t use them” | profile |
| B3 | Already strong / already learned | List 3–10 points | profile §Known → domain_map Covered |
| B4 | Related prior courses or scores (optional) | Course names, self-study; write “none” if none | profile |

- [ ] User answered  
- [ ] Written (check only after confirm)

---

## C. Weak spots & blockers

| # | Must ask | Example prompt | Write to |
| :--- | :--- | :--- | :--- |
| C1 | Most feared / most confused points | At least 2 | gaps.md |
| C2 | Things you learned poorly or keep forgetting | May merge with C1 | gaps.md |
| C3 | One thing you most want to fix soon | Used as Wave A P0 | calendar forward queue |

- [ ] User answered  
- [ ] Written (check only after confirm)

---

## D. Interests & motivation

| # | Must ask | Example prompt | Write to |
| :--- | :--- | :--- | :--- |
| D1 | Directions you especially want to go deep | Style, composer, application scene, research topic… | desire.md |
| D2 | Things you have zero interest in / want to avoid | Avoid scheduling landmines | profile notes / desire mark “avoid” |
| D3 | Preferred case types | History stories / formula derivation / clinical cases / work analysis… | profile §Preferences |

- [ ] User answered  
- [ ] Written (check only after confirm)

---

## E. Time & constraints

| # | Must ask | Example prompt | Write to |
| :--- | :--- | :--- | :--- |
| E1 | Weekly time budget | e.g. 3h / 8h | profile |
| E2 | Single study window | e.g. 45–90 min block | profile → affects Unit/Mag size advice |
| E3 | Content language | Chinese / English / bilingual | profile |
| E4 | Other constraints | Device, accessibility, deadlines | profile |

- [ ] User answered  
- [ ] Written (check only after confirm)

---

## F. Learning modality preset (pick one; changeable later)

> Full definitions: `knowledge/modality_presets.md`. Here only confirm the choice.

| Code | Name | One-liner | When to pick |
| :--- | :--- | :--- | :--- |
| **T** | Textbook-first | Short, fast, drill-dense, strong gap-fill | Concept drills, exam prep, skill practice |
| **M** | Magazine-first | Long, slow, popular-science / research reading | Build intuition, landscape, mechanism narrative |
| **H** | Hybrid (recommended default) | Magazine carries big themes; Unit carries drills | Most professional learning |
| **C** | Custom | User-defined mix (must write rules) | Clear special needs |

User choice: `T / M / H / C` → ______

- [ ] User explicitly chose (or accepted AI recommendation and confirmed)  
- [ ] Written to `profile.md` §Learning modality  

**Switch rule**: later, if user says “make it more textbook / magazine” → update profile + note new preset in `AGENT.md` status area; **no full Phase 0 rerun**, but Phase 1 proposals follow the new preset from the next round.

---

## G. Frontend & reading habits (optional, recommended)

| # | Ask | Default | Write to |
| :--- | :--- | :--- | :--- |
| G1 | TOC default sort | **Newest first** (switchable to oldest first) | profile §Reader prefs |
| G2 | Notes sidebar default | Only notes for the **currently open doc** (switchable to “all”) | same |
| G3 | Grading tone | Concise / detailed | same |

See `protocols/frontend_spec.md`. Before the frontend is migrated, still write these prefs into profile for later use.

---

## Confirmation card template (AI must output; wait for “confirm”)

```markdown
## Phase 0 Confirmation Card — please verify

**Subject**: …  
**Organization**: single subject / multi-track in one project / …  
**Tracks**: … (if any)  
**Goals (testable)**: …  
**Level**: …｜Known: …  
**Gaps (will enter gaps)**: 1.… 2.…  
**Interests**: …  
**Time**: weekly …｜session …  
**Language**: …  
**Learning modality preset**: T / M / H / C = …  
**Reader prefs**: sort…｜Notes scope…  

Pending / TBD: …  
```

After user says “confirm” → write + continue `p0_bootstrap.md` + **AGENT rewrite** (see `AGENT.md` “Post-Bootstrap rewrite”).
