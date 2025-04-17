# Table: poll_options

Stores the individual options for a poll associated with a post.

## Columns

| Column Name   | Data Type                | Default Value         | Nullable | Constraints                                     | Description                                      |
|---------------|--------------------------|-----------------------|----------|-------------------------------------------------|--------------------------------------------------|
| `id`          | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                     | Unique identifier for the poll option.           |
| `post_id`     | `uuid`                   |                       | No       | Foreign Key (`posts.id`)                        | References the post this option belongs to.      |
| `option_text` | `text`                   |                       | No       |                                                 | The text content of the poll option.             |
| `position`    | `integer`                | `0`                   | No       |                                                 | The display order of the option within the poll. |
| `created_at`  | `timestamp with time zone` | `now()`               | Yes      |                                                 | Timestamp when the poll option was created.      |

## Indexes

- `poll_options_pkey` (Primary Key) on `id`

## Foreign Key Constraints

- `poll_options_post_id_fkey`: `post_id` references `posts(id)`

## Referenced By

- `poll_votes` (`poll_option_id` references `poll_options(id)`)

## Row Level Security (RLS) Policies

- **Policy:** `Poll options are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can manage poll options through posts`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(EXISTS ( SELECT 1 FROM public.posts WHERE ((posts.id = poll_options.post_id) AND (posts.user_id = auth.uid()))))`
  - **Check Expression:** (none)

## Notes

- Each row represents a single choice within a poll created as part of a post (`posts` table where `is_poll = true`).
- The `position` column determines the order in which options are displayed.
