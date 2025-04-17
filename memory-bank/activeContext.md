# Active Development Context

## Current Focus
- Proceeding with Phase 2: Content & Feed System as per `developmentPlan.md`.
  - Completed Phase 2.1 (Content Domain) API implementation.
  - Implemented Phase 2.2 (MediaCard Component System) UI components.
  - Working on remaining parts of Content & Feed System.
  - Completed Like system backend implementation with API endpoints.
- (Additional OAuth providers implementation is currently on hold).

## Recent Debugging and Fixes
- Fixed a critical naming convention issue in the Feed Repository:
  - Identified a property name mismatch in `supabaseFeedRepository.ts` where the repository was using `created_at` (snake_case from database) when the processed data used `createdAt` (camelCase in application)
  - Updated the cursor generation code to use the correct camelCase field name `createdAt` instead of `created_at`
  - Created mock tests to verify the fix works correctly
  - The real implementation test revealed a missing database function: `get_popular_feed`

- Discovered TypeScript errors in the Content Repository that still need fixing:
  - Type mismatches between snake_case database fields and camelCase application types
  - Array properties (like `profiles`) being accessed as if they were objects
  - `likeCount` expecting number but receiving array of objects
  - `contentType` property used in code but missing from `Like` type definition
  - Poll option related properties missing or mismatched

- **Web Build Debugging (Ongoing):**
  - **Initial Error:** Metro build failed for web due to missing `babel-plugin-module-resolver` and `react-dom/client` resolution issues.
  - **Attempt 1:** Added `babel-plugin-module-resolver` to `bikR/package.json` devDependencies and ran `npm install`. Resolved the missing module error but revealed `EXPO_ROUTER_APP_ROOT` environment variable issue.
  - **Attempt 2:** Correctly configured `expoRouter.root = './src/app'` in `bikR/app.config.js` and removed the `EXPO_ROUTER_APP_ROOT` env var from the `web` script in `bikR/package.json`. This led to `tsconfig.json` `extends` path resolution errors during `expo start`.
  - **Attempt 3:** Tried different `extends` paths (`../../node_modules/expo/tsconfig.base`, `@expo/metro-config/tsconfig.base`) in `bikR/tsconfig.json`, but the Expo CLI failed to resolve them during startup.
  - **Attempt 4:** Removed `extends` from `bikR/tsconfig.json` and inlined base TS config options. This resolved the startup error.
  - **Attempt 5 (Workaround):** Implemented the official Expo Router workaround by creating `bikR/index.js` with `require.context('./src/app')` and setting `"main": "index.js"` in `bikR/package.json`. This resolved the `EXPO_ROUTER_APP_ROOT` error during build.
  - **Attempt 6 (Refactor):** User moved `bikR/src/app` to `bikR/app` and deleted `bikR/src`. Updated `bikR/app.config.js` (`expoRouter.root`), `bikR/index.js` (`require.context`), and fixed import paths in `bikR/app/_layout.tsx` and `bikR/app/auth/_layout.tsx` to reflect the new structure.
  - **Current Status:** Font path error resolved by using `@/` alias in `bikR/app/_layout.tsx`. However, persistent web build errors remain: Metro cannot resolve `react-native-web` or `react-dom/client`, indicating the Babel configuration for web aliasing is still not functioning correctly despite explicit configuration attempts.

## Previous Changes
- Implemented monorepo structure with three main workspaces:
  - Frontend (bikR): Expo/React Native application
  - API (api): Fastify server as middleware layer
  - Shared (shared): Common types and validation schemas
- Created API layer with main features:
  - Centralized business logic
  - Enhanced validation and security
  - Type-safe data transfer between frontend and backend
  - Future flexibility for introducing caching and third-party integrations
- Added Tamagui UI components
- Configured Supabase environment variables
- Set up Jest snapshot testing
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
  - Added comprehensive error handling
- Designed and implemented core Supabase database schema:
  - Created comprehensive domain-based table structure
  - Implemented Row Level Security (RLS) policies for all tables
  - Added track-specific fields to routes table
  - Created proper table relationships and indexes
  - Documented schema design in memory bank
