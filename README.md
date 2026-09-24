# React Movies

> A movie and TV browsing app built to explore modern React patterns — type-safe, fully tested, and deployed to production.

---

## Features

-  Browse popular, top-rated, and upcoming films from TMDB
-  Browse popular, top-rated, and on-the-air TV series
-  Search films with debounced input and sanitised queries
-  Film detail pages with trailer, cast & crew, recommendations, and IMDb / homepage links
-  Series detail pages with trailer, cast & crew, seasons and episodes, networks, and recommendations
-  Favourites for both films and series, persisted in Supabase with optimistic updates
-  Favourites page with a sortable table linking to each title's detail page
-  Auth — sign up, log in, reset password
-  Light / dark mode
-  Fully responsive layout

---

## Getting started

Requires **Node 22** and **pnpm 11** (pinned in `package.json`).

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

|     | Tool                                              | Purpose                                   |
| --- | ------------------------------------------------- | ----------------------------------------- |
| 🗺️  | [TanStack Router](https://tanstack.com/router)    | File-based, type-safe routing             |
| 🔄  | [TanStack Query](https://tanstack.com/query)      | Server state and data fetching            |
| 🗄️  | [Zustand](https://zustand.docs.pmnd.rs/)          | Global client state                       |
| 🔐  | [Supabase](https://supabase.com/)                 | Auth and PostgreSQL database              |
| 🌐  | [Redaxios](https://github.com/developit/redaxios) | Lightweight fetch-based HTTP client       |
| 🛡️  | [Zod](https://zod.dev/)                           | Runtime validation of every TMDB response |

### Testing

|     | Tool                                                                                                    | Purpose                             |
| --- | ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 🧪  | [Vitest](https://vitest.dev/)                                                                           | Unit and component tests            |
| 📐  | [React Testing Library](https://testing-library.com/react)                                              | Component rendering and interaction |
| ♿  | [axe-core](https://github.com/dequelabs/axe-core) + [vitest-axe](https://github.com/chaance/vitest-axe) | Accessibility assertions            |

### Tooling

|     | Tool                                                                                                   | Purpose                                                                     |
| --- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 🔍  | [ESLint](https://eslint.org/)                                                                          | Linting (`typescript-eslint`, `jsx-a11y`, `react-hooks`, `@tanstack/query`) |
| 💅  | [Prettier](https://prettier.io/)                                                                       | Code formatting                                                             |
| 🐶  | [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) | Pre-commit quality gate                                                     |
| 📝  | [commitlint](https://commitlint.js.org/)                                                               | Conventional commit enforcement                                             |

---

## Commands

```sh
pnpm dev            # start dev server
pnpm build          # type-check + production build
pnpm preview        # serve the production build locally
pnpm test           # unit tests (watch)
pnpm test:silent    # unit tests, quiet output
pnpm coverage       # unit tests with coverage report
pnpm lint           # ESLint
pnpm format         # Prettier
```

---

## Docs

-  [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) — theming, CSS and Tailwind conventions, component styling, linting, and testing patterns
-  [CLAUDE.md](CLAUDE.md) — project rules for AI-assisted development
