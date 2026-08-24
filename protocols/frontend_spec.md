# Reader / Frontend Spec (frontend_spec.md)

> The **product details that must survive**, distilled from the English Learning previewer and the Culture Magazine reader.  
> This repository is currently Markdown + protocols first; when porting or rebuilding the frontend, **accept against this file** and lose no behaviour.

---

## 1. Content sources and isolation (prevents mix-ups)

| Rule | Detail |
| :--- | :--- |
| List learning content only | The sidebar "Contents" tab shows only `content/magazines/*.md` and `content/units/*.md` |
| Never expose internal files | `protocols/` `knowledge/` `state/` `scripts/` `DESIGN.md` `AGENT.md` must not appear in the reading list |
| Clear grouping | Two groups recommended: `Magazines` / `Units` (or by number); highlight the open item |
| Notes isolated per file | Every entry in `notes.json` must carry `file` (or the compatible `issue` field) pointing at **that one** md |
| Current document only by default | The Notes sidebar defaults to `showAll = false` and renders only entries where `file === the currently open path` |
| "All notes" is toggleable | Offer a switch for cross-document notes, but keep it off by default so magazine issues do not blur together |
| Grading filters by file too | When Phase 3 / the frontend shows AI reviews, filter by the current `file` the same way |

Once a path is generated, do not rename it casually; if you must rename, update every matching `file` in `notes.json`.

---

## 2. Contents sorting (old-to-new / new-to-old)

| Rule | Detail |
| :--- | :--- |
| Toggleable | The sidebar offers a sort button: `Old → New` / `New → Old`, with a visible text label and an arrow icon |
| Default | **Old → New** (`asc`) |
| Persistence | `localStorage` key `ltm_sort_order`, values `asc` \| `desc` |
| Sort key | Prefer the number in the filename, `magazineNN` / `unitNN`; otherwise mtime |
| Scope | Applies to the Contents tab only; hide the control on tabs where it is meaningless (Notes, Concepts) |

> **`asc` as the default is deliberate.** Both source readers actually defaulted to old-to-new
> (`sortOrder = 'asc'`, `currentSortOrder = 'old-to-new'`), because courses and magazine issues are
> read front to back — landing on issue 01 the first time you open it is the correct experience.
> Do not "fix" this to new-to-old.

### 2.1 Preference persistence (applies to every stored preference)

Defaults are for **new** users. Once a user makes a choice, that choice wins forever — it counts on
every reopen until they change it themselves. Being reset to the default on every open is a bug, not
a reset.

| Rule | Requirement |
| :--- | :--- |
| Write on change | Every toggle writes `localStorage` in the same handler that changes the state — no "save on exit", no batched deferred writes |
| Restore before first render | Read all four keys at startup and apply them **before** the first list/body render, so nothing jumps after paint |
| Default only when absent | Apply a default only when `getItem` returns `null`. A stored value is the user's choice even when it happens to equal the default |
| Controls reflect real state | After restoring, the sort button's text/icon, the theme icon, the sidebar collapse state, and the Notes scope button must all show the restored value, not the default |
| Never silently reset | Do not clear these keys because of an error, a version change, or a document that failed to load |

Applies to `ltm_sort_order`, `ltm_theme`, `ltm_sidebar_collapsed`, `ltm_notes_show_all` (§7.3).

---

## 2.5 Theme contract — light / dark (required)

Both source readers shipped a light and a dark theme. This is **not** optional polish; a dark-only
reader does not pass acceptance.

### 2.5.1 Locked implementation

| Rule | Requirement |
| :--- | :--- |
| Carrier | `<html data-theme="dark">` / `data-theme="light"` on the **root element** |
| **Forbidden** | The `body.light-theme` class. That is what the magazine reader did, and it cannot be applied before `<body>` exists — which is exactly what causes the white flash |
| Colours | Every colour goes through CSS custom properties on `:root`; `[data-theme="light"]` overrides the same variable names. No hard-coded colour values outside the variable blocks |
| Default | `dark` when nothing is stored |
| Persistence | `localStorage` key `ltm_theme`, values `light` \| `dark` |
| Toggle control | One control in the header; the icon shows the state it **will switch to** |

