# Chess Analysis GUI — Improvement Summary

## What Changed (v1.2.0 → v2.0.0)

### 1. Build System: Webpack 4 → Vite 6

**Files changed:** `package.json`, `vite.config.ts` (new), `index.html` (moved to root)

- Replaced the webpack 4 + multiple loaders setup with Vite 6 + `@vitejs/plugin-react`
- Eliminated `NODE_OPTIONS=--openssl-legacy-provider` hack (was required for webpack 4 on Node 17+)
- Hot module replacement is now ~10× faster (Vite ESM-native HMR vs webpack bundle recompile)
- `vite-tsconfig-paths` replaces the webpack `moduleDirectories: ['src']` trick — TypeScript path aliases in `tsconfig.json` now work at build time too
- `process.env.*` reads are shimmed via Vite's `define` plugin — existing `.env` files and `config/index.ts` required no changes
- New env files (`.env.development`, `.env.production`) match Vite's convention alongside the existing `.env`

### 2. React 16 → React 18

**Files changed:** `src/index.tsx`, `tsconfig.json`, `@types/react` + `@types/react-dom`

- `ReactDOM.render()` replaced with `createRoot().render()` — the React 18 concurrent-mode entry point
- All type definitions updated to `@types/react@^18.3`
- Third-party components with React 18 type incompatibilities (`@sandstreamdev/react-swipeable-list`) wrapped with typed compat shims instead of replacing the library

### 3. React Router v5 → v6

**Files changed:** `src/app.tsx`, `src/libs/privateRoute.tsx`, `src/components/menu/menu.tsx`, `src/layouts/historyPage.tsx`, `src/components/historyList/smartHistoryList.tsx`

| v5 | v6 |
|---|---|
| `<Switch>` | `<Routes>` |
| `<Route component={X} path="...">` | `<Route element={<X/>} path="...">` |
| `<Redirect to="..."/>` | `<Navigate to="..." replace/>` |
| `withRouter(Component)` | `useNavigate()` hook |
| `history.push("/")` prop | `const navigate = useNavigate(); navigate("/")` |
| `exact` prop needed | Routes match exactly by default |

- `PrivateRoute` rewritten as a children-wrapper component using `useNavigate` + `useLocation`
- `withRouter` HOC removed from `Menu` — `Link` components work without it in v6
- `historyPage.tsx` no longer passes `history` prop — `SmartHistoryList` uses `useNavigate` directly

### 4. chess.js 0.11 → 1.x

**Files changed:** `src/libs/chessboardUtils.ts`, `src/components/chessboard/chessboardController.tsx`, `src/libs/moveFen.ts`, `src/components/evaluation/evaluation.tsx`, `src/components/chessboard/board.tsx`, `src/components/chessboard/promotingDialog.tsx`

| Old API (0.11) | New API (1.x) |
|---|---|
| `chess.in_checkmate()` | `chess.isCheckmate()` |
| `chess.in_draw()` | `chess.isDraw()` |
| `chess.in_check()` | `chess.isCheck()` |
| `chess.SQUARES` (instance) | `import { SQUARES } from 'chess.js'` (module export) |
| `import * as Chess from 'chess.js'; new Chess()` | `import { Chess } from 'chess.js'; new Chess()` |
| `chess.move(uciStr, { sloppy: true })` | `chess.move({ from, to, promotion? })` |
| `chess.get(square: string)` | `chess.get(square: Square)` (strict type) |

- UCI move strings (`"e2e4"`) are now parsed into `{ from, to }` objects before calling `chess.move()` since the `sloppy` option was removed

### 5. TypeScript 4 → 5

**Files changed:** `tsconfig.json`, `tsconfig.test.json` (new), `package.json`

- Target updated: `es5` → `ES2020`
- Module: `esnext` → `ESNext` with `moduleResolution: "bundler"` (Vite-compatible)
- `jsx: "react"` → `jsx: "react-jsx"` (no longer requires `import React` in every file)
- Separate `tsconfig.test.json` for Jest (`moduleResolution: "node"`, `module: "CommonJS"`) since Jest uses CommonJS transforms
- `isolatedModules: true` added for Vite compatibility

