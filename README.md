# AI Learning Module Template

## Language versions

| Branch | Language | Who it’s for |
| :--- | :--- | :--- |
| **`macos-chinese`** (this branch) | Chinese-primary template + complete macOS reader | Chinese-primary macOS users |
| **`Chinese`** | Chinese-primary documentation baseline | Chinese-primary users |
| **`macos-english`** | Fully English template + complete macOS reader | English-primary macOS users |
| **`English`** | Fully English documentation baseline | English-primary users |

```bash
# Complete Chinese-primary macOS reader (this branch)
git clone -b macos-chinese https://github.com/jimytao/ai-learning-module-template.git

# Chinese docs
git clone -b Chinese https://github.com/jimytao/ai-learning-module-template.git
```

Or after cloning: `git checkout macos-chinese` / `git checkout macos-english`.

---

A **subject-agnostic, AI-coached learning blank template** with dual content modes: long-form **Magazine** articles and drill-oriented **Units**.

Distilled from battle-tested textbook and magazine learning systems: routing, scheduling, generation, grading, annotation-driven review, and a strict visual arsenal (flowcharts, trees, block diagrams, and more).

> **AI entrypoint**: read [`AGENT.md`](AGENT.md) first  
> **Design notes**: [`DESIGN.md`](DESIGN.md)

---

## What this is — and what it is not

This is a folder-based learning system for an AI coding agent. The AI reads `AGENT.md`, learns your goals and preferences, proposes a sequence, writes lessons as Markdown, and later grades your answers and uses your notes to plan review. Your profile, progress, content, and annotations remain as readable files in this project.

It is **not** a prewritten course or a model/API subscription. You bring an AI agent with permission to read and edit this folder. The macOS branches also include a local web reader; the Windows baseline branches keep their existing Windows workflow.

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

4. The AI interviews you about the subject, testable goal, current level, known material, gaps, interests, time, **primary explanation language**, learning-content language, and Textbook/Magazine/Hybrid modality. The explanation language is the language used for difficult explanations and feedback even if you are studying English. Review the confirmation card and reply `confirm` only when it is accurate.
5. After confirmation, the AI writes the accepted information to `knowledge/profile.md` and the other knowledge/state files and rewrites `AGENT.md` into your subject's project. **You can already start learning at this point.** Removing the one-time bootstrap prompt through `protocols/cleanup_template.md` happens later, once the reader is verified; your saved preferences are retained and can later be changed with `update profile`.
6. Install Node.js 20+, then double-click **`start.command`**. On its first run it installs local dependencies and opens the complete web reader. Then run `npm test` and `node scripts/verify_reader.js` — both must be clean before the cleanup step above may run.
   * If macOS blocks the first launch, run `chmod +x start.command && ./start.command` in Terminal.
   * The reader includes navigation, Markdown/Mermaid rendering, answer autosave, highlights, Notes, and Smart Merge.

## Every learning cycle after setup

Use short commands; `AGENT.md` routes them to the correct protocol:

1. **Plan:** `What should I study today?` or `Propose the next unit.` The AI reads your calendar, interests, and gaps, then presents a proposal. It does not write the lesson yet.
2. **Approve and generate:** revise the proposal if needed, then say `Confirm the proposal and generate it.` The AI creates a new Magazine/Unit Markdown file, validates it, and updates the calendar.
3. **Study:** open the local reader, read, answer questions, and add Notes/highlights. Inputs autosave into the source Markdown.
4. **Review:** say `Grade my answers and explain my highlights.` The AI grades in context and updates gaps/progress. It must ask before creating extra drills.
5. **Repeat:** say `What should I study today?` again. The next proposal should mix new material with spaced recurrence of your weak points.

Useful maintenance commands include `update profile`, `change explanation language`, `change modality`, `show progress`, and `debug the reader`.

## Choose an AI coding agent

Plans and limits change. Follow the official link before subscribing; most people only need **one** of these tools.

