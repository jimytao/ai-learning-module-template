# 阅读器 / 前端规范 (frontend_spec.md)

> 从 English Learning 预览器与 Culture Magazine 阅读器提炼的**必须保留的产品细节**。  
> 本仓库当前以 Markdown + 协议为主；迁入或重做前端时，**按本文件验收**，不得丢行为。

---

## 1. 内容来源与隔离（防搞混）

| 规则 | 说明 |
| :--- | :--- |
| 只列出学习内容 | 侧边栏「目录」只显示 `content/magazines/*.md` 与 `content/units/*.md` |
| 禁止露出内部文件 | 不得把 `protocols/` `knowledge/` `state/` `scripts/` `DESIGN.md` `AGENT.md` 放进阅读目录 |
| 分组清晰 | 建议两组：`Magazines` / `Units`（或按编号）；打开一份时高亮当前项 |
| 注释按文件隔离 | `notes.json` 每条必须有 `file`（或兼容字段 `issue`）指向**那一篇** md |
| 默认只看当前篇注释 | Notes 侧栏默认 `showAll = false`，只渲染 `file === 当前打开路径` 的条目 |
| 可切换「全部注释」 | 提供开关查看跨文档注释，但默认关闭，避免杂志多期搞混 |
| 批改也按文件过滤 | Phase 3 / 前端展示 AI 批注时，同样按当前 `file` 过滤 |

路径一经生成不要随便改名；若必须重命名，同步改 `notes.json` 里所有对应 `file`。

---

## 2. 目录排序（新到旧 / 旧到新）

| 规则 | 说明 |
| :--- | :--- |
| 可切换 | 侧栏提供排序按钮：`旧 → 新` / `新 → 旧` |
| 默认 | **新 → 旧**（`desc`），方便续读最新一期/单元 |
| 持久化 | 写入 `localStorage`（键名建议：`ltm_sort_order`） |
| 排序键 | 优先按文件名中的编号 `magazineNN` / `unitNN`；否则按 mtime |

Textbook 源项目与 Magazine 源项目均已实现该切换；迁入时保留同一交互。

---

## 3. 侧边栏结构（建议三 Tab）

| Tab | 内容 | 行为 |
| :--- | :--- | :--- |
| **Contents** | Magazines + Units 列表 | 点击打开对应 md；当前项 active |
| **Concepts** | 从当期或 `log.md` Concept Ledger 解析的概念 | 点击跳到文内对应标题 / 锚点 |
| **Notes** | 当前文件（或全部）的高亮与注释 | 点击跳转到正文中的标注处并打开编辑浮层 |

- 做了新注释 → **立即出现在 Notes Tab**（保存 `notes.json` 后刷新列表）。  
- Concepts / Notes 的跳转必须稳定：依赖文内标题格式与标注 span，生成内容时遵守 `tech_spec.md`。

---

## 4. 注释：创建上下文定位（强制）

> 仅存 `word` 不够：一词多处出现时无法精确定位，批改也失去语境。

创建时前端必须静默写入：

| 字段 | 含义 |
| :--- | :--- |
| `word` | 用户选中的连续文本（单块内，无换行） |
| `context` | **所在完整句子或当前块级段落**（推荐：整句；至少是所在 `<p>`/`<li>` 文本） |
| `contextOffset` | `word` 在 `context` 内的起始字符偏移 |
| `file` | 当前文档相对路径 |
| `userNoteRaw` / `note` | 用户注释（AI 不覆盖 raw） |

定位算法优先级：

1. 在当前文档 DOM 中找 `blockText === context` 的块，再在块内用 `word` + `contextOffset` 定位  
2. 若无 `context`（老数据）：退化为全文搜 `word`（可能歧义，应避免新数据缺失 context）  
3. Notes 列表排序：优先按正文物理顺序；否则按时间

**生成内容时的规避**（与源项目一致）：

- 不要让关键术语只出现在代码块 / 跨 sticky-note 边界（会导致无法高亮）  
- `word` 禁止跨段落  

Phase 3 批改：**必须结合 `context` 做语境讲解**，禁止只甩词典。

---

## 5. 点击跳转体验体验

| 场景 | 期望 |
| :--- | :--- |
| Notes 列表点一条 | 滚动到正文标注 → 短暂高亮闪烁 → 打开编辑浮层（若有） |
| Concepts 点一条 | 滚动到概念标题（Unit 的 `### N. 名称` 或 Mag 的 Key Ideas 锚点） |
| 目录点一篇 | 加载该 md；Notes/Concepts 切换为该文件数据；不清空其它文件的 `notes.json` |

---

## 6. 交互组件（与 tech_spec 一致）

前端需解析并持久化：

- `___` / `__已填__` 填空  
- `**[Your Answer]**` 文本框  
- `- [ ]` / `- [x]`（含 MCQ、T/F）  
- 批改用 `details.feedback-panel` 与 `span.err|fix|warn`  

用户作答写回 md 或并行 answer store 均可，但**刷新后不得丢答**。

---

## 7. 多文档项目的精细规则

