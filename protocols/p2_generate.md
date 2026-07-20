# Phase 2：内容生成 (p2_generate.md)

> **触发**：用户确认提案，或「生成杂志」「写长文」「生成单元」「写课本」。  
> **必须加载**：本文件 + `protocols/tech_spec.md` + `protocols/visual_arsenal.md` + `knowledge/calendar.md` + `knowledge/modality_presets.md`  
> **按需**：`knowledge/profile.md` / `knowledge/coach_reference.md` / `state/warehouse.md` / `knowledge/domain_map.md` / `templates/*`

---

## 设计哲学（双模态 + 预设）

| 模态 | 角色 | 体量 | 做题 |
| :--- | :--- | :--- | :--- |
| **Magazine** | 富输入：现状、机制、数据、文献摘引、叙事洞察（科普/科研阅读感） | 合计 **2000–3500 字**，固定 **3 篇**（每篇约 600–1000） | 默认少题；文末可选 ≤5 道 Quick Check |
| **Unit** | 快节奏课本：定义、对比、例题、互动、查漏补缺 | **800–2000 字**（T 预设可压到 800–1500）+ 练习区 | **必须**含填空、问答、MCQ、T-F 中至少三类 |

> Magazine 让人「因为想读而学」；Unit 让人「因为要练而会」。图示一律走 `visual_arsenal.md`（流程/树/框图/公式等），**禁止**只用照片+表格硬撑所有概念。

---

## 0. 可视化武器（强制意识）

生成前问自己：本篇是否至少有一处「关系/过程/结构」需要图示？

- 有 → 按 `visual_arsenal.md` §3 决策树选 Type，写声明头 + 规定语法。  
- 对比 → `table`；分支过程 → `flow`；层级 → `tree`；模块接口 → `blocks`；几何示意 → `svg-lite`；实景 → `photo`。  
- **禁止**自创未登记的 HTML/SVG/图方言。  
- 收尾自检见 `visual_arsenal.md` §7。
---

## A. Magazine 生成规范

### 文件

```
content/magazines/magazine[NN]_[topic_slug].md
示例: content/magazines/magazine01_health_systems_overview.md
```

### 结构（必须）

```
# [Subject] Learning Magazine
## Magazine.NN: [期刊标题]
### Block 1: Articles
#### Article A / B / C
##### 有信息量的 H5 副标题 × 3–4
（文后）📚 Key Ideas from This Article
（可选 sticky-note：数据 / 文献摘引 / 误区）
### Block 2: How Do I Apply This?（情景 / 句库 / 操作卡，2–3 张）
### Block 3: Module from warehouse（可选小专题）
### （可选）Block 4: Quick Check — MCQ / T-F（≤5 题）
```

### 文章硬性规范

1. **钩子开场**：第一段必须是反常识问题、现场场景或悬念——禁止平铺定义开头。  
2. **叙事弧**：现象 → 机制/证据 → 转折或洞见 → 可落地收尾。  
3. **文献 / 数据感**（专业化要求）：每期至少 1 处「可核验」的数据点、指南名、经典表述或研究结论；用 sticky-note 或正文标注来源类型（指南 / 综述 / 教材共识）。不确定则写「需核验」并在生成后用检索确认，禁止伪造文献。  
4. **Key Ideas 表**：每篇 4–6 个核心概念；含简明释义、记忆锚点、1 句语境例句。弱点复现词标 `🔁`。  
5. **自适应**：把 Phase 1 预告的弱点自然织入正文，不刻意加粗剧透。  
6. **图片 / 图示**：照片用 `imageQuery`；流程/树/框图/公式等必须按 `visual_arsenal.md`，不得只用照片凑数。

### Magazine 明确禁止

- 大型角色扮演长题、大段填空主线（那是 Unit 的活）  
- 超过约定板块的灌水结构  
- 无钩子的教科书目录体开场  

---

## B. Unit（课本单元）生成规范

### 文件

```
content/units/unit[NN]_[topic_slug].md
示例: content/units/unit01_acid_base_basics.md
```

### 推荐结构

```
# Unit.NN: [标题]
## Part 0: Cold Start Recall（无提示复现前序 2–3 点）
## Part 1: Core Concepts（5–12 个，可配图）
## Part 2: Guided Questions（[Your Answer]）
## Part 3: Worked Scenario / Case（可用 ___ 填空推进）
## Part 4: Objective Checks
   - Multiple Choice（≥3）
   - True / False（≥3）
## Part 5: Application Write-up（开放产出 1–2 题）
## Part 6: Submit & Next（提示说「帮我批改」）
```

### 题型要求

| 题型 | 标记 | 最低数量（Unit） |
| :--- | :--- | :--- |
| 填空 | `___` | ≥3 |
| 开放问答 | `**[Your Answer]**` | ≥2 |
| 单选题 MCQ | 见 tech_spec §选择题 | ≥3 |
| 判断题 T/F | 见 tech_spec §判断题 | ≥3 |

### 故事线（可选但推荐）

用一条案例 / 病人 / 项目 / 实验时间线串起 Part 1→5，避免碎块罗列。核心概念必须在 Scenario 与练习中复现。

### 概念词条格式

```markdown
### 1. 概念名
- 定义：…
- 为何重要：…
- 易混：… vs …
- Plain Option（可选）：用一句非行话也能说清的版本（降低术语焦虑；正式掌握仍以专业说法为准）
<!-- imageQuery: "concrete visual scene 3-6 words" | target: "concept_slug.jpg" -->
<img src="images/concept_slug.jpg" height="150" />
```

> **Plain Option**：源自英语项目的 Basic/Survival Option，学科化后用于「先能说清楚，再升级术语」。批改时：只用 Plain Option 且概念正确 → 可记为理解通过，但仍应展示专业说法供被动积累；不可把「会说大白话」直接标成「专业表达已掌握」。

---

## C. 生成完成后的收尾（不得跳过）

1. 运行图片下载脚本（若本期有 `imageQuery`）：检查 X/N，失败则改描述重试。  
2. 若有校验脚本：运行并通过。  
3. 运行 `node scripts/validate_content.js`（有内容文件时必须 ✅）。  
4. 更新 `state/log.md`：新增一行进度（Unread / Not studied）。  
5. 更新 `knowledge/calendar.md`：已发行表 + 当前指针。  
6. 若用了 warehouse 主题：标为 `[x] 已使用 · Magazine/Unit NN`。  
7. 将本期新概念摘要追加到 `log.md` 的 Concept Ledger（若表格存在）。  
8. 更新 `AGENT.md` 顶部：

```
**当前状态**: `Phase 2 完成 — 等待学习` | Magazine/Unit NN | YYYY-MM-DD
> 下一步: 用户阅读/做题/高亮后说「帮我批改」→ Phase 3
```