### 2.5.2 FOUC guard (mandatory, fixed position)

The theme must be applied **before the first paint** — an inline script inside `<head>`, above every
stylesheet, never inside `DOMContentLoaded`:

```html
<script>
  (function () {
    var t = localStorage.getItem('ltm_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
  })();
</script>
```

### 2.5.3 Third-party themes must follow

Any third-party asset that ships its own dark styling has to be swapped on toggle, not left behind:

- **highlight.js** — put the stylesheet in `<link id="hljs-theme-link">` and rewrite `href` in the
  toggle handler (`github.min.css` ⇄ `github-dark.min.css`).
- **Mermaid** — pick a single global theme at init (the `visual_arsenal` contract). If diagram themes
  cannot follow the toggle, choose a neutral theme that reads clearly on both backgrounds rather than
  re-rendering every diagram on each switch.

### 2.5.4 Areas that must be verified under both themes

Annotation underlines and highlight fills, tooltip / overlay backgrounds, blank-input and textarea
backgrounds, table zebra striping, `viz-*` block borders, diagram text. These are precisely the spots
the source projects had to write separate light overrides for — a theme that only changes the page
background colour is incomplete.

---

## 3. Sidebar structure

| Tab | Content | Behaviour |
| :--- | :--- | :--- |
| **Contents** | Magazines + Units list | Click opens that md; the current item is active |
| **Concepts** | Terms / vocabulary for the current document, or the Concept Ledger from `log.md` | Click jumps to the matching heading / anchor in the body |
| **Notes** | Highlights and annotations for the current file (or all) | Click jumps to the marked spot in the body and opens the edit overlay |

- A new annotation → **appears in the Notes tab immediately** (refresh the list after saving `notes.json`).

### 3.1 Sidebar search (required)

Both source readers had a search box at the top of the sidebar, and it was used constantly. Typing
filters the list on the **current tab**: Contents filters document titles, Concepts filters terms,
Notes matches both `word` and the note text. Ordinary case-insensitive substring matching is enough;
fuzzy search is not needed.

### 3.2 Collapse

The sidebar can collapse so the body takes the full width; the state persists to the `localStorage`
key `ltm_sidebar_collapsed`.  
- Concepts / Notes jumps must stay reliable: they depend on in-document heading format and annotation
  spans, so follow `tech_spec.md` when generating content.

---

## 4. Annotations: capture-time context locating (mandatory)

> Storing `word` alone is not enough: a word that appears several times cannot be located precisely,
> and grading loses its context.

At creation time the frontend must silently write:

| Field | Meaning |
| :--- | :--- |
| `word` | The contiguous text the user selected (within one block, no line breaks) |
| `context` | **The full sentence or the current block-level paragraph it sits in** (recommended: the whole sentence; at minimum the text of its `<p>`/`<li>`) |
| `contextOffset` | The starting character offset of `word` within `context` |
| `file` | The relative path of the current document |
| `isHighlight` | `true` = pure highlight (no note text) · `false` = an underlined annotation with a note |
| `userNoteRaw` / `note` | The user's note (AI never overwrites raw) |
| `aiReview` | Written only by Phase 3; the frontend must never drop it (Smart Merge, §7.2) |

### 4.1 Two annotation forms (both required)

The reader has **two** marking gestures, and they must be visually distinguishable:

| Form | `isHighlight` | Class | Meaning |
| :--- | :--- | :--- | :--- |
| Underlined note | `false` | `.annotated-word` | The user wrote a note / question; shown on hover, graded in Phase 3 |
| Pure highlight | `true` | `.annotated-word.custom-highlight` | "This matters / I'm unsure" with no text yet; still a gradeable signal |

A pure highlight must be upgradeable to a note in place (open the overlay, type, save) without losing
`id`, `context`, or `contextOffset`.

### 4.2 Selection capture — the order matters

1. First confirm the selection is usable: non-empty, **no line breaks**, and **shorter than 150
   characters** (the source readers allowed selecting a whole phrase, not just a single word).
2. **Snap the range to word boundaries first** (`snapRangeToWordBoundaries`), then write it back to
   the selection so the user sees the range that will actually be saved.
