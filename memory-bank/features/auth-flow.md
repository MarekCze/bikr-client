# Authentication Flow

## Overview
Supabase-based authentication system handling:
- OAuth integration (Google, Microsoft, Apple, Facebook)
- Email/password signup/login
- Session management
- Password recovery

## Status
**Implementation Progress**: 100% (for required providers)
**Current Phase**: Google OAuth and Email/Password authentication complete. Additional providers (Microsoft, Apple, Facebook) are currently on hold.

## Authentication Methods Status
| Method | Backend Config | UI Implementation | Session Handling | Status |
|--------|---------------|------------------|-----------------|--------|
| Google OAuth | ✅ Complete | ✅ Complete | ✅ Complete | Production Ready |
| Email/Password | ✅ Complete | ✅ Complete | ✅ Complete | Production Ready |
| Microsoft OAuth | ❌ Not Started | ❌ Not Started | ❌ Not Started | On Hold |
| Apple OAuth | ❌ Not Started | ❌ Not Started | ❌ Not Started | On Hold |
| Facebook OAuth | ❌ Not Started | ❌ Not Started | ❌ Not Started | On Hold |

## Completed Tasks
1. Core Authentication Service
   - [x] Supabase client initialization
   - [x] Google OAuth integration
   - [x] Email/Password authentication
   - [x] Password reset flow
   - [x] Session persistence with MMKV

2. UI Components
   - [x] Google authentication button
   - [x] Email/Password sign in form
   - [x] Email/Password sign up form
   - [x] Password reset form
   - [x] New password form
   - [x] Sign out functionality
   - [x] Error handling for all auth flows
   - [x] Profile data display after authentication
   - [x] Form validation with Zod
   - [x] Password strength indicator

3. Navigation
   - [x] Auth routes in Expo Router
   - [x] Navigation helper for auth flows
   - [x] Protected route handling

4. Security
   - [x] Secure token handling
   - [x] Session storage encryption (MMKV)
   - [x] Password validation requirements

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
