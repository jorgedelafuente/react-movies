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

| Token                         | Light   | Dark    | Tailwind utilities                                                                   | Use for                                                                      |
| ----------------------------- | ------- | ------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `--color-bg-neutral`          | white   | black   | `bg-neutral`, `from/via/to-neutral`                                                  | Page and panel backgrounds, inputs, table body                               |
| `--color-bg-neutral-inverted` | black   | white   | `bg-neutral-inverted`, `from/via/to-neutral-inverted`                                | Favourites row hover at `/5`                                                 |
| `--color-bg-subtle`           | grey-10 | grey-80 | `bg-subtle`, `from/via/to-subtle`                                                    | Zebra rows, hovered list items, image placeholders                           |
| `--color-text-copy`           | black   | white   | `text-copy`, `fill-copy`, `border-copy`, `divide-copy`, `stroke/outline/ring-copy`   | Body text; outlined borders; dividers; icon fills                            |
| `--color-border-bold`         | grey-60 | grey-40 | `border-bold`, `divide-bold`, `stroke-bold`, `outline-bold`, `ring-bold`             | Dividers (`<hr>`), table header rule, ViewToggle track and ring at low alpha |
| `--color-accent`              | sky-500 | sky-500 | all of the above: `bg/from/via/to`, `border/divide/stroke/outline/ring`, `text/fill` | Links, hover colour, focus ring, selected chips, icon strokes                |

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

| Concern                 | Value                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page padding            | `p-4 sm:p-6 lg:px-10 lg:py-6` (list root: vertical padding equals the column gap, so the first child sits centred between navbar and cards) · `px-4 py-6` (detail column) |
| Page column width       | `max-w-4xl`                                                                                                                                                               |
| Stack gaps              | `gap-4 sm:gap-6` for the list page column · `gap-4 sm:gap-6 lg:gap-8` for the card grid                                                                                   |
| Form gaps               | Stacked form `gap-4`; filter row `gap-3`; label-to-control `gap-1`; chip rows `gap-2`                                                                                     |
| Between sections        | `mt-4`; under a section heading `mb-3` or `mb-4`; `<hr className="my-3 border-bold">`                                                                                     |
| New block in a panel    | `mt-3`; a new section heading after content `mt-8`                                                                                                                        |
| Modal panel             | `max-w-md p-6`                                                                                                                                                            |
| Pagination              | `max-w-xs gap-3`                                                                                                                                                          |
| Controls, posters       | `rounded-md`                                                                                                                                                              |
| Panels, sections, modal | `rounded-lg` (cards use `10px` in CSS, the hero poster `25px`)                                                                                                            |
| Chips, badges, avatars  | `rounded-full`                                                                                                                                                            |
| Control borders         | `border-2 border-solid`; secondary button, chips and pills use 1px `border`                                                                                               |

### Images

The TMDB size prefixes live in [src/services/config.ts](../src/services/config.ts). `baseImagePath` is `w500`: use it for every poster, still, avatar and thumbnail. `baseImagePathPoster` is `w1280`: use it only for the detail-page hero backdrop. `baseImagePathThumb` is `w92`: use it, through `MediaImage`'s `basePath` prop, only for tiny thumbnails in long lists such as the search rows. Always `loading="lazy"`; `alt` is the title on card posters and empty on decorative images beside a visible title.

Never write a bare `<img>` for TMDB artwork. Render it through `MediaImage` (recipe under Components), which draws a `bg-subtle` skeleton with the same box and radius whenever the path is null or the request fails. Give it the class string you would have put on the image; person-info's portrait is the reference (`aspect-[2/3] w-56 flex-none rounded-2xl object-cover object-top shadow-lg sm:w-64 lg:w-72` with `variant="person"`).

### Motion

A global rule in `global.css` transitions `background-color`, `color`, `border-color` and `fill` on every element over 0.25s. Theme switches and hover colour changes animate without any per-component class. Add `transition-all` or `transition-colors` only when you animate something else (Button transitions its gradient).

