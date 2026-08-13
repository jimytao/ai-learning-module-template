# AI Learning Module Template

## Language versions

| Branch | Language | Who it’s for |
| :--- | :--- | :--- |
| **`English`** (this branch) | Fully English documentation | English-primary users |
| **`Chinese`** | Chinese-primary docs (may mix some English terms) | Chinese-primary users |

```bash
# English docs (this branch)
git clone -b English https://github.com/jimytao/ai-learning-module-template.git

# Chinese docs
git clone -b Chinese https://github.com/jimytao/ai-learning-module-template.git
```

Or after cloning: `git checkout English` / `git checkout Chinese`.

---

A **subject-agnostic, AI-coached learning blank template** with dual content modes: long-form **Magazine** articles and drill-oriented **Units**.

Distilled from battle-tested textbook and magazine learning systems: routing, scheduling, generation, grading, annotation-driven review, and a strict visual arsenal (flowcharts, trees, block diagrams, and more).

> **AI entrypoint**: read [`AGENT.md`](AGENT.md) first  
> **Design notes**: [`DESIGN.md`](DESIGN.md)

---

## What this is — and what it is not

This is a folder-based learning system for an AI coding agent. The AI reads `AGENT.md`, learns your goals and preferences, proposes a sequence, writes lessons as Markdown, and later grades your answers and uses your notes to plan review. Your profile, progress, content, and annotations remain as readable files in this project.

It is **not** a prewritten course or a model/API subscription. You bring an AI agent with permission to read and edit this folder. The macOS branches include a complete local web reader; this baseline keeps the Windows launcher and the documented reader contract for a reader generated or migrated during setup.

The learning loop has four phases:

1. **Phase 0** — Intake: subject, level, gaps, interests, time budget, learning modality (writes only after you confirm)  
2. **Phase 1** — Propose the next Magazine / Unit / mix from calendar + desires + gaps  
3. **Phase 2** — Generate content under hard format rules and the visual arsenal  
4. **Phase 3** — Grade answers and explain highlights; **must ask before generating remediation drills**

Works for Digital Health, music theory, professional courses, and more. Related courses can share one project via **Tracks**; unrelated subjects can be separate copies of this repo.

---

## First-time setup

1. Clone this repo (prefer the branch for your language), or copy the folder (keep a clean mother template if you like).  
2. Open the **whole folder** in Cursor, Codex, Claude Code, Devin, Hermes Agent, Antigravity, or another file-editing agent. Do not paste only one Markdown file into a normal chatbot.
3. Tell the agent:

```text
Read AGENT.md first and run Phase 0 / bootstrap. Do not generate lessons until I confirm the intake card.
```

