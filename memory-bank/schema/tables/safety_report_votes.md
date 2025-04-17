# Table: safety_report_votes

Stores user votes (confirm, dispute, resolved) on safety reports submitted by others.

## Columns

| Column Name        | Data Type                | Default Value         | Nullable | Constraints                                                                 | Description                                                    |
|--------------------|--------------------------|-----------------------|----------|-----------------------------------------------------------------------------|----------------------------------------------------------------|
| `id`               | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                                                 | Unique identifier for the vote.                                |
| `safety_report_id` | `uuid`                   |                       | No       | Foreign Key (`safety_reports.id`), Unique (`user_id`)                      | References the safety report being voted on.                   |
| `user_id`          | `uuid`                   |                       | No       | Foreign Key (`users.id`), Unique (`safety_report_id`)                      | References the user casting the vote.                          |
| `vote_type`        | `text`                   |                       | No       | CHECK (`vote_type` IN ('confirm', 'dispute', 'resolved'))                   | The type of vote cast (confirming, disputing, or marking resolved). |
| `created_at`       | `timestamp with time zone` | `now()`               | Yes      |                                                                             | Timestamp when the vote was cast.                              |

## Indexes

- `safety_report_votes_pkey` (Primary Key) on `id`
- `safety_report_votes_safety_report_id_user_id_key` (Unique Key) on `safety_report_id`, `user_id`

## Foreign Key Constraints

- `safety_report_votes_safety_report_id_fkey`: `safety_report_id` references `safety_reports(id)`
- `safety_report_votes_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Safety report votes are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can update their votes`
  - **Operation:** `UPDATE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Users can vote on safety reports`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `(auth.uid() = user_id)`

## Notes

- This table allows the community to provide feedback on the validity and status of safety reports.
- The unique constraint on `(safety_report_id, user_id)` ensures a user can only cast one type of vote per report. Application logic might be needed if a user should be able to change their vote type (e.g., from 'confirm' to 'resolved'). The `UPDATE` policy allows users to modify their existing vote record.
- RLS allows public viewing of votes but restricts inserting and updating votes to the user casting them.
