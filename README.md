# AI Learning Module Template

## Language versions

| Branch | Language | Who it’s for |
| :--- | :--- | :--- |
| **`macos-english`** (this branch) | Fully English template + complete macOS reader | English-primary macOS users |
| **`English`** | Fully English documentation baseline | English-primary users |
| **`Chinese`** | Chinese-primary docs (may mix some English terms) | Chinese-primary users |
| **`macos-chinese`** | Chinese-primary template + complete macOS reader | Chinese-primary macOS users |

```bash
# Complete English macOS reader (this branch)
git clone -b macos-english https://github.com/jimytao/ai-learning-module-template.git

# Chinese docs
git clone -b Chinese https://github.com/jimytao/ai-learning-module-template.git
```

Or after cloning: `git checkout macos-english` / `git checkout macos-chinese`.

---

A **subject-agnostic, AI-coached learning blank template** with dual content modes: long-form **Magazine** articles and drill-oriented **Units**.

Distilled from battle-tested textbook and magazine learning systems: routing, scheduling, generation, grading, annotation-driven review, and a strict visual arsenal (flowcharts, trees, block diagrams, and more).

> **AI entrypoint**: read [`AGENT.md`](AGENT.md) first  
> **Design notes**: [`DESIGN.md`](DESIGN.md)

---

## What this is

An operating system for “learn any subject with an AI coach”:

1. **Phase 0** — Intake: subject, level, gaps, interests, time budget, learning modality (writes only after you confirm)  
2. **Phase 1** — Propose the next Magazine / Unit / mix from calendar + desires + gaps  
3. **Phase 2** — Generate content under hard format rules and the visual arsenal  
4. **Phase 3** — Grade answers and explain highlights; **must ask before generating remediation drills**

Works for Digital Health, music theory, professional courses, and more. Related courses can share one project via **Tracks**; unrelated subjects can be separate copies of this repo.

---

## Quick start

1. Clone this repo (prefer the branch for your language), or copy the folder (keep a clean mother template if you like).  
2. Open it in Cursor (or a similar AI coding agent) and say:

```text
Follow AGENT.md and run Phase 0 / bootstrap.
```

3. Install Node.js 20+, then double-click **`start.command`**. On its first run it installs local dependencies and opens the complete web reader.
   * If macOS blocks the first launch, run `chmod +x start.command && ./start.command` in Terminal.
   * The reader includes navigation, Markdown/Mermaid rendering, answer autosave, highlights, Notes, and Smart Merge.
4. After you confirm the profile and modality:
   * Tell the AI to: **"execute cleanup using protocols/cleanup_template.md"**. The AI will clean up the template setup instructions in `AGENT.md` using anchor markers and delete the cleanup file itself.
5. Go ahead and start learning: say “schedule” → “generate” → study / highlight → “grade my work”.

### Learning modality presets

| Code | Name | Feel |
| :--- | :--- | :--- |
| **T** | Textbook-first | Short, fast, drill-heavy |
| **M** | Magazine-first | Long, slow, popular-science / research reading |
| **H** | Hybrid (recommended default) | Magazines for big themes + Units for consolidation |
| **C** | Custom | Your own rules |

See [`knowledge/modality_presets.md`](knowledge/modality_presets.md).

### How to organize projects

| Mode | When |
| :--- | :--- |
| One project, one subject | You only study one course |
| One project, multiple Tracks | Related courses (e.g. several Digital Health modules) |
| Copy the folder | Subjects are far apart and need physical isolation |

See [`protocols/project_lifecycle.md`](protocols/project_lifecycle.md).

---

## Repository layout

```
AGENT.md                 # Sole AI router / entrypoint (Bootstrap post-cleanup removes setup guides)
start.command            # macOS first-run install, server launch, and browser open
server.js                # Local files, autosave, and Notes Smart Merge backend
index.html / app.js      # Universal Magazine + Unit web reader
reader-core.js           # Interactive exercise parsing and Markdown write-back
DESIGN.md                # Design rationale
protocols/               # Phase 0–3, tech_spec, visual_arsenal, frontend_spec, cleanup_template…
knowledge/               # profile / desire / calendar / domain_map / modalities
state/                   # log / gaps / warehouse
content/magazines/       # Long-form rich input
content/units/           # Short lessons + exercises
templates/               # Generation skeletons
scripts/                 # Image download, validation, viz.css
notes.json               # Annotations (full-sentence context)
review.md                # Grading retrospectives archive
```

| Path | Role |
| :--- | :--- |
| [`protocols/intake_checklist.md`](protocols/intake_checklist.md) | Phase 0 intake confirmation checklist |
| [`protocols/cleanup_template.md`](protocols/cleanup_template.md) | One-time post-initialization cleanup instructions (deletes itself) |
| [`protocols/visual_arsenal.md`](protocols/visual_arsenal.md) | Hard syntax for flow / tree / blocks / SVG-lite… |
| [`protocols/frontend_spec.md`](protocols/frontend_spec.md) | Universal Reader specs (blanks/textarea autosaves, Notes jump, viz render) |
| [`scripts/validate_content.js`](scripts/validate_content.js) | Interactive Markdown validation |
| [`scripts/download_images.py`](scripts/download_images.py) | Brave image download (`BRAVE_API_KEY`) |

---

## Scripts

```bash
# One-click macOS launch (or double-click start.command)
./start.command

# Start only the server without opening a browser
npm start

# Validate interactive markdown + visual headers under content/
node scripts/validate_content.js

# Download imageQuery assets
export BRAVE_API_KEY=your_key
python3 scripts/download_images.py content/magazines/magazine01_xxx.md
```

---

## Built-in web reader

This branch ships the Universal Reader specified by [`protocols/frontend_spec.md`](protocols/frontend_spec.md): grouped Magazine/Unit navigation, persistent sorting, Markdown and Mermaid, autosaved blanks/answers/choices, per-document Notes, `context + contextOffset` jumps, and Smart Merge that preserves AI reviews. The server listens only on `127.0.0.1` and limits browser writes to the two learning-content directories plus `notes.json`.

---

## License

[MIT](LICENSE) — free to use, modify, and redistribute.
