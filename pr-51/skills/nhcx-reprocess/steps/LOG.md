# Progress Log

Every step and sub-step leaves a record of what it did and which files it changed. The record is `nhcx-plan/progress.json`; `nhcx-plan/progress.md` is the same record for people to read, regenerated from the JSON after every entry and never edited by hand.

#### LOGW. WHEN TO WRITE
- When a sub-step starts (`started`) and when it ends (`done`, `blocked` or `skipped`).
- Every time a file is created, modified or deleted, in the target source or under `nhcx-plan/`, as part of that sub-step.
- When an earlier step's plan file is corrected (`corrected`), naming the file and what was wrong.
- When a step finishes and its exit condition is checked.

Entries are appended, never rewritten. A mistake in an entry is fixed by a new `corrected` entry that points at the old one.

#### LOGJ. progress.json

```json
{
  "target": {"repo": "", "started_at": "<ISO time>"},
  "status": {
    "L5": {
      "state": "not_started | in_progress | done | blocked",
      "exit_checked": false,
      "substeps": {"L5.1": "done", "L5.2": "in_progress"}
    }
  },
  "entries": [
    {
      "id": "LOG-0042",
      "time": "<ISO time>",
      "step": "L5",
      "substep": "L5.2",
      "action": "started | done | blocked | skipped | corrected | exit_checked",
      "item": "the file, spec id or exchange the sub-step is working on",
      "summary": "what was done, in one or two sentences",
      "files": [
        {"path": "", "change": "created | modified | deleted", "lines": "", "why": ""}
      ],
      "plan_files": ["nhcx-plan/code.json"],
      "specs": ["A4", "F8", "D18"],
      "commit": "",
      "corrects": "",
      "blocked_reason": ""
    }
  ]
}
```

- `id` counts up from `LOG-0001` and is never reused.
- `files` lists target source files; `plan_files` lists the `nhcx-plan/` files touched. An entry with neither changed nothing and says so in `summary`.
- `lines` is the changed range after the change.
- `commit` is filled when the change is committed (L5.5 commits per batch).
- `status` is recomputed from `entries` after each append.

#### LOGM. progress.md

Regenerated from progress.json:

```markdown
# NHCX integration progress

## Status
| Step | State | Sub-steps done | Exit checked |
|---|---|---|---|
| L1 Discovery | done | 8 / 8 | yes |
| L5 Write Code | in progress | 3 / 5 | no |

## L5 Write Code
- [x] L5.1 Take the next file
- [ ] L5.2 Write it (in progress: `src/claims/preauth.py`)

## Changes
| Id | Time | Sub-step | Action | Summary | Files |
|---|---|---|---|---|---|
| LOG-0042 | 2026-09-22 10:14 | L5.2 | done | Pre-auth send service (A4) | `src/claims/preauth.py` created 1-188; `nhcx-plan/code.json` |
```

One section per step, in step order, with a checkbox per sub-step; the changes table lists every entry, newest last.

#### LOGX. EXIT
- Every sub-step of a finished step has a `started` and a closing entry.
- Every file named in code.json, and every file changed in the target, appears in at least one entry's `files`.
- progress.md matches progress.json.