-  Cards: 250ms `cubic-bezier(0.1, 0.1, 0.6, 0.9)`, `scale(1.15)` plus a 5px poster blur, on hover and `focus-within`.
-  Detail titles: `position: sticky; top: 90px` with a scroll-driven `animation-timeline: scroll()` over the first 200px that grows the type and adds a background. Pages without a backdrop (the person page) have no title bar at all.
-  Detail panels (`.text-content`): on hover only the background alpha, border and shadow change, over 0.3s; the text never fades.
-  `prefers-reduced-motion` is honoured only by the CastList avatar scale (`motion-reduce:transition-none`); the card scale, the panel hover and the scroll-driven title still ignore it (see divergences).

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
4. **Title** — a detail page opens with the sticky `text-title` bar and the `.container-bg` hero (see anatomy). Any other page opens with `<h1 className="text-display-lg">`.
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
-  **`FlexContainer`** — list pages (`FilmList`). Adds the responsive page padding (`p-4 sm:p-6 lg:px-10 lg:py-6`) and an inner `flex w-full max-w-4xl flex-col gap-4 sm:gap-6` column. Vertical padding and column gap are the same value at every breakpoint on purpose: the first child is the `ViewToggle`, and equal spacing keeps it halfway between the navbar and the first row.

### Page anatomy

**Detail pages.** The film page is the pattern; the series page still carries the pre-redesign skeleton (see divergences) and should be ported to this:

1. `<div className="text-title text-copy">` — the sticky, scroll-animated title with a `data-testid="…-info-title"`.
2. `.container-bg` — hero with the backdrop (`baseImagePathPoster`) as a fixed cover background and the poster centred above the panels: a `MediaImage` with no class of its own (the CSS file sizes it and rounds it to `25px`) and `fallbackClassName="mx-auto aspect-[2/3] w-full max-w-[500px] rounded-[25px]"` so the skeleton matches.
3. **Frosted panels** — `.text-content` in `film-info.styles.css`: `bg-neutral` at 0.9 alpha, a 1px `copy/10` border, a `0 8px 32px` shadow and `backdrop-filter: blur(16px) saturate(1.4)`; hover lowers the background to 0.62 and lifts the shadow, nothing else. Each panel is `text-content rounded-lg p-5 text-copy sm:p-8` plus the gap of its stack (`gap-6` header, `gap-5` cast, `gap-4` recommendations); every panel after the first adds `mt-4`. Group content with eyebrow labels and hairline rules (`border-t border-copy/10`), never `<hr>` or `<strong>` rows.
4. **Header panel** — `header flex flex-col items-center gap-2`: `h2 text-display-lg`, the tagline `p font-sans text-lg italic text-copy/70 sm:text-xl`, then the meta line `mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium tabular-nums text-copy/80` (year, runtime, `aria-hidden` dots between them, `CertificationBadge` at the end). Under it: the `FavoriteButton` in `flex justify-center empty:hidden` (it renders nothing when signed out, and `empty:hidden` stops the gap doubling), genre badges in `ul flex flex-wrap items-center justify-center gap-2`, the overview as `section mx-auto flex w-full max-w-prose flex-col gap-2 text-left` with an `h3 font-sans EYEBROW` label and `p text-pretty leading-relaxed sm:text-lg`, the facts `dl grid grid-cols-2 gap-x-4 gap-y-5 border-y border-copy/10 py-5 sm:grid-cols-3` of `Stat` cells (Rating with a `StatNote` vote count, Status, Released, Language, Budget, Revenue), production companies as an eyebrow over `p text-sm text-copy/80`, `ExternalLink` pills in `flex flex-wrap justify-center gap-3`, and the `ReleaseDatesList` disclosure. A trailer, when there is one, follows in its own `mt-4 rounded-lg` block with the iframe `m-auto rounded-lg`.
5. **Cast & Crew panel** — `h2 text-display-md`, a crew `dl flex flex-wrap justify-center gap-x-10 gap-y-4` of eyebrow `dt` over `dd font-display text-lg font-semibold` (Director, Writers), then `div flex flex-col gap-4 border-t border-copy/10 pt-5` holding an `h3 font-sans EYEBROW` "Top billed cast" and `CastList`.
6. **Reviews and gallery** — `ReviewList` and `ImageGallery` between the cast and the recommendations (their recipes are not written up yet; see divergences).
7. **Recommendations panel** — `h2 text-display-md` over a `CardGrid` of `FilmCard`s with `showFavorite={false}`.

**Season page** is a detail page without the hero. Under the title bar, a back link (`text-sm text-accent hover:underline`, prefixed `←`), then a header row `mt-3 flex flex-col gap-4 sm:flex-row` holding the poster (`mx-auto w-40 flex-none rounded-lg sm:mx-0`) and a `min-w-0 flex-1` text block (`h1 text-display-lg`, meta line `mt-1 text-sm tabular-nums text-copy/70`, overview `mt-3 leading-relaxed`). The season switcher is `<nav aria-label="Seasons" className="mt-6 flex flex-wrap gap-2">` of chips. Episodes follow under `h2 mt-8 text-display-md` as an `ol mt-3 flex flex-col gap-4` of episode rows.