| Tool | What it is | How to get it / account requirements |
| :--- | :--- | :--- |
| [Cursor](https://cursor.com/download) | AI-first code editor; easiest visual starting point for users familiar with VS Code | Its [Hobby plan](https://cursor.com/pricing) has limited free Agent usage and needs no credit card. Built-in model usage does not require your own model API key; paid plans increase limits. |
| [Devin](https://app.devin.ai/) | Cloud autonomous software engineer with its own shell, editor, and browser | Sign up in the web app and connect the repository. Devin currently offers a limited [Free plan](https://docs.devin.ai/admin/billing/self-serve) — this is free plan usage, not a separately named “free Agent model.” Paid plans increase usage; MCP availability can depend on plan. |
| [Hermes Agent](https://hermes-agent.nousresearch.com/docs/) | Open-source, self-improving personal agent with memory, skills, and terminal/desktop surfaces | Install Hermes Desktop or its CLI. The software is MIT-licensed, but inference still needs a provider: a Nous Portal subscription, a supported provider API key/OAuth, or a compatible local endpoint. |
| [OpenAI Codex](https://learn.chatgpt.com/docs/quickstart) | OpenAI coding agent in the ChatGPT desktop app, CLI, IDE extension, and cloud | Sign in with an eligible ChatGPT plan; [current Codex plans and limits](https://learn.chatgpt.com/docs/pricing) include a limited Free tier. CLI/IDE can alternatively use a billed OpenAI API key, but some cloud features may differ. |
| [Claude Code](https://code.claude.com/docs/en/setup) | Anthropic coding agent for terminal, IDE, desktop, and web workflows | Sign in with a paid Claude plan that includes Claude Code, or use an Anthropic Console account with active API billing. See [current pricing](https://claude.com/pricing). Free Claude chat alone should not be assumed to include Claude Code. |
| [Google Antigravity](https://antigravity.google/download) | Google's agent-first IDE/platform with editor, terminal, browser, CLI, and multi-agent workflows | Sign in with a Google account. The [Individual plan](https://antigravity.google/pricing) currently starts at $0 with basic weekly limits; Google AI Pro/Ultra or Google Cloud options raise limits. A personal Gemini API key is not required for ordinary Individual use. |

Whichever you choose, give it access only to this project folder, review its plan before large edits, and keep the project under Git so changes can be inspected or reverted.

## Optional online search and image setup

An agent needs current web access to verify sources and recommend real articles, videos, or data. Some agents already include web search. If yours does not, add a trusted search MCP:

- [Tavily](https://docs.tavily.com/documentation/mcp): create a key at [app.tavily.com](https://app.tavily.com/). Its current free Researcher tier provides limited monthly credits without a card. Use Tavily's client-specific instructions for Cursor or Claude Code; for other agents, ask: `Using the official Tavily MCP documentation, configure it in this app without committing my API key.`
- [Brave Search API](https://brave.com/search/api/): create a subscription token in the [Brave dashboard](https://api-dashboard.search.brave.com/). It currently includes monthly free credit but requires a card for anti-fraud verification. Brave publishes an [official MCP server](https://github.com/brave/brave-search-mcp-server). Ask your agent to install it using the official instructions for that client.

Store keys in the agent's secret/environment settings or a local `.env` ignored by Git. **Never paste a real key into Markdown, `AGENT.md`, an MCP config that will be committed, or a screenshot.**

Search and image download are separate capabilities:

- A Tavily/Brave MCP usually gives the AI current results and image URLs; it does not automatically save an image into this repository.
- This template's `scripts/download_images.py` actually searches and downloads a candidate into `images/`, and currently requires `BRAVE_API_KEY`; Tavily is not a drop-in replacement for that script.
- On macOS: `export BRAVE_API_KEY=...` and run the command in the Scripts section. On Windows PowerShell use `$env:BRAVE_API_KEY='...'` for the current terminal session.
- Search access does not grant copyright or reuse rights. Check the source and licence before keeping a downloaded image.

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
| [`scripts/verify_reader.js`](scripts/verify_reader.js) | Reader acceptance harness — checks the `frontend_spec.md` contract |
| [`templates/reader_skeleton.html`](templates/reader_skeleton.html) | Reference reader shell, kept for porting the UI to other branches |
| [`protocols/visual_arsenal.md`](protocols/visual_arsenal.md) | Hard syntax for flow / tree / blocks / SVG-lite… |
| [`protocols/frontend_spec.md`](protocols/frontend_spec.md) | Universal Reader specs (blanks/textarea autosaves, Notes jump, viz render) |
| [`scripts/validate_content.js`](scripts/validate_content.js) | Interactive Markdown validation |
| [`scripts/download_images.py`](scripts/download_images.py) | Brave image download (`BRAVE_API_KEY`) |

---

## Scripts

```bash
# One-click macOS launch (or double-click start.command)
./start.command

# Reader acceptance: unit tests, then the frontend_spec contract check
npm test
node scripts/verify_reader.js

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
