# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm start` (`npx expo start`) — Expo dev server; `npm run android` / `ios` / `web` target a platform.
- `npm run api` — start the local mock backend (`node --env-file=server/.env server/mock-server.js`, port 3001). Must be running for the app to load any data.
- `npm run lint` — `expo lint` (ESLint). Formatting is Prettier (`.prettierrc`: printWidth 150, double quotes, trailing commas).
- No test framework is configured.

### Local setup

- `.env` (copy `.env.example`): `EXPO_PUBLIC_API_URL=http://<LAN-IP>:3001`. Use the machine's LAN IP, not `localhost` — devices/Expo Go can't reach the dev machine's localhost.
- `server/.env` (gitignored, no example file): must define `JWT_SECRET=...`; `mock-server.js` throws on startup without it.
- Seed users in `server/db.json`: `admin` (role 1) and `guest` (role 2); passwords are stored only as bcrypt hashes.

## Backend (`server/mock-server.js`)

A `json-server` 0.17 router over `server/db.json` (tables: `users`, `sessions`, `roles`, `manhwa`, `collections`, `cards`, `userCards`, `userCollections`) wrapped with custom middleware:
- **Every request except `POST /auth/login` requires `Authorization: Bearer <JWT>`**, else 401.
- Custom routes: `POST /auth/login` → `{ accessToken, user }`, `GET /auth/me`, `POST /auth/logout` (no-op 204), `POST /upload` (multer, field `file`, ≤5 MB) → saves into `public/images/uploads/` and returns `{ path: "/images/uploads/<name>" }`.
- `/users` and `/sessions` are blocked (403) from the generic REST router.
- Static files from `public/` are served by json-server defaults, so image paths in db.json are server-relative — turn them into URLs with `resolveImageUrl()` (`src/api/client.ts`).
- Role checks are client-side only; the server does not restrict writes by role.

## Architecture

**Routing** (Expo Router, `src/app`, entry `expo-router/entry`):
- `_layout.tsx` — `QueryClientProvider` → `AuthProvider` → `ThemeProvider` → `RootNavigator`, which shows a spinner while auth is loading, then uses `Stack.Protected` to expose `(main)` when logged in and `(auth)` otherwise.
- `(auth)/login.tsx` — login form (react-hook-form + zod, via `src/components/formInput.tsx`).
- `(main)/_layout.tsx` — Stack; `manhwa/new-manhwa` and `manhwa/new-collections` are wrapped in `Stack.Protected guard={isAdmin}`.
- `(main)/(tabs)/` — `index.tsx` (Search, list of manhwa) and `profile.tsx`.
- `(main)/manhwa/[id].tsx` — collections of one manhwa; `(main)/manhwa/collection/[collectionId].tsx` — card grid + `CardModal` to add/remove owned copies; admins can bulk-upload cards here.

Data hierarchy: **manhwa** → many **collections** → many **cards**. `userCards` rows (`{ userId, collectionId, cardId, count }`) track ownership; `userCollections` exists in db.json/types but is unused.

**Auth**:
- `src/providers/authProvider.tsx` holds `user`, `isLoggedIn`, `isAdmin` (`role === 1`), `logIn`, `logOut`; consume via `useAuth()` (`src/hooks/useAuth.ts`). On startup it reads the token and calls `/auth/me`.
- Token lives in `expo-secure-store` (`src/api/token-storage.ts`).
- `src/api/axios-instance.ts`: request interceptor attaches the Bearer token; response interceptor on 401 (except login) calls `handleUnauthorized()` → removes token and fires the callback `AuthProvider` registered via `setOnUnauthorized` (clears user + `queryClient.clear()`).
- Use `useAuth().user?.id` for the current user — don't hardcode user IDs.

**Data layer** (TanStack Query + axios):
- `apiFetch<T>(path, options)` in `src/api/client.ts` wraps `api.request` and rethrows axios errors as `ApiError` (`src/api/api-error.ts`). `src/api/events.ts` has `apiPOST`/`apiPATCH`/`apiDELETE`. Paths are relative without leading slash (e.g. `"manhwa"`, `` `cards?collectionId=${id}` ``), except auth routes.
- **All queries/mutations live as hooks in `src/api/queries/queries.ts` and `src/api/queries/mutations.ts`** — add new ones there rather than calling `useQuery` inline. Query keys are array literals defined in those hooks (`["manhwas"]`, `["manhwa", id]`, `["collections", manhwaId]`, `["collectionCards", collectionId]`, `["userCards", userId]`); mutations invalidate the matching key on success (no optimistic updates).
- Image upload: `src/api/upload.ts` `uploadImage(uri)` uses `expo-file-system` `UploadTask` (multipart, not axios), so it attaches the token and handles 401 manually. Pair with `useImagePicker` (`src/hooks/useImagePicker.ts`).
- QueryClient defaults: `staleTime: 60000`, `retry: 2`.

**Theming & styles**: custom theme, not React Navigation theming. `src/providers/ThemProvider.tsx` → consume via `useTheme()` (`src/hooks/useTheme.ts`) which returns `{ theme, colorScheme }`. Styles are `createStyles(theme)` factories returning `StyleSheet.create(...)`: component styles are colocated (`styles.ts`/`style.ts` next to the component), screen styles live in `src/design-system/styles/*.ts`. Design tokens (`colors`, `spacing`, `radius`, `gaps`, `fontSize`, `fontWeight`, `params`) are exported from `src/design-system/index.ts` — prefer them over hardcoded values.

**Conventions**:
- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`. TS `strict`; `typedRoutes` and `reactCompiler` are enabled in `app.json` — type route params with `useLocalSearchParams<{...}>()`.
- Domain types are in `src/types/type.ts` (`Manhwa`, `Collections`, `Cards`, `UserCard`, `UserCollection`, `User`, `LoginResponse`). `Manhwa` follows an AniList-like shape (`title.romaji`/`title.english`, `coverImage.large`, `genres`).
- Code comments in this repo are written in Russian.
- `src/hooks/useAsuncStorage.ts` (sic) is currently unused.
