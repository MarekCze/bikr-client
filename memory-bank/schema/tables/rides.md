# Table: rides

Stores information about individual rides tracked or logged by users.

## Columns

| Column Name     | Data Type                | Default Value | Nullable | Constraints                                                                 | Description                                      |
|-----------------|--------------------------|---------------|----------|-----------------------------------------------------------------------------|--------------------------------------------------|
| `id`            | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                 | Unique identifier for the ride.                  |
| `user_id`       | `uuid`                   |               | No       | Foreign Key (`users.id`)                                                    | References the user who recorded the ride.       |
| `motorcycle_id` | `uuid`                   |               | Yes      | Foreign Key (`motorcycles.id`)                                              | References the motorcycle used for the ride.     |
| `route_id`      | `uuid`                   |               | Yes      | Foreign Key (`routes.id`)                                                   | References a predefined route used for the ride. |
| `event_id`      | `uuid`                   |               | Yes      | Foreign Key (`events.id`)                                                   | References an event this ride was part of.       |
| `title`         | `text`                   |               | Yes      |                                                                             | Optional title for the ride.                     |
| `start_time`    | `timestamp with time zone` |               | No       |                                                                             | Timestamp when the ride started.                 |
| `end_time`      | `timestamp with time zone` |               | Yes      |                                                                             | Timestamp when the ride ended.                   |
| `distance`      | `double precision`       |               | Yes      |                                                                             | Total distance covered in meters.                |
| `duration`      | `integer`                |               | Yes      |                                                                             | Total duration of the ride in seconds.           |
| `average_speed` | `double precision`       |               | Yes      |                                                                             | Average speed in meters per second.              |
| `max_speed`     | `double precision`       |               | Yes      |                                                                             | Maximum speed reached in meters per second.      |
| `start_location`| `text`                   |               | Yes      |                                                                             | Text description of the start location.          |
| `end_location`  | `text`                   |               | Yes      |                                                                             | Text description of the end location.            |
| `status`        | `text`                   | `'active'`    | No       | CHECK (`status` IN ('active', 'completed', 'cancelled', 'paused'))          | Current status of the ride tracking.             |
| `privacy_level` | `text`                   | `'private'`   | No       | CHECK (`privacy_level` IN ('public', 'followers', 'private'))               | Privacy setting for viewing the ride details.    |
| `created_at`    | `timestamp with time zone` | `now()`       | Yes      |                                                                             | Timestamp when the ride record was created.      |
| `updated_at`    | `timestamp with time zone` | `now()`       | Yes      |                                                                             | Timestamp when the ride record was last updated. |

## Indexes

- `rides_pkey` (Primary Key) on `id`
- `rides_user_id_idx` (Index) on `user_id`
- `rides_start_time_idx` (Index) on `start_time`
- `rides_route_id_idx` (Index) on `route_id` WHERE `route_id` IS NOT NULL
- `rides_event_id_idx` (Index) on `event_id` WHERE `event_id` IS NOT NULL

## Foreign Key Constraints

- `rides_user_id_fkey`: `user_id` references `users(id)`
- `rides_motorcycle_id_fkey`: `motorcycle_id` references `motorcycles(id)`
- `rides_route_id_fkey`: `route_id` references `routes(id)`
- `rides_event_id_fkey`: `event_id` references `events(id)`

## Referenced By

- `group_ride_participants` (`ride_id` references `rides(id)`)
- `ride_tracking_points` (`ride_id` references `rides(id)`)

## Row Level Security (RLS) Policies

- **Policy:** `Users can manage own rides`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Public rides are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `((privacy_level = 'public'::text) OR (auth.uid() = user_id) OR ((privacy_level = 'followers'::text) AND (EXISTS ( SELECT 1 FROM public.follows WHERE ((follows.following_id = rides.user_id) AND (follows.follower_id = auth.uid()))))))`
  - **Check Expression:** (none)

## Notes

- This table serves as the central record for tracked rides.
- It links to users, motorcycles, routes, and events.
- Ride statistics (`distance`, `duration`, `average_speed`, `max_speed`) are calculated and stored here, likely updated upon ride completion.
- The `status` column indicates if a ride is currently being tracked, paused, completed, or cancelled.
- `privacy_level` controls visibility based on user settings and follower relationships.
- Detailed GPS data is stored separately in `ride_tracking_points`.