4. The AI interviews you about the subject, testable goal, current level, known material, gaps, interests, time, **primary explanation language**, learning-content language, and Textbook/Magazine/Hybrid modality. The explanation language is used for difficult explanations and feedback even if you are studying English. Review the confirmation card and reply `confirm` only when it is accurate.
5. After confirmation the AI writes the accepted information to `knowledge/profile.md` and the other knowledge/state files, and rewrites `AGENT.md` into your subject's project. **At this point you can already start learning** — go to the cycle below.
6. Separately, the AI prepares the reader files required by `protocols/frontend_spec.md` and tests **`start.bat`**. Only once that works (or you tell it you don't want a reader) does it run `protocols/cleanup_template.md`, which removes the one-time bootstrap prompt while retaining your saved preferences. This step is deliberately deferred — it never blocks studying.

> **Git is optional.** If you have it, cleanup records a commit so every edit is reversible. If you don't, it saves a backup of `AGENT.md` under `state/` and asks you to confirm before editing. You will not be asked to install anything.

## Every learning cycle after setup

1. **Plan:** `What should I study today?` or `Propose the next unit.` The AI reads your calendar, interests, and gaps and presents a proposal; it does not write the lesson yet.
2. **Approve and generate:** revise the proposal if needed, then say `Confirm the proposal and generate it.` The AI creates a Magazine/Unit Markdown file, validates it, and updates the calendar.
3. **Study:** open the reader, read, answer questions, and add Notes/highlights.
4. **Review:** say `Grade my answers and explain my highlights.` The AI grades in context and updates gaps/progress. It must ask before creating extra drills.
5. **Repeat:** ask what to study next. The proposal should combine new material with recurrence of weak points.

Useful maintenance commands include `update profile`, `change explanation language`, `change modality`, `show progress`, and `debug the reader`.

## Choose an AI coding agent

Plans and limits change. Follow the official link before subscribing; most people only need **one** tool.

| Tool | What it is | How to get it / account requirements |
| :--- | :--- | :--- |
| [Cursor](https://cursor.com/download) | AI-first code editor and a friendly visual starting point | Its [Hobby plan](https://cursor.com/pricing) has limited free Agent usage. Built-in models do not require your own API key; paid plans increase limits. |
| [Devin](https://app.devin.ai/) | Cloud autonomous software engineer with shell, editor, and browser | Connect the repository after signup. Devin offers a limited [Free plan](https://docs.devin.ai/admin/billing/self-serve), not a separately named free Agent model. Paid plans increase usage; MCP availability can depend on plan. |
| [Hermes Agent](https://hermes-agent.nousresearch.com/docs/) | Open-source personal agent with memory, skills, and terminal/desktop surfaces | The software is MIT-licensed, but inference needs a Nous Portal subscription, provider API key/OAuth, or compatible local endpoint. |
| [OpenAI Codex](https://learn.chatgpt.com/docs/quickstart) | OpenAI coding agent in ChatGPT desktop, CLI, IDE, and cloud | Sign in with an eligible ChatGPT plan; [current Codex plans](https://learn.chatgpt.com/docs/pricing) include limited Free usage. CLI/IDE can alternatively use a billed OpenAI API key, with some feature differences. |
| [Claude Code](https://code.claude.com/docs/en/setup) | Anthropic coding agent for terminal, IDE, desktop, and web | Use a paid Claude plan that includes Claude Code, or an Anthropic Console account with active API billing. See [pricing](https://claude.com/pricing). |
| [Google Antigravity](https://antigravity.google/download) | Google's agent-first IDE/platform | Sign in with Google. The [Individual plan](https://antigravity.google/pricing) currently starts at $0 with basic weekly limits; paid Google AI/Cloud options raise limits. |

Give the chosen agent access only to this project folder, review its plan before large edits, and use Git so changes remain inspectable.

## Optional online search and image setup

Some agents include web search. Otherwise add a trusted MCP using its official client-specific instructions:

- [Tavily MCP](https://docs.tavily.com/documentation/mcp): obtain a key from [app.tavily.com](https://app.tavily.com/); the current free Researcher tier has limited monthly credits without a card.
- [Brave Search API](https://brave.com/search/api/): obtain a token from the [dashboard](https://api-dashboard.search.brave.com/). Current plans include monthly free credit but require a card for anti-fraud verification. Brave provides an [official MCP server](https://github.com/brave/brave-search-mcp-server).

If your client is not named in those docs, ask it: `Using the official Tavily/Brave MCP documentation, configure this trusted server without committing my API key.` Keep keys in secret/environment settings or a local `.env` ignored by Git — never in Markdown or committed MCP configuration.

A search MCP returns current results and usually image URLs; it does not automatically save an image. This repository's `scripts/download_images.py` performs the actual image search/download and specifically requires `BRAVE_API_KEY`; Tavily is not a drop-in replacement. Search access also does not grant copyright or reuse rights, so verify the source and licence.

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
templates/               # Generation skeletons + reader_skeleton.html (reference UI shell)
scripts/                 # Image download, content + reader validation, viz.css
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
| [`templates/reader_skeleton.html`](templates/reader_skeleton.html) | Reference reader UI: themes, persistence, sidebar, annotation anchoring |
| [`scripts/verify_reader.js`](scripts/verify_reader.js) | Reader acceptance harness — run after building the reader |
| [`scripts/download_images.py`](scripts/download_images.py) | Brave image download (`BRAVE_API_KEY`) |

---

## Scripts

```bash
# Start the server (once browser server files are created)
start.bat

# Validate interactive markdown + visual headers under content/
node scripts/validate_content.js

# Check the reader against protocols/frontend_spec.md (must pass with no FAIL)
node scripts/verify_reader.js

# Download imageQuery assets
set BRAVE_API_KEY=your_key
python scripts/download_images.py content/magazines/magazine01_xxx.md
```

---

## Not included yet

The browser HTML/JS implementation files are not shipped in this repository. When building or copying your own browser viewer and server, refer to [`protocols/frontend_spec.md`](protocols/frontend_spec.md). It documents the complete merged specifications for both Textbook mode (inputs, textareas, checkboxes autosaved back to markdown) and Magazine mode (concept jumps, context-aware annotations with smart merge, and a visual layout), plus the light/dark theme contract, the locked storage keys and routes, and the annotation anchoring rule that makes a repeated word locatable.

After building it, run `node scripts/verify_reader.js`. It is the acceptance bar for the reader — it checks those contracts and the internal consistency of `notes.json`, and must report no FAIL.

---

## License

[MIT](LICENSE) — free to use, modify, and redistribute.
