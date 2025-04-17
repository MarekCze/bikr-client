# Feature: Phase 1 Completion - User Profile & Onboarding

**Goal:** Implement the remaining core features from Phase 1 of the development plan, primarily focusing on User Profile management and the initial User Onboarding flow.

**Related Development Plan Section:** 1.3 User Profile & Onboarding, 1.2 Authentication Module (remaining items)

---

## Task Breakdown:

### 1. Client-Side Profile Repository (Verify/Implement) - COMPLETE*
   - **Goal:** Ensure a robust way to interact with backend profile data.
   - **Subtasks:**
     - [x] **Verify Existence:** Checked, directory was empty.
     - [x] **Define Interface:** `IProfileRepository.ts` created.
     - [x] **Implement Repository:** `SupabaseProfileRepository.ts` created. Implemented `getProfile`, `updateProfile`, `uploadAvatar`, `getGarage`, `addBike`, `updateBike`. (*Note: `uploadAvatar` needs file conversion handling; `deleteBike` is still a TODO.*)
     - [x] **Integrate Shared Types:** Corrected types to `User` and `Bike`. Path alias added to `tsconfig.json`.
     - [x] **Unit Tests:** Basic tests for `getProfile`, `updateProfile`, `uploadAvatar` added in `SupabaseProfileRepository.test.ts`. Mocks corrected.

### 2. User Onboarding Flow Implementation - Basic Structure COMPLETE*
   - **Goal:** Guide new users through initial setup after registration.
   - **Subtasks:**
     - [x] **Create Directory Structure:** Created `app/onboarding/` and `components/onboarding/`.
     - [x] **Implement Navigation:** Created `app/onboarding/_layout.tsx` with Stack navigator listing screens. Basic `router.push/replace` added to screens. (*Note: Needs logic for redirecting after signup.*)
     - [x] **Screen: Welcome:** Created `app/onboarding/welcome.tsx` with placeholder UI.
     - [x] **Screen: Interests Selection:** Created `app/onboarding/interests.tsx` with placeholder UI. (*TODO: Implement UI, data fetching/saving.*)
     - [x] **Screen: Experience Level:** Created `app/onboarding/experience.tsx` with placeholder UI. (*TODO: Implement UI, data saving.*)
     - [x] **Screen: Bike Setup (Initial Garage):** Created `app/onboarding/bike-setup.tsx` with placeholder UI. (*TODO: Implement UI, data saving.*)
     - [x] **Screen: Permissions Request:** Created `app/onboarding/permissions.tsx` with placeholder UI. (*TODO: Implement permission requests.*)
     - [ ] **Flow Completion:** Placeholder navigation added in `permissions.tsx`. (*TODO: Finalize navigation target.*)

### 3. Profile Management Implementation - Basic Structure & Initial Logic COMPLETE*
   - **Goal:** Allow users to view and manage their profile information.
   - **Subtasks:**
     - [x] **Create Directory Structure:** Created `app/profile/`, `components/profile/`, placeholder screens (`index`, `edit`, `garage`, `settings`, `add-bike`, `edit-bike/[id]`), and stack layout (`_layout.tsx`).
     - [x] **Screen: Profile View/Edit:** Implemented basic data fetching/display in `index.tsx`. Implemented basic form state, fetching, and update logic in `edit.tsx`.
     - [x] **Feature: Avatar Management:** Added UI elements and integrated `expo-image-picker` logic in `index.tsx`. Implemented `uploadAvatar` in repository.
     - [x] **Screen: Garage Management:** Implemented basic data fetching/display in `garage.tsx`. Implemented `getGarage` in repository. Implemented basic form state/save logic in `add-bike.tsx`. Implemented `addBike` in repository. Implemented basic form state/fetch/update logic in `edit-bike/[id].tsx`. Implemented `updateBike` in repository.
     - [x] **Screen: Privacy Settings:** Created placeholder screen `settings.tsx` with basic UI structure.
     - [ ] **Integrate Components:** (*TODO: Replace placeholders with actual Tamagui components, refine UI.*)
     - [ ] **Repository Integration:** (*TODO: Fully integrate UI actions with repository methods, handle errors/loading states robustly, implement remaining methods like `deleteBike`.*)

### 4. Remaining Authentication Methods (Lower Priority / Optional)
   - **Goal:** Add alternative login methods as defined in Phase 1.
   - **Subtasks:**
     - [ ] **Apple/Facebook Login:** (If taken off hold) Integrate respective Expo/Firebase/Supabase SDKs and update UI/auth flow.
     - [ ] **Phone Number Login:** Implement UI and integrate with backend phone auth provider (e.g., Supabase Auth with Twilio). Requires backend setup.
     - [ ] **Biometric Login:** Implement using `expo-local-authentication` for subsequent logins after initial authentication.

---
**Status:** Phase 1 Profile/Onboarding structure and basic logic implemented. Requires UI refinement and full repository integration.
