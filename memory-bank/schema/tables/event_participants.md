# Table: event_participants

## Description
Tracks user participation status for events (e.g., going, interested).

## Columns

| Column Name | Type                     | Constraints                                          | Default Value | Description                                      |
|-------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the participation record.  |
| event_id    | uuid                     | FOREIGN KEY (events.id), NOT NULL                    |               | ID of the event being participated in.           |
| user_id     | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the participating user.                    |
| status      | text                     | NOT NULL, CHECK (status IN ('going', 'interested', 'not_going', 'invited')) | 'going'       | User's participation status for the event.       |
| created_at  | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the participation status was first set. |
| updated_at  | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the participation status was last updated. |

## Indexes

- **event_participants_pkey**: PRIMARY KEY on `id`
- **event_participants_event_id_user_id_key**: UNIQUE index on `event_id`, `user_id` (Ensures a user has only one status per event).
- **event_participants_event_id_idx**: btree index on `event_id`
- **event_participants_user_id_idx**: btree index on `user_id`

## Foreign Key Constraints

- **event_participants_event_id_fkey**: `event_id` references `public.events(id)`
- **event_participants_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Event participants are viewable by everyone"**: Allows SELECT access if the event is public, or if the user created the event, or if the user is a participant, or if the event belongs to a club the user is a member of.
  ```sql
  CREATE POLICY "Event participants are viewable by everyone" ON public.event_participants FOR SELECT USING (EXISTS ( SELECT 1
     FROM public.events
    WHERE ((events.id = event_participants.event_id) AND ((NOT events.is_private) OR (auth.uid() = events.created_by) OR (EXISTS ( SELECT 1
             FROM public.event_participants event_participants_1
            WHERE ((event_participants_1.event_id = events.id) AND (event_participants_1.user_id = auth.uid())))) OR ((events.club_id IS NOT NULL) AND (EXISTS ( SELECT 1
             FROM public.club_members
            WHERE ((club_members.club_id = events.club_id) AND (club_members.user_id = auth.uid())))))))));
  ```
- **POLICY "Users can join public events"**: Allows INSERT for authenticated users into public events (or events of clubs they are members of) where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can join public events" ON public.event_participants FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
     FROM public.events
    WHERE ((events.id = event_participants.event_id) AND ((NOT events.is_private) OR ((events.club_id IS NOT NULL) AND (EXISTS ( SELECT 1
             FROM public.club_members
            WHERE ((club_members.club_id = events.club_id) AND (club_members.user_id = auth.uid()))))))))));
  ```
- **POLICY "Users can update their participation status"**: Allows UPDATE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update their participation status" ON public.event_participants FOR UPDATE USING (auth.uid() = user_id);
  ```
- **POLICY "Users can leave events"**: Allows DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can leave events" ON public.event_participants FOR DELETE USING (auth.uid() = user_id);
