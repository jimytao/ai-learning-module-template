/**
 * Validate interactive markdown in content/magazines and content/units.
 * Usage: node scripts/validate_content.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIRS = [
  path.join(ROOT, 'content', 'magazines'),
  path.join(ROOT, 'content', 'units'),
];

const TEXTAREA_REGEX =
  /^\s*[-*+]?\s*\*\*(?:.*?\b)?\[?Your Answer\]?\*\*(?:\s*:)?(?:\s*\((.*?)\))?/i;
const INTERACTIVE_REGEX = /(\[([ xX])\]|_{2}([^\n_]+)_{2}|_{3,})/g;
const BACKTICKS_BLANK_REGEX = /`[^`]*?__[^`]*?`/;
const MCQ_ANSWER_RE = /<!--\s*answer:\s*[A-D]\s*\|/i;
const TF_ANSWER_RE = /<!--\s*answer:\s*(True|False)\s*\|/i;

function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  let results = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) results = results.concat(getMarkdownFiles(full));
    else if (name.endsWith('.md')) results.push(full);
  }
  return results;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  const rel = path.relative(ROOT, filePath);
  const errors = [];

  let mcqStems = 0;
  let mcqAnswers = 0;
  let tfStems = 0;
  let tfAnswers = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    if (line.toLowerCase().includes('your answer')) {
      const isInput = /^\s*[-*+]?\s*[*_]{1,2}(?:.*?\b)?\[?Your Answer\]?[*_]{1,2}/i.test(line);
      if (isInput && !TEXTAREA_REGEX.test(line)) {
        errors.push(`L${lineNum}: [Your Answer] line failed textarea parse: ${line.trim()}`);
      }
    }

    if (BACKTICKS_BLANK_REGEX.test(line)) {
      errors.push(`L${lineNum}: blanks inside backticks are not allowed`);
    }

    INTERACTIVE_REGEX.lastIndex = 0;
    let match;
    while ((match = INTERACTIVE_REGEX.exec(line)) !== null) {
      if (match[0] === '__' && !match[3]) {
        errors.push(`L${lineNum}: empty "__" blank; use "___" or more`);
      }
    }

    if (/^#{2,4}\s*MCQ-/i.test(line) || /\bMCQ-\d+/i.test(line) && line.startsWith('#')) {
      mcqStems += 1;
    }
    if (/^#{2,4}\s*TF-/i.test(line) || /\bTF-\d+/i.test(line) && line.startsWith('#')) {
      tfStems += 1;
    }
    if (MCQ_ANSWER_RE.test(line)) mcqAnswers += 1;
    if (TF_ANSWER_RE.test(line)) tfAnswers += 1;
  });

  // Count stems more reliably
  mcqStems = (content.match(/^#{2,6}\s*MCQ-\d+/gim) || []).length;
  tfStems = (content.match(/^#{2,6}\s*TF-\d+/gim) || []).length;
  mcqAnswers = (content.match(/<!--\s*answer:\s*[A-D]\s*\|/gi) || []).length;
  tfAnswers = (content.match(/<!--\s*answer:\s*(True|False)\s*\|/gi) || []).length;

  if (mcqStems > 0 && mcqAnswers < mcqStems) {
    errors.push(`MCQ: found ${mcqStems} stems but only ${mcqAnswers} answer comments`);
  }
  if (tfStems > 0 && tfAnswers < tfStems) {
    errors.push(`T/F: found ${tfStems} stems but only ${tfAnswers} answer comments`);
  }

  if (/___/.test(content) && /```[\s\S]*?___[\s\S]*?```/.test(content)) {
    errors.push('Possible blank "___" inside fenced code block (will not render as input)');
  }

  // Visual arsenal: mermaid / viz-* should have a preceding <!-- visual: ... -->
  const visualTypes = ['photo', 'table', 'steps', 'callout', 'flow', 'tree', 'seq', 'state', 'blocks', 'svg-lite', 'formula'];
  const vizBlockRe = /```mermaid[\s\S]*?```|<div class="viz-(?:blocks|svg|steps|formula)"/g;
  let m;
  while ((m = vizBlockRe.exec(content)) !== null) {
    const before = content.slice(Math.max(0, m.index - 280), m.index);
    if (!/<!--\s*visual:\s*\w+/.test(before)) {
      errors.push(`Visual block near offset ${m.index} missing <!-- visual: TYPE | ... --> header`);
    }
  }

  // Ban mermaid init / click (security + consistency)
  if (/```mermaid[\s\S]*?\bclick\b/i.test(content)) {
    errors.push('mermaid click/javascript interactions are forbidden');
  }
  if (/```mermaid[\s\S]*?%%\s*\{?\s*init/i.test(content)) {
    errors.push('mermaid init theme overrides are forbidden; use global frontend theme');
  }

  // Unknown visual types in headers
  const headerRe = /<!--\s*visual:\s*([a-z0-9-]+)/gi;
  let h;
  while ((h = headerRe.exec(content)) !== null) {
    if (!visualTypes.includes(h[1])) {
      errors.push(`Unknown visual type "${h[1]}" — see visual_arsenal.md`);
    }
  }

  return { rel, errors };
}

console.log('Validating content markdown...\n');
let files = [];
CONTENT_DIRS.forEach((d) => {
  files = files.concat(getMarkdownFiles(d));
});

if (files.length === 0) {
  console.log('No content markdown yet. OK (empty project).');
  process.exit(0);
}

let total = 0;
files.forEach((f) => {
  const { rel, errors } = validateFile(f);
  if (errors.length) {
    console.log(`❌ ${rel}`);
    errors.forEach((e) => console.log(`   - ${e}`));
    total += errors.length;
  } else {
    console.log(`✅ ${rel}`);
  }
});

if (total) {
  console.log(`\nFailed with ${total} issue(s).`);
  process.exit(1);
}
console.log('\nAll content files passed.');
