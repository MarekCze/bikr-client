# Table: reports

Stores reports submitted by users regarding inappropriate content or behavior.

## Columns

| Column Name   | Data Type                | Default Value | Nullable | Constraints                                                                                                                                                           | Description                                      |
|---------------|--------------------------|---------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------|
| `id`          | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                                                                                                           | Unique identifier for the report.                |
| `reporter_id` | `uuid`                   |               | No       | Foreign Key (`users.id`)                                                                                                                                              | References the user who submitted the report.    |
| `content_type`| `text`                   |               | No       | CHECK (`content_type` IN ('post', 'comment', 'user', 'club', 'event', 'marketplace', 'message'))                                                                      | The type of content being reported.              |
| `content_id`  | `uuid`                   |               | No       |                                                                                                                                                                       | The ID of the specific content being reported.   |
| `reason`      | `text`                   |               | No       | CHECK (`reason` IN ('spam', 'harassment', 'inappropriate', 'violence', 'fraud', 'other'))                                                                             | The primary reason for the report.               |
| `description` | `text`                   |               | Yes      |                                                                                                                                                                       | Additional details provided by the reporter.     |
| `status`      | `text`                   | `'pending'`   | No       | CHECK (`status` IN ('pending', 'reviewed', 'actioned', 'dismissed'))                                                                                                  | The current status of the report investigation.  |
| `created_at`  | `timestamp with time zone` | `now()`       | Yes      |                                                                                                                                                                       | Timestamp when the report was created.           |
| `updated_at`  | `timestamp with time zone` | `now()`       | Yes      |                                                                                                                                                                       | Timestamp when the report was last updated.      |

## Indexes

- `reports_pkey` (Primary Key) on `id`

## Foreign Key Constraints

- `reports_reporter_id_fkey`: `reporter_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Users can create reports`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `(auth.uid() = reporter_id)`

- **Policy:** `Users can see own reports`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = reporter_id)`
  - **Check Expression:** (none)

## Notes

- This table is crucial for community moderation.
- The `content_id` refers to the primary key of the table specified by `content_type` (e.g., `posts.id`, `comments.id`, `users.id`, etc.). Application logic needs to handle resolving this polymorphic relationship.
- The `status` column tracks the moderation workflow.
- RLS ensures users can only create reports for themselves and view their own submitted reports. Admins/Moderators would likely need elevated privileges (e.g., via a `service_role` key or specific admin RLS policies not shown here) to view and manage all reports.
