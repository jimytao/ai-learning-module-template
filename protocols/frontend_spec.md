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

## 2. TOC sort (oldest first / newest first)

| Rule | Note |
| :--- | :--- |
| Toggleable | Sidebar sort button: `old → new` / `new → old`, with a visible label and arrow icon |
| Default | **old → new** (`asc`) |
| Persist | `localStorage` key `ltm_sort_order`, values `asc` \| `desc` |
| Sort key | Prefer `magazineNN` / `unitNN` in filename; else mtime |
| Scope | Applies to the Contents tab; hide the control on tabs where it is meaningless (Notes, Concepts) |

> **Default is `asc` on purpose.** Both source readers default to oldest-first (`sortOrder = 'asc'`,
> `currentSortOrder = 'old-to-new'`) because curricula and magazine issues are both read forward, and
> landing on issue 01 is the correct first-run experience. Do not "fix" this to newest-first.

### 2.1 Preference persistence (applies to every stored preference)

A default is what a **new** user gets. Once the user has chosen, their choice wins — forever, on every
reload, until they change it again. Being handed back the default on each open is a bug, not a reset.

| Rule | Requirement |
| :--- | :--- |
| Write on change | Every toggle writes `localStorage` in the same handler that changes the state — no "save on exit", no batching |
| Restore before first render | Read all four keys during startup and apply them **before** the first list/body render, so nothing visibly flips after paint |
| Default only when absent | Apply the documented default only when `getItem` returns `null`. An explicitly stored value that happens to equal the default is still the user's choice |
| Control reflects state | After restore, the sort button label/icon, theme icon, sidebar collapse state, and Notes-scope button must show the restored value, not the default |
| Never reset silently | Do not clear these keys on error, on version change, or when a document fails to load |

Applies to `ltm_sort_order`, `ltm_theme`, `ltm_sidebar_collapsed`, and `ltm_notes_show_all` (§7.3).

---

## 2.5 Theme contract — light / dark (required)

Both source readers ship a light and a dark theme. This is **not** optional polish; a reader that only
does dark mode fails acceptance.

### 2.5.1 Locked mechanism

| Rule | Requirement |
| :--- | :--- |
| Carrier | `<html data-theme="dark">` / `data-theme="light"` on the **root element** |
| Do **not** use | A `body.light-theme` class. The magazine reader does this and it cannot be applied before `<body>` exists — that is what causes the white flash |
| Colors | Every color goes through CSS custom properties on `:root`; `[data-theme="light"]` overrides the same variable names. No hard-coded hex outside the variable blocks |
| Default | `dark` when nothing is stored |
| Persist | `localStorage` key `ltm_theme`, values `light` \| `dark` |
| Toggle | One control in the top bar; icon reflects the **target** state |

### 2.5.2 FOUC guard (mandatory, exact placement)

The theme must be applied **before first paint** — an inline script in `<head>`, above every
stylesheet, not in `DOMContentLoaded`:

```html
<script>
  (function () {
    var t = localStorage.getItem('ltm_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```

### 2.5.3 Third-party themes must follow

Anything with its own baked-in dark styling has to be swapped on toggle, not left behind:

- **highlight.js** — keep the stylesheet in a `<link id="hljs-theme-link">` and rewrite `href`
  (`github.min.css` ⇄ `github-dark.min.css`) inside the toggle handler.
- **Mermaid** — one global theme chosen at init (`visual_arsenal` contract). If the diagram theme
  cannot follow the toggle, pick the neutral theme that is legible on both backgrounds rather than
  re-rendering diagrams on every switch.

### 2.5.4 What must be verified in both themes

Annotation underline and highlight fills, tooltip/float panel backgrounds, interactive blank and
textarea backgrounds, table zebra striping, `viz-*` block borders, and diagram text. These are exactly
the places the source projects needed separate light overrides — a theme that only restyles the page
background is incomplete.

---

## 3. Sidebar structure

