# Phase 5: Event Management (Client)

**Goal:** Implement the client-side features for creating, discovering, joining, and participating in motorcycle events.

## Overview
Phase 5 focuses on building all event-related functionality in the client application. This includes event discovery, creation, management, participation, and integration with location/mapping features. The implementation follows the same repository-based pattern established in previous phases, with a clear separation of concerns between data access, business logic, and UI components.

## Development Plan Reference
This feature implements Phase 5 from the development plan, including sections 5.1 (Event Domain), 5.2 (Event Page Features), and 5.3 (Route & Location Feature).

## Status
In Progress

## Cross-Project Dependencies
- bikr-shared/src/types/event.ts (to be created)
- bikr-shared/src/repositories/IEventRepository.ts (to be created)
- bikr-shared/src/validation/eventSchemas.ts (to be created)
- bikr-server/memory-bank/features/phase5-event-management.md (to be created)
- bikr-server/src/routes/event.ts (to be created)
- bikr-server/src/services/eventService.ts (to be created)
- bikr-server/src/repositories/supabaseEventRepository.ts (to be created)

## 1. Shared Definitions Integration
- **Tasks**:
  - [x] Ensure `bikr-shared` includes necessary types (`Event`, `EventParticipation`, `EventType`, `IEventRepository`, `PaginatedResponse`).
  - [x] Ensure `bikr-shared` includes Zod schemas for event-related operations (`CreateEventSchema`, `UpdateEventSchema`, etc.).
  - [ ] Update client dependencies if `bikr-shared` was modified.

## 2. Client Repository (`bikr-client/repositories/`)
- **Tasks**:
  - [ ] Create `IEventRepository.ts` (defined in `bikr-shared`).
  - [x] Create `SupabaseEventRepository.ts`.
  - [x] Implement `IEventRepository` interface in `SupabaseEventRepository`.
    - [ ] `createEvent(eventData)`: Calls `POST /events`.
    - [ ] `getEvents(filters)`: Calls `GET /events`.
    - [ ] `getEventById(eventId)`: Calls `GET /events/:eventId`.
    - [ ] `updateEvent(eventId, updateData)`: Calls `PUT /events/:eventId`.
    - [ ] `deleteEvent(eventId)`: Calls `DELETE /events/:eventId`.
    - [ ] `joinEvent(eventId)`: Calls `POST /events/:eventId/join`.
    - [ ] `leaveEvent(eventId)`: Calls `POST /events/:eventId/leave`.
    - [ ] `getEventParticipants(eventId)`: Calls `GET /events/:eventId/participants`.
    - [ ] `updateParticipantStatus(eventId, userId, status)`: Calls `PUT /events/:eventId/participants/:userId`.
    - [ ] `removeParticipant(eventId, userId)`: Calls `DELETE /events/:eventId/participants/:userId`.
    - [ ] `getEventFeed(eventId, pagination)`: Calls `GET /events/:eventId/feed`.
    - [ ] `createEventPost(eventId, postData)`: Calls `POST /events/:eventId/posts`.
  - [x] Add `EventRepository` to dependency injection or context providers.
  - [x] Create `EventContext.tsx` for global event state management.

## 3. UI Components (`bikr-client/components/event/`)
- **Tasks**:
  - [x] Create `EventListItem.tsx`: Displays basic event info (name, date, image, participant count) for lists.
  - [ ] Create `EventHeader.tsx`: Displays event banner, name, join/leave button, participant count, etc.
  - [ ] Create `EventDetailsSection.tsx`: Displays event description, rules, location map, schedule.
  - [ ] Create `EventParticipantListItem.tsx`: Displays participant avatar, name, status, action buttons (for organizers).
  - [x] Create `EventList.tsx`: Component for displaying a list of events with loading states.
  - [ ] Create `EventSettingsForm.tsx`: Form using Tamagui components for creating/editing event details.
  - [ ] Create `ParticipateButton.tsx`: Button that shows "Join", "Leave", "Going", etc. based on user's participation status.
  - [ ] Create `EventScheduleItem.tsx`: Component for displaying schedule items in an event.
  - [x] Create `index.ts` export file for event components.

## 4. Screens (`bikr-client/app/event/`)
- **Tasks**:
  - [x] Create `_layout.tsx`: Stack layout for event-related screens.
  - [x] Create `index.tsx`: Event discovery screen.
    - [x] Implement basic list UI.
    - [x] Fetch and display events using `EventListItem` and `SupabaseEventRepository`.
    - [x] Add button/link to navigate to `create.tsx`.
  - [x] Create `create.tsx`: Screen for creating a new event.
    - [x] Implement event creation form.
    - [x] Handle form submission using `SupabaseEventRepository.createEvent`.
    - [x] Navigate to the new event's page on success.
  - [x] Create `[eventId]/` directory.
  - [ ] Create `[eventId]/_layout.tsx`: Layout for tabs within an event profile (e.g., Details, Participants, Schedule).
  - [x] Create `[eventId]/index.tsx`: Main event details screen.
    - [x] Display event banner/cover.
    - [x] Display event description, date/time, location.
    - [x] Show participant count and organizer info.
    - [x] Implement join/leave functionality.
  - [ ] Create `[eventId]/participants.tsx`: Screen showing event participant directory.
    - [ ] Display participants using `EventParticipantListItem`.
    - [ ] Implement status update UI for organizers.
  - [ ] Create `[eventId]/schedule.tsx`: Screen showing event schedule breakdown.
    - [ ] Display schedule items using `EventScheduleItem`.
    - [ ] Add schedule management UI for organizers.
  - [ ] Create `[eventId]/settings.tsx`: Screen for event organizers to edit settings.
    - [ ] Use `EventSettingsForm`, pre-filled with existing data.
    - [ ] Handle form submission using `SupabaseEventRepository.updateEvent`.
    - [ ] Add delete event functionality (with confirmation).

## 5. Route & Location Feature
- **Tasks**:
  - [ ] Create `RouteMap.tsx` component for displaying interactive maps.
  - [ ] Integrate map provider (Google Maps, Mapbox, or other).
  - [ ] Create `RoutePlanner.tsx` component for creating/editing routes.
  - [ ] Create `LocationPicker.tsx` component for selecting meeting points.
  - [ ] Implement location search and geocoding integration.
  - [ ] Create `SavedRoutesList.tsx` for displaying user's saved routes.
  - [ ] Create screens for route management (`app/routes/`).

## 6. Integration
- **Tasks**:
  - [ ] Add "Events" item to the main app navigation (if not already present).
  - [ ] Ensure deep linking works for event profiles (`/event/:eventId`).
  - [ ] Link events in posts or user profiles to the respective event screen.
  - [ ] Update user profile screen to show event participations.
  - [ ] Add proper error handling for network/permission issues.
  - [ ] Add loading states and optimistic UI updates.
  - [ ] Integrate calendar reminders for events.

## Task Details

### Event Domain Model Design
Events will support multiple types:
- Meet-ups (simple gatherings)
- Group rides (with routes and tracking)
- Track days (specialized venue events)
- Workshops (educational events)

Each event type will have specific fields and behaviors, but share common attributes like:
- Title, description, cover image
- Date/time information (including recurring options)
- Location data
- Organizer information
- Participant list with RSVP status
- Privacy settings
- Event rules/guidelines

The client implementation will handle displaying the appropriate UI elements based on event type.
