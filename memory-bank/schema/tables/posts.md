# Table: posts

## Description
Stores user-generated posts, which can include text, location information, polls, and context links (e.g., to clubs or events).

## Columns

| Column Name    | Type                  | Constraints                                     | Default Value | Description                                                                 |
|----------------|-----------------------|-------------------------------------------------|---------------|-----------------------------------------------------------------------------|
| id             | uuid                  | PRIMARY KEY, NOT NULL                           | gen_random_uuid() | Unique identifier for the post.                                             |
| user_id        | uuid                  | FOREIGN KEY (users.id), NOT NULL                |               | ID of the user who created the post.                                        |
| content        | text                  |                                                 |               | Text content of the post.                                                   |
| location_name  | text                  |                                                 |               | User-defined name for the location associated with the post.                |
| location_lat   | double precision      |                                                 |               | Latitude of the location.                                                   |
| location_lng   | double precision      |                                                 |               | Longitude of the location.                                                  |
| is_poll        | boolean               | NOT NULL                                        | false         | Flag indicating if the post contains a poll.                                |
| context_type   | text                  | CHECK (context_type IN ('general', 'club', 'event', 'marketplace')) |               | Type of context the post belongs to (e.g., a specific club or event). |
| context_id     | uuid                  |                                                 |               | ID of the related context entity (e.g., club_id, event_id).               |
| created_at     | timestamp with time zone | NOT NULL                                        | now()         | Timestamp when the post was created.                                        |
| updated_at     | timestamp with time zone | NOT NULL                                        | now()         | Timestamp when the post was last updated.                                   |

## Indexes

- **posts_pkey**: PRIMARY KEY on `id`
- **posts_user_id_idx**: btree index on `user_id`
- **posts_context_idx**: btree index on `context_type`, `context_id`

## Foreign Key Constraints

- **posts_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

- **comments.comments_post_id_fkey**: `comments.post_id` references `posts.id`
- **media.media_post_id_fkey**: `media.post_id` references `posts.id`
- **poll_options.poll_options_post_id_fkey**: `poll_options.post_id` references `posts.id`
- **content_tags**: `content_id` references `posts.id` when `content_type` = 'post' (Implicit via RLS/Application Logic)
- **likes**: `content_id` references `posts.id` when `content_type` = 'post' (Implicit via RLS/Application Logic)
- **bookmarks**: `content_id` references `posts.id` when `content_type` = 'post' (Implicit via RLS/Application Logic)
- **reports**: `content_id` references `posts.id` when `content_type` = 'post' (Implicit via RLS/Application Logic)

## Row Level Security (RLS) Policies

- **POLICY "Posts are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
  ```
- **POLICY "Users can create posts"**: Allows INSERT for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
  ```
- **POLICY "Users can update own posts"**: Allows UPDATE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
  ```
- **POLICY "Users can delete own posts"**: Allows DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);
  ```

## Views

- **club_posts**: View selecting posts where `context_type` = 'club'.
- **event_posts**: View selecting posts where `context_type` = 'event'.
