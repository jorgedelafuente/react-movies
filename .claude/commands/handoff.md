---
description: Wrap up the current task - verify, record loose ends in docs/ROADMAP.md, clean up, and say whether the window can be closed
allowed-tools: Read, Edit, Bash(git status*), Bash(git log*), Bash(git branch*), Bash(git diff*), Bash(git worktree list*), Bash(git rev-parse*), Bash(pnpm exec tsc*), Bash(pnpm test:silent*), Bash(pnpm lint*), Bash(lsof *), Bash(find *), Bash(ls *), Bash(date*)
---

# Handoff

Finish the session so the user can close the window without losing anything. Everything that outlives the conversation lives in git or in [docs/ROADMAP.md](docs/ROADMAP.md), never only in chat.

## Usage

```
/handoff          # full wrap-up, including the test run
/handoff quick    # skip the test run (only if tests ran in the last few minutes)
```

## Steps

1. **Verify.** Run `pnpm exec tsc --noEmit` and, unless `$ARGUMENTS` is `quick`, `pnpm test:silent`. Do not start fixing failures here; a failure just changes the verdict below.

2. **Inventory what this session leaves behind.**

   -  `git status --short` — uncommitted changes. Only count files this session touched; another session may be editing the same working tree (see below).
   -  `git log --oneline origin/master..master` — commits not pushed.
   -  `git branch --no-merged master` and `git worktree list` — branches and worktrees not landed.
   -  Dev servers this session started (`lsof -iTCP -sTCP:LISTEN` on ports 5173–5180) and scratch files it created under `/private/tmp`.

3. **Record in the roadmap.** Re-read `docs/ROADMAP.md` immediately before editing it, then:

   -  Tick `[x]` every roadmap item this task completed and add the commit hash.
   -  Append one dated line under `## Follow-ups` for anything undone, blocked, deferred or discovered, naming the commit or branch it came from.
   -  For work that is started but not committed, add a line under `## In Flight` with the exact files and the next step, so a fresh session can continue it.
   -  If the roadmap file is absent (fresh clone), say so and put the same list in the final message instead.

4. **Do not commit or push** unless the user asked for it in this conversation. Report the unpushed and uncommitted state in the verdict instead.

5. **Clean up.** Stop dev servers this session started and delete scratch files it created. Never stop, revert, stash or commit anything that belongs to another session.

6. **Report.** Keep it short: what landed (commits), what is recorded where, and what the user would have to do next. The very last line must be exactly one of:

   ```
   Safe to close: yes
   Safe to close: not yet — <one-line reason>
   ```

   Answer `yes` only when all of these hold: no failing checks; every change from this session is either committed or written into the roadmap with its file list; nothing this session started is still running. Anything else is `not yet`, with the reason.

## Concurrent sessions

Other Claude sessions often work in this tree at the same time and commit whole files. Attribute changes to this session by what it edited in the conversation, not by `git status` alone. Never use bare `git stash`. If a file this session needs to edit changed in the last few minutes, re-read it first.
