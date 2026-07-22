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

## 6. 交互组件与自动保存机制 (Interactive Elements & Autosave)

前端必须能够解析 Markdown 正文中的交互元素，在浏览器中渲染为 HTML 交互控件，且在用户操作（输入/勾选）时实时、自动地将答案写回源 Markdown 文件中。

### 6.1 交互元素解析与渲染规则

| 元素类型 | Markdown 语法 | HTML 渲染形式 | 解析与写回逻辑 |
| :--- | :--- | :--- | :--- |
| **空格填空** | `___` (3个及以上下划线) | `<input type="text" class="interactive-blank" data-index="N" />` | **解析**：将连续下划线替换为输入框。<br>**写回**：当输入框发生变化，前端将内存中 Markdown 的第 N 个 `___` 替换为 `__用户答案__`（注意是双下划线包裹答案）。 |
| **已填填空** | `__已填内容__` (双下划线包裹) | `<input type="text" class="interactive-blank" data-index="N" value="已填内容" />` | **解析**：解析双下划线包裹的文本，渲染为带默认值的输入框。<br>**写回**：当用户修改输入，更新双下划线内的内容为 `__新内容__`。若用户清空，则退化回三个下划线 `___`。 |
| **主观问答** | `**[Your Answer]**` 或 `**[Your Answer]**: (答案)` | `<textarea class="interactive-textarea" data-index="N">答案</textarea>` | **解析**：匹配行首或列表项中的 `**[Your Answer]**` 标记。若冒号后或括号内有答案，则作为 textarea 初始值。<br>**写回**：用户输入时，在 Markdown 对应行的 `**[Your Answer]**:` 后面更新为 `(用户答案)` 或紧跟 `用户答案`，保持 Markdown 语法结构。 |
| **单选/多选/判断** | `- [ ]` 或 `- [x]` | `<input type="checkbox" class="interactive-checkbox" data-index="N" />` | **解析**：标准的 Markdown 任务列表语法，渲染为可勾选的 checkbox。<br>**写回**：用户勾选/取消勾选时，将内存中 Markdown 对应位置的 `[ ]` 切换为 `[x]`，反之亦然。 |

### 6.1.1 双重输入框容错（强烈建议）

协议层已禁止同一题叠用填空 + `[Your Answer]`（见 `tech_spec.md` §1.1）。迁入阅读器时仍建议做 UI 容错，避免历史坏内容再次误导用户：

1. 按标题（`##` / `###` / `####`）或题块切分 DOM。  
2. 若某题块内**已有** `.interactive-blank`（来自 `___` / `__已填__`），且紧随其后的 `[Your Answer]` 渲染出的 textarea **为空** → **不渲染**该冗余 textarea（或折叠并标「redundant — ignored」）。  
3. 不要把空 textarea 当成「用户未作答」的唯一证据；批改侧仍以行内填空为准（`p3_review.md` §1.1）。

### 6.2 自动保存信息流 (Autosave Flow)

1. **内存副本维护**：前端加载 Markdown 后，在内存中保留一份 raw Markdown 字符串副本。
2. **事件监听与防抖**：监听所有交互控件的 `input` 或 `change` 事件。当用户输入时，利用 **防抖函数 (Debounce，建议 500ms - 1000ms)**，避免频繁向后台发送请求。
3. **全量写回**：防抖触发后，前端运行替换算法更新内存中的 Markdown 字符串，然后发起 `POST /api/save` 接口。
4. **接口契约**：
   * **请求路径**：`/api/save`
   * **Payload**：`{ path: "content/units/unit01.md", content: "更新后的全量Markdown文本..." }`
   * **后端行为**：后端接收到请求后，校验 `path` 安全性，直接覆盖写入对应的源文件。
5. **批改面板渲染**：
   * 批改结果使用 `details.feedback-panel`（折叠反馈面板）包裹。
   * 文本错误标注使用 `<span class="err">错误词</span>` (红色中划线/背景) 与 `<span class="fix">修改词</span>` (绿色下划线/背景) 渲染，前端需要对这些特定的 HTML 标签予以保留和渲染。

---

## 7. 多文档项目的精细规则与通用阅读器融合

新项目初始化时，前端必须将**杂志模式 (Magazines)** 和**课本模式 (Units)** 融合进一个统一的单页阅读器（Universal Reader）中。

### 7.1 通用版面布局 (Layout)

```
+-----------------------------------------------------------------------+
|  LOGO  [通用阅读器]                [当前期/单元标题]          [保存/导出/主题] |
+------------------------------------+----------------------------------+
| Sidebar (左侧栏)                   | Main Viewport (主阅读区)         |
|                                    |                                  |
| +--------------------------------+ | +------------------------------+ |
| | Tab 1: Contents (目录树)        | | |                              | |
| | - Magazines (杂志列表，新->旧)  | | |   Markdown 渲染内容          | |
| | - Units (课本单元，按Week分组) | | |   (填空、选择、问答交互控件)    | |
| +--------------------------------+ | |                              | |
| | Tab 2: Concepts (词汇与概念)    | | |   Mermaid 图表 / SVG 可视化  | |
| +--------------------------------+ | |                              | |
| | Tab 3: Notes (高亮注释与批改)    | | +------------------------------+ |
| +--------------------------------+ |                                  |
+------------------------------------+----------------------------------+
```

### 7.2 核心融合交互契约

1. **侧栏多模态目录展示**：
   * 前端通过 `/api/files` (或 `/api/issues`) 接口获取所有可用文件。
   * 必须在 **Contents** 侧栏中清晰分组展示：`content/magazines/` 下的杂志列表与 `content/units/` 下的课本列表。
   * 支持通过按钮在 `localStorage` 中持久化记录排序规则（`desc` / `asc`）。
2. **注释隔离与 Smart Merge**：
   * `notes.json` 存储所有的用户高亮及 AI 批复。
   * 打开 A 文件时，正文仅应用 `file === 'content/magazines/A.md'` 的高亮，Notes Tab 默认也只展示当前文件的注释。
   * **Smart Merge (后端核心细节)**：当用户在前端添加或修改注释并保存 `notes.json` 时，后端在写入前必须读取已有的 `notes.json`，**合并**新旧数据，绝对不能覆盖或冲掉 AI 已经在 `aiReview` 字段中写入的批改和反馈信息。

---

## 8. 迁入与开发参考建议

当我们在 Phase 0 之后正式开发或迁入浏览器前端时，请遵循以下模块进行整合：

1. **服务器与路由基础**：参考 `Melbourne culture magazine/server.js`，保留其静态文件托管、`/api/save` 全量保存以及 `notes.json` 的 Smart Merge 逻辑。
2. **多期目录与注释跳转**：参考 `Melbourne culture magazine/index.html` 中的 Notes 高亮创建、Floating Panel 浮层编辑、基于 `context` + `contextOffset` 的精确定位逻辑。
3. **课本交互控件与作答渲染**：参考 `English learning for Melbourne/scripts/preview.html` 中将 `___`、`- [ ]`、`**[Your Answer]**` 动态转换为交互 DOM 并在发生变化时触发自动保存的 Javascript 逻辑。
4. **可视化模块**：引入 `scripts/viz.css` 以保证工程框图、SVG 和 Mermaid 样式全局统一，且不被 Markdown 渲染引擎破坏。


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
