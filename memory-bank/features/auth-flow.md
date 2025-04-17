# Authentication Flow

## Overview
Client-side authentication flow interacting with a Supabase backend, handling:
- OAuth integration (Google initially, others planned)
- Email/password signup/login
- Client-side session management using MMKV
- Password recovery UI flow

## Status
**Implementation Progress**: 100% (for required providers)
**Current Phase**: Google OAuth and Email/Password authentication flows are implemented in the client. Integration with additional providers (Microsoft, Apple, Facebook) is currently on hold.

## Authentication Methods Status (Client Integration)
| Method | Client UI | Client Logic (useAuth) | Session Handling (MMKV) | Status | Notes |
|--------|-----------|------------------------|-------------------------|--------|-------|
| Google OAuth | ✅ Complete | ✅ Complete | ✅ Complete | Ready | Relies on Supabase backend config |
| Email/Password | ✅ Complete | ✅ Complete | ✅ Complete | Ready | Relies on Supabase backend config |
| Microsoft OAuth | ❌ Not Started | ❌ Not Started | ❌ Not Started | On Hold | Backend config also needed |
| Apple OAuth | ❌ Not Started | ❌ Not Started | ❌ Not Started | On Hold | Backend config also needed |
| Facebook OAuth | ❌ Not Started | ❌ Not Started | ❌ Not Started | On Hold | Backend config also needed |

## Completed Client Tasks
1. Core Authentication Logic (`hooks/useAuth.ts`)
   - [x] Supabase client initialization (`services/supabase.ts`)
   - [x] Google OAuth flow handling (calling Supabase)
   - [x] Email/Password authentication flow handling (calling Supabase)
   - [x] Password reset flow handling (calling Supabase)
   - [x] Session persistence with MMKV

2. UI Components (`components/auth/`)
   - [x] Google authentication button (`GoogleAuthTest.tsx` - Example)
   - [x] Email/Password sign in form (`SignInForm.tsx`)
   - [x] Email/Password sign up form (`SignUpForm.tsx`)
   - [x] Password reset form (`PasswordResetForm.tsx`)
   - [x] New password form (`NewPasswordForm.tsx`)
   - [x] Sign out functionality (integrated into profile/settings UI)
   - [x] Error handling display for all auth flows
   - [x] Form validation using Zod (`authSchemas.ts`)
   - [x] Password strength indicator component

3. Navigation (`app/auth/`)
   - [x] Auth screens defined using Expo Router
   - [x] Navigation helper/context for auth flows (`AuthNavigationHelper.tsx`)
   - [x] Protected route handling (likely in root `_layout.tsx` checking auth state)

4. Client-Side Security Considerations
   - [x] Secure token handling via Supabase client library
   - [x] Session storage using MMKV (offers encryption)
   - [x] Enforcing password validation requirements in UI forms

## Google OAuth Flow
```mermaid
sequenceDiagram
    User->>GoogleAuthButton: Click Sign In
    GoogleAuthButton->>Google: OAuth request
    Google-->>User: Authentication prompt
    User->>Google: Approve
    Google-->>GoogleAuthButton: ID token
    GoogleAuthButton->>Supabase: signInWithIdToken
    Supabase-->>GoogleAuthButton: User session
    GoogleAuthButton->>MMKV: Persist session
    
    alt Sign Out Flow
        User->>Profile: Click Sign Out
        Profile->>Supabase: signOut()
        Profile->>MMKV: Delete session
        MMKV-->>App: Update auth state
    end
```

## Implementation Details

### Authentication Components
```mermaid
graph TD
    A[Auth Components] --> B[EmailPasswordAuth.tsx]
    A --> C[SignUpForm.tsx]
    A --> D[SignInForm.tsx]
    A --> E[AuthLayout.tsx]
    A --> F[PasswordResetForm.tsx]
    A --> G[NewPasswordForm.tsx]
    A --> H[AuthNavigationHelper.tsx]
    
    B --- I[Main container]
    C --- J[Email/password form with validation]
    D --- K[Login form with validation]
    E --- L[Shared layout for auth screens]
    F --- M[Password reset request form]
    G --- N[New password entry form]
    H --- O[Navigation context for auth screens]
```

### Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant UI as Auth Components
    participant Logic as useAuth Hook
    participant Supabase
    participant MMKV
    
    %% Sign Up Flow
    User->>UI: Enter email/password
    UI->>UI: Validate form (Zod)
    User->>UI: Submit sign up
    UI->>Logic: signUp(email, password)
    Logic->>Supabase: auth.signUp()
    Supabase-->>User: Send verification email
    Supabase-->>Logic: Response
    Logic-->>UI: Success/error message
    
    %% Email Verification Flow
    User->>User: Click email link
    User->>Supabase: Confirm email
    Supabase-->>UI: Redirect with token
    UI->>Logic: Process verification
    Logic->>MMKV: Store session
    
    %% Sign In Flow
    User->>UI: Enter credentials
    UI->>UI: Validate form (Zod)
    User->>UI: Submit sign in
    UI->>Logic: signIn(email, password)
    Logic->>Supabase: auth.signInWithPassword()
    Supabase-->>Logic: Session
    Logic->>MMKV: Store session
    Logic-->>UI: Update auth state
    
    %% Password Reset Flow
    User->>UI: Request password reset
    UI->>Logic: resetPassword(email)
    Logic->>Supabase: resetPasswordForEmail()
    Supabase-->>User: Send reset email
    User->>User: Click reset link
    User->>UI: Enter new password
    UI->>Logic: updatePassword(newPassword)
    Logic->>Supabase: Update user password
    Supabase-->>Logic: Confirmation
    Logic-->>UI: Success message
```

### Routing Structure
```mermaid
graph TD
    A[app/] --> B[auth/]
    B --> C[_layout.tsx]
    B --> D[sign-in.tsx]
    B --> E[sign-up.tsx]
    B --> F[reset-password.tsx]
    B --> G[new-password.tsx]
    
    C --- H[Auth navigation provider]
    D --- I[Sign in screen]
    E --- J[Sign up screen]
    F --- K[Reset password screen]
    G --- L[New password screen]
```

### Form Validation
All forms implement validation using Zod schemas:
- Email format validation
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- Password confirmation matching
- Terms acceptance requirement
