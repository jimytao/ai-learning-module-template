# Project Lifecycle (project_lifecycle.md)

## One-liner

A blank template can be used in three forms. **Any is valid** — pick by how related the subjects are and whether you want one shared profile.

| Form | When | How |
| :--- | :--- | :--- |
| **① One project · one subject** | Studying one course for now | Phase 0 directly in this repo |
| **② One project · multi-track (related courses)** | e.g. several related Digital Health courses; shared gaps/calendar as the profile clarifies | Use **Tracks** in the **same** project — no folder copy |
| **③ Multi-project · one folder per subject** | Subjects far apart (music theory vs clinical medicine), or notes must be physically isolated | Copy the template to a new folder, then Phase 0 |

“One customized folder per course” and “keep related courses together” are **both** formally supported — forms ② and ③ are intentional headroom.

---

## Form ②: Multi-track in one project (recommended for Digital Health–like domains)

### How to organize

1. In Phase 0 the subject can be a **domain label** (e.g. Digital Health) plus an initial track list.  
2. `domain_map.md` splits top themes by **Track** (see that file’s multi-track section).  
3. Rows in `calendar.md` / `log.md` / `gaps.md` / `desire.md` carry a **Track** column or tag.  
4. Generated filenames should include a track abbrev:  
   `magazine03_dh_interop_fhir.md` / `unit02_him_coding.md`  
5. `AGENT.md` status: `Subject: Digital Health | Tracks: A,B,… | Active: A`

### Adding a related course later

Say “add track: …” → AI updates domain_map / desire / calendar Wave. **No** full Phase 0 rerun — only fill intake slots related to the new track and confirm.

### When scheduling

Phase 1 proposals must state **which Track this round serves** (“cross-track overview” is OK if clearly labeled).  
Weakness recurrence prefers the same Track; cross-Track moves need a reason in the proposal.

### When to split into form ③

- Almost no shared concepts; forcing them together only adds calendar/gaps noise  
- Very different modalities (one pure T, one pure M) that constantly conflict  
- Notes explode and the sidebar becomes hard to browse  

---

## Form ③: Copy out a new subject project

```
learningTextbookModule/     ← mother template (keep blank / upgradable)
learning-digital-health/    ← domain project (may have multi Track)
learning-music-theory/      ← unrelated subject, separate copy
```

1. Copy the folder and rename  
2. Open and “run Phase 0 / bootstrap per AGENT.md”  
3. Do not write subject body content into the mother template (unless you decide mother = the only project)

### Upgrading the mother template

After protocol improvements: copy `protocols/` etc. into subject projects, or upgrade mother only and note the protocol baseline date in the subject `AGENT.md`.

---

## Form: Replace an old subject in the same folder (rare)

When unrelated subjects must reuse the **same** folder, archive first, then Phase 0:

1. `content/` `notes.json` `images/` → `archive/[old-name]/`  
2. Reset profile / desire / gaps / calendar / domain_map / log / warehouse  
3. Restore AGENT to template mode or recopy from mother  
4. Run Phase 0 again  

Starting a new subject without archiving = cross-issue notes and calendar chaos.

---

## After Bootstrap

See `AGENT.md` “Post-Bootstrap rewrite”. For multi-track, the title may use the domain name; the status area must list Tracks.

```
Protocol baseline: learningTextbookModule @ YYYY-MM-DD
Subject: … | Tracks: … | Active Track: …
```
