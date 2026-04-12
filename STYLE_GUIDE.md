# React Movies - Style Guide

## Table of Contents

1. [Theming System](#theming-system)
2. [CSS Guidelines](#css-guidelines)
3. [Tailwind Guidelines](#tailwind-guidelines)
4. [Component Styling](#component-styling)
5. [File Structure](#file-structure)
6. [Linting & Code Quality](#linting--code-quality)

---

## Theming System

### Overview

The project uses a **dual-layer theming system**:

-  **CSS Custom Properties** for semantic tokens
-  **Tailwind utility classes** that reference these tokens

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
</div>;
```

### Color Token System

#### CSS Custom Properties (`/src/styles/global.css`)

**Raw Color Palette (HSL format):**

```css
--color-grey-0: 0 0% 100%; /* White */
--color-grey-10: 0 0% 85%;
--color-grey-20: 0 0% 76%;
--color-grey-30: 0 0% 67%;
--color-grey-40: 0 0% 57%;
--color-grey-50: 0 0% 47%;
--color-grey-60: 0 0% 38%;
--color-grey-70: 0 0% 29%;
--color-grey-80: 0 0% 19%;
--color-grey-90: 0 0% 9%;
--color-grey-100: 0 0% 0%; /* Black */
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
--color-bg-neutral: var(--color-grey-0); /* White background */
--color-bg-neutral-inverted: var(--color-grey-100); /* Black */
--color-border-bold: var(--color-grey-60); /* Medium grey */
--color-text-copy: var(--color-grey-100); /* Black text */

/* Dark Mode (.dark class) */
--color-bg-neutral: var(--color-grey-100); /* Black background */
--color-bg-neutral-inverted: var(--color-grey-0); /* White */
--color-border-bold: var(--color-grey-40); /* Light grey */
--color-text-copy: var(--color-grey-0); /* White text */
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
bg - primary - background - color;
bg - secondary - background - color;
bg - tertiary - background - color;
border - secondary - background - color;
```

---

## CSS Guidelines

### When to Use CSS Files

Create a `.css` file when:

-  ✅ Component needs complex animations (keyframes)
-  ✅ Component needs pseudo-elements (`:before`, `:after`)
-  ✅ Component needs deeply nested selectors
-  ✅ Component styling is complex and would clutter JSX

### Naming Conventions

**CSS Classes:**

-  Use kebab-case: `.custom-card`, `.text-title`
-  Prefix component-specific classes: `.navbar-icon`, `.card-content`
-  Keep names descriptive and semantic

**CSS Files:**

-  Name after component: `component-name.styles.css`
-  Place in same directory as component

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
   background-color: #dedede; /* ❌ Hard-coded color */
   color: black; /* ❌ Won't adapt to dark mode */
}
```

### Responsive Design

-  Use media queries for complex responsive logic
-  Prefer Tailwind responsive utilities for simple cases

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
10.   **Responsive**: `md:*`, `lg:*`
11.   **Dark mode**: `dark:*`

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
bg - neutral; // Primary background
bg - neutral - inverted; // Inverted background (for hover states)
```

**Text:**

```tsx
text - copy; // Primary text color
```

**Borders:**

```tsx
border - bold; // Standard border color
```

**Legacy (for existing code):**

```tsx
bg - primary - background - color;
bg - secondary - background - color;
bg - tertiary - background - color;
border - secondary - background - color;
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
   <button className="rounded-md bg-sky-500 px-4 py-2 font-medium text-white hover:bg-sky-600 disabled:opacity-50">
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
      <div className="content">{children}</div>
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
      <div
         className={` ${theme === THEME_OPTIONS.DARK ? 'dark' : ''} navbar sticky top-0 z-10 border-b-2 border-solid border-secondary-background-color bg-primary-background-color text-copy`}
      >
         {/* content */}
      </div>
   );
};
```

### Input Styling Pattern

All inputs should follow this pattern for consistency:

```tsx
<input className="w-full rounded-md border-2 border-solid border-secondary-background-color bg-neutral px-2 py-2 text-copy focus:border-sky-500 focus:outline-none" />
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

## Linting & Code Quality

### Overview

The project uses a **comprehensive toolchain** for code quality:

-  **ESLint v9** - Linting (TypeScript, React, Accessibility)
-  **Prettier v3** - Code formatting
-  **PostCSS v8** - CSS processing (required for Tailwind)
-  **TypeScript v6** - Type checking

### Running Tools

```bash
# ESLint - Find code issues
pnpm lint

# Prettier - Format all files
pnpm format

# TypeScript - Type check
tsc --noEmit

# Build (includes type check)
pnpm build
```

---

### ESLint Configuration

**Location:** `eslint.config.js` (Flat Config format)
**Version:** ESLint v9.39.4

#### Plugins Enabled

1. **TypeScript ESLint** - Type-aware linting
2. **React Hooks** - Hooks rules
3. **React Refresh** - Fast refresh validation
4. **jsx-a11y** - Accessibility (axe-core style)
5. **TanStack Query** - Query hooks best practices

#### Key Rules

**TypeScript:**

-  `@typescript-eslint/no-unused-vars`: Warn (allow `_` prefix)
-  `@typescript-eslint/no-explicit-any`: Warn (prefer specific types)
-  `@typescript-eslint/no-unused-expressions`: Error (except short-circuit/ternary)

**React Hooks:**

-  `react-hooks/rules-of-hooks`: Error (hooks must be called consistently)
-  `react-hooks/exhaustive-deps`: Warn (useEffect dependencies)

**Accessibility (30+ rules):**

-  ✅ `alt-text`: Error - Images must have alt text
-  ✅ `aria-props`: Error - Valid ARIA attributes
-  ✅ `label-has-associated-control`: Error - Form labels required
-  ✅ `click-events-have-key-events`: Warn - Keyboard accessibility
-  ✅ `interactive-supports-focus`: Warn - Focusable interactive elements
-  ⚠️ `no-autofocus`: Warn (allowed but discouraged)
-  ⚠️ `tabindex-no-positive`: Warn (use 0 or -1)

**See `eslint.config.js` for complete rule list**

---

### Common Linting Issues & Fixes

#### 1. Missing Dependencies in useEffect

```tsx
// ❌ BAD - Missing dependency warning
useEffect(() => {
  fetchData();
}, []); // 'fetchData' is missing

// ✅ GOOD - Include all dependencies
useEffect(() => {
  fetchData();
}, [fetchData]);

// ✅ GOOD - Or wrap in useCallback
const fetchData = useCallback(() => { ... }, []);
useEffect(() => {
  fetchData();
}, [fetchData]);
```

#### 2. Accessibility - Click Without Keyboard

```tsx
// ❌ BAD - Click without keyboard event
<div onClick={handleClick}>Click me</div>

// ✅ GOOD - Use button
<button onClick={handleClick}>Click me</button>

// ✅ GOOD - Add keyboard handler + ARIA
<div
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabIndex={0}
>
  Click me
</div>
```

#### 3. Positive tabIndex Values

```tsx
// ❌ BAD - Positive tabindex disrupts natural tab order
<button tabIndex={1}>First</button>
<button tabIndex={2}>Second</button>

// ✅ GOOD - Let natural tab order work
<button>First</button>
<button>Second</button>

// ✅ GOOD - Use 0 to include in natural order
<div role="button" tabIndex={0}>Interactive</div>

// ✅ GOOD - Use -1 to exclude from tab order
<div tabIndex={-1}>Not tabbable</div>
```

#### 4. Redundant ARIA Roles

```tsx
// ❌ BAD - Button already has implicit role="button"
<button role="button">Click</button>

// ✅ GOOD - Remove redundant role
<button>Click</button>

// ✅ GOOD - Only add role when changing semantics
<div role="button" tabIndex={0}>Click</div>
```

#### 5. React Hooks Called Conditionally

```tsx
// ❌ BAD - Hook called after early return
function Component({ data }) {
  if (!data) return null; // Early return

  const [state, setState] = useState(); // ❌ Called conditionally
  useEffect(() => { ... });             // ❌ Called conditionally
}

// ✅ GOOD - Hooks before any returns
function Component({ data }) {
  const [state, setState] = useState();

  useEffect(() => {
    if (data) { ... }
  }, [data]);

  if (!data) return null;

  return <div>{state}</div>;
}
```

---

### Prettier Configuration

**Location:** `.prettierrc`
**Version:** prettier@3.3.3

```json
{
   "semi": true,
   "singleQuote": true,
   "tabWidth": 3,
   "trailingComma": "es5",
   "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### Rules Explained

-  **`semi: true`** - Always add semicolons
-  **`singleQuote: true`** - Use single quotes for strings
-  **`tabWidth: 3`** - 3 spaces per indentation level
-  **`trailingComma: "es5"`** - Trailing commas where valid in ES5
-  **`prettier-plugin-tailwindcss`** - Auto-sorts Tailwind classes

#### How Tailwind Sorting Works

**Before formatting:**

```tsx
<div className="text-white p-4 bg-sky-500 flex rounded-md hover:bg-sky-600">
```

**After `pnpm format`:**

```tsx
<div className="flex rounded-md bg-sky-500 p-4 text-white hover:bg-sky-600">
```

Classes are sorted according to Tailwind's recommended order.

---

### PostCSS Configuration

**Location:** `vite.config.ts`
**Version:** postcss@^8.5.8

```ts
css: {
   postcss: {
      plugins: [tailwindcss(), autoprefixer()],
   },
},
```

#### Why PostCSS is Required

1. **Tailwind CSS dependency** - Tailwind requires PostCSS to work
2. **Processes directives** - Converts `@tailwind base` to actual CSS
3. **Autoprefixer** - Adds vendor prefixes for browser compatibility

**Cannot be removed** unless you remove Tailwind CSS.

---

### TypeScript Configuration

**Location:** `tsconfig.json`
**Version:** typescript@6.0.2

```bash
# Type check without building
tsc --noEmit

# Type check + build
pnpm build
```

#### Integration with ESLint

TypeScript and ESLint work together via `@typescript-eslint`:

-  ESLint catches **logical errors** (unused vars, bad patterns)
-  TypeScript catches **type errors** (wrong types, missing properties)

Both should pass before committing.

---

### Workflow Recommendations

#### Before Committing

```bash
# 1. Format code
pnpm format

# 2. Check linting
pnpm lint

# 3. Check types (happens during build)
pnpm build
```

#### Git Pre-commit Hook (Optional)

Consider adding to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
pnpm format
pnpm lint
```

Or use **husky** + **lint-staged** for automatic enforcement.

---

### Ignored Files

**ESLint ignores** (`.eslintignore`):

```
dist/
node_modules/
coverage/
*.config.js
*.config.ts
src/routeTree.gen.ts
```

**Prettier ignores** (automatic):

-  Same as ESLint
-  Plus: `pnpm-lock.yaml`, `package-lock.json`

---

## Quick Reference

### Color Token Cheatsheet

| Usage                 | Tailwind Class                  | CSS Variable                        |
| --------------------- | ------------------------------- | ----------------------------------- |
| Primary background    | `bg-neutral`                    | `var(--color-bg-neutral)`           |
| Inverted background   | `bg-neutral-inverted`           | `var(--color-bg-neutral-inverted)`  |
| Primary text          | `text-copy`                     | `var(--color-text-copy)`            |
| Borders               | `border-bold`                   | `var(--color-border-bold)`          |
| Legacy bg (primary)   | `bg-primary-background-color`   | `var(--primary-background-color)`   |
| Legacy bg (secondary) | `bg-secondary-background-color` | `var(--secondary-background-color)` |
| Legacy bg (tertiary)  | `bg-tertiary-background-color`  | `var(--tertiary-background-color)`  |

### Common Patterns

**Button:**

```tsx
className = 'px-4 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600';
```

**Input:**

```tsx
className =
   'bg-neutral text-copy border-2 border-solid border-secondary-background-color px-2 py-2 rounded-md focus:border-sky-500 focus:outline-none';
```

**Card Container:**

```tsx
className = 'bg-neutral border-2 border-solid border-bold rounded-lg p-4';
```

**Text:**

```tsx
className = 'text-copy text-sm';
```

---

## Rationale

### Why This System?

**CSS Variables + Tailwind:**

-  ✅ Single source of truth for colors
-  ✅ Automatic dark mode switching
-  ✅ No duplicate dark mode classes
-  ✅ Easy to maintain and update

**Class-based Dark Mode:**

-  ✅ Full control over when dark mode is applied
-  ✅ Works with component-level theme state
-  ✅ No media query restrictions

**Semantic Tokens:**

-  ✅ Intent is clear (`bg-neutral` vs `bg-white`)
-  ✅ Adapts automatically to theme changes
-  ✅ Easier to refactor and maintain

---

**Last Updated:** 2026-04-12
