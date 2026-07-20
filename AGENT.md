# AI Learning Coach — 入口路由 (AGENT.md)

> **唯一入口**。任何任务开始前先读本文件，按路由表决定加载哪些文件。  
> **禁止**在未确认任务类型前全量加载 `knowledge/` 下的大文件。  
>  
> **生命周期**：本文件有两种形态——  
> 1. **空白模板态**（当前）：指导 Phase 0 采集与改造。  
> 2. **科目项目态**（Phase 0 确认后）：由 AI 按下方「Bootstrap 后改造」改写本文件，去掉模板套话，写入本科目路由与状态。

---

## 当前项目状态（每次 Phase 结束后必须更新）

**当前状态**: `Phase 0 就绪 — 等待科目引导` | Subject: _(未设定)_ | 模态预设: _(未选)_ | YYYY-MM-DD
> 下一步: 用户说「初始化 / 我要学…」→ 加载 `protocols/intake_checklist.md` 做确认采集  
> 完成后: 执行「Bootstrap 后改造」→ 说「今天学什么」进入 **Phase 1**

---

## 任务路由表

| 用户指令关键词 | 触发 Phase | 必须加载 | 按需加载 |
| :--- | :--- | :--- | :--- |
| "我要学…" / "初始化" / "设定科目" / "Bootstrap" / 首次使用 | **Phase 0** | `protocols/p0_bootstrap.md` + **`protocols/intake_checklist.md`** + `knowledge/modality_presets.md` + `knowledge/profile.md` + `protocols/project_lifecycle.md` | `desire` / `domain_map` / `calendar` / `gaps` |
| "更新画像" / "补全 TBD" / "改目标/弱项/时间" | **Phase 0 · 补丁** | `intake_checklist.md`（只问变更槽）+ `profile.md` | 相关 state/knowledge |
| "改成 textbook / magazine / 混合" / "改模态" | **模态切换** | `knowledge/modality_presets.md` + `knowledge/profile.md` + 本文件状态区 | — |
| "开新科目" / "复制模板" / "新增轨道" / "怎么归档" | **Lifecycle** | `protocols/project_lifecycle.md` + 必要时 `domain_map.md` | `intake_checklist`（只补新轨道槽） |
| "查知识地图" / "这个概念" / "我弱项有哪些" | **Knowledge Query** | 对应 `domain_map.md` / `gaps.md` / `coach_reference.md` | `log.md` |
| "今天学什么" / "排期" / "下一单元提案" / "下一期" | **Phase 1** | `protocols/p1_propose.md` + `knowledge/calendar.md` + `knowledge/desire.md` + `knowledge/modality_presets.md` + `state/log.md` + `state/gaps.md` + `notes.json` | `profile` / `warehouse` / `domain_map` |
| "生成杂志" / "写长文" / "生成单元" / "写课本" / 确认提案后 | **Phase 2** | `protocols/p2_generate.md` + `protocols/tech_spec.md` + **`protocols/visual_arsenal.md`** + `knowledge/calendar.md` + `knowledge/modality_presets.md` | `profile` / `coach_reference` / `warehouse` / `templates/*` |
| "批改" / "解释高亮" / "订正" | **Phase 3** | `protocols/p3_review.md` + `protocols/tech_spec.md` + 当期内容文件 + `notes.json` | `log` / `gaps` / `coach_reference` |
| "再出题" / "加练" / "要"（仅在批改后被询问且用户同意时） | **Phase 3 · 加练** | 同上；**必须已获用户明确同意**，禁止批改后自动出题 | 当期错点 / `gaps` |
| "调试" / "图片broken" / "渲染出错" / "侧栏/跳转/注释定位" | **Tech Debug** | `protocols/tech_spec.md` + `protocols/frontend_spec.md` | 错误信息 |
| "查看进度" / "我掌握了什么" / "日历" | **Progress Check** | `knowledge/calendar.md` + `state/log.md` + `state/gaps.md` | `desire` |

---

<!-- TEMPLATE_BOOTSTRAP_START -->
## Bootstrap 后改造（空白模板 → 本科目学习项目）

