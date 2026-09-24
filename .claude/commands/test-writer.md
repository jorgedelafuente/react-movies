---
description: Generate Vitest unit tests for a given file or feature
allowed-tools: Read, Bash(pnpm test:silent*), Bash(pnpm tsc --noEmit*), Bash(pnpm lint*)
---

# Test Writer Agent

Generate Vitest unit tests for a target file or feature: components, hooks, services, and route-level wiring (link targets, navbar routes). Vitest is the only test runner in this repo; there is no E2E layer, so do not propose Playwright, Cypress or Storybook.

## Usage

```
/test-writer src/utils/hooks/useAuth.ts
/test-writer src/components/auth/login-form
```

## Steps

### 1. Read the target

-  Read `$ARGUMENTS` (the target file).
-  Read related files: if it's a hook, read the store; if it's a component, read its prop types and child components; if it's a service, read the Zod schemas it validates against.
-  Read [src/tests/test-utils.tsx](src/tests/test-utils.tsx) and [src/tests/mocks/](src/tests/mocks/) (one `<domain>.mocks.ts` per TMDB domain) to understand available helpers and existing mock data.
-  Read one existing test file of the same type for style reference:
   -  Hooks: `src/utils/hooks/*.spec.ts(x)`
   -  Components and forms: `src/components/auth/**/*.spec.tsx`
   -  Anything that renders a `Link` or needs a router: [src/components/atoms/link/media-link.spec.tsx](src/components/atoms/link/media-link.spec.tsx) or [src/components/layout/navbar/navbar.spec.tsx](src/components/layout/navbar/navbar.spec.tsx)

### 2. Write the tests

-  File: `<source-name>.spec.ts(x)` co-located next to the source file
-  Use `describe` / `it` blocks (vitest globals — no import needed)
-  Import `renderWithQueryContext` from `@/tests/test-utils` for components that need a QueryClient; `renderWithAxe` when you also want axe results
-  Components that render a TanStack `Link` need a router: create a bare root route with `createRootRoute()` + `createRouter()` and render through `<RouterProvider router={router} defaultComponent={element} />` inside `act`, then assert on `href`
-  Mock data: import `MOCK_*` constants from the matching domain file, e.g. `@/tests/mocks/films.mocks` and parse them through the matching Zod schema (`FilmListSchema`, `SeriesListSchema`, ...) before passing them as props — never inline large data objects
-  Use `vi.mock(...)` for external modules (Supabase client, TMDB fetch functions in `src/services/`); never call the real TMDB or Supabase APIs. MSW is not installed; do not add it
-  Use `vi.spyOn(...)` for store actions
-  Prefer `userEvent` from `@testing-library/user-event` over `fireEvent` for interactions
-  Assert with `@testing-library/jest-dom` matchers (`toBeInTheDocument`, `toHaveTextContent`, `toHaveAttribute`, etc.)
-  Accessibility: use `vitest-axe` (`toHaveNoViolations`) for any component that renders UI
-  Cover: happy path, empty state, error state, and any media-type branching (`movie` vs `tv`)

### 3. Validate

Run the new tests and confirm they pass:

```bash
pnpm test:silent
```

If tests fail, diagnose and fix before finishing. Also run `pnpm tsc --noEmit` and `pnpm lint` to catch any type or lint errors in the new file.

### 4. Report

Output the test file path, the number of tests written, and a one-line summary per `describe` block.
