# Feed System

## Overview
The Feed System is a core component of the bikR application, enabling users to discover and interact with content from the motorcycle community. It provides different feed types (User, Popular, Local, Club, Event) with efficient data loading, filtering, and a responsive UI.

## Development Plan Reference
Reference to Phase 2.3 in `developmentPlan.md`:
- Create feed repository interface
- Implement different feed query strategies
- Create feed caching and pagination
- Build feed UI components
- Implement various feed type implementations

## Status
In Progress

## Technical Architecture (Client Focus)

### Data Flow
```mermaid
flowchart TD
    UI[Feed UI Components] --> UserInteraction[User Interaction (Scroll, Refresh, Filter)]
    UserInteraction --> FeedContext[Feed Context/Hook]
    FeedContext --> APIClient[API Client (services/api.ts)]
    APIClient --> ServerAPI[Server API (/feed/*)]
    ServerAPI --> APIClient
    APIClient --> Cache[Client Cache (MMKV/utils/feedCache.ts)]
    Cache --> FeedContext
    APIClient --> FeedContext
    FeedContext --> UI
```

### Component Hierarchy
```mermaid
flowchart TD
    BaseFeed[BaseFeedPage Component (`components/feed/BaseFeedPage.tsx`)] --> InfiniteScroll[Infinite Scroll Logic (FlashList)]
    BaseFeed --> PTR[Pull-to-Refresh Logic]
    BaseFeed --> FeedFilter[Feed Filter Components UI]
    BaseFeed --> UserFeed[UserFeedPage (`components/feed/UserFeedPage.tsx`)]
    BaseFeed --> PopularFeed[PopularFeedPage (`components/feed/PopularFeedPage.tsx`)]
    BaseFeed --> LocalFeed[LocalFeedPage (`components/feed/LocalFeedPage.tsx`)]
    BaseFeed --> FilteredFeeds[Filtered Feed Pages (`components/feed/FilteredFeedPage.tsx`)]
```

## Tasks (Client Focus)

1. Feed Data Management Layer (Client)
   - [x] Utilize feed repository interface from `bikr-shared` (`shared/src/repositories/feedRepository.ts`)
   - [x] Implement client-side feed fetching logic in API client (`services/api.ts`)
     - [x] Call `GET /feeds/user` endpoint
     - [x] Call `GET /feeds/popular` endpoint
     - [x] Call `GET /feeds/local` endpoint (passing client location)
     - [x] Call `GET /feeds/filtered` endpoint (for club/event feeds)
     - [x] Handle API responses and errors
   - [x] Design and implement client-side caching strategy
     - [x] Client-side caching with MMKV (`utils/feedCache.ts`)
     - [x] Implement cache invalidation logic (e.g., on refresh, post creation)

2. Feed UI Components (`components/feed/`)
   - [x] Create BaseFeedPage component
     - [x] Implement state management for feed data (posts, cursor, loading, error)
     - [x] Add loading and error state UI
     - [x] Build UI layout structure using Tamagui
   - [x] Implement infinite scroll functionality
     - [x] Integrate with FlashList for optimal performance
     - [x] Handle cursor-based pagination logic (fetching more data)
     - [ ] Add scroll position restoration (optional enhancement)
   - [ ] Create feed filter components
     - [ ] Design filter bar UI
     - [ ] Implement filter state management
     - [ ] Add filter persistence (optional enhancement)
   - [x] Add pull-to-refresh functionality
     - [x] Implement data refresh mechanism (calling fetchFeed with no cursor)
     - [x] Add loading indicator (using FlashList `refreshing` prop)

