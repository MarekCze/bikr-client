# Feature: Phase 3 - Social Interaction

This phase focuses on enabling users to interact with content and each other.

## 3.1 Comment System [NEXT FOCUS]

**Goal:** Allow users to comment on posts, reply to comments, and interact with comments.

**Tasks:**

1.  **Client Repository Integration (`SupabaseContentRepository.ts`):**
    *   [ ] Implement `createComment` method (calling `POST /posts/:postId/comments`).
    *   [ ] Implement `getCommentsByPostId` method (calling `GET /posts/:postId/comments`).
    *   [ ] Implement `updateComment` method (calling `PUT /comments/:commentId`).
    *   [ ] Implement `deleteComment` method (calling `DELETE /comments/:commentId`).
    *   [ ] Implement `likeComment` method (calling `POST /comments/:commentId/like`).
    *   [ ] Implement `unlikeComment` method (calling `DELETE /comments/:commentId/like`).
    *   [ ] Implement `getCommentLikes` method (calling `GET /comments/:commentId/likes` - *Note: Server endpoint might be missing, needs verification*).

2.  **Comment UI Components (`bikr-client/components/content/Comment/`):**
    *   [ ] Create `CommentInput.tsx` component for adding new comments/replies.
    *   [ ] Create `CommentItem.tsx` component to display a single comment (including author, content, timestamp, like count).
    *   [ ] Create `CommentList.tsx` component to display a list of comments, potentially handling threading/replies.
    *   [ ] Implement UI for liking/unliking comments within `CommentItem.tsx`.
    *   [ ] Implement UI for editing/deleting own comments (conditional rendering).
    *   [ ] Integrate comment count display in `EngagementRibbon.tsx` (Phase 2 component).
    *   [ ] Implement UI to trigger loading/displaying comments (e.g., in a modal or below the post).

3.  **Integration:**
    *   [ ] Connect `CommentInput.tsx` to the `createComment` repository method.
    *   [ ] Connect `CommentList.tsx` to the `getCommentsByPostId` repository method.
    *   [ ] Connect like/unlike UI actions to the respective repository methods.
    *   [ ] Connect edit/delete UI actions to the respective repository methods.

## 3.2 Following & Connections

**Goal:** Allow users to follow each other and manage their social connections.

**Tasks:**

1.  **Client Repository (`ISocialRepository`, `SupabaseSocialRepository`):**
    *   [ ] Define `ISocialRepository` interface.
    *   [ ] Implement `SupabaseSocialRepository` (calling follow/unfollow, get followers/following, search users API endpoints - *Note: Server endpoints need verification/creation*).
2.  **User Discovery UI:**
    *   [ ] Implement user search screen/component.
    *   [ ] Implement UI to display user search results.
    *   [ ] Implement UI for user recommendations (if API provides).
3.  **Connection Management UI:**
    *   [ ] Implement UI to display following/followers lists on user profiles.
    *   [ ] Implement follow/unfollow buttons on user profiles/search results.
    *   [ ] Implement UI for blocking/muting users (if supported by API).

## 3.3 Content Sharing

**Goal:** Enable users to share content both within the app and externally.

**Tasks:**

1.  **Internal Sharing:**
    *   [ ] Implement logic/UI to share a post link within the app (e.g., via direct message - depends on Phase 6).
2.  **External Sharing:**
    *   [ ] Integrate with `expo-sharing` or similar native sharing APIs.
    *   [ ] Add share button functionality to `EngagementRibbon.tsx` to trigger native share sheet.
3.  **Deep Linking (Client-Side):**
    *   [ ] Configure Expo Router for deep linking to specific posts.
