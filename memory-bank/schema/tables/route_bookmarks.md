# Table: route_bookmarks

Stores bookmarks linking users to routes they have saved.

## Columns

| Column Name  | Data Type                | Default Value         | Nullable | Constraints                                          | Description                                      |
|--------------|--------------------------|-----------------------|----------|------------------------------------------------------|--------------------------------------------------|
| `id`         | `uuid`                   | `gen_random_uuid()`   | No       | Primary Key                                          | Unique identifier for the bookmark.              |
| `route_id`   | `uuid`                   |                       | No       | Foreign Key (`routes.id`), Unique (`user_id`)       | References the route being bookmarked.           |
| `user_id`    | `uuid`                   |                       | No       | Foreign Key (`users.id`), Unique (`route_id`)       | References the user who created the bookmark.    |
| `created_at` | `timestamp with time zone` | `now()`               | Yes      |                                                      | Timestamp when the bookmark was created.         |

## Indexes

- `route_bookmarks_pkey` (Primary Key) on `id`
- `route_bookmarks_route_id_user_id_key` (Unique Key) on `route_id`, `user_id`

## Foreign Key Constraints

- `route_bookmarks_route_id_fkey`: `route_id` references `routes(id)`
- `route_bookmarks_user_id_fkey`: `user_id` references `users(id)`

## Referenced By

(None)

## Row Level Security (RLS) Policies

- **Policy:** `Route bookmarks are private to each user`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** (none)

- **Policy:** `Users can manage their route bookmarks`
  - **Operation:** `ALL` (Inferred from `USING` clause without specific operations)
  - **Applies To:** `all`
  - **Using Expression:** `(auth.uid() = user_id)`
  - **Check Expression:** `(auth.uid() = user_id)` (Inferred from `USING` clause)

## Notes

- This table acts as a join table between users and routes, specifically for bookmarking functionality.
- The unique constraint on `(route_id, user_id)` ensures a user can only bookmark a specific route once.
- RLS policies restrict access and management of bookmarks strictly to the user who created them.
