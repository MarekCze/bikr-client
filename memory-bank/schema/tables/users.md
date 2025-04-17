# Table: users

## Description
Stores application-specific user data, linked to the Supabase authentication user (`auth.users`).

## Columns

| Column Name  | Type                     | Constraints                               | Default Value | Description                                      |
|--------------|--------------------------|-------------------------------------------|---------------|--------------------------------------------------|
| id           | uuid                     | PRIMARY KEY, FOREIGN KEY (auth.users.id), NOT NULL |               | User ID, references `auth.users.id`.             |
| email        | text                     | UNIQUE, NOT NULL                          |               | User's email address.                            |
| created_at   | timestamp with time zone | NOT NULL                                  | now()         | Timestamp when the user record was created.      |
| updated_at   | timestamp with time zone | NOT NULL                                  | now()         | Timestamp when the user record was last updated. |
| last_sign_in | timestamp with time zone |                                           |               | Timestamp of the user's last sign-in.            |
| is_active    | boolean                  | NOT NULL                                  | true          | Flag indicating if the user account is active.   |
| is_admin     | boolean                  |                                           |               | Flag indicating if the user has admin privileges. |

## Indexes

- **users_pkey**: PRIMARY KEY on `id`
- **users_email_key**: UNIQUE index on `email`

## Foreign Key Constraints

- **users_id_fkey**: `id` references `auth.users(id)`

## Referenced By

- **api_keys.api_keys_user_id_fkey**: `api_keys.user_id` references `users.id`
- **bookmarks.bookmarks_user_id_fkey**: `bookmarks.user_id` references `users.id`
- **challenge_participants.challenge_participants_user_id_fkey**: `challenge_participants.user_id` references `users.id`
- **club_members.club_members_user_id_fkey**: `club_members.user_id` references `users.id`
- **clubs.clubs_created_by_fkey**: `clubs.created_by` references `users.id`
- **comments.comments_user_id_fkey**: `comments.user_id` references `users.id`
- **conversation_participants.conversation_participants_user_id_fkey**: `conversation_participants.user_id` references `users.id`
- **conversations.conversations_created_by_fkey**: `conversations.created_by` references `users.id`
- **emergency_contacts.emergency_contacts_user_id_fkey**: `emergency_contacts.user_id` references `users.id`
- **event_participants.event_participants_user_id_fkey**: `event_participants.user_id` references `users.id`
- **events.events_created_by_fkey**: `events.created_by` references `users.id`
- **follows.follows_follower_id_fkey**: `follows.follower_id` references `users.id`
- **follows.follows_following_id_fkey**: `follows.following_id` references `users.id`
- **group_ride_participants.group_ride_participants_user_id_fkey**: `group_ride_participants.user_id` references `users.id`
- **group_rides.group_rides_leader_id_fkey**: `group_rides.leader_id` references `users.id`
- **likes.likes_user_id_fkey**: `likes.user_id` references `users.id`
- **listing_offers.listing_offers_user_id_fkey**: `listing_offers.user_id` references `users.id`
- **locations.locations_user_id_fkey**: `locations.user_id` references `users.id`
- **maintenance_records.maintenance_records_user_id_fkey**: `maintenance_records.user_id` references `users.id`
- **marketplace_listings.marketplace_listings_user_id_fkey**: `marketplace_listings.user_id` references `users.id`
- **marketplace_transactions.marketplace_transactions_buyer_id_fkey**: `marketplace_transactions.buyer_id` references `users.id`
- **marketplace_transactions.marketplace_transactions_seller_id_fkey**: `marketplace_transactions.seller_id` references `users.id`
- **messages.messages_user_id_fkey**: `messages.user_id` references `users.id`
- **message_statuses.message_statuses_user_id_fkey**: `message_statuses.user_id` references `users.id`
- **motorcycles.motorcycles_user_id_fkey**: `motorcycles.user_id` references `users.id`
- **notifications.notifications_user_id_fkey**: `notifications.user_id` references `users.id`
- **poll_votes.poll_votes_user_id_fkey**: `poll_votes.user_id` references `users.id`
- **posts.posts_user_id_fkey**: `posts.user_id` references `users.id`
- **profiles.profiles_id_fkey**: `profiles.id` references `users.id`
- **reports.reports_reporter_id_fkey**: `reports.reporter_id` references `users.id`
- **rides.rides_user_id_fkey**: `rides.user_id` references `users.id`
- **route_bookmarks.route_bookmarks_user_id_fkey**: `route_bookmarks.user_id` references `users.id`
- **route_ratings.route_ratings_user_id_fkey**: `route_ratings.user_id` references `users.id`
- **routes.routes_created_by_fkey**: `routes.created_by` references `users.id`
- **safety_report_votes.safety_report_votes_user_id_fkey**: `safety_report_votes.user_id` references `users.id`
- **safety_reports.safety_reports_user_id_fkey**: `safety_reports.user_id` references `users.id`
- **service_reminders.service_reminders_user_id_fkey**: `service_reminders.user_id` references `users.id`
- **user_achievements.user_achievements_user_id_fkey**: `user_achievements.user_id` references `users.id`
- **user_notification_settings.user_notification_settings_user_id_fkey**: `user_notification_settings.user_id` references `users.id`

## Row Level Security (RLS) Policies

- **POLICY "Users can view other users"**: Allows SELECT access for all roles.
  ```sql
  CREATE POLICY "Users can view other users" ON public.users FOR SELECT USING (true);
  ```
- **POLICY "Users can update own record"**: Allows UPDATE for authenticated users where the `id` matches the authenticated user's ID.
  ```sql
  CREATE POLICY "Users can update own record" ON public.users FOR UPDATE USING (auth.uid() = id);
  ```
  *(Note: INSERT is handled by triggers/functions upon user creation in `auth.users`, not direct RLS policy on `public.users`)*