```
打开浏览器
  → 拉取 content 列表（仅 magazines + units）
  → 按 sortOrder 展示
  → 用户点开 file A
       → 渲染 A
       → applyAnnotations( notes.filter(n => n.file === A) )
       → Notes Tab 只显示 A（除非 showAll）
  → 用户点开 file B
       → 同上切换；A 的注释仍留在 notes.json，互不覆盖
```

Smart merge（服务端）：保存 notes 时保留已有 `aiReview` 与 `content_summary`，避免前端保存冲掉 AI 批改。

---

## 8. 迁入来源建议

| 能力 | 优先参考 |
| :--- | :--- |
| 多期杂志列表 + 排序 + Notes 按期过滤 | `Melbourne culture magazine/index.html` + `server.js` |
| Week 分组课本 + 填空/[Your Answer] + 批改面板 | `English learning for Melbourne/scripts/preview.html` |
| imageQuery 下载 | 本仓库 `scripts/download_images.py` |

迁入后把路径改为 `content/magazines` 与 `content/units`，并实现本文件验收清单。

---

## 9. 验收清单（前端 Ready 的定义）

- [ ] 目录可 **新到旧 / 旧到新** 切换且持久化  
- [ ] 内部 md 不出现在阅读目录  
- [ ] Magazines 与 Units 分组、多文件不串注释  
- [ ] 注释写入 `context` + `contextOffset`  
- [ ] Notes 点击可跳转并打开编辑  
- [ ] 新注释立即出现在侧栏  
- [ ] 保存 notes 不丢 `aiReview`（Smart Merge）  
- [ ] 填空 / 问答 / MCQ / T-F 可作答并回看  
- [ ] TOC：每次正文重渲染后重建；点击用 `getElementById` 动态寻址（防 orphan DOM）  
- [ ] 选词自动对齐到单词边界（避免漏选字母导致匹配失败）  
- [ ] 标题内可高亮；代码块/`pre` 内不可高亮（与源项目一致）

---

## 10. 渲染生命周期（迁自杂志 tech_spec）

1. 修改标注会重写正文 `innerHTML` → 旧 DOM 引用全部失效。  
2. 每次 `renderActiveFile()` 结束后必须立刻 `generateTOC()`。  
3. TOC 点击不得缓存旧标题节点，必须按 id 现查现滚。

---

## 11. 可视化武器渲染契约（Visual Arsenal）

> 权威语法见 `protocols/visual_arsenal.md`。此处只定**浏览器必须如何表现**，保证「怎么写就怎么显示、不崩、各期长得一样」。

### 11.1 依赖

| 能力 | 要求 |
| :--- | :--- |
| Mermaid | 固定 CDN/本地版本（建议 ≥10）；**全局统一 theme**（如 `neutral` 或项目 CSS 变量映射）；禁止文档内 `init` 覆盖主题 |
| marked | 代码块语言为 `mermaid` 时**不要**当普通 code 用 hljs 高亮；交给 Mermaid |
| 消毒 | 正文 HTML 白名单含：`div.viz-*`、`sticky-note` 变体、svg 子集（见 arsenal §4.7） |

### 11.2 渲染流程（每次打开/刷新文档）

```
markdown → marked HTML
  → 找到 .viz-blocks / .viz-svg / .viz-steps / .viz-formula / .sticky-note → 已是最终 DOM
  → 找到 pre code.language-mermaid（或约定容器）
       → 逐个 mermaid.render
       → try/catch：失败则显示「图示渲染失败」+ 可展开源码，**绝不中断全文**
  → 再 applyAnnotations / TOC
```

### 11.3 必须提供的 CSS class（名称锁定，禁止改名）

| class | 作用 |
| :--- | :--- |
| `.viz-blocks` `.viz-blocks-row` `.viz-block` `.viz-block-accent` `.viz-arrow` `.viz-caption` | 工程框图 |
| `.viz-block-title` `.viz-block-body` | 框图内文 |
| `.viz-svg` `.viz-svg-node` `.viz-svg-edge` `.viz-svg-label` `.viz-svg-muted` | SVG 着色 |
| `.viz-steps` | 步骤块 |
| `.viz-formula` `.viz-formula-main` `.viz-formula-note` | 公式块 |
| `.sticky-note.warn-note` `.sticky-note.formula-note` | 便利贴变体 |

参考样式可放 `scripts/viz.css`（迁入前端时引入）。小屏：`viz-blocks-row` 允许折行；mermaid 图 `max-width:100%`。

### 11.4 一致性验收（防「每次长得不一样」）

- [ ] 所有 flowchart 同一 Mermaid theme  
- [ ] 所有 `viz-block` 同一边框/圆角/字号  
- [ ] caption 字号与正文 secondary 文本一致  
- [ ] 失败图有统一错误 UI，不是空白或整页白屏  
- [ ] 图示容器内点击不触发「新建填空」等误交互  

### 11.5 与注释系统

- Mermaid 渲染后的 SVG 内文字：**默认不可高亮标注**（与 code 块同等排除），避免 DOM 被 Mermaid 重写后定位失败。  
- `viz-caption`、`viz-block-body` 内普通文本：**允许**标注。  
- `viz-svg` 内 `<text>`：建议排除标注。
