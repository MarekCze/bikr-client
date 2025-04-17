# Table: group_ride_participants

## Description
Tracks users participating in specific group rides, their role, and status.

## Columns

| Column Name | Type                     | Constraints                                          | Default Value | Description                                      |
|-------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the participation record.  |
| group_ride_id | uuid                   | FOREIGN KEY (group_rides.id), NOT NULL               |               | ID of the group ride being participated in.      |
| user_id     | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the participating user.                    |
| ride_id     | uuid                     | FOREIGN KEY (rides.id)                               |               | ID of the individual ride record associated with this participation (optional). |
| role        | text                     | NOT NULL, CHECK (role IN ('leader', 'sweeper', 'participant')) | 'participant' | Role of the user within the group ride.          |
| status      | text                     | NOT NULL, CHECK (status IN ('joined', 'active', 'inactive', 'left')) | 'joined'      | Current status of the user in the group ride.    |
| joined_at   | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the user joined the group ride.   |
| left_at     | timestamp with time zone |                                                      |               | Timestamp when the user left the group ride (optional). |

## Indexes

- **group_ride_participants_pkey**: PRIMARY KEY on `id`
- **group_ride_participants_group_ride_id_user_id_key**: UNIQUE index on `group_ride_id`, `user_id` (Ensures a user is only listed once per group ride).
- **group_ride_participants_group_ride_id_idx**: btree index on `group_ride_id`
- **group_ride_participants_user_id_idx**: btree index on `user_id`

## Foreign Key Constraints

- **group_ride_participants_group_ride_id_fkey**: `group_ride_id` references `public.group_rides(id)`
- **group_ride_participants_ride_id_fkey**: `ride_id` references `public.rides(id)`
- **group_ride_participants_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Group ride participants are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Group ride participants are viewable by everyone" ON public.group_ride_participants FOR SELECT USING (true);
  ```
- **POLICY "Users can join group rides"**: Allows INSERT for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can join group rides" ON public.group_ride_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- **POLICY "Ride leaders can update participants"**: Allows UPDATE for authenticated users who are the leader of the group ride (checked via `group_rides` table).
  ```sql
  CREATE POLICY "Ride leaders can update participants" ON public.group_ride_participants FOR UPDATE USING (EXISTS ( SELECT 1
     FROM public.group_rides
    WHERE ((group_rides.id = group_ride_participants.group_ride_id) AND (group_rides.leader_id = auth.uid()))));
  ```
- **POLICY "Users can update their participation status"**: Allows UPDATE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update their participation status" ON public.group_ride_participants FOR UPDATE USING (auth.uid() = user_id);
  ```
- **POLICY "Users can leave group rides"**: Allows DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can leave group rides" ON public.group_ride_participants FOR DELETE USING (auth.uid() = user_id);
  ```
- **POLICY "Ride leaders can remove participants"**: Allows DELETE for authenticated users who are the leader of the group ride.
  ```sql
  CREATE POLICY "Ride leaders can remove participants" ON public.group_ride_participants FOR DELETE USING (EXISTS ( SELECT 1
     FROM public.group_rides
    WHERE ((group_rides.id = group_ride_participants.group_ride_id) AND (group_rides.leader_id = auth.uid()))));
