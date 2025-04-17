# Table: user_notification_settings

Stores user preferences for receiving notifications across different categories and channels.

## Columns

| Column Name  | Data Type                | Default Value         | Nullable | Constraints                                                                                                                                                                                          | Description                                                                 |
|--------------|--------------------------|-----------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `id`         | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                                                                                                                                                                          | Unique identifier for the notification setting record.                      |
| `user_id`    | `uuid`                   |                       | No       | Foreign Key (`users.id`), Unique (`category`)                                                                                                                                                        | References the user these settings belong to.                               |
| `category`   | `text`                   |                       | No       | CHECK (`category` IN ('likes', 'comments', 'follows', 'mentions', 'club_activity', 'event_updates', 'messages', 'marketplace', 'maintenance', 'safety', 'achievements', 'system')), Unique (`user_id`) | The category of notification (e.g., 'comments', 'messages').                |
| `email`      | `boolean`                | `true`                | Yes      |                                                                                                                                                                                                      | Preference for receiving notifications via email for this category.         |
| `push`       | `boolean`                | `true`                | Yes      |                                                                                                                                                                                                      | Preference for receiving push notifications for this category.              |
| `in_app`     | `boolean`                | `true`                | Yes      |                                                                                                                                                                                                      | Preference for receiving in-app notifications for this category.            |
| `created_at` | `timestamp with time zone` | `now()`               | Yes      |                                                                                                                                                                                                      | Timestamp when the setting record was created.                              |
| `updated_at` | `timestamp with time zone` | `now()`               | Yes      |                                                                                                                                                                                                      | Timestamp when the setting record was last updated.                         |

## Indexes

- `user_notification_settings_pkey` (Primary Key) on `id`
- `user_notification_settings_user_id_category_key` (Unique Key) on `user_id`, `category`

## Foreign Key Constraints

- `user_notification_settings_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Users can manage own notification settings`
  - **Operation:** `ALL` (Inferred from `USING` clause without specific operations)
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** `(auth.uid() = user_id)` (Inferred from `USING` clause)

- **Policy:** `Users can see own notification settings`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

## Notes

- This table allows fine-grained control over notification delivery for each user.
- Each row represents the settings for one specific `category` for a given `user_id`.
- The unique constraint on `(user_id, category)` ensures there's only one settings record per user per category.
- Boolean flags (`email`, `push`, `in_app`) control the delivery channels.
- RLS strictly limits access and management to the user whose settings are being modified.
