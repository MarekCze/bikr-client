# Table: user_achievements

Links users to achievements they have earned.

## Columns

| Column Name    | Data Type                | Default Value         | Nullable | Constraints                                             | Description                                                         |
|----------------|--------------------------|-----------------------|----------|---------------------------------------------------------|---------------------------------------------------------------------|
| `id`           | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                             | Unique identifier for the earned achievement record.                |
| `user_id`      | `uuid`                   |                       | No       | Foreign Key (`users.id`), Unique (`achievement_id`)    | References the user who earned the achievement.                     |
| `achievement_id`| `uuid`                   |                       | No       | Foreign Key (`achievements.id`), Unique (`user_id`)    | References the achievement that was earned.                         |
| `earned_at`    | `timestamp with time zone` | `now()`               | Yes      |                                                         | Timestamp when the achievement was earned.                          |
| `earned_value` | `integer`                |                       | Yes      |                                                         | Optional value associated with earning (e.g., distance for a mileage achievement). |

## Indexes

- `user_achievements_pkey` (Primary Key) on `id`
- `user_achievements_user_id_achievement_id_key` (Unique Key) on `user_id`, `achievement_id`

## Foreign Key Constraints

- `user_achievements_user_id_fkey`: `user_id` references `users(id)`
- `user_achievements_achievement_id_fkey`: `achievement_id` references `achievements(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `User achievements are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `System can award achievements`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `((auth.uid() = user_id) OR (auth.uid() IN ( SELECT users.id FROM public.users WHERE ((users.id = auth.uid()) AND (users.is_admin = true)))))`

## Notes

- This table acts as a join table between `users` and `achievements`.
- The unique constraint on `(user_id, achievement_id)` ensures a user can only earn a specific achievement once.
- `earned_value` can store context-specific data related to how the achievement was earned.
- RLS allows public viewing. The INSERT policy is interesting: it allows either the user themselves OR an admin user (checked via a subquery on the `users` table) to insert records. This suggests achievements might be awarded automatically by the system (running as admin/service role) or potentially manually by the user in some cases. Deletion/Update policies are missing, implying earned achievements might be permanent or managed only by admins/system logic.
