# Table: club_members

## Description
Associates users with clubs and defines their role within the club.

## Columns

| Column Name | Type                     | Constraints                                          | Default Value | Description                                      |
|-------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the membership record.     |
| club_id     | uuid                     | FOREIGN KEY (clubs.id), NOT NULL                     |               | ID of the club the user is a member of.          |
| user_id     | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the user who is a member.                  |
| role        | text                     | NOT NULL, CHECK (role IN ('member', 'admin', 'moderator', 'prospect')) | 'member'      | Role of the user within the club.                |
| joined_at   | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the user joined the club.         |

## Indexes

- **club_members_pkey**: PRIMARY KEY on `id`
- **club_members_club_id_user_id_key**: UNIQUE index on `club_id`, `user_id` (Ensures a user has only one role per club).
- **club_members_club_id_idx**: btree index on `club_id`
- **club_members_user_id_idx**: btree index on `user_id`

## Foreign Key Constraints

- **club_members_club_id_fkey**: `club_id` references `public.clubs(id)`
- **club_members_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Club members are viewable by everyone"**: Allows SELECT access if the club is public, or if the requesting user is a member of the private club.
  ```sql
  CREATE POLICY "Club members are viewable by everyone" ON public.club_members FOR SELECT USING (EXISTS ( SELECT 1
     FROM public.clubs
    WHERE ((clubs.id = club_members.club_id) AND ((NOT clubs.is_private) OR (EXISTS ( SELECT 1
             FROM public.club_members cm
            WHERE ((cm.club_id = clubs.id) AND (cm.user_id = auth.uid()))))))));
  ```
- **POLICY "Users can join public clubs"**: Allows INSERT for authenticated users into public clubs where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can join public clubs" ON public.club_members FOR INSERT WITH CHECK (((auth.uid() = user_id) AND (EXISTS ( SELECT 1
     FROM public.clubs
    WHERE ((clubs.id = club_members.club_id) AND (NOT clubs.is_private))))));
  ```
- **POLICY "Admins can manage members"**: Allows UPDATE for authenticated users who are an admin or moderator of the same club.
  ```sql
  CREATE POLICY "Admins can manage members" ON public.club_members FOR UPDATE USING (EXISTS ( SELECT 1
     FROM public.club_members club_members_1
    WHERE ((club_members_1.club_id = club_members.club_id) AND (club_members_1.user_id = auth.uid()) AND (club_members_1.role = ANY (ARRAY['admin'::text, 'moderator'::text])))));
  ```
- **POLICY "Users can leave clubs"**: Allows DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can leave clubs" ON public.club_members FOR DELETE USING (auth.uid() = user_id);
  ```
  *(Note: RLS for admins/moderators deleting other members might be missing or handled differently).*