**Profile page** (person) is the pattern for any page **without a backdrop**: no parallax hero, no sticky title bar, no frosted panels and no hover fade on anything (the only hover feedback is the card scale and link colour). It is a plain column, `mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-6 text-left text-copy`, and the `h1` carries the `data-testid`.

1. **Header** — `flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-10 sm:text-left`: the portrait (recipe under Media and numbers) beside a `flex min-w-0 flex-1 flex-col items-center gap-6 sm:items-start` block. Everything in that block is centred on phones and left-aligned from `sm`.
2. **Name** — an eyebrow `p` (`EYEBROW`, the department) over `h1 text-display-xl`.
3. **Facts** — `dl flex flex-wrap justify-center gap-x-10 gap-y-5 sm:justify-start` of `Stat` cells with `className="sm:items-start"` (Born with an `(age N)` `StatNote`, Died with `(aged N)`, Birthplace). Aliases are an eyebrow `span` over `p text-sm text-copy/80` joined with `·`.
4. **External links** — `ExternalLink` pills in `flex flex-wrap justify-center gap-3 sm:justify-start`.
5. **Sections** (Biography, Known for, Crew) — each a `section border-t border-copy/10 pt-8` with `h2 text-display-md`; counts sit inside the heading as `ml-2 font-sans text-base font-normal tabular-nums text-copy/60`. Biography is `mt-4 max-w-prose whitespace-pre-line text-pretty leading-relaxed sm:text-lg`, clamped with `line-clamp-6` past 600 characters behind a `Read more` button; credit grids use the card grid with `mt-6`. Toggle buttons are `text-sm font-medium text-accent hover:underline`.

**List pages**: a centred `ViewToggle`, then either the card grid or `FilmTable`.

**Filter pages** (discover): `h1 text-display-lg`, then a phone-only disclosure button and the form. The button is the Chip idle recipe plus `mt-4 inline-flex items-center gap-2 font-medium sm:hidden`, carries `aria-expanded` and `aria-controls` pointing at the form, reads "Show filters" / "Hide filters", shows the number of non-default filters in a `rounded-full bg-accent/10 px-1.5 text-xs tabular-nums text-accent` pill (with `sr-only` " active" for screen readers) and ends with a `h-3 w-3` chevron that gets `rotate-180` when open. The form is `<form id="…" aria-label="…" className="mt-4 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center">` plus `flex` when open or `hidden sm:flex` when closed, so from `sm` up it is always visible and the state is irrelevant. Inside, a `<fieldset className="flex gap-2">` with `<legend className="mb-1 text-sm font-medium">` holds the chip switch; each select field is `flex flex-col gap-1 sm:w-*` with the label above the control. Then a status line `mt-4 text-sm tabular-nums text-copy/70` with `role="status"`, the results, and `<nav aria-label="Pagination" className="mx-auto mt-6 flex w-full max-w-xs gap-3 px-4 pb-8">` with a secondary "Previous" and a primary "Next" button.

### Card grid — `atoms/card-grid`

```tsx
<CardGrid className="mt-6">
   {items.map((item) => (
      <FilmCard key={`${item.media_type}-${item.id}`} {...item} />
   ))}
</CardGrid>
```

Two columns on phones, three from `sm`, four from `lg`, and the gap grows with the columns (`1rem`, `1.5rem`, `2rem`). `CardGrid` is used everywhere cards sit in a fixed grid: the plain list pages, the recommendation panels on the film and series pages, and the person credits. Do not write `grid grid-cols-*` for cards. The `.card-grid` class is flexbox, not CSS grid: every item gets a `flex-basis` of `calc(100% / N - gap)` so N of them fill a row exactly, and `justify-content: center` centres whatever is left on the last row (two cards under a three-column grid sit in the middle, never flush left). Grid's `1fr` tracks cannot do that. `className` is for spacing around the grid only. Keys combine media type and id because TMDB movie and TV ids overlap.

### Responsive rules

