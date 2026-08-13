# AI tooling and online-search research

Checked against official first-party sources on 2026-08-13. Plans, prices, quotas, model availability, and installation steps can change; README copy should link to the official pricing page rather than promise a permanent price.

## Coding agents and editors

### Cursor

- **What it is:** an AI-powered code editor with codebase indexing, autocomplete, inline editing, and an Agent that can create files and run commands. [Official introduction](https://docs.cursor.com/more/ai-com) · [quickstart](https://docs.cursor.com/en/get-started/quickstart)
- **Get it:** download from [cursor.com/downloads](https://cursor.com/downloads). The editor can open without an account, but an account is required for its AI features. [Installation guide](https://docs.cursor.com/get-started/installation)
- **Cost/key:** the official [pricing page](https://cursor.com/pricing) currently lists a no-credit-card Hobby plan with limited Agent requests, plus paid individual and team plans. A separate model-provider API key is not required when using Cursor's included model allowance. Cursor optionally supports bring-your-own OpenAI, Anthropic, Google, Azure OpenAI, or Bedrock credentials for supported chat models; some specialized features still use Cursor's built-in models. [API-key guide](https://docs.cursor.com/settings/api-keys)
- **MCP:** Cursor supports local `stdio` and remote MCP servers. Project config is `.cursor/mcp.json`; global config is `~/.cursor/mcp.json`. Keys can be passed through an MCP server's `env` object. [Official MCP guide](https://docs.cursor.com/context/model-context-protocol)

### Devin

- **What it is:** Cognition's autonomous AI software engineer. It can write, run, and test code and includes a shell, IDE, and browser in its workspace. [Official introduction](https://docs.devin.ai/get-started/devin-intro)
- **Get it:** sign up in the web app at [app.devin.ai](https://app.devin.ai/). Repository access must be configured before an Agent session can work on the repository. [First-session guide](https://docs.devin.ai/get-started/first-run)
- **Cost/key:** Devin is account/plan based; ordinary web use does not require the user to supply a model API key. The official [self-serve plan documentation](https://docs.devin.ai/admin/billing/self-serve) currently lists a **Free plan with limited Devin usage**, plus access to Devin Review and DeepWiki, and paid Pro, Max, and Teams plans.
- **Clarification of the “free agent model” claim:** Cognition's current wording is a **Free plan with limited Devin usage**, not a separately named “free Agent model.” Agent mode uses selectable agent configurations; the standard `Devin` agent is the default. [Agent selection](https://docs.devin.ai/get-started/first-run) Therefore README wording should say “try Devin on its limited Free plan,” not claim a particular model is free.
- **MCP:** the current billing documentation lists MCP integrations under Pro. Availability can therefore differ by plan; point readers to Devin's current settings/docs rather than offering a universal config snippet. [Self-serve plans](https://docs.devin.ai/admin/billing/self-serve)

### Hermes Agent

- **What it is:** Nous Research's open-source, self-improving agent, with terminal/TUI, persistent memory, skills, scheduled automation, subagents, messaging gateways, and interchangeable model providers. [Official repository](https://github.com/NousResearch/hermes-agent)
- **Get it:** download Hermes Desktop or use the official installer. On macOS/Linux/WSL: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`; on Windows PowerShell: `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`. [Official quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- **Cost/key:** the software is MIT-licensed, but it still needs an inference provider. `hermes model` configures that provider. Options include provider API keys, local/OpenAI-compatible endpoints, ChatGPT OAuth for OpenAI Codex, and Nous Portal. The official quickstart describes Nous Portal as subscription-based and `hermes setup --portal` as an OAuth setup path; bring-your-own-provider modes require the relevant provider credentials. [Provider setup](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- **MCP/tools:** Hermes supports MCP configuration and also has native tools. The official repository notes that Nous Portal's Tool Gateway bundles web search, image generation, TTS, and a cloud browser; those are distinct tools, not consequences of installing any arbitrary search MCP. [Official repository and setup](https://github.com/NousResearch/hermes-agent)

### OpenAI Codex

- **What it is:** OpenAI's coding agent, available in the ChatGPT desktop app, CLI, IDE extension, web/cloud surfaces, and other supported clients. It can work against a selected local folder and its files. [Official quickstart](https://learn.chatgpt.com/docs/quickstart)
- **Get it:** the [ChatGPT desktop app](https://learn.chatgpt.com/docs/app) supports macOS, Windows, and Linux; official docs also link to the [Codex CLI](https://learn.chatgpt.com/docs/codex/cli) and IDE extension from the quickstart.
- **Cost/key:** official [Codex pricing](https://learn.chatgpt.com/docs/pricing) currently says Codex is included in ChatGPT Free, Go, Plus, Pro, Business, Edu, and Enterprise plans, with plan-specific limits. Alternatively, an API key can be used in the CLI, SDK, or IDE extension and is charged at API token rates; cloud-only features may be unavailable in API-key mode. Thus a separate API key is not required when signing in through an eligible ChatGPT plan.
- **MCP:** use `codex mcp add ...`, the IDE's **MCP servers** settings, or `~/.codex/config.toml` / project `.codex/config.toml`. Official docs cover `stdio`, Streamable HTTP, OAuth, environment-variable forwarding, allowlists, and timeouts. [Official MCP guide](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)

### Claude Code

- **What it is:** Anthropic's agentic coding tool. It reads a codebase, edits files, runs commands, and integrates with development tools; it is available in the terminal, IDE, desktop app, and browser. [Official overview](https://code.claude.com/docs/en/overview)
- **Get it:** follow the [official setup guide](https://code.claude.com/docs/en/setup) or desktop guide. The documented CLI install is `npm install -g @anthropic-ai/claude-code`, followed by `claude`. [Setup](https://code.claude.com/docs/en/setup)
- **Cost/key:** authentication can use an Anthropic Console account with active API billing, a Claude Pro/Max account, or supported enterprise cloud providers. The current [Claude pricing page](https://claude.com/pricing) says Claude Code is included in all paid Claude plans; Pro is the entry-level individual plan. A separate Anthropic API key is not needed with subscription login, but pay-as-you-go Console/API usage requires billing credentials. Free Claude chat alone should not be presented as including Claude Code.
- **MCP:** `claude mcp add` supports HTTP, deprecated SSE, local `stdio`, and WebSocket configurations, with local/project/user scopes and environment variables. Anthropic recommends remote HTTP where available and warns users to trust and review servers that fetch external content. [Official MCP guide](https://code.claude.com/docs/en/mcp)

### Google Antigravity

- **What it is:** Google's agentic development platform. Antigravity 2.0 includes a multi-agent command center, terminal-first CLI, IDE, and Python SDK. [Official product page](https://antigravity.google/)
- **Get it:** [official downloads](https://antigravity.google/download) cover macOS, Windows, and Linux, plus CLI installers. For macOS, the current download page lists Apple Silicon and Intel builds and macOS 12 as the minimum version.
- **Cost/key:** the official [pricing page](https://antigravity.google/pricing) currently lists an Individual plan at $0/month with basic weekly rate limits and several included agent models, plus paid Google AI Pro/Ultra options and an organization plan through Google Cloud. Ordinary individual use is account/plan based rather than requiring the user to bring a Gemini API key. Organization/cloud consumption may be billed through Google Cloud.
- **MCP:** the Antigravity SDK officially supports layering MCP servers over its built-in filesystem and terminal tools. [Official SDK page](https://antigravity.google/product/antigravity-sdk) Client UI/config details can change; README should advise opening the current Antigravity docs or asking Antigravity itself to configure a trusted MCP rather than publishing an unverified static path.

## Online search APIs and MCP servers

### Tavily

- **Service/key:** Tavily provides search/research APIs and an official MCP server. Create an account and obtain a key at [app.tavily.com](https://app.tavily.com/). [Official docs](https://docs.tavily.com/) · [official MCP guide](https://docs.tavily.com/documentation/mcp)
- **Current free access:** the official [pricing help page](https://help.tavily.com/articles/8816424538-pricing) lists a Researcher free tier with 1,000 API credits per month and no credit card, with paid usage beyond that subject to the current plan.
- **MCP setup:** Tavily documents the remote endpoint `https://mcp.tavily.com/mcp/` for OAuth-capable clients and a key-bearing URL for clients that need explicit API-key authentication. It also documents Cursor and Claude Code examples and a local Node-based server. Prefer its current official client example instead of copying one config to every coding agent.
- **Images:** Tavily Search can return image URLs when `include_images` is enabled. That discovers candidate images; it does not by itself save a file into this repository. [Search API](https://docs.tavily.com/documentation/api-reference/endpoint/search)

### Brave Search

- **Service/key:** Brave Search API provides web, news, image, video, and related search endpoints. Create a subscription/key at the [Brave Search API dashboard](https://api-dashboard.search.brave.com/) and follow the [official quickstart](https://api-dashboard.search.brave.com/documentation/quickstart).
- **Current free access:** the official [pricing page](https://brave.com/search/api/) currently lists Search at $5 per 1,000 requests with $5 in monthly free credit. It says a credit card is required for identity/anti-fraud verification even for the free plan, while the free plan itself is not charged. Readers should verify the live page before signup.
- **MCP setup:** Brave's official server is [`@brave/brave-search-mcp-server`](https://github.com/brave/brave-search-mcp-server) and uses `BRAVE_API_KEY`. Its current README provides host-specific JSON and `stdio` setup. The current image-search tool returns result metadata/URLs, not image bytes.

## Search is not the same as downloading an image

An online-search API or MCP gives an agent current search results, usually including URLs and metadata. It does **not** automatically give every host the ability or permission to download arbitrary files, and technical access does not settle copyright or reuse licensing.

This template has a separate bundled workflow in `scripts/download_images.py`:

1. It parses Markdown comments shaped like `<!-- imageQuery: "..." | target: "..." -->`.
2. It reads `BRAVE_API_KEY` from the environment and calls Brave Image Search with `X-Subscription-Token`.
3. It collects original and thumbnail URLs from the search response.
4. In separate unauthenticated requests, it tries those URLs, rejects tiny or unrecognized files, accepts JPEG/PNG/WebP/GIF signatures, and saves the first valid result under `images/`.

Therefore recommended README wording is:

> An online-search MCP lets the AI find current web and image results, usually as URLs. It does not automatically save images into this project. This template's bundled image workflow uses `scripts/download_images.py` to search and then download a candidate file, and it specifically requires `BRAVE_API_KEY`. Ask your chosen AI coding tool to help install a trusted Tavily or Brave MCP because configuration screens and file locations differ by client and version. Confirm that you have permission to reuse any downloaded image.

Do not imply that Tavily is interchangeable with `BRAVE_API_KEY` for the existing script: supporting Tavily there would require a code change.
