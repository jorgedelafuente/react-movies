# React Movies Style Guide

This is the look and feel the app already has, written down so new pages and components adopt it instead of inventing their own. Every value here is lifted from the code; if the two disagree, fix one of them. Hard rules for tooling live in [CLAUDE.md](../CLAUDE.md); testing patterns live in [TESTING.md](TESTING.md).

1. [Foundations](#1-foundations) — colour, dark mode, typography, spacing, motion, states
2. [Layout](#2-layout) — building a page, page roots, page anatomy, the card grid, responsive rules
3. [Components](#3-components) — the recipes actually in use
4. [Patterns](#4-patterns) — Tailwind vs CSS files, react-aria, accessibility, media
5. [Known divergences](#5-known-divergences) — places the code does not follow this guide yet

---

## 1. Foundations

### Colour

Colours are HSL triplets in CSS variables in [src/styles/global.css](../src/styles/global.css). A raw greyscale (`--color-grey-0` white … `--color-grey-100` black, plus `--color-sky`) feeds a small set of semantic tokens. The `.dark` class re-points the semantic tokens, so components never branch on theme. [tailwind.config.ts](../tailwind.config.ts) exposes each token as `hsl(var(--token) / <alpha-value>)`, which is why the `/70`-style alpha modifiers work everywhere.

| Token                         | Light   | Dark    | Tailwind utilities                                        | Use for                                                       |
| ----------------------------- | ------- | ------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| `--color-bg-neutral`          | white   | black   | `bg-neutral`, `from/to-neutral`                           | Page and panel backgrounds, inputs, table body                |
| `--color-bg-neutral-inverted` | black   | white   | `bg-neutral-inverted`                                     | Selected segment in ViewToggle; row hover at `/5`             |
| `--color-bg-subtle`           | grey-10 | grey-80 | `bg-subtle`                                               | Zebra rows, hovered list items, image placeholders            |
| `--color-text-copy`           | black   | white   | `text-copy`, `border-copy`, `divide-copy`, `fill-copy`    | Body text; outlined borders; dividers; icon fills             |
| `--color-border-bold`         | grey-60 | grey-40 | `border-bold`, `outline-bold`, `ring-bold`, `stroke-bold` | Dividers (`<hr>`), table header rule, ViewToggle frame        |
| `--color-accent`              | sky-500 | sky-500 | `text/border/bg/fill/stroke/outline-accent`               | Links, hover colour, focus ring, selected chips, icon strokes |

Only the utilities in that column exist. `copy` has no background utility and there is no `primary` colour, so `bg-copy/10` and `bg-primary` compile to nothing. The tell is Prettier: it leaves classes it does not recognise at the front of the string.

**Alpha carries hierarchy.** Do not reach for a lighter grey; lower the alpha of the token that is already there.

| Need                     | Class                         | Seen in                                             |
| ------------------------ | ----------------------------- | --------------------------------------------------- |
| Secondary text           | `text-copy/70`                | Result counts, cast roles, meta lines, empty states |
| Tertiary text            | `text-copy/60`                | Secondary button label                              |
| Tagline                  | `text-copy/75`                | Detail-page tagline under the title                 |
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

Headings get the display face automatically (`text-balance font-display font-semibold`) with a fluid size:

| Element   | Class             | Size                                      |
| --------- | ----------------- | ----------------------------------------- |
| `h1`      | `text-display-lg` | clamp(1.875rem, 1.5rem + 1.25vw, 2.5rem)  |
| `h2`      | `text-display-md` | clamp(1.5rem, 1.25rem + 0.75vw, 1.875rem) |
| `h3`      | `text-display-sm` | clamp(1.25rem, 1.125rem + 0.5vw, 1.5rem)  |
| `h4`–`h6` | `text-display-xs` | 1.125rem                                  |
| hero only | `text-display-xl` | clamp(2.25rem, 1.75rem + 2vw, 3.5rem)     |

Use the `text-display-*` utilities to size any element like a heading, and a plain `text-*` utility to make a heading smaller (card titles are `h2` at `text-base sm:text-lg`). Text placed inside a heading inherits the display face and weight, so reset what you do not want: the tagline is a `<span>` inside the `h2` and carries `font-sans font-normal tracking-normal` to undo all three.

Text roles in use:

| Role               | Classes                                                                            |
| ------------------ | ---------------------------------------------------------------------------------- |
| Body               | `text-base`, `leading-relaxed` for paragraphs, `max-w-prose`                       |
| Secondary          | `text-sm text-copy/70`                                                             |
| Meta / captions    | `text-xs text-copy/70`; `text-xs opacity-70` when the colour is inherited          |
| Meta separator     | `<span className="mx-1 opacity-50">·</span>`                                       |
| Count in a heading | `<span className="ml-2 text-base font-normal tabular-nums opacity-70">(12)</span>` |
| Form label         | `text-sm font-medium text-copy`                                                    |
| Nav link           | `font-display text-lg font-medium tracking-wide`                                   |
| Button label       | `font-medium tracking-wide`                                                        |
| Badge              | `text-xs font-semibold uppercase tracking-wider`                                   |
| Tagline            | `font-sans text-lg font-normal italic tracking-normal text-copy/75 sm:text-xl`     |
| Emphasis           | `<strong>` renders `font-semibold` (Inter's 700 is too heavy inline)               |

Anything numeric — ratings, years, dates, counts, money — gets `tabular-nums` so columns align. FilmTable sets `font-variant-numeric: tabular-nums` on the whole table.

### Spacing, width, radius

| Concern                 | Value                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Page padding            | `p-4 sm:p-6 lg:p-10` (list root) · `px-4 py-6` (detail column)                        |
| Page column width       | `max-w-4xl`                                                                           |
| Stack gaps              | `gap-4 sm:gap-6 lg:gap-8` for page columns and the card grid                          |
| Form gaps               | Stacked form `gap-4`; filter row `gap-3`; label-to-control `gap-1`; chip rows `gap-2` |
| Between sections        | `mt-4`; under a section heading `mb-3` or `mb-4`; `<hr className="my-3 border-bold">` |
| New block in a panel    | `mt-3`; a new section heading after content `mt-8`                                    |
| Modal panel             | `max-w-md p-6`                                                                        |
| Pagination              | `max-w-xs gap-3`                                                                      |
| Controls, posters       | `rounded-md`                                                                          |
| Panels, sections, modal | `rounded-lg` (cards use `10px` in CSS, the hero poster `25px`)                        |
| Chips, badges, avatars  | `rounded-full`                                                                        |
| Control borders         | `border-2 border-solid`; secondary button, chips and pills use 1px `border`           |

### Images

Both TMDB size prefixes live in [src/services/config.ts](../src/services/config.ts). `baseImagePath` is `w500`: use it for every poster, still, avatar and thumbnail. `baseImagePathPoster` is `w1280`: use it only for the detail-page hero backdrop. Always `loading="lazy"`; `alt` is the title on card posters and empty on decorative images beside a visible title.

When an image may be missing, render a placeholder with the same box and radius on `bg-subtle` (person-info's `flex h-72 w-48 items-center justify-center rounded-[25px] bg-subtle text-6xl` is the reference).

### Motion

A global rule in `global.css` transitions `background-color`, `color`, `border-color` and `fill` on every element over 0.25s. Theme switches and hover colour changes animate without any per-component class. Add `transition-all` or `transition-colors` only when you animate something else (Button transitions its gradient).

-  Cards: 250ms `cubic-bezier(0.1, 0.1, 0.6, 0.9)`, `scale(1.15)` plus a 5px poster blur, on hover and `focus-within`.
-  Detail titles: `position: sticky; top: 90px` with a scroll-driven `animation-timeline: scroll()` over the first 200px that grows the type and adds a background. Pages without a backdrop add `text-title--static`, which keeps the resting look and drops the sticky animation.
-  There is no `prefers-reduced-motion` handling yet (see divergences).

### Interactive states

| State    | Recipe                                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover    | Text or border to `accent`. Rows and list items: `bg-subtle` (CSS `[data-hovered]`) or `hover:bg-neutral-inverted/5`                                                                                       |
| Focus    | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`; in CSS `outline: 2px solid hsl(var(--color-accent) / 1)`, offset `-2px` inside a framed group |
| Selected | Chips: `border-accent bg-accent/10 text-accent` with `aria-pressed` or `aria-current`. ViewToggle: inverted (`bg-neutral-inverted`, text in `bg-neutral`)                                                  |
| Disabled | `disabled:opacity-50`                                                                                                                                                                                      |
| Loading  | `Spinner` (see components)                                                                                                                                                                                 |

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
-  **`FlexContainer`** — list pages (`FilmList`). Adds the responsive page padding and an inner `flex w-full max-w-4xl flex-col gap-4 sm:gap-6 lg:gap-8` column.

### Page anatomy

> **In flight (2026-09-24).** The film detail page is being redesigned in the working tree: frosted-glass panels (`bg-neutral` at 0.9 alpha, `backdrop-filter: blur(16px)`, a 1px `copy/10` border, `p-5 sm:p-8`), small-caps eyebrow labels instead of `<strong>` rows, a `grid grid-cols-2 … sm:grid-cols-3` fact grid inside `border-y border-copy/10`, badges as `rounded-full border border-copy/15 bg-neutral-inverted/5 px-3 py-1`, and 2:3 portrait cast avatars (`aspect-[2/3] w-full rounded-2xl` in `w-24` columns). When it lands, rewrite this section and the Badge and CastList recipes from it, then port series-info and person-info to match. Until then the skeleton below is what is committed.

**Detail pages** (film, series, person) share one skeleton:

1. `<div className="text-title text-copy">` — the sticky, scroll-animated title with a `data-testid="…-info-title"`. Person pages add `text-title--static`.
2. `.container-bg` — hero with the backdrop (`baseImagePathPoster`) as a fixed cover background and the poster centred. The CSS file rounds the poster to `25px`; the `rounded-lg` on the `<img>` is overridden.
3. Stacked panels. The first is `<div className="text-content rounded-lg p-4 text-copy">`; every later one adds `mt-4`. The first holds the `h2 mb-2 text-display-lg` title with the tagline span, `<hr className="my-3 border-bold">` dividers between groups, genre badges in a `mt-3 flex flex-wrap items-center justify-center gap-2` row, fact rows with `<strong>` labels in a `tabular-nums` block, and external links in a `mt-2 flex flex-wrap gap-4` row. Later panels are titled with `h2 text-display-md mb-3` ("Cast & Crew", via `CastList`) and `mb-4` ("Recommendations", the card grid).

**Season page** is a detail page without the hero. Under the title bar, a back link (`text-sm text-accent hover:underline`, prefixed `←`), then a header row `mt-3 flex flex-col gap-4 sm:flex-row` holding the poster (`mx-auto w-40 flex-none rounded-lg sm:mx-0`) and a `min-w-0 flex-1` text block (`h1 text-display-lg`, meta line `mt-1 text-sm tabular-nums text-copy/70`, overview `mt-3 leading-relaxed`). The season switcher is `<nav aria-label="Seasons" className="mt-6 flex flex-wrap gap-2">` of chips. Episodes follow under `h2 mt-8 text-display-md` as an `ol mt-3 flex flex-col gap-4` of episode rows.

**List pages**: a centred `ViewToggle`, then either the card grid or `FilmTable`.

**Filter pages** (discover): `h1 text-display-lg`, then `<form aria-label="…" className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center">`. A `<fieldset className="flex gap-2">` with `<legend className="mb-1 text-sm font-medium">` holds the chip switch; each select field is `flex flex-col gap-1 sm:w-*` with the label above the control. Then a status line `mt-4 text-sm tabular-nums text-copy/70` with `role="status"`, the results, and `<nav aria-label="Pagination" className="mx-auto mt-6 flex w-full max-w-xs gap-3 px-4 pb-8">` with a secondary "Previous" and a primary "Next" button.

### Card grid

```tsx
<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
   {items.map((item) => (
      <FilmCard key={`${item.media_type}-${item.id}`} {...item} />
   ))}
</div>
```

Two columns on phones, three from `sm`, four from `lg`, and the gap grows with the columns. Keys combine media type and id because TMDB movie and TV ids overlap.

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
w-full border-2 border-solid bg-neutral px-2 py-1 text-copy placeholder-text-copy
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

-  **Badge** (genres, media type): `rounded-full bg-primary-background-color px-2 py-1 text-xs font-semibold uppercase tracking-wider text-copy/70`. Rows of badges are `flex flex-wrap items-center justify-center gap-2`.
-  **Age rating** (`CertificationBadge`): `rounded-md border border-copy/40 px-2 py-0.5 text-sm font-semibold tabular-nums`, with the region as `<span className="ml-1 text-xs font-normal opacity-70">`.
-  **Inline code-like value** (a certification inside a row): `rounded border border-copy/30 px-1 text-xs tabular-nums`.

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

A media row for items with a wide image: `flex flex-col gap-3 rounded-lg bg-tertiary-background-color p-3 sm:flex-row`. Still: `aspect-video w-full flex-none rounded-md object-cover sm:w-56` (placeholder: same classes on `bg-subtle`). Text: `min-w-0 flex-1` with an `h3 font-display text-base font-semibold leading-tight` whose number is `<span className="mr-2 tabular-nums opacity-60">`, a meta line `mt-1 text-xs tabular-nums text-copy/70`, and the overview `mt-2 text-sm leading-relaxed`. The seasons list on the series page is the compact version: `h-16 w-11 flex-none rounded object-cover` thumbnail beside a `font-display text-sm font-semibold leading-tight` name.

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

`FilmCard` fills it: a poster `aspect-[1/1.5] w-full rounded-md object-cover object-center` with `loading="lazy"` and `alt={title}` (the `masonry` prop drops the fixed aspect), then `.content` holding a `MediaLink` with the `h2` title (`mb-2 text-center text-base font-semibold leading-tight sm:text-lg`) and the overview (`line-clamp-4 text-center text-xs leading-snug text-white/85 sm:line-clamp-6 sm:text-sm`), and a `FavoriteButton` **beside** the link, not inside it. The link covers the whole card through a stretched `::after`; the button sits above it with `z-index: 1`. Never nest a control inside an `<a>`.

### FilmTable — `film-table`

The table layout for any list of titles: TanStack Table with `SortableHeader` cells, styled in `film-table.styles.css` under the `film-table__*` block. It already handles zebra rows (`bg-subtle`), the `border-bold` header rule, tabular numerals, row-link hover to `accent`, horizontal overflow and the sub-640px tightening. Reuse it instead of writing `<table>` markup; only its column definitions are per page.

### SortableHeader — `atoms/sortable-header`

A `<th aria-sort="…">` whose content is a reset `<button>` plus an `aria-hidden` sort glyph. Styles in `sortable-header.styles.css`; the focus ring is the standard 2px accent outline.

### ViewToggle — `atoms/view-toggle`

`react-aria-components` `ToggleButtonGroup` in single-selection mode, so it is a radiogroup with arrow-key navigation. Styles in `view-toggle.styles.css`: a `border-bold` frame, `bg-subtle` on `[data-hovered]`, inverted colours on `[data-selected]`, accent outline inset `-2px` on `[data-focus-visible]`. Copy this pairing of states for any future segmented control built on react-aria.

### Search combobox — `layout/navbar/search-input`

`react-aria-components` `ComboBox` with a visually hidden label, an in-field spinner and clear button, and a portalled popover sized to `var(--trigger-width)`. Styles in `search-input.styles.css` under `search-combobox__*`; list items use `bg-subtle` for `[data-focused]` and `[data-hovered]`. It applies the theme class to its own root because the popover renders outside the page roots.

### Links — `atoms/link`

-  **`NavLink`** puts colour on a `<span>` inside the router `Link` — `font-display text-lg font-medium tracking-wide text-copy hover:text-accent` — because `index.css` forces `a, a:visited { color: black }` and a colour on the anchor itself would not survive `:visited` in dark mode.
-  **`MediaLink`** chooses `/film/:id` or `/tv/:id` by media type; always use it for detail links.
-  **Internal text links** are `text-accent hover:underline`; back links are `text-sm text-accent hover:underline` prefixed with `←`.
-  **External links** (homepage, IMDb) are `text-copy underline` with `target="_blank" rel="noreferrer"`. The colour difference is deliberate: accent means "stays in the app".
-  **Links that inherit** (a whole card or cast column) are `text-inherit hover:text-accent`.

### FavoriteButton — `atoms/favorite-button`

Icon-only `<button>` with `aria-label` "Add to favorites" / "Remove from favorites", `cursor-pointer disabled:opacity-50` plus whatever `className` the parent passes. The heart is a `h-7 w-7` SVG: `fill-accent stroke-accent` when favourited, `fill-accent/20 stroke-accent` when not. The navbar icons use the same fill and stroke pairing.

### CastList — `cast-list`

`flex flex-wrap justify-center gap-4` of `w-20` columns (`flex flex-col items-center gap-1 text-center text-inherit hover:text-accent`), each an avatar `h-16 w-16 rounded-full object-cover object-top`, a `font-display text-sm font-semibold leading-tight` name and a `text-xs leading-tight text-copy/70` role.

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

### Class strings

Prettier's Tailwind plugin sorts classes on commit; do not hand-order them. If a class stays at the front of the string after formatting, the plugin does not know it and it is probably not a real utility. Build conditional classes with a template literal whose static part comes first and a ternary for the variant, as the chips do. Components accept an optional `className` and append it: `` `${base} ${className}`.trim() ``.

### Accessibility baseline

The jsx-a11y rules in `eslint.config.js` are mostly errors and block commits. Beyond them, the conventions in use: `aria-label` on every `<nav>` and on `role="group"` wrappers; `<fieldset>` + `<legend>` for a labelled set of chips; `aria-pressed` on toggle buttons and `aria-current="page"` on the active link in a set; `aria-sort` on sortable headers; `role="status"` on live result counts; visually hidden labels via the `.search-combobox__label` clip pattern; `alt` equal to the title on posters and empty on decorative images; `aria-hidden` on placeholder glyphs; interactive controls never inside an anchor.

### Media and numbers

Posters: `aspect-[1/1.5] w-full rounded-md object-cover object-center`. Stills: `aspect-video … rounded-md object-cover`. Avatars: `h-16 w-16 rounded-full object-cover object-top`. Thumbnails in rows: `h-16 w-11 flex-none rounded object-cover`. Sizes and placeholders are in [Images](#images). Counts go through `toLocaleString()` and sit in `tabular-nums`.

---

## 5. Known divergences

Places where the code does not yet follow this guide. Fixing them is tracked in the roadmap.

-  **Discover** uses a `max-w-6xl` column where every other page uses `max-w-4xl`, inlines the Select recipe as a local string, and hand-rolls its type switch instead of a Chip atom.
-  **Favourites** hand-rolls a `<table>` (`py-8` column, `text-copy/80 py-0.5` badges, `border-bold/30` rows) instead of rendering `FilmTable`, and its poster placeholder is `bg-copy/10`, which is not a utility.
-  **Error and not-found views** style their action with `border-blue-700 hover:bg-blue-900 text-slate-300` instead of the Button primary recipe or the accent token.
-  **Image placeholders** — CastList's `bg-gray-400 text-white` fallback (already `bg-subtle` in the in-flight redesign), season stills `bg-gray-400/30` and series season thumbnails `bg-gray-400/40` should all be `bg-subtle`.
-  **Film detail** genre and age-rating badges carry `bg-primary`, which is not a utility in this config and does nothing; they should use `bg-primary-background-color` like the badge recipe.
-  **FlexContainer** sets both `bg-neutral` and `bg-primary-background-color` on the same element; one must go.
-  **Detail panel CSS** (`.text-content`) fixes `width: 80%`, `margin: 10px`, `height: 90%` and a `600px` media query, none of which is mobile-first or on the `sm` breakpoint. The column classes should own the width.
-  **Hero poster** — `.container-bg img:hover` drops the poster to 10% opacity for no reason, and the CSS `25px` radius overrides the `rounded-lg` utility on the element. Remove the fade and pick one radius. (`.text-content:hover` also fades panels to 50% at HEAD; the in-flight redesign replaces that with a background-only glass fade, which is intentional.)
-  **`opacity-*` on coloured text** appears where `text-copy/N` should be used (favourites `text-copy opacity-60`, discover and season meta). Reserve `opacity-*` for inherited colour.
-  **Spinner** uses the legacy primary variable and a fixed `300px` margin rather than a token and flex centring.
-  **Legacy hex variables** still define control borders and panel backgrounds. They need semantic tokens (a `border-subtle` and a panel background) before they can be retired.
-  **Reduced motion** is not honoured anywhere; the card scale and the scroll-driven title need a `prefers-reduced-motion` guard.
