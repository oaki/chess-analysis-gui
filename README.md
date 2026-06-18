# Chess Analysis GUI

Front-end web application for [chess-analysis.com](https://www.chess-analysis.com/) — an interactive chess board with engine analysis, opening and database exploration, and account-backed game history. This repository is the browser client; it talks to a separate backend API and Socket.io service for authentication, saved games, and remote engine workers.

**Architecture (structure, state, sockets):** see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## What it does

- **Interactive board** — Play and analyze positions using [Chessground](https://github.com/lichess-org/chessground) and [chess.js](https://github.com/jhlywa/chess.js) (move validation, promotion, flip, undo/redo, autoplay).
- **Engine evaluation** — Local **Stockfish** in a Web Worker (WASM when supported, JavaScript fallback under `public/engines/`). **Cloud** evaluation streams from the server over **Socket.io** (`workerEvaluation`), so lines can come from registered remote workers as well as the bundled offline engine.
- **Opening & data panels** — Opening explorer backed by a client-side move tree, games database explorer, and **Syzygy** endgame tablebase hints (also fed via sockets where applicable).
- **Signed-in experience** — **Google Sign-In** registers the user with the API; JWT is stored and sent on REST calls. After load, the app restores the last game, hydrates move history into the global store, and opens the engine socket.
- **Persistence** — Save and resume games (`PUT /user/history/:id`), load a specific game, import PGN (`POST /user/history/import-pgn`), list history on `/user/history`.
- **Remote workers** — `/user/engines` lists and manages engine worker registrations (`/user/workers`) for the cloud analysis pipeline.
- **Progressive Web App** — Production builds use **Workbox** (`GenerateSW`) for offline-friendly caching; a service worker registers against `REACT_APP_HOST`.

Layouts adapt to **portrait vs landscape** (split columns vs stacked board and panels).

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 16, TypeScript, Emotion (`@emotion/react` / styled) |
| State | Zustand store + Redux-style `reducerMap` / `dispatch` (thunks, `BATCH_ACTIONS`); `connect` / `useSelector` via `src/libs/stateCompat.tsx` |
| Routing | React Router v5, code-split route-level lazy loading |
| Board | Chessground 7, chess.js |
| Bundler | Webpack 4, `ts-loader`, Sass/PostCSS |
| Realtime | socket.io-client v3 |
| Forms / UX | Informed, swipeable lists, custom CSS alongside functional-css-framework |

## Repository layout (high level)

- `src/index.tsx` — Entry: global CSS, service worker registration, root render.
- `src/app.tsx` — `BrowserRouter`, session bootstrap (profile + last game + socket), lazy routes, `PrivateRoute` shell.
- `src/layouts/` — Page shells: `chessboardPage`, `historyPage`, `enginesPage`, `settingPage`, `auth/*`.
- `src/components/chessboard/` — Board controller, promotion dialog, on-move indicators.
- `src/components/evaluation/` — Offline Stockfish hook/service, cloud evaluation UI, worker evaluation wiring.
- `src/components/openingExplorer/`, `gamesDatabaseExplorer/`, `syzygyExplorer/` — Book and tablebase panels.
- `src/components/moveTree/` — Tree utilities and tests (`__tests__/tree.test.ts`).
- `src/services/` — Session/JWT, API client, socket manager, Stockfish worker wrapper, errors.
- `src/config/index.ts` — Runtime config from `process.env` (injected at build time).
- `public/` — `index.html`, static assets, engine binaries copied into the build.

## Configuration

Webpack uses **dotenv** and replaces `process.env` with the parsed **`.env`** file in the project root (see `webpack.config.js` → `DefinePlugin`). Create a `.env` file (you can start from `.env-dev` or `.env-prod` in the repo if present) with:

| Variable | Purpose |
|----------|---------|
| `REACT_APP_HOST` | REST API origin (e.g. `http://localhost:8080` or `https://api.chess-analysis.com`) |
| `REACT_APP_SOCKET_IO_HOST` | Socket.io host (no path) |
| `REACT_APP_SOCKET_IO_PATH` | Socket.io path (e.g. `/socket.io`) |
| `REACT_APP_GOOGLECLIENTID` | Google OAuth Web client ID |

The service worker uses `REACT_APP_HOST` to resolve `service-worker.js` in production.

## Scripts

```bash
npm install
npm start    # webpack-dev-server on port 3000, HMR
npm run build
npm run tsc  # TypeScript watch (separate from webpack)
```

[Jest](https://jestjs.io/) is configured in `jest.config.js`; there is no `npm test` script yet. Run tests with:

```bash
npx jest
```

## API surface (client expectations)

The client assumes a backend that implements (non-exhaustive):

- `POST /auth/register` — body: `{ jwt_token }` (Google token exchange).
- `GET /user/profile/` — Bearer JWT.
- `GET /user/history:last`, `GET /user/history/:id`, `PUT /user/history/:id`, `POST /user/history/import-pgn`.
- `GET/POST` worker endpoints under `/user/workers` for the engines page.

Socket connection: authenticated query (`token`, `type: "user"`), events such as `workerEvaluation` for streamed analysis.

## Requirements

- **Node.js** compatible with the pinned Webpack 4 toolchain (use an LTS version and match your team’s practice).
- **Modern browser** with Web Workers; WASM improves Stockfish performance.

## License

MIT — see `package.json` / author field.

## Author

Pavol Bincik
