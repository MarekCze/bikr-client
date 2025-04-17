# Table: media

Stores media files (images, videos) associated with posts.

## Columns

| Name          | Type                        | Modifiers                   | Description                                                                 |
| :------------ | :-------------------------- | :-------------------------- | :-------------------------------------------------------------------------- |
| `id`          | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the media item.                                       |
| `post_id`     | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `posts` table this media belongs to.            |
| `media_type`  | `text`                      | `NOT NULL`                  | Type of media (image, video).                                               |
| `media_url`   | `text`                      | `NOT NULL`                  | URL of the media file (likely stored in Supabase Storage).                  |
| `thumbnail_url`| `text`                      |                             | Optional URL for a thumbnail version of the media.                          |
| `width`       | `integer`                   |                             | Optional width of the media in pixels.                                      |
| `height`      | `integer`                   |                             | Optional height of the media in pixels.                                     |
| `duration`    | `integer`                   |                             | Optional duration of the media in seconds (for videos).                     |
| `position`    | `integer`                   | `NOT NULL`, `DEFAULT 0`     | Order position of the media within a post (for galleries).                  |
| `created_at`  | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the media record was created.                                |

## Constraints

- **media_pkey**: Primary key constraint on the `id` column.
- **media_media_type_check**: Check constraint ensuring `media_type` is one of the allowed values ('image', 'video').
- **media_post_id_fkey**: Foreign key constraint referencing `posts(id)`.

## Indexes

- `media_pkey` (implicit index for PRIMARY KEY)

## Referenced By

*   None

## Row Level Security (RLS)

- **Media is viewable by everyone**: Allows SELECT.
- **Users can manage media through posts**: Allows INSERT, UPDATE, DELETE if the user owns the associated `post`.
- RLS is enabled for this table.
