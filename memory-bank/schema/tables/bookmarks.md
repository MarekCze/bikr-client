# Table: bookmarks

## Description
Stores user bookmarks for content items (posts or marketplace listings).

## Columns

| Column Name  | Type                     | Constraints                                          | Default Value | Description                                      |
|--------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id           | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the bookmark.              |
| user_id      | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the user who created the bookmark.         |
| content_type | text                     | NOT NULL, CHECK (content_type IN ('post', 'marketplace')) |               | Type of content being bookmarked.                |
| content_id   | uuid                     | NOT NULL                                             |               | ID of the specific post or listing being bookmarked. |
| created_at   | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the bookmark was created.         |

## Indexes

- **bookmarks_pkey**: PRIMARY KEY on `id`
- **bookmarks_user_id_content_type_content_id_key**: UNIQUE index on `user_id`, `content_type`, `content_id` (Ensures a user can only bookmark an item once).

## Foreign Key Constraints

- **bookmarks_user_id_fkey**: `user_id` references `public.users(id)`
- *(Note: `content_id` does not have a direct FK due to referencing multiple tables. Relationships are enforced by application logic and RLS.)*

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Bookmarks are viewable by the owner"**: Allows SELECT access for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Bookmarks are viewable by the owner" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
  ```
- **POLICY "Users can manage their bookmarks"**: Allows INSERT, UPDATE, DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can manage their bookmarks" ON public.bookmarks USING (auth.uid() = user_id);
