# Table: challenges

## Description
Stores definitions for various challenges users can participate in.

## Columns

| Column Name     | Type                     | Constraints                                          | Default Value | Description                                      |
|-----------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id              | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the challenge.             |
| title           | text                     | NOT NULL                                             |               | Name or title of the challenge.                  |
| description     | text                     | NOT NULL                                             |               | Description of the challenge and its objectives. |
| challenge_type  | text                     | NOT NULL, CHECK (challenge_type IN ('distance', 'attendance', 'location', 'social', 'custom')) |               | Category of the challenge.                       |
| objective_value | integer                  |                                                      |               | Target value for completion (e.g., distance, number of check-ins). |
| start_date      | timestamp with time zone |                                                      |               | Start date/time for the challenge (optional).    |
| end_date        | timestamp with time zone |                                                      |               | End date/time for the challenge (optional).      |
| badge_url       | text                     |                                                      |               | URL to an icon or badge awarded upon completion. |
| points          | integer                  | NOT NULL                                             | 0             | Points awarded for completing the challenge.     |
| is_active       | boolean                  |                                                      | true          | Flag indicating if the challenge is currently active. |
| created_at      | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the challenge definition was created. |
| updated_at      | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the challenge definition was last updated. |

## Indexes

- **challenges_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

*(None)*

## Referenced By

- **challenge_participants.challenge_participants_challenge_id_fkey**: `challenge_participants.challenge_id` references `challenges.id`

## Row Level Security (RLS) Policies

- **POLICY "Challenges are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Challenges are viewable by everyone" ON public.challenges FOR SELECT USING (true);
  ```
  *(Note: INSERT/UPDATE/DELETE likely restricted to admin roles, possibly via application logic or specific admin policies not shown in the provided schema dump, as no specific RLS policies for modification were included for this table.)*