3. **Only then** take `word`, `context`, and `contextOffset` from the snapped range. Computing the
   offset before snapping yields an offset that no longer corresponds to the stored `word` — which
   shows up later as silent mislocation.
4. `context` = the `textContent` of the nearest ancestor block element
   (`P LI TD TH H1–H6 BLOCKQUOTE DT DD`, plus `.viz-block-body` — see the note under §4.3 —
   stopping at the body container).
   `contextOffset` = the range length from the start of that block to the start of the selection.
5. When no ancestor block is found, store `context = ''` and `contextOffset = 0`; do not guess.

### 4.3 Rendering: mark every occurrence, but only one is primary

This is the mechanism that makes common words locatable. Do not simplify it away for convenience.

```
For each block element (P LI TD TH H1–H6 BLOCKQUOTE DT DD, plus dialogue lines and `.viz-block-body`):
    collect text nodes in document order, skipping excluded subtrees
    combined = concatenate every text node's value    # so a phrase split by <em>/<strong> still matches
    match every annotated word across combined with one case-insensitive regex
        - order the patterns by descending length (stops "note" from eating "banknotes")
        - add \b only on the side that starts/ends with a word character
        - keep only non-overlapping matches
    for each match:
        word = the matched text, lowercased
        candidates = every annotation whose word equals it
        sameBlock = those candidates whose context (whitespace-stripped) equals combined
        ann = if sameBlock.length > 1, the one whose offset is closest to matchIndex
            : otherwise sameBlock[0] || candidates[0]    # see the disambiguation rule below
        isPrimary = ann.context && combined.trim() === ann.context.trim()
                    && abs(matchIndex - ann.contextOffset) < 3
    map the matches back onto their text nodes and rebuild those nodes in **reverse order**
    wrap each hit fragment in <span class="annotated-word[ custom-highlight]"
          data-id data-word data-note [data-primary="true"]>
```

| Rule | Why |
| :--- | :--- |
| Wrap **every** occurrence | The learner sees every place the word appears — that is the whole point of marking vocabulary |
| Only the matched one gets `data-primary="true"` | It is the position the note was actually written about, and the only correct jump target |
| **Disambiguate by context before choosing `ann`** | Two independent notes can share a word — "coffee" annotated differently in paragraph 1 and paragraph 5. Taking "the first same-word annotation in the array" wrongly binds the paragraph-5 occurrence to the paragraph-1 note: wrong tooltip, wrong click target, and possibly overwriting an unrelated note on save. Prefer candidates whose own `context` is the current block; when the same word is annotated several times within one block, prefer the closest offset; only when no candidate belongs to the current block, fall back to "any same-word annotation" — which covers the common case where there is one real note and the word is just an echo elsewhere |
| Offset tolerance of `< 3` characters | Absorbs whitespace-normalization differences between capture and render. Do not tighten it to `=== 0`, and do not loosen it |
| Rebuild text nodes in reverse | Rebuilding forwards invalidates the offsets of every later node in the same block |
| Excluded subtrees | `PRE CODE TEXTAREA INPUT BUTTON SCRIPT STYLE`, elements that are already `.annotated-word`, and speaker labels. Annotating inside an input would destroy the user's answer |
| Annotating inside headings is allowed | Both source readers annotated within headings; only code and form controls are off limits |
| **`.viz-block-body` counts as a block element; other `viz-*` wrapper `div`s do not** | Per `visual_arsenal.md`, `.viz-caption` is a `<p>` (already covered above), but `.viz-block-body` is a `<div>`, and `div` is deliberately **not** treated as a generic block element here — see the next row. Recognising `.viz-block-body` as a block by class name alone (rather than treating every `div` as a block) lets text inside flowcharts and block diagrams be selected and highlighted without breaking the rule below |
| `div` is not a block element in general | So the traversal **passes through** the `.viz-blocks` / `.viz-blocks-row` / `.viz-block` / `.sticky-note` wrapper `div`s and descends into what they actually contain (their own `<p>`, or `.viz-block-body`), rather than mashing a whole diagram's text into one block for matching. Treating `.viz-block-body` as a block is an explicit, narrow exception to this rule — not a blanket "all divs are blocks" |

