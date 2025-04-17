# Table: comments

## Description
Stores comments made by users on posts. Supports threaded replies via the `parent_id`.

## Columns

| Column Name | Type                     | Constraints                               | Default Value | Description                                      |
|-------------|--------------------------|-------------------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL                     | gen_random_uuid() | Unique identifier for the comment.               |
| post_id     | uuid                     | FOREIGN KEY (posts.id), NOT NULL          |               | ID of the post this comment belongs to.          |
| user_id     | uuid                     | FOREIGN KEY (users.id), NOT NULL          |               | ID of the user who created the comment.          |
| parent_id   | uuid                     | FOREIGN KEY (comments.id)                 |               | ID of the parent comment if this is a reply.     |
| content     | text                     | NOT NULL                                  |               | The text content of the comment.                 |
| created_at  | timestamp with time zone | NOT NULL                                  | now()         | Timestamp when the comment was created.          |
| updated_at  | timestamp with time zone | NOT NULL                                  | now()         | Timestamp when the comment was last updated.     |

## Indexes

- **comments_pkey**: PRIMARY KEY on `id`
- **comments_post_id_idx**: btree index on `post_id`
- **comments_parent_id_idx**: btree index on `parent_id`

## Foreign Key Constraints

- **comments_post_id_fkey**: `post_id` references `public.posts(id)`
- **comments_user_id_fkey**: `user_id` references `public.users(id)`
- **comments_parent_id_fkey**: `parent_id` references `public.comments(id)` (Self-referencing)

## Referenced By

- **comments.comments_parent_id_fkey**: `comments.parent_id` references `comments.id` (Self-referencing)
- **likes**: `content_id` references `comments.id` when `content_type` = 'comment' (Implicit via RLS/Application Logic)
- **reports**: `content_id` references `comments.id` when `content_type` = 'comment' (Implicit via RLS/Application Logic)

## Row Level Security (RLS) Policies

- **POLICY "Comments are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
  ```
- **POLICY "Users can create comments"**: Allows INSERT for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- **POLICY "Users can update own comments"**: Allows UPDATE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
  ```
- **POLICY "Users can delete own comments"**: Allows DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);
