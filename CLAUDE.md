# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm start` (or `npx expo start`) — start the Expo dev server.
- `npm run android` / `npm run ios` / `npm run web` — start the dev server targeting a specific platform.
- `npm run api` — start the local mock backend (`json-server --watch server/db.json --port 3001`). Must be running for the app to load any data.
- `npm run lint` — run `expo lint` (ESLint).
- No test framework is configured in this repo.

### Local API setup

The app has no real backend — `server/db.json` is a `json-server` mock REST API (tables: `anime`, `collections`, `cards`, `userCollections`, `userCards`). The app reads its base URL from `EXPO_PUBLIC_API_URL` (see `.env.example`). Since Expo Go / simulators/devices can't reach `localhost` on the dev machine, `.env` must point at the machine's LAN IP (e.g. `http://192.168.x.x:3001`), not `localhost`. Copy `.env.example` to `.env` and set the IP before running the app.

## Architecture

**Routing**: Expo Router (file-based) under `src/app`, `main` entry is `expo-router/entry`. Screen flow:
- `src/app/_layout.tsx` — root `Stack`, wraps everything in `QueryClientProvider` (TanStack Query) then `ThemeProvider`.
- `src/app/(tabs)/` — tab group: `index.tsx` (Search tab, lists all anime via `CardTitleList`) and `profile.tsx`.
- `src/app/anime/[id].tsx` — collections ("seasons") belonging to one anime, rendered by `CollectionsList`.
- `src/app/anime/collection/[collectionId].tsx` — grid of cards belonging to one collection; tapping a card opens `CardModal`, which lets the user add/remove owned copies of that card.

This mirrors the data hierarchy: an **anime** has many **collections**, a **collection** has many **cards**.

**Data fetching**: TanStack Query + axios, called directly from screens/components — there is no shared `useFetch`-style wrapper hook.
- `src/api/axios-instance.tsx` exports `api`, an axios instance with `baseURL: EXPO_PUBLIC_API_URL`.
- `src/api/client.ts` exports `apiFetch<T>(path, options?)`, which wraps `api.request` and rethrows axios errors as `ApiError` (`src/api/api-error.ts`); also exports `resolveImageUrl(path)` for turning db.json-relative image paths into full URLs.
- `src/api/events.ts` exports `apiPOST`/`apiPATCH`/`apiDELETE` mutation helpers built on `apiFetch`.
- Each screen/component calls `useQuery({ queryKey: [...], queryFn: () => apiFetch(...) })` directly (e.g. `["anime"]`, `["collections", id]`, `["userCards", 1]`) — there's no query-key constants file, so keep new keys consistent with the existing ad hoc array literals when adding queries.
- Mutations use `useMutation` + `queryClient.invalidateQueries` on success (see `src/app/anime/collection/[collectionId].tsx`), rather than optimistic updates.
- `src/hooks/useAPI.ts` (`useFetch`) and `src/api/client(old).ts` are leftover dead code from a pre-TanStack-Query fetch-based implementation — `useFetch`'s import (`@/api/client(old)`) is broken, and nothing in the app imports it. Don't build on it.

**Ownership state**: `userCards` (one row per owned card, with a `count`) is wired into `src/app/anime/collection/[collectionId].tsx` — `addMutations`/`removeMutations` POST/PATCH/DELETE rows keyed by `{ userId, collectionId, cardId }` and drive the `Card`/`CardModal` owned/count UI. There's no auth, so `userId` is hardcoded to `1` everywhere. `userCollections` exists in `db.json` and has a matching `UserCollection` type but isn't queried or mutated anywhere yet — there's no collection-level "owned" tracking, only card-level.

**Theming**: custom theme system, not React Navigation's built-in theming. `src/providers/ThemProvider.tsx` defines `ThemeContext` (light/dark toggle, initialized from `useColorScheme()`); consume it via the `useTheme()` hook (`src/hooks/useTheme.ts`), never `useContext` directly. Each component computes its styles by calling a local `createStyles(theme)` factory (colocated `styles.ts`/`style.ts` next to the component) — this is the standard styling pattern throughout, not a CSS-in-JS library or NativeWind.

**Design tokens**: `src/design-system/theme/` holds `colors.ts`, `spacing.ts`, `radius.ts`, `gaps.ts`, `typography.ts`, aggregated into a single `params` object and re-exported from `src/design-system/index.ts`. Prefer importing tokens from there rather than hardcoding values in `createStyles`.

**Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@/assets/*` → `assets/*`. TypeScript `strict` mode is on; `experiments.typedRoutes` and `experiments.reactCompiler` are enabled in `app.json`, so route params should be typed via `useLocalSearchParams<{...}>()` as already done in the collection screen.

**Types**: domain shapes live in `src/types/type.ts` (`Cards`, `Collections`, `TitleCardItem`, `UserCard`, `UserCollection`); `TitleCardItem` follows an AniList-like shape (`title.romaji`/`title.english`, `coverImage.large`, `genres`, etc.) since anime metadata in `db.json` mimics that schema.
