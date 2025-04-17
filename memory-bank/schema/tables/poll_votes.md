# Table: poll_votes

Records votes cast by users on specific poll options.

## Columns

| Column Name      | Data Type                | Default Value         | Nullable | Constraints                                          | Description                                      |
|------------------|--------------------------|-----------------------|----------|------------------------------------------------------|--------------------------------------------------|
| `id`             | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                          | Unique identifier for the poll vote.             |
| `poll_option_id` | `uuid`                   |                       | No       | Foreign Key (`poll_options.id`), Unique (`user_id`) | References the poll option being voted for.      |
| `user_id`        | `uuid`                   |                       | No       | Foreign Key (`users.id`), Unique (`poll_option_id`) | References the user who cast the vote.           |
| `created_at`     | `timestamp with time zone` | `now()`               | Yes      |                                                      | Timestamp when the vote was cast.                |

## Indexes

- `poll_votes_pkey` (Primary Key) on `id`
- `poll_votes_poll_option_id_user_id_key` (Unique Key) on `poll_option_id`, `user_id`

## Foreign Key Constraints

- `poll_votes_poll_option_id_fkey`: `poll_option_id` references `poll_options(id)`
- `poll_votes_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Poll votes are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can change their votes`
  - **Operation:** `UPDATE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Users can remove their votes`
  - **Operation:** `DELETE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Users can vote in polls`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `(auth.uid() = user_id)`

## Notes

- This table links users to the specific poll options they have voted for.
- The unique constraint on `(poll_option_id, user_id)` ensures that a user can only vote once per poll option. However, the schema doesn't prevent a user from voting for multiple options within the *same* poll unless enforced at the application level. A better approach might be a unique constraint on `(post_id, user_id)` if users should only vote once per poll. This requires joining `poll_options` to get `post_id`. *Correction:* The unique constraint `poll_votes_poll_option_id_user_id_key` *does* prevent voting multiple times for the *same option*, but not for different options in the same poll. Application logic must handle single-choice polls.
