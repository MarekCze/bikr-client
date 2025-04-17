# Table: likes

## Description
Stores user likes or reactions on content items (posts or comments).

## Columns

| Column Name   | Type                     | Constraints                                          | Default Value | Description                                      |
|---------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id            | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the like/reaction.         |
| user_id       | uuid                     | FOREIGN KEY (users.id), NOT NULL                     |               | ID of the user who liked/reacted.                |
| content_type  | text                     | NOT NULL, CHECK (content_type IN ('post', 'comment')) |               | Type of content being liked (post or comment).   |
| content_id    | uuid                     | NOT NULL                                             |               | ID of the specific post or comment being liked.  |
| reaction_type | text                     | NOT NULL, CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')) | 'like'        | Type of reaction (default is 'like').            |
| created_at    | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the like/reaction was created.    |

## Indexes

- **likes_pkey**: PRIMARY KEY on `id`
- **likes_user_id_content_type_content_id_key**: UNIQUE index on `user_id`, `content_type`, `content_id` (Ensures a user can only like/react once per content item).
- **likes_content_idx**: btree index on `content_type`, `content_id`

## Foreign Key Constraints

- **likes_user_id_fkey**: `user_id` references `public.users(id)`
- *(Note: `content_id` does not have a direct FK due to referencing multiple tables. Relationships are enforced by application logic and RLS.)*

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Likes are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
  ```
- **POLICY "Users can manage their likes"**: Allows INSERT, UPDATE, DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can manage their likes" ON public.likes USING (auth.uid() = user_id);
