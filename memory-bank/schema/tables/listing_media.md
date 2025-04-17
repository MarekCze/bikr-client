# Table: listing_media

## Description
Stores metadata about media items (images, videos) associated with marketplace listings.

## Columns

| Column Name | Type                     | Constraints                  | Default Value | Description                                      |
|-------------|--------------------------|------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL        | gen_random_uuid() | Unique identifier for the listing media record.  |
| listing_id  | uuid                     | FOREIGN KEY (marketplace_listings.id), NOT NULL |               | ID of the marketplace listing this media belongs to. |
| media_url   | text                     | NOT NULL                     |               | Public URL of the media file in Supabase Storage. |
| is_primary  | boolean                  | NOT NULL                     | false         | Flag indicating if this is the primary image/video for the listing. |
| position    | integer                  | NOT NULL                     | 0             | Order of the media item within the listing's gallery. |
| created_at  | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the media record was created.     |

## Indexes

- **listing_media_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

- **listing_media_listing_id_fkey**: `listing_id` references `public.marketplace_listings(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Listing media is viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Listing media is viewable by everyone" ON public.listing_media FOR SELECT USING (true);
  ```
- **POLICY "Users can manage media through listings"**: Allows INSERT, UPDATE, DELETE for authenticated users if they own the associated marketplace listing.
  ```sql
  CREATE POLICY "Users can manage media through listings" ON public.listing_media USING (EXISTS ( SELECT 1
     FROM public.marketplace_listings
    WHERE ((marketplace_listings.id = listing_media.listing_id) AND (marketplace_listings.user_id = auth.uid()))));
