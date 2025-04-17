# Feature: Phase 1 Completion - User Profile & Onboarding

**Goal:** Implement the remaining core features from Phase 1 of the development plan, primarily focusing on User Profile management and the initial User Onboarding flow.

**Related Development Plan Section:** 1.3 User Profile & Onboarding, 1.2 Authentication Module (remaining items)

---

## Task Breakdown:

### 1. Client-Side Profile Repository (Verify/Implement) - COMPLETE*
   - **Goal:** Ensure a robust way to interact with backend profile data.
   - **Subtasks:**
     - [x] **Verify Existence:** Checked, directory was empty.
     - [x] **Define Interface:** `IProfileRepository.ts` created and updated (`updateBike` signature).
     - [x] **Implement Repository:** `SupabaseProfileRepository.ts` created. Implemented `getProfile`, `updateProfile`, `uploadAvatar`, `getGarage`, `addBike`, `updateBike`, `deleteBike`. (*Note: `uploadAvatar` needs file conversion handling.*)
     - [x] **Integrate Shared Types:** Corrected types to `User` and `Bike`. Added `interests` and `experienceLevel` to `User`. Path alias added to `tsconfig.json`. Fixed `bikr-shared/tsconfig.json`.
     - [x] **Unit Tests:** Basic tests for `getProfile`, `updateProfile`, `uploadAvatar`, `deleteBike` added in `SupabaseProfileRepository.test.ts`. Mocks corrected.

### 2. User Onboarding Flow Implementation - Basic Structure COMPLETE*
   - **Goal:** Guide new users through initial setup after registration.
   - **Subtasks:**
     - [x] **Create Directory Structure:** Created `app/onboarding/` and `components/onboarding/`.
     - [x] **Implement Navigation:** Created `app/onboarding/_layout.tsx` with Stack navigator listing screens. Basic `router.push/replace` added to screens, paths corrected to relative. (*Note: Needs logic for redirecting after signup.*)
     - [x] **Screen: Welcome:** Created `app/onboarding/welcome.tsx` and updated navigation path.
     - [x] **Screen: Interests Selection:** Implemented UI (Tamagui tags), state management, and saving via `updateProfile`. Added `interests` field to `User` type.
     - [x] **Screen: Experience Level:** Implemented UI (Tamagui buttons), state management, and saving via `updateProfile`. Added `experienceLevel` field to `User` type.
     - [x] **Screen: Bike Setup (Initial Garage):** Implemented UI (Tamagui form adapted from `add-bike`), state management, and saving via `addBike`.
     - [x] **Screen: Permissions Request:** Implemented permission requests using `expo-location` and `expo-notifications`. Installed `expo-location`.
     - [x] **Flow Completion:** Navigation to `/(tabs)` implemented in `permissions.tsx`.

### 3. Profile Management Implementation - Basic Structure & Initial Logic COMPLETE*
   - **Goal:** Allow users to view and manage their profile information.
   - **Subtasks:**
     - [x] **Create Directory Structure:** Created `app/profile/`, `components/profile/`, placeholder screens (`index`, `edit`, `garage`, `settings`, `add-bike`, `edit-bike/[id]`), and stack layout (`_layout.tsx`).
     - [x] **Screen: Profile View/Edit:** Refactored `index.tsx` and `edit.tsx` with Tamagui components. Implemented data fetching/display/update logic. Added display for interests/experience.
     - [x] **Feature: Avatar Management:** Integrated `expo-image-picker` logic in `index.tsx`. Implemented `uploadAvatar` in repository. UI uses Tamagui.
     - [x] **Screen: Garage Management:** Refactored `garage.tsx`, `add-bike.tsx`, `edit-bike/[id].tsx` with Tamagui components. Implemented `getGarage`, `addBike`, `updateBike`, `deleteBike` repository methods and integrated them into the UI with loading/error handling.
     - [x] **Screen: Privacy Settings:** Refactored placeholder screen `settings.tsx` with Tamagui components. (*Note: Save logic still placeholder.*)
     - [x] **Integrate Components:** Replaced placeholders with Tamagui components across profile screens.
     - [x] **Repository Integration:** Integrated UI actions with repository methods (`getProfile`, `updateProfile`, `uploadAvatar`, `getGarage`, `addBike`, `updateBike`, `deleteBike`). Added basic loading/error state handling.

### 4. Remaining Authentication Methods (Lower Priority / Optional)
   - **Goal:** Add alternative login methods as defined in Phase 1.
   - **Subtasks:**
     - [ ] **Apple/Facebook Login:** (If taken off hold) Integrate respective Expo/Firebase/Supabase SDKs and update UI/auth flow.
     - [ ] **Phone Number Login:** Implement UI and integrate with backend phone auth provider (e.g., Supabase Auth with Twilio). Requires backend setup.
     - [ ] **Biometric Login:** Implement using `expo-local-authentication` for subsequent logins after initial authentication.

---
**Status:** Phase 1 Profile/Onboarding features implemented, including repository methods, onboarding flow screens, and profile management screens refactored with Tamagui components. Core functionality is complete.
