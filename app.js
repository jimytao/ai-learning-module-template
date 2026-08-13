(function bootReader() {
  'use strict';

  const $ = (selector) => document.querySelector(selector);
  const state = {
    files: { magazines: [], units: [] },
    notes: [],
    activePath: null,
    rawMarkdown: '',
    dirty: false,
    saveTimer: null,
    sortOrder: localStorage.getItem('ltm_sort_order') || 'desc',
    pendingSelection: null,
    editingNoteId: null,
  };

  const elements = {
    reader: $('#reader'), contentsList: $('#contentsList'), conceptsList: $('#conceptsList'), notesList: $('#notesList'),
    title: $('#documentTitle'), saveStatus: $('#saveStatus'), sortButton: $('#sortButton'), exportButton: $('#exportButton'),
    addNote: $('#addNoteButton'), noteDialog: $('#noteDialog'), noteForm: $('#noteForm'), noteWord: $('#noteWord'),
    noteText: $('#noteText'), deleteNote: $('#deleteNoteButton'), showAllNotes: $('#showAllNotes'), sidebar: $('#sidebar'),
    toast: $('#toast'),
  };

  window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict', maxTextSize: 50000 });
  window.marked.setOptions({ gfm: true, breaks: false });

  async function api(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: options.body ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
    return payload;
  }

  function toast(message) {
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { elements.toast.hidden = true; }, 2600);
  }

  function setSaveStatus(text, mode = '') {
    elements.saveStatus.textContent = text;
    elements.saveStatus.className = `save-status ${mode}`.trim();
  }

  function switchTab(name) {
    document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === name));
  }

  function renderContents() {
    elements.contentsList.replaceChildren();
    elements.sortButton.textContent = state.sortOrder === 'desc' ? 'New → Old' : 'Old → New';
    const labels = { magazines: 'Magazines', units: 'Units' };
    let count = 0;
    for (const groupName of ['magazines', 'units']) {
      const section = document.createElement('section');
      section.className = 'content-group';
      const heading = document.createElement('h3');
      heading.textContent = labels[groupName];
      section.append(heading);
      const files = ReaderCore.sortFiles(state.files[groupName], state.sortOrder);
      if (!files.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-list';
        empty.textContent = 'No content yet';
        section.append(empty);
      }
      for (const file of files) {
        count += 1;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `content-item${file.path === state.activePath ? ' active' : ''}`;
        const strong = document.createElement('strong');
        strong.textContent = file.title;
        const small = document.createElement('small');
        small.textContent = file.name;
        button.append(strong, small);
        button.addEventListener('click', () => loadFile(file.path));
        section.append(button);
      }
      elements.contentsList.append(section);
    }
    if (!count) elements.contentsList.setAttribute('aria-label', 'No learning content in this project yet');
  }

  async function refreshFiles({ selectFirst = false } = {}) {
    state.files = await api('/api/files');
    renderContents();
    if (selectFirst && !state.activePath) {
      const all = [...state.files.magazines, ...state.files.units];
      const first = ReaderCore.sortFiles(all, state.sortOrder)[0];
      if (first) await loadFile(first.path);
    }
  }

  async function refreshNotes() {
    const payload = await api('/api/notes');
    state.notes = payload.notes || [];
    renderNotes();
  }

  async function saveCurrentNow() {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
    if (!state.dirty || !state.activePath) return;
    const path = state.activePath;
    const content = state.rawMarkdown;
    state.dirty = false;
    setSaveStatus('Saving…', 'saving');
    try {
      await api('/api/save', { method: 'POST', body: JSON.stringify({ path, content }) });
      setSaveStatus('Saved');
    } catch (error) {
      state.dirty = true;
      setSaveStatus('Save failed', 'error');
      toast(error.message);
    }
  }

  function scheduleSave() {
    state.dirty = true;
    setSaveStatus('Unsaved', 'saving');
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(saveCurrentNow, 700);
  }

  async function loadFile(path) {
    if (path === state.activePath) return;
    await saveCurrentNow();
    setSaveStatus('Loading…', 'saving');
    try {
      const payload = await api(`/api/file?path=${encodeURIComponent(path)}`);
      state.activePath = payload.path;
      state.rawMarkdown = payload.content;
      state.dirty = false;
      elements.exportButton.disabled = false;
      await renderActiveFile();
      renderContents();
      renderNotes();
      setSaveStatus('Loaded');
      elements.sidebar.classList.remove('open');
      window.scrollTo({ top: 0 });
    } catch (error) {
      setSaveStatus('Load failed', 'error');
      toast(error.message);
    }
  }

  function assignHeadingIds() {
    const seen = new Map();
    elements.reader.querySelectorAll('h1, h2, h3, h4').forEach((heading, index) => {
      const base = heading.textContent.trim().toLowerCase()
        .normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || `section-${index + 1}`;
      const count = seen.get(base) || 0;
      seen.set(base, count + 1);
      heading.id = count ? `${base}-${count + 1}` : base;
    });
  }

  function generateConcepts() {
    elements.conceptsList.replaceChildren();
    const headings = [...elements.reader.querySelectorAll('h2, h3, h4')];
    if (!headings.length) {
      elements.conceptsList.className = 'concepts-list empty-list';
      elements.conceptsList.textContent = state.activePath ? 'The current document has no section headings' : 'No document open';
      return;
    }
    elements.conceptsList.className = 'concepts-list';
    for (const heading of headings) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `concept-item level-${heading.tagName.slice(1)}`;
      button.textContent = heading.textContent;
      const id = heading.id;
      button.addEventListener('click', () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      elements.conceptsList.append(button);
    }
  }

  async function renderMermaid() {
    const blocks = [...elements.reader.querySelectorAll('pre > code.language-mermaid')];
    for (const [index, code] of blocks.entries()) {
      const pre = code.parentElement;
      const source = code.textContent;
      try {
        const result = await window.mermaid.render(`reader-mermaid-${Date.now()}-${index}`, source);
        const host = document.createElement('div');
        host.className = 'mermaid';
        host.innerHTML = DOMPurify.sanitize(result.svg, { USE_PROFILES: { svg: true, svgFilters: true }, FORBID_TAGS: ['script', 'foreignObject'] });
        pre.replaceWith(host);
      } catch (error) {
        const details = document.createElement('details');
        details.className = 'mermaid-error';
        const summary = document.createElement('summary');
        summary.textContent = 'Diagram failed to render (expand to view source)';
        const sourceBlock = document.createElement('pre');
        sourceBlock.className = 'mermaid-error';
        sourceBlock.textContent = source;
        details.append(summary, sourceBlock);
        pre.replaceWith(details);
      }
    }
  }

  function noteCandidates() {
    return [...elements.reader.querySelectorAll('p, li, h1, h2, h3, h4, blockquote, .viz-caption, .viz-block-body')]
      .filter((element) => !element.closest('pre, code, svg, .mermaid, .answer-block'));
  }

  function textNodes(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest('pre, code, svg, input, textarea, button')
          ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function markNote(note) {
    const block = noteCandidates().find((candidate) => candidate.textContent === note.context);
    if (!block) return false;
    const offset = Number(note.contextOffset);
    if (!Number.isFinite(offset) || block.textContent.slice(offset, offset + note.word.length) !== note.word) return false;
    const nodes = textNodes(block);
    let traversed = 0;
    let startNode; let startOffset; let endNode; let endOffset;
    for (const node of nodes) {
      const next = traversed + node.data.length;
      if (!startNode && offset >= traversed && offset <= next) {
        startNode = node; startOffset = offset - traversed;
      }
      const noteEnd = offset + note.word.length;
      if (noteEnd >= traversed && noteEnd <= next) {
        endNode = node; endOffset = noteEnd - traversed; break;
      }
      traversed = next;
    }
    if (!startNode || !endNode) return false;
    try {
      const range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      const mark = document.createElement('mark');
      mark.className = 'reader-note';
      mark.dataset.noteId = note.id;
      mark.title = note.userNoteRaw || note.note || 'Note';
      range.surroundContents(mark);
      mark.addEventListener('click', () => openExistingNote(note.id));
      return true;
    } catch {
      return false;
    }
  }

  function applyAnnotations() {
    const notes = state.notes
      .filter((note) => note.file === state.activePath && note.word && note.context)
      .sort((a, b) => Number(b.contextOffset || 0) - Number(a.contextOffset || 0));
    notes.forEach(markNote);
  }

  async function renderActiveFile() {
    const safeSource = state.rawMarkdown.replace(/<\/?(?:script|style|textarea)\b[^>]*>/gi, '');
    const interactiveMarkdown = ReaderCore.markdownWithInteractiveHtml(safeSource);
    const html = window.marked.parse(interactiveMarkdown);
    elements.reader.innerHTML = DOMPurify.sanitize(html, {
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'foreignObject'],
      FORBID_ATTR: ['style'],
      ADD_ATTR: ['data-type', 'data-index', 'data-viz-id', 'data-orientation', 'open'],
    });
    assignHeadingIds();
    elements.title.textContent = elements.reader.querySelector('h1')?.textContent || state.activePath.split('/').pop();
    await renderMermaid();
    applyAnnotations();
    generateConcepts();
  }

  function renderNotes() {
    elements.notesList.replaceChildren();
    const showAll = elements.showAllNotes.checked;
    const notes = state.notes.filter((note) => note.type !== 'content_summary' && (showAll || note.file === state.activePath));
    if (!notes.length) {
      elements.notesList.className = 'notes-list empty-list';
      elements.notesList.textContent = 'No notes yet';
      return;
    }
    elements.notesList.className = 'notes-list';
    notes.sort((a, b) => {
      if (a.file === b.file) return Number(a.contextOffset || 0) - Number(b.contextOffset || 0);
      return String(a.time || '').localeCompare(String(b.time || ''));
    });
    for (const note of notes) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'note-item';
      const strong = document.createElement('strong'); strong.textContent = note.word || 'Content summary';
      const small = document.createElement('small');
      small.textContent = `${note.userNoteRaw || note.note || 'Highlight only'}${showAll ? ` · ${note.file}` : ''}`;
      button.append(strong, small);
      button.addEventListener('click', async () => {
        if (note.file && note.file !== state.activePath) await loadFile(note.file);
        jumpToNote(note.id);
        openExistingNote(note.id);
      });
      elements.notesList.append(button);
    }
  }

  function jumpToNote(id) {
    const mark = elements.reader.querySelector(`mark[data-note-id="${CSS.escape(id)}"]`);
    if (!mark) return;
    mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
    mark.classList.remove('flash');
    requestAnimationFrame(() => mark.classList.add('flash'));
  }

  function selectionBlock(node) {
    const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    return element?.closest('p, li, h1, h2, h3, h4, blockquote, .viz-caption, .viz-block-body');
  }

  function captureSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount !== 1 || !state.activePath) return null;
    const range = selection.getRangeAt(0);
    const block = selectionBlock(range.commonAncestorContainer);
    if (!block || !elements.reader.contains(block) || block.closest('pre, code, svg, .mermaid, .answer-block')) return null;
    if (selectionBlock(range.startContainer) !== block || selectionBlock(range.endContainer) !== block) return null;

    const context = block.textContent;
    const before = document.createRange();
    before.selectNodeContents(block);
    before.setEnd(range.startContainer, range.startOffset);
    let start = before.toString().length;
    let end = start + range.toString().length;
    while (start < end && /\s/u.test(context[start])) start += 1;
    while (end > start && /\s/u.test(context[end - 1])) end -= 1;
    const wordChar = /[\p{L}\p{N}'’-]/u;
    while (start > 0 && wordChar.test(context[start - 1])) start -= 1;
    while (end < context.length && wordChar.test(context[end])) end += 1;
    const word = context.slice(start, end);
    if (!word || word.includes('\n')) return null;
    return { word, context, contextOffset: start, file: state.activePath, rect: range.getBoundingClientRect() };
  }

  function showSelectionAction() {
    const captured = captureSelection();
    if (!captured) {
      elements.addNote.hidden = true;
      return;
    }
    state.pendingSelection = captured;
    elements.addNote.hidden = false;
    elements.addNote.style.left = `${Math.max(8, Math.min(window.innerWidth - 90, captured.rect.left + captured.rect.width / 2 - 34))}px`;
    elements.addNote.style.top = `${Math.max(8, captured.rect.top - 42)}px`;
  }

  function openNewNote() {
    if (!state.pendingSelection) return;
    state.editingNoteId = null;
    elements.noteWord.textContent = state.pendingSelection.word;
    elements.noteText.value = '';
    elements.deleteNote.hidden = true;
    elements.addNote.hidden = true;
    elements.noteDialog.showModal();
    elements.noteText.focus();
  }

  function openExistingNote(id) {
    const note = state.notes.find((item) => item.id === id);
    if (!note) return;
    state.editingNoteId = id;
    state.pendingSelection = null;
    elements.noteWord.textContent = note.word || 'Content summary';
    elements.noteText.value = note.userNoteRaw ?? note.note ?? '';
    elements.deleteNote.hidden = false;
    elements.noteDialog.showModal();
    elements.noteText.focus();
  }

  async function saveNote() {
    let note;
    if (state.editingNoteId) {
      const previous = state.notes.find((item) => item.id === state.editingNoteId);
      note = { ...previous, note: elements.noteText.value, userNoteRaw: elements.noteText.value };
      delete note.aiReview;
    } else {
      note = {
        id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        ...state.pendingSelection,
        note: elements.noteText.value,
        userNoteRaw: elements.noteText.value,
        isHighlight: true,
        time: new Date().toISOString(),
      };
      delete note.rect;
    }
    const payload = await api('/api/notes', { method: 'POST', body: JSON.stringify({ notes: [note] }) });
    state.notes = payload.notes;
    elements.noteDialog.close();
    await renderActiveFile();
    renderNotes();
    switchTab('notes');
    toast('Note saved');
  }

  async function deleteCurrentNote() {
    if (!state.editingNoteId) return;
    const payload = await api('/api/notes', { method: 'POST', body: JSON.stringify({ deletedIds: [state.editingNoteId] }) });
    state.notes = payload.notes;
    elements.noteDialog.close();
    await renderActiveFile();
    renderNotes();
    toast('Note deleted');
  }

  elements.reader.addEventListener('input', (event) => {
    const control = event.target.closest('[data-type][data-index]');
    if (!control || control.dataset.type === 'checkbox') return;
    try {
      state.rawMarkdown = ReaderCore.updateInteraction(state.rawMarkdown, control.dataset.type, control.dataset.index, control.value);
      scheduleSave();
    } catch (error) { toast(error.message); }
  });
  elements.reader.addEventListener('change', async (event) => {
    const control = event.target.closest('[data-type="checkbox"][data-index]');
    if (!control) return;
    try {
      state.rawMarkdown = ReaderCore.updateInteraction(state.rawMarkdown, 'checkbox', control.dataset.index, control.checked);
      scheduleSave();
      await renderActiveFile();
    } catch (error) { toast(error.message); }
  });
  elements.reader.addEventListener('mouseup', () => setTimeout(showSelectionAction, 0));
  elements.reader.addEventListener('keyup', () => setTimeout(showSelectionAction, 0));
  elements.addNote.addEventListener('click', openNewNote);
  elements.noteForm.addEventListener('submit', (event) => { event.preventDefault(); saveNote().catch((error) => toast(error.message)); });
  elements.deleteNote.addEventListener('click', () => deleteCurrentNote().catch((error) => toast(error.message)));
  $('#closeNoteDialog').addEventListener('click', () => elements.noteDialog.close());
  $('#cancelNoteButton').addEventListener('click', () => elements.noteDialog.close());
  elements.showAllNotes.addEventListener('change', renderNotes);
  document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
  elements.sortButton.addEventListener('click', () => {
    state.sortOrder = state.sortOrder === 'desc' ? 'asc' : 'desc';
    localStorage.setItem('ltm_sort_order', state.sortOrder);
    renderContents();
  });
  $('#refreshButton').addEventListener('click', () => refreshFiles().catch((error) => toast(error.message)));
  $('#sidebarToggle').addEventListener('click', () => elements.sidebar.classList.toggle('open'));
  $('#themeButton').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('ltm_theme', next);
  });
  elements.exportButton.addEventListener('click', () => {
    const blob = new Blob([state.rawMarkdown], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = state.activePath.split('/').pop();
    link.click();
    URL.revokeObjectURL(link.href);
  });
  window.addEventListener('beforeunload', (event) => {
    if (!state.dirty) return;
    event.preventDefault();
    event.returnValue = '';
  });

  const savedTheme = localStorage.getItem('ltm_theme');
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  (async () => {
    await refreshNotes();
    await refreshFiles({ selectFirst: true });
  })().catch((error) => {
    setSaveStatus('Initialization failed', 'error');
    toast(error.message);
  });
})();
