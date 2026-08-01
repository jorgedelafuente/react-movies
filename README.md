# React Movies

> A movie browsing app built to explore modern React patterns — type-safe, fully tested, and deployed to production.

**Live:** https://react-movies-flax.vercel.app/

---

## Features

-  Browse popular, top-rated, and upcoming films from TMDB
-  Search with debounced input and sanitised queries
-  Film detail pages with trailers
-  Save favourites (persisted in Supabase, optimistic updates)
-  Auth — sign up, log in, reset password
-  Light / dark mode
-  Fully responsive layout

---

## Getting started

```sh
cp .env.example .env.local   # add your TMDB + Supabase keys
pnpm install
pnpm dev                     # http://localhost:5173
```

See [.env.example](.env.example) for the required variables.

---

## Tech stack

### Core

|     | Tool                                          | Purpose                              |
| --- | --------------------------------------------- | ------------------------------------ |
| ⚛️  | [React](https://react.dev/)                   | UI library                           |
| 🔷  | [TypeScript](https://www.typescriptlang.org/) | Strict type safety                   |
| ⚡  | [Vite](https://vitejs.dev/)                   | Build tool and dev server            |
| 🎨  | [Tailwind CSS](https://tailwindcss.com/)      | Utility-first styling with dark mode |

### Routing & data

|     | Tool                                              | Purpose                             |
| --- | ------------------------------------------------- | ----------------------------------- |
| 🗺️  | [TanStack Router](https://tanstack.com/router)    | File-based, type-safe routing       |
| 🔄  | [TanStack Query](https://tanstack.com/query)      | Server state and data fetching      |
| 🗄️  | [Zustand](https://zustand.docs.pmnd.rs/)          | Global client state                 |
| 🔐  | [Supabase](https://supabase.com/)                 | Auth and PostgreSQL database        |
| 🌐  | [Redaxios](https://github.com/developit/redaxios) | Lightweight fetch-based HTTP client |

### Testing

|     | Tool                                                                                                    | Purpose                             |
| --- | ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 🧪  | [Vitest](https://vitest.dev/)                                                                           | Unit and component tests            |
| 🎭  | [Playwright](https://playwright.dev/)                                                                   | End-to-end tests                    |
| 📐  | [React Testing Library](https://testing-library.com/react)                                              | Component rendering and interaction |
| 🔌  | [MSW](https://mswjs.io/)                                                                                | Network mocking for E2E             |
| ♿  | [axe-core](https://github.com/dequelabs/axe-core) + [vitest-axe](https://github.com/chaance/vitest-axe) | Accessibility assertions            |

### Tooling

|     | Tool                                                                                                   | Purpose                                                                     |
| --- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 🔍  | [ESLint](https://eslint.org/)                                                                          | Linting (`typescript-eslint`, `jsx-a11y`, `react-hooks`, `@tanstack/query`) |
| 💅  | [Prettier](https://prettier.io/)                                                                       | Code formatting                                                             |
| 🐶  | [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Pre-commit quality gate                                                     |
| 📝  | [commitlint](https://commitlint.js.org/)                                                               | Conventional commit enforcement                                             |
| 🚀  | [Vercel](https://vercel.com/)                                                                          | Hosting and deployments                                                     |

---

## Commands

```sh
pnpm dev            # start dev server
pnpm build          # type-check + production build
pnpm test           # unit tests (watch)
pnpm test:silent    # unit tests (CI)
pnpm playwright     # E2E tests (headless)
pnpm lint           # ESLint
pnpm format         # Prettier
pnpm coverage       # coverage report
```
