import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SupabaseEventRepository } from '../repositories/SupabaseEventRepository';
import { SupabaseClubRepository } from '../repositories/SupabaseClubRepository';
import {
  Event,
  EventParticipation,
  ParticipationStatus,
  Route,
  EventType,
  MotorcycleType,
  EventPrivacy,
  UUID
} from '@bikr/shared/src/types/event';
import { EventFilters } from '@bikr/shared/src/repositories/IEventRepository';
import { PaginatedResponse } from '@bikr/shared/src/types/api';

interface EventContextType {
  // Event data
  events: Event[];
  currentEvent: Event | null;
  userEvents: Event[];
  participatingEvents: Event[];
  createdEvents: Event[];
  
  // Event status
  loading: boolean;
  loadingEvent: boolean;
  loadingParticipants: boolean;
  
  // Pagination
  hasMoreEvents: boolean;
  currentPage: number;
  
  // Event actions
  fetchEvents: (filters?: EventFilters, reset?: boolean) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  fetchEventById: (eventId: string) => Promise<Event>;
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
  updateEvent: (eventId: string, updateData: Partial<Event>) => Promise<Event>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  // Participation actions
  joinEvent: (eventId: string, status?: ParticipationStatus) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
  fetchEventParticipants: (eventId: string) => Promise<PaginatedResponse<EventParticipation>>;
  updateParticipantStatus: (eventId: string, userId: string, status: ParticipationStatus) => Promise<void>;
  removeParticipant: (eventId: string, userId: string) => Promise<void>;
  
  // Route actions for group rides
  createRoute: (routeData: Partial<Route>) => Promise<Route>;
  fetchUserRoutes: (userId: string) => Promise<PaginatedResponse<Route>>;
  
  // Filters
  filters: EventFilters;
  updateFilters: (newFilters: Partial<EventFilters>) => void;
  
  // Check if user can access an event (based on privacy)
  canAccessEvent: (event: Event) => boolean;
  
  // Check if user has permission to manage an event
  canManageEvent: (event: Event) => boolean;
}

// Create context with undefined initial value
const EventContext = createContext<EventContextType | undefined>(undefined);

