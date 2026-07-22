# Reader / Frontend Spec (frontend_spec.md)

> Must-keep product details distilled from the English Learning previewer and Culture Magazine reader.  
> This repo is Markdown + protocols first; when migrating or rebuilding the frontend, **accept against this file** — do not drop behaviors.

---

## 1. Content sources & isolation (anti-mix)

| Rule | Note |
| :--- | :--- |
| Learning content only | Sidebar TOC lists only `content/magazines/*.md` and `content/units/*.md` |
| Hide internal files | Never put `protocols/` `knowledge/` `state/` `scripts/` `DESIGN.md` `AGENT.md` in the reading TOC |
| Clear grouping | Suggest two groups: `Magazines` / `Units` (or by number); highlight the open item |
| Notes isolated per file | Every `notes.json` entry must have `file` (or compatible `issue`) pointing to **that** md |
| Default: current-file notes only | Notes sidebar default `showAll = false`; render only `file === current path` |
| Optional “all notes” | Provide a toggle for cross-doc notes; default off to avoid multi-issue mixups |
| Grading filtered by file | Phase 3 / frontend AI annotations also filter by current `file` |

Once generated, do not casually rename paths; if you must, sync every matching `file` in `notes.json`.

---

## 2. TOC sort (newest first / oldest first)

| Rule | Note |
| :--- | :--- |
| Toggleable | Sidebar sort button: `old → new` / `new → old` |
| Default | **new → old** (`desc`) for continuing the latest issue/unit |
| Persist | `localStorage` (suggested key: `ltm_sort_order`) |
| Sort key | Prefer `magazineNN` / `unitNN` in filename; else mtime |

Both source projects implemented this toggle; keep the same interaction on migrate.

---

## 3. Sidebar structure (suggested three tabs)

| Tab | Content | Behavior |
| :--- | :--- | :--- |
| **Contents** | Magazines + Units list | Click opens md; current item active |
| **Concepts** | Concepts from current piece or `log.md` Concept Ledger | Click jumps to in-doc heading / anchor |
| **Notes** | Highlights & notes for current file (or all) | Click jumps to annotation in body and opens edit float |

- New note created → **appears immediately in Notes Tab** (refresh list after saving `notes.json`).  
- Concepts / Notes jumps must be stable: depend on heading format and annotation spans; generators follow `tech_spec.md`.

---

## 4. Annotations: create with context (mandatory)

> Storing `word` alone is not enough: the same word may appear many times; grading also loses context.

On create, the frontend must silently write:

| Field | Meaning |
| :--- | :--- |
| `word` | Contiguous selected text (within one block, no newlines) |
| `context` | **Full sentence or current block paragraph** (prefer whole sentence; at least the `<p>`/`<li>` text) |
| `contextOffset` | Start char offset of `word` inside `context` |
| `file` | Relative path of current doc |
| `userNoteRaw` / `note` | User note (AI never overwrites raw) |

Locate priority:

1. Find DOM block where `blockText === context`, then locate with `word` + `contextOffset`  
2. If no `context` (legacy): fall back to full-doc search on `word` (ambiguous — avoid missing context on new data)  
3. Notes list order: prefer document physical order; else by time

**Generation avoidances** (same as source projects):

- Do not put critical terms only inside code fences / across sticky-note boundaries (cannot highlight)  
- `word` must not cross paragraphs  

Phase 3 grading: **must use `context` for situated explanation** — no dictionary dumps.

---

## 5. Click-to-jump experience

| Scene | Expectation |
| :--- | :--- |
| Click a Notes item | Scroll to body annotation → brief highlight flash → open edit float (if any) |
| Click a Concepts item | Scroll to concept heading (Unit `### N. Name` or Mag Key Ideas anchor) |
| Click a TOC item | Load that md; Notes/Concepts switch to that file’s data; never clear other files’ `notes.json` |

---

## 6. Interactive elements & autosave

The frontend must parse interactive Markdown elements, render HTML controls, and on user input/check **realtime autosave answers back into the source Markdown**.

### 6.1 Parse & render rules

