# Phase 0：科目引导与空白填充 (p0_bootstrap.md)

> **触发**：用户说「我要学…」「初始化」「设定科目」，或 profile/calendar 仍为空白。  
> **必须先加载**：`protocols/intake_checklist.md` + `knowledge/modality_presets.md`  
> **目标**：采集 → **用户确认** → 写入 → **改造 AGENT.md 为科目项目** → 才允许 Phase 1。

---

## Step 1：按 intake 清单采集

完整槽位与勾选表见 **`protocols/intake_checklist.md`**（A–G）。

最低限度必须拿到：

1. 科目 + 可检验目标  
2. 水平 + 已知 + 弱项  
3. 兴趣（可少）+ 时间约束  
4. **学习模态预设 T / M / H / C**（见 `modality_presets.md`）  
5. （建议）阅读器排序 / Notes 范围偏好  

规则：

- 缺什么问什么；不编造。  
- TBD 允许暂时保留，但须在确认卡列出。  
- **未输出确认卡并获得用户「确认」前：禁止写入正式画像、禁止改 AGENT、禁止生成正文。**

---

## Step 2：输出确认卡并等待

使用 `intake_checklist.md` 中的「确认卡模板」。

- 用户修改 → 更新确认卡，再次等待。  
- 用户确认 → 进入 Step 3。

---

## Step 3：写入知识库与状态

| 写入目标 | 内容来源 |
| :--- | :--- |
| `knowledge/profile.md` | 科目、目标、水平、已知、约束、**模态预设**、阅读器偏好 |
| `knowledge/desire.md` | 兴趣与想覆盖主题（`[ ]`） |
| `state/gaps.md` | 弱项初始 Kanban |
| `knowledge/domain_map.md` | 学科树草稿；已知节点标 Covered |
| `knowledge/calendar.md` | 指针 + Wave 前瞻（按模态：T 偏 Unit，M 偏 Mag，H 混合） |
| `state/warehouse.md` | 按学科改名的小模块池 |
| `state/log.md` | 空 Dashboard + 说明尚未开始 |
| `notes.json` | 保持 `[]` 或清空 |

### domain_map 要求（同前）

- 3–8 个一级主题；Core / Elective；深度 M/U；依赖边。

### calendar 按模态初始化

| 预设 | Wave A 建议 |
| :--- | :--- |
| T | 多为 Unit 草案 |
| M | 多为 Magazine 草案 |
| H | Mag/Unit 交错 |
| C | 按自定义规则 |

---

## Step 4：改造 AGENT.md（关键）

严格执行 `AGENT.md` 章节 **「Bootstrap 后改造」**：

1. 标题改为含科目名  
2. 状态区写入 Subject + 模态 + `Phase 1 就绪`  
3. 去掉空白模板套话；写入本科目一句话目标  
4. 调整 Phase 0 路由为「仅补全 / 更新画像」  
5. 按模态注明默认提案倾向  
6. **读取并执行 `protocols/cleanup_template.md` 协议**，清除所有模板引导指示并自我删除该清理文件。  

改造完成后，本仓库即视为**该科目的学习项目**，不再是无用空白模。

---

## Step 5：Bootstrap 摘要（改造后再发一次）

| 栏目 | 内容 |
| :--- | :--- |
| 科目与目标 | … |
| 模态预设 | T/M/H/C + 含义一句话 |
| 知识地图 | 一级主题 |
| 前 5 期待排 | 已按模态标注 Mag/Unit |
| 初始弱项 | 3–5 条 |
| AGENT | 已改为科目项目态 ✅ |
| 待确认 TBD | … |

下一步提示：说「今天学什么」或「排期」→ Phase 1。

---

## Step 6：状态标记示例

```
**当前状态**: `Phase 0 完成 — Phase 1 就绪` | Subject: [科目] | 模态: H-Hybrid | YYYY-MM-DD
> 下一步: 「排期」→ Phase 1
```
