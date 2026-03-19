# Security Review Report

Project: `react-movies`  
Date: 2026-03-18  
Reviewer: Cursor agent

## Scope

- **Dependencies**: `pnpm`-managed packages (prod + dev)
- **Codebase**: `src/**`, configuration files, workflows, and environment handling
- **Methods**:
  - Package vulnerability scan: `pnpm audit` (and `pnpm audit --prod`)
  - Static scans for common footguns:
    - Secret patterns (`API_KEY`, `SECRET`, `TOKEN`, etc.)
    - Dangerous DOM / JS execution APIs (`dangerouslySetInnerHTML`, `eval`, `new Function`, etc.)
  - Targeted review of request building and user-input paths

## Executive summary

- **Current dependency state**: ✅ **No known vulnerabilities found** (after upgrades).
- **Most important code finding**: ⚠️ **A real TMDB API key was committed** in `.env`.
  - Remediated in repo by removing `.env` and replacing with `.env.example`.
  - Key rotation is still required.
- **Input/URL handling**: ✅ Improved by URL-encoding the search query when building request URLs.

## Dependency security review

### Audit results

- `pnpm audit`: **No known vulnerabilities found** (final state).

### Remediations applied (to address advisories found during review)

- **Vitest**: Upgraded to patched versions to address a reported critical advisory affecting `vitest` `<2.1.9`.
  - Updated: `vitest` and `@vitest/*` (UI + coverage)
- **Playwright**: Upgraded to patched versions to address a reported high advisory affecting `playwright` `<1.55.1` (pulled via `@playwright/test`).
  - Updated: `@playwright/test`

### Residual / informational warnings

- `whatwg-encoding@3.1.1` is reported as **deprecated** by the ecosystem.
  - This is **not a CVE** and currently appears to be an upstream deprecation with no newer published version to move to.
  - Recommendation: keep dependencies fresh and monitor upstream changes (e.g., `jsdom`).

## Codebase security review

### Finding 1 — Secret committed to repo (TMDB key)

- **Severity**: High (credentials exposure)
- **Evidence**: `.env` contained `VITE_APIKEY` with a real key value.
- **Impact**:
  - Anyone with repo access can use the key.
  - In a Vite app, `VITE_*` variables are **client-exposed by design**, so this value is not a “secret” in the traditional sense.
  - Even if TMDB keys are “public-ish”, leaked keys can still lead to quota abuse or account impact.
- **Remediation applied**:
  - Removed `.env` from the repository
  - Added `.env.example` as a safe template
  - Updated `README.md` to instruct copying `.env.example` → `.env`
- **Required follow-up**:
  - **Rotate/revoke the leaked TMDB key** and replace it locally.
  - Ensure `.env` remains untracked (already ignored in `.gitignore`).

### Finding 2 — Query string construction with user input

- **Severity**: Medium (request integrity / robustness; potential downstream injection depending on API behavior)
- **Location**: `src/services/films/films.tsx` (search endpoint)
- **Issue**: Search query was interpolated into a URL without encoding.
- **Remediation applied**:
  - Use `encodeURIComponent(searchQuery)` when building the search URL.

### Finding 3 — Dangerous DOM APIs / code execution

- **Severity**: Low (as found)
- **Results**:
  - No `dangerouslySetInnerHTML`, `eval`, or `new Function` usage detected.
  - `innerHTML` appeared in:
    - A test assertion (`film-info.spec.tsx`)
    - A benign “is root empty” check (`src/main.tsx`)
- **Recommendation**:
  - Keep avoiding HTML injection patterns.
  - Prefer DOM-safe rendering via React and avoid setting HTML from untrusted sources.

## Recommended next steps (hardening)

### Environment & secret handling

- **Rotate the TMDB key** immediately (treat as compromised).
- Add a lightweight pre-commit check (optional) to block committing `.env` or obvious secret patterns.
- If you need true secrecy, move key usage server-side (proxy requests) and keep secrets out of the client.

### CI / automation

- Replace the demo workflow (`.github/workflows/main.yml`) with a real pipeline that runs:
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm audit` (optionally fail on high/critical)

### Dependency maintenance

- Keep `pnpm-lock.yaml` committed and regularly update:
  - `vitest`, `vite`, `@playwright/test`, `eslint`, and related tooling
- Periodically re-run:
  - `pnpm audit`
  - `pnpm outdated`

## Appendix

### Commands used

```bash
pnpm audit
pnpm audit --prod
pnpm lint
pnpm test
pnpm build
```

