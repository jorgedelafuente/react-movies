# CLAUDE.md

Project rules for AI-assisted development. Config values live in their source files; this file only records what is not derivable from them.

## Package Manager

Always use **pnpm**. Never use `npm`, `yarn`, or `bun`.

Most-used commands (full list in [package.json](package.json)):

```sh
pnpm dev                # dev server (http://localhost:5173)
pnpm build              # tsc -b + Vite build
pnpm lint               # ESLint
pnpm test:silent        # Vitest, no watch
pnpm typecheck          # tsc -b --noEmit (plain `tsc --noEmit` checks nothing: the root tsconfig has no files)
```

## TypeScript

Strict mode is on ([tsconfig.app.json](tsconfig.app.json)). Code must type-check before committing. Import from `src/` with the `@/` alias:

```ts
import { Button } from '@/components/atoms/button/button.component';
```

## Testing

**Vitest** is the only test runner (Playwright was removed in Sept 2026; do not add E2E tooling). Config lives under the `test` key in [vite.config.ts](vite.config.ts). jsdom, globals enabled.

-  Setup: [src/tests/setupTests.ts](src/tests/setupTests.ts)
-  Render helpers: [src/tests/test-utils.tsx](src/tests/test-utils.tsx) — `renderWithQueryContext` wraps in a fresh QueryClient; `renderWithAxe` also runs axe and returns `violations` for `toHaveNoViolations()`.
-  Shared mocks: [src/tests/mocks/](src/tests/mocks/) — one `<domain>.mocks.ts` per TMDB domain (`films`, `series`, `people`, `discover`, `images`, `reviews`, `search`), mirroring `src/services/` and `src/types/`. Import `MOCK_*` from the domain file and parse it through the Zod schema before passing as props.

**Never call the real TMDB API or Supabase in tests.** Render with mock data from the shared mocks file or `vi.mock` the service module in `src/services/`. MSW is not installed; do not add it. Route-level behaviour (which detail route a card links to, navbar targets) is asserted through `href` attributes inside a bare `RouterProvider`, as in `media-link.spec.tsx` and `navbar.spec.tsx`.

## Pre-commit

A husky hook runs lint-staged on staged files: ESLint with `--max-warnings=0` (warnings block the commit) and Prettier (3-space indent, single quotes, ES5 trailing commas, Tailwind class sorting). Do not hand-format; let Prettier do it.

Commits must follow Conventional Commits, enforced by commitlint: `<type>(<scope>): <description>`.

## Environment Variables

Copy [.env.example](.env.example) to `.env.local`. All three are required at runtime.

| Variable                        | Description                |
| ------------------------------- | -------------------------- |
| `VITE_APIKEY`                   | TMDB API key               |
| `VITE_SUPABASE_URL`             | Supabase project URL       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase public (anon) key |

## Layout