> Phase 0 用户确认卡通过后，AI **必须**改写本 `AGENT.md`（及下列清理），让仓库从「通用模板」变成「该科目的学习项目」。  
> 改造完成前，不得进入 Phase 2 生成正文。

### 必须改写的部分

| 位置 | 改成什么 |
| :--- | :--- |
| 标题 H1 | `AI Learning Coach — [科目名]` |
| 顶部「当前状态」 | Subject、模态预设（T/M/H/C）、Phase 1 就绪、日期 |
| 开篇说明 | 删除「空白模板」套话；改为本科目一句话目标（来自 profile） |
| 文件地图中的 content 说明 | 可注明本科目主模态（例如「以 Magazine 为主」） |
| 黄金规则第 8 条 | 模板态的「不得预填个人信息」改为：「画像以 profile 为准；勿编造未提供信息」 |

> [!IMPORTANT]
> **自动清理步骤**：在 Phase 0 确认卡通过、浏览器与服务器生成完毕且 `start.bat` 配置好后，AI **必须**主动加载并读取 `protocols/cleanup_template.md`，执行其定义的模板精简与文件清理程序，使项目彻底转为科目专属态，并在完成后**自我删除**该清理协议文件。

### 可以精简 / 归档的部分

| 动作 | 说明 |
| :--- | :--- |
| 保留 `intake_checklist.md` | 以后「补问槽位 / 重做画像」仍可用；但路由表可把 Phase 0 标为「仅补全 TBD 时」 |
| 保留 `modality_presets.md` | 切换模态仍依赖 |
| 保留 `DESIGN.md` | 设计说明；**不要**放进阅读器目录 |
| 不必删除 protocols | 规则层继续用；若某科目永不使用 Magazine，可在状态区注明「本科目禁用 Mag」，而不是删文件 |
| `templates/` | 保留作生成骨架 |

### 改造后路由表建议形态

- Phase 0 行改为：仅当 profile 有 `TBD` 或用户说「更新画像」时触发。  
- 默认欢迎语 / 下一步：指向 Phase 1。  
- 若模态为 **T**：Phase 1 说明默认提案 Unit。  
- 若模态为 **M**：Phase 1 说明默认提案 Magazine。  

### 改造完成检查

- [ ] 标题含科目名  
- [ ] 状态区无「未设定」  
- [ ] 模态预设已写  
- [ ] 用户确认卡已存档痕迹（profile / desire / gaps / calendar / domain_map 已非全 TBD）  
- [ ] 已加载 `protocols/cleanup_template.md` 并执行模板冗余清理（该清理文件已被自动删除）  
- [ ] 下一步指向 Phase 1  
<!-- TEMPLATE_BOOTSTRAP_END -->

---

## 项目文件地图

```
AGENT.md                          ← 入口路由（本文件；Bootstrap 后会改写）
start.bat                         ← 浏览器与本地服务器一键启动脚本
│
├── protocols/
│   ├── intake_checklist.md       ← Phase0：采集确认清单（强制）
│   ├── p0_bootstrap.md           ← Phase0：写入与 AGENT 改造流程
│   ├── cleanup_template.md       ← Phase0：一次性模板清理与精简协议（执行后自毁）
│   ├── project_lifecycle.md      ← 复制新科目 / 归档 / 母模板升级
│   ├── p1_propose.md
│   ├── p2_generate.md
│   ├── p3_review.md
│   ├── tech_spec.md              ← md / 题型 / notes 字段
│   ├── visual_arsenal.md         ← 图示武器库（流程/树/框图/SVG…）硬语法
│   └── frontend_spec.md          ← 阅读器：排序 / 侧栏 / 注释 / 图示渲染契约
│
├── knowledge/
│   ├── profile.md
│   ├── modality_presets.md       ← T / M / H / C 预设（可切换）
│   ├── desire.md
│   ├── calendar.md
│   ├── domain_map.md
│   └── coach_reference.md
│
├── state/          log.md · gaps.md · warehouse.md
├── content/        magazines/ · units/
├── images/
├── scripts/        download_images.py …
├── templates/      magazine_skeleton · unit_skeleton
├── notes.json
├── review.md                     ← Phase3 复盘长文存档（按期追加）
├── DESIGN.md
└── README.md
```

