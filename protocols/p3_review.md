# Phase 3: Grading, Annotations, Remediation & Extra Drills (p3_review.md)

> **Trigger**: “grade my work”, “explain highlights”, “correct this”, “give me more drills”.  
> **Must load**: this file + `protocols/tech_spec.md` + current content file + `notes.json`  
> **On demand**: `state/log.md` / `state/gaps.md` / `knowledge/coach_reference.md`

---

## Step 1: Pre-flight

1. Confirm current file path (magazine or unit).  
2. Filter `notes.json` to all annotations for that file; read `context` for situated feedback.  
3. Read user answers (**must follow the extraction priority below**, see §1.1).  
4. Read `log.md` Hard Points and current `gaps.md` items — avoid repetitive fluff; align mastery judgment.

### 1.1 Answer extraction priority (prevents dual-box false negatives)

For **each item**, decide the control type, then take the answer:

| Priority | Scan for | Treat as |
| :--- | :--- | :--- |
| 1 (highest) | In-stem `__filled text__` or still-empty `___` | **Blank** primary answers; filled words = user response |
| 2 | `**[Your Answer]**` and following content in the same block | Primary answer **only if this item has no inline blanks** |
| 3 | MCQ / T-F `- [x]` | Objective answers |

**Hard rules**:

- If the same block has inline blanks **and** an empty `* **[Your Answer]**:` → **trust the inline blanks**; do not mark “0 / unanswered” because the textarea is empty. Note in the summary: “dual controls detected; ignored redundant textarea; generation side should delete it.”  
- Never scan only `[Your Answer]` and miss in-sentence filled `__word__`.  
- If legacy content still has dual controls: grade by the blanks, and suggest (or after user consent) delete the redundant `[Your Answer]` line.

---

## Step 2: Grading standards

### 2.0 Rigorous assessment (mandatory)

- No baseless praise.  
- **All MCQ / T-F correct** → record only as “recognition / discrimination pass”, never “can explain or apply”.  
- **Correct under heavy template prompts** → note in summary “prompt-assisted; does not count as independent mastery”.  
- Open answers and blanks are the main evidence of active production.

### 2.1 By exercise type

| Type | Grading action |
| :--- | :--- |
| Blank | Use `__filled__` / `___`; mark every substantive error; give Model Answer; score (e.g. 2/2) |
| Open | Read `[Your Answer]` only when there are no inline blanks; mark errors + Model Answer + score |
| MCQ | Right/wrong; if wrong: why distractors tempt + evidence for correct option (bind to body concepts) |
| T/F | Right/wrong; if False: which qualifier / causality / scope is wrong |
| Highlight / note | see §2.2 |

### 2.2 Annotation answers (notes.json)

For each annotation write a **context-bound** explanation (never a dictionary dump):

1. Respond to the user’s note (correct / partial / wrong / highlight-only)  
2. Use `context` to explain the role in this sentence  
3. Give a memory hook (etymology / analogy / contrast / image)  
4. Give one transferable example sentence or application tip  

**Write rules**: only fields allowed by tech_spec (prefer unified `aiReview`; never overwrite user `note` / `userNoteRaw`).

Grade guide:

| Grade | Condition |
| :--- | :--- |
| A | Note fully fits the context |
| B | Roughly right but imprecise / with `?` |
| C | Wrong or seriously misleading |
| N | Highlight only, no note |

Mastery (optional): \((A + 0.5B) / (A+B+C)\)

### 2.3 Post-error explanation

If the user was wrong:

1. Inline feedback panel: error cause + correct reasoning (not just the answer).  
2. Write / update `gaps.md` (Target = recur in next 1–3 issues).  
3. Summarize in chat with a “one-line rule” — fix thinking, not only wording.

### 2.4 Extra drills after correction (hard: must ask first)

> ⚠️ **Hard rule (do not violate)**  
> After grading / remediation explanation, **do not** immediately generate extra drills, Remediation Drills, variant sets, or any “another round”.  
> **Must ask first** whether the user wants more drills on the mistakes, and **wait for clear consent** before generating.  
> Even if errors are many or the AI thinks drills are needed, you may only “propose and ask” — never start writing unilaterally.

**Only enter drill generation when one of these is true:**

1. At wrap-up the AI asked (e.g. “Want a few remediation drills on these mistakes?”) and the user clearly agreed (“yes”, “more drills”, “give me some”); or  
2. The user initiates “more drills” / “remediation” / “drills on the mistakes”.

**Banned:**

- Auto-generate drills when errors ≥ N  
- In the same reply, ask once then immediately append a full new set (asking still requires stopping for the next turn)  
- Slip drills into the grading summary or inline panels without asking  

**After user consent**, generate a **mini remediation patch** (append `## Remediation Drill` to the current file, or new `unitXX_remediation.md`):

- On this round’s mistakes: 2 MCQ + 1 T/F + 1 short open  
- Change surface scenario; test the same mechanism  
- Completing it may re-trigger Phase 3 (grade the patch only); if more drills are wanted after that, **ask again first**
---

## Step 3: Write format

### 3.1 Inline feedback under the item

```html
<details class="feedback-panel fp-warn" open>
<summary>⚠️ AI Coach: 3/5 — brief issue list</summary>
<div class="feedback-body">

**Marked original:**
<div class="grading-section">
… <span class="err" title="reason">wrong span</span> …
</div>

**✅ Corrected:**
<div class="correction-line">
… <span class="fix">fix</span> …
</div>

</div>
</details>
```

| Case | class | open |
| :--- | :--- | :--- |
| Has errors | `fp-warn` / `fp-fail` | add `open` |
| All correct | `fp-pass` | no `open` |

### 3.2 End-of-file summary

```markdown
## AI Coach Grading Summary — YYYY-MM-DD
- Objective: MCQ x/y · T/F x/y (recognition layer)
- Production: key points …
- Annotations: A/B/C/N counts and mastery
- New gaps written: …
- Suggested next recurrence: …
```

### 3.3 Chat summary

One score line + one takeaway per item; list new Hard Points; remind to refresh preview for full annotations.

---

## Step 4: Post-Correction Commit (do not skip)

1. Write back `notes.json` `aiReview` (and other protocol-allowed fields).  
2. Append a section to `review.md` for this round (see that file’s template).  
3. Update `state/log.md`: progress Status, Retro, new Hard Points rows, Concept Ledger if needed.  
4. Update `state/gaps.md`: status transitions (see mastery rules in gaps).  
5. Update `knowledge/calendar.md`: that issue Status → Read / Reviewed.  
6. If a desire topic is substantially covered: check it or note “covered in Mag/Unit NN”.  
7. Run `node scripts/validate_content.js` (ensure grading HTML did not break interactive format).  
8. Update `AGENT.md` top to `Phase 3 complete`, next step → Phase 1.

---

## Chat wrap-up prompt template

```
Grading complete.
- Recognition: MCQ … · T/F …
- Production: …
- Annotation mastery: …%

Want a few remediation drills on these mistakes?
(Say “yes” or “more drills” if so; otherwise I’ll still log weaknesses in gaps for later scheduling.)

For the next schedule, say “what should I study today”.
```

> The “Want…” line is a **question**. End the turn here. Do not attach new drills until consent.