-  `src/components/` — `atoms/` holds generic UI primitives only (button, card, card-grid, input, link, media-image, modal, sortable-header, spinner, stat, sticky-title): nothing in there may import a hook, a store or a service beyond `services/config`, and `link/media-link` + `media-image` are the only ones that know `media_type`. Anything that knows about films, series, people or favourites sits one level up as `src/components/<name>/` (`film-card`, `favorite-button`, `view-toggle`, `film-table`, `cast-list`, `release-dates`, `image-gallery`, `review-list`, `keyword-filter`), plus `auth/` forms and `layout/` (navbar, containers, error boundaries)
-  `src/routes/` — TanStack Router file-based routes
-  `src/services/` — TMDB fetchers + query options, one folder per domain (`films/` for movies, `series/` for TV, `discover/` for filtered browsing + genres, `people/` for cast pages, `search/` for the navbar typeahead and keyword lookups, `images/`, `reviews/`), Supabase client/auth/favorites, image config. Files are plain `.ts` (no JSX). Detail queries live in `<domain>QueryOptions.ts` and list queries in `<domain>ListQueryOptions.ts` (`filmQueryOptions` vs `filmListQueryOptions`, `seriesQueryOptions` vs `seriesListQueryOptions`)
-  `src/types/` — `<domain>.schemas.ts` holds the Zod schemas for a TMDB domain **and** the `z.infer` types derived from them (`FilmInfoType`, `SeriesInfoType`, ...); there are no separate `.types.ts` files for TMDB shapes. `*.types.ts` is only for app-owned types with no schema (`auth`, `media`, `theme`, `list-view`)
-  `src/utils/hooks/` — `useAuth`, `useFavorites`, `useTheme`, `useListView`, `useDebounce`
-  `src/utils/` — pure helpers: `sanitizeInput`, `releaseDates` (certification + release list shaping), `dedupeCredits` (collapse a person's repeated credits), `pickTrailer` (choose the one trailer a detail page embeds), `avatarUrl`, `stripMarkdown`
-  `src/views/` — page-level components. Every list route (`/popular`, `/series/top-rated`, ...) is a `createFileRoute` whose loader ensures a list query and whose component is `<FilmListPage queryOptions={...} />` from `views/film-list/`; loading UI comes from the router's `defaultPendingComponent` in `main.tsx`, so routes do not render spinners themselves
-  `src/tests/` — Vitest setup, helpers, mocks
-  `docs/` — long-form documentation (see [Documentation](#documentation))

## Documentation

-  [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) — the look and feel already in the app: tokens, typography, spacing, page roots and anatomy, and the exact class recipes of every component. New pages and components copy from it; its last section lists where the code still diverges.
-  [docs/TESTING.md](docs/TESTING.md) — how specs are written here (bare-router pattern, service mocks, store resets, axe) plus the linting and formatting that gate commits.
-  [docs/ROADMAP.md](docs/ROADMAP.md) — planned work and the per-item checklist used by `/implement-roadmap`. Gitignored, so it exists only on the maintainer's machine; do not assume it is present in a fresh clone.

**Loose ends go in the roadmap, not in chat.** When a task ends with something undone, blocked, deferred or discovered along the way, append it as one dated line under `## Follow-ups` in [docs/ROADMAP.md](docs/ROADMAP.md) (or under the matching area if it is already real work), naming the commit it came from, and tick `[x]` any roadmap item the task completed, adding the commit hash. Do this before the final message, then list the items briefly in that message. If the roadmap file is absent (fresh clone), say so and put the list in the final message instead.

**End every task with a close verdict.** The last line of the final message is exactly `Safe to close: yes` or `Safe to close: not yet — <reason>`. Say `yes` only when nothing from the task lives solely in the conversation: every change is committed or recorded in the roadmap with its files, checks pass, and nothing the session started (dev servers, scratch files) is still around. `/handoff` runs this wrap-up on demand; run it, rather than answering from memory, whenever the user asks whether they can close the window, says they are done or leaving, or asks what is left.

## Conventions

-  **Routing:** [src/routeTree.gen.ts](src/routeTree.gen.ts) is auto-generated by the TanStack Router Vite plugin. Never edit it by hand.
-  **State:** Zustand stores are wrapped in the hooks under `src/utils/hooks/`. Components consume state through those hooks only, never by importing a store directly.
-  **List pages:** every list route renders `FilmList`, which switches between the card grid and `FilmTable` through `useListView` (cards by default). `FlexContainer` is the themed root for those pages; anything added to a list page must render inside it or it will not pick up dark mode. A page that already has its own root renders `<FilmList embedded />` instead (Discover does, inside `Container`); never nest `FlexContainer` in `Container`.
-  **Server state:** TanStack Query. Query options (keys + fetchers) are co-located in `src/services/`.
-  **TMDB:** Always go through `src/services/films/` (movies), `src/services/series/` (TV), `src/services/discover/` (filtered lists + genres), `src/services/people/` (person pages) or `src/services/search/` (text search). Never call the API from a component. Responses are validated with the Zod schemas in [src/types/films.schemas.ts](src/types/films.schemas.ts) and [src/types/series.schemas.ts](src/types/series.schemas.ts). Image base URLs come from [src/services/config.ts](src/services/config.ts).
-  **Media types:** TMDB movie ids and TV ids are separate namespaces, so every item carries a `media_type` (`'movie' | 'tv'`, constants in [src/types/media.types.ts](src/types/media.types.ts)). TV list and recommendation responses are normalised onto the film shape by `toMediaItem` in `series.schemas.ts` (`name` → `title`, `first_air_date` → `release_date`) so `FilmList`, `FilmCard` and `FilmTable` render both. Never build a detail link from an id alone; use `MediaLink` ([src/components/atoms/link/media-link.component.tsx](src/components/atoms/link/media-link.component.tsx)), which picks `/film/:id` or `/tv/:id`.
-  **Detail-page extras:** `movieInfo` appends `release_dates`; the film page shows an age rating badge for the visitor's region (`Intl.Locale`, US fallback) and a collapsible per-country release list via [src/components/release-dates/release-dates.component.tsx](src/components/release-dates/release-dates.component.tsx). Both film and series pages render cast through `CastList`, which links each member to `/person/:personId`. People are reachable only from cast lists; there is no People nav section or search by design.
-  **Sticky title:** detail pages (film, series, season) open with `StickyTitle` ([src/components/atoms/sticky-title/sticky-title.component.tsx](src/components/atoms/sticky-title/sticky-title.component.tsx)), never a hand-rolled sticky div. Its `top` reads `--navbar-height`, which `Navbar` publishes from a ResizeObserver, so never hard-code the navbar height; it carries `z-index: 1` because the frosted panels' `backdrop-filter` would otherwise paint over it. It is the page's `h1`; pass `as="p"` where the `h1` already sits in the body (season page).
-  **Discover:** the home page `/` is the Discover page and the only route with search params (`type`, `genre`, `keyword`, `sort`, `provider`, `year`, `page`), validated by `DiscoverSearchSchema` in [src/types/discover.schemas.ts](src/types/discover.schemas.ts). Every param is optional and uses `.catch(undefined)`, so malformed URLs fall back to defaults instead of erroring; `resolveDiscoverSearch` turns the parsed search into concrete fetch params and is the loader's `loaderDeps`. `/discover` is kept only as a redirect to `/` that forwards the same search params, so older links still open the same filtered view. Sorting by revenue is movie-only and silently maps to popularity for TV. `provider` is a TMDB watch-provider id from the curated `STREAMING_PROVIDERS` list (any other id is dropped) and is sent as `with_watch_providers` plus `watch_region` from the visitor's locale, so "Streaming on Netflix" means Netflix in the visitor's country. The rating and newest sorts carry a `vote_count.gte` floor; without it TMDB returns pages of zero-vote filler. `keyword` is a TMDB keyword id sent as `with_keywords`; the loader resolves it to a name through `keywordQueryOptions` so the `KeywordFilter` combobox ([src/components/keyword-filter/](src/components/keyword-filter/)) can show it, and an id TMDB no longer knows renders as `#id` instead of erroring. Discover has no free-text title search on purpose: TMDB's search endpoints accept none of the discover filters, so the two cannot be combined server-side.
-  **Search:** the navbar typeahead calls `/search/multi` through `src/services/search/`. People are dropped by `MultiSearchSchema` (people are reachable only from cast lists), TV hits are normalised with `toMediaItem`, and every row carries a Film/Series tag. List keys are `media_type:id` because movie and TV ids collide. Inside a react-aria `ComboBox`, use a plain `<button>` for clear buttons: a react-aria `Button` there becomes the popover trigger and takes the field's label as its accessible name.
-  **Seasons:** `/tv/:seriesId/season/:seasonNumber` is defined as `$seriesId_.season.$seasonNumber.tsx` (trailing underscore = not nested under the series detail route). Its loader ensures both the series and the season query so the season page can show the series name and a season switcher without a second round trip.
-  **Supabase:** Auth and favorites live in `src/services/supabase/` and are consumed only through `useAuth` and `useFavorites`. Favorites use optimistic updates with rollback. Rows are keyed by `(user_id, film_id, media_type)`; `useFavorites` exposes `isFavorited(filmId, mediaType)` and `toggle(favoriteInput)`. Schema changes live in `supabase/migrations/` and are applied through the Supabase SQL editor (no CLI in this repo).
-  **User input:** Run search queries and other user input through [src/utils/sanitizeInput.ts](src/utils/sanitizeInput.ts) before passing them to an API.
-  **Images:** Render TMDB artwork through `MediaImage` ([src/components/atoms/media-image/media-image.component.tsx](src/components/atoms/media-image/media-image.component.tsx)), never a bare `<img>`. It swaps in a themed skeleton when the path is null or the request fails, so the broken-image icon never shows. Pass `fallbackClassName` with an aspect ratio when the image sizes itself, and `basePath` (a size prefix from [src/services/config.ts](src/services/config.ts)) when a list needs thumbnails smaller than the default w500.

## Responsive Design

Mobile-first: start with small screens, layer up with `sm:`, `md:`, `lg:`. Do not hard-code pixel widths.

The film and series detail pages (`/film/:filmId`, `/tv/:seriesId`) must not use horizontal scroll layouts on mobile. Stack rows in a single column; horizontal scroll is only appropriate at `sm:` and above.

## Styling

Tailwind CSS v3 with `darkMode: 'class'`. Colors are HSL CSS variables in [src/styles/global.css](src/styles/global.css), swapped under `.dark`, and surfaced as semantic utilities by [tailwind.config.ts](tailwind.config.ts): `bg-neutral`, `bg-neutral-inverted`, `bg-subtle`, `text-copy`, `border-bold`, and `accent` for every interactive colour (`text-accent`, `border-accent`, `bg-accent/10`, `fill-accent`, `outline-accent`; hover and focus states included). Use those; never write `sky-*` or pair raw palette colors with `dark:` variants (the codebase has none). The config is the reference for what exists: a class it does not define compiles to nothing, so extend the theme there for any new token and never use arbitrary colour values like `text-[#0ea5e9]`. In component CSS files reference tokens as `hsl(var(--color-accent) / 1)`. The `*-background-color` utilities are legacy, for existing code only. The `dark` class is set on layout roots (navbar, flex container), not on `<html>`. Component-scoped CSS files sit alongside their component. The card grid reads the `--card-min` / `--card-min-share` / `--card-gap` / `--card-columns` tokens from global.css rather than defining its own sizes (the share caps it at four columns so big screens get bigger cards), and CSS files write media queries as `@media screen(sm)` / `screen(lg)` (Tailwind resolves them at build) instead of pixel values.

## Typography

Two self-hosted variable fonts from `@fontsource-variable`, loaded in [src/styles/index.css](src/styles/index.css): Inter for body/UI (`font-sans`) and Outfit for headings and navigation (`font-display`). Family names live in the `--font-sans` / `--font-display` variables in [src/styles/global.css](src/styles/global.css); change them there to re-skin the app.

-  Headings get the display face and a fluid size by default (`h1` → `text-display-lg`, `h2` → `text-display-md`, `h3` → `text-display-sm`, `h4`–`h6` → `text-display-xs`). Use `text-display-*` utilities to size any element like a heading.
-  Use `tabular-nums` on ratings, years, dates and money so columns align.
-  `font-synthesis: none` is on: never use `italic` or a weight the font lacks on `font-display` text (Outfit has no italic). Inter italic is loaded.
-  Three weights only: `font-normal` (400) for body, `font-medium` (500) for labels, links and buttons, `font-semibold` (600) for headings, badges and emphasis. The Tailwind theme defines no other weight utilities and no `font-serif` / `font-mono`, so `font-bold` compiles to nothing. In CSS files write `font-weight: 500` or `600`, never 700.
-  Two faces only. Do not add a third font, and do not use `font-display` for body copy. Recipes for every text role are in [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) § Typography; new UI copies them rather than choosing sizes and weights ad hoc.
