# Table: service_reminders

Stores reminders for motorcycle maintenance tasks.

## Columns

| Column Name          | Data Type                | Default Value | Nullable | Constraints                                                                                             | Description                                                                 |
|----------------------|--------------------------|---------------|----------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `id`                 | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                                             | Unique identifier for the service reminder.                                 |
| `motorcycle_id`      | `uuid`                   |               | No       | Foreign Key (`motorcycles.id`)                                                                          | References the motorcycle the reminder is for.                              |
| `user_id`            | `uuid`                   |               | No       | Foreign Key (`users.id`)                                                                                | References the user who owns the motorcycle/reminder.                       |
| `title`              | `text`                   |               | No       |                                                                                                         | Title of the maintenance reminder (e.g., "Oil Change").                     |
| `description`        | `text`                   |               | Yes      |                                                                                                         | Optional description of the reminder.                                       |
| `due_date`           | `date`                   |               | Yes      |                                                                                                         | Date when the service is due.                                               |
| `due_mileage`        | `integer`                |               | Yes      |                                                                                                         | Mileage at which the service is due.                                        |
| `is_recurring`       | `boolean`                | `false`       | Yes      |                                                                                                         | Flag indicating if the reminder repeats.                                    |
| `recurrence_interval`| `text`                   |               | Yes      | CHECK (`recurrence_interval` IN ('weekly', 'monthly', 'quarterly', 'yearly', 'custom'))                 | Time interval for recurrence (if `is_recurring` is true).                   |
| `recurrence_value`   | `integer`                |               | Yes      |                                                                                                         | Value associated with `recurrence_interval` (e.g., every 2 months).         |
| `recurrence_mileage` | `integer`                |               | Yes      |                                                                                                         | Mileage interval for recurrence (if `is_recurring` is true).                |
| `status`             | `text`                   | `'pending'`   | No       | CHECK (`status` IN ('pending', 'completed', 'snoozed', 'dismissed'))                                    | Current status of the reminder.                                             |
| `created_at`         | `timestamp with time zone` | `now()`       | Yes      |                                                                                                         | Timestamp when the reminder was created.                                    |
| `updated_at`         | `timestamp with time zone` | `now()`       | Yes      |                                                                                                         | Timestamp when the reminder was last updated.                               |

## Indexes

- `service_reminders_pkey` (Primary Key) on `id`
- `service_reminders_motorcycle_id_idx` (Index) on `motorcycle_id`
- `service_reminders_user_id_idx` (Index) on `user_id`

## Foreign Key Constraints

- `service_reminders_motorcycle_id_fkey`: `motorcycle_id` references `motorcycles(id)`
- `service_reminders_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Users can manage own service reminders`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

## Notes

- This table helps users track upcoming maintenance for their motorcycles.
- Reminders can be based on `due_date`, `due_mileage`, or both.
- Recurring reminders are supported via `is_recurring` and associated interval/mileage columns.
- The `status` column tracks user interaction with the reminder (pending, completed, snoozed, dismissed).
- RLS restricts all operations to the user who owns the reminder.
