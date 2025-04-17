# Table: api_keys

## Description
Stores API keys that might be issued to users or services for accessing specific parts of the API (potentially for future integrations or advanced features).

## Columns

| Column Name | Type                     | Constraints                  | Default Value | Description                                      |
|-------------|--------------------------|------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL        | gen_random_uuid() | Unique identifier for the API key record.        |
| user_id     | uuid                     | FOREIGN KEY (users.id), NOT NULL |               | ID of the user this API key belongs to.          |
| name        | text                     | NOT NULL                     |               | A user-defined name for the API key.             |
| key         | text                     | NOT NULL                     |               | The actual API key string (should be stored securely/hashed if sensitive). |
| permissions | jsonb                    | NOT NULL                     | '[]'::jsonb   | JSONB array defining the permissions granted to this key. |
| last_used   | timestamp with time zone |                              |               | Timestamp when the key was last used (optional). |
| created_at  | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the API key was created.          |
| expires_at  | timestamp with time zone |                              |               | Expiration timestamp for the key (optional).     |

## Indexes

- **api_keys_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

- **api_keys_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Users can manage own API keys"**: Allows SELECT, INSERT, UPDATE, DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can manage own API keys" ON public.api_keys USING (auth.uid() = user_id);
  ```
- **POLICY "Users can see own API keys"**: Allows SELECT access for authenticated users where the `user_id` matches the authenticated user's ID. *(Note: This seems redundant given the previous policy, but was present in the schema dump).*
  ```sql
  CREATE POLICY "Users can see own API keys" ON public.api_keys FOR SELECT USING (auth.uid() = user_id);