> **Do not copy `sortedAnnotations.find(a => a.word === word)` from the magazine reference
> implementation** (near the `applyAnnotations` function in its `index.html`) — that is the source of
> the cross-wiring bug described above. Both `templates/reader_skeleton.html` and this branch's
> `reader-core.js` already fix it; follow those two rather than the original reference.

### 4.4 Locating priority (Notes sidebar → body)

1. `data-id === note.id` **and** `data-primary === "true"` — the correct hit  
2. `data-id === note.id` (any occurrence) — the note survives, but context drifted after an edit  
3. The first span whose text equals `word` (case-insensitive) — legacy data with no `context`  
4. Nothing found → tell the user the anchor is stale; **never silently scroll to an arbitrary one**

On a hit: `scrollIntoView({ behavior: 'smooth', block: 'center' })`, flash in the accent colour for
about 2 seconds, then restore. Notes list ordering: physical body order first; otherwise by time.

**Legacy tolerance**: `context` was added partway through the source projects, so roughly half of the
old notes lack it. New notes must always write it; old notes must still open via rule 3.

**Avoid these when generating content** (same as the source projects):

- Do not let a key term appear only inside a code block or across a sticky-note boundary (it becomes
  impossible to highlight)  
- `word` must never span paragraphs  

Phase 3 grading: **must explain in context using `context`** — never just dump a dictionary entry.

---

## 5. Click-to-jump experience

| Scenario | Expected |
| :--- | :--- |
| Clicking an entry in the Notes list | Scroll to the marked text → brief highlight flash → open the edit overlay (if any) |
| Clicking an entry in Concepts | Scroll to the concept heading (a Unit's `### N. Name` or a Mag's Key Ideas anchor) |
| Clicking a document in Contents | Load that md; Notes/Concepts switch to that file's data; do not clear other files' `notes.json` |
| The jump target is not in the open document | Load that document and **await** the render before locating — do not race the DOM |

---

## 6. Interactive elements and autosave

The frontend must parse interactive elements in the Markdown body, render them as interactive HTML
controls in the browser, and write answers back to the source Markdown file automatically and in real
time as the user acts (typing / ticking).

### 6.1 Interactive element parsing and rendering rules

| Element type | Markdown syntax | HTML rendering | Parse and write-back logic |
| :--- | :--- | :--- | :--- |
| **Empty blank** | `___` (three or more underscores) | `<input type="text" class="interactive-blank" data-index="N" />` | **Parse**: replace the run of underscores with an input.<br>**Write back**: when the input changes, replace the Nth `___` in the in-memory Markdown with `__user answer__` (note: the answer is wrapped in double underscores). |
| **Filled blank** | `__filled content__` (double underscores) | `<input type="text" class="interactive-blank" data-index="N" value="filled content" />` | **Parse**: read the double-underscore-wrapped text and render an input with that default value.<br>**Write back**: on edit, update the content inside the double underscores to `__new content__`. If the user clears it, degrade back to three underscores `___`. |
| **Open question** | `**[Your Answer]**` or `**[Your Answer]**: (answer)` | `<textarea class="interactive-textarea" data-index="N">answer</textarea>` | **Parse**: match the `**[Your Answer]**` marker at the start of a line or in a list item. If an answer follows the colon or sits in parentheses, use it as the textarea's initial value.<br>**Write back**: as the user types, update the matching Markdown line after `**[Your Answer]**:` to `(user answer)` or directly to `user answer`, preserving the Markdown structure. |
| **MCQ / MSQ / T-F** | `- [ ]` or `- [x]` | `<input type="checkbox" class="interactive-checkbox" data-index="N" />` | **Parse**: standard Markdown task-list syntax rendered as a tickable checkbox.<br>**Write back**: on tick/untick, flip `[ ]` to `[x]` at the matching position in the in-memory Markdown, and vice versa. |

### 6.1.1 Dual-input tolerance (strongly recommended)

The protocol layer already forbids stacking a blank and `[Your Answer]` on the same question (see
`tech_spec.md` §1.1). When porting the reader, still add UI tolerance so historically broken content
cannot mislead users again:

