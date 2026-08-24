/**
 * ui-strings.js — reader UI language pack (the single source of interface copy)
 * ============================================================================
 *
 * [FOR THE AI — SETUP.md Step 5.5 sends you here]
 *
 * This file holds **every** user-facing string in the reader. Neither `index.html`
 * nor `app.js` may contain hard-coded interface copy.
 *
 * Once Phase 0 has captured the user's **primary explanation language**, translate
 * every value below into that language and set `lang` to the matching BCP-47 code.
 * From then on the browser opens in the user's own language.
 *
 * Rules when editing:
 *
 *   1. **Change only the values on the right of the colon, never the keys on the
 *      left.** Keys are a code contract; `scripts/verify_reader.js` checks each one,
 *      and a missing key makes the raw key name show up in the interface.
 *   2. **Do not add or remove keys.** New copy means changing `index.html` / `app.js`
 *      and this file together, plus the key table in `protocols/frontend_spec.md` §13.
 *   3. `welcomeBody` may contain `<code>` tags — it is inserted after DOMPurify
 *      sanitization. Every other value is treated as plain text; HTML will not render.
 *   4. Leave the icon characters (`○ ● ◌ ✓ ⚠ ☰ ☀ 🧭 ⬇ 🔍 📖 🗂 📝 ⟳ ↑ ↓ →`) exactly
 *      as they are — they carry state semantics (frontend_spec §6.3), they are not
 *      translatable text.
 *   5. `⌘S / Ctrl+S` inside `saveStatusTitle` names real shortcuts; do not rename the
 *      keys themselves.
 *   6. Reload the browser to check, and run `node scripts/verify_reader.js`.
 *
 * Switching languages requires no other file.
 */

window.UI_STRINGS = {
  // --- Document level ------------------------------------------------------
  lang: 'en',
  pageTitle: 'AI Learning Module Reader',

  // --- Header --------------------------------------------------------------
  sidebarToggleAria: 'Collapse or expand the sidebar',
  sidebarToggleTitle: 'Toggle left sidebar',
  documentTitleEmpty: 'Select a document',
  themeAria: 'Toggle theme',
  themeTitle: 'Toggle theme',
  themeLabel: 'Light Mode',
  saveStatusTitle: 'Save state — click to save now (⌘S / Ctrl+S)',
  saveStatusAria: 'Save state: click to save now',
  tocToggleAria: 'Toggle chapter navigation',
  tocToggleTitle: 'Toggle the right-hand chapter navigation',
  tocToggleLabel: 'Contents',
  exportLabel: 'Export',

  // --- Sidebar -------------------------------------------------------------
  sidebarAria: 'Reader sidebar',
  tabContents: 'Contents',
  tabConcepts: 'Concepts',
  tabNotes: 'Notes',
  searchPlaceholder: '🔍 Search documents, concepts, notes…',
  searchAria: 'Search the sidebar',
  panelLabel: 'Curriculum',
  refreshAria: 'Refresh',
  refreshTitle: 'Refresh the list',
  groupMagazines: 'Magazines',
  groupUnits: 'Units',
  conceptsHint: 'Pulled from the current document’s headings; click one to jump.',
  showAllNotesLabel: 'Show notes from every document',

  // --- Right-hand chapter navigation ---------------------------------------
  tocHeader: '🧭 Navigation',

  // --- Welcome screen ------------------------------------------------------
  welcomeEyebrow: 'UNIVERSAL READER',
  welcomeTitle: 'Your learning content appears here',
  welcomeBody: 'Finish Phase 0 first, then drop the generated Markdown into <code>content/magazines</code> or <code>content/units</code>.',

  // --- Note dialog ---------------------------------------------------------
  noteDialogSelected: 'Selected text',
  noteDialogCloseAria: 'Close',
  noteDialogLabel: 'Your note',
  noteDialogPlaceholder: 'Jot down a question, an explanation, or a +explicit query…',
  noteDialogDelete: 'Delete',
  noteDialogCancel: 'Cancel',
  noteDialogSave: 'Save',
  addNoteLabel: '＋ Note',

  // --- Sort button (both directions) ---------------------------------------
  sortAsc: '↑ Old → New',
  sortDesc: '↓ New → Old',

  // --- Save states (state machine in frontend_spec §6.3; order is fixed) ----
  statusIdle: 'Ready',
  statusDirty: 'Unsaved',
  statusSaving: 'Saving…',
  statusSaved: 'Saved',
  statusSaveFailed: 'Save failed',
  statusLoading: 'Loading…',
  statusLoaded: 'Loaded',
  statusLoadFailed: 'Load failed',
  statusInitFailed: 'Init failed',

  // --- Empty states --------------------------------------------------------
  emptyGroup: 'Nothing here yet',
  contentsEmptyAria: 'This project has no learning content yet',
  noDocumentOpen: 'No document open yet',
  conceptsNoHeadings: 'This document has no section headings',
  tocNoHeadings: 'This document has no headings',
  notesEmpty: 'No notes yet',

  // --- Notes list fallbacks ------------------------------------------------
  noteSummaryFallback: 'Summary',
  noteHighlightOnly: 'Highlight only',
  highlightTooltip: 'Highlight',

  // --- Toasts --------------------------------------------------------------
  toastNoChanges: 'No changes — already up to date',
  toastNoteSaved: 'Note saved',
  toastNoteDeleted: 'Note deleted',
  toastAnchorStale: 'This note no longer lines up with the text — its anchor is stale.',

  // --- Diagrams ------------------------------------------------------------
  vizRenderFailed: 'Diagram failed to render (expand to view source)',
};
