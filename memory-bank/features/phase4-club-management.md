# Phase 4: Club Management (Client)

**Goal:** Implement the client-side features for creating, discovering, joining, and interacting within motorcycle clubs.

## 1. Shared Definitions Integration
- **Tasks**:
  - [x] Ensure `bikr-shared` includes necessary types (`Club`, `ClubMembership`, `ClubRole`, `IClubRepository`, `PaginatedResponse`).
  - [x] Ensure `bikr-shared` includes Zod schemas for club-related operations (`CreateClubSchema`, `UpdateClubSchema`, etc.).
  - [ ] Update client dependencies if `bikr-shared` was modified. (Manual step needed after shared changes are complete and published)

## 2. Client Repository (`bikr-client/repositories/`)
- **Tasks**:
  - [x] Create `IClubRepository.ts` (defined in `bikr-shared`).
  - [x] Create `SupabaseClubRepository.ts`.
  - [x] Implement `IClubRepository` interface in `SupabaseClubRepository`.
    - [x] `createClub(clubData)`: Calls `POST /clubs`.
    - [x] `getClubs(filters)`: Calls `GET /clubs`.
    - [x] `getClubById(clubId)`: Calls `GET /clubs/:clubId`.
    - [x] `updateClub(clubId, updateData)`: Calls `PUT /clubs/:clubId`.
    - [x] `deleteClub(clubId)`: Calls `DELETE /clubs/:clubId`.
    - [x] `joinClub(clubId)`: Calls `POST /clubs/:clubId/join`.
    - [x] `leaveClub(clubId)`: Calls `POST /clubs/:clubId/leave`.
    - [x] `getClubMembers(clubId)`: Calls `GET /clubs/:clubId/members`.
    - [x] `updateClubMemberRole(clubId, userId, role)`: Calls `PUT /clubs/:clubId/members/:userId`.
    - [x] `removeClubMember(clubId, userId)`: Calls `DELETE /clubs/:clubId/members/:userId`.
    - [x] `getClubFeed(clubId, pagination)`: Calls `GET /clubs/:clubId/feed`.
    - [x] `createClubPost(clubId, postData)`: Calls `POST /clubs/:clubId/posts` (if applicable).
  - [x] Add `ClubRepository` to dependency injection or context providers.

## 3. UI Components (`bikr-client/components/club/`)
- **Tasks**:
  - [x] Create `ClubListItem.tsx`: Displays basic club info (name, image, member count) for lists.
  - [x] Create `ClubHeader.tsx`: Displays club banner, avatar, name, join/leave button, member count, etc. on the club profile.
  - [x] Create `ClubDetails.tsx`: Displays club description, rules, location map (basic for now). (Implemented in details.tsx screen)
  - [x] Create `ClubMemberListItem.tsx`: Displays member avatar, name, role, action buttons (promote/remove for admins).
  - [ ] Create `ClubSettingsForm.tsx`: Form using Tamagui components for creating/editing club details (name, description, privacy, rules, image upload).
  - [x] Create `JoinLeaveButton.tsx`: Button that shows "Join", "Leave", "Requested", or "Admin" based on user's membership status. Handles API calls via repository.
  - [x] Create `index.ts` export file for club components.

## 4. Screens (`bikr-client/app/club/`)
- **Tasks**:
  - [x] Create `_layout.tsx`: Stack layout for club-related screens.
  - [x] Create `index.tsx`: Club discovery screen.
    - [x] Implement search/filter UI.
    - [x] Fetch and display clubs using `ClubListItem` and `SupabaseClubRepository`.
    - [x] Add button/link to navigate to `create.tsx`.
  - [ ] Create `create.tsx`: Screen for creating a new club.
    - [ ] Use `ClubSettingsForm`.
    - [ ] Handle form submission using `SupabaseClubRepository.createClub`.
    - [ ] Navigate to the new club's page on success.
  - [x] Create `[clubId]/` directory.
  - [x] Create `[clubId]/_layout.tsx`: Layout for tabs within a club profile (e.g., Feed, Details, Members).
  - [x] Create `[clubId]/index.tsx`: Main club profile screen (Feed).
    - [x] Use `ClubHeader`.
    - [x] Implement empty state for feed.
    - [x] Display loading/error states.
    - [ ] Properly integrate with feed system when club feed is available.
  - [x] Create `[clubId]/details.tsx`: Screen showing club details.
    - [x] Use club data from parent layout.
    - [x] Display club info (creation date, member count, privacy).
    - [x] Add admin actions section for club owners/admins.
  - [x] Create `[clubId]/members.tsx`: Screen showing club member directory.
    - [x] Use `ClubHeader` indirectly through parent layout.
    - [x] Fetch members using `SupabaseClubRepository.getClubMembers`.
    - [x] Display members using `ClubMemberListItem`.
    - [x] Implement role update/removal UI for admins.
  - [ ] Create `[clubId]/settings.tsx`: Screen for club owners/admins to edit settings.
    - [ ] Use `ClubSettingsForm`, pre-filled with existing data.
    - [ ] Handle form submission using `SupabaseClubRepository.updateClub`.
    - [ ] Add delete club functionality (with confirmation).

## 5. Integration
- **Tasks**:
  - [ ] Add "Clubs" item to the main app navigation (e.g., bottom tabs).
  - [ ] Ensure deep linking works for club profiles (`/club/:clubId`).
  - [ ] Link club names/badges in posts or user profiles to the respective club screen.
  - [ ] Update user profile screen to show club memberships.
  - [ ] Add proper error handling for network/permission issues.
  - [ ] Add loading states and optimistic UI updates.