| Tab | Content | Behavior |
| :--- | :--- | :--- |
| **Contents** | Magazines + Units list | Click opens md; current item active |
| **Concepts** | Term / vocabulary library for the current piece, or `log.md` Concept Ledger | Click jumps to in-doc heading / anchor |
| **Notes** | Highlights & notes for current file (or all) | Click jumps to annotation in body and opens edit float |

- New note created → **appears immediately in Notes Tab** (refresh list after saving `notes.json`).  
- Concepts / Notes jumps must be stable: depend on heading format and annotation spans; generators follow `tech_spec.md`.

### 3.1 Sidebar search (required)

Both source readers have a search input at the top of the sidebar, and it is used constantly. Filter
the **active tab's** list as the user types: document titles in Contents, terms in Concepts, and both
`word` and note text in Notes. Plain case-insensitive substring matching is enough — no fuzzy search.

### 3.2 Collapse

The sidebar collapses to give the body full width; persist in `localStorage` key `ltm_sidebar_collapsed`.

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
| `isHighlight` | `true` = pure highlight (no note text) · `false` = underlined annotation carrying a note |
| `userNoteRaw` / `note` | User note (AI never overwrites raw) |
| `aiReview` | Written by Phase 3 only; the frontend must never drop it (Smart Merge, §7.2) |

### 4.1 Two annotation forms (both required)

The reader has **two** marking gestures and they are visually distinct:

| Form | `isHighlight` | Classes | Meaning |
| :--- | :--- | :--- | :--- |
| Underlined annotation | `false` | `.annotated-word` | User wrote a note / question; hovering shows it, and Phase 3 grades it |
| Pure highlight | `true` | `.annotated-word.custom-highlight` | "This matters / I'm unsure" with no text yet; still a gradable signal |

A pure highlight must be upgradable to an annotation in place (open the float, type, save) without
losing `id`, `context`, or `contextOffset`.

### 4.2 Capture on selection — order matters

1. Require a usable selection: non-empty, **no newline**, and **under 150 chars** (the source readers
   allow whole phrases, not just single words).
2. **Snap the range to word boundaries first** (`snapRangeToWordBoundaries`), then re-apply it to the
   selection so the user sees what will actually be saved.
3. **Only then** derive `word`, `context`, `contextOffset` from the snapped range. Computing the offset
   before snapping produces an offset that no longer matches the stored `word` — silent mislocation later.
4. `context` = `textContent` of the nearest enclosing block (`P LI TD TH H1–H6 BLOCKQUOTE DT DD DIV`,
   stopping at the body container). `contextOffset` = length of a range spanning from the start of that
   block to the start of the selection.
5. If no enclosing block is found, store `context = ''` and `contextOffset = 0` rather than guessing.

### 4.3 Rendering: mark every occurrence, but exactly one is primary

This is the mechanism that makes a common word locatable. Do not simplify it away.

```
for each block element (P LI TD TH H1–H6 BLOCKQUOTE DT DD, plus dialogue lines):
    collect text nodes in document order, skipping excluded subtrees
    combined = concat(text node values)          # lets a phrase split across <em>/<strong> still match
    match all annotation words against `combined` with one case-insensitive regex
        - patterns sorted LONGEST FIRST  (stops "note" from eating "banknotes")
        - add \b only on the side that starts/ends with a word char
        - keep non-overlapping matches only
    for each match:
        word = matched text, lowercased
        candidates = every annotation whose word equals `word`
        sameBlock = candidates whose own context equals `combined` (trimmed)
        ann = sameBlock.length > 1 ? whichever sameBlock offset is closest to matchIndex
            : sameBlock[0] || candidates[0]      # see disambiguation rule below
        isPrimary = ann.context && combined.trim() === ann.context.trim()
                    && abs(matchIndex - ann.contextOffset) < 3
    map matches back onto their text nodes, rebuild nodes in REVERSE order
    wrap each matched segment in <span class="annotated-word[ custom-highlight]"
          data-id data-word data-note [data-primary="true"]>
```

