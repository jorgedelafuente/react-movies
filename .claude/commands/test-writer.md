---
description: Generate Vitest unit tests or Playwright E2E tests for a given file or feature
allowed-tools: Read, Bash(pnpm test:silent*), Bash(pnpm tsc --noEmit*), Bash(pnpm lint*), Bash(pnpm dev*), mcp__playwright__browser_navigate, mcp__playwright__browser_screenshot, mcp__playwright__browser_click, mcp__playwright__browser_type, mcp__playwright__browser_wait_for_load_state, mcp__playwright__browser_evaluate, mcp__playwright__browser_fill
---

# Test Writer Agent

Generate tests for a target file or feature. Supports:
- **Vitest unit tests** for components, hooks, and services
- **Playwright E2E tests** for user flows (uses Playwright MCP to observe live behavior before writing specs)

## Usage

```
/test-writer src/utils/hooks/useAuth.ts
/test-writer src/components/auth/login-form unit
/test-writer src/routes/index.tsx e2e
```

If no mode is specified, infer the type: hooks/services/components → unit, routes/full-flows → e2e.

## Steps

### 1. Read the target

- Read `$ARGUMENTS` (the target file).
- Read related files: if it's a hook, read the store; if it's a component, read its prop types and child components; if it's a service, read the Zod schemas it validates against.
- Read [src/tests/test-utils.tsx](src/tests/test-utils.tsx) and [src/tests/__mocks__/mocks.ts](src/tests/__mocks__/mocks.ts) to understand available helpers and existing mock data.
- Read one existing test file of the same type for style reference:
  - Unit: look in `src/utils/hooks/` or `src/components/auth/` for a `*.spec.tsx` file
  - E2E: read [src/tests/e2e/routes.e2e.spec.tsx](src/tests/e2e/routes.e2e.spec.tsx)

### 2. For E2E tests — observe with Playwright MCP

Use the Playwright MCP tools to observe real behavior before writing assertions:

1. Navigate to the relevant route via `mcp__playwright__browser_navigate`.
2. Take a screenshot to see the current state.
3. Interact with the UI (clicks, form fills) to discover real selectors, loading states, error states, and success states.
4. Note the exact text, roles, and aria labels in the DOM — these become your `getByRole` / `getByText` assertions.

**Never call the real TMDB or Supabase APIs** — always mock with `page.route()` before navigating, using data from [src/tests/__mocks__/mocks.ts](src/tests/__mocks__/mocks.ts).

### 3. Write the tests

#### Unit test conventions
- File: `<source-name>.spec.ts(x)` co-located next to the source file
- Use `describe` / `it` blocks (vitest globals — no import needed)
- Import `renderWithQueryContext` from `@/tests/test-utils` for components that need QueryClient
- Use `vi.mock(...)` for external modules (Supabase client, TMDB fetch functions)
- Use `vi.spyOn(...)` for store actions
- Assert with `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveTextContent`, etc.)
- Accessibility: use `vitest-axe` (`toHaveNoViolations`) for any component that renders UI

#### E2E test conventions
- File: `src/tests/e2e/<feature>.e2e.spec.tsx`
- Import `MOCK_*` constants from `@/tests/__mocks__/mocks` (never inline large data objects)
- Use `page.route('**/movie/<endpoint>*', ...)` for TMDB mocks
- Use `page.route('**/rest/v1/**', ...)` for Supabase mocks
- Prefer `getByRole` and `getByText` over CSS selectors
- Group with `test.describe` by feature / page
- Cover: happy path, loading state, error state, mobile viewport (375×667)

### 4. Validate

Run the new tests and confirm they pass:

```bash
# Unit
pnpm test:silent

# E2E
pnpm playwright
```

If tests fail, diagnose and fix before finishing. Also run `pnpm tsc --noEmit` and `pnpm lint` to catch any type or lint errors in the new file.

### 5. Report

Output the test file path, the number of tests written, and a one-line summary per `describe` block.
