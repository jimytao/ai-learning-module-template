# Technical Spec (tech_spec.md)

> Must load before writing files in Phase 2 / Phase 3.  
> This file constrains “what formats the previewer / parser / notes.json can handle correctly” — not teaching content.  
> **Diagrams (flow/tree/blocks/SVG, etc.)** are defined in and must follow: `protocols/visual_arsenal.md` (not duplicated here, to avoid two standards).

---

## 1. Inline blanks

| Use | Syntax | Result |
| :--- | :--- | :--- |
| Empty blank | `___` (≥3 underscores) | Input box |
| Filled display | `__answer text__` | Filled box |
| Task check | `[ ]` / `[x]` | checkbox |

**Banned**:

- Using `__` for an empty blank (parsed as empty filled value)  
- Putting `___` inside code fences / sticky-notes  
- Long pure underscored decorative answer lines  
- **Putting inline blanks (`___` / `__filled__`) and `**[Your Answer]**` on the same item** (see §1.1)

Dialogue blanks go in body prose (not inside \`\`\` fences):

```markdown
Mentor: What is the first step?
You: ___ (✏️ answer with today’s concept)
```

### 1.1 Blanks vs open answers: mutually exclusive (hard rule — prevents dual input boxes)

> Real failure from a source project: the sentence already had `__into__` blanks, then an empty `* **[Your Answer]**:` was added below → UI showed **two input boxes**; grading read only the empty textarea and marked “unanswered”.

| Intent | Use only | Do not also add |
| :--- | :--- | :--- |
| In-sentence / dialogue short blanks (words, prepositions, terms) | `___` or write-back `__answer__` | `**[Your Answer]**` |
| Multi-sentence open production, explanations, case write-ups | `**[Your Answer]**` | Another `___` as the “main answer box” under the same stem |

**Wrong (banned)**:

```markdown
#### Exercise 1 — Prepositions
She walked __into__ the room and looked __over__ the notes.
*   **[Your Answer]**:
```

**Correct (blanks)**:

```markdown
#### Exercise 1 — Prepositions
She walked ___ the room and looked ___ the notes.
```

**Correct (open item, separate exercise)**:

```markdown
#### Exercise 2 — Explain
Why does the preposition change the meaning here?
*   **[Your Answer]**:
```

Different Parts / different exercise numbers may use blanks or open answers separately; **never stack both controls in the same exercise block**.

---

## 2. Open answers (`[Your Answer]`)

```markdown
*   **[Your Answer]**:

*   **[Your Answer]** (✏️ hint text):
```

Following lines indented 4 spaces become the textarea initial value. Do not hand-write `<textarea>`.  
**Do not** append this marker under an item that already has `___` / `__filled__`.

---

## 3. Multiple choice (MCQ) — template standard

### 3.1 Syntax

```markdown
#### MCQ-1
Stem: Which of the following about X is correct?
- [ ] A. Distractor
- [ ] B. Correct answer
- [ ] C. Distractor
- [ ] D. Distractor
<!-- answer: B | rationale: one-line evidence pointing to body concept Y -->
```

Rules:

- Exactly one correct option (single choice).  
- When answering, user changes the chosen item to `- [x]`, others stay `[ ]`.  
- `<!-- answer: ... -->` is **for AI grading only**; may be hidden in preview; never put the answer in clear text next to the stem.  
- Distractors must sound plausible — test discrimination, not word games.

### 3.2 Volume

Unit: ≥3. Magazine Quick Check: 0–5.

---

## 4. True / False — template standard

```markdown
#### TF-1
Statement: … (complete declarative sentence)
- [ ] True
- [ ] False
<!-- answer: False | flaw: treats correlation as causation / overbroad scope / … -->
```

Rules:

- Statement must be decidable; avoid vague “sometimes / maybe” unless the item tests qualifiers.  
- False items must spell the flaw in `flaw` for Phase 3 explanation.  
- User checks only one of True or False as `[x]`.

---

## 5. Markdown table rules

```markdown
| Name | What It Is | Notes |
| :--- | :--- | :--- |
| Term | … | … |
```

- Must have header + alignment separator; column count matches header per row  
- No multi-paragraph unclosed HTML / complex lists inside cells  
- Once Key Ideas / Concept Ledger is parsed by the frontend, **column names and order are locked** (changing columns breaks the sidebar)

---

## 6. Images (imageQuery)

Every downloadable image needs a **paired two-line** pattern:

```markdown
<!-- imageQuery: "person reading lab report at desk" | target: "lab_report.jpg" -->
<img src="images/lab_report.jpg" height="150" />
```

Or for Magazine covers:

```markdown
<!-- imageQuery: "…" | target: "magazine01_feature.jpg" -->
![Feature](images/magazine01_feature.jpg)
```

| Rule | Note |
| :--- | :--- |
| Query 3–6 English words | Too short / abstract fails |
| Scene: person + action + object | Avoid `concept` / `idea` |
| target lowercase + underscores | Must match src filename exactly |
| Store under `images/` | Do not scatter under content subdirs |

On download failure: make `imageQuery` more concrete and retry, max 3 times.

---

## 7. Sticky Note (magazine callouts)

```html
<div class="sticky-note">
  <h4>Title</h4>
  <p>Short content. May include data or literature hints.</p>
</div>
```

Literature/data notes may use `class="sticky-note science-note"`.  
Only basic tags inside; **no** `___`, MCQ, or `[Your Answer]`.

---

## 8. Grading HTML whitelist

```html
<details class="feedback-panel fp-pass|fp-warn|fp-fail" open>
<summary>…</summary>
<div class="feedback-body">…</div>
</details>

<span class="err" title="reason">…</span>
<span class="fix">…</span>
<span class="warn" title="upgrade note">…</span>
<div class="grading-section">…</div>
<div class="correction-line">…</div>
```

Banned: `<script>`, `<style>`, native `<textarea>`, `__` inside `title`.

---

## 9. notes.json Schema

```json
{
  "id": "note_<timestamp>_<rand>",
  "file": "content/magazines/magazine01_xxx.md",
  "word": "contiguous selected text (within one block, no newlines)",
  "note": "user-visible composed content (if frontend-managed, AI must not overwrite)",
  "userNoteRaw": "raw user note (AI must never overwrite)",
  "isHighlight": true,
  "time": "ISO-8601",
  "context": "full sentence or block paragraph (frontend-forced; for precise locate + grading context)",
  "contextOffset": 0,
  "aiReview": {
    "grade": "A|B|C|N",
    "isCorrect": true,
    "correctedMeaning": "more precise gloss",
    "explanation": "explanation bound to context",
    "memoryAid": "memory hook",
    "misconception": "if misconception, spell it; else empty string"
  }
}
```

Hard rules:

- AI **only writes / updates `aiReview`** (and explicitly allowed summary nodes).  
- **Never** overwrite `userNoteRaw`; if the project says frontend owns `note`, AI does not write `note` either.  
- **Never** delete or clear frontend-written `context` / `contextOffset`.  
- `word` must not cross paragraphs or contain `\n`.  
- No unescaped newlines inside JSON strings.  
- Grading must bind to `context`.  
- Notes starting with `+` = Explicit Lookup Flag — highest recurrence weight.  
- Issue summary node:

```json
{
  "id": "summary-<ts>",
  "file": "content/…",
  "type": "content_summary",
  "summary": "mastery and retrospective text",
  "time": "ISO-8601"
}
```

### 9.1 Smart Merge (when server saves notes)

- Preserve existing `aiReview`; do not let a full frontend overwrite wipe it  
- Preserve `type: content_summary` if this payload does not include it  
- Merge by `id`; never blindly overwrite the whole file  

---

## 10. File naming

| Type | Path |
| :--- | :--- |
| Magazine | `content/magazines/magazine[NN]_[slug].md` |
| Unit | `content/units/unit[NN]_[slug].md` |
| Remediation | `content/units/unit[NN]_remediation.md` or end-of-file section |

Do not skip heading levels (no H4 right after H2) — breaks TOC.

---

## 11. Phase 2 wrap-up checklist

```
[ ] All imageQuery downloaded or failures marked
[ ] Every diagram has <!-- visual: … --> and Type is in visual_arsenal
[ ] All MCQ/T-F include <!-- answer: … --> for grading
[ ] No illegal ___; no “same item ___ + [Your Answer]” dual input (validate reports dual input)
[ ] node scripts/validate_content.js passes
[ ] calendar.md / log.md / AGENT.md updated
[ ] warehouse marked (if used)
```
