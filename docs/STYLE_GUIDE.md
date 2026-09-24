# React Movies Style Guide

This is the look and feel the app already has, written down so new pages and components adopt it instead of inventing their own. Every value here is lifted from the code; if the two disagree, fix one of them. [tailwind.config.ts](../tailwind.config.ts) is the reference for which utilities exist: it defines the semantic colour maps, the two font families, the three weights and the fluid `display-*` sizes, and anything it does not define compiles to nothing. This guide explains how to use what the config provides; when you need a new token, size or weight, extend the config first and then document it here. Hard rules for tooling live in [CLAUDE.md](../CLAUDE.md); testing patterns live in [TESTING.md](TESTING.md).

| What                                                | Where it is defined                                                     |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| Colour values, light and dark                       | `src/styles/global.css` (HSL variables under `:root` / `.dark`)         |
| Which colour utilities exist                        | `tailwind.config.ts` → `backgroundColors`, `borderColors`, `textColors` |
| Font files and `@font-face`                         | `src/styles/index.css`                                                  |
| Family names, weights, `display-*` sizes            | `tailwind.config.ts` → `fontFamily`, `fontWeight`, `fontSize`           |
| Element defaults (`h1`–`h6`, `strong`, transitions) | `src/styles/global.css` `@layer base`                                   |

