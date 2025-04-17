# Table: messages

Stores individual messages within conversations.

## Columns

| Name            | Type                        | Modifiers                   | Description                                                                     |
| :-------------- | :-------------------------- | :-------------------------- | :------------------------------------------------------------------------------ |
| `id`            | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the message.                                              |
| `conversation_id` | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `conversations` table this message belongs to.      |
| `user_id`       | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (sender of the message).              |
| `message_type`  | `text`                      | `NOT NULL`, `DEFAULT 'text'` | Type of message content (text, image, video, audio, location).                  |
| `content`       | `text`                      |                             | Text content of the message (if `message_type` is 'text').                      |
| `media_url`     | `text`                      |                             | URL of the media file (if `message_type` is 'image', 'video', or 'audio').      |
| `location_lat`  | `double precision`          |                             | Latitude coordinate (if `message_type` is 'location').                          |
| `location_lng`  | `double precision`          |                             | Longitude coordinate (if `message_type` is 'location').                         |
| `created_at`    | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the message was sent.                                            |
| `updated_at`    | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the message was last updated (e.g., edited).                     |

## Constraints

- **messages_pkey**: Primary key constraint on the `id` column.
- **messages_message_type_check**: Check constraint ensuring `message_type` is one of the allowed values.
- **messages_conversation_id_fkey**: Foreign key constraint referencing `conversations(id)`.
- **messages_user_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `messages_pkey` (implicit index for PRIMARY KEY)
- `messages_conversation_id_idx`: Index on the `conversation_id` column.
- `messages_created_at_idx`: Index on the `created_at` column (useful for sorting).

## Referenced By

*   `message_statuses` (`message_id`)
*   `reports` (via `content_id` when `content_type` is 'message')

## Row Level Security (RLS)

- **Users can see messages in their conversations**: Allows SELECT if the user is a participant in the `conversation_id`.
- **Users can send messages to their conversations**: Allows INSERT if the user is the sender (`user_id`) and a participant in the `conversation_id`.
- **Users can update own messages**: Allows UPDATE if the user is the sender (`user_id`).
- **Users can delete own messages**: Allows DELETE if the user is the sender (`user_id`).
- RLS is enabled for this table.
