# Table: conversations

## Description
Stores information about direct messages or group chat conversations.

## Columns

| Column Name | Type                     | Constraints                  | Default Value | Description                                      |
|-------------|--------------------------|------------------------------|---------------|--------------------------------------------------|
| id          | uuid                     | PRIMARY KEY, NOT NULL        | gen_random_uuid() | Unique identifier for the conversation.          |
| title       | text                     |                              |               | Title of the conversation (optional, mainly for groups). |
| is_group    | boolean                  | NOT NULL                     | false         | Flag indicating if this is a group conversation. |
| created_by  | uuid                     | FOREIGN KEY (users.id), NOT NULL |               | ID of the user who initiated the conversation.   |
| created_at  | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the conversation was created.     |
| updated_at  | timestamp with time zone | NOT NULL                     | now()         | Timestamp when the conversation was last updated (e.g., new message). |

## Indexes

- **conversations_pkey**: PRIMARY KEY on `id`

## Foreign Key Constraints

- **conversations_created_by_fkey**: `created_by` references `public.users(id)`

## Referenced By

- **conversation_participants.conversation_participants_conversation_id_fkey**: `conversation_participants.conversation_id` references `conversations.id`
- **messages.messages_conversation_id_fkey**: `messages.conversation_id` references `conversations.id`

## Row Level Security (RLS) Policies

- **POLICY "Users can see conversations they're in"**: Allows SELECT access for authenticated users who are participants in the conversation (checked via `conversation_participants` table).
  ```sql
  CREATE POLICY "Users can see conversations they're in" ON public.conversations FOR SELECT USING (EXISTS ( SELECT 1
     FROM public.conversation_participants
    WHERE ((conversation_participants.conversation_id = conversations.id) AND (conversation_participants.user_id = auth.uid()))));
  ```
- **POLICY "Users can create conversations"**: Allows INSERT for authenticated users where the `created_by` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
  ```
- **POLICY "Group creators can update conversations"**: Allows UPDATE for authenticated users who created the conversation, but only if it's a group conversation (`is_group` = true).
  ```sql
  CREATE POLICY "Group creators can update conversations" ON public.conversations FOR UPDATE USING ((is_group AND (auth.uid() = created_by)));
  ```
  *(Note: DELETE policy might be missing or restricted. Also, updating non-group conversations might be disallowed or handled differently).*
