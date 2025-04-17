# Table: clubs

## Description
Stores information about motorcycle clubs created within the application.

## Columns

| Column Name  | Type                     | Constraints                  | Default Value | Description                                      |
|--------------|--------------------------|------------------------------|---------------|--------------------------------------------------|
| id           | uuid                     | PRIMARY KEY, NOT NULL        | gen_random_uuid() | Unique identifier for the club.                  |
| name         | text                     | NOT NULL                     |               | Name of the club.                                |
| description  | text                     |                              |               | Description of the club.                         |
| logo_url     | text                     |                              |               | URL to the club's logo image.                    |
| cover_url    | text                     |                              |               | URL to the club's cover image.                   |
| location     | text                     |                              |               | General location of the club (e.g., city, region). |
| location_lat | double precision         |                              |               | Latitude of the club's primary location.         |
| location_lng | double precision         |                              |               | Longitude of the club's primary location.        |
| is_private   | boolean                  | NOT NULL                     | false         | Flag indicating if the club is private or public. |
| created_by   | uuid                     | FOREIGN KEY (users.id), NOT NULL |               | ID of the user who created the club.             |
| created_at   | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the club was created.             |
| updated_at   | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the club was last updated.        |

## Indexes

- **clubs_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

- **clubs_created_by_fkey**: `created_by` references `public.users(id)`

## Referenced By

- **club_members.club_members_club_id_fkey**: `club_members.club_id` references `clubs.id`
- **events.events_club_id_fkey**: `events.club_id` references `clubs.id`
- **posts**: `context_id` references `clubs.id` when `context_type` = 'club' (Implicit via RLS/Application Logic)
- **content_tags**: `content_id` references `clubs.id` when `content_type` = 'club' (Implicit via RLS/Application Logic)
- **reports**: `content_id` references `clubs.id` when `content_type` = 'club' (Implicit via RLS/Application Logic)

## Row Level Security (RLS) Policies

- **POLICY "Public clubs are viewable by everyone"**: Allows SELECT access if the club is public (`is_private` = false) or if the requesting user is a member.
  ```sql
  CREATE POLICY "Public clubs are viewable by everyone" ON public.clubs FOR SELECT USING (((NOT is_private) OR (EXISTS ( SELECT 1
     FROM public.club_members
    WHERE ((club_members.club_id = clubs.id) AND (club_members.user_id = auth.uid()))))));
  ```
- **POLICY "Users can create clubs"**: Allows INSERT for authenticated users where the `created_by` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can create clubs" ON public.clubs FOR INSERT WITH CHECK (auth.uid() = created_by);
  ```
- **POLICY "Club admins can update club details"**: Allows UPDATE for the user who created the club or for users who are admins of the club (checked via `club_members` table).
  ```sql
  CREATE POLICY "Club admins can update club details" ON public.clubs FOR UPDATE USING (((auth.uid() = created_by) OR (EXISTS ( SELECT 1
     FROM public.club_members
    WHERE ((club_members.club_id = clubs.id) AND (club_members.user_id = auth.uid()) AND (club_members.role = 'admin'::text))))));
  ```
  *(Note: DELETE policy might be missing or restricted, e.g., only allow deletion if no members/events exist).*