1. Split the DOM by heading (`##` / `###` / `####`) or by question block.  
2. If a question block **already has** a `.interactive-blank` (from `___` / `__filled__`) and the
   textarea rendered from the `[Your Answer]` immediately after it is **empty** → **do not render**
   that redundant textarea (or collapse it and label it "redundant — ignored").  
3. Do not treat an empty textarea as the only evidence of "user did not answer"; grading still reads
   the inline blank first (`p3_review.md` §1.1).

### 6.2 Autosave flow

1. **Keep an in-memory copy**: after loading the Markdown, keep a raw Markdown string copy in memory.
2. **Listen and debounce**: listen for `input` or `change` on every interactive control. Use a
   **debounce (500ms – 1000ms recommended)** so typing does not flood the backend with requests.
3. **Write back in full**: once the debounce fires, run the replacement algorithm to update the
   in-memory Markdown string, then `POST /api/save`.
4. **Interface contract**:
   * **Path**: `/api/save`
   * **Payload**: `{ path: "content/units/unit01.md", content: "the full updated Markdown text…" }`
   * **Backend behaviour**: on receipt, validate that `path` is safe, then overwrite the source file
     directly.
5. **Grading panel rendering**:
   * Grading results are wrapped in `details.feedback-panel` (a collapsible feedback panel).
   * Text corrections render as `<span class="err">wrong word</span>` (red strikethrough/background)
     and `<span class="fix">corrected word</span>` (green underline/background); the frontend must
     preserve and render these specific HTML tags.

---

### 6.3 Save-state indicator (required)

The biggest problem with autosave is not losing data — it is that **the user cannot tell whether it
saved**. So the state must stay visible at all times, and there must be a "save right now" escape
hatch, because anyone who distrusts autosave will go looking for one.

| Requirement | Hard contract |
| :--- | :--- |
| Position | Top right of the header (same group as the theme and export buttons) |
| Carrier | **`<button class="save-status">`** — a button, not a plain text label; it must be clickable and focusable |
| Structure | Contains `.save-icon` (a scannable icon) and `.save-label` (the wording) |
| States | `idle` / `dirty` / `saving` / `saved` / `error`, written to both `data-state` and the class |
| Icons | Hollow circle / filled circle / dashed circle (may animate) / check / warning — five mutually distinguishable states |
| Manual save | **Clicking the indicator** saves immediately; **`⌘S` / `Ctrl+S`** does the same and must `preventDefault()` the browser's "save page" |
| Clean document | On a manual save with no changes, still respond (set state to `saved` + one toast) — silence reads as "it didn't work" |
| Single write path | Manual save must go through the **same function** as autosave; never add a second POST path |
| Narrow screens | The label may be hidden leaving the icon, but **the whole thing must not be hidden** — it is the only entry point for manual saving |
| Accessibility | `aria-live="polite"` + `aria-label`; `title` states the shortcut |

State semantics (the wording may follow the interface language; the state machine may not change):

```
idle    ○  Ready — no document open, or no changes
dirty   ●  Unsaved — changed, debounce timer running
saving  ◌  Saving — POST /api/save in flight
saved   ✓  Saved — the server confirmed the write
error   ⚠  Save failed — dirty stays true, the next input retries
```

---

## 7. Fine-grained rules for multi-document projects and Universal Reader fusion

When a new project is initialized, the frontend must fuse **Magazine mode** and **Unit mode** into one
unified single-page reader (the Universal Reader).

### 7.1 Universal layout

```
+-----------------------------------------------------------------------+
|  LOGO  [Universal Reader]        [current issue/unit title]  [save/export/theme] |
+------------------------------------+----------------------------------+
| Sidebar                            | Main Viewport                    |
|                                    |                                  |
| +--------------------------------+ | +------------------------------+ |
| | Tab 1: Contents (tree)         | | |                              | |
| | - Magazines (new -> old)       | | |   Rendered Markdown          | |
| | - Units (grouped by Week)      | | |   (blanks, choices, Q&A)     | |
| +--------------------------------+ | |                              | |
| | Tab 2: Concepts (terms)        | | |   Mermaid / SVG visuals      | |
| +--------------------------------+ | |                              | |
| | Tab 3: Notes (marks + reviews) | | +------------------------------+ |
| +--------------------------------+ |                                  |
+------------------------------------+----------------------------------+
```

