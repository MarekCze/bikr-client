# Active Development Context

## Current Focus
- Proceeding with Phase 2: Content & Feed System as per `developmentPlan.md`.
  - API endpoints for the Content Domain (Phase 2.1) are implemented and available.
  - Implemented Phase 2.2 (MediaCard Component System) UI components.
  - Working on integrating the UI with the feed system API.
  - API endpoints for the Like system are implemented and available.
- (Additional OAuth providers implementation is currently on hold).

## Recent Debugging and Fixes
- Fixed an issue causing feed loading errors related to data processing.
- Addressed some type inconsistencies discovered during API integration.
- **Web Build Debugging (Ongoing):**
  - **Initial Error:** Metro build failed for web due to missing `babel-plugin-module-resolver` and `react-dom/client` resolution issues.
  - **Attempt 1:** Added `babel-plugin-module-resolver` to `bikR/package.json` devDependencies and ran `npm install`. Resolved the missing module error but revealed `EXPO_ROUTER_APP_ROOT` environment variable issue.
  - **Attempt 2:** Correctly configured `expoRouter.root = './src/app'` in `bikR/app.config.js` and removed the `EXPO_ROUTER_APP_ROOT` env var from the `web` script in `bikR/package.json`. This led to `tsconfig.json` `extends` path resolution errors during `expo start`.
  - **Attempt 3:** Tried different `extends` paths (`../../node_modules/expo/tsconfig.base`, `@expo/metro-config/tsconfig.base`) in `bikR/tsconfig.json`, but the Expo CLI failed to resolve them during startup.
  - **Attempt 4:** Removed `extends` from `bikR/tsconfig.json` and inlined base TS config options. This resolved the startup error.
  - **Attempt 5 (Workaround):** Implemented the official Expo Router workaround by creating `bikR/index.js` with `require.context('./src/app')` and setting `"main": "index.js"` in `bikR/package.json`. This resolved the `EXPO_ROUTER_APP_ROOT` error during build.
  - **Attempt 6 (Refactor):** User moved `bikR/src/app` to `bikR/app` and deleted `bikR/src`. Updated `bikR/app.config.js` (`expoRouter.root`), `bikR/index.js` (`require.context`), and fixed import paths in `bikR/app/_layout.tsx` and `bikR/app/auth/_layout.tsx` to reflect the new structure.
  - **Current Status:** Font path error resolved by using `@/` alias in `app/_layout.tsx`. However, persistent web build errors remain: Metro cannot resolve `react-native-web` or `react-dom/client`, indicating the Babel configuration for web aliasing is still not functioning correctly despite explicit configuration attempts.

## Previous Changes
- Project structure split into:
  - Client (`bikr-client`): Expo/React Native application (this project)
  - Server (`bikr-server`): Fastify API server
  - Shared (`bikr-shared`): Common types and validation schemas used by both client and server.
- The API server provides endpoints for core features.
- Added Tamagui UI components to the client.
- Configured Supabase environment variables for the client.
- Set up Jest snapshot testing for client components.
- Completed Google OAuth integration with Supabase
- Implemented MMKV session persistence for authentication
- Added sign-out functionality to auth flow
- Implemented Email/Password authentication implementation:
  - Created form validation with Zod schemas
  - Implemented sign in, sign up, and password reset forms
  - Added password strength indicator component
  - Built responsive auth layout
  - Created navigation helper for auth screens
  - Implemented auth routes in Expo Router
  - Added comprehensive error handling for auth flows.
- Core Supabase database schema is designed and implemented (details in `memory-bank/schema/`).
- Updated documentation to reflect implementation progress.
- Completed Phase 2.1 (Content Domain) API implementation:
  - API endpoints are available for creating (`POST /posts`), retrieving (`GET /posts/:postId`), updating (`PUT /posts/:postId`), and deleting (`DELETE /posts/:postId`) posts.
  - API endpoints are available for liking (`POST /posts/:postId/like`), unliking (`DELETE /posts/:postId/like`), and retrieving likes (`GET /posts/:postId/likes`).
  - The client's API service (`services/api.ts`) needs to be updated/used to interact with these endpoints.
- Implemented Phase 2.2 (MediaCard Component System) in the client:
  - Created modular component architecture:
    - Base `MediaCard` component (`components/content/MediaCard/MediaCard.tsx`) with support for different content types
    - `TextPostCard` (`components/content/MediaCard/TextPostCard.tsx`)
    - `ImageGalleryCard` (`components/content/MediaCard/ImageGalleryCard.tsx`)
    - `VideoPlayerCard` (`components/content/MediaCard/VideoPlayerCard.tsx`)
    - `PollCard` (`components/content/MediaCard/PollCard.tsx`)
    - `ContextBadge` (`components/content/MediaCard/ContextBadge.tsx`)
  - Added engagement components (`components/content/EngagementRibbon/`):
    - `EngagementRibbon` container
    - `LikeButton`
    - `CommentButton`
    - `ShareButton`
    - `BookmarkButton`
    - `EventActions`
  - Created owner information components (`components/content/OwnerRibbon/`):
    - `OwnerRibbon` container
    - Includes user info, post metadata, actions, status.
  - Implemented feed examples (`components/content/examples/`):
    - `FeedExample` (demonstrates structure)
    - `MediaCardExamples` (showcases different card types)
  - Added relevant TypeScript type definitions (`MediaCardTypes.ts`, `EngagementRibbonTypes.ts`, etc.).
  - Added basic unit tests/examples.

## Pending Decisions
1. Map provider selection (Google vs OpenStreetMap)
2. Payment gateway integration (Stripe vs PayPal)
3. Offline sync strategy (Optimistic vs Background)
4. PostGIS usage for location-based queries
