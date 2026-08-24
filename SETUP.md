# 首次运行 — 环境准备与 Phase 0 采集 (SETUP.md)

> **给 AI 的说明**：这是用户第一次使用本仓库时唯一需要读的文件。
> 按下面 Step 0 → Step 6 顺序执行。**Step 0 必须先做完**，否则后面无法验证阅读器。
>
> **本文件用完后留在原地**，不要删除，也不要让任何后续会话把它删掉。
> 它同时是「补全画像 / 改语言 / 改偏好」时的参考。防止重复初始化靠的是
> `state/log.md` 里的 `Initialized …` 行（见 Step 6 与 `AGENT.md` 黄金规则 18），
> 不是靠删文件。

---

## Step 0：环境准备与启动脚本适配（新装机器必做）

用户很可能是刚把仓库下载下来，本机没有任何运行环境。**先把环境装好，再问问题。**

### 0.1 检查并安装 Node.js

```bash
node -v
npm -v
```

要求 **Node.js 20 或更高**。命令报「找不到」或版本低于 20 时，引导用户安装：

| 平台 | 做法 |
| :--- | :--- |
| Windows | 到 <https://nodejs.org/> 下载 LTS 安装包并安装；或 `winget install OpenJS.NodeJS.LTS` |
| macOS | 到 <https://nodejs.org/> 下载 LTS 安装包；或 `brew install node` |

安装完让用户**新开一个终端**再验证一次 `node -v`（旧终端不会刷新 PATH）。

> 只安装 Node.js。本项目不需要 Python，除非用户之后要用
> `scripts/download_images.py` 下载配图。

### 0.2 安装项目依赖

在仓库根目录执行：

```bash
npm install
```

### 0.3 适配本平台的启动脚本

本仓库有两种一键启动脚本，**当前分支只应保留匹配本平台的那一个**：

| 平台 | 启动脚本 | 说明 |
| :--- | :--- | :--- |
| Windows | `start.bat` | 双击运行 |
| macOS | `start.command` | 双击运行；若丢失可执行权限用 `chmod +x start.command` 恢复 |

**本分支面向 Windows，启动脚本是 `start.bat`。** 请检查：

1. 根目录确实存在 `start.bat`；
2. 它内部引用的端口与 `server.js` 的 `DEFAULT_PORT` 一致；
3. 如果用户实际在 macOS 上，说明他们拿错了分支，建议改用 `macos-chinese`
   分支，或由你补一个等效的 `start.command`。

不要同时保留两个脚本却只测试其中一个。

### 0.4 冒烟测试

```bash
npm test
node scripts/validate_content.js
```

然后启动阅读器（双击 `start.bat`，或 `npm start` 后自行打开
<http://127.0.0.1:4173>）。**Phase 2 之前侧栏是空的，这是正常的** —— 这一步
的验收标准是「页面能正常加载」，不是「能显示课文」。

Step 0 全部通过后再进入 Step 1。

---

## Step 1：按 intake 清单采集

加载 **`protocols/intake_checklist.md`**（A–H 全部槽位）与
`knowledge/modality_presets.md`，逐项询问用户。

最低限度必须拿到：

1. 科目 + 可检验目标
2. 水平 + 已知 + 弱项
3. 兴趣（可少）+ 时间约束
4. **主要解释语言 / 最熟悉的语言**，与学习内容语言**分开确认**
5. **学习模态预设 T / M / H / C**（见 `modality_presets.md`）
6. （建议）阅读器排序 / Notes 范围偏好
7. **内容形态偏好**：配图密度 / 图示档位 / 便利贴 / 题型取舍（`intake_checklist.md` §H）

规则：

- 缺什么问什么；**不编造**。
- `TBD` 允许暂时保留，但必须在确认卡里列出来。
- **未输出确认卡并获得用户「确认」前：禁止写入正式画像、禁止改 `AGENT.md`、禁止生成正文。**

---

## Step 2：输出确认卡并等待

使用 `intake_checklist.md` 里的「确认卡模板」。

- 用户要改 → 更新确认卡，再次等待。
- 用户说「确认」→ 进入 Step 3。

---

## Step 3：写入知识库与状态

详细字段与 `domain_map` / `calendar` 的初始化要求见
**`protocols/p0_bootstrap.md` Step 3**。写入目标一览：

| 写入目标 | 内容来源 |
| :--- | :--- |
| `knowledge/profile.md` | 科目、目标、水平、已知、约束、**解释语言 + 内容语言**、模态预设、阅读器偏好、**§内容形态偏好** |
| `knowledge/desire.md` | 兴趣与想覆盖的主题（`[ ]`） |
| `state/gaps.md` | 弱项初始 Kanban |
| `knowledge/domain_map.md` | 学科树草稿；已知节点标 Covered |
| `knowledge/calendar.md` | 指针 + Wave 前瞻（T 偏 Unit / M 偏 Mag / H 混合） |
| `state/warehouse.md` | 按学科改名的小模块池 |
| `state/log.md` | 空 Dashboard + 说明尚未开始 |
| `notes.json` | 保持 `[]` |

---

## Step 4：阅读器验收

Step 0.4 已经跑过 `npm test`。这里补最后一项契约检查：

```bash
node scripts/verify_reader.js
```

