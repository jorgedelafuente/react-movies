---
description: Run an accessibility audit using Playwright MCP, report violations, and apply fixes
allowed-tools: Read, Edit, Bash(pnpm tsc --noEmit*), Bash(pnpm lint*), Bash(pnpm test:silent*), Bash(pnpm dev*), mcp__playwright__browser_navigate, mcp__playwright__browser_screenshot, mcp__playwright__browser_click, mcp__playwright__browser_evaluate, mcp__playwright__browser_wait_for_load_state, mcp__playwright__browser_fill
---

# Accessibility Audit Agent

Audit a route or component for accessibility violations using Playwright MCP and `axe-core`, then apply fixes.

## Usage

```
/a11y-audit                          # audit all main routes
/a11y-audit /film/533535             # audit a specific route
/a11y-audit src/components/auth/auth-modal
```

If `$ARGUMENTS` is empty, audit the following routes in order: `/`, `/popular`, `/top-rated`, `/upcoming`, and the auth modal (trigger it from the navbar).

## Steps

### 1. Start the app

The dev server runs at `http://localhost:5173`. If it isn't already running, note that you'll need it started before navigating.

### 2. For each target route or component

#### 2a. Navigate and screenshot

```
mcp__playwright__browser_navigate → http://localhost:5173<route>
mcp__playwright__browser_screenshot
```

Note the current visual state before injecting axe.

#### 2b. Inject and run axe-core

Use `mcp__playwright__browser_evaluate` to inject axe-core from CDN and run it:

```js
// Step 1 — inject
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js';
document.head.appendChild(script);
await new Promise(r => script.onload = r);

// Step 2 — run
const results = await axe.run();
return results.violations.map(v => ({
  id: v.id,
  impact: v.impact,
  description: v.description,
  nodes: v.nodes.map(n => ({ target: n.target, html: n.html, failureSummary: n.failureSummary }))
}));
```

#### 2c. Also test interactive states

For auth modal: click the login button in the navbar to open it, then re-run axe.
For mobile: re-run at 375×667 viewport.

### 3. Triage violations

Group violations by impact: **critical** → **serious** → **moderate** → **minor**.

For each violation:
- Map the `target` selector back to the source component in `src/`
- Determine if it's fixable without changing visual design (most are: missing labels, wrong roles, contrast, focus management)
- Skip violations caused by third-party content outside your control

### 4. Apply fixes

Fix violations in order of severity. Common patterns in this codebase:

- **Missing label on input**: add `aria-label` or associate a `<label>` — see [src/components/atoms/](src/components/atoms/) for the Input atom
- **Button has no accessible name**: add `aria-label` to icon-only buttons (e.g. FavoriteButton, theme toggle)
- **Missing landmark**: wrap page content in `<main>` if absent
- **Focus not trapped in modal**: add `aria-modal="true"` and a focus-trap to the auth modal — see [src/components/auth/auth-modal/](src/components/auth/auth-modal/)
- **Color contrast**: use the existing CSS variable system in [src/styles/index.css](src/styles/index.css) — do not hardcode hex values

Follow all conventions in [CLAUDE.md](CLAUDE.md): 3-space indent, Tailwind `dark:` prefix, TypeScript strict mode, no inline comments unless non-obvious.

### 5. Re-audit after fixes

Re-run axe on every route you changed to confirm violations are resolved. Take a screenshot after each fix to confirm nothing visually broke.

### 6. Validate

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:silent
```

Fix any errors before finishing.

### 7. Report

Output a table:

| Route / Component | Violations found | Violations fixed | Remaining (why) |
|---|---|---|---|

Then list each fix applied with the file path and a one-line description.
If any violations remain unfixed, explain why (e.g. third-party, requires design change).
