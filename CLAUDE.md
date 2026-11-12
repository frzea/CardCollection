# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm start` (`npx expo start`) — Expo dev server; `npm run android` / `ios` / `web` target a platform. Starting it also regenerates `.expo/types/router.d.ts` (typed routes) — run it after adding a screen.
- `npm run api` — mock backend (`node --watch --env-file=server/.env server/mock-server.js`, port 3001). Restarts automatically when `mock-server.js` changes. Must be running for the app to load any data.
- `npm run lint` — `expo lint` (ESLint). Formatting is Prettier (`.prettierrc`: printWidth 150, double quotes, trailing commas).
- No test framework is configured.

### Local setup

- `.env` (copy `.env.example`): `EXPO_PUBLIC_API_URL=http://<LAN-IP>:3001`. Use the machine's LAN IP, not `localhost`. Never put secrets in `EXPO_PUBLIC_*` — they are bundled into the app.
- `server/.env` (gitignored, no example file): must define `JWT_SECRET=...`; `mock-server.js` throws on startup without it.
- Seed users in `server/db.json`: `admin` (role 1) and `guest` (role 2); passwords are stored only as bcrypt hashes. New users come from `POST /auth/register`.

## Backend (`server/mock-server.js`)

A `json-server` 0.17 router over `server/db.json` (tables: `users`, `sessions`, `roles`, `manhwa`, `collections`, `cards`, `userCards`) wrapped with custom middleware, in this order:
1. **Auth**: every request except `POST /auth/login` and `POST /auth/register` (`PUBLIC_ROUTES`) requires `Authorization: Bearer <JWT>`, else 401. Sets `req.user = { id, role }` from the verified token — trust only `req.user`, never `req.body`/`req.query` for identity or role.
2. **Admin gate**: POST/PUT/PATCH/DELETE on `/manhwa`, `/collections`, `/cards`, `/upload` require role 1, else 403. `/roles` is GET-only. `/users` and `/sessions` are blocked (403).
3. **Custom routes**:
   - `POST /auth/login` `{ login, password }` → `{ accessToken, user }`; login is matched trimmed + lowercased.
   - `POST /auth/register` `{ login, name, password }` → 201 `{ accessToken, user }`. Login `^[a-z0-9_]{3,20}$` (trimmed, lowercased), name 1–50, password 6–72 (bcrypt limit). Role is always 2. Errors: 400/409 `{ error, field }`.
   - `GET /auth/me`, `POST /auth/logout` (no-op 204).
   - `POST /upload` (multer, field `file`, ≤5 MB) → `{ path: "/images/uploads/<name>" }`.
   - `POST /collections` requires `releaseDate` `YYYY-MM-DD`; `POST /cards` assigns `number` server-side and returns 409 when the collection is full.
   - `GET /userCards` is forced to the current user. Direct writes to `/userCards` return 405 — ownership changes only via `POST /me/cards/:cardId` (+1 copy, creates the row) and `DELETE /me/cards/:cardId` (−1 copy, deletes at 0). The client sends only `cardId`; `collectionId`, `manhwaId`, `count`, `userId` are derived on the server.
   - `GET /me/manhwas` → manhwa the user owns cards in, with `owned` / `total`.
4. **Allow-list guard** right before `server.use(router)`: rejects `_embed`/`_expand` (400) and paths deeper than 2 segments (404). json-server's nested routes and embeds bypass the checks above (they leaked other users' `userCards` and `passwordHash`). Custom routes with deeper paths must be declared **above** this guard.
- `publicUser()` is the only shape a user is returned in — never send `passwordHash`.
- Static files from `public/` are served by json-server defaults; image paths in db.json are server-relative — use `resolveImageUrl()` (`src/api/client.ts`).

## Architecture