| Element | Markdown | HTML render | Parse / write-back |
| :--- | :--- | :--- | :--- |
| **Empty blank** | `___` (≥3 underscores) | `<input type="text" class="interactive-blank" data-index="N" />` | **Parse**: replace underscore runs with inputs.<br>**Write-back**: on change, replace N-th `___` in memory Markdown with `__user answer__` (double underscores wrap the answer). |
| **Filled blank** | `__filled content__` | `<input type="text" class="interactive-blank" data-index="N" value="filled content" />` | **Parse**: double-underscore wraps → input with default value.<br>**Write-back**: update to `__new content__`; if cleared, degrade back to `___`. |
| **Open answer** | `**[Your Answer]**` or `**[Your Answer]**: (answer)` | `<textarea class="interactive-textarea" data-index="N">answer</textarea>` | **Parse**: match `**[Your Answer]**` at line start or list item; text after colon/in parens is initial value.<br>**Write-back**: update after `**[Your Answer]**:` to `(user answer)` or trailing answer, keeping Markdown structure. |
| **Choice / T-F** | `- [ ]` or `- [x]` | `<input type="checkbox" class="interactive-checkbox" data-index="N" />` | **Parse**: standard Markdown task list → checkbox.<br>**Write-back**: toggle `[ ]` ↔ `[x]` at the matching position. |

### 6.2 Autosave flow

1. **In-memory copy**: after loading Markdown, keep a raw Markdown string in memory.  
2. **Listen + debounce**: listen to `input` / `change` on all interactive controls. Use **debounce (suggested 500–1000ms)** to avoid flooding the backend.  
3. **Full write-back**: on debounce fire, run replace algorithm on the in-memory string, then `POST /api/save`.  
4. **API contract**:
   * **Path**: `/api/save`
   * **Payload**: `{ path: "content/units/unit01.md", content: "full updated Markdown…" }`
   * **Backend**: validate `path` safety, then overwrite the source file.
5. **Grading panel render**:
   * Results wrap in `details.feedback-panel`.
   * Errors use `<span class="err">wrong</span>` and `<span class="fix">fix</span>`; frontend must preserve and render these tags.

---

## 7. Multi-doc rules & Universal Reader fusion

On new-project init, the frontend must fuse **Magazine mode** and **Unit mode** into one Universal Reader SPA.

### 7.1 Layout

```
+-----------------------------------------------------------------------+
|  LOGO  [Universal Reader]          [current issue/unit title]  [save/export/theme] |
+------------------------------------+----------------------------------+
| Sidebar                            | Main Viewport                    |
|                                    |                                  |
| +--------------------------------+ | +------------------------------+ |
| | Tab 1: Contents                | | |                              | |
| | - Magazines (newest→oldest)    | | |   Rendered Markdown          | |
| | - Units (optional week groups) | | |   (blanks, choices, answers) | |
| +--------------------------------+ | |                              | |
| | Tab 2: Concepts                | | |   Mermaid / SVG visuals      | |
| +--------------------------------+ | |                              | |
| | Tab 3: Notes                   | | +------------------------------+ |
| +--------------------------------+ |                                  |
+------------------------------------+----------------------------------+
```

### 7.2 Core fusion contracts

1. **Multi-mode TOC**:
   * Fetch via `/api/files` (or `/api/issues`).
   * Contents tab must group `content/magazines/` and `content/units/` clearly.
   * Persist sort (`desc` / `asc`) in `localStorage` via a button.
2. **Note isolation & Smart Merge**:
   * `notes.json` stores all user highlights and AI reviews.
   * Opening file A applies only `file === 'content/magazines/A.md'` highlights; Notes Tab defaults to current file only.
   * **Smart Merge (backend)**: before writing `notes.json`, read existing file and **merge** — never wipe AI `aiReview` already written.

---

## 8. Migration & build references

When building or migrating the browser frontend after Phase 0, integrate by module:

