# Table: conversation_participants

## Description
Links users to conversations and defines their role within that conversation (e.g., member, admin).

## Columns

| Column Name     | Type                     | Constraints                               | Default Value | Description                                      |
|-----------------|--------------------------|-------------------------------------------|---------------|--------------------------------------------------|
| id              | uuid                     | PRIMARY KEY, NOT NULL                     | gen_random_uuid() | Unique identifier for the participation record.  |
| conversation_id | uuid                     | FOREIGN KEY (conversations.id), NOT NULL  |               | ID of the conversation the user is part of.      |
| user_id         | uuid                     | FOREIGN KEY (users.id), NOT NULL          |               | ID of the participating user.                    |
| role            | text                     | NOT NULL, CHECK (role IN ('member', 'admin')) | 'member'      | Role of the user within the conversation.        |
| created_at      | timestamp with time zone | NOT NULL                                  | now()         | Timestamp when the user joined the conversation. |

## Indexes

- **conversation_participants_pkey**: PRIMARY KEY on `id`
- **conversation_participants_conversation_id_user_id_key**: UNIQUE index on `conversation_id`, `user_id` (Ensures a user is only listed once per conversation).
- **conversation_participants_conversation_id_idx**: btree index on `conversation_id`
- **conversation_participants_user_id_idx**: btree index on `user_id`

## Foreign Key Constraints

- **conversation_participants_conversation_id_fkey**: `conversation_id` references `public.conversations(id)`
- **conversation_participants_user_id_fkey**: `user_id` references `public.users(id)`

## Referenced By

*(This table is not directly referenced by other tables via foreign keys in the provided schema)*

## Row Level Security (RLS) Policies

- **POLICY "Users can see participants of their conversations"**: Allows SELECT access for authenticated users who are participants in the same conversation.
  ```sql
  CREATE POLICY "Users can see participants of their conversations" ON public.conversation_participants FOR SELECT USING (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
     FROM public.conversation_participants conversation_participants_1
    WHERE ((conversation_participants_1.conversation_id = conversation_participants.conversation_id) AND (conversation_participants_1.user_id = auth.uid()))))));
  ```
- **POLICY "Conversation creators can add participants"**: Allows INSERT for authenticated users who created the conversation (checked via `conversations` table).
  ```sql
  CREATE POLICY "Conversation creators can add participants" ON public.conversation_participants FOR INSERT WITH CHECK (EXISTS ( SELECT 1
     FROM public.conversations
    WHERE ((conversations.id = conversation_participants.conversation_id) AND (conversations.created_by = auth.uid()))));
  ```
- **POLICY "Admins can remove participants"**: Allows DELETE for authenticated users who are admins of the conversation.
  ```sql
  CREATE POLICY "Admins can remove participants" ON public.conversation_participants FOR DELETE USING (EXISTS ( SELECT 1
     FROM public.conversation_participants conversation_participants_1
    WHERE ((conversation_participants_1.conversation_id = conversation_participants.conversation_id) AND (conversation_participants_1.user_id = auth.uid()) AND (conversation_participants_1.role = 'admin'::text))));
  ```
- **POLICY "Users can leave conversations"**: Allows DELETE for authenticated users where the `user_id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can leave conversations" ON public.conversation_participants FOR DELETE USING (auth.uid() = user_id);
  ```
  *(Note: UPDATE policy might be missing or handled differently, e.g., only admins can change roles).*
