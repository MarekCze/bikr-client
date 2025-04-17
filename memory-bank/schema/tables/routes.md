# Table: routes

Stores information about predefined routes created by users or associated with events.

## Columns

| Column Name   | Data Type                | Default Value | Nullable | Constraints                                                                 | Description                                                         |
|---------------|--------------------------|---------------|----------|-----------------------------------------------------------------------------|---------------------------------------------------------------------|
| `id`          | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                 | Unique identifier for the route.                                    |
| `name`        | `text`                   |               | No       |                                                                             | Name of the route.                                                  |
| `description` | `text`                   |               | Yes      |                                                                             | Description of the route.                                           |
| `distance`    | `double precision`       |               | Yes      |                                                                             | Estimated total distance of the route in meters.                    |
| `duration`    | `integer`                |               | Yes      |                                                                             | Estimated total duration of the route in seconds.                   |
| `difficulty`  | `text`                   |               | Yes      | CHECK (`difficulty` IN ('easy', 'moderate', 'challenging', 'difficult', 'extreme')) | Subjective difficulty level of the route.                           |
| `is_loop`     | `boolean`                | `false`       | Yes      |                                                                             | Indicates if the route starts and ends at the same point.           |
| `created_by`  | `uuid`                   |               | No       | Foreign Key (`users.id`)                                                    | References the user who created the route.                          |
| `event_id`    | `uuid`                   |               | Yes      | Foreign Key (`events.id`)                                                   | References an event this route is associated with (optional).       |
| `is_public`   | `boolean`                | `true`        | Yes      |                                                                             | Indicates if the route is publicly visible or private to the creator. |
| `created_at`  | `timestamp with time zone` | `now()`       | Yes      |                                                                             | Timestamp when the route was created.                               |
| `updated_at`  | `timestamp with time zone` | `now()`       | Yes      |                                                                             | Timestamp when the route was last updated.                          |

## Indexes

- `routes_pkey` (Primary Key) on `id`

## Foreign Key Constraints

- `routes_created_by_fkey`: `created_by` references `users(id)`
- `routes_event_id_fkey`: `event_id` references `events(id)`

## Referenced By

- `group_rides` (`route_id` references `routes(id)`)
- `rides` (`route_id` references `rides(id)`)
- `route_bookmarks` (`route_id` references `routes(id)`)
- `route_ratings` (`route_id` references `routes(id)`)
- `route_waypoints` (`route_id` references `routes(id)`)
- `content_tags` (when `content_type` = 'route', `content_id` references `routes(id)`)

## Row Level Security (RLS) Policies

- **Policy:** `Public routes are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `(is_public OR (auth.uid() = created_by) OR ((event_id IS NOT NULL) AND (EXISTS ( SELECT 1 FROM public.events WHERE ((events.id = routes.event_id) AND (NOT events.is_private OR (auth.uid() = events.created_by) OR (EXISTS ( SELECT 1 FROM public.event_participants WHERE ((event_participants.event_id = events.id) AND (event_participants.user_id = auth.uid()))))))))))`
  - **Check Expression:** (none)

- **Policy:** `Users can create routes`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `(auth.uid() = created_by)`

- **Policy:** `Users can delete own routes`
  - **Operation:** `DELETE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = created_by)`
  - **Check Expression:** (none)

- **Policy:** `Users can update own routes`
  - **Operation:** `UPDATE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = created_by)`
  - **Check Expression:** (none)

## Notes

- This table defines the metadata for a route. The actual points defining the path are stored in `route_waypoints`.
- Routes can be standalone (`is_public` controls visibility) or associated with a specific `event_id`.
- RLS ensures creators can manage their routes, and visibility depends on the `is_public` flag or association with an event the user has access to.