### 7.2 Core fusion interaction contract

1. **Multi-modal sidebar contents**:
   * The frontend fetches every available file through `/api/files` (or `/api/issues`).
   * It must group them clearly in the **Contents** sidebar: the magazine list from
     `content/magazines/` and the unit list from `content/units/`.
   * Support persisting the sort order (`desc` / `asc`) in `localStorage` via the button.
2. **Note isolation and Smart Merge**:
   * `notes.json` stores every user highlight and AI reply.
   * When file A is open, the body applies only highlights where
     `file === 'content/magazines/A.md'`, and the Notes tab likewise shows only the current file's
     notes by default.
   * **Smart Merge (the key backend detail)**: when the user adds or edits a note and `notes.json` is
     saved, the backend must read the existing `notes.json` before writing and **merge** old and new
     data. It must never overwrite or clobber the grading and feedback the AI has written into
     `aiReview`.

---

## 7.3 Locked names (do not rename — `verify_reader.js` asserts these)

The two source readers each invented their own naming, which is exactly why nothing could be shared
between them. The template picks one set. Everything below is a hard contract.

### localStorage keys

| Key | Values | Default |
| :--- | :--- | :--- |
| `ltm_theme` | `light` \| `dark` | `dark` |
| `ltm_sort_order` | `asc` \| `desc` | `asc` |
| `ltm_sidebar_collapsed` | `true` \| `false` | `false` |
| `ltm_notes_show_all` | `true` \| `false` | `false` (current document only) |

### HTTP routes

| Route | Method | Purpose |
| :--- | :--- | :--- |
| `/api/files` | GET | Lists only readable documents under `content/magazines/` + `content/units/` |
| `/api/file?path=…` | GET | Raw Markdown for one document; the path must resolve inside `content/` |
| `/api/save` | POST | `{ path, content }` — full-document write-back |
| `/api/notes` | GET / POST | Read / Smart-Merge write `notes.json` |

### DOM contract

| Name | Role |
| :--- | :--- |
| `html[data-theme]` | Theme carrier (§2.5) |
| `.annotated-word` | Any marked span |
| `.custom-highlight` | Appended when `isHighlight === true` |
| `[data-id]` `[data-word]` `[data-note]` | Annotation identity on the span |
| `[data-primary="true"]` | The single contextual hit (§4.3) |
| `.interactive-blank` `.interactive-textarea` `.interactive-checkbox` | Autosaved controls (§6.1) |
| `.save-status` `.save-icon` `.save-label` | Save-state indicator and manual save button (§6.3) |
| `.viz-*` `.sticky-note` | Visual arsenal (§11.3) |

---

## 7.4 Explicitly out of scope (even though the reference implementations have it)

The source readers accumulated extra features that **must not** come across into a new project's
reader:

| Excluded | Why |
| :--- | :--- |
| **The Git UI and all `/api/git/*` routes** | `Melbourne culture magazine/server.js` implemented `/api/git/status`, `/api/git/history`, `/api/git/commit`, `/api/git/show`, and a "Git" sidebar tab. **Do not port a single line.** Version control lives outside the reader, many people using this template do not have Git installed at all, and putting a commit button in a learning app is asking for trouble |
| Audio / TTS controls | Only meaningful for language subjects; add per subject later, never in the baseline |
| Subject-specific tabs (slang library, card packs) | Already generalized into the Concepts tab (§3) |
| Any write route outside `content/` and `notes.json` | The reader must not be able to modify `protocols/`, `knowledge/`, or `state/` |

Build one of these when the user later asks for it — but it never belongs in the Step 3.5 acceptance
scope.

---

## 8. Porting and development references

**Start from `templates/reader_skeleton.html`.** It is this template's reference UI shell: design
variables for both themes, the FOUC guard, preference persistence, sidebar tabs/search/sort/collapse,
plus a working implementation of §4.2 capture, §4.3 `data-primary` rendering, and §4.4 jumping. Copy
it to the root, rename it `index.html`, and extend from there; it deliberately contains no Git UI and
no subject-specific features.

Integrate the remaining pieces as follows. **You are porting behaviour, not files** — apply the §7.3
naming and the §7.4 exclusions as you go:

