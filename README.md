# AI Learning Module Template

[中文说明](README.zh-CN.md)

## Language versions

| Branch | Language | Who it’s for |
| :--- | :--- | :--- |
| **`Chinese`** (this branch) | Chinese-primary docs (may mix English terms) | Chinese-primary users |
| **`English`** | Fully English documentation | English-primary users |

```bash
# Chinese docs (this branch)
git clone -b Chinese https://github.com/jimytao/ai-learning-module-template.git

# English docs
git clone -b English https://github.com/jimytao/ai-learning-module-template.git
```

Or after cloning: `git checkout Chinese` / `git checkout English`.

---

A **subject-agnostic, AI-coached learning blank template** with dual content modes: long-form **Magazine** articles and drill-oriented **Units**.

Distilled from battle-tested textbook and magazine learning systems: routing, scheduling, generation, grading, annotation-driven review, and a strict visual arsenal (flowcharts, trees, block diagrams, and more).

> **AI entrypoint**: read [`AGENT.md`](AGENT.md) first  
> **Design notes**: [`DESIGN.md`](DESIGN.md) (Chinese on this branch)

---

## What this is — and what it is not

This is a folder-based learning system for an AI coding agent. The AI reads `AGENT.md`, learns your goals and preferences, proposes a sequence, writes lessons as Markdown, and later grades your answers and uses your notes to plan review. It is not a prewritten course or a model/API subscription; you bring an agent that can edit this folder.

The four phases are:

1. **Phase 0** — Intake: subject, level, gaps, interests, time budget, learning modality (writes only after you confirm)  
2. **Phase 1** — Propose the next Magazine / Unit / mix from calendar + desires + gaps  
3. **Phase 2** — Generate content under hard format rules and the visual arsenal  
4. **Phase 3** — Grade answers and explain highlights; **must ask before generating remediation drills**

Works for Digital Health, music theory, professional courses, and more. Related courses can share one project via **Tracks**; unrelated subjects can be separate copies of this repo.

---

## First-time setup and the recurring loop

1. Clone this repo, or copy the folder (keep a clean mother template if you like).  
2. Open the whole folder in an AI coding agent and say:

```text
Read AGENT.md first and run Phase 0 / bootstrap. Do not generate lessons until I confirm the intake card.
```

(Chinese also works: `按 AGENT.md 做 Phase 0 / 初始化。`)

3. Confirm the intake card only after subject, goals, level, gaps, time, primary explanation language, content language, and modality are correct. The one-time cleanup removes the interview prompt but retains those saved preferences.
4. After your browser server files are ready:
   * Run the root **`start.bat`** script to launch the local web server with one click.
   * Tell the AI to: **"execute cleanup using protocols/cleanup_template.md"** (or `执行 protocols/cleanup_template.md 清理`). The AI will automatically clean up the template setup instructions in `AGENT.md` using anchor markers and delete the cleanup file itself.
5. Every cycle: say “schedule” → confirm the proposal → “generate” → study/highlight → “grade my work” → ask what to study next.

For current setup links for Cursor, Devin, Hermes Agent, Codex, Claude Code, Antigravity, Tavily, and Brave Search, see the detailed Chinese guide above in [`README.zh-CN.md`](README.zh-CN.md). Plans change; follow official pricing pages. Devin currently offers limited Free-plan usage rather than a separately named free Agent model. A search MCP returns results/URLs; the bundled image downloader separately requires `BRAVE_API_KEY`.

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
start.bat                # One-click Windows batch file to start the web server (node)
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
# Start the server (once browser server files are created)
start.bat

# Validate interactive markdown + visual headers under content/
node scripts/validate_content.js

# Download imageQuery assets
set BRAVE_API_KEY=your_key
python scripts/download_images.py content/magazines/magazine01_xxx.md
```

---

## Not included yet

The browser HTML/JS implementation files are not shipped in this repository. When building or copying your own browser viewer and server, refer to [`protocols/frontend_spec.md`](protocols/frontend_spec.md). It documents the complete merged specifications for both Textbook mode (inputs, textareas, checkboxes autosaved back to markdown) and Magazine mode (concept jumps, context-aware annotations with smart merge, and a visual layout).

---

## License

[MIT](LICENSE) — free to use, modify, and redistribute.

