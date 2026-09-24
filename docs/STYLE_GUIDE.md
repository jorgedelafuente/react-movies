# React Movies - Style Guide

## Table of Contents

1. [Theming System](#theming-system)
2. [CSS Guidelines](#css-guidelines)
3. [Tailwind Guidelines](#tailwind-guidelines)
4. [Component Styling](#component-styling)
5. [File Structure](#file-structure)
6. [Linting & Code Quality](#linting--code-quality)
7. [Unit Testing with Vitest](#unit-testing-with-vitest)

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
--color-sky: 199 89% 48%; /* Tailwind sky-500, only referenced by --color-accent */
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
--color-accent: var(
   --color-sky
); /* Links, hover, focus rings, selected state; same in both themes */

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

**Accent (interactive colour, all namespaces):**

```tsx
text-accent  border-accent  bg-accent/10  fill-accent  stroke-accent  outline-accent
hover:text-accent  hover:border-accent/40  focus-visible:outline-accent
```

Never use `sky-*` directly. In a component `.css` file write `hsl(var(--color-accent) / 1)`.

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
| Accent / interactive  | `text-accent`, `border-accent`  | `var(--color-accent)`               |
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

## Unit Testing with Vitest

### Overview

The project uses **Vitest v4.0.18** for unit and integration testing of React components and utilities.

**Key Features:**

-  Vite-native test runner (fast, uses same config as dev server)
-  Jest-compatible API (easy migration from Jest)
-  React Testing Library integration
-  Coverage reports with Istanbul
-  Interactive UI mode

### Configuration

**Location:** `vite.config.ts` (shared with Vite config)

```typescript
/// <reference types="vitest/config" />

export default defineConfig({
   test: {
      globals: true, // Use global test APIs (describe, it, expect)
      environment: 'jsdom', // Simulate browser environment
      setupFiles: './src/tests/setupTests.ts',
      css: true, // Process CSS imports
      coverage: {
         provider: 'istanbul', // Code coverage tool
      },
      exclude: [...configDefaults.exclude, '.claude/**'],
   },
});
```

#### Key Settings Explained

-  **`globals: true`**: No need to import `describe`, `it`, `expect` in every test file
-  **`environment: 'jsdom'`**: Provides DOM APIs (`document`, `window`) for React testing
-  **`setupFiles`**: Runs before all tests (extends matchers, mocks `matchMedia`)
-  **`exclude`**: Keeps Vitest out of `.claude/` on top of the defaults

---

### Setup File

**Location:** `/src/tests/setupTests.ts`

```typescript
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';
import * as axeMatchers from 'vitest-axe/matchers';

expect.extend(matchers);
expect.extend(axeMatchers);

afterEach(() => {
   cleanup();
});

Object.defineProperty(globalThis, 'matchMedia', {
   writable: true,
   value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
   })),
});
```

**What it does:**

-  Adds Testing Library matchers (`.toBeInTheDocument()`, `.toBeVisible()`)
-  Auto-cleanup after each test (unmount components)
-  Mocks `matchMedia` for responsive design tests
-  Adds vitest-axe matchers (`.toHaveNoViolations()`)

---

### Running Tests

```bash
# Run all tests (watch mode)
pnpm test

# Run tests once, quiet output
pnpm test:silent

# Run with UI (interactive mode)
pnpm test:ui

# Run with coverage report
pnpm coverage

# Run specific test file
pnpm test counter.spec.tsx

# Run tests matching pattern
pnpm test --grep "Counter"
```

#### Available Scripts

```json
{
   "test": "vitest",
   "test:silent": "vitest --silent",
   "test:ui": "vitest --ui",
   "coverage": "vitest run --coverage"
}
```

---

### Existing Tests

The project has **8 test files** covering components, views, and hooks:

#### Component Tests

-  `/src/components/atoms/card/card.component.spec.tsx`
-  `/src/components/atoms/link/navlink.spec.tsx`
-  `/src/components/layout/navbar/search-input/search-input.spec.tsx`

#### View Tests

-  `/src/views/about/about.spec.tsx`
-  `/src/views/about/counter.spec.tsx`
-  `/src/views/film-info/film-info.spec.tsx`
-  `/src/views/film-list/film-list.spec.tsx`

---

### Test Patterns

#### 1. Basic Component Test

```tsx
import { render, screen } from '@testing-library/react';
import Counter from './counter.component';

describe('Counter Component', () => {
   it('renders counter title', () => {
      render(<Counter />);
      const title = screen.getByText(/current count:/i);
      expect(title).toBeInTheDocument();
   });

   it('renders increment button', () => {
      render(<Counter />);
      const button = screen.getByRole('button', { name: '👍 Increment' });
      expect(button).toBeInTheDocument();
   });
});
```

**Pattern:**

-  Use `render()` to mount component
-  Use `screen.getByRole()` or `screen.getByText()` to find elements
-  Use Testing Library matchers (`.toBeInTheDocument()`, `.toBeVisible()`)

---

#### 2. User Interaction Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './counter.component';

it('increments counter when button is clicked', () => {
   const { container } = render(<Counter />);
   const button = screen.getByText('👍 Increment');

   fireEvent.click(button);

   const countValue = container.querySelector('span');
   expect(countValue?.textContent).toBe('1');
});
```

**Pattern:**

-  Use `fireEvent.click()`, `fireEvent.change()`, etc. for interactions
-  Query updated DOM to verify changes
-  Use `.toHaveTextContent()` for text assertions

---

#### 3. Testing Custom Hooks

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useCounterHook } from './counter.component';

describe('useCounterHook', () => {
   it('renders initial count', () => {
      const { result } = renderHook(() => useCounterHook(1));
      expect(result.current.count).toBe(1);
   });

   it('increments count', async () => {
      const { result } = renderHook(() => useCounterHook(1));

      await waitFor(() => {
         result.current.increment();
      });

      expect(result.current.count).toBe(2);
   });
});
```

**Pattern:**

-  Use `renderHook()` to test hooks in isolation
-  Use `waitFor()` for async updates
-  Access hook values via `result.current`

---

#### 4. Testing with Props

```tsx
it('decrements counter when decrement is clicked', () => {
   render(<Counter countValue={0} />);

   const incrementButton = screen.getByRole('button', { name: '👍 Increment' });
   const decrementButton = screen.getByRole('button', { name: '👎 Decrement' });

   fireEvent.click(incrementButton);
   fireEvent.click(incrementButton);
   fireEvent.click(decrementButton);

   const counterValue = screen.container.querySelector('span');
   expect(counterValue).toHaveTextContent('1');
});
```

**Pattern:**

-  Pass props to `render()` like normal React usage
-  Test different prop combinations

---

#### 5. Mocking Functions

```tsx
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import Card from './card.component';

const mockHandler = vi.fn();

it('calls onClick when button is clicked', () => {
   const { getByText } = render(
      <Card>
         <button onClick={mockHandler}>Click me!</button>
      </Card>
   );

   const button = getByText('click me!');
   fireEvent.click(button);
   fireEvent.click(button);

   expect(mockHandler).toHaveBeenCalledTimes(2);
   expect(mockHandler.mock.calls).toHaveLength(2);
});
```

**Pattern:**

-  Use `vi.fn()` to create mock functions
-  Use `.toHaveBeenCalledTimes()`, `.toHaveBeenCalledWith()` to verify calls
-  Access call history via `.mock.calls`

---

#### 6. Testing Styles

```tsx
it('applies correct styles to elements', () => {
   const { getByText } = render(
      <Card>
         <div style={{ color: 'rgb(255,0,0)' }}>
            <button style={{ color: 'rgb(22, 22, 22)' }}>click me!</button>
         </div>
      </Card>
   );

   const button = getByText('click me!');
   expect(button).toHaveStyle('color: rgb(22,22,22)');
   expect(button.parentNode).toHaveStyle('color: rgb(255,0,0)');
});
```

**Pattern:**

-  Use `.toHaveStyle()` to verify inline styles
-  Pass CSS property strings to matcher

---

### Mocking the Service Layer

Tests never reach the network. Instead of intercepting HTTP, mock the module in `src/services/` that the component or hook imports, so the test controls exactly what the data layer returns.

#### Supabase example (from `useFavorites.spec.tsx`)

```tsx
vi.mock('@/services/supabase/favorites', () => ({
   getUserFavorites: vi.fn(),
   addFavorite: vi.fn(),
   removeFavorite: vi.fn(),
}));

import { getUserFavorites } from '@/services/supabase/favorites';

beforeEach(() => {
   vi.mocked(getUserFavorites).mockResolvedValue({ data: [], error: null });
});
```

#### TMDB example

```tsx
import { MOCK_FILM_LIST } from '@/tests/__mocks__/mocks';
import { FilmListSchema } from '@/types/films.schemas';

vi.mock('@/services/films/films', () => ({
   fetchPopularFilms: vi.fn(),
}));

import { fetchPopularFilms } from '@/services/films/films';

it('handles API error', async () => {
   vi.mocked(fetchPopularFilms).mockRejectedValue(new Error('Network'));
   renderWithQueryContext(<PopularPage />);
   await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeVisible();
   });
});
```

**Pattern:**

-  `vi.mock` the service module at the top of the spec; import the mocked functions after the mock call
-  Use `vi.mocked(fn).mockResolvedValue(...)` per test to shape the response
-  Parse shared mock data through the Zod schema (`FilmListSchema.parse(MOCK_FILM_LIST)`) so it matches what the real fetcher returns
-  Prefer passing data as props when the component does not fetch (see `film-list.spec.tsx`)

---

### Testing Library Queries

#### Query Priority (Best to Worst)

1. **`getByRole()`** - Best for accessibility (queries by ARIA role)

   ```tsx
   screen.getByRole('button', { name: 'Submit' });
   screen.getByRole('heading', { level: 1 });
   ```

2. **`getByLabelText()`** - Good for form inputs

   ```tsx
   screen.getByLabelText('Email');
   ```

3. **`getByPlaceholderText()`** - OK for inputs without labels

   ```tsx
   screen.getByPlaceholderText('Search...');
   ```

4. **`getByText()`** - Good for non-interactive content

   ```tsx
   screen.getByText('Welcome back');
   screen.getByText(/welcome/i); // Case-insensitive regex
   ```

5. **`getByTestId()`** - Last resort (requires adding test IDs to code)
   ```tsx
   screen.getByTestId('submit-button');
   ```

#### Query Variants

-  **`getBy`**: Throws error if not found (use for assertions)
-  **`queryBy`**: Returns `null` if not found (use to check absence)
-  **`findBy`**: Async, waits for element (use for delayed appearance)

```tsx
// Element must exist
const button = screen.getByRole('button');

// Element might not exist
const error = screen.queryByText('Error');
expect(error).not.toBeInTheDocument();

// Wait for async element
const data = await screen.findByText('Loaded data');
```

---

### Common Matchers

#### Existence & Visibility

```tsx
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).not.toBeInTheDocument();
```

#### Text Content

```tsx
expect(element).toHaveTextContent('Hello');
expect(element).toContainHTML('<span>Hello</span>');
```

#### Attributes

```tsx
expect(input).toHaveValue('test@example.com');
expect(input).toHaveAttribute('type', 'email');
expect(checkbox).toBeChecked();
expect(button).toBeDisabled();
```

#### Styles

```tsx
expect(element).toHaveStyle('color: red');
expect(element).toHaveClass('active');
```

#### Form Interactions

```tsx
expect(input).toHaveFocus();
expect(form).toHaveFormValues({ email: 'test@test.com' });
```

---

### Best Practices

#### 1. Test User Behavior, Not Implementation

**DON'T:**

```tsx
// ❌ Testing internal state
expect(component.state.count).toBe(1);

// ❌ Testing CSS classes
expect(button).toHaveClass('btn-primary');
```

**DO:**

```tsx
// ✅ Test what user sees
expect(screen.getByText('Count: 1')).toBeVisible();

// ✅ Test visual result
expect(button).toHaveStyle('background-color: blue');
```

#### 2. Use Semantic Queries

**DON'T:**

```tsx
// ❌ Fragile CSS selectors
container.querySelector('.btn-submit');

// ❌ Test IDs everywhere
screen.getByTestId('submit-button');
```

**DO:**

```tsx
// ✅ Accessible queries
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email');
```

#### 3. Avoid Implementation Details

**DON'T:**

```tsx
// ❌ Testing component internals
expect(wrapper.find('InternalComponent')).toExist();

// ❌ Checking function calls
expect(handleClick).toHaveBeenCalled(); // Unless testing callbacks
```

**DO:**

```tsx
// ✅ Test observable behavior
expect(screen.getByText('Success!')).toBeVisible();
```

#### 4. Keep Tests Simple

**DON'T:**

```tsx
// ❌ Too much setup, testing too many things
it('does everything', () => {
   // 50 lines of setup
   // Tests 10 different behaviors
});
```

**DO:**

```tsx
// ✅ One behavior per test
it('shows success message after submit', () => {
   // Focused setup
   // Single assertion
});
```

#### 5. Use `waitFor` for Async Updates

**DON'T:**

```tsx
// ❌ Race condition
fireEvent.click(button);
expect(screen.getByText('Loaded')).toBeVisible(); // Might fail
```

**DO:**

```tsx
// ✅ Wait for async update
fireEvent.click(button);
await waitFor(() => {
   expect(screen.getByText('Loaded')).toBeVisible();
});
```

---

### Coverage Reports

```bash
# Generate coverage report
pnpm coverage

# View HTML report
open coverage/index.html
```

**Coverage thresholds** (configure in `vite.config.ts`):

```typescript
test: {
  coverage: {
    provider: 'istanbul',
    reporter: ['text', 'html', 'json'],
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
},
```

---

### File Organization

```
src/
├── components/
│   └── atoms/
│       └── card/
│           ├── card.component.tsx
│           └── card.component.spec.tsx    # Co-located tests
├── views/
│   └── about/
│       ├── about.view.tsx
│       ├── about.spec.tsx
│       ├── counter.component.tsx
│       └── counter.spec.tsx
└── tests/
    ├── setupTests.ts                      # Global test setup
    └── fixtures/                          # Shared test data
        └── mockData.ts
```

**Naming convention:** `*.spec.tsx` or `*.test.tsx` (both work)

---

### Interactive UI Mode

```bash
pnpm test:ui
```

**Features:**

-  Visual test runner in browser
-  Filter and search tests
-  See pass/fail status in real-time
-  View console logs and errors
-  Re-run individual tests
-  Code coverage visualization

---

### Debugging Tests

#### 1. Console Logs

```tsx
it('debugs component output', () => {
   const { container } = render(<Counter />);

   // Print rendered HTML
   screen.debug();

   // Print specific element
   screen.debug(screen.getByRole('button'));

   // Print entire DOM
   console.log(container.innerHTML);
});
```

#### 2. VS Code Debugging

Add to `.vscode/launch.json`:

```json
{
   "type": "node",
   "request": "launch",
   "name": "Debug Vitest",
   "runtimeExecutable": "node",
   "runtimeArgs": [
      "test",
      "--run",
      "--inspect-brk",
      "--no-file-parallelization"
   ],
   "console": "integratedTerminal"
}
```

#### 3. Vitest UI

Use `pnpm test:ui` for visual debugging with hot reload.

---

### Common Issues & Fixes

#### 1. `document is not defined`

```bash
# Error: ReferenceError: document is not defined
```

**Fix:** Ensure `environment: 'jsdom'` is set in `vite.config.ts`

#### 2. CSS Import Errors

```bash
# Error: Failed to parse CSS
```

**Fix:** Ensure `css: true` is set in test config

#### 3. Module Not Found

```bash
# Error: Cannot find module '@/components/...'
```

**Fix:** Ensure `vite-tsconfig-paths` plugin is installed and path aliases are configured

#### 4. Async Updates Not Working

```tsx
// ❌ Fails intermittently
fireEvent.click(button);
expect(screen.getByText('Updated')).toBeVisible();

// ✅ Waits for update
fireEvent.click(button);
await waitFor(() => {
   expect(screen.getByText('Updated')).toBeVisible();
});
```

---

### Quick Reference

**Essential Commands:**

```bash
pnpm test           # Watch mode
pnpm test:silent          # Run once
pnpm test:ui           # Interactive UI
pnpm coverage          # Coverage report
```

**Common Queries:**

```tsx
screen.getByRole('button', { name: 'Submit' });
screen.getByLabelText('Email');
screen.getByText(/welcome/i);
screen.getByPlaceholderText('Search...');
```

**Common Actions:**

```tsx
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });
fireEvent.submit(form);
```

**Common Matchers:**

```tsx
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveValue('value');
expect(mockFn).toHaveBeenCalledTimes(2);
```
