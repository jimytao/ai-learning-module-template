# Template Cleanup Protocol (cleanup_template.md)

> **Note**: This file is a **one-shot protocol**. After first initialization (Phase 0) completes, the user profile is written, and the reader plus Windows start script are verified, the user or AI triggers execution.
> Only after every edit and validation succeeds may deletion of this file run as the **final step**. On any failed check, stop and retain this file.

---

## 1. When to trigger

Read and run this file only when **all** of the following are true:
1. **Phase 0 confirmation card passed**: user confirmed the profile, and data is written to `knowledge/profile.md`, `knowledge/desire.md`, etc.
2. **Browser app works**: the reader prepared in `p0_bootstrap.md` Step 3.5 under `protocols/frontend_spec.md` loads successfully — **or** the user explicitly declined a reader and `profile.md` records `Reader: skipped by user`.
3. **Start script works**: `start.bat` has been adjusted and tested on Windows. Waived under the same explicit-decline case as (2).
4. **User or AI issues the command**: “run cleanup via `cleanup_template.md`” or “clean up template boilerplate”.
5. **Changes are recoverable** — Git is **optional**, many users of this template never installed it:
   * Probe once with `git rev-parse HEAD`. **Do not** ask the user to install Git, and do not treat its absence as a failure.
   * **Git available, clean tree** → record the commit hash and proceed.
   * **Git available, dirty tree** → ask the user how to preserve the uncommitted work; never overwrite or mix it into cleanup.
   * **No Git (or not a repository)** → copy `AGENT.md` to `state/AGENT.md.pre-cleanup.bak` first, tell the user in one line that this backup is the only undo path, and ask them to confirm before editing. Keep the backup; it is a protected file from that point on.

---

## 2. Cleanup steps

AI must strictly perform the edits and deletes below. **Never use absolute line numbers, wildcards, recursive deletion, or directory-level deletion.** This protocol uses an allowlist: anything not explicitly listed must not be deleted.

### 2.0 Permanent protection list

Cleanup must not delete, empty, move, or recreate:

- `protocols/intake_checklist.md` or `protocols/p0_bootstrap.md` (needed for later profile/language updates and initialization audits);
- any file under `knowledge/`, `state/`, `content/`, `templates/`, or `images/`;
- `notes.json`, `review.md`, `DESIGN.md`, READMEs, start scripts, or reader files;
- `state/AGENT.md.pre-cleanup.bak` if §1.5 created one (it is the only undo path when Git is unavailable);
- the `AGENT.md` routes for update profile, change explanation language, change modality, Phase 1–3, Tech Debug, or Progress Check.

The only content that may be deleted is:

1. the single Bootstrap block and its unique anchor pair in `AGENT.md`;
2. the single `cleanup_template.md` line in the `AGENT.md` file map;
3. this protocol file, `protocols/cleanup_template.md`, after all validation succeeds.

### 2.1 Rewrite entry router `AGENT.md` (safe semantic anchors)

To avoid line-number drift after edits, rewrite `AGENT.md` using semantics and anchors:

1. **Delete the bootstrap guidance block via HTML comment anchors**:
   * Locate the block wrapped by `<!-- TEMPLATE_BOOTSTRAP_START -->` and `<!-- TEMPLATE_BOOTSTRAP_END -->` in `AGENT.md`.
   * Each anchor must occur exactly once, with START before END. If either is missing, duplicated, or reversed, stop without modifying any file.
   * **Fully delete** that wrapped block (including the two HTML comment lines themselves) to remove all bootstrap rewrite instructions.
2. **Update the status bar**:
   * Edit only the top “Current project status” line. Subject, modality, and explanation language must come from the user-confirmed `knowledge/profile.md`; never infer them.
   * If any confirmed value remains blank or TBD, stop without cleanup.
3. **Precisely clean the file map**:
   * Locate `cleanup_template.md` inside the file-tree code block in `AGENT.md`; that line must occur exactly once.
   * Delete only that line. If it is missing or duplicated, stop.
4. **Precisely replace golden rule #8**:
   * Match the literal text of rule 8 (containing “*Blank-template discipline (template mode only)*”).
   * The rule must occur exactly once; otherwise stop.
   * Replace the whole rule with: “*8. **Profile discipline**: Treat `profile` as authoritative; do not invent information the user did not provide.*”
