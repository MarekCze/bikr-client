# Table: motorcycles

Stores information about motorcycles owned by users (their virtual "garage").

## Columns

| Name         | Type                        | Modifiers                   | Description                                                         |
| :----------- | :-------------------------- | :-------------------------- | :------------------------------------------------------------------ |
| `id`         | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the motorcycle record.                        |
| `user_id`    | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (owner of the motorcycle). |
| `make`       | `text`                      | `NOT NULL`                  | Manufacturer of the motorcycle (e.g., "Honda", "Yamaha").           |
| `model`      | `text`                      | `NOT NULL`                  | Model of the motorcycle (e.g., "CBR600RR", "MT-07").                |
| `year`       | `integer`                   |                             | Year of manufacture.                                                |
| `color`      | `text`                      |                             | Color of the motorcycle.                                            |
| `nickname`   | `text`                      |                             | Optional user-defined nickname for the motorcycle.                  |
| `image_url`  | `text`                      |                             | Optional URL for an image of the motorcycle.                        |
| `is_primary` | `boolean`                   | `DEFAULT false`             | Flag indicating if this is the user's primary motorcycle.           |
| `created_at` | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the motorcycle record was created.                   |
| `updated_at` | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the motorcycle record was last updated.              |

## Constraints

- **motorcycles_pkey**: Primary key constraint on the `id` column.
- **motorcycles_user_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `motorcycles_pkey` (implicit index for PRIMARY KEY)

## Referenced By

*   `maintenance_records` (`motorcycle_id`)
*   `rides` (`motorcycle_id`)
*   `service_reminders` (`motorcycle_id`)

## Row Level Security (RLS)

- **Motorcycles are viewable by everyone**: Allows SELECT.
- **Users can insert their own motorcycles**: Allows INSERT if the current user is the owner (`user_id`).
- **Users can delete own motorcycles**: Allows DELETE if the current user is the owner (`user_id`).
- **Users can update own motorcycles**: Allows UPDATE if the current user is the owner (`user_id`).
- RLS is enabled for this table.
