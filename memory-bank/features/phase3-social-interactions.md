# Phase 3: Social Interaction Features

This phase focuses on building the core social features that allow users to interact with content and each other.

## 3.1 Comment System

### 3.1.1 Comment Domain & Client Repository
- [ ] **Define Comment Entity Model**: Utilize the comment entity model from `bikr-shared`.
- [ ] **Create Client Repository Interface**: Define `ICommentRepository.ts` for client-side comment operations.
- [ ] **Implement Supabase Repository**: Create `SupabaseCommentRepository.ts` implementing `ICommentRepository` to interact with comment API endpoints (CRUD operations).

### 3.1.2 Comment Components
- [ ] **Comment Input Component**: Create `components/content/Comment/CommentInput.tsx` for users to write and submit comments.
- [ ] **Comment Item Component**: Create `components/content/Comment/CommentItem.tsx` to display a single comment.
- [ ] **Comment List Component**: Create `components/content/Comment/CommentList.tsx` to display a list of comments, potentially with pagination/lazy loading.
- [ ] **Threaded Replies UI**: Implement UI logic within `CommentItem` and `CommentList` to support nested/threaded replies.
- [ ] **Comment Editing UI**: Add functionality to `CommentItem` to allow users to edit their own comments (requires API support).
- [ ] **Comments Container**: Create `components/content/Comment/Comments.tsx` to integrate Input, List, and manage overall comment section state for a post.
- [ ] **Index Export**: Create `components/content/Comment/index.ts` for easier imports.

### 3.1.3 Comment Interactions (Client-Side)
- [ ] **Comment Like/Dislike**: Implement UI elements and API calls within `CommentItem` for liking/disliking comments.
- [ ] **Mentions**: Implement UI suggestions (e.g., `@user`) in `CommentInput` and formatting in `CommentItem`.
- [ ] **Notification Handling**: Integrate logic to handle real-time comment notifications (e.g., highlighting new comments).
- [ ] **Moderation Integration**: Add UI elements/logic for comment reporting or flagging if moderation APIs are available.

## 3.2 Following & Connections

### 3.2.1 Social Graph Domain & Client Repository
- [ ] **Define Connection Model**: Utilize connection/following model from `bikr-shared`.
- [ ] **Create Client Repository Interface**: Define `ISocialRepository.ts` for follow/unfollow and connection-related operations.
- [ ] **Implement Supabase Repository**: Create `SupabaseSocialRepository.ts` implementing `ISocialRepository` to interact with follow/unfollow API endpoints.

### 3.2.2 User Discovery
- [ ] **User Search UI**: Create a dedicated search screen or component allowing users to search for other users.
- [ ] **User Search API Integration**: Connect the search UI to the relevant API endpoint.
- [ ] **User Recommendations UI**: Implement UI sections to display recommended users based on API data.
- [ ] **"People You May Know" UI**: Implement UI sections to display potential connections based on API data.

### 3.2.3 Connection Management UI
- [ ] **Following/Followers Lists**: Create screens or components to display lists of users someone is following or is followed by (requires API calls).
- [ ] **Follow/Unfollow Buttons**: Integrate follow/unfollow buttons into user profiles, search results, and recommendation lists.
- [ ] **Block/Mute Functionality**: Implement UI elements and API calls for blocking or muting other users.

## 3.3 Content Sharing

### 3.3.1 Share Service Integration
- [ ] **Internal Sharing**: Implement logic to create links/references for sharing content within the app.
- [ ] **External Sharing**: Integrate with `expo-sharing` or similar native APIs to allow sharing content to other apps (e.g., social media, messaging).
- [ ] **Deep Linking Setup**: Configure deep linking to allow users to open specific content within the app from external links.

### 3.3.2 Share UI Components
- [ ] **Update Share Button**: Enhance `components/content/EngagementRibbon/ShareButton.tsx` to trigger the sharing options.
- [ ] **Share Sheet/Modal**: Create a custom modal or utilize native share sheets to present internal and external sharing options.
- [ ] **Share Preview**: Implement UI to show a preview of the content being shared.
- [ ] **Custom Share Messages**: Allow users to add custom messages when sharing externally.
