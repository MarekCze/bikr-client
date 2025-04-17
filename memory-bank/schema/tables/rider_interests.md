# Table: rider_interests

Associates user profiles with specific riding interests.

## Columns

| Column Name  | Data Type                | Default Value         | Nullable | Constraints                                          | Description                                      |
|--------------|--------------------------|-----------------------|----------|------------------------------------------------------|--------------------------------------------------|
| `id`         | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                          | Unique identifier for the interest association.  |
| `profile_id` | `uuid`                   |                       | No       | Foreign Key (`profiles.id`), Unique (`interest`)    | References the user profile this interest belongs to. |
| `interest`   | `text`                   |                       | No       | Unique (`profile_id`)                                | The specific interest (e.g., 'Touring', 'Track Days'). |
| `created_at` | `timestamp with time zone` | `now()`               | Yes      |                                                      | Timestamp when the interest was associated.      |

## Indexes

- `rider_interests_pkey` (Primary Key) on `id`
- `rider_interests_profile_id_interest_key` (Unique Key) on `profile_id`, `interest`

## Foreign Key Constraints

- `rider_interests_profile_id_fkey`: `profile_id` references `profiles(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Rider interests are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can manage own interests`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = profile_id)`
  - **Check Expression:** (none)

## Notes

- This table allows users to specify multiple interests associated with their profile.
- The `interest` column likely draws from a predefined list or allows free text, depending on application design. Using a separate `interests` table with predefined values might be more structured if a fixed list is desired.
- The unique constraint ensures a user cannot have the same interest listed multiple times.
- RLS allows anyone to view interests but only the profile owner to manage them.
