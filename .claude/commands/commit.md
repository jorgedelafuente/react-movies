---
model: claude-haiku-4-5-20251001
allowed-tools: Bash(git diff*), Bash(git log*), Bash(git commit*)
---

# Write Git Commit

Write a conventional commit message for the current staged changes.

## Steps

1. Run `git diff --staged` to see what's staged. If nothing is staged, run `git diff` to show unstaged changes and inform the user to stage them first.
2. Run `git log --oneline -5` to learn the commit style used in this repo.
3. Analyze the diff: identify the type of change, the scope (if obvious from file paths), and the intent.
4. Write a commit message following [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body — only if the why is non-obvious]
```

Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`, `style`, `perf`.

Rules:
- Description is lowercase, imperative mood, no trailing period
- Max 72 characters on the first line
- Body only when the motivation or context is not self-evident from the diff
- Do NOT include `Co-Authored-By` or any AI attribution lines

5. Present the commit message to the user and ask for confirmation before running `git commit`.
6. Once confirmed, run:

```bash
git commit -m "$(cat <<'EOF'
<message here>
EOF
)"
```