- Updated documentation to reflect implementation progress
- Fixed API layer configuration issues:
  - Resolved Swagger UI setup by installing `@fastify/swagger-ui` and correcting plugin registration (`api/src/plugins/swagger.ts`).
  - Added TypeScript declaration file (`api/src/types/fastify.d.ts`) to resolve decorated `config` property access error.
- Reviewed and finalized Supabase database schema implementation, including RLS policies and grants for all features defined in `developmentPlan.md`.
- Continuing with Phase 2.1 (Content Domain):
  - Defined Post domain models and related types (`shared/src/types/post.ts`).
  - Defined `IContentRepository` interface and refined methods (`shared/src/repositories/contentRepository.ts`).
  - Added Zod validation schemas for posts/comments (`shared/src/validation/schemas.ts`).
  - Implemented `SupabaseContentRepository` with `createPost` method (`api/src/repositories/supabaseContentRepository.ts`).
  - Refactored `ContentService` to use the repository for `createPost` (`api/src/services/content/contentService.ts`).
  - Implemented `POST /posts` API endpoint (`api/src/routes/post.ts`).
  - Defined `DetailedPost` type (`shared/src/types/post.ts`).
  - Created `func_get_detailed_post` RPC function (`memory-bank/schema/rpc/func_get_detailed_post.sql`).
  - Implemented `getPostById` in repository (`api/src/repositories/supabaseContentRepository.ts`) using RPC.
  - Implemented `getPostById` in service (`api/src/services/content/contentService.ts`).
  - Implemented `GET /posts/:postId` API endpoint (`api/src/routes/post.ts`).
  - Added `updatePostSchema` for post updates validation (`shared/src/validation/schemas.ts`).
  - Implemented `updatePost` in repository with media/poll handling (`api/src/repositories/supabaseContentRepository.ts`).
  - Implemented `updatePost` in service with proper business logic (`api/src/services/content/contentService.ts`).
  - Implemented `PUT /posts/:postId` API endpoint (`api/src/routes/post.ts`).
  - Implemented `deletePost` in repository with cascading delete and storage cleanup (`api/src/repositories/supabaseContentRepository.ts`).
  - Implemented `deletePost` in service (`api/src/services/content/contentService.ts`).
  - Implemented `DELETE /posts/:postId` API endpoint (`api/src/routes/post.ts`).
  - Added type conversion helper `convertToPartialPost` to handle schema-to-domain model conversion.
  - Implemented like system endpoints for posts:
    - Added `POST /posts/:postId/like` API endpoint for liking posts
    - Added `DELETE /posts/:postId/like` API endpoint for unliking posts
    - Added `GET /posts/:postId/likes` API endpoint for retrieving post likes
    - Updated frontend API client with new like endpoints
- Implemented Phase 2.2 (MediaCard Component System):
  - Created modular component architecture:
    - Base `MediaCard` component with support for different content types
    - `TextPostCard` for text-only content
    - `ImageGalleryCard` for posts with image attachments
    - `VideoPlayerCard` for video content display
    - `PollCard` for interactive polls
    - `ContextBadge` for showing post context (Club, Event, etc.)
  - Added engagement components:
    - `EngagementRibbon` container component
    - `LikeButton` with active/inactive states
    - `CommentButton` with count display
    - `ShareButton` for content sharing
    - `BookmarkButton` with save/unsave functionality
    - `EventActions` for event-specific interactions
  - Created owner information components:
    - `OwnerRibbon` container component
    - `UserInfo` for display name, username, avatar
    - `PostMetadata` for timestamp and location
    - `UserActions` for post owner options
    - `RiderStatus` indicator
  - Implemented feed examples:
    - `FeedExample` with mock data and infinite scroll setup
    - `MediaCardExamples` showcasing different post types
  - Added TypeScript type definitions:
    - `MediaCardTypes.ts` with proper interfaces
    - `EngagementRibbonTypes.ts` for interaction props
    - `OwnerRibbonTypes.ts` for user display props
  - Added unit tests:
    - Created test examples for MediaCard components
    - Added test data fixtures

## Pending Decisions
1. Map provider selection (Google vs OpenStreetMap)
2. Payment gateway integration (Stripe vs PayPal)
3. Offline sync strategy (Optimistic vs Background)
4. PostGIS usage for location-based queries
