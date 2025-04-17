# Table: group_rides

## Description
Stores information about specific group ride sessions, potentially linked to an event or a route.

## Columns

| Column Name | Type                     | Constraints                                          | Default Value | Description                                      |
|-------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the group ride.            |
| event_id    | uuid                     | FOREIGN KEY (events.id)                              |               | ID of the event this group ride is part of (optional). |
| route_id    | uuid                     | FOREIGN KEY (routes.id)                              |               | ID of the planned route for this group ride (optional). |
| leader_id   | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the user leading the group ride.           |
| status      | text                     | NOT NULL, CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) | 'scheduled'   | Current status of the group ride.                |
| start_time  | timestamp with time zone |                                                      |               | Actual start time of the group ride (optional).  |
| end_time    | timestamp with time zone |                                                      |               | Actual end time of the group ride (optional).    |
| created_at  | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the group ride was created.       |
| updated_at  | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the group ride was last updated.  |

## Indexes

- **group_rides_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

- **group_rides_event_id_fkey**: `event_id` references `public.events(id)`
- **group_rides_leader_id_fkey**: `leader_id` references `public.users(id)`
- **group_rides_route_id_fkey**: `route_id` references `public.routes(id)`

## Referenced By

- **group_ride_participants.group_ride_participants_group_ride_id_fkey**: `group_ride_participants.group_ride_id` references `group_rides.id`

## Row Level Security (RLS) Policies

- **POLICY "Group rides are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Group rides are viewable by everyone" ON public.group_rides FOR SELECT USING (true);
  ```
- **POLICY "Event organizers can manage group rides"**: Allows INSERT, UPDATE, DELETE for the designated leader or the creator of the associated event (if any).
  ```sql
  CREATE POLICY "Event organizers can manage group rides" ON public.group_rides USING (((auth.uid() = leader_id) OR ((event_id IS NOT NULL) AND (EXISTS ( SELECT 1
     FROM public.events
    WHERE ((events.id = group_rides.event_id) AND (events.created_by = auth.uid())))))));
