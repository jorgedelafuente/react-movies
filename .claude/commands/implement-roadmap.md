---
description: Implement a single roadmap item from ROADMAP.md in an isolated git worktree
allowed-tools: Read, Edit, Write, Bash(pnpm tsc --noEmit*), Bash(pnpm lint*), Bash(pnpm test:silent*), Bash(pnpm build*), Bash(git *), Bash(find *), Bash(grep *)
---

# Implement Roadmap Agent

Pick one item from [ROADMAP.md](ROADMAP.md), implement it fully in an isolated branch, and leave you with a clean commit ready to review.

## Usage

```
/implement-roadmap "Modal form divider"
/implement-roadmap "Toast notifications"
/implement-roadmap protected-routes
```

Pass any fragment of the roadmap item's title. If `$ARGUMENTS` is empty, list all open items and ask the user to pick one.

## Steps

### 1. Identify the item

- Read [ROADMAP.md](ROADMAP.md).
- Find the item matching `$ARGUMENTS` (fuzzy match on title).
- If multiple items match, list them and stop — ask the user to clarify.
- Read the full item text including any sub-bullets for acceptance criteria.

### 2. Understand the codebase

Before writing a single line, read every file that the change will touch:

- Follow imports to understand the data flow.
- Check existing component patterns in the same directory.
- Read [CLAUDE.md](CLAUDE.md) for conventions (3-space indent, Tailwind dark mode via `dark:`, path alias `@/`, strict TypeScript, etc.).
- If the item involves auth: read [src/utils/hooks/useAuth.ts](src/utils/hooks/useAuth.ts) and [src/services/supabase/auth.ts](src/services/supabase/auth.ts).
- If the item involves UI: read the nearest sibling component for Tailwind class patterns.
- If the item involves routing: read [src/routes/__root.tsx](src/routes/__root.tsx) and the relevant route file.

### 3. Plan before coding

Write a short plan (3–5 bullet points) stating exactly which files you will create or modify and why. Present it and wait for approval before making any changes.

### 4. Implement

Apply the changes according to the plan:

- Follow all conventions in [CLAUDE.md](CLAUDE.md).
- Mobile-first Tailwind: start without breakpoint prefixes, layer `sm:` / `md:` / `lg:` on top.
- CSS variables for colours so `dark:` mode works automatically.
- No new dependencies unless unavoidable — check `package.json` first.
- TypeScript strict mode: no `any`, no `!` non-null unless a comment explains why.
- Do not add comments except for non-obvious invariants.

### 5. Validate

Run checks in this order and fix any failure before continuing:

```bash
pnpm tsc --noEmit   # type errors
pnpm lint           # ESLint + prettier-check
pnpm test:silent    # unit tests
pnpm build          # full build
```

### 6. Commit

Stage only the files you changed. Write a conventional commit:

```
feat(<scope>): <short description>
```

Common scopes: `auth`, `ui`, `routing`, `favorites`, `profile`, `testing`, `security`.

Run the commit using the project's git hooks (do not use `--no-verify`).

### 7. Report

Output:
- Which roadmap item was implemented
- Files created / modified (with line ranges for key changes)
- The commit hash
- Any follow-up items the roadmap should reference (e.g. a new item that this unblocks)
