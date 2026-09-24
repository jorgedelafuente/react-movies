# React Movies Style Guide

This is the look and feel the app already has, written down so new pages and components adopt it instead of inventing their own. Every value here is lifted from the code; if the two disagree, fix one of them. Hard rules for tooling live in [CLAUDE.md](../CLAUDE.md); testing patterns live in [TESTING.md](TESTING.md).

1. [Foundations](#1-foundations) — colour, dark mode, typography, spacing, motion, states
2. [Layout](#2-layout) — page roots, page anatomy, the card grid, responsive rules
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
| `--color-bg-subtle`           | grey-10 | grey-80 | `bg-subtle`                                               | Zebra rows, hovered or focused list items                     |
| `--color-text-copy`           | black   | white   | `text-copy`, `border-copy`, `fill-copy`                   | Body text; outlined button borders; icon fills                |
| `--color-border-bold`         | grey-60 | grey-40 | `border-bold`, `outline-bold`, `ring-bold`, `stroke-bold` | Dividers (`<hr>`), table header rule, ViewToggle frame        |
| `--color-accent`              | sky-500 | sky-500 | `text/border/bg/fill/stroke/outline-accent`               | Links, hover colour, focus ring, selected chips, icon strokes |

**Alpha carries hierarchy.** Do not reach for a lighter grey; lower the alpha of the token that is already there.

| Need                   | Class                         | Seen in                                 |
| ---------------------- | ----------------------------- | --------------------------------------- |
| Secondary text         | `text-copy/70`                | Result counts, cast roles, empty states |
| Tertiary text          | `text-copy/60`                | Secondary button label                  |
| Quiet outline          | `border-copy/30`              | Idle chips                              |
| Quiet outline (button) | `border-copy/20`              | Secondary button                        |
| Row divider            | `border-bold/30`              | Favourites table rows                   |
| Selected fill          | `bg-accent/10`                | Active chip                             |
| Icon tint              | `fill-accent/20`              | Unfilled heart, navbar icons            |
| Hover wash             | `hover:bg-neutral-inverted/5` | Favourites table rows                   |

**Feedback colour.** Validation uses Tailwind's `red-500` directly: `border-red-500` on the control and `text-xs text-red-500` for the message. It is the only raw palette colour with a sanctioned role.

**Legacy variables.** Three hex variables predate the token system: `--primary-background-color`, `--secondary-background-color`, `--tertiary-background-color` (light `#dedede / #a6a6a6 / #737373`, dark `#141414 / #282828 / #323232`), exposed as `bg-*-background-color` and `border-*-background-color`. They are not going away this week, and today they own specific roles. Match the role; do not give them new ones.

| Variable  | Current role                                                                      |
| --------- | --------------------------------------------------------------------------------- |
| primary   | List-page background (FlexContainer), navbar background, spinner bars, badge fill |
| secondary | Form-control and panel borders (Input, Modal, selects), navbar border and shadow  |
| tertiary  | Detail-page section panels (`.text-content`), navbar wave fill                    |

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

Use the `text-display-*` utilities to size any element like a heading, and a plain `text-*` utility to make a heading smaller (card titles are `h2` at `text-base sm:text-lg`).

Text roles in use:

| Role            | Classes                                                              |
| --------------- | -------------------------------------------------------------------- |
| Body            | `text-base`, `leading-relaxed` for paragraphs, `max-w-prose`         |
| Secondary       | `text-sm text-copy/70`                                               |
| Meta / captions | `text-xs text-copy/70` or `text-xs opacity-70`                       |
| Form label      | `text-sm font-medium text-copy`                                      |
| Nav link        | `font-display text-lg font-medium tracking-wide`                     |
| Button label    | `font-medium tracking-wide`                                          |
| Badge           | `text-xs font-semibold uppercase tracking-wider`                     |
| Tagline         | `font-sans text-lg italic text-copy/75 sm:text-xl`                   |
| Emphasis        | `<strong>` renders `font-semibold` (Inter's 700 is too heavy inline) |

Anything numeric — ratings, years, dates, counts, money — gets `tabular-nums` so columns align. FilmTable sets `font-variant-numeric: tabular-nums` on the whole table.

### Spacing, width, radius

| Concern                 | Value                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------- |
| Page padding            | `p-4 sm:p-6 lg:p-10` (list root) · `px-4 py-6` (detail column)                        |
| Page column width       | `max-w-4xl`                                                                           |
| Stack gaps              | `gap-4 sm:gap-6 lg:gap-8` for page columns and the card grid                          |
| Form row gap            | `gap-3`; label-to-control `gap-1`; chip rows `gap-2`                                  |
| Between sections        | `mt-4`; under a section heading `mb-3` or `mb-4`; `<hr className="my-3 border-bold">` |
| Modal panel             | `max-w-md p-6`                                                                        |
| Pagination              | `max-w-xs gap-3`                                                                      |
| Controls, posters       | `rounded-md`                                                                          |
| Panels, sections, modal | `rounded-lg` (cards use `10px` in CSS)                                                |
| Chips, badges, avatars  | `rounded-full`                                                                        |
| Control borders         | `border-2 border-solid`; secondary button and chips use 1px `border`                  |

### Motion

A global rule in `global.css` transitions `background-color`, `color`, `border-color` and `fill` on every element over 0.25s. Theme switches and hover colour changes animate without any per-component class. Add `transition-all` or `transition-colors` only when you animate something else (Button transitions its gradient).

-  Cards: 250ms `cubic-bezier(0.1, 0.1, 0.6, 0.9)`, `scale(1.15)` plus a 5px poster blur, on hover and `focus-within`.
-  Detail titles: `position: sticky; top: 90px` with a scroll-driven `animation-timeline: scroll()` over the first 200px that grows the type and adds a background.
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

### Page roots

Every route renders `Navbar` (sticky, `top-0 z-10`) then an `Outlet`. The view chooses one of two roots, both of which apply the theme class:

-  **`Container`** — detail and utility pages (film, series, season, person, favourites, discover). `flex min-h-screen flex-col bg-neutral text-center`. Put content in a column: `mx-auto w-full max-w-4xl px-4 py-6 text-copy`, and reset alignment inside it (`text-left`) where you need it.
-  **`FlexContainer`** — list pages (`FilmList`). Adds the responsive page padding and an inner `flex w-full max-w-4xl flex-col gap-4 sm:gap-6 lg:gap-8` column.

### Page anatomy

**Detail pages** (film, series, season, person) share one skeleton:

1. `<div className="text-title text-copy">` — the sticky, scroll-animated title with a `data-testid="…-info-title"`.
2. `.container-bg` — hero with the backdrop as a fixed cover background and the poster centred, `rounded-lg`.
3. Stacked panels: `<div className="text-content mt-4 rounded-lg p-4 text-copy">`. The first holds the `h2 text-display-lg` title and tagline, genre badges, `<hr>` dividers, and fact rows with `<strong>` labels in a `tabular-nums` block. Later panels are titled with `h2 text-display-md mb-3` ("Cast & Crew", via `CastList`) and `mb-4` ("Recommendations", the card grid).

**List pages**: a centred `ViewToggle`, then either the card grid or `FilmTable`.

**Filter pages** (discover): `h1 text-display-lg`, then a `<form aria-label="…">` laid out `mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end`, each field a `flex flex-col gap-1 sm:w-*` with label above control, a status line `mt-4 text-sm tabular-nums text-copy/70` with `role="status"`, the results, and a `<nav aria-label="Pagination">` of a secondary "Previous" and a primary "Next" button.

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

Mobile first; the breakpoints in use are `sm` and `lg`, with `md` appearing rarely. Detail pages must stack on phones and never scroll horizontally. Tables are the exception: `FilmTable` wraps in a `.film-table__scroll` overflow container and tightens type and padding under 640px so four columns fit.

---

## 3. Components

Recipes as they exist in code. Copy the class strings; do not approximate them.

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

### Badge

Static labels such as genres or a status: `rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-wider text-copy/70` on `bg-primary-background-color`. Rows of badges are `flex flex-wrap items-center justify-center gap-2`.

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

TanStack Table, styled in `film-table.styles.css` with BEM classes: `.film-table__scroll` (horizontal overflow), `.film-table__table` (`bg-neutral`, tabular numerals), `.film-table__header` (left aligned, `nowrap`, 2px `border-bold` bottom rule, `0.5rem` padding), `.film-table__row:nth-child(even)` on `bg-subtle`, and `.film-table__cell` with only the title column allowed to wrap. Titles are underlined `text-copy` and turn `accent` on row-link hover. Under 640px the type drops to `0.875rem` and padding to `0.375rem`.

### SortableHeader — `atoms/sortable-header`

A `<th aria-sort="…">` whose whole content is a reset `<button>` (`.sortable-header__button`: inherits font and colour, no border, full width) followed by an `aria-hidden` glyph at `opacity: 0.6; font-size: 0.75em`. Focus ring: 2px accent, offset 2px, `border-radius: 2px`.

### ViewToggle — `atoms/view-toggle`

`react-aria-components` `ToggleButtonGroup` in single-selection mode, so it renders as a radiogroup with arrow-key navigation. Frame: `inline-flex`, 2px `border-bold`, `0.375rem` radius, hidden overflow. Buttons: `bg-neutral text-copy`, `font-weight: 500`, `0.25rem 0.75rem` padding, 2px `border-bold` separator; `[data-hovered]` → `bg-subtle`; `[data-selected]` → `bg-neutral-inverted` with text in `bg-neutral`; `[data-focus-visible]` → 2px accent outline, offset `-2px`.

### Search combobox — `layout/navbar/search-input`

`react-aria-components` `ComboBox`, BEM-styled in `search-input.styles.css`. Visually hidden label, `max-width: 16rem`, input `2px border-bold` on `bg-neutral` with room on the right for a scaled-down spinner and a clear button, and a popover `width: var(--trigger-width); max-height: 16rem` with a 1px `border-bold`, `bg-neutral`, and `0 6px 16px rgb(0 0 0 / .25)` shadow. Items are `flex … justify-between gap-2` rows (`0.5rem 0.75rem` padding) with a `0.875rem/500` title and a `0.75rem` year at `opacity: 0.7`; `[data-focused]` and `[data-hovered]` → `bg-subtle`. Empty state text is `0.875rem` at `opacity: 0.7`.

### NavLink and inline links — `atoms/link`

`NavLink` puts colour on a `<span>` inside the router `Link` — `font-display text-lg font-medium tracking-wide text-copy hover:text-accent` — because `index.css` forces `a, a:visited { color: black }` and a colour on the anchor itself would not survive `:visited` in dark mode. `MediaLink` chooses `/film/:id` or `/tv/:id` by media type; always use it for detail links.

Inline text links are `text-accent hover:underline`; back links are `text-sm text-accent hover:underline` prefixed with `←`.

### FavoriteButton — `atoms/favorite-button`

Icon-only `<button>` with `aria-label` "Add to favorites" / "Remove from favorites", `cursor-pointer disabled:opacity-50` plus whatever `className` the parent passes. The heart is a `h-7 w-7` SVG: `fill-accent stroke-accent` when favourited, `fill-accent/20 stroke-accent` when not. The navbar icons use the same fill and stroke pairing.

### CastList — `cast-list`

`flex flex-wrap justify-center gap-4` of `w-20` columns (`flex flex-col items-center gap-1 text-center text-inherit hover:text-accent`), each an avatar `h-16 w-16 rounded-full object-cover object-top`, a `font-display text-sm font-semibold leading-tight` name and a `text-xs leading-tight text-copy/70` role.

### Spinner — `atoms/spinner`

Five bouncing bars in `spinner.styles.css`, coloured with `--primary-background-color`, centred with `margin: 300px auto`. Rendered wherever a view waits on data.

### Empty and error states

Empty results: `<p className="px-4 text-copy/70">` with a sentence that suggests the next step ("Nothing matches those filters. Try a different genre or year."). Error and not-found views: a `p mb-8 p-4 font-display text-display-md font-semibold text-copy` message followed by a single outlined action.

---

## 4. Patterns

### Tailwind first, CSS file when it earns it

Write utilities in `className`. Create a co-located `<name>.styles.css`, imported as the first line of the component, when you need any of: pseudo-elements, keyframes or scroll-driven animation, react-aria data-attribute states, or a selector tree that would make the JSX unreadable. Name classes `block__element` with the component name as the block (`film-table__cell`, `search-combobox__item`). Reference tokens as `hsl(var(--color-x) / 1)`; the alpha slot is there so `/ 0.5` works too. Never write hex in a component stylesheet.

### Complex widgets use react-aria-components

Anything with selection, keyboard or popover semantics — comboboxes, toggle groups, and future menus or dialogs — is built on `react-aria-components` and styled through its data attributes: `[data-hovered]`, `[data-focused]`, `[data-focus-visible]`, `[data-selected]`, `[data-pressed]`. This is what gives ViewToggle its radiogroup role and the search box its listbox for free.

### Class strings

Prettier's Tailwind plugin sorts classes on commit; do not hand-order them. Build conditional classes with a template literal whose static part comes first and a ternary for the variant, as the chips do. Components accept an optional `className` and append it: `` `${base} ${className}`.trim() ``.

### Accessibility baseline

The jsx-a11y rules in `eslint.config.js` are mostly errors and block commits. Beyond them, the conventions in use: `role="group"` with `aria-label` on navigation groups; `aria-pressed` on toggle buttons and `aria-current="page"` on the active link in a set; `aria-sort` on sortable headers; `role="status"` on live result counts; visually hidden labels via the `.search-combobox__label` clip pattern; `alt` equal to the title on posters; interactive controls never inside an anchor.

### Media and numbers

Posters: `aspect-[1/1.5] w-full rounded-md object-cover object-center`, always `loading="lazy"`; use the `masonry` prop when a natural aspect ratio is wanted. Avatars: `h-16 w-16 rounded-full object-cover object-top`. Counts go through `toLocaleString()` and sit in `tabular-nums`.

---

## 5. Known divergences

Places where the code does not yet follow this guide. Fixing them is tracked in the roadmap.

-  **Discover** uses a `max-w-6xl` column where every other page uses `max-w-4xl`, inlines the Select recipe as a local string, and hand-rolls its type switch instead of a Chip atom.
-  **Error and not-found views** style their action with `border-blue-700 hover:bg-blue-900` instead of the Button primary recipe or the accent token.
-  **CastList** falls back to `bg-gray-400 text-white` for a missing avatar; it should be `bg-subtle text-copy`.
-  **Film detail** genre badges carry `bg-primary`, which is not a utility in this config and does nothing; they should use `bg-primary-background-color` like the badge recipe.
-  **Spinner** uses the legacy primary variable and a fixed `300px` margin rather than a token and flex centring.
-  **Legacy hex variables** still define control borders and panel backgrounds. They need semantic tokens (a `border-subtle` and a panel background) before they can be retired.
-  **Reduced motion** is not honoured anywhere; the card scale and the scroll-driven title need a `prefers-reduced-motion` guard.
