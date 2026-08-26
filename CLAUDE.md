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
- `src/app/_layout.tsx` — root `Stack`, wraps everything in `ThemeProvider`.
- `src/app/(tabs)/` — tab group: `index.tsx` (Search tab, lists all anime) and `profile.tsx`.
- `src/app/anime/[id].tsx` — collections ("seasons") belonging to one anime.
- `src/app/anime/collection/[collectionId].tsx` — grid of cards belonging to one collection; tapping a card opens a `Modal` (currently a placeholder, no card detail view yet).

This mirrors the data hierarchy: an **anime** has many **collections**, a **collection** has many **cards**.

**Data fetching**: `src/api/client.ts` exports `aniFetch<T>(url)`, a thin wrapper around `fetch` against `EXPO_PUBLIC_API_URL`. `src/hooks/useAPI.ts` exports `useFetch<T>(url)`, the standard hook used by every list screen/component — returns `{ data, loading, error, refetch }`. Screens filter the fetched collection client-side (e.g. collections filtered by `animeId`, cards filtered by `collectionId`) rather than querying the mock API with params. Ownership tables (`userCollections`, `userCards`) exist in `db.json` but aren't wired into any UI yet — there's no "collected" state or auth in the app currently.

**Theming**: custom theme system, not React Navigation's built-in theming. `src/providers/ThemProvider.tsx` defines `ThemeContext` (light/dark toggle, initialized from `useColorScheme()`); consume it via the `useTheme()` hook (`src/hooks/useTheme.ts`), never `useContext` directly. Each component computes its styles by calling a local `createStyles(theme)` factory (colocated `styles.ts`/`style.ts` next to the component) — this is the standard styling pattern throughout, not a CSS-in-JS library or NativeWind.

**Design tokens**: `src/design-system/theme/` holds `colors.ts`, `spacing.ts`, `radius.ts`, `gaps.ts`, `typography.ts`, aggregated into a single `params` object and re-exported from `src/design-system/index.ts`. Prefer importing tokens from there rather than hardcoding values in `createStyles`.

**Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@/assets/*` → `assets/*`. TypeScript `strict` mode is on; `experiments.typedRoutes` is enabled in `app.json`, so route params should be typed via `useLocalSearchParams<{...}>()` as already done in the collection screen.

**Types**: domain shapes live in `src/types/type.ts` (`Cards`, `Collections`, `TitleCardItem`); `TitleCardItem` follows an AniList-like shape (`title.romaji`/`title.english`, `coverImage.large`, `genres`, etc.) since anime metadata in `db.json` mimics that schema.