1. **Server and routing base**: follow `Melbourne culture magazine/server.js`, keeping its static file
   hosting, the full-document `/api/save`, and the Smart Merge logic for `notes.json`. **Stop reading
   when you reach the `/api/git/*` handlers.**
2. **Multi-issue contents and note jumping**: follow the Notes highlight creation, floating-panel
   editing, and the precise `context` + `contextOffset` locating logic in
   `Melbourne culture magazine/index.html` (the two functions worth studying are `applyAnnotations`
   and `jumpToWord`, **except for the word-to-note lookup** — see the warning in §4.3 above). Its
   theme uses `body.light-theme`; **switch to `html[data-theme]`** (§2.5).
3. **Unit interactive controls and answer rendering**: follow the JavaScript in
   `English learning for Melbourne/scripts/preview.html` that converts `___`, `- [ ]`, and
   `**[Your Answer]**` into interactive DOM and triggers autosave on change, and copy its `<head>`
   FOUC guard approach verbatim.
4. **Visualization module**: pull in `scripts/viz.css` so engineering block diagrams, SVG, and Mermaid
   stay globally consistent and are not broken by the Markdown renderer.

> Someone who only cloned this template does not have those two reference projects. Everything needed
> to rebuild from scratch is written in §1–§7 and checked by `scripts/verify_reader.js`; the reference
> implementations are an accelerator, not a dependency.


---

## 9. Acceptance checklist (the definition of frontend Ready)

> Run `node scripts/verify_reader.js` for the machine-checkable part of this list. It must
> pass before the reader acceptance in `SETUP.md` Step 4 / `p0_bootstrap.md` Step 3.5 counts
> as done.

- [ ] `node scripts/verify_reader.js` reports no FAIL  
- [ ] Both light and dark work; the toggle persists; **reloading in dark must not flash white**  
- [ ] Annotation underlines, highlight fills, overlays, blank inputs, tables, and `viz-*` are all legible under **both** themes  
- [ ] Highlighting a word that occurs several times marks every occurrence, and the sidebar jumps to the right one  
- [ ] A pure highlight can be upgraded to a note in place without losing its anchor  
- [ ] No Git UI, no `/api/git/*` routes  
- [ ] Sidebar search filters the current tab  
- [ ] Contents toggles **old-to-new / new-to-old** and persists (default old-to-new)  
- [ ] Internal md files do not appear in the reading list  
- [ ] Magazines and Units are grouped, and notes do not leak between files  
- [ ] Annotations write `context` + `contextOffset`  
- [ ] Clicking a note jumps and opens the editor  
- [ ] A new note appears in the sidebar immediately  
- [ ] Saving notes does not lose `aiReview` (Smart Merge)  
- [ ] Blanks / open questions / MCQ / T-F can be answered and reviewed  
- [ ] TOC: rebuilt after every body re-render; clicks resolve via `getElementById` at click time (guards against orphaned DOM)  
- [ ] Selections snap to word boundaries automatically (so a dropped letter cannot break matching)  
- [ ] Highlighting works inside headings; not inside code blocks / `pre` (same as the source projects)

---

## 10. Render lifecycle (ported from the magazine tech_spec)

1. Changing an annotation rewrites the body `innerHTML` → every old DOM reference goes stale.  
2. `generateTOC()` must run immediately after every `renderActiveFile()`.  
3. TOC clicks must not cache old heading nodes; look them up by id and scroll at click time.

---

## 11. Visual arsenal render contract

> The authoritative syntax lives in `protocols/visual_arsenal.md`. This section only defines **how the
> browser must behave**, guaranteeing "it displays as written, it does not break, and every issue looks
> the same".

### 11.1 Dependencies

