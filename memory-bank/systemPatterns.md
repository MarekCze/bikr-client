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

## Monorepo Structure
```mermaid
graph TD
    Root[bikeapp/] --> Frontend[bikR/]
    Root --> API[api/]
    Root --> Shared[shared/]
    
    Frontend --> FEComponents[components/]
    Frontend --> FEApp[app/]
    Frontend --> FEServices[services/]
    
    API --> APIRoutes[routes/]
    API --> APIPlugins[plugins/]
    API --> APIConfig[config/]
    
    Shared --> STypes[types/]
    Shared --> SValidation[validation/]
    
    FEServices --> |uses| STypes
    APIRoutes --> |uses| STypes
```

## API Layer Architecture
```mermaid
graph TD
    Frontend[Frontend] --> |HTTP Requests| API[API Layer]
    API --> |Database Operations| Supabase[Supabase]
    
    subgraph "Frontend"
        FEServices[services/api.ts]
        FEHooks[hooks/useAuth.ts]
        FEComponents[components/]
    end
    
    subgraph "API Layer"
        APIRoutes[routes/]
        APIPlugins[plugins/]
        APIValidation[Validation]
        APIBusiness[Business Logic]
    end
    
    subgraph "Supabase"
        SubAuth[Authentication]
        SubDB[Database]
        SubRealtime[Realtime]
    end
    
    FEServices --> APIRoutes
    APIRoutes --> APIBusiness
    APIBusiness --> SubDB
    FEHooks --> |Auth Requests| SubAuth
```

## API Integration Flow
```mermaid
sequenceDiagram
    App->>API: API Request
    API->>Supabase: Database Operation
    Supabase-->>API: Response Data
    API-->>App: Processed Response
    
    App->>Supabase: Direct Auth Request
    Supabase-->>App: JWT Token
    
    App->>Supabase: Realtime Subscribe
    Supabase->>App: Realtime Updates
    
    App->>MMKV: Cache Data
