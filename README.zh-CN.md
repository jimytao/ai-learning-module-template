# AI Learning Module Template

[English](README.md)

## 语言版本

| 分支 | 语言 | 适用对象 |
| :--- | :--- | :--- |
| **`Chinese`**（本分支） | 以中文为主的文档（可夹杂英文术语） | 中文用户 |
| **`English`** | 全英文文档 | 英文用户 |

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

3. 在确认画像与模态并创建好浏览器服务器文件后：
   * 双击运行根目录下的 **`start.bat`** 启动脚本，一键运行本地 web 服务器。
   * 对 AI 说：**「执行 protocols/cleanup_template.md 清理」**（或英文 `execute cleanup using protocols/cleanup_template.md`）。AI 会自动根据 HTML 注释锚点彻底清除 `AGENT.md` 中的初始化模板套话，并将清理协议文件自身删除。
4. 正式开始学习：说「排期」→「开始生成」→ 学习 / 高亮 →「帮我批改」。

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
start.bat                # Windows 一键启动 Node 服务器脚本
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
# 启动本地服务器 (创建浏览器服务端文件后可用)
start.bat

# 校验 content 下交互格式与图示声明头
node scripts/validate_content.js

# 下载 imageQuery 图片
set BRAVE_API_KEY=your_key
python scripts/download_images.py content/magazines/magazine01_xxx.md
```

---

## 尚未包含

本仓库目前不直接包含网页端/浏览器的 HTML/JS 实现代码。在后续迁入或开发您的阅读器和服务器时，请严格参考 [`protocols/frontend_spec.md`](protocols/frontend_spec.md)。该文档制定了 Textbook 模式（填空、选择、文本框输入实时回写保存至源文件）与 Magazine 模式（目录排序、基于 context 定位的高亮标注、Smart Merge 智能合并）相融合的完整规范。

---

## License

[MIT](LICENSE) — 可自由使用、修改、分发。