5. **Slim document responsibility boundaries**:
   * Do not delete any responsibility-table row. Only the `intake_checklist.md` description may be changed to “authority for profile updates and missing slots”; keep every other responsibility unchanged.
6. **Write the initialization trace before deleting anything** (required):
   * Append one line to `state/log.md`: `Initialized YYYY-MM-DD · Subject: … · Modality: … · Reader: built|skipped · Template cleanup: done`.
   * Appending is explicitly permitted by §2.0 — protection forbids deleting, emptying, moving, or recreating `state/` files, not adding to them. Never rewrite existing log content.
   * Also stamp the status bar so the trace survives independently of `log.md`.
   * This line is the durable proof of bootstrap and the idempotence marker for §2.3. The rewrite checklist cannot serve that role: it lives inside the block deleted in step 1.
7. **Retain confirmed personal preferences**:
   * Do not modify `intake_checklist.md`, `p0_bootstrap.md`, or any profile file. Never remove confirmed values from `knowledge/profile.md`, including primary explanation language, learning-content language, accessibility needs, time constraints, or learning preferences.
   * Keep the “update profile” route so the learner can change these values later without rerunning the full bootstrap.

### 2.2 Validate, review, and self-delete last

1. After editing `AGENT.md`, inspect the diff. It must not delete, empty, or move anything in the permanent protection list.
2. Verify these postconditions:
   * `knowledge/profile.md` still contains the confirmed explanation language, learning-content language, and other preferences;
   * `AGENT.md` still contains the update-profile and change-explanation-language routes and correctly references the existing `intake_checklist.md`;
   * `p0_bootstrap.md`, `intake_checklist.md`, learning content, Notes, state, templates, and reader files still exist;
   * the `Initialized …` line from §2.1 step 6 is present in `state/log.md`;
   * all existing project validation/tests pass.
3. Show the cleanup summary and actual diff to the user; if the user requested approval first, wait for it.
4. **Final step**: only after every check passes, delete `protocols/cleanup_template.md`. Resolve the target from the repository root and require an exact match to this relative path.
5. If any check fails, stop and retain this file. Report the failure, then restore: from the recorded Git commit if Git was available, otherwise from `state/AGENT.md.pre-cleanup.bak`. If neither exists, change nothing further and ask the user how to proceed.

### 2.3 Partial-run recovery (this protocol is re-entrant)

Cleanup can be interrupted between the `AGENT.md` edits and the self-delete. On being loaded again, first read the current state instead of assuming a fresh start:

| Observed | Meaning | Do |
| :--- | :--- | :--- |
| Anchors present, no `Initialized` line | Not started | Run §2.1 from step 1 |
| Anchors gone, `Initialized` line present, this file still exists | Edits succeeded, self-delete did not | Re-verify §2.2 postconditions only, then delete this file |
| Anchors gone, no `Initialized` line | Interrupted mid-run | Do not re-edit. Write the missing trace, verify §2.2, then delete |
| Anchors partially present / duplicated | Corrupted | Stop. Restore from Git or the `.bak`, and report |

Never re-apply an edit that is already applied — every §2.1 edit is guarded by an exactly-once match and will stop the run rather than produce a second copy.

---

## 3. Cleanup report & handoff

After cleanup, AI must give a short “project cleanliness report” including:
1. **Actual edits and deletions** (deletions may only be the Bootstrap anchor block, cleanup file-map line, and `cleanup_template.md` itself).
2. **Preview of the simplified AGENT.md status**.
3. **Persistent profile check**: confirm that explanation language and the other accepted personal preferences remain in `knowledge/profile.md`.
4. **Protection-list check**: confirm intake, p0, content, Notes, state, templates, and reader files were not deleted or emptied.
5. **Initialization trace**: quote the `Initialized …` line written to `state/log.md`, and state the undo path in use (Git commit hash, or the `.bak` file, or “none — user proceeded without either”).
6. **Next actions**: run `start.bat` to launch the browser, then say “what should I study today” or “schedule” to enter Phase 1.
