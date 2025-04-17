# Table: profiles

## Description
Stores user profile information, extending the base user data from `auth.users` and `public.users`.

## Columns

| Column Name      | Type                     | Constraints                                          | Default Value | Description                                      |
|------------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id               | uuid                     | PRIMARY KEY, FOREIGN KEY (users.id), NOT NULL        |               | User ID, references `public.users.id`.           |
| username         | text                     | UNIQUE                                               |               | Unique username chosen by the user.              |
| display_name     | text                     |                                                      |               | Display name shown in the app.                   |
| bio              | text                     |                                                      |               | Short user biography.                            |
| avatar_url       | text                     |                                                      |               | URL to the user's profile picture/avatar.        |
| website          | text                     |                                                      |               | User's personal website URL.                     |
| location         | text                     |                                                      |               | User's general location (e.g., city, country). |
| experience_level | text                     | CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'expert')) |               | Self-reported riding experience level.         |
| created_at       | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the profile was created.          |
| updated_at       | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the profile was last updated.     |

## Indexes

- **profiles_pkey**: PRIMARY KEY on `id`
- **profiles_username_key**: UNIQUE index on `username`

## Foreign Key Constraints

- **profiles_id_fkey**: `id` references `public.users(id)`

## Referenced By

- **rider_interests.rider_interests_profile_id_fkey**: `rider_interests.profile_id` references `profiles.id`
- **rider_skills.rider_skills_profile_id_fkey**: `rider_skills.profile_id` references `profiles.id`

## Row Level Security (RLS) Policies

- **POLICY "Profiles are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
  ```
- **POLICY "Users can update own profile"**: Allows UPDATE for authenticated users where the `id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  ```
  *(Note: INSERT is handled by triggers/functions upon user creation, not direct RLS policy)*
