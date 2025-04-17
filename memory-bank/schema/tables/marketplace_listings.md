# Table: marketplace_listings

Stores items listed for sale or rent in the marketplace.

## Columns

| Name            | Type                        | Modifiers                   | Description                                                                                             |
| :-------------- | :-------------------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------ |
| `id`            | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the listing.                                                                      |
| `user_id`       | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (seller).                                                     |
| `title`         | `text`                      | `NOT NULL`                  | Title of the listing.                                                                                   |
| `description`   | `text`                      |                             | Detailed description of the item or service.                                                            |
| `category`      | `text`                      | `NOT NULL`                  | Category of the listing (motorcycle, parts, gear, accessories, services, rentals, other).               |
| `price`         | `numeric(10,2)`             | `NOT NULL`                  | Price of the item or service.                                                                           |
| `currency`      | `text`                      | `DEFAULT 'USD'`             | Currency code (e.g., USD, EUR).                                                                         |
| `condition`     | `text`                      |                             | Condition of the item (new, like_new, excellent, good, fair, poor, for_parts).                           |
| `location`      | `text`                      |                             | General location of the item (e.g., "San Francisco, CA").                                               |
| `location_lat`  | `double precision`          |                             | Optional latitude coordinate for map display.                                                           |
| `location_lng`  | `double precision`          |                             | Optional longitude coordinate for map display.                                                          |
| `is_negotiable` | `boolean`                   | `DEFAULT false`             | Flag indicating if the price is negotiable.                                                             |
| `delivery_type` | `text`                      | `NOT NULL`, `DEFAULT 'pickup'` | Available delivery methods (pickup, delivery, shipping, both).                                          |
| `shipping_cost` | `numeric(10,2)`             |                             | Optional cost for shipping, if applicable.                                                              |
| `status`        | `text`                      | `NOT NULL`, `DEFAULT 'active'` | Current status of the listing (active, pending, sold, archived).                                        |
| `created_at`    | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the listing was created.                                                                 |
| `updated_at`    | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the listing was last updated.                                                            |

## Constraints

- **marketplace_listings_pkey**: Primary key constraint on the `id` column.
- **marketplace_listings_category_check**: Check constraint ensuring `category` is one of the allowed values.
- **marketplace_listings_condition_check**: Check constraint ensuring `condition` is one of the allowed values.
- **marketplace_listings_delivery_type_check**: Check constraint ensuring `delivery_type` is one of the allowed values.
- **marketplace_listings_status_check**: Check constraint ensuring `status` is one of the allowed values.
- **marketplace_listings_user_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `marketplace_listings_pkey` (implicit index for PRIMARY KEY)
- `marketplace_listings_category_idx`: Index on the `category` column.
- `marketplace_listings_status_idx`: Index on the `status` column.
- `marketplace_listings_user_id_idx`: Index on the `user_id` column.

## Referenced By

*   `listing_media` (`listing_id`)
*   `listing_offers` (`listing_id`)
*   `marketplace_transactions` (`listing_id`)
*   `bookmarks` (via `content_id` when `content_type` is 'marketplace')
*   `content_tags` (via `content_id` when `content_type` is 'marketplace')
*   `reports` (via `content_id` when `content_type` is 'marketplace')

## Row Level Security (RLS)

- **Listings are viewable by everyone**: Allows SELECT.
- **Users can create listings**: Allows INSERT if the current user is the owner (`user_id`).
- **Users can delete own listings**: Allows DELETE if the current user is the owner (`user_id`).
- **Users can update own listings**: Allows UPDATE if the current user is the owner (`user_id`).
- RLS is enabled for this table.
