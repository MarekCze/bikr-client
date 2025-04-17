# System Architecture Patterns

## Navigation Structure
```mermaid
flowchart TD
    Root[_layout.tsx] --> Tabs[(tabs)/_layout]
    Tabs --> Explore[explore.tsx]
    Tabs --> Index[index.tsx]
    Root --> NotFound[+not-found.tsx]
```

## Key Implementation Patterns
1. **File-based Routing**: Expo Router convention
2. **UI Components**:
   - ThemedView/ThemedText for style consistency
   - ParallaxScrollView for featured content
   - HapticTab for tactile feedback
3. **State Management**:
   - MMKV for persistent storage
   - React Hook Form + Zod for validated forms
4. **Realtime Updates**:
   - Supabase Realtime websockets
   - Shopify FlashList for performant rendering
5. **Theming System**:
   - useColorScheme hook
   - Tamagui design tokens
   - Constants/Colors.ts definitions

## Project Structure
```mermaid
graph TD
    Root[bikr/] --> Client[bikr-client/]
    Root --> Server[bikr-server/]
    Root --> Shared[bikr-shared/]
    
    Client --> ClientComponents[components/]
    Client --> ClientApp[app/]
    Client --> ClientServices[services/]
    Client --> ClientHooks[hooks/]
    
    Server --> ServerRoutes[src/routes/]
    Server --> ServerServices[src/services/]
    Server --> ServerPlugins[src/plugins/]
    Server --> ServerRepositories[src/repositories/]
    
    Shared --> SharedTypes[src/types/]
    Shared --> SharedValidation[src/validation/]
    Shared --> SharedRepositories[src/repositories/]
    
    ClientServices --> |uses| SharedTypes
    ClientServices --> |uses| SharedValidation
    ServerServices --> |uses| SharedTypes
    ServerServices --> |uses| SharedValidation
    ServerRepositories --> |uses| SharedTypes
    ServerRepositories --> |implements| SharedRepositories
```

## Client-Server Interaction Architecture
```mermaid
graph TD
    Client[bikr-client] --> |HTTP Requests via api.ts| ServerAPI[bikr-server API]
    Client --> |Direct Auth/Realtime/Storage| Supabase[Supabase]
    ServerAPI --> |Database Operations| Supabase
    
    subgraph "bikr-client"
        ClientServices[services/api.ts]
        ClientSupabase[services/supabase.ts]
        ClientHooks[hooks/useAuth.ts]
        ClientComponents[components/]
        ClientApp[app/]
    end
    
    subgraph "bikr-server API"
        ServerRoutes[src/routes/]
        ServerServices[src/services/]
        ServerValidation[Validation (uses bikr-shared)]
    end
    
    subgraph "Supabase"
        SubAuth[Authentication]
        SubDB[Database]
        SubRealtime[Realtime]
        SubStorage[Storage]
    end
    
    ClientServices --> ServerRoutes
    ClientSupabase --> SubAuth
    ClientSupabase --> SubRealtime
    ClientSupabase --> SubStorage
    ClientHooks --> ClientSupabase
    ServerServices --> SubDB
```

## Client Data Flow Example (Feed)
```mermaid
sequenceDiagram
    participant ClientApp as Client UI (Feed Screen)
    participant ClientService as services/api.ts
    participant ServerAPI as bikr-server API (/feed)
    participant SupabaseDB as Supabase DB
    participant MMKV as Client Cache (MMKV)

    ClientApp->>ClientService: Request Feed Data (e.g., getPopularFeed)
    ClientService->>ServerAPI: GET /feed/popular?cursor=...
    ServerAPI->>SupabaseDB: Query popular posts
    SupabaseDB-->>ServerAPI: Post Data
    ServerAPI-->>ClientService: Processed Feed Response
    ClientService->>MMKV: Cache Feed Data
    ClientService-->>ClientApp: Return Feed Data
    ClientApp->>ClientApp: Render Feed using FlashList
```

## Client Authentication Flow
```mermaid
sequenceDiagram
    participant ClientUI as Auth Screen (SignInForm)
    participant ClientHook as hooks/useAuth.ts
    participant ClientSupabase as services/supabase.ts
    participant SupabaseAuth as Supabase Auth Service
    participant MMKV as Client Session Storage

    ClientUI->>ClientHook: signInWithPassword(email, pass)
    ClientHook->>ClientSupabase: supabase.auth.signInWithPassword(...)
    ClientSupabase->>SupabaseAuth: Authenticate Request
    SupabaseAuth-->>ClientSupabase: Auth Response (Session/Error)
    ClientSupabase-->>ClientHook: Return Session/Error
    alt Authentication Successful
        ClientHook->>MMKV: Store Session Data
        ClientHook->>ClientUI: Update Auth State (Authenticated)
    else Authentication Failed
        ClientHook->>ClientUI: Display Error Message
    end

```