1. **Server & routes**: reference `Melbourne culture magazine/server.js` — static hosting, `/api/save` full save, Smart Merge for `notes.json`.  
2. **Multi-issue TOC & note jump**: reference `Melbourne culture magazine/index.html` — highlight create, floating edit panel, locate via `context` + `contextOffset`.  
3. **Textbook interactive controls**: reference `English learning for Melbourne/scripts/preview.html` — convert `___`, `- [ ]`, `**[Your Answer]**` to interactive DOM with autosave.  
4. **Visual module**: import `scripts/viz.css` so blocks/SVG/Mermaid styles stay global and survive Markdown rendering.

---

## 9. Acceptance checklist (frontend Ready)

- [ ] TOC toggles **newest/oldest** and persists  
- [ ] Internal md never appears in reading TOC  
- [ ] Magazines vs Units grouped; notes never cross files  
- [ ] Notes write `context` + `contextOffset`  
- [ ] Notes click jumps and opens edit  
- [ ] New notes appear in sidebar immediately  
- [ ] Saving notes never loses `aiReview` (Smart Merge)  
- [ ] Blanks / open / MCQ / T-F answerable and reviewable  
- [ ] TOC: rebuild after every body re-render; click uses `getElementById` live lookup (no orphan DOM)  
- [ ] Selection snaps to word boundaries (avoid partial-letter match failures)  
- [ ] Highlights allowed in headings; not inside code/`pre` (same as source projects)

---

## 10. Render lifecycle (from magazine tech_spec)

1. Editing annotations rewrites body `innerHTML` → all old DOM refs die.  
2. After every `renderActiveFile()`, immediately `generateTOC()`.  
3. TOC clicks must not cache old heading nodes — look up by id and scroll.

---

## 11. Visual Arsenal render contract

> Authoritative syntax: `protocols/visual_arsenal.md`. Here only **how the browser must behave** so “write once, display consistently, never crash”.

### 11.1 Dependencies

| Capability | Requirement |
| :--- | :--- |
| Mermaid | Fixed CDN/local version (suggest ≥10); **one global theme** (e.g. `neutral` or CSS-var map); no in-doc `init` theme overrides |
| marked | `mermaid` code fences must **not** go through hljs as normal code; hand to Mermaid |
| Sanitize | Body HTML whitelist includes: `div.viz-*`, sticky-note variants, SVG subset (arsenal §4.7) |

### 11.2 Render pipeline (each open/refresh)

```
markdown → marked HTML
  → find .viz-blocks / .viz-svg / .viz-steps / .viz-formula / .sticky-note → already final DOM
  → find pre code.language-mermaid (or agreed container)
       → mermaid.render each
       → try/catch: on fail show “diagram render failed” + expandable source; **never abort the whole page**
  → then applyAnnotations / TOC
```

### 11.3 Locked CSS class names (do not rename)

| class | Role |
| :--- | :--- |
| `.viz-blocks` `.viz-blocks-row` `.viz-block` `.viz-block-accent` `.viz-arrow` `.viz-caption` | Engineering blocks |
| `.viz-block-title` `.viz-block-body` | Block text |
| `.viz-svg` `.viz-svg-node` `.viz-svg-edge` `.viz-svg-label` `.viz-svg-muted` | SVG coloring |
| `.viz-steps` | Step blocks |
| `.viz-formula` `.viz-formula-main` `.viz-formula-note` | Formula blocks |
| `.sticky-note.warn-note` `.sticky-note.formula-note` | Sticky variants |

Reference styles may live in `scripts/viz.css` (import on migrate). Small screens: `viz-blocks-row` may wrap; mermaid `max-width:100%`.

### 11.4 Consistency acceptance (anti “looks different every time”)

- [ ] All flowcharts share one Mermaid theme  
- [ ] All `viz-block` share border/radius/type size  
- [ ] caption size matches body secondary text  
- [ ] Failed diagrams have a unified error UI — not blank / white screen  
- [ ] Clicks inside diagram containers do not trigger “new blank” etc.  

### 11.5 With the annotation system

- Text inside Mermaid-rendered SVG: **not highlightable by default** (same exclusion as code) — avoids locate failure after Mermaid rewrite.  
- Ordinary text in `viz-caption`, `viz-block-body`: **allowed**.  
- `<text>` inside `viz-svg`: suggest exclude from annotations.
