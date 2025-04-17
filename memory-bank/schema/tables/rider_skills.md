# Table: rider_skills

Associates user profiles with specific riding skills and their self-assessed level.

## Columns

| Column Name   | Data Type                | Default Value         | Nullable | Constraints                                          | Description                                      |
|---------------|--------------------------|-----------------------|----------|------------------------------------------------------|--------------------------------------------------|
| `id`          | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                          | Unique identifier for the skill association.     |
| `profile_id`  | `uuid`                   |                       | No       | Foreign Key (`profiles.id`), Unique (`skill_name`)  | References the user profile this skill belongs to. |
| `skill_name`  | `text`                   |                       | No       | Unique (`profile_id`)                                | The name of the riding skill (e.g., 'Cornering', 'Wheelies'). |
| `skill_level` | `integer`                |                       | Yes      | CHECK (`skill_level` >= 1 AND `skill_level` <= 5) | Self-assessed skill level (e.g., 1-5 scale).     |
| `created_at`  | `timestamp with time zone` | `now()`               | Yes      |                                                      | Timestamp when the skill was associated.         |

## Indexes

- `rider_skills_pkey` (Primary Key) on `id`
- `rider_skills_profile_id_skill_name_key` (Unique Key) on `profile_id`, `skill_name`

## Foreign Key Constraints

- `rider_skills_profile_id_fkey`: `profile_id` references `profiles(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Rider skills are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can manage own skills`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = profile_id)`
  - **Check Expression:** (none)

## Notes

- This table allows users to list specific riding skills and rate their proficiency.
- The `skill_name` could be free text or linked to a predefined list of skills.
- The `skill_level` uses a constrained integer range (1-5) for rating.
- The unique constraint prevents listing the same skill multiple times for one profile.
- RLS allows public viewing but restricts management to the profile owner.
