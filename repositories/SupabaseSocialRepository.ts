import { PaginatedUsersResponse } from 'bikr-shared';
import { api } from '../services/api'; // Assuming api service is correctly set up
import { ISocialRepository } from './ISocialRepository';

/**
 * Supabase implementation for social interaction operations.
 */
export class SupabaseSocialRepository implements ISocialRepository {
  /**
   * Follows a user.
   * @param userId - The ID of the user to follow.
   * @returns A promise that resolves when the operation is complete.
   */
  async followUser(userId: string): Promise<void> {
    try {
      await api.post(`/users/${userId}/follow`);
    } catch (error) {
      console.error('Error following user:', error);
      // TODO: Implement more specific error handling based on API responses
      throw new Error('Failed to follow user.');
    }
  }

  /**
   * Unfollows a user.
   * @param userId - The ID of the user to unfollow.
   * @returns A promise that resolves when the operation is complete.
   */
  async unfollowUser(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}/follow`);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      // TODO: Implement more specific error handling based on API responses
      throw new Error('Failed to unfollow user.');
    }
  }

  /**
   * Retrieves a paginated list of users following a specific user.
   * @param userId - The ID of the user whose followers are to be fetched.
   * @param page - The page number to retrieve (optional, defaults to 1).
   * @param limit - The number of items per page (optional, defaults to server setting).
   * @returns A promise that resolves with the paginated list of followers.
   */
  async getFollowers(userId: string, page?: number, limit?: number): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await api.get<PaginatedUsersResponse>(`/users/${userId}/followers`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      // TODO: Implement more specific error handling based on API responses
      throw new Error('Failed to fetch followers.');
    }
  }

  /**
   * Retrieves a paginated list of users that a specific user is following.
   * @param userId - The ID of the user whose following list is to be fetched.
   * @param page - The page number to retrieve (optional, defaults to 1).
   * @param limit - The number of items per page (optional, defaults to server setting).
   * @returns A promise that resolves with the paginated list of users being followed.
   */
  async getFollowing(userId: string, page?: number, limit?: number): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await api.get<PaginatedUsersResponse>(`/users/${userId}/following`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching following list:', error);
      // TODO: Implement more specific error handling based on API responses
      throw new Error('Failed to fetch following list.');
    }
  }

  /**
   * Searches for users based on a query string.
   * @param query - The search term (e.g., username, full name).
   * @param page - The page number to retrieve (optional, defaults to 1).
   * @param limit - The number of items per page (optional, defaults to server setting).
   * @returns A promise that resolves with the paginated list of matching users.
   */
  async searchUsers(query: string, page?: number, limit?: number): Promise<PaginatedUsersResponse> {
    try {
      const params = new URLSearchParams();
      params.append('search', query); // Use 'search' as the query parameter based on server spec
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await api.get<PaginatedUsersResponse>('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      // TODO: Implement more specific error handling based on API responses
      throw new Error('Failed to search users.');
    }
  }
}