| Capability | Requirement |
| :--- | :--- |
| Mermaid | A pinned CDN/local version (≥10 recommended); **one global theme** (e.g. `neutral` or a mapping onto the project's CSS variables); in-document `init` theme overrides are forbidden |
| marked | When a code block's language is `mermaid`, **do not** treat it as ordinary code and highlight it with hljs; hand it to Mermaid |
| Sanitization | The body HTML allowlist includes `div.viz-*`, the `sticky-note` variants, and an svg subset (see arsenal §4.7) |

### 11.2 Render flow (on every document open/refresh)

```
markdown → marked HTML
  → find .viz-blocks / .viz-svg / .viz-steps / .viz-formula / .sticky-note → already final DOM
  → find pre code.language-mermaid (or the agreed container)
       → mermaid.render each one
       → try/catch: on failure show "diagram render failed" + expandable source,
         **never interrupt the rest of the document**
  → then applyAnnotations / TOC
```

### 11.3 Required CSS classes (names locked, renaming forbidden)

| Class | Role |
| :--- | :--- |
| `.viz-blocks` `.viz-blocks-row` `.viz-block` `.viz-block-accent` `.viz-arrow` `.viz-caption` | Engineering block diagrams |
| `.viz-block-title` `.viz-block-body` | Text inside a block |
| `.viz-svg` `.viz-svg-node` `.viz-svg-edge` `.viz-svg-label` `.viz-svg-muted` | SVG colouring |
| `.viz-steps` | Step blocks |
| `.viz-formula` `.viz-formula-main` `.viz-formula-note` | Formula blocks |
| `.sticky-note.warn-note` `.sticky-note.formula-note` | Sticky-note variants |

Reference styles can live in `scripts/viz.css` (pull it in when porting the frontend). Small screens:
`viz-blocks-row` may wrap; mermaid diagrams get `max-width:100%`.

### 11.4 Consistency acceptance (guards against "it looks different every time")

- [ ] Every flowchart uses the same Mermaid theme  
- [ ] Every `viz-block` uses the same border / radius / font size  
- [ ] Caption font size matches the body's secondary text  
- [ ] Failed diagrams get a consistent error UI, not a blank or a white page  
- [ ] Clicking inside a diagram container does not trigger stray interactions like "create a blank"  

### 11.5 Interaction with the annotation system

- Text inside a Mermaid-rendered SVG: **not annotatable by default** (excluded the same way code blocks
  are), so locating cannot break after Mermaid rewrites the DOM.  
- Ordinary text inside `viz-caption` and `viz-block-body`: **annotation allowed** (for how, see §4.3 —
  `.viz-block-body` is a `<div>` and must be recognised as a block by class name, not by the generic
  tag list).  
- `<text>` inside `viz-svg`: excluding annotation is recommended.

---

## 12. UI/UX design and layout standards

So that generated content and the frontend always read like a high-quality Magazine / Drill lesson,
the frontend and the AI generating body text must follow these UI/UX standards:

### 12.1 Colour and design tokens
* **Primary accent**: teal / green (`#2dd4a7` dark / `#0d9b78` light), used for interaction focus, the
  selected item in Contents, and action buttons.
* **Secondary accent**: amber gold / warm yellow (`#fbbf24` dark / `#d97706` light), used for emphasis
  highlights, the premium logo gradient, and sticky-note card borders.
* **Background and glassmorphic atmosphere**:
  * Lay down a progressive background layer using a two-colour radial gradient.
  * The header and sidebar use `backdrop-filter: blur(16px)` for a frosted translucent effect.
  * Content cards use `rgba(21, 29, 48, 0.75)` (dark) / `rgba(255, 255, 255, 0.88)` (light) with a
    subtle `1px` highlight border.

### 12.2 Typography
* **Headings / brand / card headers**: `Outfit` paired with `Noto Sans TC`, bold
  (`font-weight: 700 / 800`), for a modern magazine-publication feel.
* **Body reading**: `Inter`, line height locked to `1.7`–`1.78`, with generous letter spacing, so long
  reading sessions stay comfortable.

### 12.3 Components and cards
* **Sticky notes / margin cards (`.sticky-note`)**: rounded cards with a gold/blue two-colour gradient
  indicator bar on the left and a clear internal structure.
* **Engineering diagrams and steps (`.viz-block`, `.viz-steps`)**: centred cards with a subtle
  shadow-lift, legible against both light and dark backgrounds.
* **Save-state indicator (`.save-status`)**: button form, with a rounded pill border, a state icon
  (`○` ready / `●` unsaved / `◌` saving / `✓` saved / `⚠` failed) and a subtle pulse animation,
  supporting quick manual saves.
