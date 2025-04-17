# Table: locations

Stores user-defined locations like home, work, favorite spots, or custom points of interest.

## Columns

| Name            | Type                        | Modifiers                   | Description                                                                                             |
| :-------------- | :-------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------ |
| `id`            | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the location.                                                                     |
| `user_id`       | `uuid`                      |                             | Foreign key referencing the `users` table (owner of the location). Can be NULL for system locations?    |
| `name`          | `text`                      | `NOT NULL`                  | User-defined name for the location (e.g., "Home", "Work", "Favorite Cafe").                             |
| `address`       | `text`                      |                             | Optional street address for the location.                                                               |
| `lat`           | `double precision`          | `NOT NULL`                  | Latitude coordinate of the location.                                                                    |
| `lng`           | `double precision`          | `NOT NULL`                  | Longitude coordinate of the location.                                                                   |
| `is_public`     | `boolean`                   | `DEFAULT false`             | Flag indicating if the location can be viewed by others (e.g., public meetup points).                   |
| `location_type` | `text`                      | `NOT NULL`, `DEFAULT 'custom'` | Type of location (home, work, favorite, dealership, shop, meetup, custom).                             |
| `created_at`    | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the location was created.                                                                |
| `updated_at`    | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the location was last updated.                                                           |

## Constraints

- **locations_pkey**: Primary key constraint on the `id` column.
- **locations_location_type_check**: Check constraint ensuring `location_type` is one of the allowed values ('home', 'work', 'favorite', 'dealership', 'shop', 'meetup', 'custom').
- **locations_user_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `locations_pkey` (implicit index for PRIMARY KEY)

## Referenced By

*   None directly listed in the provided schema, but potentially used by features like ride planning, event locations, etc.

## Row Level Security (RLS)

- **Public locations are viewable by everyone**: Allows SELECT if `is_public` is true OR the current user is the owner (`user_id`).
- **Users can manage own locations**: Allows INSERT, UPDATE, DELETE if the current user is the owner (`user_id`).
- RLS is enabled for this table.