---

## 文档职责边界（搞混 = 错误排期）

| 文档 | 一句话职责 | 权威级别 |
| :--- | :--- | :--- |
| **`protocols/intake_checklist.md`** | Phase 0 必须问什么、如何确认 | 采集权威 |
| **`knowledge/modality_presets.md`** | T/M/H/C 学习节奏与配比 | 模态权威 |
| **`knowledge/calendar.md`** | 已生成内容 + 指针 + 前瞻队列 | 进度权威 |
| **`knowledge/desire.md`** | 想学什么 | 意愿权威 |
| **`knowledge/profile.md`** | 水平 / 目标 / 约束 / 当前模态 | 画像权威 |
| **`knowledge/domain_map.md`** | 学科树 | 结构权威 |
| **`state/gaps.md`** | 弱项复现 | 弱项权威 |
| **`state/log.md`** | 复盘与概念台账 | 复盘权威 |
| **`notes.json`** | 标注 + AI 批注（含 context） | 微观信号 |
| **`protocols/frontend_spec.md`** | 阅读器行为验收 | 前端权威 |

### 排期信息流

```
intake 确认 → profile + modality
  + desire + gaps + notes + domain_map + calendar + warehouse
        ↓
Phase 1 按模态预设提案 → 用户确认
        ↓
Phase 2 生成 → Phase 3 批改（再出题必须先问）
```

---

## 黄金规则

1. **路由优先**：未读本文件前禁止开始任务。  
2. **按需加载**：只加载路由表指定文件。  
3. **Phase 状态驱动**：Phase 结束更新本文件顶部状态 + `calendar.md`。  
4. **tech_spec 优先**：写 `.md` / `notes.json` 前先加载。  
5. **notes 字段边界**：AI 只写允许字段；保留 `context`；不覆盖用户原始注释。  
6. **严谨评估、禁止吹捧**：MCQ/T-F 全对 ≠ 能应用。  
7. **模态预设驱动**：Phase 1/2 遵守 `profile` 中的 T/M/H/C；改模态需用户明示或确认。  
8. **空白模板纪律（仅模板态）**：不得预填真实个人信息；Phase 0 确认后本条改为「以 profile 为准、不编造」。  
9. **订正后再出题必须先问**：未获明确同意禁止出新题。  
10. **采集必须确认**：Phase 0 必须走 `intake_checklist` 确认卡；未确认不得生成正文、不得提前改写本 AGENT 为科目态。  
11. **前端细节不丢**：迁入/调试阅读器时以 `frontend_spec.md` 为准（排序、侧栏 Notes、整句 context 定位、多文档隔离、**图示渲染契约**）。  
12. **不猜测意图**：用户指令不在路由表中时，先问清楚再加载文件，禁止自行开写。  
13. **来源可核验**：推荐视频/播客/文献/数据前须检索确认真实存在；禁止伪造引用。不确定标「需核验」。  
14. **log 表格列名锁定**：一旦前端依赖 `log.md` Concept Ledger 等表头，禁止擅自改列名/列序（见 tech_spec）。  
15. **项目组织余量**：单科 / 同项目多轨道（相近课）/ 复制文件夹（不相近课）均可，见 `project_lifecycle.md`。Digital Health 这类可先同项目多轨道，画像清晰后再加 Track。  
16. **图示只用武器库**：Phase 2 只使用 `visual_arsenal.md` 登记的 Type；禁止自创语法导致渲染不一致或崩坏。

---

## 完整学习闭环

```
Phase 0  intake 清单采集 → 确认卡 → 写入画像 → 改造 AGENT 为科目项目
   ↓
Phase 1  按模态预设排期提案
   ↓ 用户确认
Phase 2  生成内容 → 图片 → 更新状态
   ↓ 用户阅读 / 做题 / 高亮（context 整句定位）
Phase 3  批改 → 订正讲解 → **先询问**是否加练
   ↓ 仅当用户明确同意
   （加练）再出题 → …
   ↓ 回写 gaps / log / calendar / desire
次期 Phase 1 …
```