1. [Foundations](#1-foundations) — colour, dark mode, typography, spacing, motion, states
2. [Layout](#2-layout) — building a page, page roots, page anatomy, the card grid, responsive rules
3. [Components](#3-components) — the recipes actually in use
4. [Patterns](#4-patterns) — Tailwind vs CSS files, react-aria, accessibility, media
5. [Known divergences](#5-known-divergences) — places the code does not follow this guide yet

---

## 1. Foundations

### Colour

Colours are HSL triplets in CSS variables in [src/styles/global.css](../src/styles/global.css). A raw greyscale (`--color-grey-0` white … `--color-grey-100` black, plus `--color-sky`) feeds a small set of semantic tokens. The `.dark` class re-points the semantic tokens, so components never branch on theme. [tailwind.config.ts](../tailwind.config.ts) exposes each token as `hsl(var(--token) / <alpha-value>)`, which is why the `/70`-style alpha modifiers work everywhere. The config wires three maps to specific utility families, and that wiring decides which classes exist:

-  `backgroundColors` (`neutral`, `neutral-inverted`, `subtle`, `accent`) → `bg-*` and the gradient stops `from-*` / `via-*` / `to-*`.
-  `borderColors` (`bold`, `copy`, `accent`) → `border-*`, `divide-*`, `stroke-*`, `outline-*`, `ring-*`.
-  `textColors` (`copy`, `accent`) → `text-*` and `fill-*`.

| Token                         | Light   | Dark    | Tailwind utilities                                                                   | Use for                                                                                          |
| ----------------------------- | ------- | ------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `--color-bg-neutral`          | white   | black   | `bg-neutral`, `from/via/to-neutral`                                                  | Page and panel backgrounds, inputs, table body                                                   |
| `--color-bg-neutral-inverted` | black   | white   | `bg-neutral-inverted`, `from/via/to-neutral-inverted`                                | Favourites row hover at `/5`                                                                     |
| `--color-bg-subtle`           | grey-10 | grey-80 | `bg-subtle`, `from/via/to-subtle`                                                    | Zebra rows, hovered list items, image placeholders; at `/70`, panels on pages without a backdrop |
| `--color-text-copy`           | black   | white   | `text-copy`, `fill-copy`, `border-copy`, `divide-copy`, `stroke/outline/ring-copy`   | Body text; outlined borders; dividers; icon fills                                                |
| `--color-border-bold`         | grey-60 | grey-40 | `border-bold`, `divide-bold`, `stroke-bold`, `outline-bold`, `ring-bold`             | Dividers (`<hr>`), table header rule, ViewToggle track and ring at low alpha                     |
| `--color-accent`              | sky-500 | sky-500 | all of the above: `bg/from/via/to`, `border/divide/stroke/outline/ring`, `text/fill` | Links, hover colour, focus ring, selected chips, icon strokes                                    |

Only the utilities in that column exist. `copy` and `bold` have no background utility, no token has a `placeholder-*`, `decoration-*` or `caret-*` form, and there is no `primary` colour, so `bg-copy/10`, `placeholder-text-copy` and `bg-primary` compile to nothing. The tell is Prettier: it leaves classes it does not recognise at the front of the string. Tailwind's default palette is still in the theme (`red-500`, `white`, `black` rely on it), so the ban on raw palette colours is a convention, not something the build enforces.

**Alpha carries hierarchy.** Do not reach for a lighter grey; lower the alpha of the token that is already there.

| Need                     | Class                         | Seen in                                             |
| ------------------------ | ----------------------------- | --------------------------------------------------- |
| Secondary text           | `text-copy/70`                | Result counts, cast roles, meta lines, empty states |
| Tertiary text            | `text-copy/60`                | Secondary button label                              |
| Tagline                  | `text-copy/70`                | Detail-page tagline under the title                 |
| Text on the card overlay | `text-white/85`               | Card overview (the overlay is always dark)          |
| Quiet outline            | `border-copy/30`              | Idle chips, inline certification pill               |
| Quiet outline (button)   | `border-copy/20`              | Secondary button, disclosure frame                  |
| Firm outline             | `border-copy/40`              | Age-rating pill                                     |
| List dividers            | `divide-copy/10`              | Disclosure rows                                     |
| Row divider              | `border-bold/30`              | Favourites table rows                               |
| Selected fill            | `bg-accent/10`                | Active chip                                         |
| Icon tint                | `fill-accent/20`              | Unfilled heart, navbar icons                        |
| Hover wash               | `hover:bg-neutral-inverted/5` | Favourites table rows                               |

**Alpha or `opacity-*`.** Use `text-copy/N` whenever the element owns its colour. Use `opacity-N` only where the colour is inherited and must stay inherited: a `<span>` inside a heading, a `text-inherit` link, a placeholder box. The dot that separates meta items is `<span className="mx-1 opacity-50">·</span>` for exactly that reason.

**Feedback colour.** Validation uses Tailwind's `red-500` directly: `border-red-500` on the control and `text-xs text-red-500` for the message. It is the only raw palette colour with a sanctioned role; `text-white/85` on the card overlay and `backdrop:bg-black/60` on the modal are the two fixed-contrast exceptions.

**Legacy variables.** Three hex variables predate the token system: `--primary-background-color`, `--secondary-background-color`, `--tertiary-background-color` (light `#dedede / #a6a6a6 / #737373`, dark `#141414 / #282828 / #323232`), exposed as `bg-*-background-color` and `border-*-background-color`. They are not going away this week, and today they own specific roles. Match the role; do not give them new ones.

| Variable  | Current role                                                                      |
| --------- | --------------------------------------------------------------------------------- |
| primary   | List-page background (FlexContainer), navbar background, spinner bars, badge fill |
| secondary | Form-control and panel borders (Input, Modal, selects), navbar border and shadow  |
| tertiary  | Detail-page section panels (`.text-content`), episode rows, navbar wave fill      |

### Dark mode

`darkMode: 'class'`. The `dark` class is applied by the components that own a screen region, reading `useTheme`: the two page roots (Container, FlexContainer), the Navbar, and the search combobox root so its portalled popover is themed too. Nothing else toggles it, and nothing uses the `dark:` variant. If you render into a portal, apply the class yourself the way the search combobox does.

The one place `.dark` cannot reach is the page's own scrollbar, which belongs to `<html>`, above every themed root. `--color-scrollbar-thumb` and `--color-scrollbar-track` (grey-40 on white in light, grey-60 on black in dark) are therefore re-pointed on `:root:has(.dark)` in global.css rather than on `.dark`. They have no Tailwind utilities; [src/styles/scrollbar.css](../src/styles/scrollbar.css) is their only consumer. It draws a 6px pill in a 10px gutter (a 2px transparent border with `background-clip: padding-box`), widens it to 8px and colours it `accent/75` on hover, full accent while dragging, and keeps the track see-through everywhere except the viewport, whose gutter takes the track token so it melts into the page. Firefox gets the same colours through `scrollbar-color` in an `@supports not selector(::-webkit-scrollbar)` block; the two branches must stay exclusive because Chromium ignores the pseudo-elements once `scrollbar-color` is set.

### Typography

Two self-hosted variable fonts, loaded in [src/styles/index.css](../src/styles/index.css) and named in `--font-sans` / `--font-display`:

-  **Inter Variable** — `font-sans`, the default on `<html>`. Body, controls, tables. Italic file is loaded.
-  **Outfit Variable** — `font-display`. Headings, navigation, card titles. No italic exists and `font-synthesis: none` is set, so never write `italic` on display text.

Headings get the display face automatically (`text-balance font-display font-semibold`, set in `global.css`) with a fluid size from `fontSize` in [tailwind.config.ts](../tailwind.config.ts). Each `display-*` entry bundles its own line-height and letter-spacing, so one class gives a tuned heading:

| Element   | Class             | Size                                      |
| --------- | ----------------- | ----------------------------------------- |
| `h1`      | `text-display-lg` | clamp(1.875rem, 1.5rem + 1.25vw, 2.5rem)  |
| `h2`      | `text-display-md` | clamp(1.5rem, 1.25rem + 0.75vw, 1.875rem) |
| `h3`      | `text-display-sm` | clamp(1.25rem, 1.125rem + 0.5vw, 1.5rem)  |
| `h4`–`h6` | `text-display-xs` | 1.125rem                                  |
| hero only | `text-display-xl` | clamp(2.25rem, 1.75rem + 2vw, 3.5rem)     |

Use the `text-display-*` utilities to size any element like a heading, and a plain `text-*` utility to make a heading smaller (card titles are `h2` at `text-base sm:text-lg`). Text placed inside a heading inherits the display face and weight, so reset what you do not want: a count inside a section heading carries `font-sans text-base font-normal` for that reason, and an `h3` used as an eyebrow label adds `font-sans`. The film tagline is a `<p>` beside the title, not inside it, so it only needs `font-sans` (series still nests it in an `h3`; see divergences).

Text roles in use:

| Role               | Classes                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Body               | `text-base`, `leading-relaxed` for paragraphs, `max-w-prose`                                   |
| Secondary          | `text-sm text-copy/70`                                                                         |
| Meta / captions    | `text-xs text-copy/70`; `text-xs opacity-70` when the colour is inherited                      |
| Detail meta line   | `text-sm font-medium tabular-nums text-copy/80`, items joined by `aria-hidden` dots            |
| Meta separator     | `<span className="mx-1 opacity-50">·</span>`                                                   |
| Count in a heading | `<span className="ml-2 font-sans text-base font-normal tabular-nums text-copy/60">(12)</span>` |
| Form label         | `text-sm font-medium text-copy`                                                                |
| Nav link           | `font-display text-lg font-medium tracking-wide`                                               |
| Button label       | `font-medium tracking-wide`                                                                    |
| Badge              | `text-xs font-semibold uppercase tracking-wider`                                               |
| Tagline            | `p font-sans text-lg italic text-copy/70 sm:text-xl`, a sibling of the title                   |
| Emphasis           | `<strong>` renders `font-semibold` (Inter's 700 is too heavy inline)                           |

**Weights.** Three, defined as `fontWeight` at the top level of [tailwind.config.ts](../tailwind.config.ts) so Tailwind's defaults are replaced: `font-bold`, `font-light` and the rest compile to nothing.

| Weight | Utility         | Used for                                           |
| ------ | --------------- | -------------------------------------------------- |
| 400    | `font-normal`   | Body, meta, the tagline, resets inside headings    |
| 500    | `font-medium`   | Form labels, nav links, buttons, table cells       |
| 600    | `font-semibold` | Headings, card and cast titles, badges, `<strong>` |

In CSS files write `font-weight: 500` or `600` to match, or `theme('fontWeight.medium')`. `fontFamily` is defined the same way, so there is no `font-serif` or `font-mono`; numbers get `tabular-nums`, not a different face.

Anything numeric — ratings, years, dates, counts, money — gets `tabular-nums` so columns align. FilmTable sets `font-variant-numeric: tabular-nums` on the whole table.

### Spacing, width, radius

| Concern                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page padding            | `p-4 sm:p-6 lg:px-10 lg:py-6` (list root: vertical padding equals the column gap, so the first child sits centred between navbar and cards) · `px-4 py-6` (detail column; the person column adds `lg:px-0`, see Profile page)                                                                                                                                                                                              |
| Page column width       | `max-w-4xl` (detail and utility pages) · no maximum on list pages and the Discover home, where the card grid scales with the page and `--card-min-share` keeps it at four columns, so a wider screen gets bigger cards                                                                                                                                                                                                     |
| Card layout tokens      | In global.css `:root`, stepped at `sm` and `lg` through `screen()`: `--card-min` (`9rem` / `13.75rem` / `15.625rem`, the narrowest a card column may get), `--card-min-share` (`22%`, the least share of the row a card may take; above 20% a fifth column never fits), `--card-gap` (`1rem` / `1.5rem` / `2rem`), `--card-columns` (the auto-fill track list). The grid reads these and defines no breakpoints of its own |
| Navbar height           | `--navbar-height` in global.css: `0px` default, overwritten inline on `<html>` by Navbar's ResizeObserver. `StickyTitle` reads it for its `top`; never hard-code the navbar height                                                                                                                                                                                                                                         |
| Stack gaps              | `gap-4 sm:gap-6` for the list page column · `var(--card-gap)` between cards in every card layout                                                                                                                                                                                                                                                                                                                           |
| Form gaps               | Stacked form `gap-4`; filter row `gap-4 sm:gap-x-5`; label-to-control `gap-1` (`Input`) or `gap-1.5` (filter fields, under an eyebrow label); chip rows `gap-2`                                                                                                                                                                                                                                                            |
| Between sections        | `mt-4`; under a section heading `mb-3` or `mb-4`; `<hr className="my-3 border-bold">`                                                                                                                                                                                                                                                                                                                                      |
| New block in a panel    | `mt-3`; a new section heading after content `mt-8`                                                                                                                                                                                                                                                                                                                                                                         |
| Modal panel             | `max-w-md p-6`                                                                                                                                                                                                                                                                                                                                                                                                             |
| Pagination              | `max-w-xs gap-3`                                                                                                                                                                                                                                                                                                                                                                                                           |
| Controls, posters       | `rounded-md`                                                                                                                                                                                                                                                                                                                                                                                                               |
| Panels, sections, modal | `rounded-lg` (cards use `10px` in CSS, the hero poster `25px`)                                                                                                                                                                                                                                                                                                                                                             |
| Chips, badges, avatars  | `rounded-full`                                                                                                                                                                                                                                                                                                                                                                                                             |
| Control borders         | `border-2 border-solid` on `Input` and `Modal`; filter controls (`Select`, the keyword input) use 1px `border-bold/40`; secondary button, chips and pills use 1px `border`                                                                                                                                                                                                                                                 |

### Images

The TMDB size prefixes live in [src/services/config.ts](../src/services/config.ts). `baseImagePath` is `w500`: use it for every poster, still, avatar and thumbnail. `baseImagePathPoster` is `w1280`: use it only for the detail-page hero backdrop. `baseImagePathThumb` is `w92`: use it, through `MediaImage`'s `basePath` prop, only for tiny thumbnails in long lists such as the search rows. Always `loading="lazy"`; `alt` is the title on card posters and empty on decorative images beside a visible title.

Never write a bare `<img>` for TMDB artwork. Render it through `MediaImage` (recipe under Components), which draws a `bg-subtle` skeleton with the same box and radius whenever the path is null or the request fails. Give it the class string you would have put on the image; person-info's portrait is the reference (`aspect-[2/3] w-56 flex-none rounded-2xl object-cover object-top shadow-lg sm:w-64 lg:w-72` with `variant="person"`).

### Motion

A global rule in `global.css` transitions `background-color`, `color`, `border-color` and `fill` on every element over 0.25s. Theme switches and hover colour changes animate without any per-component class. Add `transition-all` or `transition-colors` only when you animate something else (Button transitions its gradient).

-  Cards: 250ms `cubic-bezier(0.1, 0.1, 0.6, 0.9)`, `scale(1.15)` plus a 5px poster blur, on hover and `focus-within`.
-  Detail titles (`StickyTitle`): `position: sticky` at `top: calc(var(--navbar-height) + 0.75rem)` with a scroll-driven `animation-timeline: scroll()` over the first 200px that thickens the glass, adds a shadow and steps the type from `display-xs` to `display-md`. The animation sits behind `@supports (animation-timeline: scroll())` and `prefers-reduced-motion: no-preference`; otherwise the resting look stays. Pages without a backdrop (the person page) have no title bar at all.
-  Detail panels (`.text-content`): on hover only the background alpha, border and shadow change, over 0.3s; the text never fades.
-  `prefers-reduced-motion` is honoured by the CastList avatar scale (`motion-reduce:transition-none`) and the sticky title; the card scale and the panel hover still ignore it (see divergences).

### Interactive states

| State    | Recipe                                                                                                                                                                                                                |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover    | Text or border to `accent`. Rows and list items: `bg-subtle` (CSS `[data-hovered]`) or `hover:bg-neutral-inverted/5`                                                                                                  |
| Focus    | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`; in CSS `outline: 2px solid hsl(var(--color-accent) / 1)`, offset `-2px` inside a framed group            |
| Selected | Chips: `border-accent bg-accent/10 text-accent` with `aria-pressed` or `aria-current`. ViewToggle: raised pill (`bg-neutral` segment on a `bg-subtle/70` track, `border-bold/30` ring, soft shadow, icon in `accent`) |
| Disabled | `disabled:opacity-50`                                                                                                                                                                                                 |
| Loading  | `Spinner` (see components)                                                                                                                                                                                            |

---

## 2. Layout

### Building a new page

1. **Route** — add the file under `src/routes/`; the router plugin regenerates `routeTree.gen.ts`. Data comes from query options in `src/services/`, loaded in the route's `loader` and read with `useSuspenseQuery` in the view.
2. **Root** — the view returns `Container` (detail or utility page) or `FlexContainer` (a list that renders `FilmList`). Nothing outside these two picks up dark mode.
3. **Column** — inside `Container`, one `<div className="mx-auto w-full max-w-4xl px-4 py-6 text-copy">`. `Container` centres text, so add `text-left` where prose should align left.
4. **Title** — a detail page opens with `StickyTitle` (recipe under Components) and the `.container-bg` hero (see anatomy). Any other page opens with `<h1 className="text-display-lg">`.
5. **Sections** — headings are `h2 text-display-md` with `mb-3` (or `mt-8` when following content). Group content in `text-content` panels on detail pages; use plain stacking with `mt-4` elsewhere.
6. **Content** — pull recipes from section 3. Lists of titles are the card grid or `FilmTable`, never a new layout. Links to films or series go through `MediaLink`.
7. **States** — an empty state sentence in `text-copy/70`, `Spinner` while waiting, and the error boundary already wraps the route.
8. **Test** — a spec beside the view that renders it with parsed mock data and runs axe (see [TESTING.md](TESTING.md)).

Skeleton of a utility page:

```tsx
<Container>
   <div className="mx-auto w-full max-w-4xl px-4 py-6 text-copy">
      <h1 className="text-display-lg">Discover</h1>
      {/* controls */}
      <p className="mt-4 text-sm tabular-nums text-copy/70" role="status">
         {total.toLocaleString()} results
      </p>
      {/* card grid or FilmTable */}
   </div>
</Container>
```

### Page roots

Every route renders `Navbar` (sticky, `top-0 z-10`) then an `Outlet`. The view chooses one of two roots, both of which apply the theme class:

-  **`Container`** — detail and utility pages (film, series, season, person, favourites, discover). `flex min-h-screen flex-col bg-neutral text-center`.
-  **`FlexContainer`** — list pages (`FilmList`). Adds the responsive page padding (`p-4 sm:p-6 lg:px-10 lg:py-6`) and an inner `flex w-full flex-col gap-4 sm:gap-6` column with no maximum width, so the card grid scales with the page. Never nest it inside `Container`: a page that already has a root renders `<FilmList embedded />`, which emits only the column (`flex w-full flex-col gap-4 px-4 sm:gap-6 sm:px-6 lg:px-10`). Vertical padding and column gap are the same value at every breakpoint on purpose: the first child is the `ViewToggle`, and equal spacing keeps it halfway between the navbar and the first row.

### Page anatomy

**Detail pages.** The film and series pages share one anatomy; the series page swaps the film-only pieces (certification, money, release dates) for its own (year range, seasons and episodes in the meta line, Type, First and Last aired, Episode length, Created by, Network, and a Seasons panel before the cast):

1. `<StickyTitle testId="…-info-title">` — the sticky, scroll-animated title and the page's `h1`; the hero panel repeats the title as an `h2`.
2. `.container-bg` — the hero, `width: 100%` so the backdrop (`baseImagePathPoster`, a fixed cover background) bleeds to the viewport edges, with the poster centred above the panels: a `MediaImage` with `className="mx-auto rounded-[25px] shadow-2xl"` and `fallbackClassName="aspect-[2/3] w-full max-w-[500px]"` so the skeleton matches. The stylesheet declares `--panel-width: min(100% - 2rem, 72rem)` here; every child column (panels, trailer) takes it, so phones keep a 1rem gutter and wide screens stop at 72rem.
3. **Frosted panels** — `.text-content` in `film-info.styles.css`: `width: var(--panel-width)` with `margin-inline: auto`, `bg-neutral` at 0.9 alpha, a 1px `copy/10` border, a `0 8px 32px` shadow and `backdrop-filter: blur(16px) saturate(1.4)`; hover lowers the background to 0.62 and lifts the shadow, nothing else. Each panel is `text-content mt-4 rounded-lg p-5 text-copy sm:p-8` plus the gap of its stack (`gap-6` header, `gap-5` cast, `gap-4` seasons and recommendations); the stylesheet owns no vertical margin, `mt-4` is the only gap between panels. Group content with eyebrow labels and hairline rules (`border-t border-copy/10`), never `<hr>` or `<strong>` rows.
4. **Header panel** — `header flex flex-col items-center gap-2`: `h2 text-display-lg`, the tagline `p font-sans text-lg italic text-copy/70 sm:text-xl`, then the meta line `mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium tabular-nums text-copy/80` (film: year, runtime, `CertificationBadge` at the end; series: `2011–2019`, `8 seasons`, `73 episodes`; `aria-hidden` dots between items). Under it the **score row**, `flex flex-wrap items-center justify-center gap-6`: the `ScoreRing` (recipe below) and the `FavoriteButton` with `className={FAVORITE_ROUND}`, which renders nothing when signed out so the row is just the ring. Then genre badges in `ul flex flex-wrap items-center justify-center gap-2`, the overview as `section mx-auto flex w-full max-w-prose flex-col gap-2 text-left` with an `h3 font-sans EYEBROW` label and `p text-pretty leading-relaxed sm:text-lg`, the facts strip `dl grid grid-cols-2 gap-x-4 gap-y-5 border-y border-copy/10 py-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-12 [&>:last-child:nth-child(odd)]:col-span-2` of `Stat` cells (film: Status, Released, Language, then Budget and Revenue only when TMDB reports a non-zero figure; series: Status with an `In production` `StatNote`, Type, First aired, Last aired, Episode length, Language). The rating is not a cell here any more; it lives in the ring. Series add a second `dl flex flex-wrap justify-center gap-x-10 gap-y-4` of Created by and Network(s). Then production companies as an eyebrow over `p text-sm text-copy/80`, `ExternalLink` pills in `flex flex-wrap justify-center gap-3` (Homepage, `IMDb`), and on the film page the `ReleaseDatesList` disclosure. A trailer, when there is one, follows as `.hero-trailer mt-4 overflow-hidden rounded-lg shadow-lg` (the panel column, `aspect-ratio: 16 / 9`) around an iframe `h-full w-full` titled "<name> trailer" with `allowFullScreen`.
5. **Cast & Crew panel** — `h2 text-display-md`, a crew `dl flex flex-wrap justify-center gap-x-10 gap-y-4` of `Stat` cells (Director or Directors, Writers), then `div flex flex-col gap-4 border-t border-copy/10 pt-5` holding an `h3 font-sans EYEBROW` "Top billed cast" and `CastList`. The series page has no crew, so its panel is `h2 text-display-md` "Cast" over `CastList` with `gap-5`, after a Seasons panel (`h2 text-display-md`, `ul mx-auto grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5` of poster links with a fixed-height `h-11` caption).
6. **Reviews and gallery** — `ReviewList` and `ImageGallery` between the cast and the recommendations (their recipes are not written up yet; see divergences).
7. **Recommendations panel** — `h2 text-display-md` over a `CardGrid` of `FilmCard`s with `showFavorite={false}`.

**Season page** is a detail page without the hero. Its `StickyTitle` takes `as="p"` because the `h1` sits in the header row below. Under the title bar, a back link (`text-sm text-accent hover:underline`, prefixed `←`), then a header row `mt-3 flex flex-col gap-4 sm:flex-row` holding the poster (`mx-auto w-40 flex-none rounded-lg sm:mx-0`) and a `min-w-0 flex-1` text block (`h1 text-display-lg`, meta line `mt-1 text-sm tabular-nums text-copy/70`, overview `mt-3 leading-relaxed`). The season switcher is `<nav aria-label="Seasons" className="mt-6 flex flex-wrap gap-2">` of chips. Episodes follow under `h2 mt-8 text-display-md` as an `ol mt-3 flex flex-col gap-4` of episode rows.

**Profile page** (person) is the pattern for any page **without a backdrop**: no parallax hero, no sticky title bar, no frosted glass and no hover fade on anything (the only hover feedback is the card scale and link colour). It is a column of quiet panels, `mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 text-left text-copy lg:px-0`, and the `h1` carries the `data-testid`. Every block below is a **quiet panel**, `rounded-lg border border-copy/10 bg-subtle/70 p-5 sm:p-8`: the filter panel's surface with the detail-page panel padding. The frosted `.text-content` recipe is for glass over a backdrop and would be invisible on the plain `bg-neutral` page. The column drops its `px-4` gutter from `lg`, where the centring margins already provide one: the panel padding otherwise leaves the credits grid a few pixels short of three cards at the `lg` card minimum.

1. **Header** — the quiet panel plus `flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-10 sm:text-left`: the portrait (recipe under Media and numbers) beside a `flex min-w-0 flex-1 flex-col items-center gap-6 sm:items-start` block. Everything in that block is centred on phones and left-aligned from `sm`.
2. **Name** — an eyebrow `p` (`EYEBROW`, the department) over `h1 text-display-xl`.
3. **Facts** — `dl flex flex-wrap justify-center gap-x-10 gap-y-5 sm:justify-start` of `Stat` cells with `className="sm:items-start"` (Born with an `(age N)` `StatNote`, Died with `(aged N)`, Birthplace). Aliases are an eyebrow `span` over `p text-sm text-copy/80` joined with `·`.
4. **External links** — `ExternalLink` pills in `flex flex-wrap justify-center gap-3 sm:justify-start`.
5. **Sections** (Biography, Known for, Crew) — each a `section` in the quiet panel (no hairline rules between them; the panels separate themselves) with `h2 text-display-md`; counts sit inside the heading as `ml-2 font-sans text-base font-normal tabular-nums text-copy/60`. Biography is `mt-4 max-w-prose whitespace-pre-line text-pretty leading-relaxed sm:text-lg`, clamped with `line-clamp-6` past 600 characters behind a `Read more` button; credit grids use the card grid with `mt-6`. Toggle buttons are `text-sm font-medium text-accent hover:underline`.

**List pages**: a centred `ViewToggle`, then either the card grid or `FilmTable`.

**Filter pages** (discover): `h1 text-display-lg`, then a phone-only disclosure button and the form. The button is a `Chip` with `className="mt-4 sm:hidden"` and no `selected` prop, carries `aria-expanded` and `aria-controls` pointing at the form, reads "Show filters" / "Hide filters", shows the number of non-default filters in a `rounded-full bg-accent/10 px-1.5 text-xs tabular-nums text-accent` pill (with `sr-only` " active" for screen readers) and ends with a `h-3 w-3` chevron that gets `rotate-180` when open. The form is a panel: `<form id="…" aria-label="…" className="relative mx-auto mt-4 w-full flex-col gap-4 rounded-lg border border-copy/10 bg-subtle/70 px-5 pb-5 pt-10 text-left sm:w-fit sm:max-w-full sm:flex-row sm:flex-wrap sm:items-end sm:justify-center sm:gap-x-5 sm:px-7 sm:pb-6">` plus `flex` when open or `hidden sm:flex` when closed, so from `sm` up it is always visible and the state is irrelevant. `bg-subtle/70` on a `border-copy/10` edge is the same surface as the ViewToggle track and the search field, so it holds in both themes; the panel hugs its fields from `sm` up and spans the column on phones, where they stack. Its first child is `<WaveDivider className="rounded-t-lg text-copy/25" />`, the navbar's wave hanging from the panel's top edge in the navbar's grey (the copy token at low alpha, so it is black-on-light and white-on-dark); the panel is `relative` for it, and the extra top padding (`pt-10` against `pb-5` / `sm:pb-6`) is what keeps the labels clear of the 24px wave, so the two read as balanced. Every field is an `EYEBROW` label over a `h-10` control, left-aligned: the selects are `Select` atoms with a width from `sm` (`sm:w-48` genre, `sm:w-40` provider, `sm:w-44` sort, `sm:w-32` year), the keyword box is `KeywordFilter` in the same recipe, and the type switch is `<fieldset className="flex flex-col">` with `<legend className={`${EYEBROW} mb-1.5`}>` over a `flex h-10 items-center gap-2` row of `Chip`s (the `h-10` matches the controls so the wrapping row aligns on its bottom edge). Do not put an `overflow-hidden` on the form: the keyword popover portals inside it. Then the results as `<FilmList list={…} embedded />`, which renders the toggle-and-cards column without `FlexContainer` because `Container` is already the page root here (a nested `FlexContainer` brought a second `min-h-screen`, a second set of vertical padding and the legacy grey background as a band across the page). The header wrapper is `px-4 py-6 sm:px-6 lg:px-10`, matching the column's horizontal padding, and its bottom padding is the only gap between panel and toggle. The empty state is `p px-4 py-10 text-copy/70`. Then the footer, a full-width band with a wave along each edge: `<footer className="mt-auto w-full pt-6 sm:pt-8">` (the padding is the gap from the last card row) around `<div className="relative flex w-full flex-col items-center gap-3 px-4 py-10">`, whose first two children are `<WaveDivider className="text-copy/15" />` and `<WaveDivider edge="bottom" className="text-copy/15" />` and whose `py-10` keeps the text clear of both 24px waves. Inside: the status line (`text-sm tabular-nums text-copy/70`, `role="status"`: result count and page position) above `<nav aria-label="Pagination" className="flex w-full max-w-xs gap-3">` with a secondary "Previous" and a primary "Next" button. The count lives with the pager, not under the filters, and `mt-auto` pins the footer to the bottom of the viewport when the results are short.

### Card grid — `atoms/card-grid`

```tsx
<CardGrid className="mt-6">
   {items.map((item) => (
      <FilmCard key={`${item.media_type}-${item.id}`} {...item} />
   ))}
</CardGrid>
```

The one layout for cards: `FilmList` (every list route and the Discover home), the recommendation panels on the film and series pages, and the person credits all render `CardGrid`. Cards are even, all 2:3, have a minimum width and grow with the page. `.card-grid` is CSS grid with `grid-template-columns: var(--card-columns)` and `gap: var(--card-gap)`; it reads the layout tokens from global.css (see the tokens table) and carries no breakpoints or pixel values of its own, so changing a token in `:root` re-tunes every page at once.

-  **Two floors.** A column is never narrower than `--card-min` (the per-tier floor) nor than `--card-min-share` of the row (22%). The share is what makes big screens show big cards: once four columns are on screen, a fifth can never fit, so extra width goes into the cards. Set the share to 17.5% for a five-column ceiling instead.
-  **`auto-fill`, not `auto-fit`**, so two recommendation cards stay card-sized instead of stretching to half the row each.
-  **A short last row sits flush left.** `1fr` tracks always fill the row; the earlier flexbox version centred it, and that was traded for the minimum size on purpose.
-  Do not write `grid grid-cols-*` for cards. `className` is for spacing around the grid only. Keys combine media type and id because TMDB movie and TV ids overlap.

Sizes to expect: on a 375px phone two cards of about 164px, on a 768px tablet three of about 224px, then four columns from about 1180px that scale with the page: about 316px on a 15" laptop, 436px at 1920 and 596px at 2560. Inside a `max-w-4xl` detail column the grid shows three cards of about 277px. Below 1180px cards widen until one more column fits and then snap back toward the floor; above it they only grow.

### Responsive rules

Mobile first; the breakpoints in use are `sm` and `lg` (nothing uses `md`, `xl` or `2xl`). In CSS files write media queries with Tailwind's `screen()` helper, `@media screen(sm)` / `@media screen(lg)`, never a pixel value: the PostCSS pipeline resolves them from the Tailwind theme at build time, so a stylesheet and the `sm:` / `lg:` utilities cannot disagree. It can be combined with other features (`@media screen(lg) and (max-width: 1535px)` is valid). The two exceptions are `FilmTable`'s `max-width: 639px`, because `screen()` only emits min-width queries, and the legacy `600px` query in `film-info.styles.css` listed under divergences. The desktop tier targets a 15" laptop, about 1440 CSS pixels wide, and must still hold at 1024. Card grids do not pick a column count per tier; they fit as many `--card-min` columns as the row allows. Side-by-side rows are `flex flex-col … sm:flex-row` with the image `flex-none` and the text `min-w-0 flex-1` so long titles truncate instead of overflowing. Detail pages must stack on phones and never scroll horizontally. Tables are the exception: `FilmTable` wraps in a `.film-table__scroll` overflow container and tightens type and padding under 640px so four columns fit.

---

## 3. Components

Recipes as they exist in code. Copy the class strings; do not approximate them.

Recipes: [Navbar](#navbar--layoutnavbar), [NavMenu](#navmenu--layoutnavbarnav-menu), [Button](#button--atomsbutton), [Input](#input--atomsinput), [Form](#form--auth), [Select](#select), [Chip](#chip--segmented-choice), [Badge and pills](#badge-and-pills), [StickyTitle](#stickytitle--atomssticky-title), [Eyebrow and Stat](#eyebrow-and-stat--atomsstat), [ScoreRing](#scorering--atomsscore-ring), [MediaImage](#mediaimage--atomsmedia-image), [Disclosure](#disclosure--release-dates), [Episode row](#episode-row--viewsseason-info), [Modal](#modal--atomsmodal), [Card and FilmCard](#card-and-filmcard--atomscard-film-card), [FilmTable](#filmtable--film-table), [SortableHeader](#sortableheader--atomssortable-header), [ViewToggle](#viewtoggle--view-toggle), [Search combobox](#search-combobox--layoutnavbarsearch-input), [Links](#links--atomslink), [FavoriteButton](#favoritebutton--favorite-button), [CastList](#castlist--cast-list), [Spinner](#spinner--atomsspinner), [Empty and error states](#empty-and-error-states).

### Navbar — `layout/navbar`

The one fixed element on every page. Root: `navbar sticky top-0 z-10 m-auto flex flex-col items-center border-b-2 border-solid border-secondary-background-color bg-primary-background-color p-4` plus the theme class; `navbar.styles.css` adds a `0 3px 3px` shadow in the secondary colour; the first child is a `WaveDivider` (recipe under Components), which the stylesheet tints with the legacy tertiary colour through `.navbar .wave-divider { color: … }`. Inside: one wrapping row `flex w-full flex-wrap items-start justify-between gap-2 sm:items-center lg:flex-nowrap lg:gap-6` holding `<nav aria-label="Browse" className="flex items-center gap-4 sm:gap-6">` (a `NavLink` and two `NavMenu` groups), the search combobox in a wrapper `order-3 flex basis-full justify-center lg:order-2 lg:min-w-0 lg:flex-1 lg:basis-0`, and `order-2 flex items-center gap-1 lg:order-3` of icon buttons (`ThemeToggleIcon`, `LoginIcon`, both on `NavIconButton`, recipe below). Up to `lg` the search wraps onto a full-width second line under the links and icons; from `lg` the row stops wrapping and the search sits between them, so the bar is a single line about 78px tall instead of 114px. The `order` utilities keep the DOM in reading order (links, search, icons) at every width. Nothing else goes in the navbar; add sections through `NavMenu`. A `ResizeObserver` on the root writes its rendered height to `--navbar-height` on `<html>` (constant `NAVBAR_HEIGHT_VAR`) so `StickyTitle` can sit under it; anything else that must clear the navbar reads the same variable.

### NavMenu — `layout/navbar/nav-menu`

`react-aria-components` `MenuTrigger` + `Popover` + `Menu`, BEM-styled in `nav-menu.styles.css`; the root `.nav-menu` carries the theme class and is the popover's portal container, so the tokens flip inside it.

-  **Trigger** — `nav-menu__trigger`: borderless, `font-display 1.125rem/500`, `letter-spacing 0.025em`, `text-copy`; `:hover`, `[data-pressed]` and `[aria-expanded='true']` turn it `accent`. The caret is a `0.75em` inline SVG chevron (`stroke: currentColor`) at `opacity 0.7` that rotates 180° and goes fully opaque while the menu is open. Focus: 2px accent outline, `4px` offset.
-  **Popover** — `placement="bottom start"`, `offset={10}`. Frosted like the detail panels: `min-width 12rem`, `padding 0.375rem`, `border-radius 0.75rem`, `1px` border at `copy/10`, `bg-neutral` at `0.88` over `backdrop-filter: blur(16px) saturate(1.4)`, shadow `0 12px 32px rgb(0 0 0 / .3)` plus a `1px` inset highlight. Enters with a 160ms fade from `translateY(-6px) scale(.98)` and exits in 120ms via `[data-entering]` / `[data-exiting]`.
-  **Items** — the `Menu` is a column with a `0.125rem` gap; each `MenuItem` is `flex justify-between`, `0.5rem 0.75rem` padding, `border-radius 0.5rem`, `font-display 0.9375rem/500`. `[data-hovered]` and `[data-focused]` set a `neutral-inverted/6` wash and `accent` text and slide in a trailing `→` (`content: '→' / ''`, so it stays out of the accessible name). `[data-focus-visible]` adds a 2px accent outline inset by `2px`.
-  **Reduced motion** — the enter/exit animation and the caret, row and arrow transitions are disabled under `prefers-reduced-motion: reduce`.

### NavIconButton — `layout/navbar/navbar-icons/nav-icon-button`

The round icon-only control in the navbar's utility corner; `ThemeToggleIcon` and `LoginIcon` are the two uses. `<button type="button" className="nav-icon-button" aria-label={label} title={label}>` with the glyph as children; `label` is the whole accessible name (there is no visible text) and doubles as the tooltip. Styles in `nav-icon-button.styles.css`.

-  **Pill** — `2.5rem` circle, `display: grid; place-items: center`, `1px` border at `border-bold/35` on `bg-subtle/70`: the search field's surface, so the two sit as a set from `lg`. Glyph colour `text-copy/75`. `:hover` lifts it to `bg-neutral`, `border-bold/60`, a `0 1px 3px` 18 % black shadow and an `accent` glyph (the ViewToggle's raised segment); `:active` scales to `0.94`. Focus: the standard 2px accent outline, `2px` offset. Transitions of 150ms on colour, border, shadow and transform, all off under `prefers-reduced-motion`.
-  **Glyph** — `nav-icon-button__icon`: `1.25rem` square, `fill: none`, `stroke: currentColor` at `1.75`, round caps and joins, `grid-area: 1 / 1` so a control can stack two glyphs in the same cell. Give a body path `nav-icon-button__tint` for the `accent/20` wash (the FavoriteButton's unfilled-heart tint). Mark every SVG `aria-hidden`.
-  **ThemeToggleIcon** — shows the mode a click moves to: a sun in dark mode, a moon with a sparkle in light. Label `Switch to light mode` / `Switch to dark mode`; the button carries `data-theme` and both glyphs stay mounted, the hidden one at `opacity 0` turned a quarter (`rotate(90deg)` sun, `rotate(-90deg)` moon) and `scale(0.5)`, so a click spins one out and the other in over 250ms (`theme-toggle-icon.styles.css`).
-  **LoginIcon** — an outline figure labelled `Sign in`; signed in it is `Sign out`, the button carries `data-signed-in`, head and shoulders get the tint, and a `0.375rem` accent dot (`login-icon__status`, `aria-hidden`) sits `0.5rem` in from the pill's top-right as a presence light. It renders `AuthModal` as its sibling.

### Button — `atoms/button`

Outlined, never filled. Two variants, `className` defaults to `w-full`, `type` defaults to `button`.

```
primary:   border-2 border-solid border-copy bg-gradient-to-b from-transparent to-transparent py-1
           font-medium tracking-wide text-copy transition-all
           hover:border-accent hover:from-copy/5 hover:to-copy/20 hover:text-accent disabled:opacity-50
secondary: border border-solid border-copy/20 … text-copy/60
           hover:border-accent/40 hover:from-copy/0 hover:to-copy/10 hover:text-accent/80 disabled:opacity-50
```

Primary for the main action of a view, secondary beside it (pagination uses one of each).

### Input — `atoms/input`

A labelled block, not a bare input: `flex w-full flex-col gap-1` → `<label className="text-sm font-medium text-copy">` → the control → optional `<span className="text-xs text-red-500">`.

```
w-full border-2 border-solid bg-neutral px-2 py-1 text-copy
(placeholder-text-copy is also in the string but compiles to nothing; see divergences)
border-secondary-background-color   (or border-red-500 when `error` is set)
```

No border radius. Always pass `id` so the label associates.

### Form — `auth/*`

Every auth form is `<form className="flex flex-col gap-4">` of `Input`s, an optional `<p className="text-sm text-red-500">` for the server error, a primary `Button` of type `submit`, and a footer `<div className="flex flex-col items-center gap-1 text-sm text-copy">` whose links are `text-accent hover:underline`. Filter forms lay out horizontally instead (see Filter pages).

### Select — `atoms/select`

A labelled native `<select>` for filter rows: `flex flex-col gap-1.5 text-left` → `<label className={EYEBROW}>` → a `relative` wrapper holding the control and a `pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2` chevron in `text-copy/60` (`stroke-current`, `aria-hidden`). Pass `id` and `label`; `className` goes on the wrapper (a `sm:w-*`), every other prop reaches the `<select>`. The control is `appearance-none pr-9` on top of the shared **filter-control recipe**, exported as `FIELD_CONTROL`:

```
h-10 w-full rounded-md border border-solid border-bold/40 bg-neutral px-3 text-sm text-copy shadow-sm
hover:border-bold/70
focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
```

One pixel of `bold` border on a `neutral` fill is the navbar search field's language, so the controls lift off a `bg-subtle` panel in both themes; `h-10` is what lets a wrapping filter row align on its bottom edge. Text inputs that sit beside selects (`KeywordFilter`) reuse `FIELD_CONTROL` plus `placeholder:text-copy/50` (the `placeholder:` variant works without any theme wiring). Auth forms keep the 2px `Input` atom.

### Chip — `atoms/chip`

A pill `<button type="button">` for a segmented choice. With `selected` it is a toggle and carries `aria-pressed` (the discover Films / Series switch); without it, a plain action chip that takes its own aria props (the phone-only "Show filters" disclosure, with `aria-expanded` and `aria-controls`). `className` is appended.

```
base:     inline-flex items-center gap-2 rounded-full border border-solid px-3.5 py-1.5 text-sm font-medium
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
selected: border-accent bg-accent/10 text-accent
idle:     border-copy/30 text-copy hover:border-accent hover:text-accent
```

The season picker still hand-rolls the same recipe on links with `aria-current="page"` (see divergences). For a two-way layout switch use `ViewToggle` instead; it is a proper radiogroup.

### Badge and pills

Static labels, never interactive.

-  **Badge** (genres): `rounded-full border border-copy/15 bg-neutral-inverted/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider`, an outline that reads on either theme. Rows of badges are `flex flex-wrap items-center justify-center gap-2` (a `ul` with `aria-label`). The filled variant `rounded-full bg-primary-background-color px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-copy/70` survives only in the favourites table (see divergences).
-  **Age rating** (`CertificationBadge`): `rounded-md border border-copy/40 px-2 py-0.5 text-sm font-semibold tabular-nums`, with the region as `<span className="ml-1 text-xs font-normal opacity-70">`.
-  **Inline code-like value** (a certification inside a row): `rounded border border-copy/30 px-1 text-xs tabular-nums`.

### WaveDivider — `atoms/wave-divider`

The decorative wave along the edge of the navbar, the discover filter panel and footer, and the search popover: an `aria-hidden` wrapper (`wave-divider`, `absolute top-0 left-0 w-full overflow-hidden pointer-events-none`) around a `preserveAspectRatio="none"` SVG drawn at `calc(168% + 1.3px)` wide and `--wave-height` (24px) tall, so the three stacked paths (opacity 1, .25, .15) stretch into slow curves. `edge="bottom"` adds `wave-divider--bottom`, which pins it to the bottom and rotates the SVG 180°, so a band's two edges show different curves. The paths fill with `currentColor`, and the tint is always a grey from the copy token so it is black-on-light and white-on-dark like the navbar's own greys: `text-copy/25` on the filter panel, `text-copy/15` on the footer band, `text-copy/10` in the search popover, and `.navbar .wave-divider` keeps the legacy tertiary hex. Do not tint it with the accent. The parent must be `relative` and pad that edge by at least the wave's height; add `rounded-t-lg` to the wave's `className` when the panel has rounded corners and no overflow clipping of its own. A stylesheet may lower `--wave-height` for a tight box (`14px` in the search popover). It is the only place the wave paths live; do not paste the SVG again.

### StickyTitle — `atoms/sticky-title`

The title bar that opens every detail page (film, series, season) and stays in view under the navbar while the page scrolls.

```tsx
<StickyTitle testId="film-info-title">{filmInfo.title}</StickyTitle>
<StickyTitle as="p" testId="season-info-title">
   {seriesInfo.name} · {season.name}
</StickyTitle>
```

-  **Element** — `h1` by default, the page's only top heading; `as="p"` on a page whose `h1` is already in the body. Classes: `sticky-title text-balance font-display text-display-xs font-semibold text-copy`, with the visible text in a `<span>` carrying `data-testid`.
-  **Position** (`sticky-title.styles.css`) — `position: sticky; top: calc(var(--navbar-height, 0px) + 0.75rem); z-index: 1`, `align-self: center; width: fit-content; max-width: calc(100% - 2rem); margin: 0.75rem auto 0`. The z-index is required: the `.text-content` panels' `backdrop-filter` makes each a stacking context that would otherwise paint over the title. Stay below the navbar's `z-10`.
-  **Surface** — the panel glass recipe as a pill: `padding 0.5rem 1rem`, `border-radius 9999px`, `1px` border at `copy/10`, `bg-neutral` at `0.6` over `backdrop-filter: blur(16px) saturate(1.4)`. The settle keyframe ends at `bg-neutral` `0.9`, border `copy/20`, `padding 0.625rem 1.5rem`, shadow `0 8px 32px rgb(0 0 0 / 0.25)` and `theme('fontSize.display-md')` with its line-height and tracking; the weight never changes.
-  **Motion** — see Foundations › Motion. The animation is scroll-driven over the first 200px, gated behind `@supports` and `prefers-reduced-motion: no-preference`.

### Eyebrow and Stat — `atoms/stat`

The label-over-value pattern used by the film and person pages instead of `Label: value` rows and `<hr>` dividers.

-  **`EYEBROW`** (exported class string): `text-xs font-semibold uppercase tracking-wider text-copy/60`. Use it for facts labels, crew roles, a department, and small section captions; add `font-sans` when it sits on an `h3`, which otherwise inherits the display face.
-  **`Stat`** — one cell of a facts `<dl>`: `div flex flex-col items-center gap-1` holding an eyebrow `dt` and `dd font-display text-lg font-semibold tabular-nums`. Lay the `dl` out as the detail-page strip, `grid grid-cols-2 gap-x-4 gap-y-5 border-y border-copy/10 py-5 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-12 [&>:last-child:nth-child(odd)]:col-span-2` (two columns on phones with an odd last cell spanning both so it centres; a centred wrapping row from `sm`, which never leaves a hole whatever the count), or as a wrapping row `flex flex-wrap justify-center gap-x-10 gap-y-4` (crew, creators). Pass `className="sm:items-start"` for a left-aligned column.
-  **`StatNote`** — a secondary line under the value: `block font-sans text-xs font-normal text-copy/60` (an `In production` flag, an age).

### ScoreRing — `atoms/score-ring`

The headline number of a detail page: the TMDB average as a ring that fills to the score, with the number inside and the label beside it. It replaced the small Rating `Stat` because a score is the first thing a visitor looks for.

```tsx
<ScoreRing score={filmInfo.vote_average} votes={filmInfo.vote_count} />
```

-  **Layout** — `flex items-center gap-4 text-left` (`data-testid="score-ring"`): a `relative h-24 w-24 flex-none sm:h-28 sm:w-28` ring, then a `flex flex-col gap-1` stack of the eyebrow (`EYEBROW`, default `User score`, overridable through `label`) and `text-sm tabular-nums text-copy/70` for `9,491 votes`.
-  **Ring** — an `aria-hidden` SVG (`viewBox 0 0 100 100`, `h-full w-full -rotate-90` so the arc starts at twelve o'clock) with two `r="44"`, `strokeWidth="6"`, `pathLength="100"` circles: the track `fill-none stroke-copy/10` and the arc `score-ring__arc fill-none stroke-accent` with `strokeLinecap="round"`, `strokeDasharray="100"` and `strokeDashoffset={100 - score * 10}`. `pathLength` normalises the circumference to 100, so the offset is just the missing percentage. The arc is the one place the accent is used as a data colour; there is no good-to-bad scale on purpose.
-  **Number** — an absolutely positioned `p absolute inset-0 flex flex-col items-center justify-center gap-0.5 font-display font-semibold tabular-nums` holding `text-display-lg leading-none` for `score.toFixed(1)` over `font-sans text-xs font-medium text-copy/60` for `/ 10`.
-  **Unrated** — when the score is missing or `0`, the arc is not rendered, the number reads `NR` in `text-display-md text-copy/60` and the vote line reads `Not yet rated`. Never show `0.0`.
-  **Motion** (`score-ring.styles.css`) — `.score-ring__arc` carries `filter: drop-shadow(0 0 8px hsl(var(--color-accent) / 0.45))` and, under `prefers-reduced-motion: no-preference`, `animation: score-ring-fill 1.1s cubic-bezier(0.22, 1, 0.36, 1) both`. The keyframe declares only `from { stroke-dashoffset: 100 }`, so the browser fills `to` with the inline value and the ring sweeps from empty to the score once on mount without the stylesheet knowing the number.

### MediaImage — `atoms/media-image`

Every TMDB picture (posters, stills, thumbnails, portraits, avatars) renders through `MediaImage`, never a bare `<img>`. It takes the TMDB `path`, an `alt` (empty when a caption already names the item) and the same `className` you would put on the image. When the path is null or the request fails, a skeleton takes the image's place:

```
skeleton: flex items-center justify-center bg-subtle text-copy/30  + className + fallbackClassName
glyph:    h-auto w-1/3 max-w-12 fill-none stroke-current
          variant="picture" (default) a framed-picture outline for posters and stills
          variant="person"            a head-and-shoulders silhouette for portraits and avatars
a11y:     role="img" aria-label={alt} when alt is set; aria-hidden when it is empty
```

`bg-subtle` and `text-copy` swap under `.dark`, so the block matches the page in both themes. Pass `fallbackClassName` for an aspect ratio (`aspect-[1/1.5]` posters, `aspect-video` stills) whenever the image itself sizes from its natural dimensions, otherwise the skeleton collapses to zero height. The image loads from `baseImagePath` (w500) unless a `basePath` from `services/config` is passed; the search rows pass `baseImagePathThumb`.

### Disclosure — `release-dates`

A native `<details>` for secondary data that would otherwise lengthen the page:

```
details: mt-3 rounded-md border border-copy/20 p-2
summary: cursor-pointer select-none font-semibold
count:   <span className="ml-2 text-sm font-normal opacity-70">(12)</span>
list:    mt-2 flex flex-col divide-y divide-copy/10 text-sm
row:     flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-1.5
         first cell min-w-[8rem] font-medium; values opacity-80; dates tabular-nums
note:    w-full text-xs italic opacity-60 sm:w-auto   (wraps to its own line on phones)
```

### Episode row — `views/season-info`

A media row for items with a wide image: `flex flex-col gap-3 rounded-lg bg-tertiary-background-color p-3 sm:flex-row`. Still: a `MediaImage` with `aspect-video w-full flex-none rounded-md object-cover sm:w-56`. Text: `min-w-0 flex-1` with an `h3 font-display text-base font-semibold leading-tight` whose number is `<span className="mr-2 tabular-nums opacity-60">`, a meta line `mt-1 text-xs tabular-nums text-copy/70`, and the overview `mt-2 text-sm leading-relaxed`. The seasons list on the series page is the compact version: a `MediaImage` thumbnail `h-16 w-11 flex-none rounded object-cover` beside a `font-display text-sm font-semibold leading-tight` name.

### Modal — `atoms/modal`

A native `<dialog>` stretched to the viewport and made transparent, with the visible panel inside:

```
dialog: m-0 h-screen max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-black/60
frame:  flex min-h-screen items-center justify-center p-4
panel:  relative w-full max-w-md rounded-lg border-2 border-solid border-secondary-background-color
        bg-neutral p-6 text-copy shadow-2xl
close:  absolute right-3 top-3 rounded p-1 text-copy transition-colors hover:text-accent
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
title:  h2#modal-title  mb-4 text-display-sm
```

Open and close through the `isOpen` prop; the component calls `showModal()` and wires `cancel` (Escape) and backdrop clicks to `onClose`.

### Card and FilmCard — `atoms/card`, `film-card`

`Card` is the hover shell (`custom-card w-full`, CSS in `card.styles.css`): relative, hidden overflow, `10px` radius, and on hover or `focus-within` it scales to 1.15, blurs the image and fades in `.content`, a `rgba(0,0,0,.72)` overlay with white text.

`FilmCard` fills it: a `MediaImage` poster (`aspect-[2/3] w-full rounded-md object-cover object-center`, `alt={title}`; the skeleton gets the same classes so a missing poster keeps its slot). Every card is the same 2:3 crop; TMDB posters are all about that ratio, and a masonry of natural heights was tried and dropped because it only drifted out of line. Then `.content` holding a `MediaLink` with the `h2` title (`mb-2 text-center text-base font-semibold leading-tight sm:text-lg`) and the overview (`line-clamp-4 text-center text-xs leading-snug text-white/85 sm:line-clamp-6 sm:text-sm`), and a `FavoriteButton` **beside** the link, not inside it. The link covers the whole card through a stretched `::after`; the button sits above it with `z-index: 1`. Never nest a control inside an `<a>`.

### FilmTable — `film-table`

The table layout for any list of titles: TanStack Table with `SortableHeader` cells, styled in `film-table.styles.css` under the `film-table__*` block. It already handles zebra rows (`bg-subtle`), the `border-bold` header rule, tabular numerals, row-link hover to `accent`, horizontal overflow and the sub-640px tightening. Reuse it instead of writing `<table>` markup; only its column definitions are per page.

### SortableHeader — `atoms/sortable-header`

A `<th aria-sort="…">` whose content is a reset `<button>` plus an `aria-hidden` sort glyph. Styles in `sortable-header.styles.css`; the focus ring is the standard 2px accent outline.

### ViewToggle — `view-toggle`

`react-aria-components` `ToggleButtonGroup` in single-selection mode, so it is a radiogroup with arrow-key navigation. Each `ToggleButton` holds an `aria-hidden` 16-unit SVG glyph (grid for Cards, rows for Table) followed by the label, which carries the accessible name.

Styles in `view-toggle.styles.css`, a segmented pill in the same 1px-border-plus-shadow language as the nav menu and search popover:

-  **Track** — `inline-flex`, `padding: 0.25rem`, `gap: 0.125rem`, `border-radius: 9999px`, `1px solid border-bold/35`, background `bg-subtle/70`, `inset 0 1px 2px` shadow at 6 % black.
-  **Segment** — `inline-flex items-center gap-0.375rem`, `padding: 0.375rem 0.875rem`, fully rounded, transparent, `font-display` 0.875rem/500 with `0.02em` tracking, text `copy/70`. Icon `0.875rem` square, `fill: currentColor`. 150 ms transition on background, colour and shadow.
-  **`[data-hovered]`** — text to `copy` (no background change; the track already reads as a surface).
-  **`[data-selected]`** — background `bg-neutral`, text `copy`, shadow `0 1px 3px` at 18 % black plus a `0 0 0 1px border-bold/30` ring; the icon fills with `accent`.
-  **`[data-focus-visible]`** — `2px` accent outline, `2px` offset (outside the pill, unlike the inset outline on chips).

Copy this pairing of states for any future segmented control built on react-aria.

### Search combobox — `layout/navbar/search-input`

`react-aria-components` `ComboBox` with a visually hidden label, a leading search icon, an in-field spinner and clear button, and a popover portalled into its own root (so it rides with the sticky navbar). Styles in `search-input.styles.css` under `search-combobox__*`. It applies the theme class to its own root because the popover renders outside the page roots. The clear button is a plain `<button>`, not a react-aria `Button`, which inside `ComboBox` would become the popover trigger.

Sizing is in three tiers, mobile-first. react-aria clamps a portalled popover inside its container's edges, so the root, not the field, decides how wide the panel can be: the root is `max-width: 40rem` (the field's width) and grows to `52rem` from `lg`, with the field kept at `max-width: 40rem` and centred inside it (`align-items: center`). The popover is `var(--trigger-width)` wide up to `lg` and `width: 100%` of the root from `lg`, centred under the field by `placement="bottom"` (the default `bottom start` would left-align it). react-aria also writes an inline `max-height` on the popover equal to the free space below the field, which beats any stylesheet value, so the height cap sits on the list, which is the scroll container: `min(30rem, 62vh)` on phones, `min(32rem, 70vh)` from `sm`, `min(44rem, 76vh)` from `lg`.

Scrim: while results are open the root carries react-aria's `data-open`, and `.search-combobox[data-open]::before` paints a fixed `rgb(0 0 0 / 0.4)` layer over the page, fading in over 180 ms unless the visitor prefers reduced motion. It sits in the navbar's stacking context at `z-index: 1`, under the field (`z-index: 2`) and the popover (react-aria's inline z-index), and clicking it blurs the field, which closes the results.

Field: the input is a pill (`border-radius: 9999px`, `min-height: 2.75rem`, `1rem` text, `1.125rem` from `sm`) filled `bg-subtle/70` with a `border-bold/40` 1px border, going `bg-neutral` with an `accent` border plus the standard 2px `accent` outline on focus. The icon sits at `left: 1rem` in `text-copy/55` and turns `accent` on `:focus-within`.

Popover: pass `containerPadding={0}` and `offset={6}`, because inside a positioned portal container react-aria's default 12px boundary padding shifts the panel sideways off the field. It is a frosted panel in the detail-page language: `bg-neutral/85`, `backdrop-filter: blur(16px) saturate(1.4)`, `text-copy/10` 1px border, `border-radius: 1rem`, `0 8px 32px` shadow, `0.375rem` inner padding (`0.5rem` from `lg`). Its first child is `<WaveDivider className="text-copy/10" />`, sized down to `--wave-height: 14px` by `.search-combobox__popover .wave-divider` so it stays in the padding band above the first row; the popover's own overflow clipping rounds its corners.

Row (`search-combobox__item`, `rounded 0.625rem`, `bg-subtle` on `[data-focused]`/`[data-hovered]`, 2px inset `accent` outline on `[data-focus-visible]`): an `aspect-ratio: 2 / 3` poster through `MediaImage` with `basePath={baseImagePathThumb}` (w92) and an empty `alt`; then a body column of title (`font-display`/600, turns `accent` when the row is focused or hovered, single line with ellipsis), a meta line (`0.75rem text-copy/70 tabular-nums`: uppercase `search-combobox__item-type` pill in `border-bold/50` reading Film or Series, the year, and `★ 8.4` when the title has votes), and an overview at `text-copy/60`. Per tier: phones have `0.375rem 0.5rem` padding, a `2.25rem` poster, a `0.9375rem` title and no overview; from `sm` padding `0.5rem 0.625rem`, poster `2.75rem`, title `1rem`, a one-line ellipsised overview at `0.8125rem`; from `lg` padding `0.625rem 0.875rem`, poster `3.25rem`, title `1.0625rem`, meta `0.8125rem` and a two-line clamped overview at `0.875rem`. The empty state (`search-combobox__empty`, centred `0.9375rem text-copy/70`) reads a hint when nothing is typed, “Searching…” until the debounced query settles, then “No films or series found”.

### Keyword filter — `keyword-filter`

The same `ComboBox` pattern inside the discover filter form, styled to sit beside the `Select` atoms: the root is `flex flex-col gap-1.5 text-left`, the label is `EYEBROW`, the input is `FIELD_CONTROL` plus `pr-10 placeholder:text-copy/50`, and the clear button is a plain `✕` in a `grid h-7 w-7 place-items-center rounded-full text-copy/60` hit area at `right-1.5` that goes `bg-subtle text-accent` on hover. The popover portals into the component root so it inherits the page's `dark` class. `keyword-filter__item` rows are `0.875rem`, `bg-subtle` on focus and hover, `accent`/500 when `[data-selected]`. Both the text and the selection are controlled, so react-aria does not restore the text on blur; the component does, from the current keyword's name.

### Links — `atoms/link`

-  **`NavLink`** puts colour on a `<span>` inside the router `Link` — `font-display text-lg font-medium tracking-wide text-copy hover:text-accent` — because `index.css` forces `a, a:visited { color: black }` and a colour on the anchor itself would not survive `:visited` in dark mode.
-  **`MediaLink`** chooses `/film/:id` or `/tv/:id` by media type; always use it for detail links.
-  **Internal text links** are `text-accent hover:underline`; back links are `text-sm text-accent hover:underline` prefixed with `←`.
-  **`ExternalLink`** (homepage, IMDb) is a pill: `group rounded-full border border-copy/30 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent` with `target="_blank" rel="noreferrer"`, the label in `<span className="text-copy group-hover:text-accent">` (same `:visited` reason as NavLink) and a trailing `↗` that is `aria-hidden`. Label it `IMDb`, not `IMDB`. The colour difference from internal links is deliberate: accent means "stays in the app".
-  **Links that inherit** (a whole card or cast column) are `text-inherit hover:text-accent`.

### FavoriteButton — `favorite-button`

Icon-only `<button>` with `aria-label` "Add to favorites" / "Remove from favorites", `cursor-pointer disabled:opacity-50` plus whatever `className` the parent passes. The heart is a `h-7 w-7` SVG: `fill-accent stroke-accent` when favourited, `fill-accent/20 stroke-accent` when not. Beside the score ring on the detail pages it takes the exported `FAVORITE_ROUND` class: `flex rounded-full border border-copy/15 bg-neutral-inverted/5 p-3 transition-colors hover:border-accent` plus the accent focus outline, the genre badge's outline as a 52px round button. The navbar icons draw their glyph in `currentColor` and take the `accent/20` body from `NavIconButton`'s `__tint` class instead.

### CastList — `cast-list`

`mx-auto flex flex-wrap justify-center gap-4`, with an inline `maxWidth` of `perRow × 8.5rem` so a long cast splits into two even rows. Each member is a `Link` with `group flex w-[7.5rem] flex-col items-center gap-1.5 text-center text-inherit hover:text-accent`, holding a `MediaImage` avatar (`variant="person"`, `aspect-[3/4] w-full rounded-2xl object-cover object-top transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none`), a `relative z-10 font-display text-sm font-semibold leading-tight` name and a `relative z-10 text-xs leading-tight text-copy/70` role.

### Spinner — `atoms/spinner`

Five bouncing bars in `spinner.styles.css`, coloured with `--primary-background-color`, centred with `margin: 300px auto`. Rendered wherever a view waits on data.

### Empty and error states

Empty results: `<p className="px-4 text-copy/70">` (or `mt-2 opacity-70` inside a themed block) with a sentence that suggests the next step ("Nothing matches those filters. Try a different genre or year."). Error and not-found views: a `p mb-8 p-4 font-display text-display-md font-semibold text-copy` message followed by a single outlined action.

---

## 4. Patterns

### Tailwind first, CSS file when it earns it

Write utilities in `className`. Create a co-located `<name>.styles.css`, imported as the first line of the component, when you need any of: pseudo-elements, keyframes or scroll-driven animation, react-aria data-attribute states, or a selector tree that would make the JSX unreadable. Name classes `block__element` with the component name as the block (`film-table__cell`, `search-combobox__item`). Reference tokens as `hsl(var(--color-x) / 1)`; the alpha slot is there so `/ 0.5` works too. Never write hex in a component stylesheet, and never let a CSS rule silently override a utility on the same element.

### Complex widgets use react-aria-components

Anything with selection, keyboard or popover semantics — comboboxes, toggle groups, and future menus or dialogs — is built on `react-aria-components` and styled through its data attributes: `[data-hovered]`, `[data-focused]`, `[data-focus-visible]`, `[data-selected]`, `[data-pressed]`. This is what gives ViewToggle its radiogroup role and the search box its listbox for free.

### Extending the theme

If the utility you need does not exist, the answer is never an arbitrary value (`text-[#0ea5e9]`, `bg-[hsl(var(--color-accent))]`) or a raw palette class. Add the token to the relevant map in [tailwind.config.ts](../tailwind.config.ts) so it gets the `<alpha-value>` slot and shows up for every theme, then add the row to the tables in this guide. New fonts, weights and sizes go through `fontFamily`, `fontWeight` and `fontSize` the same way. Arbitrary values are fine for one-off geometry (`aspect-[2/3]`, `min-w-[8rem]`, `rounded-[25px]`).

### Class strings

Prettier's Tailwind plugin sorts classes on commit; do not hand-order them. If a class stays at the front of the string after formatting, the plugin does not know it and it is probably not a real utility. Build conditional classes with a template literal whose static part comes first and a ternary for the variant, as the chips do. Components accept an optional `className` and append it: `` `${base} ${className}`.trim() ``.

### Accessibility baseline

The jsx-a11y rules in `eslint.config.js` are mostly errors and block commits. Beyond them, the conventions in use: `aria-label` on every `<nav>` and on `role="group"` wrappers; `<fieldset>` + `<legend>` for a labelled set of chips; `aria-pressed` on toggle buttons and `aria-current="page"` on the active link in a set; `aria-sort` on sortable headers; `role="status"` on live result counts; visually hidden labels via the `.search-combobox__label` clip pattern; `alt` equal to the title on posters and empty on decorative images; `aria-hidden` on placeholder glyphs; interactive controls never inside an anchor.

### Media and numbers

Posters: `aspect-[2/3] w-full rounded-md object-cover object-center`; the hero poster on the detail pages is `mx-auto rounded-[25px] shadow-2xl` at its natural w500 width. Stills: `aspect-video … rounded-md object-cover`. Cast avatars: `aspect-[3/4] w-full rounded-2xl object-cover object-top`; the person portrait is `aspect-[2/3] rounded-2xl object-cover object-top shadow-lg`. People are rounded rectangles, not circles. Thumbnails in rows: `h-16 w-11 flex-none rounded object-cover`. Sizes and placeholders are in [Images](#images). Counts go through `toLocaleString()` and sit in `tabular-nums`.

---

## 5. Known divergences

Places where the code does not yet follow this guide. Fixing them is tracked in the roadmap.

-  **Input placeholder** — `placeholder-text-copy` compiles to nothing because no map feeds `placeholderColor`. Wire `placeholderColor: textColors` in the config and use `placeholder-copy/50`.
-  **Season picker** (`views/season-info`) hand-rolls the Chip recipe on links with `aria-current="page"`; `Chip` renders a `<button>`, so it needs a link variant (or an `as` prop) before the picker can adopt it.
-  **Favourites** hand-rolls a `<table>` (`py-8` column, `border-bold/30` rows) instead of rendering `FilmTable`, and its media-type badge keeps the filled `bg-primary-background-color` look instead of the outline badge.
-  **Error and not-found views** style their action with `border-blue-700 hover:bg-blue-900 text-slate-300` instead of the Button primary recipe or the accent token.
-  **ReviewList and ImageGallery** ship on the film and series pages but have no recipe in this guide yet.
-  **FlexContainer** sets both `bg-neutral` and `bg-primary-background-color` on the same element; one must go.
-  **`opacity-*` on coloured text** appears where `text-copy/N` should be used (favourites `text-copy opacity-60`, season meta). Reserve `opacity-*` for inherited colour.
-  **Spinner** uses the legacy primary variable and a fixed `300px` margin rather than a token and flex centring.
-  **Legacy hex variables** still define control borders and panel backgrounds. They need semantic tokens (a `border-subtle` and a panel background) before they can be retired.
-  **Reduced motion** is honoured only by the CastList avatar scale and the sticky title; the card scale and the panel hover still need a `prefers-reduced-motion` guard.