3. Feed Type Implementations (`app/(tabs)/`, `components/feed/`)
   - [x] Create Feed Context provider (`contexts/FeedContext.tsx`)
     - [x] Implement feed state management (using React Context/hooks)
     - [x] Integrate caching functionality
     - [x] Create refresh methods
   - [x] Implement UserFeed page (`components/feed/UserFeedPage.tsx`, integrated in `app/(tabs)/index.tsx`?)
     - [x] Integrate with `BaseFeedPage`, passing user feed fetch logic
   - [x] Implement PopularFeed page (`components/feed/PopularFeedPage.tsx`, integrated in `app/(tabs)/explore.tsx`?)
     - [x] Integrate with `BaseFeedPage`, passing popular feed fetch logic
   - [x] Implement LocalFeed page (`components/feed/LocalFeedPage.tsx`)
     - [x] Integrate with `BaseFeedPage`, passing local feed fetch logic
     - [x] Add location permission handling and fetching
   - [ ] Implement filtered feed pages (`components/feed/FilteredFeedPage.tsx`)
     - [ ] Create ClubFeed page integration
     - [ ] Create EventFeed page integration
     - [ ] Add SkillLevelFeed page integration (if API supports)
     - [ ] Create BikeTypeFeed page integration (if API supports)

4. Testing (Client)
   - [ ] Write unit tests for Feed Context/hooks (mocking API calls)
   - [ ] Implement UI component tests for `BaseFeedPage` and specific feed pages
   - [ ] Add integration tests for feed loading and interaction flows
   - [ ] Perform performance testing on feed scrolling

## Implementation Details (Client Focus)

### Shared Feed Interfaces (from `bikr-shared`)
```typescript
// shared/src/repositories/feedRepository.ts - Relevant parts for client
export interface FeedQueryOptions {
  cursor?: string;
  limit?: number;
  // ... other potential client-side filters
}

export interface FeedResult {
  posts: DetailedPost[]; // DetailedPost from shared/src/types/post.ts
  nextCursor?: string;
  hasMore: boolean;
}
```

### BaseFeedPage Component Structure
```typescript
// bikr-client/components/feed/BaseFeedPage.tsx
export type FeedPageProps = {
  fetchFeedFunction: (options: FeedQueryOptions) => Promise<FeedResult>; // Function provided by specific feed page
  feedKey: string; // Unique key for caching
  // ... other props like HeaderComponent, EmptyComponent, filters
};

export function BaseFeedPage({ fetchFeedFunction, feedKey, ...props }: FeedPageProps) {
  // State for posts, loading, error, cursor
  // Logic for initial fetch, fetchMore, refresh
  // Uses FlashList for rendering MediaCard components
}
```

### Feed Context Provider
```typescript
// bikr-client/contexts/FeedContext.tsx
// Provides shared state or functions if needed across different feed types,
// potentially managing cache access or refresh triggers.
export const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: PropsWithChildren<{}>) {
  // State, cache access logic, refresh functions
}

export const useFeedContext = () => { // Renamed hook
  const context = useContext(FeedContext);
  // ... error handling ...
  return context;
};
```

## Technical Considerations (Client-Side)

1. **Pagination Strategy**:
   - Client implements cursor-based pagination logic, requesting next page from API.
   - Client manages `nextCursor` state.

2. **Performance Optimization**:
   - Client utilizes FlashList for virtualized list rendering.
   - Client implements lazy loading and progressive image loading within `MediaCard`.
   - Client implements smart caching (`utils/feedCache.ts`) to reduce network requests.

3. **Offline Support**:
   - Client uses MMKV storage (`utils/feedCache.ts`) for feed data caching.
   - Client UI shows cached data when offline.
   - Client UI provides clear loading/error states for network issues.

4. **Location Integration**:
   - Client requests location permissions and fetches device location for local feed.
   - Client passes location coordinates to the `/feeds/local` API endpoint.
   - Client displays location-related info (e.g., distance) if provided by API.

## Integration Points (Client)

- **Authentication**: Client API calls (`services/api.ts`) automatically include auth tokens.
- **Content Components**: `MediaCard` component (`components/content/MediaCard/`) is used to render feed items.
- **Navigation**: Feed items link to detail pages using Expo Router.
- **Storage**: Media content URLs (fetched via API) are used by `MediaCard` to display images/videos.

## Future Enhancements (Client Focus)

- Implement advanced client-side filtering UI.
- Add animations and smoother transitions.
- Enhance offline experience with more robust caching.
- Integrate analytics for feed interaction tracking.