**Routing** (Expo Router, `src/app`, entry `expo-router/entry`):
- `_layout.tsx` — `QueryClientProvider` → `AuthProvider` → `ThemeProvider` → `RootNavigator`: spinner while `status === "loading"`, `OfflineScreen` when `"offline"`, then `Stack.Protected` exposes `(main)` when logged in and `(auth)` otherwise.
- `(auth)/login.tsx`, `(auth)/register.tsx` — react-hook-form + zod via `src/components/formInput.tsx`; linked with `<Link replace>`.
- `(main)/_layout.tsx` — Stack; `manhwa/new-manhwa` and `manhwa/new-collections` are inside `Stack.Protected guard={isAdmin}`.
- `(main)/(tabs)/` — tabs `(catalog)/index.tsx` (catalog + search), `(mine)/mine.tsx` (My collections) and `profile.tsx`. Each catalog tab has its own stack via the shared group `(catalog,mine)/` holding `manhwa/[id].tsx` (collections of a manhwa) and `manhwa/collection/[collectionId].tsx` (card grid + `CardModal`; admins bulk-upload cards here). `useIsMineTab()` tells which tab a shared screen is in (owned-only toggle).
- Route params carry only ids (plus `showAll`); screen titles come from loaded data, so deep links work.

Data hierarchy: **manhwa** → many **collections** → many **cards**. `userCards` rows (`{ userId, collectionId, manhwaId, cardId, count }`, unique per user+card) track ownership.

**Auth**:
- `src/providers/authProvider.tsx` holds `user`, `status` (`loading`/`authenticated`/`unauthenticated`/`offline`), `isLoggedIn`, `isAdmin` (`role === 1`), `logIn`, `register`, `logOut`, `retry`; consume via `useAuth()`. On startup: `getToken().then(checkAuth)` → `/auth/me`; a non-401 failure keeps the token and sets `offline`.
- Token lives in `expo-secure-store` (`src/api/token-storage.ts`).
- `src/api/axios-instance.ts`: request interceptor attaches the Bearer token; response interceptor on 401 (except login) calls `handleUnauthorized()` → removes token and fires the `setOnUnauthorized` callback (clears user + `queryClient.clear()`). 403 does not log out.
- Role checks on the client (`isAdmin`, `Stack.Protected`) are UX only; the server enforces them.

**Data layer** (TanStack Query + axios):
- `apiFetch<T>(path, options)` in `src/api/client.ts` wraps `api.request` and rethrows axios errors as `ApiError(status, body)` (`src/api/api-error.ts`). `src/api/events.ts` has `apiPOST`/`apiDELETE`. Paths are relative without leading slash, except auth routes.
- **All queries/mutations live as hooks in `src/api/queries/queries.ts` and `mutations.ts`** — add new ones there. Keys: `["manhwas"]`, `["manhwa", id]`, `["collections", manhwaId]`, `["collection", collectionId]`, `["collectionCards", collectionId]`, `["userCards"]`, `["myManhwas"]`. Mutations invalidate matching keys on success (no optimistic updates). The same key in two components is one request (shared cache).
- Loading/error/offline UI for a query: `QueryState` (`src/components/query-state`), fed with `error`, `isPaused`, `refetch`. Pull-to-refresh: `useRefresh`.
- Image upload: `src/api/upload.ts` `uploadImage(uri)` uses `expo-file-system` `UploadTask` (multipart, not axios), so it attaches the token and handles 401 manually. Pair with `useImagePicker` (compresses to ≤1080px JPEG, dedupes).
- QueryClient defaults: `staleTime: 60000`, `retry: 2`.

**Theming & styles**: `src/providers/ThemProvider.tsx` provides our theme via `useTheme()` from `@/hooks/useTheme` (`{ theme, colorScheme }`) and also feeds it to Expo Router's `ThemeProvider` (navigator backgrounds — prevents white flashes). In layouts, `useTheme` from `expo-router` returns that navigation theme. `app.json` sets `userInterfaceStyle: "dark"`. Styles are `createStyles(theme)` factories (`useStyles(createStyles)`): component styles colocated (`styles.ts`/`style.ts`), screen styles in `src/design-system/styles/*.ts`. Prefer tokens from `src/design-system/index.ts` over hardcoded values.

**Conventions**:
- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`. TS `strict`; `typedRoutes` and `reactCompiler` are enabled — type route params with `useLocalSearchParams<{...}>()`.
- Domain types in `src/types/type.ts` (`Manhwa`, `MyManhwa`, `Collections`, `Cards`, `UserCard`, `User`, `LoginResponse`). `Manhwa` is AniList-like (`title.romaji`/`title.english`, `coverImage.large`, `genres`).
- Code comments are written in Russian.
- Unused: `src/hooks/useAsuncStorage.ts` (sic), `useMyCollection` (calls nonexistent `me/collections`), `toggleTheme`.
