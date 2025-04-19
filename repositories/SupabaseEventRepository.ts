import { api } from '../services/api';
import { supabase } from '../services/supabase';
import {
  Event,
  EventType,
  EventParticipation,
  ParticipationStatus,
  Route,
  UUID,
  MotorcycleType,
  EventPrivacy
} from '@bikr/shared/src/types/event';
import {
  IEventRepository,
  EventFilters
} from '@bikr/shared/src/repositories/IEventRepository';
import { PaginatedResponse } from '@bikr/shared/src/types/api';

export class SupabaseEventRepository implements IEventRepository {
  // Event CRUD operations
  
  /**
   * Create a new event
   */
  async createEvent(eventData: Omit<Event, 'id' | 'participantCount' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    try {
      const { data } = await api.post<Event>('/events', {
        ...eventData,
        allowedMotorcycleTypes: eventData.allowedMotorcycleTypes || [MotorcycleType.ALL]
      });
      
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }
  
  /**
   * Get events with optional filters and pagination
   */
  async getEvents(filters?: EventFilters, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Event>> {
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters) {
        if (filters.type && filters.type.length > 0) {
          filters.type.forEach(type => params.append('type', type));
        }
        
        if (filters.startDate) {
          params.append('startDate', filters.startDate);
        }
        
        if (filters.endDate) {
          params.append('endDate', filters.endDate);
        }
        
        if (filters.location) {
          params.append('latitude', filters.location.latitude.toString());
          params.append('longitude', filters.location.longitude.toString());
          params.append('radius', filters.location.radius.toString());
        }
        
        if (filters.organizerId) {
          params.append('organizerId', filters.organizerId);
        }
        
        if (filters.clubId) {
          params.append('clubId', filters.clubId);
        }
        
        if (filters.searchTerm) {
          params.append('searchTerm', filters.searchTerm);
        }
        
        if (filters.motorcycleTypes && filters.motorcycleTypes.length > 0) {
          filters.motorcycleTypes.forEach(type => params.append('motorcycleType', type));
        }
        
        if (filters.privacy) {
          params.append('privacy', filters.privacy);
        }
      }
      
      const { data } = await api.get<PaginatedResponse<Event>>(`/events?${params.toString()}`);
      
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
  
  /**
   * Get a single event by ID
   */
  async getEventById(eventId: UUID): Promise<Event> {
    try {
      const { data } = await api.get<Event>(`/events/${eventId}`);
      
      return data;
    } catch (error) {
      console.error(`Error fetching event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an existing event
   */
  async updateEvent(eventId: UUID, updateData: Partial<Event>): Promise<Event> {
    try {
      const { data } = await api.put<Event>(`/events/${eventId}`, updateData);
      
      return data;
    } catch (error) {
      console.error(`Error updating event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete an event
   */
  async deleteEvent(eventId: UUID): Promise<void> {
    try {
      await api.delete(`/events/${eventId}`);
    } catch (error) {
      console.error(`Error deleting event ${eventId}:`, error);
      throw error;
    }
  }
  
  // Participation management
  
  /**
   * Join an event with optional status
   */
  async joinEvent(eventId: UUID, status: ParticipationStatus = ParticipationStatus.GOING): Promise<EventParticipation> {
    try {
      const { data } = await api.post<EventParticipation>(`/events/${eventId}/join`, { status });
      
      return data;
    } catch (error) {
      console.error(`Error joining event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Leave an event
   */
  async leaveEvent(eventId: UUID): Promise<void> {
    try {
      await api.post(`/events/${eventId}/leave`, {});
    } catch (error) {
      console.error(`Error leaving event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get participants for an event
   */
  async getEventParticipants(eventId: UUID, page: number = 1, limit: number = 10): Promise<PaginatedResponse<EventParticipation>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const { data } = await api.get<PaginatedResponse<EventParticipation>>(
        `/events/${eventId}/participants?${params.toString()}`
      );
      
      return data;
    } catch (error) {
      console.error(`Error fetching participants for event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update a participant's status
   */
  async updateParticipantStatus(eventId: UUID, userId: UUID, status: ParticipationStatus): Promise<EventParticipation> {
    try {
      const { data } = await api.put<EventParticipation>(
        `/events/${eventId}/participants/${userId}`,
        { status }
      );
      
      return data;
    } catch (error) {
      console.error(`Error updating participant status for user ${userId} in event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Remove a participant from an event
   */
  async removeParticipant(eventId: UUID, userId: UUID): Promise<void> {
    try {
      await api.delete(`/events/${eventId}/participants/${userId}`);
    } catch (error) {
      console.error(`Error removing participant ${userId} from event ${eventId}:`, error);
      throw error;
    }
  }
  
  // Event feed
  
  /**
   * Get posts associated with an event
   */
  async getEventFeed(eventId: UUID, page: number = 1, limit: number = 10): Promise<PaginatedResponse<any>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const { data } = await api.get<PaginatedResponse<any>>(
        `/events/${eventId}/feed?${params.toString()}`
      );
      
      return data;
    } catch (error) {
      console.error(`Error fetching feed for event ${eventId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a post associated with an event
   */
  async createEventPost(eventId: UUID, postData: any): Promise<any> {
    try {
      const { data } = await api.post<any>(`/events/${eventId}/posts`, postData);
      
      return data;
    } catch (error) {
      console.error(`Error creating post for event ${eventId}:`, error);
      throw error;
    }
  }
  
  // Routes for group rides
  
  /**
   * Create a new route for a group ride
   */
  async createRoute(routeData: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<Route> {
    try {
      const { data } = await api.post<Route>('/routes', routeData);
      
      return data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }
  
  /**
   * Get a route by ID
   */
  async getRouteById(routeId: UUID): Promise<Route> {
    try {
      const { data } = await api.get<Route>(`/routes/${routeId}`);
      
      return data;
    } catch (error) {
      console.error(`Error fetching route ${routeId}:`, error);
      throw error;
    }
  }
  
  /**
   * Update an existing route
   */
  async updateRoute(routeId: UUID, updateData: Partial<Route>): Promise<Route> {
    try {
      const { data } = await api.put<Route>(`/routes/${routeId}`, updateData);
      
      return data;
    } catch (error) {
      console.error(`Error updating route ${routeId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a route
   */
  async deleteRoute(routeId: UUID): Promise<void> {
    try {
      await api.delete(`/routes/${routeId}`);
    } catch (error) {
      console.error(`Error deleting route ${routeId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get routes created by a user
   */
  async getUserRoutes(userId: UUID, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Route>> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      const { data } = await api.get<PaginatedResponse<Route>>(
        `/users/${userId}/routes?${params.toString()}`
      );
      
      return data;
    } catch (error) {
      console.error(`Error fetching routes for user ${userId}:`, error);
      throw error;
    }
  }
}
