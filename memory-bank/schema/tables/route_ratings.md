# Table: route_ratings

Stores user ratings and reviews for specific routes.

## Columns

| Column Name  | Data Type                | Default Value         | Nullable | Constraints                                          | Description                                      |
|--------------|--------------------------|-----------------------|----------|------------------------------------------------------|--------------------------------------------------|
| `id`         | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                          | Unique identifier for the rating.                |
| `route_id`   | `uuid`                   |                       | No       | Foreign Key (`routes.id`), Unique (`user_id`)       | References the route being rated.                |
| `user_id`    | `uuid`                   |                       | No       | Foreign Key (`users.id`), Unique (`route_id`)       | References the user who submitted the rating.    |
| `rating`     | `integer`                |                       | No       | CHECK (`rating` >= 1 AND `rating` <= 5)             | The numerical rating given (e.g., 1-5 stars).    |
| `review`     | `text`                   |                       | Yes      |                                                      | Optional text review accompanying the rating.    |
| `created_at` | `timestamp with time zone` | `now()`               | Yes      |                                                      | Timestamp when the rating was created.           |
| `updated_at` | `timestamp with time zone` | `now()`               | Yes      |                                                      | Timestamp when the rating was last updated.      |

## Indexes

- `route_ratings_pkey` (Primary Key) on `id`
- `route_ratings_route_id_user_id_key` (Unique Key) on `route_id`, `user_id`

## Foreign Key Constraints

- `route_ratings_route_id_fkey`: `route_id` references `routes(id)`
- `route_ratings_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Route ratings are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

- **Policy:** `Users can delete their ratings`
  - **Operation:** `DELETE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Users can rate routes`
  - **Operation:** `INSERT`
  - **Applies To:** `all`
  - **Using Expression:** (none)
  - **Check Expression:** `(auth.uid() = user_id)`

- **Policy:** `Users can update their ratings`
  - **Operation:** `UPDATE`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

## Notes

- This table captures user feedback on routes.
- The unique constraint on `(route_id, user_id)` ensures that a user can only rate a specific route once.
- RLS allows public viewing of ratings but restricts management (insert, update, delete) to the user who submitted the rating.
