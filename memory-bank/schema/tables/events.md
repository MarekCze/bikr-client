# Table: events

## Description
Stores information about events created within the application, such as group rides, meets, track days, etc.

## Columns

| Column Name      | Type                     | Constraints                                          | Default Value | Description                                      |
|------------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id               | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the event.                 |
| title            | text                     | NOT NULL                                             |               | Name or title of the event.                      |
| description      | text                     |                                                      |               | Description of the event.                        |
| event_type       | text                     | NOT NULL, CHECK (event_type IN ('ride', 'meet', 'track_day', 'workshop', 'competition')) |               | Type or category of the event.                   |
| start_time       | timestamp with time zone | NOT NULL                                             |               | Start date and time of the event.                |
| end_time         | timestamp with time zone |                                                      |               | End date and time of the event (optional).       |
| location         | text                     |                                                      |               | Text description of the event location.          |
| location_lat     | double precision         |                                                      |               | Latitude of the event location.                  |
| location_lng     | double precision         |                                                      |               | Longitude of the event location.                 |
| cover_url        | text                     |                                                      |               | URL to the event's cover image.                  |
| max_participants | integer                  |                                                      |               | Maximum number of participants allowed (optional). |
| is_private       | boolean                  | NOT NULL                                             | false         | Flag indicating if the event is private or public. |
| club_id          | uuid                     | FOREIGN KEY (clubs.id)                               |               | ID of the club hosting the event (optional).     |
| created_by       | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the user who created the event.            |
| created_at       | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the event was created.            |
| updated_at       | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the event was last updated.       |

## Indexes

- **events_pkey**: PRIMARY KEY on `id`
- **events_club_id_idx**: btree index on `club_id` where `club_id` IS NOT NULL
- **events_start_time_idx**: btree index on `start_time`

## Foreign Key Constraints

- **events_club_id_fkey**: `club_id` references `public.clubs(id)`
- **events_created_by_fkey**: `created_by` references `public.users(id)`

## Referenced By

- **event_participants.event_participants_event_id_fkey**: `event_participants.event_id` references `events.id`
- **group_rides.group_rides_event_id_fkey**: `group_rides.event_id` references `events.id`
- **rides.rides_event_id_fkey**: `rides.event_id` references `events.id`
- **routes.routes_event_id_fkey**: `routes.event_id` references `events.id`
- **posts**: `context_id` references `events.id` when `context_type` = 'event' (Implicit via RLS/Application Logic)
- **content_tags**: `content_id` references `events.id` when `content_type` = 'event' (Implicit via RLS/Application Logic)
- **reports**: `content_id` references `events.id` when `content_type` = 'event' (Implicit via RLS/Application Logic)

## Row Level Security (RLS) Policies

- **POLICY "Public events are viewable by everyone"**: Allows SELECT access if the event is public, or if the user created it, or if the user is a participant, or if it belongs to a club the user is a member of.
  ```sql
  CREATE POLICY "Public events are viewable by everyone" ON public.events FOR SELECT USING (((NOT is_private) OR (auth.uid() = created_by) OR (EXISTS ( SELECT 1
     FROM public.event_participants
    WHERE ((event_participants.event_id = events.id) AND (event_participants.user_id = auth.uid())))) OR ((club_id IS NOT NULL) AND (EXISTS ( SELECT 1
     FROM public.club_members
    WHERE ((club_members.club_id = events.club_id) AND (club_members.user_id = auth.uid())))))));
  ```
- **POLICY "Users can create events"**: Allows INSERT for authenticated users where the `created_by` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
  ```
- **POLICY "Event creators can update events"**: Allows UPDATE for the user who created the event or for admins/moderators of the associated club (if any).
  ```sql
  CREATE POLICY "Event creators can update events" ON public.events FOR UPDATE USING (((auth.uid() = created_by) OR ((club_id IS NOT NULL) AND (EXISTS ( SELECT 1
     FROM public.club_members
    WHERE ((club_members.club_id = events.club_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['admin'::text, 'moderator'::text]))))))));
  ```
  *(Note: DELETE policy might be missing or restricted).*
