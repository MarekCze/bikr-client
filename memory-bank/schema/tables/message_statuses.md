# Table: message_statuses

Tracks the read status of messages for each participant in a conversation.

## Columns

| Name         | Type                        | Modifiers                   | Description                                                                 |
| :----------- | :-------------------------- | :-------------------------- | :-------------------------------------------------------------------------- |
| `id`         | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the message status record.                            |
| `message_id` | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `messages` table this status is for.            |
| `user_id`    | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (participant whose status this is). |
| `is_read`    | `boolean`                   | `DEFAULT false`             | Flag indicating if the user has read the message.                           |
| `read_at`    | `timestamp with time zone`  |                             | Timestamp when the user read the message.                                   |
| `created_at` | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the status record was created.                               |
| `updated_at` | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the status record was last updated.                          |

## Constraints

- **message_statuses_pkey**: Primary key constraint on the `id` column.
- **message_statuses_message_id_user_id_key**: Unique constraint ensuring one status record per message per user.
- **message_statuses_message_id_fkey**: Foreign key constraint referencing `messages(id)`.
- **message_statuses_user_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `message_statuses_pkey` (implicit index for PRIMARY KEY)
- `message_statuses_message_id_user_id_key` (implicit index for UNIQUE constraint)

## Referenced By

*   None

## Row Level Security (RLS)

- RLS is enabled for this table. (Specific policies were not explicitly defined in the provided `schema_tables.sql` dump for this table, but likely depend on conversation participation).
