# React Movies

[![CI](https://github.com/jorgedelafuente/react-movies/actions/workflows/ci.yml/badge.svg)](https://github.com/jorgedelafuente/react-movies/actions/workflows/ci.yml)

A movie browsing app built as a learning project for modern React patterns. Browse films from TMDB, save favourites, and manage your account — all with a fully tested, type-safe stack.

Live: https://react-movies-flax.vercel.app/

---

## Getting started

1. Copy the example env file and add your API keys:

   ```sh
   cp .env.example .env.local
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start the dev server:

   ```sh
   pnpm dev
   ```

   The app runs at `http://localhost:5173`.

---

## Tech stack

### Core

| Tool | Purpose |
|---|---|
| [React](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety (strict mode) |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling with dark mode |

### Routing & data

| Tool | Purpose |
|---|---|
| [TanStack Router](https://tanstack.com/router) | File-based, type-safe routing |
| [TanStack Query](https://tanstack.com/query) | Server state and data fetching |
| [Redaxios](https://github.com/developit/redaxios) | Lightweight HTTP client (fetch-based Axios API) |
| [Zustand](https://zustand.docs.pmnd.rs/) | Global client state management |
| [Supabase](https://supabase.com/) | Auth and database (PostgreSQL) |

### Testing

| Tool | Purpose |
|---|---|
| [Vitest](https://vitest.dev/) | Unit and component tests |
| [React Testing Library](https://testing-library.com/react) | Component rendering and interaction |
| [axe-core](https://github.com/dequelabs/axe-core) | Accessibility rules engine |
| [vitest-axe](https://github.com/chaance/vitest-axe) | axe-core assertions for Vitest |
| [Playwright](https://playwright.dev/) | End-to-end tests across browsers |
| [MSW](https://mswjs.io/) | Network mocking for E2E tests |

### Tooling & quality

| Tool | Purpose |
|---|---|
| [ESLint](https://eslint.org/) | Linting (`typescript-eslint`, `jsx-a11y`, `react-hooks`, `@tanstack/query`) |
| [Prettier](https://prettier.io/) | Code formatting |
| [Husky](https://typicode.github.io/husky/) | Git hooks |
| [commitlint](https://commitlint.js.org/) | Conventional commit enforcement |

### Deployment

| Tool | Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Hosting and CI/CD |
| [GitHub Actions](https://github.com/features/actions) | Lint, type-check, unit tests, and E2E on every push |
