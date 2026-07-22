# Template Cleanup Protocol (cleanup_template.md)

> **Note**: This file is a **one-shot protocol**. After first initialization (Phase 0) completes, the user profile is written, and browser frontend/backend plus start scripts are ready, the user or AI triggers execution.  
> After execution, **this file must delete itself**.

---

## 1. When to trigger

Read and run this file only when **all** of the following are true:
1. **Phase 0 confirmation card passed**: user confirmed the profile, and data is written to `knowledge/profile.md`, `knowledge/desire.md`, etc.
2. **Browser app built**: usable `server.js` and `index.html` (or equivalent runtime files) exist at repo root.
3. **Start script works**: `start.bat` adjusted and tested.
4. **User or AI issues the command**: “run cleanup via `cleanup_template.md`” or “clean up template boilerplate”.

---

## 2. Cleanup steps

AI must strictly perform the edits and deletes below. **Never locate by absolute line numbers.**

### 2.1 Rewrite entry router `AGENT.md` (safe semantic anchors)

To avoid line-number drift after edits, rewrite `AGENT.md` using semantics and anchors:

1. **Delete the bootstrap guidance block via HTML comment anchors**:
   * Locate the block wrapped by `<!-- TEMPLATE_BOOTSTRAP_START -->` and `<!-- TEMPLATE_BOOTSTRAP_END -->` in `AGENT.md`.
   * **Fully delete** that wrapped block (including the two HTML comment lines themselves) to remove all bootstrap rewrite instructions.
2. **Update the status bar**:
   * Remove all `_(unset)_` or `_(not chosen)_` placeholders; set real subject name, chosen modality, and `Phase 1 ready`.
3. **Precisely clean the file map**:
   * Search for `├── protocols/` and find the tree list under it.
   * Delete the entire line that contains `cleanup_template.md`.
4. **Precisely replace golden rule #8**:
   * Match the literal text of rule 8 (containing “*Blank-template discipline (template mode only)*”).
   * Replace the whole rule with: “*8. **Profile discipline**: Treat `profile` as authoritative; do not invent information the user did not provide.*”
5. **Slim document responsibility boundaries**:
   * Keep only active files for this subject in the responsibility table; remove temporary Phase 0 field descriptions.

### 2.2 Clean and delete template files
1. **Delete this protocol file**:
   * **[DELETE]** `protocols/cleanup_template.md`
2. **Clean or archive guidance files**:
   * `protocols/p0_bootstrap.md` may be deleted or moved to `archive/` depending on the subject.
   * Keep `protocols/intake_checklist.md` (for later profile updates), but after first setup clear remaining template prompt wording inside it.

---

## 3. Cleanup report & handoff

After cleanup, AI must give a short “project cleanliness report” including:
1. **Deleted files list** (must include `cleanup_template.md` itself).
2. **Preview of the simplified AGENT.md status**.
3. **Next actions**: run `start.bat` to launch the browser, then say “what should I study today” or “schedule” to enter Phase 1.
