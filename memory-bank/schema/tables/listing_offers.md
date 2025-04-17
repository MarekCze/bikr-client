# Table: listing_offers

## Description
Stores offers made by users on marketplace listings.

## Columns

| Column Name | Type                     | Constraints                                          | Default Value | Description                                      |
|-------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the offer.                 |
| listing_id  | uuid                     | FOREIGN KEY (marketplace_listings.id), NOT NULL      |               | ID of the marketplace listing the offer is for.  |
| user_id     | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the user making the offer.                 |
| amount      | numeric(10,2)            | NOT NULL                                             |               | The monetary amount of the offer.                |
| message     | text                     |                                                      |               | An optional message included with the offer.     |
| status      | text                     | NOT NULL, CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')) | 'pending'     | Current status of the offer.                     |
| created_at  | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the offer was created.            |
| updated_at  | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the offer was last updated.       |

## Indexes

- **listing_offers_pkey**: PRIMARY KEY on `id`
- **listing_offers_listing_id_idx**: btree index on `listing_id`
- **listing_offers_user_id_idx**: btree index on `user_id`

## Foreign Key Constraints

- **listing_offers_listing_id_fkey**: `listing_id` references `public.marketplace_listings(id)`
- **listing_offers_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

- **marketplace_transactions.marketplace_transactions_offer_id_fkey**: `marketplace_transactions.offer_id` references `listing_offers.id`

## Row Level Security (RLS) Policies

- **POLICY "Listing owners can see offers"**: Allows SELECT access for the user who owns the listing or the user who made the offer.
  ```sql
  CREATE POLICY "Listing owners can see offers" ON public.listing_offers FOR SELECT USING (((EXISTS ( SELECT 1
     FROM public.marketplace_listings
    WHERE ((marketplace_listings.id = listing_offers.listing_id) AND (marketplace_listings.user_id = auth.uid())))) OR (auth.uid() = user_id)));
  ```
- **POLICY "Users can make offers"**: Allows INSERT for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can make offers" ON public.listing_offers FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- **POLICY "Listing owners can update offer status"**: Allows UPDATE for authenticated users who own the associated listing.
  ```sql
  CREATE POLICY "Listing owners can update offer status" ON public.listing_offers FOR UPDATE USING (EXISTS ( SELECT 1
     FROM public.marketplace_listings
    WHERE ((marketplace_listings.id = listing_offers.listing_id) AND (marketplace_listings.user_id = auth.uid()))));
  ```
- **POLICY "Users can update their offers"**: Allows UPDATE for authenticated users where the `user_id` matches the authenticated user's ID (e.g., to cancel).
  ```sql
  CREATE POLICY "Users can update their offers" ON public.listing_offers FOR UPDATE USING (auth.uid() = user_id);
  ```
  *(Note: DELETE policy might be missing or restricted, e.g., only allow cancellation via status update).*