| Rule | Why |
| :--- | :--- |
| **All** occurrences get wrapped | The learner sees every place that word appears — that is the point of marking vocabulary |
| **Only the matching occurrence** gets `data-primary="true"` | It is the one the note was actually written about, and the only correct jump target |
| **Disambiguate by context before picking `ann`** | Two separate annotations can share a word — "coffee" highlighted with one note in paragraph 1 and a different note in paragraph 5. Picking "the first annotation with this word" cross-attributes paragraph 5's occurrence to paragraph 1's note: wrong tooltip, wrong click target, and a real risk of overwriting the wrong note on save. Prefer a candidate whose own `context` is this exact block; among same-block candidates (the word annotated twice in one block) prefer the closest offset; only fall back to "any annotation with this word" when nothing belongs to this block at all — the common case of one real note and several unrelated echoes |
| Tolerance `< 3` chars on the offset | Absorbs whitespace normalization between capture time and render time. Do not tighten to `=== 0`; do not widen |
| Rebuild text nodes in reverse order | Forward rebuilding invalidates the offsets of later nodes in the same block |
| Excluded subtrees | `PRE CODE TEXTAREA INPUT BUTTON SCRIPT STYLE`, anything already `.annotated-word`, and speaker labels. Annotating inside an input would destroy the answer |
| Headings are allowed | Both source readers annotate inside headings; only code and form controls are off-limits |

> **Do not port `sortedAnnotations.find(a => a.word === word)` from the magazine reference
> implementation** (`index.html` around the `applyAnnotations` function) — it has exactly the
> cross-attribution bug described above. It was fixed in `templates/reader_skeleton.html`; match that
> version, not the original reference.

### 4.4 Locate priority (Notes sidebar → body)

1. `data-id === note.id` **and** `data-primary === "true"` — the correct hit  
2. `data-id === note.id` (any occurrence) — annotation exists but context drifted after an edit  
3. First span whose text equals `word`, case-insensitive — legacy notes with no `context`  
4. Nothing found → tell the user the anchor is gone; never scroll to a random occurrence silently

On hit: `scrollIntoView({ behavior: 'smooth', block: 'center' })`, flash the accent color for ~2s, then
restore. Notes list order: prefer document physical order; else by time.

**Legacy tolerance**: `context` was added to the source projects mid-flight, so roughly half of the
existing notes have none. New notes must always carry it; old ones must still open via rule 3.

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
| Jump targets a doc that is not open | Load that doc first, **await** the render, then locate — do not race the DOM |

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

### 6.1.1 Dual-input tolerance (strongly recommended)

Protocol already bans stacking blanks + `[Your Answer]` on the same item (`tech_spec.md` §1.1). When migrating the reader, still add UI tolerance so legacy bad content does not mislead users again:

1. Split DOM by heading (`##` / `###` / `####`) or exercise block.  
2. If a block **already has** `.interactive-blank` (from `___` / `__filled__`) and a following `[Your Answer]` textarea is **empty** → **do not render** that redundant textarea (or collapse it and mark “redundant — ignored”).  
3. Do not treat an empty textarea as the sole evidence of “unanswered”; grading still prefers inline blanks (`p3_review.md` §1.1).

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

## 7.3 Locked names (do not rename — `verify_reader.js` asserts these)

The two source readers each invented their own names, which is why nothing could be shared between
them. The template picks one set. Everything below is a hard contract.

### localStorage keys

| Key | Values | Default |
| :--- | :--- | :--- |
| `ltm_theme` | `light` \| `dark` | `dark` |
| `ltm_sort_order` | `asc` \| `desc` | `asc` |
| `ltm_sidebar_collapsed` | `true` \| `false` | `false` |
| `ltm_notes_show_all` | `true` \| `false` | `false` (current doc only) |

