# React Movies

> A movie and TV browsing app built to explore modern React patterns — type-safe, fully tested, and deployed to production.

**Live:** https://react-movies-flax-mu.vercel.app/

---

## Features

-  Discover, on the home page: filter films or series by genre, keyword, streaming provider (in your region), release year and sort order, all held in the URL
-  Browse popular, top-rated, upcoming and now-playing films from TMDB
-  Browse popular, top-rated, and on-the-air TV series
-  Switch any list between a card grid and a sortable table
-  Search films and series together from the navbar with a debounced, sanitised typeahead
-  Film detail pages with trailer, cast & crew, age rating and per-country release dates, image gallery, reviews, recommendations, and IMDb / homepage links
-  Series detail pages with trailer, cast & crew, seasons, networks, image gallery, reviews, and recommendations
-  Season pages with the episode list and a switcher to the other seasons
-  Person pages with biography and cast / crew credits, reached from any cast list
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

### UI

|     | Tool                                                                  | Purpose                                                 |
| --- | --------------------------------------------------------------------- | ------------------------------------------------------- |
| 🧩  | [React Aria Components](https://react-spectrum.adobe.com/react-aria/) | Accessible combobox, select, menu and toggle primitives |
| 📊  | [TanStack Table](https://tanstack.com/table)                          | Sortable tables for list pages and favourites           |
| 🔤  | [Fontsource](https://fontsource.org/)                                 | Self-hosted Inter and Outfit variable fonts             |

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
| 🚀  | [Vercel](https://vercel.com/)                                                                          | Hosting and deployments                                                     |

---

## Commands

```sh
pnpm dev            # start dev server
pnpm build          # type-check + production build
pnpm preview        # serve the production build locally
pnpm typecheck      # type-check only (tsc -b --noEmit)
pnpm test           # unit tests (watch)
pnpm test:silent    # unit tests, quiet output
pnpm test:ui        # unit tests in the Vitest browser UI
pnpm coverage       # unit tests with coverage report
pnpm coverage:open  # coverage report, then open it in the browser
pnpm lint           # ESLint
pnpm format         # Prettier (write)
pnpm format:check   # Prettier (check only)
```

---

## Docs

-  [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) — design tokens, typography, layout and the component recipes in use
-  [docs/TESTING.md](docs/TESTING.md) — testing patterns, linting and formatting
-  [CLAUDE.md](CLAUDE.md) — project rules for AI-assisted development
