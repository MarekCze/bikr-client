# Table: follows

## Description
Stores the relationship between users who follow each other.

## Columns

| Column Name  | Type                     | Constraints                               | Default Value | Description                                      |
|--------------|--------------------------|-------------------------------------------|---------------|--------------------------------------------------|
| id           | uuid                     | PRIMARY KEY, NOT NULL                     | gen_random_uuid() | Unique identifier for the follow relationship.   |
| follower_id  | uuid                     | FOREIGN KEY (users.id), NOT NULL          |               | ID of the user who is following.                 |
| following_id | uuid                     | FOREIGN KEY (users.id), NOT NULL          |               | ID of the user being followed.                   |
| created_at   | timestamp with time zone | NOT NULL                                  | now()         | Timestamp when the follow relationship was created. |

## Indexes

- **follows_pkey**: PRIMARY KEY on `id`
- **follows_follower_id_following_id_key**: UNIQUE index on `follower_id`, `following_id` (Ensures a user can only follow another user once).
- **follows_follower_idx**: btree index on `follower_id`
- **follows_following_idx**: btree index on `following_id`

## Foreign Key Constraints

- **follows_follower_id_fkey**: `follower_id` references `public.users(id)`
- **follows_following_id_fkey**: `following_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema, but its data is used in RLS policies for tables like `rides`)*

## Row Level Security (RLS) Policies

- **POLICY "Follows are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
  ```
- **POLICY "Users can manage their follows"**: Allows INSERT, UPDATE, DELETE for authenticated users where the `follower_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can manage their follows" ON public.follows USING (auth.uid() = follower_id);
