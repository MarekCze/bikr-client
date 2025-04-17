# Content Components

## Overview
This feature implements the UI components for displaying various types of content within the bikR application. The implementation follows the MediaCard Component System described in Phase 2.2 of the development plan.

## Development Plan Reference
From `developmentPlan.md` Phase 2.2:

```
### 2.2 MediaCard Component System
- **Tasks**:
  1. Core MediaCard Components
     - Create base MediaCard component
     - Implement text post rendering
     - Implement image gallery component
     - Implement video player component
     - Create context badge components
  
  2. Engagement Components
     - Create engagement ribbon component
     - Implement like/dislike functionality
     - Create comment count indicator
     - Implement share functionality
     - Create bookmarking system
  
  3. Owner Ribbon Components
     - Create owner information display
     - Implement timestamp formatting
     - Create user quick-action buttons
     - Implement rider status indicator
```

## Status
**Complete** (100%)

## Technical Implementation

### Component Architecture
The MediaCard component system is designed with a modular, composable architecture:

```
MediaCard/
├── MediaCard.tsx (main component that orchestrates all subcomponents)
├── MediaCardTypes.ts (TypeScript interfaces and types)
├── TextPostCard.tsx (for text-only content)
├── ImageGalleryCard.tsx (for handling image galleries)
├── VideoPlayerCard.tsx (for video content)
├── PollCard.tsx (for interactive polls)
├── ContextBadge.tsx (for showing context like Club, Event)
└── index.tsx (exports)

EngagementRibbon/
├── EngagementRibbon.tsx (container for engagement actions)
├── EngagementRibbonTypes.ts (TypeScript interfaces)
├── LikeButton.tsx 
├── CommentButton.tsx
├── ShareButton.tsx
├── BookmarkButton.tsx
├── EventActions.tsx (for event-specific actions)
└── index.tsx (exports)

OwnerRibbon/
├── OwnerRibbon.tsx (container for user/author information)
├── OwnerRibbonTypes.ts (TypeScript interfaces)
├── UserInfo.tsx (displays username, profile pic)
├── PostMetadata.tsx (timestamps, location)
├── UserActions.tsx (edit, delete, report)
├── RiderStatus.tsx (rider-specific status indicators)
└── index.tsx (exports)
```

### Key Design Patterns

1. **Component Composition**: Each MediaCard is composed of smaller, single-responsibility components
2. **Type-Driven Development**: Extensive TypeScript interfaces ensure type safety
3. **Conditional Rendering**: Components adapt to different content types (text, images, videos, polls)
4. **Prop Drilling Minimization**: Components directly accept only the props they need
5. **Testability**: Components designed with testing in mind

### Example Usage

```tsx
// Basic text post
<MediaCard 
  post={postData}
  onPress={() => navigateToPostDetail(postData.id)}
/>

// With image gallery interactions
<MediaCard 
  post={postWithImagesData}
  onPress={() => navigateToPostDetail(postData.id)}
  onImagePress={(index) => showFullScreenImage(postData.media[index])}
/>

// With poll interactions
<MediaCard 
  post={pollPostData}
  onPress={() => navigateToPostDetail(postData.id)}
  onVote={(optionId) => submitVote(postData.id, optionId)}
/>
```

### Test Implementation

Test examples have been created to demonstrate component usage and to provide a foundation for more comprehensive testing:

- `bikR/components/content/__tests__/MediaCard.test.tsx`: Basic snapshot and interaction tests
- `bikR/components/content/examples/MediaCardExamples.tsx`: Example implementation of different post types
- `bikR/components/content/examples/FeedExample.tsx`: Example of a feed with a list of posts

### Integration with Data Model

The components are designed to work with the DetailedPost type from `shared/src/types/post.ts`, ensuring seamless integration between the API responses and the UI components.

## Future Enhancements

1. Address TypeScript errors in FeedExample component with ListHeaderComponent and ListEmptyComponent types
2. Implement performance optimizations for image gallery rendering
3. Add lazy loading for video content
4. Enhance accessibility features
5. Create animations for interactions (likes, comments)
6. Add theming support for dark/light mode
