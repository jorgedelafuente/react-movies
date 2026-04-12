# React Movies - Style Guide

## Table of Contents

1. [Theming System](#theming-system)
2. [CSS Guidelines](#css-guidelines)
3. [Tailwind Guidelines](#tailwind-guidelines)
4. [Component Styling](#component-styling)
5. [File Structure](#file-structure)
6. [Linting & Code Quality](#linting--code-quality)
7. [Unit Testing with Vitest](#unit-testing-with-vitest)
8. [End-to-End Testing with Playwright](#end-to-end-testing-with-playwright)
9. [GitHub Actions Integration](#github-actions-integration)

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

## Unit Testing with Vitest

### Overview

The project uses **Vitest v4.0.18** for unit and integration testing of React components and utilities.

**Key Features:**
- Vite-native test runner (fast, uses same config as dev server)
- Jest-compatible API (easy migration from Jest)
- React Testing Library integration
- MSW (Mock Service Worker) for API mocking
- Coverage reports with Istanbul
- Interactive UI mode

### Configuration

**Location:** `vite.config.ts` (shared with Vite config)

```typescript
/// <reference types="vitest/config" />

export default defineConfig({
  test: {
    globals: true,                    // Use global test APIs (describe, it, expect)
    environment: 'jsdom',             // Simulate browser environment
    setupFiles: './src/tests/setupTests.ts',
    css: true,                        // Process CSS imports
    coverage: {
      provider: 'istanbul',           // Code coverage tool
    },
    exclude: [
      ...configDefaults.exclude,
      'src/tests/e2e/*'               // Exclude Playwright tests
    ],
  },
});
```

#### Key Settings Explained

- **`globals: true`**: No need to import `describe`, `it`, `expect` in every test file
- **`environment: 'jsdom'`**: Provides DOM APIs (`document`, `window`) for React testing
- **`setupFiles`**: Runs before all tests (extends matchers, configures MSW)
- **`exclude`**: Prevents Playwright E2E tests from running with Vitest

---

### Setup File

**Location:** `/src/tests/setupTests.ts`

```typescript
import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// Extend Vitest expect with Testing Library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock matchMedia (not available in jsdom)
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// MSW server setup
export const handlers = [/* API handlers */];
export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**What it does:**
- Adds Testing Library matchers (`.toBeInTheDocument()`, `.toBeVisible()`)
- Auto-cleanup after each test (unmount components)
- Mocks `matchMedia` for responsive design tests
- Configures MSW for API mocking

---

### Running Tests

```bash
# Run all tests (watch mode)
pnpm test

# Run tests once (CI mode)
pnpm test run

# Run tests silently (less output)
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
- `/src/components/atoms/card/card.component.spec.tsx`
- `/src/components/atoms/link/navlink.spec.tsx`
- `/src/components/layout/navbar/search-input/search-input.spec.tsx`

#### View Tests
- `/src/views/about/about.spec.tsx`
- `/src/views/about/counter.spec.tsx`
- `/src/views/film-info/film-info.spec.tsx`
- `/src/views/film-list/film-list.spec.tsx`

#### E2E Tests (Playwright)
- `/src/tests/e2e/routes.e2e.spec.tsx`

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
- Use `render()` to mount component
- Use `screen.getByRole()` or `screen.getByText()` to find elements
- Use Testing Library matchers (`.toBeInTheDocument()`, `.toBeVisible()`)

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
- Use `fireEvent.click()`, `fireEvent.change()`, etc. for interactions
- Query updated DOM to verify changes
- Use `.toHaveTextContent()` for text assertions

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
- Use `renderHook()` to test hooks in isolation
- Use `waitFor()` for async updates
- Access hook values via `result.current`

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
- Pass props to `render()` like normal React usage
- Test different prop combinations

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
- Use `vi.fn()` to create mock functions
- Use `.toHaveBeenCalledTimes()`, `.toHaveBeenCalledWith()` to verify calls
- Access call history via `.mock.calls`

---

#### 6. Testing Styles

```tsx
it('applies correct styles to elements', () => {
  const { getByText } = render(
    <Card>
      <div style={{ color: 'rgb(255,0,0)' }}>
        <button style={{ color: 'rgb(22, 22, 22)' }}>
          click me!
        </button>
      </div>
    </Card>
  );
  
  const button = getByText('click me!');
  expect(button).toHaveStyle('color: rgb(22,22,22)');
  expect(button.parentNode).toHaveStyle('color: rgb(255,0,0)');
});
```

**Pattern:**
- Use `.toHaveStyle()` to verify inline styles
- Pass CSS property strings to matcher

---

### API Mocking with MSW

MSW (Mock Service Worker) intercepts network requests and returns mock responses.

#### Setup in setupTests.ts

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.get('/user', async () => {
    return HttpResponse.json({
      id: '15d42a4d-1948-4de4-ba78-b8a893feaf45',
      firstName: 'John',
    });
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Using in Tests

```tsx
import { server } from '@/tests/setupTests';
import { http, HttpResponse } from 'msw';

it('handles API error', async () => {
  // Override handler for this test
  server.use(
    http.get('/user', () => {
      return HttpResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    })
  );
  
  render(<UserProfile />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading user')).toBeVisible();
  });
});
```

**Pattern:**
- Define default handlers in `setupTests.ts`
- Override handlers in individual tests with `server.use()`
- Handlers reset automatically after each test

---

### Testing Library Queries

#### Query Priority (Best to Worst)

1. **`getByRole()`** - Best for accessibility (queries by ARIA role)
   ```tsx
   screen.getByRole('button', { name: 'Submit' })
   screen.getByRole('heading', { level: 1 })
   ```

2. **`getByLabelText()`** - Good for form inputs
   ```tsx
   screen.getByLabelText('Email')
   ```

3. **`getByPlaceholderText()`** - OK for inputs without labels
   ```tsx
   screen.getByPlaceholderText('Search...')
   ```

4. **`getByText()`** - Good for non-interactive content
   ```tsx
   screen.getByText('Welcome back')
   screen.getByText(/welcome/i)  // Case-insensitive regex
   ```

5. **`getByTestId()`** - Last resort (requires adding test IDs to code)
   ```tsx
   screen.getByTestId('submit-button')
   ```

#### Query Variants

- **`getBy`**: Throws error if not found (use for assertions)
- **`queryBy`**: Returns `null` if not found (use to check absence)
- **`findBy`**: Async, waits for element (use for delayed appearance)

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
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).not.toBeInTheDocument()
```

#### Text Content
```tsx
expect(element).toHaveTextContent('Hello')
expect(element).toContainHTML('<span>Hello</span>')
```

#### Attributes
```tsx
expect(input).toHaveValue('test@example.com')
expect(input).toHaveAttribute('type', 'email')
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()
```

#### Styles
```tsx
expect(element).toHaveStyle('color: red')
expect(element).toHaveClass('active')
```

#### Form Interactions
```tsx
expect(input).toHaveFocus()
expect(form).toHaveFormValues({ email: 'test@test.com' })
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
    ├── e2e/                               # Playwright E2E tests
    │   └── routes.e2e.spec.tsx
    └── fixtures/                          # Shared test data
        └── mockData.ts
```

**Naming convention:** `*.spec.tsx` or `*.test.tsx` (both work)

---

### CI/CD Integration

Vitest runs in CI environments automatically. The `process.env.CI` flag enables production mode.

**GitHub Actions Example:**

```yaml
- name: Install dependencies
  run: pnpm install

- name: Run unit tests
  run: pnpm test run

- name: Generate coverage
  run: pnpm coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

**NOTE:** Currently, unit tests are **not** included in the existing GitHub Actions workflows. Only Playwright E2E tests run in CI. See [GitHub Actions Integration](#github-actions-integration) below.

---

### Interactive UI Mode

```bash
pnpm test:ui
```

**Features:**
- Visual test runner in browser
- Filter and search tests
- See pass/fail status in real-time
- View console logs and errors
- Re-run individual tests
- Code coverage visualization

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
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--run", "--inspect-brk", "--no-file-parallelization"],
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
pnpm test              # Watch mode
pnpm test run          # Run once
pnpm test:ui           # Interactive UI
pnpm coverage          # Coverage report
```

**Common Queries:**
```tsx
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')
screen.getByText(/welcome/i)
screen.getByPlaceholderText('Search...')
```

**Common Actions:**
```tsx
fireEvent.click(button)
fireEvent.change(input, { target: { value: 'text' } })
fireEvent.submit(form)
```

**Common Matchers:**
```tsx
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toHaveTextContent('text')
expect(element).toHaveValue('value')
expect(mockFn).toHaveBeenCalledTimes(2)
```

---

## End-to-End Testing with Playwright

### Overview

The project uses **Playwright v1.58.2** for end-to-end testing across multiple browsers.

**Key Features:**
- Multi-browser testing (Chromium, Firefox, WebKit)
- Automatic dev server startup
- API mocking capabilities
- Screenshot and trace collection
- Parallel test execution

### Configuration

**Location:** `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './src/tests',
  baseURL: 'http://localhost:5173',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Key Settings Explained

- **`testDir`**: `./src/tests` - All test files go here
- **`baseURL`**: Tests use relative URLs (e.g., `page.goto('./')`)
- **`fullyParallel`**: Tests run concurrently for speed
- **`webServer`**: Automatically starts dev server before tests
- **`reuseExistingServer`**: Reuses running server locally (CI starts fresh)

---

### Running Tests

```bash
# Run all tests (headless mode)
pnpm playwright test

# Run tests with UI (interactive mode)
pnpm playwright test --ui

# Run tests in debug mode
pnpm playwright test --debug

# Run specific test file
pnpm playwright test routes.e2e.spec.tsx

# Run tests in specific browser
pnpm playwright test --project=chromium
pnpm playwright test --project=firefox
pnpm playwright test --project=webkit

# Show test report
pnpm playwright show-report
```

#### Available Scripts

```json
{
  "playwright": "playwright test",
  "playwright:ui": "playwright test --ui",
  "playwright:debug": "playwright test --debug"
}
```

---

### Existing Tests

**Location:** `/src/tests/e2e/routes.e2e.spec.tsx`

#### Test 1: Homepage Title

```tsx
test('Homepage has application title', async ({ page }) => {
  await page.goto('./');
  await page.screenshot({ path: 'screenshot0.png' });
  await expect(page).toHaveTitle(/React Movies - Vite & Typescript/);
});
```

**What it tests:**
- Navigates to homepage
- Takes screenshot (saved as `screenshot0.png`)
- Verifies page title matches regex

#### Test 2: Content Rendering with API Mocking

```tsx
test('Homepage Renders Content Correct', async ({ page }) => {
  await page.route('*/**/movie/*', async (route) => {
    await route.fulfill({ json: mockFilmsList });
  });
  await page.goto('./');
  await expect(page.getByText('The Substance')).toBeVisible();
});
```

**What it tests:**
- Intercepts API calls matching `*/**/movie/*` pattern
- Returns mock data (`mockFilmsList`) instead of real API response
- Verifies specific movie title is visible on page

**Why mock APIs:**
- Faster tests (no network requests)
- Predictable data (no flakiness from API changes)
- Works offline
- Avoids rate limits

---

### Writing New Tests

#### Test File Structure

```tsx
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Test logic
  });

  test('should handle error case', async ({ page }) => {
    // Error test logic
  });
});
```

#### Common Patterns

**1. Navigation**

```tsx
// Relative URL (uses baseURL from config)
await page.goto('./');
await page.goto('./film/123');

// Absolute URL
await page.goto('http://localhost:5173/');
```

**2. Interacting with Elements**

```tsx
// Click button
await page.getByRole('button', { name: 'Login' }).click();

// Type in input
await page.getByLabel('Email').fill('test@example.com');

// Select from dropdown
await page.selectOption('select#genre', 'Action');

// Check checkbox
await page.getByRole('checkbox', { name: 'Remember me' }).check();
```

**3. Assertions**

```tsx
// Element visibility
await expect(page.getByText('Welcome')).toBeVisible();
await expect(page.getByRole('button', { name: 'Submit' })).toBeHidden();

// Text content
await expect(page.locator('.title')).toHaveText('Movie Title');
await expect(page.locator('.count')).toContainText('10 results');

// URL
await expect(page).toHaveURL(/.*dashboard/);

// Attribute
await expect(page.locator('img')).toHaveAttribute('alt', 'Movie poster');

// Count
await expect(page.locator('.card')).toHaveCount(20);
```

**4. API Mocking**

```tsx
// Mock specific endpoint
await page.route('*/**/api/movies', async (route) => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ results: [...] }),
  });
});

// Mock with error
await page.route('*/**/api/movies', async (route) => {
  await route.fulfill({ status: 500 });
});

// Continue request normally (no mock)
await page.route('*/**/api/movies', (route) => route.continue());
```

**5. Waiting for Elements**

```tsx
// Wait for element to be visible
await page.waitForSelector('.movie-card');

// Wait for navigation
await Promise.all([
  page.waitForNavigation(),
  page.click('a[href="/login"]'),
]);

// Wait for API response
await page.waitForResponse('*/**/api/movies');
```

**6. Screenshots and Debugging**

```tsx
// Full page screenshot
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// Element screenshot
await page.locator('.movie-card').screenshot({ path: 'card.png' });

// Pause execution (debug mode only)
await page.pause();
```

---

### Best Practices

#### 1. Use Semantic Selectors

**DO:**
```tsx
// ✅ GOOD - Uses accessible roles
await page.getByRole('button', { name: 'Login' });
await page.getByLabel('Email');
await page.getByText('Welcome back');
```

**DON'T:**
```tsx
// ❌ BAD - Brittle CSS selectors
await page.locator('.btn-primary');
await page.locator('#email-input');
await page.locator('div > span > p');
```

#### 2. Mock External APIs

```tsx
// ✅ GOOD - Tests are fast and predictable
test('displays movie list', async ({ page }) => {
  await page.route('*/**/api/movies', async (route) => {
    await route.fulfill({ json: mockData });
  });
  await page.goto('./');
  await expect(page.getByText('Movie Title')).toBeVisible();
});
```

#### 3. Avoid Hard-Coded Waits

**DON'T:**
```tsx
// ❌ BAD - Arbitrary wait times
await page.waitForTimeout(5000);
```

**DO:**
```tsx
// ✅ GOOD - Wait for specific condition
await page.waitForSelector('.movie-card');
await expect(page.getByText('Loading...')).toBeHidden();
```

#### 4. Clean Up After Tests

```tsx
test.afterEach(async ({ page }) => {
  // Clear localStorage
  await page.evaluate(() => localStorage.clear());
  
  // Clear cookies
  await page.context().clearCookies();
});
```

#### 5. Group Related Tests

```tsx
test.describe('Authentication', () => {
  test('should log in successfully', async ({ page }) => { ... });
  test('should show error for invalid credentials', async ({ page }) => { ... });
  test('should log out', async ({ page }) => { ... });
});
```

---

### Testing Authentication

When testing features that require authentication:

**Option 1: Mock Auth State**

```tsx
test('user can access profile', async ({ page }) => {
  // Set auth state in localStorage before navigating
  await page.addInitScript(() => {
    localStorage.setItem('auth', JSON.stringify({
      user: { id: '123', email: 'test@example.com' },
      session: { access_token: 'mock-token' }
    }));
  });
  
  await page.goto('./profile');
  await expect(page.getByText('test@example.com')).toBeVisible();
});
```

**Option 2: Reuse Authenticated Session**

```tsx
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('./login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Save storage state
  await page.context().storageState({ path: 'auth.json' });
});

// Use in other tests
test.use({ storageState: 'auth.json' });
```

---

### CI/CD Integration

The configuration automatically adapts for CI:

```typescript
forbidOnly: !!process.env.CI,    // Fail if test.only is used
retries: process.env.CI ? 2 : 0,  // Retry flaky tests in CI
workers: process.env.CI ? 1 : undefined, // Sequential in CI
```

**GitHub Actions Example:**

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright browsers
  run: pnpm playwright install --with-deps

- name: Run Playwright tests
  run: pnpm playwright test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

### Debugging Tests

#### Interactive Mode

```bash
pnpm playwright test --ui
```

**Features:**
- See tests run in real-time
- Pause and step through actions
- Inspect DOM at each step
- Time-travel through test execution

#### Debug Mode

```bash
pnpm playwright test --debug
```

**Features:**
- Opens Playwright Inspector
- Step through test line by line
- Pick locators interactively
- See console logs

#### Headed Mode

```bash
pnpm playwright test --headed
```

**Features:**
- Watch browser window during test
- See what the test sees
- Useful for visual debugging

---

### Common Issues & Fixes

#### 1. Dev Server Not Starting

```bash
# Error: "net::ERR_CONNECTION_REFUSED"
```

**Fix:** Ensure port 5173 is not in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

#### 2. Element Not Found

```tsx
// ❌ Element loads after page.goto()
await page.goto('./');
await page.click('.movie-card'); // Might fail if not loaded yet

// ✅ Wait for element first
await page.goto('./');
await expect(page.locator('.movie-card')).toBeVisible();
await page.click('.movie-card');
```

#### 3. Flaky Tests

**Causes:**
- Race conditions (element not loaded yet)
- Network delays
- Animation timing

**Fixes:**
- Use `waitForSelector()` or `expect().toBeVisible()`
- Mock API responses instead of relying on network
- Use `page.waitForLoadState('networkidle')` if needed

#### 4. Browser Not Installed

```bash
# Error: "Executable doesn't exist"
```

**Fix:**
```bash
pnpm playwright install chromium
# or install all browsers
pnpm playwright install
```

---

### File Organization

```
src/
└── tests/
    ├── e2e/
    │   ├── routes.e2e.spec.tsx         # Route/navigation tests
    │   ├── auth.e2e.spec.tsx           # Authentication tests
    │   └── search.e2e.spec.tsx         # Search feature tests
    ├── fixtures/
    │   └── mockData.ts                 # Shared mock data
    └── utils/
        └── testHelpers.ts              # Shared test utilities
```

---

### Browser Capabilities

**Playwright can:**
- Run tests across Chromium, Firefox, WebKit
- Execute in headless or headed mode
- Take screenshots and videos
- Intercept and mock network requests
- Emulate mobile devices
- Test responsive design
- Handle file uploads/downloads
- Test keyboard and mouse interactions

**Playwright cannot:**
- Access your local browser's history/bookmarks
- Use your browser extensions
- Access your personal accounts (unless you log in during tests)

**Note:** Claude Code does not have direct visual access to the browser. It can run Playwright commands and analyze results/logs, but cannot "see" the browser window.

---

### Quick Reference

**Essential Commands:**
```bash
pnpm playwright test              # Run all tests
pnpm playwright test --ui         # Interactive mode
pnpm playwright test --debug      # Debug mode
pnpm playwright test --headed     # Show browser
pnpm playwright show-report       # View HTML report
```

**Common Locators:**
```tsx
page.getByRole('button', { name: 'Click' })  // By ARIA role
page.getByLabel('Email')                     // By label text
page.getByText('Welcome')                    // By text content
page.getByPlaceholder('Search...')           // By placeholder
page.locator('.custom-class')                // By CSS selector
```

**Common Assertions:**
```tsx
expect(page).toHaveTitle(/Title/)            // Page title
expect(page).toHaveURL(/url/)                // Current URL
expect(element).toBeVisible()                // Element visibility
expect(element).toHaveText('Text')           // Text content
expect(element).toHaveCount(5)               // Element count
```

---

## GitHub Actions Integration

### Overview

The project has **4 GitHub Actions workflows** configured:

1. **CI** (`.github/workflows/ci.yml`) - Comprehensive quality checks, unit tests, and E2E tests
2. **Playwright Tests** (`.github/workflows/playwright.yml`) - E2E testing on push/PR (legacy, kept for compatibility)
3. **GitHub Actions Demo** (`.github/workflows/main.yml`) - Basic demo workflow
4. **Manual Workflow** (`.github/workflows/manual.yml`) - Manually triggered workflow

---

### Playwright Tests Workflow

**Location:** `.github/workflows/playwright.yml`

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

**What it does:**
```yaml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm install -g pnpm && pnpm install
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps
      - name: Run Playwright tests
        run: pnpm exec playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

**Key steps:**
1. Checkout code
2. Setup Node.js LTS
3. Install pnpm globally and dependencies
4. Install Playwright browsers with system dependencies
5. Run Playwright E2E tests
6. Upload test report (even if tests fail)

---

### GitHub Actions Demo Workflow

**Location:** `.github/workflows/main.yml`

**Triggers:**
- Any push to any branch

**What it does:**
- Prints demo messages about GitHub Actions
- Lists repository files
- Basic smoke test for CI functionality

**Purpose:** Demo/learning workflow, not critical for project

---

### Manual Workflow

**Location:** `.github/workflows/manual.yml`

**Triggers:**
- Manually triggered from GitHub UI

**What it does:**
- Accepts a `name` input parameter
- Prints a greeting message

**Purpose:** Example of manual workflow dispatch, not critical for project

---

### Comprehensive CI Workflow

**Location:** `.github/workflows/ci.yml`

**Triggers:**
- Push to `main` or `master` branch
- Pull requests to `main` or `master` branch

**What's Running:**

#### ✅ Code Quality Job
- **ESLint** - Lints all TypeScript/React code (`pnpm lint`)
- **Prettier** - Checks code formatting (`pnpm format --check`)
- **TypeScript** - Type checking and build (`pnpm build`)

#### ✅ Unit Tests Job
- **Vitest** - Runs all unit tests (`pnpm test run`)
- **Coverage** - Generates coverage report (`pnpm coverage`)
- **Artifacts** - Uploads coverage report for analysis

#### ✅ E2E Tests Job
- **Playwright** - Runs E2E tests across 3 browsers (`pnpm exec playwright test`)
- **Artifacts** - Uploads Playwright HTML report

**Workflow structure** (`.github/workflows/ci.yml`):

```yaml
name: CI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run ESLint
        run: pnpm lint
      
      - name: Check formatting
        run: pnpm format --check
      
      - name: Type check
        run: pnpm build
  
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run Vitest
        run: pnpm test run
      
      - name: Generate coverage
        run: pnpm coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
  
  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Run Playwright tests
        run: pnpm exec playwright test
      
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

This workflow:
- ✅ Runs ESLint, Prettier, TypeScript checks
- ✅ Runs Vitest unit tests with coverage
- ✅ Runs Playwright E2E tests
- ✅ Runs all checks in parallel for speed
- ✅ Uploads coverage and test reports

---

### Viewing CI Results

#### In GitHub UI

1. Go to repository → **Actions** tab
2. Click on a workflow run
3. View job status (✅ passed, ❌ failed)
4. Click job name to see detailed logs
5. Download artifacts (test reports, coverage)

#### In Pull Requests

- CI status shows at bottom of PR
- Green checkmark = all checks passed
- Red X = some checks failed
- Click "Details" to see logs

---

### CI Best Practices

#### 1. Run All Quality Checks

**Current state:** Only Playwright runs in CI

**Recommended:** Add lint, format, type-check, and unit tests

#### 2. Fail Fast

```yaml
# Add to workflow
- name: Run ESLint
  run: pnpm lint
  # If this fails, workflow stops (don't waste CI time on later steps)
```

#### 3. Cache Dependencies

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: lts/*
    cache: 'pnpm'  # Cache pnpm dependencies
```

#### 4. Matrix Testing (Optional)

Test across multiple Node versions:
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
```

#### 5. Required Status Checks

In GitHub repo settings:
- **Settings** → **Branches** → **Branch protection rules**
- Require status checks to pass before merging
- Select: "Playwright Tests", "Unit Tests", "ESLint", etc.

---

### Local Pre-commit Checks

To ensure commits pass CI, run checks locally:

```bash
# Run all checks
pnpm lint && pnpm format && pnpm test run && pnpm build
```

**Or set up pre-commit hook** (`.git/hooks/pre-commit`):
```bash
#!/bin/sh
pnpm lint
pnpm format
pnpm test run
```

**Or use Husky + lint-staged:**
```bash
pnpm add -D husky lint-staged
```

`.husky/pre-commit`:
```bash
#!/bin/sh
pnpm lint-staged
```

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

---

### Troubleshooting CI Failures

#### Playwright Fails in CI But Passes Locally

**Cause:** Race conditions, different screen size, network timing

**Fix:**
- Use `waitFor()` for async elements
- Mock API responses with MSW
- Set explicit viewport size in config

#### Out of Memory Errors

**Cause:** Large dependencies, parallel test execution

**Fix:**
```yaml
- name: Run tests
  run: pnpm test run
  env:
    NODE_OPTIONS: '--max_old_space_size=4096'
```

#### Flaky Tests

**Cause:** Non-deterministic tests, timing issues

**Fix:**
- Add retries in config: `retries: process.env.CI ? 2 : 0`
- Use deterministic test data
- Mock time-based functionality

---

### Quick Reference

**Current CI workflows:**
- ✅ **Comprehensive CI** (`.github/workflows/ci.yml`) - All quality checks
  - ESLint linting
  - Prettier format checking
  - TypeScript type checking
  - Vitest unit tests with coverage
  - Playwright E2E tests
- ✅ Playwright E2E tests (`.github/workflows/playwright.yml`) - Legacy workflow
- ℹ️ Demo workflow (`.github/workflows/main.yml`) - Basic demo
- ℹ️ Manual workflow (`.github/workflows/manual.yml`) - Manual trigger

**All quality checks running in CI:**
- ✅ ESLint (`pnpm lint`)
- ✅ Prettier (`pnpm format --check`)
- ✅ TypeScript (`pnpm build`)
- ✅ Vitest (`pnpm test run`)
- ✅ Coverage report (`pnpm coverage`)
- ✅ Playwright E2E (`pnpm exec playwright test`)

**Recommended next steps:**
1. ✅ ~~Create comprehensive CI workflow with all quality checks~~ (Done!)
2. Set up branch protection rules in GitHub
3. Configure pre-commit hooks locally (Husky + lint-staged)
4. (Optional) Add coverage reporting to external service (Codecov/Coveralls)

---

**Last Updated:** 2026-04-12