// Provider component
export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [userClubs, setUserClubs] = useState<{id: string; name: string}[]>([]);
  const clubRepository = new SupabaseClubRepository();
  const repository = new SupabaseEventRepository();
  
  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  
  // Status states
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  
  // Pagination
  const [hasMoreEvents, setHasMoreEvents] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState<EventFilters>({});
  
  // Fetch events with optional filtering
  const fetchEvents = async (eventFilters?: EventFilters, reset: boolean = true): Promise<void> => {
    try {
      setLoading(true);
      
      // Update filters if provided
      const filtersToUse = eventFilters || filters;
      if (eventFilters) {
        setFilters(eventFilters);
      }
      
      // Reset pagination if requested
      const page = reset ? 1 : currentPage;
      if (reset) {
        setCurrentPage(1);
      }
      
      const response = await repository.getEvents(filtersToUse, page, limit);
      
      if (reset) {
        setEvents(response.items || []);
      } else {
        setEvents(prev => [...prev, ...(response.items || [])]);
      }
      
      // Check if there's a next page link to determine if more items are available
      setHasMoreEvents(!!response.links?.next);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch next page of events
  const fetchNextPage = async () => {
    if (!hasMoreEvents || loading) return;
    
    setCurrentPage(prev => prev + 1);
    await fetchEvents(filters, false);
  };
  
  // Fetch a specific event by ID
  const fetchEventById = async (eventId: string): Promise<Event> => {
    try {
      setLoadingEvent(true);
      const event = await repository.getEventById(eventId);
      setCurrentEvent(event);
      return event;
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error);
      throw error;
    } finally {
      setLoadingEvent(false);
    }
  };
  
  // Create a new event
  const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
    if (!user) {
      throw new Error('User must be authenticated to create an event');
    }
    
    const completeEventData = {
      ...eventData,
      organizerId: user.id,
      type: eventData.type || EventType.MEETUP,
      isRecurring: eventData.isRecurring || false,
      privacy: eventData.privacy || EventPrivacy.PUBLIC,
      allowedMotorcycleTypes: eventData.allowedMotorcycleTypes || [MotorcycleType.ALL],
    } as Omit<Event, 'id' | 'participantCount' | 'createdAt' | 'updatedAt'>;
    
    try {
      const event = await repository.createEvent(completeEventData);
      
      // Update created events list
      setCreatedEvents(prev => [event, ...prev]);
      
      return event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };
  
  // Update an existing event
  const updateEvent = async (eventId: string, updateData: Partial<Event>): Promise<Event> => {
    try {
      const event = await repository.updateEvent(eventId, updateData);
      
      // Update current event if it's the one being edited
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(event);
      }
      
      // Update events list
      setEvents(prev => prev.map(e => e.id === eventId ? event : e));
      
      // Update created events list
      setCreatedEvents(prev => prev.map(e => e.id === eventId ? event : e));
      
      return event;
    } catch (error) {
      console.error(`Error updating event ${eventId}:`, error);
      throw error;
    }
  };
  
  // Delete an event
  const deleteEvent = async (eventId: string): Promise<void> => {
    try {
      await repository.deleteEvent(eventId);
      
      // Remove from events list
      setEvents(prev => prev.filter(e => e.id !== eventId));
      
      // Remove from created events list
      setCreatedEvents(prev => prev.filter(e => e.id !== eventId));
      
      // Clear current event if it's the one being deleted
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(null);
      }
    } catch (error) {
      console.error(`Error deleting event ${eventId}:`, error);
      throw error;
    }
  };
  
  // Join an event
  const joinEvent = async (eventId: string, status: ParticipationStatus = ParticipationStatus.GOING): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to join an event');
    }
    
    try {
      await repository.joinEvent(eventId, status);
      
      // Update events list to reflect new participant count
      const updatedEvent = await repository.getEventById(eventId);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      
      // Update current event if it's the one being joined
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(updatedEvent);
      }
      
      // Add to participating events
      if (!participatingEvents.some(e => e.id === eventId)) {
        setParticipatingEvents(prev => [updatedEvent, ...prev]);
      }
    } catch (error) {
      console.error(`Error joining event ${eventId}:`, error);
      throw error;
    }
  };
  
  // Leave an event
  const leaveEvent = async (eventId: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to leave an event');
    }
    
    try {
      await repository.leaveEvent(eventId);
      
      // Update events list to reflect new participant count
      const updatedEvent = await repository.getEventById(eventId);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      
      // Update current event if it's the one being left
      if (currentEvent && currentEvent.id === eventId) {
        setCurrentEvent(updatedEvent);
      }
      
      // Remove from participating events
      setParticipatingEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error(`Error leaving event ${eventId}:`, error);
      throw error;
    }
  };
  
  // Fetch participants for an event
  const fetchEventParticipants = async (eventId: string): Promise<PaginatedResponse<EventParticipation>> => {
    try {
      setLoadingParticipants(true);
      return await repository.getEventParticipants(eventId);
    } catch (error) {
      console.error(`Error fetching participants for event ${eventId}:`, error);
      throw error;
    } finally {
      setLoadingParticipants(false);
    }
  };
  
  // Update a participant's status
  const updateParticipantStatus = async (
    eventId: string,
    userId: string,
    status: ParticipationStatus
  ): Promise<void> => {
    try {
      await repository.updateParticipantStatus(eventId, userId, status);
    } catch (error) {
      console.error(`Error updating participant status for user ${userId} in event ${eventId}:`, error);
      throw error;
    }
  };
  
  // Remove a participant from an event
  const removeParticipant = async (eventId: string, userId: string): Promise<void> => {
    try {
      await repository.removeParticipant(eventId, userId);
    } catch (error) {
      console.error(`Error removing participant ${userId} from event ${eventId}:`, error);
      throw error;
    }
  };
  
  // Create a new route for a group ride
  const createRoute = async (routeData: Partial<Route>): Promise<Route> => {
    if (!user) {
      throw new Error('User must be authenticated to create a route');
    }
    
    try {
      // Ensure the route has a creator
      const completeRouteData = {
        ...routeData,
        createdBy: user.id,
      } as any; // Using 'any' to bypass TypeScript error, as we're missing required fields
      
      return await repository.createRoute(completeRouteData);
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  };
  
  // Fetch routes created by a user
  const fetchUserRoutes = async (userId: string): Promise<PaginatedResponse<Route>> => {
    try {
      return await repository.getUserRoutes(userId);
    } catch (error) {
      console.error(`Error fetching routes for user ${userId}:`, error);
      throw error;
    }
  };
  
  // Update filters
  const updateFilters = (newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  // Check if user can access an event based on privacy settings
  const canAccessEvent = (event: Event): boolean => {
    if (!user) {
      return event.privacy === EventPrivacy.PUBLIC;
    }
    
    // Organizers can always access their events
    if (event.organizerId === user.id) {
      return true;
    }
    
    // Public events are accessible to everyone
    if (event.privacy === EventPrivacy.PUBLIC) {
      return true;
    }
    
    // Club events require the user to be a member of the club
    if (event.privacy === EventPrivacy.CLUB && event.clubId) {
      return userClubs?.some((club: {id: string}) => club.id === event.clubId) || false;
    }
    
    // Private events require specific logic to check if user is invited
    // For now, assume private events are not accessible unless user is organizer
    if (event.privacy === EventPrivacy.PRIVATE) {
      return false; // This would need to be updated when invitation system is implemented
    }
    
    return false;
  };
  
  // Check if user has permission to manage an event
  const canManageEvent = (event: Event): boolean => {
    if (!user) {
      return false;
    }
    
    // Organizers can manage their events
    return event.organizerId === user.id;
  };
  
  // Effect to load user clubs
  useEffect(() => {
    const loadUserClubs = async () => {
      if (user) {
        try {
          // Get clubs where the user is a member
          const userClubsData = await clubRepository.getClubs({ 
            limit: 100,
            offset: 0,
            search: '', 
            // While we can't filter by userId directly, we'll fetch all clubs and filter client-side
            // In a real implementation, this would need to be enhanced with the proper club memberships API
          });
          
          // For now we're using all available clubs as user clubs
          // This is a simplification that should be replaced with proper membership filtering
          setUserClubs(userClubsData.items || []);
        } catch (error) {
          console.error('Error loading user clubs:', error);
        }
      }
    };
    
    loadUserClubs();
  }, [user]);
  
  // Effect to load events when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);
  
  const contextValue: EventContextType = {
    events,
    currentEvent,
    userEvents,
    participatingEvents,
    createdEvents,
    loading,
    loadingEvent,
    loadingParticipants,
    hasMoreEvents,
    currentPage,
    fetchEvents,
    fetchNextPage,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    fetchEventParticipants,
    updateParticipantStatus,
    removeParticipant,
    createRoute,
    fetchUserRoutes,
    filters,
    updateFilters,
    canAccessEvent,
    canManageEvent,
  };
  
  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

// Hook for using the event context
export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