Mobile first; the breakpoints in use are `sm` and `lg`, with `md` appearing rarely. Side-by-side rows are `flex flex-col … sm:flex-row` with the image `flex-none` and the text `min-w-0 flex-1` so long titles truncate instead of overflowing. Detail pages must stack on phones and never scroll horizontally. Tables are the exception: `FilmTable` wraps in a `.film-table__scroll` overflow container and tightens type and padding under 640px so four columns fit.

---

## 3. Components

Recipes as they exist in code. Copy the class strings; do not approximate them.

### Navbar — `layout/navbar`

The one fixed element on every page. Root: `navbar sticky top-0 z-10 m-auto flex flex-col items-center gap-2 border-b-2 border-solid border-secondary-background-color bg-primary-background-color p-4` plus the theme class; `navbar.styles.css` adds a `0 3px 3px` shadow in the secondary colour and the decorative wave (`.custom-shape-divider-top`, an absolutely positioned 24px SVG filled with the tertiary colour). Inside: a row `flex w-full items-start justify-between sm:items-center` holding `<nav aria-label="Browse" className="flex items-center gap-4 sm:gap-6">` (two `NavMenu` groups and a `NavLink`) on the left and `flex items-center gap-1` of icon buttons (`ThemeToggleIcon`, `LoginIcon`) on the right, then the search combobox on its own row. Nothing else goes in the navbar; add sections through `NavMenu`.

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

### Select

There is no Select atom yet. Discover styles native selects with the Input recipe plus a radius:

```
w-full rounded-md border-2 border-solid border-secondary-background-color bg-neutral px-2 py-1 text-copy
```

Reuse that string until the atom exists (see divergences).

### Chip — segmented choice

Used for season pickers (links with `aria-current="page"`) and the discover type switch (buttons with `aria-pressed`).

```
base:     rounded-full border px-3 py-1 text-sm
selected: border-accent bg-accent/10 text-accent
idle:     border-copy/30 hover:border-accent hover:text-accent
```

For a two-way layout switch use `ViewToggle` instead; it is a proper radiogroup.

### Badge and pills

Static labels, never interactive.

-  **Badge** (genres): `rounded-full border border-copy/15 bg-neutral-inverted/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider`, an outline that reads on either theme. Rows of badges are `flex flex-wrap items-center justify-center gap-2` (a `ul` with `aria-label`). The filled variant `rounded-full bg-primary-background-color px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-copy/70` survives only in the favourites table (see divergences).
-  **Age rating** (`CertificationBadge`): `rounded-md border border-copy/40 px-2 py-0.5 text-sm font-semibold tabular-nums`, with the region as `<span className="ml-1 text-xs font-normal opacity-70">`.
-  **Inline code-like value** (a certification inside a row): `rounded border border-copy/30 px-1 text-xs tabular-nums`.

### Eyebrow and Stat — `atoms/stat`

The label-over-value pattern used by the film and person pages instead of `Label: value` rows and `<hr>` dividers.

-  **`EYEBROW`** (exported class string): `text-xs font-semibold uppercase tracking-wider text-copy/60`. Use it for facts labels, crew roles, a department, and small section captions; add `font-sans` when it sits on an `h3`, which otherwise inherits the display face.
-  **`Stat`** — one cell of a facts `<dl>`: `div flex flex-col items-center gap-1` holding an eyebrow `dt` and `dd font-display text-lg font-semibold tabular-nums`. Lay the `dl` out as `grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3` (film: `border-y border-copy/10 py-5`) or as a wrapping row `flex flex-wrap justify-center gap-x-10 gap-y-4` (crew). Pass `className="sm:items-start"` for a left-aligned column.
-  **`StatNote`** — a secondary line under the value: `block font-sans text-xs font-normal text-copy/60` (vote count, age).

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

### Card and FilmCard — `atoms/card`, `atoms/film-card`

`Card` is the hover shell (`custom-card w-full`, CSS in `card.styles.css`): relative, hidden overflow, `10px` radius, and on hover or `focus-within` it scales to 1.15, blurs the image and fades in `.content`, a `rgba(0,0,0,.72)` overlay with white text.

`FilmCard` fills it: a `MediaImage` poster (`aspect-[1/1.5] w-full rounded-md object-cover object-center`, `alt={title}`, `fallbackClassName="aspect-[1/1.5]"`; the `masonry` prop drops the fixed aspect from the image but not from the skeleton), then `.content` holding a `MediaLink` with the `h2` title (`mb-2 text-center text-base font-semibold leading-tight sm:text-lg`) and the overview (`line-clamp-4 text-center text-xs leading-snug text-white/85 sm:line-clamp-6 sm:text-sm`), and a `FavoriteButton` **beside** the link, not inside it. The link covers the whole card through a stretched `::after`; the button sits above it with `z-index: 1`. Never nest a control inside an `<a>`.

