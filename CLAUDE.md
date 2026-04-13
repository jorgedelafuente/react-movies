# CLAUDE.md

Project conventions and tooling reference for AI-assisted development.

## Package Manager

Always use **pnpm**. Never use `npm` or `yarn`.

```sh
pnpm install       # install deps
pnpm dev           # dev server (http://localhost:5173)
pnpm build         # type-check + Vite build
pnpm lint          # ESLint
pnpm format        # Prettier
pnpm test          # Vitest (unit)
pnpm coverage      # Vitest + Istanbul coverage
pnpm playwright    # Playwright E2E
```

## TypeScript

Strict mode is on (`"strict": true` in [tsconfig.app.json](tsconfig.app.json)). All code must compile without errors before committing.

- Target: ES2020, module resolution: Bundler
- Path alias: `@/*` → `src/*`
- JSX transform: `react-jsx` (no React import needed)
- Vitest globals are typed via `"types": ["vitest/globals"]`

Run type-check standalone:

```sh
pnpm tsc --noEmit
```

## Testing

### Unit tests — Vitest

Config lives in [vite.config.ts](vite.config.ts) under the `test` key.

- Environment: `jsdom`
- Globals enabled (no need to import `describe`, `it`, `expect`)
- Setup file: [src/tests/setupTests.ts](src/tests/setupTests.ts)
- Coverage provider: Istanbul (`pnpm coverage`)
- E2E spec files are excluded from unit runs (`**/*.e2e.*`)

```sh
pnpm test          # watch mode
pnpm test:silent   # CI-friendly, no watch
pnpm test:ui       # Vitest browser UI
```

### E2E tests — Playwright

Config: [playwright.config.ts](playwright.config.ts)

- Test directory: `src/tests` (files matching `*.e2e.*`)
- Base URL: `http://localhost:5173` (dev server started automatically)
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge, Chrome
- Retries: 2 on CI, 0 locally
- Reports: HTML (`playwright-report/`)

**API mocking — MSW**

Playwright E2E tests use [MSW (Mock Service Worker)](https://mswjs.io/) to intercept network requests. Never call the real TMDB API or Supabase in E2E tests — always provide MSW handlers for any endpoints the test touches.

```sh
pnpm playwright          # headless
pnpm playwright:ui       # with browser UI
pnpm playwright:debug    # debug mode
```

## Linting & Formatting

### ESLint

Config: [eslint.config.js](eslint.config.js) — flat config format.

Active rule sets:
- `@typescript-eslint` strict
- `react-hooks` (exhaustive-deps enforced)
- `react-refresh`
- `jsx-a11y` (accessibility — all recommended rules)
- `@tanstack/query` (recommended)
- `prettier` (last, disables conflicting rules)

Ignored paths: `dist/`, `node_modules/`, `coverage/`, `src/routeTree.gen.ts`, and config files.

### Prettier

Config: [.prettierrc](.prettierrc)

- Semi-colons: yes
- Single quotes: yes
- Tab width: **3 spaces**
- Trailing commas: ES5
- Plugin: `prettier-plugin-tailwindcss` (class sorting)

### Commit messages — commitlint

Commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`.

## Environment Variables

Copy [.env.example](.env.example) to `.env.local` and fill in the values. All three vars are required at runtime and in CI.

| Variable | Description |
|---|---|
| `VITE_APIKEY` | TMDB API key |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public (anon) key |

Variables are prefixed with `VITE_` and exposed to the browser bundle by Vite. Do not store secrets without this convention check.

## CI — GitHub Actions

Workflows: [.github/workflows/](.github/workflows/)

| Job | Trigger | Steps |
|---|---|---|
| `quality` | push / PR | lint, format check, type-check, build |
| `unit-tests` | push / PR | Vitest + upload coverage |
| `e2e-tests` | push / PR | Playwright + upload `playwright-report/` artifact |

All jobs use **Node LTS** + **pnpm v10**. The three env vars above must be set as repository secrets (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_APIKEY`).

## Path Aliases

Import from `src/` using the `@/` alias anywhere in the app:

```ts
import { Button } from '@/components/ui/button'
```

## State Management — Zustand

Global state is managed with [Zustand](https://zustand.docs.pmnd.rs/). Prefer Zustand stores over React context for shared client state.

- Zustand store access is wrapped in custom hooks, located in `src/utils/hooks/`
- Always consume state through these hooks, never import stores directly in components

## Routing — TanStack Router

File-based routing via the [TanStack Router Vite plugin](https://tanstack.com/router). The route tree at `src/routeTree.gen.ts` is **auto-generated** — never edit it by hand.

- Define routes as files under `src/routes/`
- The Vite plugin regenerates `routeTree.gen.ts` on every save
- `routeTree.gen.ts` is excluded from ESLint and Prettier

## Data Source — TMDB

Movie data comes from [The Movie Database (TMDB)](https://www.themoviedb.org/) API. The API key is stored in `VITE_APIKEY` (see Environment Variables). All TMDB fetch logic should go through the existing data-access layer rather than calling the API directly from components.

## Responsive Design

The app is fully responsive and must work on mobile. Follow these guidelines when adding UI:

- Design mobile-first: start with small screens, layer up with `sm:`, `md:`, `lg:` breakpoints
- Playwright E2E runs against Mobile Chrome and Mobile Safari in CI — new features need to pass on both
- The Tailwind config extends the default breakpoints; do not hard-code pixel widths

## Styling

- Tailwind CSS v3 with a class-based dark mode (`dark:` prefix)
- Custom colors defined as HSL CSS variables in `src/index.css` and surfaced through [tailwind.config.ts](tailwind.config.ts)
- PostCSS handles Tailwind + Autoprefixer
