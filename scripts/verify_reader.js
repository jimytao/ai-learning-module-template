#!/usr/bin/env node
/**
 * verify_reader.js — acceptance harness for the bundled reader (SETUP.md Step 4 /
 * p0_bootstrap Step 3.5).
 *
 * Checks the hard contracts in protocols/frontend_spec.md that can be verified without a browser:
 * locked names, theme mechanism, annotation anchoring, excluded features, and the internal
 * consistency of notes.json. Zero dependencies — runs on a bare Node install.
 *
 *   node scripts/verify_reader.js            # full run against this project
 *   node scripts/verify_reader.js --quiet    # only failures
 *   node scripts/verify_reader.js <dir>      # check a reader in another folder
 *
 * Exit 0 = acceptable, 1 = one or more FAIL. Warnings never fail the run.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const ROOT = args[0] ? path.resolve(args[0]) : path.resolve(__dirname, '..');
const QUIET = process.argv.includes('--quiet');

const results = [];
const add = (status, section, message, detail) =>
  results.push({ status, section, message, detail });
const pass = (s, m, d) => add('PASS', s, m, d);
const fail = (s, m, d) => add('FAIL', s, m, d);
const warn = (s, m, d) => add('WARN', s, m, d);

const read = (rel) => {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
  } catch {
    return null;
  }
};

/**
 * Strip comments before scanning. A comment explaining a rule must not be mistaken
 * for an implementation of it — nor for a violation, which is how a file that says
 * "deliberately no /api/git here" would otherwise fail the no-git check.
 */