### FilmTable — `film-table`

The table layout for any list of titles: TanStack Table with `SortableHeader` cells, styled in `film-table.styles.css` under the `film-table__*` block. It already handles zebra rows (`bg-subtle`), the `border-bold` header rule, tabular numerals, row-link hover to `accent`, horizontal overflow and the sub-640px tightening. Reuse it instead of writing `<table>` markup; only its column definitions are per page.

### SortableHeader — `atoms/sortable-header`

A `<th aria-sort="…">` whose content is a reset `<button>` plus an `aria-hidden` sort glyph. Styles in `sortable-header.styles.css`; the focus ring is the standard 2px accent outline.

### ViewToggle — `atoms/view-toggle`

`react-aria-components` `ToggleButtonGroup` in single-selection mode, so it is a radiogroup with arrow-key navigation. Each `ToggleButton` holds an `aria-hidden` 16-unit SVG glyph (grid for Cards, rows for Table) followed by the label, which carries the accessible name.

Styles in `view-toggle.styles.css`, a segmented pill in the same 1px-border-plus-shadow language as the nav menu and search popover:

-  **Track** — `inline-flex`, `padding: 0.25rem`, `gap: 0.125rem`, `border-radius: 9999px`, `1px solid border-bold/35`, background `bg-subtle/70`, `inset 0 1px 2px` shadow at 6 % black.
-  **Segment** — `inline-flex items-center gap-0.375rem`, `padding: 0.375rem 0.875rem`, fully rounded, transparent, `font-display` 0.875rem/500 with `0.02em` tracking, text `copy/70`. Icon `0.875rem` square, `fill: currentColor`. 150 ms transition on background, colour and shadow.
-  **`[data-hovered]`** — text to `copy` (no background change; the track already reads as a surface).
-  **`[data-selected]`** — background `bg-neutral`, text `copy`, shadow `0 1px 3px` at 18 % black plus a `0 0 0 1px border-bold/30` ring; the icon fills with `accent`.
-  **`[data-focus-visible]`** — `2px` accent outline, `2px` offset (outside the pill, unlike the inset outline on chips).

Copy this pairing of states for any future segmented control built on react-aria.

### Search combobox — `layout/navbar/search-input`

`react-aria-components` `ComboBox` with a visually hidden label, a leading search icon, an in-field spinner and clear button, and a popover portalled into its own root (so it rides with the sticky navbar) and sized to `var(--trigger-width)`. Styles in `search-input.styles.css` under `search-combobox__*`. It applies the theme class to its own root because the popover renders outside the page roots. The clear button is a plain `<button>`, not a react-aria `Button`, which inside `ComboBox` would become the popover trigger.

Field: root `max-width: 40rem`; the input is a pill (`border-radius: 9999px`, `min-height: 2.75rem`, `1.125rem` text, `1rem` below `sm`) filled `bg-subtle/70` with a `border-bold/40` 1px border, going `bg-neutral` with an `accent` border plus the standard 2px `accent` outline on focus. The icon sits at `left: 1rem` in `text-copy/55` and turns `accent` on `:focus-within`.

Popover: pass `containerPadding={0}` and `offset={6}`, because inside a positioned portal container react-aria's default 12px boundary padding shifts the panel sideways off the field. It is a frosted panel in the detail-page language: `bg-neutral/85`, `backdrop-filter: blur(16px) saturate(1.4)`, `text-copy/10` 1px border, `border-radius: 1rem`, `0 8px 32px` shadow, `0.375rem` inner padding, `max-height: min(32rem, 70vh)`.

Row (`search-combobox__item`, `rounded 0.625rem`, `bg-subtle` on `[data-focused]`/`[data-hovered]`, 2px inset `accent` outline on `[data-focus-visible]`): a `2.75rem`-wide `aspect-ratio: 2 / 3` poster through `MediaImage` with `basePath={baseImagePathThumb}` (w92) and an empty `alt`; then a body column of title (`font-display`, `1rem`/600, turns `accent` when the row is focused or hovered, single line with ellipsis), a meta line (`0.75rem text-copy/70 tabular-nums`: uppercase `search-combobox__item-type` pill in `border-bold/50` reading Film or Series, the year, and `★ 8.4` when the title has votes), and a one-line ellipsised overview at `0.8125rem text-copy/60`, hidden below `sm`. The empty state (`search-combobox__empty`, centred `0.9375rem text-copy/70`) reads a hint when nothing is typed, “Searching…” until the debounced query settles, then “No films or series found”.

