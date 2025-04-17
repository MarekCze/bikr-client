# Product Context: bikR (MotoSocial App)

## Core Purpose
bikR aims to be the premier mobile-first social platform connecting motorcycle enthusiasts. It facilitates:
- Sharing experiences through rich media posts (text, images, videos, locations, polls).
- Discovering and joining motorcycle clubs and events.
- Engaging in community discussions via feeds and comments.
- Direct messaging between users.
- Finding and participating in group rides with route sharing.
- A dedicated marketplace for bikes, parts, gear, and services.
- Tracking personal riding stats, bike maintenance, and achievements.
- Promoting rider safety through shared information and tools.

## Key User Flows & Experience Goals

### Onboarding & Profile Setup
- Users should have a seamless onboarding experience, selecting interests and optionally adding their bikes to their virtual garage.
- Profile customization should allow users to express their identity within the community.

### Content Consumption & Engagement
- Feeds (Personalized, Popular, Local, Club, Event) should provide relevant and engaging content.
- Users should easily interact with posts via likes, comments (threaded, rich media), shares, and bookmarks.
- The `MediaCard` component is central to displaying diverse content types clearly and consistently.

### Community Interaction
- Joining and participating in Clubs should be intuitive, fostering smaller communities within the platform.
- Finding and RSVPing to Events (rides, meets, track days) should be straightforward.
- Real-time chat within Clubs and Events enhances engagement.

### Marketplace
- Browsing, listing, and transacting within the marketplace should be secure and user-friendly for both individual sellers and businesses.
- Filtering and search should help users find relevant items easily.

### Utility Features
- Ride tracking (optional) and maintenance logs provide practical value.
- Route discovery and sharing enhance the riding experience.
- Gamification (badges, achievements) encourages participation.

## High-Level User Journey
```mermaid
journey
    title bikR User Journey Map
    section Onboarding & Setup
      SignUp/In[Sign Up / Sign In (Email/OAuth)]
      Onboard[Complete Onboarding (Interests, Bike)]
      Profile[Customize Profile & Garage]
    section Engagement
      Feed[Browse Feeds (User, Popular, Local)]
      Interact[Like, Comment, Share Posts]
      Discover[Find Users, Clubs, Events]
    section Community
      JoinClub[Join a Club]
      ClubFeed[Participate in Club Feed/Chat]
      FindEvent[Find an Event]
      RSVP[RSVP & Participate in Event]
    section Utility & Marketplace
      TrackRide[Track a Ride (Optional)]
      LogMaint[Log Maintenance]
      BrowseMarket[Browse Marketplace]
      List/Buy[List or Buy Item]
```

## Technical Requirements Driving Product Experience
- **Cross-Platform:** Expo & Tamagui ensure a consistent experience on iOS and Android.
- **Real-time:** Supabase Realtime powers live chats, feed updates, and notifications.
- **Performance:** Optimized data loading (FlashList) and media handling are crucial for a smooth feed experience.
- **Offline:** Caching strategies are needed for viewing content and potentially tracking rides offline.
- **Location:** PostGIS and mapping integrations are key for local feeds, event locations, and route features.
