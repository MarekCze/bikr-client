# Table: content_tags

## Description
Associates tags with different types of content (posts, clubs, events, marketplace listings, routes).

## Columns

| Column Name  | Type                     | Constraints                                          | Default Value | Description                                      |
|--------------|--------------------------|------------------------------------------------------|---------------|--------------------------------------------------|
| id           | uuid                     | PRIMARY KEY, NOT NULL                                | gen_random_uuid() | Unique identifier for the tag association.       |
| tag_id       | uuid                     | FOREIGN KEY (tags.id), NOT NULL                      |               | ID of the tag being associated.                  |
| content_type | text                     | NOT NULL, CHECK (content_type IN ('post', 'club', 'event', 'marketplace', 'route')) |               | Type of content being tagged.                    |
| content_id   | uuid                     | NOT NULL                                             |               | ID of the specific content item being tagged.    |
| created_at   | timestamp with time zone | NOT NULL                                             | now()         | Timestamp when the tag association was created.  |

## Indexes

- **content_tags_pkey**: PRIMARY KEY on `id`
- **content_tags_tag_id_content_type_content_id_key**: UNIQUE index on `tag_id`, `content_type`, `content_id` (Ensures a tag is associated only once with a specific content item).
- **content_tags_content_idx**: btree index on `content_type`, `content_id`

## Foreign Key Constraints

- **content_tags_tag_id_fkey**: `tag_id` references `public.tags(id)`
- *(Note: `content_id` does not have a direct FK due to referencing multiple tables. Relationships are enforced by application logic and RLS.)*

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Content tags are viewable by everyone"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Content tags are viewable by everyone" ON public.content_tags FOR SELECT USING (true);
  ```
- **POLICY "Content owners can manage tags"**: Allows INSERT, UPDATE, DELETE for authenticated users if they own the associated content item (checked across multiple tables based on `content_type`).
  ```sql
  CREATE POLICY "Content owners can manage tags" ON public.content_tags USING (
  CASE content_type
      WHEN 'post'::text THEN (EXISTS ( SELECT 1
         FROM public.posts
        WHERE ((posts.id = content_tags.content_id) AND (posts.user_id = auth.uid()))))
      WHEN 'club'::text THEN (EXISTS ( SELECT 1
         FROM public.clubs
        WHERE ((clubs.id = content_tags.content_id) AND ((clubs.created_by = auth.uid()) OR (EXISTS ( SELECT 1
                 FROM public.club_members
                WHERE ((club_members.club_id = content_tags.content_id) AND (club_members.user_id = auth.uid()) AND (club_members.role = ANY (ARRAY['admin'::text, 'moderator'::text])))))))))
      WHEN 'event'::text THEN (EXISTS ( SELECT 1
         FROM public.events
        WHERE ((events.id = content_tags.content_id) AND (events.created_by = auth.uid()))))
      WHEN 'marketplace'::text THEN (EXISTS ( SELECT 1
         FROM public.marketplace_listings
        WHERE ((marketplace_listings.id = content_tags.content_id) AND (marketplace_listings.user_id = auth.uid()))))
      WHEN 'route'::text THEN (EXISTS ( SELECT 1
         FROM public.routes
        WHERE ((routes.id = content_tags.content_id) AND (routes.created_by = auth.uid()))))
      ELSE false
  END);
