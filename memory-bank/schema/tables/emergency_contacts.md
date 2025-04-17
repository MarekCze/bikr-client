# Table: emergency_contacts

## Description
Stores emergency contact information provided by users for safety features.

## Columns

| Column Name     | Type                     | Constraints                  | Default Value | Description                                      |
|-----------------|--------------------------|------------------------------|---------------|--------------------------------------------------|
| id              | uuid                     | PRIMARY KEY, NOT NULL        | gen_random_uuid() | Unique identifier for the emergency contact.     |
| user_id         | uuid                     | FOREIGN KEY (users.id), NOT NULL |               | ID of the user this contact belongs to.          |
| name            | text                     | NOT NULL                     |               | Name of the emergency contact person.            |
| phone           | text                     | NOT NULL                     |               | Phone number of the emergency contact.           |
| relationship    | text                     |                              |               | Relationship of the contact to the user (e.g., Spouse, Parent). |
| is_primary      | boolean                  | NOT NULL                     | false         | Flag indicating if this is the primary emergency contact. |
| notify_on_crash | boolean                  | NOT NULL                     | true          | Flag indicating if this contact should be notified on crash detection. |
| notify_on_sos   | boolean                  | NOT NULL                     | true          | Flag indicating if this contact should be notified on SOS activation. |
| created_at      | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the contact was added.            |
| updated_at      | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the contact was last updated.     |

## Indexes

- **emergency_contacts_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

- **emergency_contacts_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Users can manage own emergency contacts"**: Allows SELECT, INSERT, UPDATE, DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can manage own emergency contacts" ON public.emergency_contacts USING (auth.uid() = user_id);
  ```
- **POLICY "Users can see own emergency contacts"**: Allows SELECT access for authenticated users where the `user_id` matches the authenticated user's ID. *(Note: This seems redundant given the previous policy, but was present in the schema dump).*
  ```sql
  CREATE POLICY "Users can see own emergency contacts" ON public.emergency_contacts FOR SELECT USING (auth.uid() = user_id);
