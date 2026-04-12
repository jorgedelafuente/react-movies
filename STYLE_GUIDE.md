# React Movies - Style Guide

## Table of Contents
1. [Theming System](#theming-system)
2. [CSS Guidelines](#css-guidelines)
3. [Tailwind Guidelines](#tailwind-guidelines)
4. [Component Styling](#component-styling)
5. [File Structure](#file-structure)

---

## Theming System

### Overview
The project uses a **dual-layer theming system**:
- **CSS Custom Properties** for semantic tokens
- **Tailwind utility classes** that reference these tokens

### Dark Mode Implementation

#### How It Works
1. Zustand store (`useTheme`) manages theme state (`DARK` | `LIGHT`)
2. Components apply the `dark` class to their root element when theme is dark
3. CSS custom properties automatically switch via `.dark` selector
4. Tailwind's `dark:` variant respects the class-based dark mode

#### Example Pattern
```tsx
const theme = useTheme((state) => state.theme);

<div className={`${theme === THEME_OPTIONS.DARK ? 'dark' : ''} ...`}>
  {/* content */}
</div>
```

### Color Token System

#### CSS Custom Properties (`/src/styles/global.css`)

**Raw Color Palette (HSL format):**
```css
--color-grey-0: 0 0% 100%;    /* White */
--color-grey-10: 0 0% 85%;
--color-grey-20: 0 0% 76%;
--color-grey-30: 0 0% 67%;
--color-grey-40: 0 0% 57%;
--color-grey-50: 0 0% 47%;
--color-grey-60: 0 0% 38%;
--color-grey-70: 0 0% 29%;
--color-grey-80: 0 0% 19%;
--color-grey-90: 0 0% 9%;
--color-grey-100: 0 0% 0%;    /* Black */
```

**Legacy Background Variables (Hex format):**
```css
/* Light Mode */
--primary-background-color: #dedede;
--secondary-background-color: #a6a6a6;
--tertiary-background-color: #737373;

/* Dark Mode (.dark class) */
--primary-background-color: #141414;
--secondary-background-color: #282828;
--tertiary-background-color: #323232;
```

**Semantic Tokens (Theme-aware):**
```css
/* Light Mode */
--color-bg-neutral: var(--color-grey-0);           /* White background */
--color-bg-neutral-inverted: var(--color-grey-100); /* Black */
--color-border-bold: var(--color-grey-60);          /* Medium grey */
--color-text-copy: var(--color-grey-100);           /* Black text */

/* Dark Mode (.dark class) */
--color-bg-neutral: var(--color-grey-100);          /* Black background */
--color-bg-neutral-inverted: var(--color-grey-0);   /* White */
--color-border-bold: var(--color-grey-40);          /* Light grey */
--color-text-copy: var(--color-grey-0);             /* White text */
```

#### Tailwind Token Mapping

**Background Colors:**
```tsx
bg-neutral              → hsl(var(--color-bg-neutral))
bg-neutral-inverted     → hsl(var(--color-bg-neutral-inverted))
```

**Border Colors:**
```tsx
border-bold             → hsl(var(--color-border-bold))
```

**Text Colors:**
```tsx
text-copy               → hsl(var(--color-text-copy))
```

**Legacy Colors (use for existing code only):**
```tsx
bg-primary-background-color
bg-secondary-background-color
bg-tertiary-background-color
border-secondary-background-color
```

---

## CSS Guidelines

### When to Use CSS Files

Create a `.css` file when:
- ✅ Component needs complex animations (keyframes)
- ✅ Component needs pseudo-elements (`:before`, `:after`)
- ✅ Component needs deeply nested selectors
- ✅ Component styling is complex and would clutter JSX

### Naming Conventions

**CSS Classes:**
- Use kebab-case: `.custom-card`, `.text-title`
- Prefix component-specific classes: `.navbar-icon`, `.card-content`
- Keep names descriptive and semantic

**CSS Files:**
- Name after component: `component-name.styles.css`
- Place in same directory as component

### CSS Variable Usage

**DO:**
```css
.my-component {
   background-color: var(--primary-background-color);
   color: var(--color-text-copy);
   border-color: var(--color-border-bold);
}
```

**DON'T:**
```css
.my-component {
   background-color: #dedede;  /* ❌ Hard-coded color */
   color: black;               /* ❌ Won't adapt to dark mode */
}
```

### Responsive Design
- Use media queries for complex responsive logic
- Prefer Tailwind responsive utilities for simple cases

```css
@media only screen and (max-width: 600px) {
   .text-content {
      width: 90%;
      margin: 0 auto;
   }
}
```

---

## Tailwind Guidelines

### Class Order Convention

Follow this order for consistency:
1. **Layout**: `flex`, `grid`, `block`, `inline`, `hidden`
2. **Positioning**: `relative`, `absolute`, `fixed`, `sticky`
3. **Display & Sizing**: `w-*`, `h-*`, `max-w-*`, `min-h-*`
4. **Spacing**: `m-*`, `p-*`, `gap-*`, `space-*`
5. **Typography**: `text-*`, `font-*`, `leading-*`
6. **Borders**: `border-*`, `rounded-*`
7. **Colors**: `bg-*`, `text-*`, `border-*`
8. **Effects**: `shadow-*`, `opacity-*`, `transition-*`
9. **Interactivity**: `hover:*`, `focus:*`, `active:*`
10. **Responsive**: `md:*`, `lg:*`
11. **Dark mode**: `dark:*`

**Example:**
```tsx
<div className="
  flex items-center justify-center
  relative z-10
  w-full max-w-sm
  p-6 gap-3
  text-copy text-sm font-medium
  border-2 border-solid border-secondary-background-color rounded-lg
  bg-neutral
  shadow-2xl
  hover:bg-neutral-inverted
  md:w-1/2
">
```

### Required Tailwind Utilities

**Always use these semantic tokens:**

**Backgrounds:**
```tsx
bg-neutral              // Primary background
bg-neutral-inverted     // Inverted background (for hover states)
```

**Text:**
```tsx
text-copy               // Primary text color
```

**Borders:**
```tsx
border-bold             // Standard border color
```

**Legacy (for existing code):**
```tsx
bg-primary-background-color
bg-secondary-background-color
bg-tertiary-background-color
border-secondary-background-color
```

### Dark Mode with Tailwind

**DON'T use `dark:` variant for colors:**
```tsx
// ❌ BAD - Requires manual dark mode handling
<div className="bg-white dark:bg-black text-black dark:text-white">
```

**DO use semantic tokens that adapt automatically:**
```tsx
// ✅ GOOD - Automatically adapts via CSS variables
<div className="bg-neutral text-copy">
```

**Exception:** Use `dark:` for non-color properties
```tsx
// ✅ OK - Structural changes in dark mode
<div className="opacity-80 dark:opacity-100">
```

### Responsive Breakpoints

```tsx
sm:   640px   // Mobile landscape
md:   768px   // Tablet
lg:   1024px  // Desktop
xl:   1280px  // Large desktop
2xl:  1536px  // Extra large
```

**Example:**
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

---

## Component Styling

### Styling Decision Tree

```
Does the component need complex CSS?
├── YES → Create .css file
│   ├── Animations/keyframes
│   ├── Pseudo-elements
│   ├── Complex selectors
│   └── Nested hover states
│
└── NO → Use Tailwind classes
    ├── Simple layouts
    ├── Spacing
    ├── Colors (via tokens)
    └── Basic responsive design
```

### Component Examples

#### Tailwind Only (Simple Component)
```tsx
const Button = ({ children }) => (
  <button className="
    px-4 py-2 rounded-md
    bg-sky-500 text-white
    font-medium
    hover:bg-sky-600
    disabled:opacity-50
  ">
    {children}
  </button>
);
```

#### CSS + Tailwind (Complex Component)
```tsx
// card.component.tsx
import './card.styles.css';

const Card = ({ children }) => (
  <div className="custom-card">
    <div className="content">
      {children}
    </div>
  </div>
);
```

```css
/* card.styles.css */
.custom-card {
   transition: all 250ms ease-in-out;
   transition-timing-function: cubic-bezier(0.1, 0.1, 0.6, 0.9);
}

.custom-card:hover {
   transform: scale(1.15);
}

.custom-card:hover .content {
   opacity: 1;
}
```

#### Theme-Aware Component
```tsx
const Navbar = () => {
   const theme = useTheme((state) => state.theme);
   
   return (
      <div className={`
         ${theme === THEME_OPTIONS.DARK ? 'dark' : ''}
         navbar sticky top-0 z-10
         bg-primary-background-color
         border-b-2 border-solid border-secondary-background-color
         text-copy
      `}>
         {/* content */}
      </div>
   );
};
```

### Input Styling Pattern

All inputs should follow this pattern for consistency:

```tsx
<input className="
  bg-neutral text-copy
  w-full
  border-2 border-solid border-secondary-background-color
  px-2 py-2
  rounded-md
  focus:border-sky-500 focus:outline-none
" />
```

### Modal/Dialog Styling

Native `<dialog>` elements should use:
```tsx
<dialog className="
  m-auto                    // Centers vertically + horizontally
  w-full max-w-sm
  rounded-lg
  border-2 border-solid border-secondary-background-color
  bg-neutral
  p-6
  shadow-2xl
  backdrop:bg-black/50      // Styles native ::backdrop
">
```

---

## File Structure

### Component File Organization

```
component-name/
├── component-name.component.tsx    // Component logic
├── component-name.styles.css       // Custom styles (if needed)
└── component-name.spec.tsx         // Tests (if present)
```

### Style File Locations

```
src/
├── styles/
│   ├── global.css          // CSS custom properties & theming
│   ├── scrollbar.css       // Global scrollbar styles
│   └── index.css           // Tailwind imports
├── components/
│   └── atoms/
│       └── card/
│           ├── card.component.tsx
│           └── card.styles.css
└── views/
    └── film-info/
        ├── film-info.view.tsx
        └── film-info.styles.css
```

---

## Migration Guidelines

### Updating Legacy Code

When touching existing code:

**Replace hard-coded colors:**
```tsx
// ❌ BEFORE
<div className="bg-white text-black border-gray-500">

// ✅ AFTER
<div className="bg-neutral text-copy border-bold">
```

**Replace inline styles with CSS variables:**
```tsx
// ❌ BEFORE
<div style={{ backgroundColor: '#dedede' }}>

// ✅ AFTER
<div className="bg-neutral">
// OR if inline style is necessary:
<div style={{ backgroundColor: 'var(--primary-background-color)' }}>
```

### Adding New Components

1. **Start with Tailwind** - Use utility classes first
2. **Extract to CSS if needed** - Only when complexity warrants it
3. **Use semantic tokens** - Never hard-code colors
4. **Test dark mode** - Verify component in both themes

---

## Quick Reference

### Color Token Cheatsheet

| Usage | Tailwind Class | CSS Variable |
|-------|---------------|--------------|
| Primary background | `bg-neutral` | `var(--color-bg-neutral)` |
| Inverted background | `bg-neutral-inverted` | `var(--color-bg-neutral-inverted)` |
| Primary text | `text-copy` | `var(--color-text-copy)` |
| Borders | `border-bold` | `var(--color-border-bold)` |
| Legacy bg (primary) | `bg-primary-background-color` | `var(--primary-background-color)` |
| Legacy bg (secondary) | `bg-secondary-background-color` | `var(--secondary-background-color)` |
| Legacy bg (tertiary) | `bg-tertiary-background-color` | `var(--tertiary-background-color)` |

### Common Patterns

**Button:**
```tsx
className="px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600"
```

**Input:**
```tsx
className="bg-neutral text-copy border-2 border-solid border-secondary-background-color px-2 py-2 rounded-md focus:border-sky-500 focus:outline-none"
```

**Card Container:**
```tsx
className="bg-neutral border-2 border-solid border-bold rounded-lg p-4"
```

**Text:**
```tsx
className="text-copy text-sm"
```

---

## Rationale

### Why This System?

**CSS Variables + Tailwind:**
- ✅ Single source of truth for colors
- ✅ Automatic dark mode switching
- ✅ No duplicate dark mode classes
- ✅ Easy to maintain and update

**Class-based Dark Mode:**
- ✅ Full control over when dark mode is applied
- ✅ Works with component-level theme state
- ✅ No media query restrictions

**Semantic Tokens:**
- ✅ Intent is clear (`bg-neutral` vs `bg-white`)
- ✅ Adapts automatically to theme changes
- ✅ Easier to refactor and maintain

---

**Last Updated:** 2026-04-12
