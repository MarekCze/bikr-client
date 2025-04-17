# Table: safety_reports

Stores reports submitted by users about safety concerns like hazards or accidents.

## Columns

| Column Name   | Data Type                | Default Value | Nullable | Constraints                                                                                             | Description                                                         |
|---------------|--------------------------|---------------|----------|---------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `id`          | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                                             | Unique identifier for the safety report.                            |
| `user_id`     | `uuid`                   |               | No       | Foreign Key (`users.id`)                                                                                | References the user who submitted the report.                       |
| `report_type` | `text`                   |               | No       | CHECK (`report_type` IN ('hazard', 'accident', 'police', 'construction', 'closure', 'other'))           | The type of safety issue being reported.                            |
| `description` | `text`                   |               | Yes      |                                                                                                         | Detailed description of the safety issue.                           |
| `location_lat`| `double precision`       |               | No       |                                                                                                         | Latitude coordinate of the reported issue.                          |
| `location_lng`| `double precision`       |               | No       |                                                                                                         | Longitude coordinate of the reported issue.                         |
| `location_name`| `text`                   |               | Yes      |                                                                                                         | Optional text description of the location.                          |
| `severity`    | `text`                   | `'medium'`    | No       | CHECK (`severity` IN ('low', 'medium', 'high', 'critical'))                                             | The perceived severity level of the issue.                          |
| `is_verified` | `boolean`                | `false`       | Yes      |                                                                                                         | Flag indicating if the report has been verified (e.g., by votes). |
| `expires_at`  | `timestamp with time zone` |               | Yes      |                                                                                                         | Timestamp when the report should automatically expire (optional).   |
| `created_at`  | `timestamp with time zone` | `now()`       | Yes      |                                                                                                         | Timestamp when the report was created.                              |
| `updated_at`  | `timestamp with time zone` | `now()`       | Yes      |                                                                                                         | Timestamp when the report was last updated.                         |

## Indexes

- `safety_reports_pkey` (Primary Key) on `id`
- `safety_reports_created_at_idx` (Index) on `created_at`
- `safety_reports_location_idx` (GiST Index) on `st_setsrid(st_makepoint(location_lng, location_lat), 4326)` (Uses PostGIS for spatial indexing)

## Foreign Key Constraints

- `safety_reports_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

- `safety_report_votes` (`safety_report_id` references `safety_reports(id)`)

## Row Level Security (RLS) Policies

- **Policy:** `Safety reports are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can create safety reports`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `(auth.uid() = user_id)`

- **Policy:** `Users can delete own safety reports`
  - **Operation:** `DELETE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Users can update own safety reports`
  - **Operation:** `UPDATE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

## Notes

- This table is central to the community safety features.
- The PostGIS index on `location_lat` and `location_lng` allows for efficient spatial queries (e.g., finding reports near a user).
- `is_verified` could be updated based on votes from `safety_report_votes` or moderator action.
- `expires_at` allows temporary reports (like police presence) to be automatically hidden after a certain time.
- RLS allows public viewing but restricts management to the report creator. Moderators would need separate permissions.
