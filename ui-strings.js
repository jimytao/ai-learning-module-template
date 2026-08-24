/**
 * ui-strings.js — 阅读器界面语言包（唯一的界面文案来源）
 * ============================================================================
 *
 * 【给 AI 的说明 —— SETUP.md Step 5.5 会让你改这个文件】
 *
 * 本文件是阅读器**所有**面向用户文案的唯一存放处。`index.html` 与 `app.js` 里
 * 不得再出现硬编码的界面文字。
 *
 * Phase 0 采集到用户的**主要解释语言**之后，把下面每个值翻译成那个语言，并把
 * `lang` 改成对应的 BCP-47 代码。之后每次打开浏览器就都是用户的母语了。
 *
 * 改的时候必须遵守：
 *
 *   1. **只改冒号右边的值，绝不改左边的键名。** 键名是代码契约，
 *      `scripts/verify_reader.js` 会逐个核对；少一个键界面就会露出英文键名。
 *   2. **不要增删键。** 需要新文案时，`index.html` / `app.js` 和这里要一起改，
 *      并同步更新 `protocols/frontend_spec.md` §13 的键表。
 *   3. `welcomeBody` 的值里可以带 `<code>` 标签，会经 DOMPurify 消毒后插入；
 *      其余所有值一律当纯文本处理，写 HTML 不会生效。
 *   4. 图标字符（`○ ● ◌ ✓ ⚠ ☰ ☀ 🧭 ⬇ 🔍 📖 🗂 📝 ⟳ ↑ ↓ →`）保持原样，
 *      它们是状态语义的一部分（frontend_spec §6.3），不是可翻译文本。
 *   5. `saveStatusTitle` 里的 `⌘S / Ctrl+S` 是真实快捷键，不要改键名本身。
 *   6. 改完刷新浏览器验证一遍，并跑 `node scripts/verify_reader.js`。
 *
 * 换语言不需要动任何其它文件。
 */

window.UI_STRINGS = {
  // --- 文档级 --------------------------------------------------------------
  lang: 'zh-CN',
  pageTitle: 'AI 学习模块阅读器',

  // --- 顶栏 ----------------------------------------------------------------
  sidebarToggleAria: '折叠/展开侧栏',
  sidebarToggleTitle: '切换左侧栏',
  documentTitleEmpty: '选择一篇内容',
  themeAria: '切换主题',
  themeTitle: '切换主题',
  themeLabel: 'Light Mode',
  saveStatusTitle: '保存状态 —— 点击立即保存（⌘S / Ctrl+S）',
  saveStatusAria: '保存状态：点击立即保存',
  tocToggleAria: '切换章节目录',
  tocToggleTitle: '切换右侧章节目录',
  tocToggleLabel: '章节目录',
  exportLabel: '导出',

  // --- 侧栏 ----------------------------------------------------------------
  sidebarAria: '阅读器侧栏',
  tabContents: '目录',
  tabConcepts: '概念',
  tabNotes: '注释',
  searchPlaceholder: '🔍 搜索文档、概念、注释…',
  searchAria: '搜索侧栏',
  panelLabel: 'Curriculum',
  refreshAria: '刷新',
  refreshTitle: '刷新列表',
  groupMagazines: 'Magazines',
  groupUnits: 'Units',
  conceptsHint: '来自当前文档标题；点击可跳转。',
  showAllNotesLabel: '显示全部文档注释',

  // --- 右侧章节目录 --------------------------------------------------------
  tocHeader: '🧭 章节目录',

  // --- 欢迎页 --------------------------------------------------------------
  welcomeEyebrow: 'UNIVERSAL READER',
  welcomeTitle: '学习内容会出现在这里',
  welcomeBody: '先完成 Phase 0，再把生成的 Markdown 放入 <code>content/magazines</code> 或 <code>content/units</code>。',

  // --- 注释弹窗 ------------------------------------------------------------
  noteDialogSelected: '选中文本',
  noteDialogCloseAria: '关闭',
  noteDialogLabel: '你的注释',
  noteDialogPlaceholder: '写下疑问、解释或 +显式查询…',
  noteDialogDelete: '删除',
  noteDialogCancel: '取消',
  noteDialogSave: '保存',
  addNoteLabel: '＋ Note',

  // --- 排序按钮（两个方向） ------------------------------------------------
  sortAsc: '↑ 旧 → 新',
  sortDesc: '↓ 新 → 旧',

  // --- 保存状态（状态机见 frontend_spec §6.3；顺序不可改） ------------------
  statusIdle: '就绪',
  statusDirty: '待保存',
  statusSaving: '保存中…',
  statusSaved: '已保存',
  statusSaveFailed: '保存失败',
  statusLoading: '加载中…',
  statusLoaded: '已加载',
  statusLoadFailed: '加载失败',
  statusInitFailed: '初始化失败',

  // --- 空状态 --------------------------------------------------------------
  emptyGroup: '暂无内容',
  contentsEmptyAria: '项目尚无学习内容',
  noDocumentOpen: '尚未打开文档',
  conceptsNoHeadings: '当前文档没有小节标题',
  tocNoHeadings: '当前文档没有标题',
  notesEmpty: '暂无注释',

  // --- 注释列表回退文案 ----------------------------------------------------
  noteSummaryFallback: '内容总结',
  noteHighlightOnly: '仅高亮',
  highlightTooltip: '高亮',

  // --- Toast ---------------------------------------------------------------
  toastNoChanges: '没有改动，已经是最新的了',
  toastNoteSaved: 'Note 已保存',
  toastNoteDeleted: 'Note 已删除',
  toastAnchorStale: '这条注释已与正文对不上 —— 锚点失效。',

  // --- 图示 ----------------------------------------------------------------
  vizRenderFailed: '图示渲染失败（展开查看源码）',
};
