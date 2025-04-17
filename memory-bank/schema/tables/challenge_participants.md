# Table: challenge_participants

## Description
Tracks user participation and progress in specific challenges.

## Columns

| Column Name      | Type                     | Constraints                                          | Default Value | Description                                      |
|------------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id               | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the participation record.  |
| challenge_id     | uuid                     | FOREIGN KEY (challenges.id), NOT NULL                |               | ID of the challenge being participated in.       |
| user_id          | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the participating user.                    |
| current_progress | integer                  | NOT NULL                                             | 0             | Current progress value towards the challenge objective. |
| status           | text                     | NOT NULL, CHECK (status IN ('active', 'completed', 'abandoned')) | 'active'      | Current status of the user in the challenge.     |
| joined_at        | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the user joined the challenge.    |
| completed_at     | timestamp with time zone |                                                      |               | Timestamp when the user completed the challenge (optional). |

## Indexes

- **challenge_participants_pkey**: PRIMARY KEY on `id`
- **challenge_participants_challenge_id_user_id_key**: UNIQUE index on `challenge_id`, `user_id` (Ensures a user can only participate once per challenge).
- **challenge_participants_challenge_id_idx**: btree index on `challenge_id`
- **challenge_participants_user_id_idx**: btree index on `user_id`

## Foreign Key Constraints

- **challenge_participants_challenge_id_fkey**: `challenge_id` references `public.challenges(id)`
- **challenge_participants_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Challenge participation is viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Challenge participation is viewable by everyone" ON public.challenge_participants FOR SELECT USING (true);
  ```
- **POLICY "Users can join challenges"**: Allows INSERT for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can join challenges" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- **POLICY "Users can update their challenge status"**: Allows UPDATE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update their challenge status" ON public.challenge_participants FOR UPDATE USING (auth.uid() = user_id);
  ```
  *(Note: DELETE policy might be missing or handled differently, e.g., setting status to 'abandoned' instead of deleting).*