### HTTP routes

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/files` | GET | List readable docs under `content/magazines/` + `content/units/` only |
| `/api/file?path=…` | GET | One doc's raw Markdown; path must resolve inside `content/` |
| `/api/save` | POST | `{ path, content }` — full write-back of a doc |
| `/api/notes` | GET / POST | Read / Smart-Merge write of `notes.json` |

### DOM contract

| Name | Role |
| :--- | :--- |
| `html[data-theme]` | Theme carrier (§2.5) |
| `.annotated-word` | Any marked span |
| `.custom-highlight` | Added when `isHighlight === true` |
| `[data-id]` `[data-word]` `[data-note]` | Annotation identity on the span |
| `[data-primary="true"]` | The single context-matched occurrence (§4.3) |
| `.interactive-blank` `.interactive-textarea` `.interactive-checkbox` | Autosaved controls (§6.1) |
| `.viz-*` `.sticky-note` | Visual arsenal (§11.3) |

---

## 7.4 Explicitly out of scope (do not build, even though the reference has it)

The source readers accumulated extras that must **not** be carried into a fresh project reader:

| Excluded | Why |
| :--- | :--- |
| **Git UI and all `/api/git/*` routes** | `Melbourne culture magazine/server.js` implements `/api/git/status`, `/api/git/history`, `/api/git/commit`, `/api/git/show` and a "Git" sidebar tab. **Do not port any of it.** Version control is the user's business outside the reader, many users of this template have no Git installed at all, and a commit button in a study app is a foot-gun |
| Audio/TTS controls | Only meaningful for a language subject; add later per subject, never in the baseline |
| Subject-specific tabs (slang library, cardpacks) | Generalized into the Concepts tab (§3) |
| Any write route outside `content/` and `notes.json` | The reader must not be able to modify `protocols/`, `knowledge/`, or `state/` |

If the user later asks for one of these, build it then — but it is never part of Step 3.5 acceptance.

---

## 8. Migration & build references

**Start from `templates/reader_skeleton.html`.** It is the reference UI shell for this template:
design tokens for both themes, the FOUC guard, preference persistence, sidebar tabs/search/sort/collapse,
and working implementations of §4.2 capture, §4.3 `data-primary` rendering, and §4.4 jump. Copy it to
the root as `index.html` and extend it; it is deliberately free of Git UI and subject-specific features.

Then integrate the remaining modules. **Port behavior, not files** — and apply §7.3 names and §7.4
exclusions while porting:

1. **Server & routes**: reference `Melbourne culture magazine/server.js` — static hosting, `/api/save` full save, Smart Merge for `notes.json`. **Stop before the `/api/git/*` handlers.**  
2. **Multi-issue TOC & note jump**: reference `Melbourne culture magazine/index.html` — highlight create, floating edit panel, locate via `context` + `contextOffset` (`applyAnnotations` / `jumpToWord` are the functions worth studying, **except** its word-to-annotation lookup — see the §4.3 warning above). Its theming uses `body.light-theme`; **use `html[data-theme]` instead** (§2.5).  
3. **Textbook interactive controls**: reference `English learning for Melbourne/scripts/preview.html` — convert `___`, `- [ ]`, `**[Your Answer]**` to interactive DOM with autosave, and copy its `<head>` FOUC guard verbatim in spirit.  
4. **Visual module**: import `scripts/viz.css` so blocks/SVG/Mermaid styles stay global and survive Markdown rendering.

> Neither reference is available to a user who cloned only this template. Everything required to
> rebuild from scratch is specified in §1–§7 and checked by `scripts/verify_reader.js`; the references
> are an accelerator, not a dependency.

---

## 9. Acceptance checklist (frontend Ready)

> Run `node scripts/verify_reader.js` for the machine-checkable half of this list. It must pass before
> `p0_bootstrap.md` Step 3.5 counts as done and before cleanup (Gate B) may run.

- [ ] `node scripts/verify_reader.js` passes with no FAIL  
- [ ] Light and dark both usable; toggle persists; **no white flash on reload in dark mode**  
- [ ] Annotation underline, highlight fill, floats, blanks, tables, and `viz-*` all legible in **both** themes  
- [ ] Highlighting a word that occurs many times marks them all, and the sidebar jumps to the right one  
- [ ] A pure highlight can be upgraded to a note without losing its anchor  
- [ ] No Git UI, no `/api/git/*` route exists  
- [ ] Sidebar search filters the active tab  
- [ ] TOC toggles **oldest/newest** and persists (default oldest-first)  
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