**必须无 FAIL。** 它检查那些会静默腐化的契约：主题载体与 FOUC 守卫、锁定的存储键
与路由、`data-primary` 锚定规则、被排除的功能（无 Git UI），以及 `notes.json`
的一致性。出现 FAIL 时按 `protocols/frontend_spec.md` 修实现，**不要改检查项**。

`templates/reader_skeleton.html` 是参考外壳，不需要复制过来 —— 自带阅读器已经实现
了它演示的内容。

---

## Step 5：把 AGENT.md 改造成本科目的项目

> 确认卡通过后**必须**执行。这一步把仓库从「通用模板」变成「该科目的学习项目」，
> 完成后 Phase 1 / Phase 2 才解锁。

### 必须改写的部分

| 位置 | 改成什么 |
| :--- | :--- |
| 标题 H1 | `AI Learning Coach — [科目名]` |
| 顶部「当前状态」 | Subject、模态预设（T/M/H/C）、`Phase 1 就绪`、日期 |
| 开篇说明 | 删除「空白模板」套话；改为本科目一句话目标（来自 profile） |
| 文件地图中的 content 说明 | 可注明本科目主模态（例如「以 Magazine 为主」） |
| 路由表 Phase 0 行 | **收窄**为「仅当 profile 有 `TBD` 或用户说『更新画像』时触发」，并保留重入护栏（黄金规则 18） |
| 黄金规则第 8 条 | 模板态的「不得预填个人信息」改为「画像以 profile 为准；勿编造未提供信息」 |

按模态注明 Phase 1 的默认提案倾向：**T** → 默认提案 Unit；**M** → 默认提案
Magazine；**H** → Mag/Unit 交错。

### 改造完成检查

- [ ] 标题含科目名
- [ ] 状态区无「未设定」
- [ ] 模态预设已写
- [ ] Phase 0 路由已收窄为「补全 TBD / 更新画像」，并已加入重入护栏
- [ ] 用户确认卡已存档痕迹（profile / desire / gaps / calendar / domain_map 已非全 TBD）
- [ ] `profile.md` 已**分别**确认主要解释语言与学习内容语言
- [ ] `profile.md` §内容形态偏好已写入（配图密度 / 图示档位 / 便利贴 / 题型取舍）
- [ ] 下一步指向 Phase 1

---

## Step 5.5：把阅读器界面翻成用户的母语

> 采集拿到了**主要解释语言**，就别让用户对着一个外语界面学习。

界面上所有文案都集中在根目录的 **`ui-strings.js`** 里（`index.html` 和 `app.js`
不含任何硬编码文案）。做法：

1. 打开 `ui-strings.js`，把每个值翻成用户的**主要解释语言**（不是学习内容语言 ——
   学英语的中文用户，界面应当是中文）。
2. 把 `lang` 改成对应的 BCP-47 代码（`zh-CN` / `en` / `ja` / `ko` / `es` …），
   它会写进 `<html lang>`。
3. **只改冒号右边的值，绝不改键名。** 键名是代码契约。
4. 图标字符（`○ ● ◌ ✓ ⚠ ☰ ☀ 🧭 ⬇ 🔍 📖 🗂 📝 ⟳`）原样保留 —— 它们是状态语义
   （`frontend_spec.md` §6.3），不是可翻译文本。
5. 跑 `node scripts/verify_reader.js`：它会核对 `index.html` / `app.js` 引用的每个键
   在语言包里都存在。少一个键，界面上就会直接露出英文键名。
6. 刷新浏览器看一眼。

主要解释语言本来就与本分支文档语言一致时，这一步确认一遍即可，不必改。

以后用户说「把界面改成 X 语言」，重做本步骤就行 —— 不需要碰其它任何文件。

---

## Step 6：写初始化标记 + 发一次摘要

**先**向 `state/log.md` 追加一行：

```
Initialized [科目] — 模态 [T/M/H/C] — YYYY-MM-DD
```

这一行是「本项目已初始化」的持久证据，也是阻止后续会话重跑 Phase 0 的幂等标记
（`AGENT.md` 黄金规则 18）。

然后把状态栏改成：

```
**当前状态**: `Phase 0 完成 — Phase 1 就绪` | Subject: [科目] | 模态: H-Hybrid | YYYY-MM-DD
> 下一步: 「排期」→ Phase 1
```

最后发一次 Bootstrap 摘要：

| 栏目 | 内容 |
| :--- | :--- |
| 科目与目标 | … |
| 模态预设 | T/M/H/C + 含义一句话 |
| 知识地图 | 一级主题 |
| 前 5 期待排 | 已按模态标注 Mag/Unit |
| 初始弱项 | 3–5 条 |
| 环境 | Node 版本 · `npm install` · `start.bat` 已验证 |
| 界面语言 | `ui-strings.js` 已译成[主要解释语言] |
| 阅读器 | `npm test` 通过 · `verify_reader.js` 无 FAIL |
| AGENT | 已改为科目项目态 ✅ |
| 待确认 TBD | … |

**最后一句必须告诉用户：以后每次开新会话，第一句话都是**

```text
先读 AGENT.md，然后 <你想做的事>
```

**说「今天学什么」或「排期」即进入 Phase 1。**
