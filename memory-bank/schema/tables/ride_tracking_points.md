# Table: ride_tracking_points

Stores individual GPS data points recorded during a tracked ride.

## Columns

| Column Name     | Data Type                | Default Value         | Nullable | Constraints                      | Description                                      |
|-----------------|--------------------------|-----------------------|----------|----------------------------------|--------------------------------------------------|
| `id`            | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                      | Unique identifier for the tracking point.        |
| `ride_id`       | `uuid`                   |                       | No       | Foreign Key (`rides.id`)         | References the ride this point belongs to.       |
| `lat`           | `double precision`       |                       | No       |                                  | Latitude coordinate of the point.                |
| `lng`           | `double precision`       |                       | No       |                                  | Longitude coordinate of the point.               |
| `altitude`      | `double precision`       |                       | Yes      |                                  | Altitude in meters (if available).               |
| `speed`         | `double precision`       |                       | Yes      |                                  | Speed in meters per second (if available).       |
| `timestamp`     | `timestamp with time zone` |                       | No       |                                  | Timestamp when the point was recorded.           |
| `battery_level` | `integer`                |                       | Yes      |                                  | Device battery level percentage (if available).  |
| `created_at`    | `timestamp with time zone` | `now()`               | Yes      |                                  | Timestamp when the record was created.           |

## Indexes

- `ride_tracking_points_pkey` (Primary Key) on `id`
- `ride_tracking_points_ride_id_idx` (Index) on `ride_id`
- `ride_tracking_points_timestamp_idx` (Index) on `timestamp`

## Foreign Key Constraints

- `ride_tracking_points_ride_id_fkey`: `ride_id` references `rides(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Users can manage tracking points for own rides`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(EXISTS ( SELECT 1 FROM public.rides WHERE ((rides.id = ride_tracking_points.ride_id) AND (rides.user_id = auth.uid()))))`
  - **Check Expression:** (none)

- **Policy:** `Users can see tracking points for visible rides`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `(EXISTS ( SELECT 1 FROM public.rides WHERE ((rides.id = ride_tracking_points.ride_id) AND ((rides.privacy_level = 'public'::text) OR (auth.uid() = rides.user_id) OR ((rides.privacy_level = 'followers'::text) AND (EXISTS ( SELECT 1 FROM public.follows WHERE ((follows.following_id = rides.user_id) AND (follows.follower_id = auth.uid())))))))))`
  - **Check Expression:** (none)

## Notes

- Each row represents a single point in time and space during a user's tracked ride.
- This table can grow very large, so efficient indexing (especially on `ride_id` and `timestamp`) is crucial.
- RLS ensures users can only manage points for their own rides and view points based on the associated ride's privacy settings.