function stripComments(src) {
  return src
    .replace(/<!--[\s\S]*?-->/g, ' ')          // HTML
    .replace(/\/\*[\s\S]*?\*\//g, ' ')         // /* block */ — also covers CSS
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1'); // // line, but not http:// inside a URL
}

/**
 * localStorage keys are often reached through a constant or a small map
 * (`PREF.theme`, `THEME_KEY`). Collect those aliases so save/restore can still be
 * verified without forcing the reader to inline string literals everywhere.
 */
function accessorsFor(src, key) {
  const q = `['"\`]${key}['"\`]`;
  const names = [q];
  const objAlias = new RegExp(`(\\w+)\\s*:\\s*${q}`, 'g');
  const constAlias = new RegExp(`(?:const|let|var)\\s+(\\w+)\\s*=\\s*${q}`, 'g');
  for (const re of [objAlias, constAlias]) {
    let m;
    while ((m = re.exec(src)) !== null) names.push(`(?:\\w+\\.)?${m[1]}\\b`);
  }
  return names;
}

/** Assert a regex appears in `src`; fail with a spec pointer otherwise. */
function expect(section, src, pattern, message, hint) {
  if (pattern.test(src)) pass(section, message);
  else fail(section, message, hint);
}

/** Assert a regex does NOT appear. */
function forbid(section, src, pattern, message, hint) {
  if (pattern.test(src)) fail(section, message, hint);
  else pass(section, message);
}

// ---------------------------------------------------------------------------
// Locate the reader
// ---------------------------------------------------------------------------

const SERVER_CANDIDATES = ['server.js', 'scripts/preview_server.js'];
const HTML_CANDIDATES = ['index.html', 'scripts/preview.html', 'reader.html'];

const serverPath = SERVER_CANDIDATES.find((p) => read(p) !== null);
const htmlPath = HTML_CANDIDATES.find((p) => read(p) !== null);

if (!serverPath && !htmlPath) {
  console.log('SKIP — no reader found (looked for %s).', [...SERVER_CANDIDATES, ...HTML_CANDIDATES].join(', '));
  console.log('');
  console.log('This is the expected state of a fresh template. Set the environment up per');
  console.log('SETUP.md Step 0, then re-run — unless the user explicitly declined a reader,');
  console.log('which profile.md must record.');
  process.exit(0);
}

/**
 * A reader may be one self-contained HTML file or a page plus companion scripts and
 * stylesheets. Follow local <script src> / <link rel=stylesheet> so a split reader is
 * checked as thoroughly as an inline one. Third-party bundles under vendor/ or
 * node_modules/ are skipped: their contents are not this project's contract.
 */
function linkedAssets(pageHtml, pageRel) {
  if (!pageHtml) return [];
  const baseDir = path.dirname(pageRel);
  const refs = [
    ...pageHtml.matchAll(/<script[^>]+src=["']([^"']+)["']/gi),
    ...pageHtml.matchAll(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi),
  ].map((m) => m[1]);

  const out = [];
  for (const ref of refs) {
    if (/^(?:https?:)?\/\//.test(ref) || ref.startsWith('data:')) continue;   // remote
    if (/(^|\/)(?:vendor|node_modules)\//.test(ref)) continue;                // third-party
    const rel = ref.startsWith('/')
      ? ref.slice(1)
      : path.posix.join(baseDir === '.' ? '' : baseDir.replace(/\\/g, '/'), ref);
    const body = read(rel);
    if (body !== null) out.push({ rel, body: stripComments(body) });
  }
  return out;
}

const server = stripComments(serverPath ? read(serverPath) : '');
const rawHtml = htmlPath ? read(htmlPath) : '';
const assets = linkedAssets(rawHtml, htmlPath || 'index.html');
// `html` is the client side of the reader: the page plus everything it pulls in.
const html = stripComments(rawHtml) + '\n' + assets.map((a) => a.body).join('\n');
const all = server + '\n' + html;

if (assets.length) pass('setup', `Linked assets scanned: ${assets.map((a) => a.rel).join(', ')}`);

if (!serverPath) fail('setup', 'A server exists (server.js or scripts/preview_server.js)', 'start.command looks for these two paths only');
else pass('setup', `Server found: ${serverPath}`);
if (!htmlPath) fail('setup', 'A reader page exists (index.html or scripts/preview.html)');
else pass('setup', `Reader page found: ${htmlPath}`);

// ---------------------------------------------------------------------------
// §2.5 Theme
// ---------------------------------------------------------------------------

const S = 'theme §2.5';
expect(S, html, /document\.documentElement\.setAttribute\(\s*['"]data-theme['"]/,
  'Theme is carried on html[data-theme]',
  'Use documentElement data-theme, not a body class — a body class cannot be set before first paint');

// Either theme may be the base; what matters is that a second one overrides it.
expect(S, html, /\[data-theme\s*=\s*["'](?:light|dark)["']\]/,
  'A second theme overrides the base variables',
  'Define one theme on :root and override the same custom properties under [data-theme="…"]');

forbid(S, html, /\.light-theme\b/,
  'No legacy body.light-theme selectors',
  'frontend_spec §2.5.1 locks html[data-theme]; the magazine reader\'s body class is the FOUC bug');

// FOUC guard: the inline theme script must appear before the first stylesheet link.
const headEnd = html.search(/<\/head>/i);
const head = headEnd > -1 ? html.slice(0, headEnd) : html;
const guardAt = head.search(/localStorage\.getItem\(\s*['"]ltm_theme['"]\s*\)/);
const firstCss = head.search(/<link[^>]+rel=["']stylesheet["']/i);
if (guardAt === -1) {
  fail(S, 'FOUC guard present in <head>', 'Inline script reading ltm_theme must run before first paint (§2.5.2)');
} else if (firstCss !== -1 && guardAt > firstCss) {
  fail(S, 'FOUC guard runs before the first stylesheet', 'Move the inline theme script above every <link rel="stylesheet">');
} else {
  pass(S, 'FOUC guard present and correctly placed');
}

if (/hljs|highlight\.js|highlight\.min\.js/i.test(html)) {
  expect(S, html, /hljs-theme-link|highlight-theme-link/,
    'highlight.js stylesheet is swappable by id',
    'Give the hljs <link> an id and rewrite href on toggle, or code blocks stay dark in light mode');
}

// ---------------------------------------------------------------------------
// §7.3 Locked names
// ---------------------------------------------------------------------------

const N = 'names §7.3';
for (const key of ['ltm_theme', 'ltm_sort_order', 'ltm_sidebar_collapsed', 'ltm_notes_show_all']) {
  const accessors = accessorsFor(all, key).join('|');
  // Both halves must exist: setItem alone forgets, getItem alone never records.
  const saved = new RegExp(`setItem\\(\\s*(?:${accessors})`).test(all);
  const restored = new RegExp(`getItem\\(\\s*(?:${accessors})`).test(all);
  if (saved && restored) pass(N, `${key} is both saved and restored`);
  else if (saved) fail(N, `${key} is restored on load`, `Only setItem found — the user's choice is written but never read back, so every reload shows the default (§2.1)`);
  else if (restored) fail(N, `${key} is saved on change`, `Only getItem found — the preference can never be changed persistently (§2.1)`);
  else fail(N, `localStorage key ${key} is used`, 'Missing entirely (§7.3)');
}

const LEGACY = {
  issue_sort_order: 'ltm_sort_order',
  curriculum_sort_order: 'ltm_sort_order',
  preview_theme: 'ltm_theme',
  toc_collapsed: 'ltm_sidebar_collapsed',
  sidebar_collapsed: 'ltm_sidebar_collapsed',
};
for (const [old, replacement] of Object.entries(LEGACY)) {
  forbid(N, all, new RegExp(`['"\`]${old}['"\`]`), `Legacy key ${old} not used`, `Rename to ${replacement}`);
}

for (const route of ['/api/files', '/api/file', '/api/save', '/api/notes']) {
  expect(N, all, new RegExp(route.replace(/\//g, '\\/')), `Route ${route} exists`);
}

for (const [sel, why] of [
  ['annotated-word', 'every marked span'],
  ['custom-highlight', 'isHighlight === true'],
  ['data-primary', 'the single context-matched occurrence'],
  ['interactive-blank', 'autosaved blanks'],
  ['interactive-textarea', 'autosaved open answers'],
  ['interactive-checkbox', 'autosaved choices'],
]) {
  expect(N, html, new RegExp(sel), `DOM name "${sel}" present (${why})`);
}

// ---------------------------------------------------------------------------
// §4 Annotation anchoring — the part that silently rots
// ---------------------------------------------------------------------------

const A = 'annotations §4';
expect(A, html, /isHighlight/,
  'Both annotation forms exist (isHighlight)',
  '§4.1: underline = note, highlight = no-text marker');

expect(A, html, /data-primary/,
  'Primary-occurrence marking implemented',
  '§4.3: mark every occurrence, but flag only the context match');

expect(A, html, /contextOffset/, 'contextOffset is read and written');

// The <3 tolerance is the fingerprint of a correct primary test. It may be written
// inline or held in a named constant, but the value must be 3.
expect(A, html, /<\s*3\b|TOLERANCE\s*=\s*3\b/i,
  'Offset tolerance of 3 chars used in the primary test',
  '§4.3: abs(matchIndex - contextOffset) < 3 — not ===0, not a wider window');

expect(A, html, /\.sort\(\s*\([^)]*\)\s*=>\s*b\.word\.length\s*-\s*a\.word\.length|length\s*-\s*a\.word\.length/,
  'Annotation patterns sorted longest-first',
  '§4.3: otherwise a short word swallows the longer phrase containing it');

// Snapping may extend a DOM Range or walk the offsets in the context string; both
// are fine as long as the stored word and offset end up consistent.
expect(A, html, /snapRange|snapSelection|WordBoundar|wordChar/i,
  'Selection snaps to word boundaries',
  '§4.2: snap BEFORE computing context/offset, or the stored offset will not match the stored word');

// Written either as tag names ('PRE') or as a CSS selector list ('pre, code, …').
for (const tag of ['PRE', 'CODE', 'TEXTAREA', 'INPUT']) {
  expect(A, html, new RegExp(`\\b${tag}\\b`, 'i'), `Exclusion list mentions ${tag}`,
    '§4.3: never wrap annotations inside code or form controls');
}

expect(A, html, /scrollIntoView/, 'Jump scrolls the target into view');

expect(A, html, /viz-block-body/,
  'Diagram/flowchart box text (.viz-block-body) is annotatable',
  '§4.3: it is a <div>, and div is not block-level in general here, so it needs an explicit ' +
  'class check — otherwise text inside a viz-arsenal box can never be selected or highlighted');

// ---------------------------------------------------------------------------
// §7.4 Exclusions
// ---------------------------------------------------------------------------

const X = 'exclusions §7.4';
forbid(X, all, /\/api\/git/,
  'No /api/git/* routes',
  'Version control is out of scope for the reader; many template users have no Git at all');
forbid(X, all, /simple-git|child_process[\s\S]{0,80}git\s/,
  'Server does not shell out to git');
forbid(X, html, /switchTab\(\s*['"]git['"]\s*\)|id=["']tab-git-btn["']/i,
  'No Git tab in the sidebar');

// ---------------------------------------------------------------------------
// §1 / §6 Isolation and autosave
// ---------------------------------------------------------------------------

const I = 'isolation §1';
if (server) {
  expect(I, server, /content[\/\\]/, 'Server scopes document listing to content/');
  forbid(I, server, /['"`](?:\.\.[\/\\])?(?:protocols|knowledge|state)[\/\\]/,
    'Server exposes no protocols//knowledge//state paths',
    '§7.4: the reader must not be able to read or write the rules layer');
  expect(I, server, /path\.(?:resolve|normalize)/,
    'Server normalizes paths before filesystem access',
    'Guard against ../ traversal in the path query parameter');
}

const V = 'autosave §6';
expect(V, html, /setTimeout[\s\S]{0,160}(?:save|Save)|debounce|scheduleSave/i,
  'Autosave is debounced',
  '§6.2: batch rapid edits before POSTing, or every keystroke hits the server');
expect(V, html, /method:\s*['"]POST['"]/, 'Client POSTs saves to the server');

// ---------------------------------------------------------------------------
// notes.json — data-level invariants (the checks that catch real rot)
// ---------------------------------------------------------------------------

const D = 'notes.json';
const rawNotes = read('notes.json');
if (rawNotes === null) {
  warn(D, 'notes.json not found — skipped', 'Created on first annotation');
} else {
  let notes;
  try {
    notes = JSON.parse(rawNotes);
  } catch (e) {
    fail(D, 'notes.json parses as JSON', e.message);
    notes = null;
  }

  if (notes && !Array.isArray(notes)) {
    fail(D, 'notes.json is an array');
  } else if (notes) {
    pass(D, `notes.json parses (${notes.length} entries)`);

    const ids = new Set();
    let dupes = 0, noFile = 0, noContext = 0, noOffset = 0, badOffset = 0, reviews = 0;

    for (const n of notes) {
      if (!n || typeof n !== 'object') continue;
      if (n.id) {
        if (ids.has(n.id)) dupes++;
        ids.add(n.id);
      }
      if (!n.file && !n.issue) noFile++;
      if (n.aiReview) reviews++;

      if (!n.context) {
        noContext++;
        continue;
      }
      // The anchor must actually point at the word it claims to.
      const word = String(n.word || '');
      if (!word) continue;
      if (n.contextOffset === undefined || n.contextOffset === null) {
        noOffset++;   // has context but no offset — half-anchored, cannot resolve a repeated word
        continue;
      }
      const off = Number(n.contextOffset);
      if (!Number.isFinite(off)) {
        badOffset++;
        continue;
      }
      const at = n.context.substr(off, word.length).toLowerCase();
      if (at !== word.toLowerCase()) {
        // Allow the same <3 char drift the renderer tolerates.
        const near = n.context.toLowerCase().indexOf(word.toLowerCase(), Math.max(0, off - 3));
        if (near === -1 || Math.abs(near - off) >= 3) badOffset++;
      }
    }

    dupes ? fail(D, `Annotation ids are unique`, `${dupes} duplicate id(s)`)
          : pass(D, 'Annotation ids are unique');
    noFile ? fail(D, 'Every note names its document', `${noFile} entry/entries without file or issue — these can never be isolated or located`)
           : pass(D, 'Every note names its document');
    badOffset ? fail(D, 'contextOffset lands on the stored word', `${badOffset} entry/entries whose offset does not point at word — §4.2 capture-order bug (offset computed before snapping)`)
              : pass(D, 'contextOffset lands on the stored word');
    noOffset ? fail(D, 'Every note with context also stores contextOffset', `${noOffset} entry/entries have context but no contextOffset — half-anchored, so a repeated word cannot resolve to one occurrence (§4.3)`)
             : pass(D, 'Every note with context also stores contextOffset');

    if (noContext) {
      warn(D, `${noContext} legacy note(s) have no context`,
        'Tolerated via locate rule 3; new notes must always carry context');
    }
    if (reviews) pass(D, `${reviews} aiReview block(s) present — Smart Merge must preserve these`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const counts = { PASS: 0, WARN: 0, FAIL: 0 };
for (const r of results) counts[r.status]++;

const ICON = { PASS: '  ok  ', WARN: ' warn ', FAIL: ' FAIL ' };
let section = null;
for (const r of results) {
  if (QUIET && r.status === 'PASS') continue;
  if (r.section !== section) {
    section = r.section;
    console.log(`\n${section}`);
  }
  console.log(`${ICON[r.status]} ${r.message}`);
  if (r.detail && r.status !== 'PASS') console.log(`        → ${r.detail}`);
}

console.log(`\n${counts.PASS} passed · ${counts.WARN} warnings · ${counts.FAIL} failed`);
if (counts.FAIL) {
  console.log('\nReader is NOT accepted (SETUP.md Step 4). Fix the FAIL items above (see protocols/frontend_spec.md).');
  process.exit(1);
}
console.log('\nReader accepted (SETUP.md Step 4 satisfied).');
