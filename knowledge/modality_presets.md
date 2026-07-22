# Learning Modality Presets (modality_presets.md)

> Required in Phase 0; Phase 1/2 proposals and generation must follow the current preset.  
> Users may change presets anytime (edit `profile.md` + note in `AGENT.md` status) without a full Bootstrap redo.

---

## Three standard presets + custom

### T — Textbook-first

| Dimension | Setting |
| :--- | :--- |
| Primary output | `content/units/` |
| Pace | Fast: short pieces, lots of interaction, high-frequency feedback |
| Size per session | Unit **800–1500 words** + drills; Magazine **rare or unused** |
| Exercise density | Blanks / open / MCQ / T-F **high** |
| Best for | Music-theory drills, formulas, term speed-runs, pre-exam gap fill |
| Phase 1 default | Propose Units; insert Magazine only when user asks for long-form |

### M — Magazine-first

| Dimension | Setting |
| :--- | :--- |
| Primary output | `content/magazines/` |
| Pace | Slow: popular-science / research long-form, immersive reading |
| Size per session | Magazine **2000–3500 words** (3 articles); Unit **only for exposed gaps** |
| Exercise density | Few in body; optional ≤5 Quick Checks at end; big drills in occasional Units |
| Best for | Subject intros, industry landscape, mechanism narrative, literature-feel input |
| Phase 1 default | Propose Magazines; open a Unit when gap pressure is high |

### H — Hybrid (**blank-template recommended default**)

| Dimension | Setting |
| :--- | :--- |
| Primary output | Big themes → Magazine; consolidate / confuse-pairs / exam → Unit |
| Pace | Medium: read then drill, or same-week Mag+Unit |
| Suggested ratio | About **2 Magazine : 1 Unit** (raise Unit under gap pressure) |
| Best for | Most professional learning (incl. advanced music theory, coursework) |
| Phase 1 default | Each round states “this-round mode”; mixes = two generations or one ordered plan |

### C — Custom

User writes rules, e.g.:

- “Magazine only, never objective items”  
- “Weekday Unit, Weekend Magazine”  
- “First 4 issues all T, then switch to H”  

Write the raw rules into `profile.md` §Learning modality. AI must not change rules unilaterally — only suggest.

---

## Quick comparison

| | T Textbook | M Magazine | H Hybrid |
| :--- | :--- | :--- | :--- |
| Article length | Short | Long | Per round |
| Drill density | High | Low | Medium |
| Hook narrative | Optional | **Required** | Mag required / Unit optional |
| Literature/data stickies | Few | **Encouraged** | Mag encouraged |
| Cold-start recall | **Every Unit** | Optional | Every Unit |
| Default TOC sort tip | Newest first | Newest first | Newest first |

---

## How Phase 1 / 2 read the preset

```
read profile.modality
if T: propose Unit unless user asks for Mag
if M: propose Mag unless gaps_pressure == high → offer Unit (ask user)
if H: choose by topic depth + gaps; state mode in proposal
if C: follow custom rules literally
```

Suggested `gaps_pressure == high`: due gaps ≥ 3, or user clearly says “I want drills”. Even under pressure, **ask before changing modality** (same spirit as “ask before extra drills”: don’t decide pacing for the user).

---

## Switch phrases (for users)

- “Switch to textbook pace” → **T**  
- “Switch to magazine / long-form science reading” → **M**  
- “Back to hybrid” → **H**  
- “Custom: …” → **C** and record the raw text