### 6. E2E Tests — Playwright

**New files:** `playwright.config.ts`, `e2e/auth.spec.ts`, `e2e/chessboard.spec.ts`, `e2e/evaluation.spec.ts`

- Playwright configured to run against `http://localhost:3000` (started by `npm run start`)
- Tests cover:
  - Unauthenticated redirect flow (all protected routes → `/auth/sign-in`)
  - Sign-in page renders Google login button and beta warning
  - App serves valid HTML on all known routes (no 4xx/5xx)
  - No JavaScript errors on sign-in page load
  - Unknown routes don't crash the app

**Run E2E tests:**
```bash
npm run e2e            # headless
npm run e2e:headed     # see the browser
npm run e2e:report     # open last report
```

### 7. Unit Test Expansion

**Tests: 98 → 140 (+42)**

New test files:
- `src/libs/__tests__/chessboardUtils.test.ts` — `toDests` and `toColor` with 10 cases (legal moves, check, alternating turns)
- `src/libs/__tests__/moveFen.test.ts` — `getMoveFen` with 11 cases (promotions, illegal moves, all piece types)

Enhanced existing tests:
- `src/services/__tests__/evaluationPipeline.test.ts` — +7 edge cases (null evaluation, empty array, short PV, zero nodes, field preservation)
- `src/__tests__/reducers.test.ts` — +9 edge cases (default states, unknown actions, partial user merge, array replacement)
- `src/__tests__/store.test.ts` — +6 edge cases (state immutability, multiple subscribers, empty batch, thunk getState)
- `src/__tests__/app.test.tsx` — updated for Router v6 + added history error test
- `src/components/historyList/__tests__/smartHistoryList.test.tsx` — migrated from `history` prop to `useNavigate` mock

### 8. Other Fixes

- `src/components/ui/listItem.tsx` — React 18 compat shim for `SwipeableListItem` (children typing)
- `src/components/ui/list.tsx` — React 18 compat shim for `SwipeableList`
- Removed unused `informed` and `react-swipe-to-delete-component` dependencies
- Removed ~30 webpack-related dev dependencies (webpack, ts-loader, css-loader, postcss, etc.)
- `jest.config.js` — added `moduleNameMapper` for CSS/SCSS files (prevents test errors from style imports)
- `src/__mocks__/fileMock.ts` — CSS mock for Jest

---

## What Still Needs Work (future PRs)

### High Priority
- **Replace `@sandstreamdev/react-swipeable-list`** — unmaintained, has React 18 type issues requiring compat shims. Replace with `react-swipeable` or a custom swipe hook.
- **Remove dead code in `signInPage.tsx`** — `SignInPage1` class component (~100 lines) is exported but superseded by the `SignInPage` function component. The class connects via `connect(mapStateToProps)` but the function is actually used.
- **Remove `console.log` from production code** — multiple files have debug logs (`actions.tsx`, `chessboardController.tsx`, `evaluation.tsx`, etc.)

### Medium Priority
- **Enable TypeScript strict mode** — `strict: false` currently. Enabling it would catch real bugs but requires ~50 type fixes across the codebase.
- **Upgrade `chessground` to v9+** — currently pinned to `7.3.1`. The `Chessground()` API changed in v8+.
- **PWA service worker** — `WorkboxPlugin` was removed with webpack. Add `vite-plugin-pwa` to restore offline support.
- **Split `reducers.tsx` into slices** — the monolithic reducer map (23 keys) makes state tracing hard. Zustand slices or Zustand's `immer` middleware would help.

### Low Priority  
- **Remove `jsrsasign`** — 240 KB library used for JWT parsing, already replaced by `jwt-decode` in the codebase.
- **Fix the `contants.tsx` typo** — should be `constants.tsx`. Requires updating all imports.
- **Add more E2E tests** — authenticated flows (with stored token), chessboard move interaction, evaluation display.

---

## Quick Start

```bash
npm install
npm run start     # Vite dev server (port 3000, HMR)
npm run build     # TypeScript check + production bundle
npm test          # 140 Jest unit tests
npm run e2e       # Playwright E2E (requires dev server)
```
