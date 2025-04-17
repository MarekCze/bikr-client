# Table: route_waypoints

Stores individual points (latitude, longitude, etc.) that define a specific route.

## Columns

| Column Name    | Data Type                | Default Value | Nullable | Constraints                                                                                             | Description                                                         |
|----------------|--------------------------|---------------|----------|---------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `id`           | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                                             | Unique identifier for the waypoint.                                 |
| `route_id`     | `uuid`                   |               | No       | Foreign Key (`routes.id`)                                                                               | References the route this waypoint belongs to.                      |
| `lat`          | `double precision`       |               | No       |                                                                                                         | Latitude coordinate of the waypoint.                                |
| `lng`          | `double precision`       |               | No       |                                                                                                         | Longitude coordinate of the waypoint.                               |
| `altitude`     | `double precision`       |               | Yes      |                                                                                                         | Altitude in meters (if available).                                  |
| `order_position`| `integer`                |               | No       |                                                                                                         | The sequential order of this waypoint within the route.             |
| `waypoint_type`| `text`                   | `'waypoint'`  | No       | CHECK (`waypoint_type` IN ('start', 'end', 'waypoint', 'rest', 'caution', 'photo_op', 'gas'))           | The type or significance of the waypoint (e.g., start, end, rest stop). |
| `name`         | `text`                   |               | Yes      |                                                                                                         | Optional name for the waypoint (e.g., "Scenic Overlook").           |
| `description`  | `text`                   |               | Yes      |                                                                                                         | Optional description for the waypoint.                              |
| `created_at`   | `timestamp with time zone` | `now()`       | Yes      |                                                                                                         | Timestamp when the waypoint was created.                            |

## Indexes

- `route_waypoints_pkey` (Primary Key) on `id`
- `route_waypoints_route_id_idx` (Index) on `route_id`

## Foreign Key Constraints

- `route_waypoints_route_id_fkey`: `route_id` references `routes(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Route creators can manage waypoints`
  - **Operation:** `ALL`
  - **Applies To:** `all`
  - **Using Expression:** `(EXISTS ( SELECT 1 FROM public.routes WHERE ((routes.id = route_waypoints.route_id) AND (routes.created_by = auth.uid()))))`
  - **Check Expression:** (none)

- **Policy:** `Route waypoints are viewable with routes`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `(EXISTS ( SELECT 1 FROM public.routes WHERE ((routes.id = route_waypoints.route_id) AND (routes.is_public OR (auth.uid() = routes.created_by) OR ((routes.event_id IS NOT NULL) AND (EXISTS ( SELECT 1 FROM public.events WHERE ((events.id = routes.event_id) AND (NOT events.is_private OR (auth.uid() = events.created_by) OR (EXISTS ( SELECT 1 FROM public.event_participants WHERE ((event_participants.event_id = events.id) AND (event_participants.user_id = auth.uid()))))))))))))))`
  - **Check Expression:** (none)

## Notes

- Each row represents a point along a defined route.
- The `order_position` column is critical for reconstructing the route sequence.
- `waypoint_type` adds semantic meaning to points along the route.
- RLS ensures that only the route creator can modify waypoints, and visibility is tied to the visibility of the parent route (public, private, or event-associated).