### Links — `atoms/link`

-  **`NavLink`** puts colour on a `<span>` inside the router `Link` — `font-display text-lg font-medium tracking-wide text-copy hover:text-accent` — because `index.css` forces `a, a:visited { color: black }` and a colour on the anchor itself would not survive `:visited` in dark mode.
-  **`MediaLink`** chooses `/film/:id` or `/tv/:id` by media type; always use it for detail links.
-  **Internal text links** are `text-accent hover:underline`; back links are `text-sm text-accent hover:underline` prefixed with `←`.
-  **`ExternalLink`** (homepage, IMDb) is a pill: `group rounded-full border border-copy/30 px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent` with `target="_blank" rel="noreferrer"`, the label in `<span className="text-copy group-hover:text-accent">` (same `:visited` reason as NavLink) and a trailing `↗` that is `aria-hidden`. Label it `IMDb`, not `IMDB`. The colour difference from internal links is deliberate: accent means "stays in the app".
-  **Links that inherit** (a whole card or cast column) are `text-inherit hover:text-accent`.

### FavoriteButton — `atoms/favorite-button`

Icon-only `<button>` with `aria-label` "Add to favorites" / "Remove from favorites", `cursor-pointer disabled:opacity-50` plus whatever `className` the parent passes. The heart is a `h-7 w-7` SVG: `fill-accent stroke-accent` when favourited, `fill-accent/20 stroke-accent` when not. The navbar icons use the same fill and stroke pairing.

### CastList — `cast-list`

`mx-auto flex flex-wrap justify-center gap-4`, with an inline `maxWidth` of `perRow × 8.5rem` so a long cast splits into two even rows. Each member is a `Link` with `group flex w-[7.5rem] flex-col items-center gap-1.5 text-center text-inherit hover:text-accent`, holding a `MediaImage` avatar (`variant="person"`, `aspect-[3/4] w-full rounded-2xl object-cover object-top transition-transform duration-200 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transition-none`), a `relative z-10 font-display text-sm font-semibold leading-tight` name and a `relative z-10 text-xs leading-tight text-copy/70` role.

### Spinner — `atoms/spinner`

Five bouncing bars in `spinner.styles.css`, coloured with `--primary-background-color`, centred with `margin: 300px auto`. Rendered wherever a view waits on data.

### Empty and error states

Empty results: `<p className="px-4 text-copy/70">` (or `mt-2 opacity-70` inside a themed block) with a sentence that suggests the next step ("Nothing matches those filters. Try a different genre or year."). Error and not-found views: a `p mb-8 p-4 font-display text-display-md font-semibold text-copy` message followed by a single outlined action.

---

## 4. Patterns

### Tailwind first, CSS file when it earns it

