# Table: tags

Stores predefined or user-created tags used for categorizing content.

## Columns

| Column Name | Data Type                | Default Value | Nullable | Constraints                                                                                   | Description                                                                 |
|-------------|--------------------------|---------------|----------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `id`        | `uuid`                   | `gen_random_uuid()` | No       | Primary Key                                                                                   | Unique identifier for the tag.                                              |
| `name`      | `text`                   |               | No       | Unique (`tag_type`)                                                                           | The name of the tag (e.g., "Cruiser", "Touring", "Maintenance Tip").        |
| `tag_type`  | `text`                   | `'general'`   | No       | CHECK (`tag_type` IN ('bike_type', 'riding_style', 'skill', 'interest', 'general')), Unique (`name`) | The category or type of the tag, helping to group related tags.             |
| `created_at`| `timestamp with time zone` | `now()`       | Yes      |                                                                                               | Timestamp when the tag was created.                                         |

## Indexes

- `tags_pkey` (Primary Key) on `id`
- `tags_name_tag_type_key` (Unique Key) on `name`, `tag_type`

## Foreign Key Constraints

(None)

## Referenced By

- `content_tags` (`tag_id` references `tags(id)`)

## Row Level Security (RLS) Policies

- **Policy:** `Tags are viewable by everyone`
  - **Operation:** `SELECT`
  - **Applies To:** `all`
  - **Using Expression:** `true`
  - **Check Expression:** (none)

## Notes

- This table holds the master list of tags available in the system.
- Tags are associated with various content types (posts, clubs, events, etc.) via the `content_tags` join table.
- The `tag_type` allows for organizing tags into logical groups (e.g., filtering tags relevant only to bike types).
- The unique constraint on `(name, tag_type)` ensures that the same tag name cannot exist within the same type, but allows the same name across different types (e.g., "Beginner" skill vs. "Beginner" interest).
- RLS allows public viewing. Insertion/management might be restricted to admins or specific user roles depending on application requirements (no specific INSERT/UPDATE/DELETE policies are defined here, suggesting potential admin-only management or reliance on application logic).
