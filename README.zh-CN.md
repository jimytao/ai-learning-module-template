# AI Learning Module Template

[English](README.md)

## 语言版本

| 分支 | 语言 | 适用对象 |
| :--- | :--- | :--- |
| **`Chinese`** | 以中文为主的文档（可夹杂英文术语） | Windows 基线 / 中文用户 |
| **`English`** | 全英文文档 | 英文用户 |
| **`macos-chinese`**（本分支） | 中文模板 + 完整 macOS 阅读器 | 中文为主的 macOS 用户 |

```bash
# 中文文档（本分支）
git clone -b Chinese https://github.com/jimytao/ai-learning-module-template.git

# 全英文文档
git clone -b English https://github.com/jimytao/ai-learning-module-template.git
```

克隆后也可：`git checkout Chinese` / `git checkout English`。

---

学科无关的 **AI 教练式学习空白模板**（Magazine 长文 + Unit 短课双模态）。  
从已验证的课本引擎与杂志引擎提炼：路由、排期、生成、批改、标注复现、图示武器库。

> **入口给 AI**：先读 [`AGENT.md`](AGENT.md)  
> **设计说明**：[`DESIGN.md`](DESIGN.md)

---

## 这是什么

把「跟 AI 学一门课」收成可复制的操作系统：

1. **Phase 0** — 采集科目 / 水平 / 弱项 / 兴趣 / 时间 / 学习模态（确认卡通过后才写入）  
2. **Phase 1** — 按日历 + 意愿 + 弱项提案（Magazine / Unit / 混合）  
3. **Phase 2** — 按硬规范生成内容与图示（流程/树/框图等）  
4. **Phase 3** — 批改与注释讲解；**订正后再出题必须先问你**

适合：Digital Health、乐理、专业课等任意科目。相近课可在同一项目用 **Track（轨道）**；不相近课可复制本仓库另开项目。

---

## 快速开始

1. Clone 或把本仓库复制为新文件夹（推荐保留一份干净母模板）。  
2. 用 Cursor 打开，对 AI 说：

```text
按 AGENT.md 做 Phase 0 / 初始化。
```

（英文也可以：`Follow AGENT.md and run Phase 0 / bootstrap.`）

3. 安装好 Node.js 20+ 后，双击根目录的 **`start.command`**。首次启动会安装本地依赖，随后打开完整网页阅读器。
   * 如果 macOS 阻止首次双击，可在终端运行 `chmod +x start.command && ./start.command`。
   * 阅读器内置目录、Markdown/Mermaid 渲染、答题自动写回、Notes 高亮与 Smart Merge。
4. 在确认画像与模态后：
   * 对 AI 说：**「执行 protocols/cleanup_template.md 清理」**（或英文 `execute cleanup using protocols/cleanup_template.md`）。AI 会自动根据 HTML 注释锚点彻底清除 `AGENT.md` 中的初始化模板套话，并将清理协议文件自身删除。
5. 正式开始学习：说「排期」→「开始生成」→ 学习 / 高亮 →「帮我批改」。

### 学习模态预设

| 代号 | 名称 | 感觉 |
| :--- | :--- | :--- |
| **T** | Textbook-first | 短、快、练习密 |
| **M** | Magazine-first | 长、慢、科普/科研阅读感 |
| **H** | Hybrid（默认推荐） | 长文扛主题 + 短课巩固 |
| **C** | Custom | 自定规则 |

详见 [`knowledge/modality_presets.md`](knowledge/modality_presets.md)。

### 项目怎么组织

| 方式 | 何时 |
| :--- | :--- |
| 单项目单科 | 只学一门 |
| 单项目多轨道 | 相近课（如 Digital Health 下多门） |
| 复制文件夹 | 科目差很远，需要物理隔离 |

详见 [`protocols/project_lifecycle.md`](protocols/project_lifecycle.md)。

---

## 仓库结构

```
AGENT.md                 # AI 唯一入口路由 (初始化清理后会自动移除模板说明)
start.command            # macOS 一键安装依赖、启动服务器并打开浏览器
server.js                # 本地文件、自动保存、Notes Smart Merge 后端
index.html / app.js      # Magazine + Unit 通用网页阅读器
reader-core.js           # 交互题解析与 Markdown 写回逻辑
DESIGN.md                # 设计逻辑
protocols/               # Phase0–3、tech_spec、visual_arsenal、frontend_spec、cleanup_template…
knowledge/               # profile / desire / calendar / domain_map / 模态预设
state/                   # log / gaps / warehouse
content/magazines/       # 长文富输入
content/units/           # 短课 + 练习
templates/               # 生成骨架
scripts/                 # 下图、校验、viz.css
notes.json               # 标注（含整句 context）
review.md                # 批改复盘存档
```

| 路径 | 作用 |
| :--- | :--- |
| [`protocols/intake_checklist.md`](protocols/intake_checklist.md) | Phase 0 采集确认清单 |
| [`protocols/cleanup_template.md`](protocols/cleanup_template.md) | 一次性初始化后模板清理与精简协议（执行后自毁） |
| [`protocols/visual_arsenal.md`](protocols/visual_arsenal.md) | 流程/树/框图/SVG 等硬语法 |
| [`protocols/frontend_spec.md`](protocols/frontend_spec.md) | 通用阅读器验收规范（含填空/问答自动写回、Notes 跳转、图示渲染） |
| [`scripts/validate_content.js`](scripts/validate_content.js) | 交互 Markdown 校验 |
| [`scripts/download_images.py`](scripts/download_images.py) | Brave 图片下载（需 `BRAVE_API_KEY`） |

---

## 工具脚本

```bash
# macOS 一键启动（也可双击 start.command）
./start.command

# 仅启动服务器，不自动打开浏览器
npm start

# 校验 content 下交互格式与图示声明头
node scripts/validate_content.js

# 下载 imageQuery 图片
export BRAVE_API_KEY=your_key
python3 scripts/download_images.py content/magazines/magazine01_xxx.md
```

---

## 内置网页阅读器

本分支已经按 [`protocols/frontend_spec.md`](protocols/frontend_spec.md) 内置完整通用阅读器：Magazine / Unit 分组目录、升降序持久化、Markdown 与 Mermaid、填空/问答/选择题自动保存、按文档隔离的 Notes、基于 `context + contextOffset` 的跳转，以及保留 AI 批注的 Smart Merge。服务器仅监听 `127.0.0.1`，并且只允许网页写入两个 `content/` 学习目录和 `notes.json`。

---

## License

[MIT](LICENSE) — 可自由使用、修改、分发。

