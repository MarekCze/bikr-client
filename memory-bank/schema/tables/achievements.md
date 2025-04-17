# Table: achievements

## Description
Stores definitions for various achievements users can earn within the application.

## Columns

| Column Name      | Type                     | Constraints                                          | Default Value | Description                                      |
|------------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id               | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the achievement.           |
| title            | text                     | NOT NULL                                             |               | Name or title of the achievement.                |
| description      | text                     | NOT NULL                                             |               | Description of how to earn the achievement.      |
| achievement_type | text                     | NOT NULL, CHECK (achievement_type IN ('riding', 'social', 'maintenance', 'event', 'custom')) |               | Category of the achievement.                     |
| badge_url        | text                     |                                                      |               | URL to an icon or badge representing the achievement. |
| points           | integer                  | NOT NULL                                             | 0             | Points awarded for earning the achievement (for gamification). |
| is_active        | boolean                  |                                                      | true          | Flag indicating if the achievement is currently active/earnable. |
| created_at       | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the achievement definition was created. |
| updated_at       | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the achievement definition was last updated. |

## Indexes

- **achievements_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

*(None)*

## Referenced By

- **user_achievements.user_achievements_achievement_id_fkey**: `user_achievements.achievement_id` references `achievements.id`

## Row Level Security (RLS) Policies

- **POLICY "Achievements are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Achievements are viewable by everyone" ON public.achievements FOR SELECT USING (true);
  ```
  *(Note: INSERT/UPDATE/DELETE likely restricted to admin roles, possibly via application logic or specific admin policies not shown in the provided schema dump, as no specific RLS policies for modification were included for this table.)*
