# Phase 4: Club Management (Client)

**Goal:** Implement the client-side features for creating, discovering, joining, and interacting within motorcycle clubs.

## 1. Shared Definitions Integration
- **Tasks**:
  - [x] Ensure `bikr-shared` includes necessary types (`Club`, `ClubMembership`, `ClubRole`, `IClubRepository`, `PaginatedResponse`).
  - [x] Ensure `bikr-shared` includes Zod schemas for club-related operations (`CreateClubSchema`, `UpdateClubSchema`, etc.).
  - [ ] Update client dependencies if `bikr-shared` was modified. (Manual step needed after shared changes are complete and published)

## 2. Client Repository (`bikr-client/repositories/`)
- **Tasks**:
  - [ ] Create `IClubRepository.ts` (if not defined in `bikr-shared`).
  - [ ] Create `SupabaseClubRepository.ts`.
  - [ ] Implement `IClubRepository` interface in `SupabaseClubRepository`.
    - [ ] `createClub(clubData)`: Calls `POST /clubs`.
    - [ ] `getClubs(filters)`: Calls `GET /clubs`.
    - [ ] `getClubById(clubId)`: Calls `GET /clubs/:clubId`.
    - [ ] `updateClub(clubId, updateData)`: Calls `PUT /clubs/:clubId`.
    - [ ] `deleteClub(clubId)`: Calls `DELETE /clubs/:clubId`.
    - [ ] `joinClub(clubId)`: Calls `POST /clubs/:clubId/join`.
    - [ ] `leaveClub(clubId)`: Calls `POST /clubs/:clubId/leave`.
    - [ ] `getClubMembers(clubId)`: Calls `GET /clubs/:clubId/members`.
    - [ ] `updateClubMemberRole(clubId, userId, role)`: Calls `PUT /clubs/:clubId/members/:userId`.
    - [ ] `removeClubMember(clubId, userId)`: Calls `DELETE /clubs/:clubId/members/:userId`.
    - [ ] `getClubFeed(clubId, pagination)`: Calls `GET /clubs/:clubId/feed`.
    - [ ] `createClubPost(clubId, postData)`: Calls `POST /clubs/:clubId/posts` (if applicable).
  - [ ] Add `ClubRepository` to dependency injection or context providers.

## 3. UI Components (`bikr-client/components/club/`)
- **Tasks**:
  - [ ] Create `ClubListItem.tsx`: Displays basic club info (name, image, member count) for lists.
  - [ ] Create `ClubHeader.tsx`: Displays club banner, avatar, name, join/leave button, member count, etc. on the club profile.
  - [ ] Create `ClubDetails.tsx`: Displays club description, rules, location map (basic for now).
  - [ ] Create `ClubMemberListItem.tsx`: Displays member avatar, name, role, action buttons (promote/remove for admins).
  - [ ] Create `ClubSettingsForm.tsx`: Form using Tamagui components for creating/editing club details (name, description, privacy, rules, image upload).
  - [ ] Create `JoinLeaveButton.tsx`: Button that shows "Join", "Leave", "Requested", or "Admin" based on user's membership status. Handles API calls via repository.

## 4. Screens (`bikr-client/app/club/`)
- **Tasks**:
  - [ ] Create `_layout.tsx`: Stack layout for club-related screens.
  - [ ] Create `index.tsx`: Club discovery screen.
    - [ ] Implement search/filter UI.
    - [ ] Fetch and display clubs using `ClubListItem` and `SupabaseClubRepository`.
    - [ ] Add button/link to navigate to `create.tsx`.
  - [ ] Create `create.tsx`: Screen for creating a new club.
    - [ ] Use `ClubSettingsForm`.
    - [ ] Handle form submission using `SupabaseClubRepository.createClub`.
    - [ ] Navigate to the new club's page on success.
  - [ ] Create `[clubId]/` directory.
  - [ ] Create `[clubId]/_layout.tsx`: Layout for tabs within a club profile (e.g., Feed, Details, Members).
  - [ ] Create `[clubId]/index.tsx`: Main club profile screen (Feed).
    - [ ] Use `ClubHeader`.
    - [ ] Fetch club feed using `SupabaseClubRepository.getClubFeed`.
    - [ ] Display feed using `BaseFeedPage` or similar component, passing club context.
    - [ ] Adapt post creation UI to allow posting *to* this club.
  - [ ] Create `[clubId]/details.tsx`: Screen showing club details.
    - [ ] Use `ClubHeader`.
    - [ ] Use `ClubDetails` component.
    - [ ] Fetch club details using `SupabaseClubRepository.getClubById`.
  - [ ] Create `[clubId]/members.tsx`: Screen showing club member directory.
    - [ ] Use `ClubHeader`.
    - [ ] Fetch members using `SupabaseClubRepository.getClubMembers`.
    - [ ] Display members using `ClubMemberListItem`.
    - [ ] Implement role update/removal UI for admins.
  - [ ] Create `[clubId]/settings.tsx`: Screen for club owners/admins to edit settings.
    - [ ] Use `ClubHeader`.
    - [ ] Use `ClubSettingsForm`, pre-filled with existing data.
    - [ ] Handle form submission using `SupabaseClubRepository.updateClub`.
    - [ ] Add delete club functionality (with confirmation).

## 5. Integration
- **Tasks**:
  - [ ] Add "Clubs" item to the main app navigation (e.g., bottom tabs).
  - [ ] Ensure deep linking works for club profiles (`/club/:clubId`).
  - [ ] Link club names/badges in posts or user profiles to the respective club screen.
  - [ ] Update user profile screen to show club memberships.
