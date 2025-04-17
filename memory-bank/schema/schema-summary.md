# Database Schema Summary

This file provides a lightweight overview of the database tables and their columns. For detailed constraints, indexes, and policies, refer to the full SQL schema files (`schema_tables.sql`, `schema_grants_part1.sql`, `schema_grants_part2.sql`).

## Table: achievements
- **id** (uuid, PK)
- title (text)
- description (text)
- achievement_type (text)
- badge_url (text)
- points (integer)
- is_active (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: api_keys
- **id** (uuid, PK)
- user_id (uuid, FK)
- name (text)
- key (text)
- permissions (jsonb)
- last_used (timestamp with time zone)
- created_at (timestamp with time zone)
- expires_at (timestamp with time zone)

## Table: bookmarks
- **id** (uuid, PK)
- user_id (uuid, FK)
- content_type (text)
- content_id (uuid) - *Refers to posts or marketplace_listings*
- created_at (timestamp with time zone)

## Table: challenge_participants
- **id** (uuid, PK)
- challenge_id (uuid, FK)
- user_id (uuid, FK)
- current_progress (integer)
- status (text)
- joined_at (timestamp with time zone)
- completed_at (timestamp with time zone)

## Table: challenges
- **id** (uuid, PK)
- title (text)
- description (text)
- challenge_type (text)
- objective_value (integer)
- start_date (timestamp with time zone)
- end_date (timestamp with time zone)
- badge_url (text)
- points (integer)
- is_active (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: club_members
- **id** (uuid, PK)
- club_id (uuid, FK)
- user_id (uuid, FK)
- role (text)
- joined_at (timestamp with time zone)

## Table: clubs
- **id** (uuid, PK)
- name (text)
- description (text)
- logo_url (text)
- cover_url (text)
- location (text)
- location_lat (double precision)
- location_lng (double precision)
- is_private (boolean)
- created_by (uuid, FK -> users)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: comments
- **id** (uuid, PK)
- post_id (uuid, FK)
- user_id (uuid, FK)
- parent_id (uuid, FK -> comments) - *Self-referencing for threads*
- content (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: content_tags
- **id** (uuid, PK)
- tag_id (uuid, FK)
- content_type (text)
- content_id (uuid) - *Refers to posts, clubs, events, marketplace_listings, routes*
- created_at (timestamp with time zone)

## Table: conversation_participants
- **id** (uuid, PK)
- conversation_id (uuid, FK)
- user_id (uuid, FK)
- role (text)
- created_at (timestamp with time zone)

## Table: conversations
- **id** (uuid, PK)
- title (text)
- is_group (boolean)
- created_by (uuid, FK -> users)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: emergency_contacts
- **id** (uuid, PK)
- user_id (uuid, FK)
- name (text)
- phone (text)
- relationship (text)
- is_primary (boolean)
- notify_on_crash (boolean)
- notify_on_sos (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: event_participants
- **id** (uuid, PK)
- event_id (uuid, FK)
- user_id (uuid, FK)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: events
- **id** (uuid, PK)
- title (text)
- description (text)
- event_type (text)
- start_time (timestamp with time zone)
- end_time (timestamp with time zone)
- location (text)
- location_lat (double precision)
- location_lng (double precision)
- cover_url (text)
- max_participants (integer)
- is_private (boolean)
- club_id (uuid, FK)
- created_by (uuid, FK -> users)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: follows
- **id** (uuid, PK)
- follower_id (uuid, FK -> users)
- following_id (uuid, FK -> users)
- created_at (timestamp with time zone)

## Table: group_ride_participants
- **id** (uuid, PK)
- group_ride_id (uuid, FK)
- user_id (uuid, FK)
- ride_id (uuid, FK)
- role (text)
- status (text)
- joined_at (timestamp with time zone)
- left_at (timestamp with time zone)

## Table: group_rides
- **id** (uuid, PK)
- event_id (uuid, FK)
- route_id (uuid, FK)
- leader_id (uuid, FK -> users)
- status (text)
- start_time (timestamp with time zone)
- end_time (timestamp with time zone)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: likes
- **id** (uuid, PK)
- user_id (uuid, FK)
- content_type (text)
- content_id (uuid) - *Refers to posts or comments*
- reaction_type (text)
- created_at (timestamp with time zone)

## Table: listing_media
- **id** (uuid, PK)
- listing_id (uuid, FK -> marketplace_listings)
- media_url (text)
- is_primary (boolean)
- position (integer)
- created_at (timestamp with time zone)

## Table: listing_offers
- **id** (uuid, PK)
- listing_id (uuid, FK -> marketplace_listings)
- user_id (uuid, FK)
- amount (numeric)
- message (text)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: locations
- **id** (uuid, PK)
- user_id (uuid, FK)
- name (text)
- address (text)
- lat (double precision)
- lng (double precision)
- is_public (boolean)
- location_type (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: maintenance_parts
- **id** (uuid, PK)
- maintenance_record_id (uuid, FK)
- part_name (text)
- part_number (text)
- quantity (integer)
- cost (numeric)
- created_at (timestamp with time zone)

## Table: maintenance_records
- **id** (uuid, PK)
- motorcycle_id (uuid, FK)
- user_id (uuid, FK)
- record_type (text)
- title (text)
- description (text)
- date (date)
- odometer (integer)
- cost (numeric)
- location (text)
- performed_by (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: marketplace_listings
- **id** (uuid, PK)
- user_id (uuid, FK)
- title (text)
- description (text)
- category (text)
- price (numeric)
- currency (text)
- condition (text)
- location (text)
- location_lat (double precision)
- location_lng (double precision)
- is_negotiable (boolean)
- delivery_type (text)
- shipping_cost (numeric)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: marketplace_transactions
- **id** (uuid, PK)
- listing_id (uuid, FK -> marketplace_listings)
- offer_id (uuid, FK -> listing_offers)
- seller_id (uuid, FK -> users)
- buyer_id (uuid, FK -> users)
- amount (numeric)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: media
- **id** (uuid, PK)
- post_id (uuid, FK)
- media_type (text)
- media_url (text)
- thumbnail_url (text)
- width (integer)
- height (integer)
- duration (integer)
- position (integer)
- created_at (timestamp with time zone)

## Table: message_statuses
- **id** (uuid, PK)
- message_id (uuid, FK)
- user_id (uuid, FK)
- is_read (boolean)
- read_at (timestamp with time zone)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: messages
- **id** (uuid, PK)
- conversation_id (uuid, FK)
- user_id (uuid, FK)
- message_type (text)
- content (text)
- media_url (text)
- location_lat (double precision)
- location_lng (double precision)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: motorcycles
- **id** (uuid, PK)
- user_id (uuid, FK)
- make (text)
- model (text)
- year (integer)
- color (text)
- nickname (text)
- image_url (text)
- is_primary (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: notifications
- **id** (uuid, PK)
- user_id (uuid, FK)
- type (text)
- related_id (uuid) - *Refers to various content types based on notification type*
- title (text)
- body (text)
- image_url (text)
- action_url (text)
- is_read (boolean)
- created_at (timestamp with time zone)

## Table: poll_options
- **id** (uuid, PK)
- post_id (uuid, FK)
- option_text (text)
- position (integer)
- created_at (timestamp with time zone)

## Table: poll_votes
- **id** (uuid, PK)
- poll_option_id (uuid, FK)
- user_id (uuid, FK)
- created_at (timestamp with time zone)

## Table: posts
- **id** (uuid, PK)
- user_id (uuid, FK)
- content (text)
- location_name (text)
- location_lat (double precision)
- location_lng (double precision)
- is_poll (boolean)
- context_type (text)
- context_id (uuid) - *Refers to clubs, events, marketplace_listings based on context_type*
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: profiles
- **id** (uuid, PK, FK -> users)
- username (text)
- display_name (text)
- bio (text)
- avatar_url (text)
- website (text)
- location (text)
- experience_level (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: reports
- **id** (uuid, PK)
- reporter_id (uuid, FK -> users)
- content_type (text)
- content_id (uuid) - *Refers to various content types based on report type*
- reason (text)
- description (text)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: ride_tracking_points
- **id** (uuid, PK)
- ride_id (uuid, FK)
- lat (double precision)
- lng (double precision)
- altitude (double precision)
- speed (double precision)
- timestamp (timestamp with time zone)
- battery_level (integer)
- created_at (timestamp with time zone)

## Table: rider_interests
- **id** (uuid, PK)
- profile_id (uuid, FK)
- interest (text)
- created_at (timestamp with time zone)

## Table: rider_skills
- **id** (uuid, PK)
- profile_id (uuid, FK)
- skill_name (text)
- skill_level (integer)
- created_at (timestamp with time zone)

## Table: rides
- **id** (uuid, PK)
- user_id (uuid, FK)
- motorcycle_id (uuid, FK)
- route_id (uuid, FK)
- event_id (uuid, FK)
- title (text)
- start_time (timestamp with time zone)
- end_time (timestamp with time zone)
- distance (double precision)
- duration (integer)
- average_speed (double precision)
- max_speed (double precision)
- start_location (text)
- end_location (text)
- status (text)
- privacy_level (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: route_bookmarks
- **id** (uuid, PK)
- route_id (uuid, FK)
- user_id (uuid, FK)
- created_at (timestamp with time zone)

## Table: route_ratings
- **id** (uuid, PK)
- route_id (uuid, FK)
- user_id (uuid, FK)
- rating (integer)
- review (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: route_waypoints
- **id** (uuid, PK)
- route_id (uuid, FK)
- lat (double precision)
- lng (double precision)
- altitude (double precision)
- order_position (integer)
- waypoint_type (text)
- name (text)
- description (text)
- created_at (timestamp with time zone)

## Table: routes
- **id** (uuid, PK)
- name (text)
- description (text)
- distance (double precision)
- duration (integer)
- difficulty (text)
- is_loop (boolean)
- created_by (uuid, FK -> users)
- event_id (uuid, FK)
- is_public (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: safety_report_votes
- **id** (uuid, PK)
- safety_report_id (uuid, FK)
- user_id (uuid, FK)
- vote_type (text)
- created_at (timestamp with time zone)

## Table: safety_reports
- **id** (uuid, PK)
- user_id (uuid, FK)
- report_type (text)
- description (text)
- location_lat (double precision)
- location_lng (double precision)
- location_name (text)
- severity (text)
- is_verified (boolean)
- expires_at (timestamp with time zone)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: service_reminders
- **id** (uuid, PK)
- motorcycle_id (uuid, FK)
- user_id (uuid, FK)
- title (text)
- description (text)
- due_date (date)
- due_mileage (integer)
- is_recurring (boolean)
- recurrence_interval (text)
- recurrence_value (integer)
- recurrence_mileage (integer)
- status (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: tags
- **id** (uuid, PK)
- name (text)
- tag_type (text)
- created_at (timestamp with time zone)

## Table: user_achievements
- **id** (uuid, PK)
- user_id (uuid, FK)
- achievement_id (uuid, FK)
- earned_at (timestamp with time zone)
- earned_value (integer)

## Table: user_notification_settings
- **id** (uuid, PK)
- user_id (uuid, FK)
- category (text)
- email (boolean)
- push (boolean)
- in_app (boolean)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)

## Table: users
- **id** (uuid, PK, FK -> auth.users)
- email (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)
- last_sign_in (timestamp with time zone)
- is_active (boolean)
- is_admin (boolean)