Write utilities in `className`. Create a co-located `<name>.styles.css`, imported as the first line of the component, when you need any of: pseudo-elements, keyframes or scroll-driven animation, react-aria data-attribute states, or a selector tree that would make the JSX unreadable. Name classes `block__element` with the component name as the block (`film-table__cell`, `search-combobox__item`). Reference tokens as `hsl(var(--color-x) / 1)`; the alpha slot is there so `/ 0.5` works too. Never write hex in a component stylesheet, and never let a CSS rule silently override a utility on the same element (the hero poster's radius does this today).

### Complex widgets use react-aria-components

Anything with selection, keyboard or popover semantics — comboboxes, toggle groups, and future menus or dialogs — is built on `react-aria-components` and styled through its data attributes: `[data-hovered]`, `[data-focused]`, `[data-focus-visible]`, `[data-selected]`, `[data-pressed]`. This is what gives ViewToggle its radiogroup role and the search box its listbox for free.

### Extending the theme

If the utility you need does not exist, the answer is never an arbitrary value (`text-[#0ea5e9]`, `bg-[hsl(var(--color-accent))]`) or a raw palette class. Add the token to the relevant map in [tailwind.config.ts](../tailwind.config.ts) so it gets the `<alpha-value>` slot and shows up for every theme, then add the row to the tables in this guide. New fonts, weights and sizes go through `fontFamily`, `fontWeight` and `fontSize` the same way. Arbitrary values are fine for one-off geometry (`aspect-[2/3]`, `min-w-[8rem]`, `rounded-[25px]`).

### Class strings

Prettier's Tailwind plugin sorts classes on commit; do not hand-order them. If a class stays at the front of the string after formatting, the plugin does not know it and it is probably not a real utility. Build conditional classes with a template literal whose static part comes first and a ternary for the variant, as the chips do. Components accept an optional `className` and append it: `` `${base} ${className}`.trim() ``.

### Accessibility baseline

The jsx-a11y rules in `eslint.config.js` are mostly errors and block commits. Beyond them, the conventions in use: `aria-label` on every `<nav>` and on `role="group"` wrappers; `<fieldset>` + `<legend>` for a labelled set of chips; `aria-pressed` on toggle buttons and `aria-current="page"` on the active link in a set; `aria-sort` on sortable headers; `role="status"` on live result counts; visually hidden labels via the `.search-combobox__label` clip pattern; `alt` equal to the title on posters and empty on decorative images; `aria-hidden` on placeholder glyphs; interactive controls never inside an anchor.

### Media and numbers

Posters: `aspect-[1/1.5] w-full rounded-md object-cover object-center`. Stills: `aspect-video … rounded-md object-cover`. Cast avatars: `aspect-[3/4] w-full rounded-2xl object-cover object-top`; the person portrait is `aspect-[2/3] rounded-2xl object-cover object-top shadow-lg`. People are rounded rectangles, not circles. Thumbnails in rows: `h-16 w-11 flex-none rounded object-cover`. Sizes and placeholders are in [Images](#images). Counts go through `toLocaleString()` and sit in `tabular-nums`.

---

## 5. Known divergences

Places where the code does not yet follow this guide. Fixing them is tracked in the roadmap.

-  **Input placeholder** — `placeholder-text-copy` compiles to nothing because no map feeds `placeholderColor`. Wire `placeholderColor: textColors` in the config and use `placeholder-copy/50`.
-  **Discover** uses a `max-w-6xl` column where every other page uses `max-w-4xl`, inlines the Select recipe as a local string, and hand-rolls its type switch instead of a Chip atom.
-  **Favourites** hand-rolls a `<table>` (`py-8` column, `border-bold/30` rows) instead of rendering `FilmTable`, and its media-type badge keeps the filled `bg-primary-background-color` look instead of the outline badge.
-  **Error and not-found views** style their action with `border-blue-700 hover:bg-blue-900 text-slate-300` instead of the Button primary recipe or the accent token.
-  **Series detail** still has the pre-redesign skeleton: `text-content rounded-lg p-4` panels, `<hr className="my-3 border-bold">` dividers, `<strong>` fact rows, the tagline as an `h3`, and genre and type badges with `bg-primary`, which is not a utility and does nothing. Port it to the film page anatomy (frosted `p-5 sm:p-8` panels, eyebrow `Stat` facts, outline badges).
-  **ReviewList and ImageGallery** ship on the film and series pages but have no recipe in this guide yet.
-  **FlexContainer** sets both `bg-neutral` and `bg-primary-background-color` on the same element; one must go.
-  **Detail panel CSS** (`.text-content`) fixes `width: 80%`, `margin: 10px` and a `600px` max-width media query, none of which is mobile-first or on the `sm` breakpoint. The column classes should own the width.
-  **Hero poster** — `.container-bg > div > img:hover` drops the poster to 10% opacity for no reason, and its `25px` radius lives in CSS while every other radius is a utility (the skeleton already carries `rounded-[25px]`). Remove the fade and move the radius onto the element.
-  **`opacity-*` on coloured text** appears where `text-copy/N` should be used (favourites `text-copy opacity-60`, season meta). Reserve `opacity-*` for inherited colour.
-  **Sticky title keyframe** in `film-info.styles.css` ends at `font-weight: 700`, the only 700 in the app; it should end at 600 and let the size change carry the effect.
-  **Spinner** uses the legacy primary variable and a fixed `300px` margin rather than a token and flex centring.
-  **Legacy hex variables** still define control borders and panel backgrounds. They need semantic tokens (a `border-subtle` and a panel background) before they can be retired.
-  **Reduced motion** is honoured only by the CastList avatar scale; the card scale, the panel hover and the scroll-driven title still need a `prefers-reduced-motion` guard.
