# Testing and Tooling

How tests are written in this repo, and the linting and formatting that gate every commit. Only project-specific patterns are recorded here; for the libraries themselves read the Vitest and Testing Library docs. Rules that must never be broken are in [CLAUDE.md](../CLAUDE.md); visual conventions are in [STYLE_GUIDE.md](STYLE_GUIDE.md).

---

## Stack

Vitest 4 with jsdom and globals, React Testing Library, `@testing-library/user-event`, and `vitest-axe`. That is the whole stack. There is no end-to-end layer (Playwright was removed in September 2026) and no network mocking library (MSW was removed the same month). Do not add either.

## Configuration

Everything lives under the `test` key in [vite.config.ts](../vite.config.ts):

-  `environment: 'jsdom'`, `globals: true`, `css: true`.
-  `env` stubs the three `VITE_*` variables so the Supabase client and TMDB fetchers can be imported without a `.env.local`.
-  `coverage` uses Istanbul with `text-summary`, `json-summary` and `html` reporters. No thresholds are enforced.
-  `exclude` adds `.claude/**` to the defaults.

[src/tests/setupTests.ts](../src/tests/setupTests.ts) extends `expect` with jest-dom and axe matchers, unmounts after every test, and stubs `window.matchMedia`, which jsdom lacks. `vitest-axe.d.ts` next to it types the axe matchers.

## Commands

```sh
pnpm test            # watch
pnpm test:silent     # single run, quiet
pnpm test:ui         # browser UI
pnpm coverage        # single run with coverage
pnpm coverage:open   # …and open the HTML report
```

Run a single file with `pnpm test path/to/file.spec.tsx`.

## Where tests live

Co-located with the source as `<name>.spec.tsx` (or `.spec.ts` without JSX). One `describe` per module named after it; `it` titles describe behaviour in plain words ("links a series to the TV detail route"), not implementation.

## Helpers — `src/tests/test-utils.tsx`

| Export                   | Use                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `createTestQueryClient`  | A QueryClient with `retry: false` and `staleTime: 0`, for hook tests that need a provider              |
| `renderWithQueryContext` | `render` wrapped in a fresh QueryClientProvider. Default for any component that touches TanStack Query |
| `renderWithAxe`          | `renderWithQueryContext` plus an axe run; returns `{ …result, violations }`                            |
| `router`                 | A router over the real `routeTree`. Rarely needed; most specs build a bare router instead (below)      |

## Mock data — `src/tests/__mocks__/mocks.ts`

`MOCK_FILM_LIST`, `MOCK_FILM_INFO`, `MOCK_FILM_TRAILER`, `MOCK_SERIES_LIST`, `MOCK_SERIES_INFO`, `MOCK_SERIES_CREDITS`, `MOCK_SERIES_RECOMMENDATIONS` are raw TMDB payloads. Always parse them through the matching Zod schema before handing them to a component, exactly as the service layer does:

```tsx
<FilmList list={SeriesListSchema.parse(MOCK_SERIES_LIST).results} />
```

Never inline large fixtures in a spec. Add to the mocks file instead.

## Patterns

### Components that render a `Link`

`MediaLink`, `NavLink`, `FilmCard`, `Navbar` and anything containing them need a router. Do not mock the router hooks; give them a bare one and assert on `href`.

```tsx
const router = createRouter({
   routeTree: createRootRoute(),
   context: { queryClient: new QueryClient() },
});

await act(async () => {
   renderWithQueryContext(
      <RouterProvider router={router} defaultComponent={element} />
   );
});

expect(screen.getByRole('link', { name: 'Game of Thrones' })).toHaveAttribute(
   'href',
   '/tv/1399'
);
```

See `media-link.spec.tsx` and `navbar.spec.tsx`. This is also how route wiring is covered now that there are no E2E tests: assert where things link, not what happens after navigation.

### Components that call router hooks without rendering a `Link`

When a component uses `useNavigate` or `useParams` and nothing else from the router, mock just those hooks and keep the rest of the module real:

```tsx
vi.mock('@tanstack/react-router', async (importOriginal) => ({
   ...(await importOriginal<typeof import('@tanstack/react-router')>()),
   useNavigate: () => vi.fn(),
}));
```

### Services and Supabase

Never let a test reach the network. Mock the service module, then shape responses per test with `vi.mocked`:

```tsx
vi.mock('@/services/supabase/favorites', () => ({
   getUserFavorites: vi.fn(),
   addFavorite: vi.fn(),
   removeFavorite: vi.fn(),
}));

vi.mocked(getUserFavorites).mockResolvedValue(MOCK_FAVORITES);
```

`useAuth.spec.ts` does the same for `@/services/supabase/auth`. TMDB fetchers in `src/services/films/`, `src/services/series/` and `src/services/search/` are mocked the same way when a component fetches for itself (`search-input.spec.tsx` and `keyword-filter.spec.tsx` mock `@/services/search/search`, which also covers the query options built on it); most views take data as props, so usually the parsed mock is enough.

When asserting on a react-aria `ComboBox`, query options by name and wait for the expected count: the empty-state placeholder is rendered with `role="option"` too, so a bare `findAllByRole('option')` resolves before the results arrive.

### Zustand stores

Stores are module singletons, so reset them before each test with `setState`:

```tsx
beforeEach(() => {
   useListView.setState({ view: LIST_VIEWS.CARDS });
});
```

Read state with `useStore.getState()` in hook tests; drive UI through the component in component tests.

### Interactions

Prefer `userEvent` from `@testing-library/user-event` (`await userEvent.click(...)`, `await userEvent.type(...)`). `fireEvent` survives in older specs; do not add more.

### Accessibility

Run axe on any component that renders UI. jsdom cannot compute colour contrast, so disable that rule:

```tsx
const axe = configureAxe({ rules: { 'color-contrast': { enabled: false } } });

it('has no a11y violations', async () => {
   const { container } = renderWithQueryContext(<SearchInput />);
   expect(await axe(container)).toHaveNoViolations();
});
```

`renderWithAxe` is the shorthand when you also want the render result.

### What every spec should cover

Happy-path render, the main interactions, the empty or error state where one exists, any `movie` vs `tv` branching, and one axe assertion.

---

## Linting and formatting

Both run on staged files in the husky pre-commit hook via lint-staged; a warning is enough to block the commit.

**ESLint** — flat config in [eslint.config.js](../eslint.config.js). Ignores `dist`, `node_modules`, `coverage`, every `*.config.{js,ts}` and the generated `src/routeTree.gen.ts`. Plugins: typescript-eslint (recommended), react-hooks, react-refresh, jsx-a11y (most rules at error), TanStack Query, simple-import-sort (import and export order, error level), and eslint-config-prettier last to switch off formatting rules. Unused variables and `any` are warnings, which still fail the hook because it runs with `--max-warnings=0`.

**Prettier** — [.prettierrc](../.prettierrc): semicolons, single quotes, three-space indentation, ES5 trailing commas, and the Tailwind plugin that sorts class names. `.prettierignore` excludes only `routeTree.gen.ts`.

**PostCSS** — configured inline in `vite.config.ts` (`tailwindcss` and `autoprefixer`). The root `postcss.config.js` is ignored by Vite when an inline config exists and can be deleted.

**Commits** — Conventional Commits enforced by commitlint, plus a custom rule that rejects any message mentioning an AI assistant by name.

```sh
pnpm lint             # ESLint over the repo
pnpm format           # Prettier --write
pnpm format:check     # Prettier --check
pnpm exec tsc --noEmit
```
