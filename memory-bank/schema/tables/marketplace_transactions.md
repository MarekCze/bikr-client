# Table: marketplace_transactions

Records transactions related to marketplace listings.

## Columns

| Name       | Type                        | Modifiers                   | Description                                                                     |
| :--------- | :-------------------------- | :-------------------------- | :------------------------------------------------------------------------------ |
| `id`       | `uuid`                      | `NOT NULL`, `DEFAULT gen_random_uuid()` | Unique identifier for the transaction.                                          |
| `listing_id` | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `marketplace_listings` table this transaction is for. |
| `offer_id` | `uuid`                      |                             | Optional foreign key referencing the `listing_offers` table if based on an offer. |
| `seller_id`| `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (seller).                             |
| `buyer_id` | `uuid`                      | `NOT NULL`                  | Foreign key referencing the `users` table (buyer).                              |
| `amount`   | `numeric(10,2)`             | `NOT NULL`                  | Final transaction amount.                                                       |
| `status`   | `text`                      | `NOT NULL`, `DEFAULT 'pending'` | Status of the transaction (pending, completed, cancelled, refunded, disputed).  |
| `created_at` | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the transaction was initiated.                                   |
| `updated_at` | `timestamp with time zone`  | `DEFAULT now()`             | Timestamp when the transaction status was last updated.                         |

## Constraints

- **marketplace_transactions_pkey**: Primary key constraint on the `id` column.
- **marketplace_transactions_status_check**: Check constraint ensuring `status` is one of the allowed values.
- **marketplace_transactions_buyer_id_fkey**: Foreign key constraint referencing `users(id)`.
- **marketplace_transactions_listing_id_fkey**: Foreign key constraint referencing `marketplace_listings(id)`.
- **marketplace_transactions_offer_id_fkey**: Foreign key constraint referencing `listing_offers(id)`.
- **marketplace_transactions_seller_id_fkey**: Foreign key constraint referencing `users(id)`.

## Indexes

- `marketplace_transactions_pkey` (implicit index for PRIMARY KEY)

## Referenced By

*   None

## Row Level Security (RLS)

- **System can create transactions**: Allows INSERT if the current user is the seller or buyer.
- **Transaction participants can see their transactions**: Allows SELECT if the current user is the seller or buyer.
- **Transaction participants can update status**: Allows UPDATE if the current user is the seller or buyer.
- RLS is enabled for this table.
