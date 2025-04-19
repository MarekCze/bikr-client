import { 
  Club, 
  ClubMembership, 
  ClubRole, 
  ClubMembershipStatus,
  ClubPrivacy,
  CreateClubInput,
  UpdateClubInput,
  GetClubsQueryInput, 
  GetClubMembersQueryInput,
  PaginatedResponse,
  Post,
  IClubRepository
} from 'bikr-shared';
import { api } from '../services/api';

/**
 * Supabase implementation for club management operations.
 * Makes API calls to server endpoints for club-related functionality.
 */
export class SupabaseClubRepository implements IClubRepository {
  /**
   * Creates a new club and sets the creator as the owner.
   * @param userId - The ID of the user creating the club.
   * @param clubData - Data for the new club, validated against CreateClubSchema.
   * @returns The newly created Club object.
   */
  async createClub(userId: string, clubData: CreateClubInput): Promise<Club> {
    try {
      const response = await api.post<Club>('/clubs', clubData);
      return response.data;
    } catch (error) {
      console.error('Error creating club:', error);
      throw new Error('Failed to create club.');
    }
  }

  /**
   * Retrieves a single club by its ID.
   * @param clubId - The ID of the club to retrieve.
   * @returns The Club object or null if not found.
   */
  async getClubById(clubId: string): Promise<Club | null> {
    try {
      const response = await api.get<Club>(`/clubs/${clubId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching club:', error);
      return null;
    }
  }

  /**
   * Retrieves a list of clubs based on filtering and pagination criteria.
   * @param filters - Query parameters for filtering and pagination.
   * @returns A paginated response containing the list of Clubs.
   */
  async getClubs(filters: GetClubsQueryInput): Promise<PaginatedResponse<Club>> {
    try {
      const params = new URLSearchParams();
      
      // Add all filter parameters - using correct property names from schema
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.privacy) params.append('privacy', filters.privacy);

      const response = await api.get<PaginatedResponse<Club>>('/clubs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw new Error('Failed to fetch clubs.');
    }
  }

  /**
   * Updates an existing club's details.
   * @param clubId - The ID of the club to update.
   * @param updateData - Data to update, validated against UpdateClubSchema.
   * @returns The updated Club object.
   */
  async updateClub(clubId: string, updateData: UpdateClubInput): Promise<Club> {
    try {
      const response = await api.put<Club>(`/clubs/${clubId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating club:', error);
      throw new Error('Failed to update club.');
    }
  }

  /**
   * Deletes a club.
   * @param clubId - The ID of the club to delete.
   * @returns Boolean indicating success or failure.
   */
  async deleteClub(clubId: string): Promise<boolean> {
    try {
      await api.delete(`/clubs/${clubId}`);
      return true;
    } catch (error) {
      console.error('Error deleting club:', error);
      return false;
    }
  }

  /**
   * Adds a user membership to a club.
   * @param clubId - The ID of the club.
   * @param userId - The ID of the user to add.
   * @param role - The role to assign to the user.
   * @param status - The initial status of the membership.
   * @returns The newly created ClubMembership object.
   */
  async addMembership(
    clubId: string, 
    userId: string, 
    role: ClubRole, 
    status: ClubMembershipStatus
  ): Promise<ClubMembership> {
    try {
      const response = await api.post<ClubMembership>(
        `/clubs/${clubId}/members/${userId}`,
        { role, status }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding membership:', error);
      throw new Error('Failed to add club membership.');
    }
  }

  /**
   * Updates an existing club membership.
   * @param clubId - The ID of the club.
   * @param userId - The ID of the user whose membership is being updated.
   * @param data - The data to update (e.g., role or status).
   * @returns The updated ClubMembership object.
   */
  async updateMembership(
    clubId: string, 
    userId: string, 
    data: Partial<Pick<ClubMembership, 'role' | 'status'>>
  ): Promise<ClubMembership> {
    try {
      const response = await api.put<ClubMembership>(
        `/clubs/${clubId}/members/${userId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating membership:', error);
      throw new Error('Failed to update club membership.');
    }
  }

  /**
   * Removes a user's membership from a club.
   * @param clubId - The ID of the club.
   * @param userId - The ID of the user to remove.
   * @returns Boolean indicating success or failure.
   */
  async removeMembership(clubId: string, userId: string): Promise<boolean> {
    try {
      await api.delete(`/clubs/${clubId}/members/${userId}`);
      return true;
    } catch (error) {
      console.error('Error removing membership:', error);
      return false;
    }
  }

  /**
   * Retrieves a specific club membership record.
   * @param clubId - The ID of the club.
   * @param userId - The ID of the user.
   * @returns The ClubMembership object or null if not found.
   */
  async getMembership(clubId: string, userId: string): Promise<ClubMembership | null> {
    try {
      const response = await api.get<ClubMembership>(`/clubs/${clubId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching membership:', error);
      return null;
    }
  }

  /**
   * Retrieves a list of members for a specific club.
   * @param clubId - The ID of the club.
   * @param filters - Filters for pagination, role, status, search.
   * @returns A paginated response containing the list of ClubMemberships.
   */
  async getClubMembers(
    clubId: string, 
    filters: GetClubMembersQueryInput
  ): Promise<PaginatedResponse<ClubMembership>> {
    try {
      const params = new URLSearchParams();
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.role) params.append('role', filters.role);

      const response = await api.get<PaginatedResponse<ClubMembership>>(
        `/clubs/${clubId}/members`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching club members:', error);
      throw new Error('Failed to fetch club members.');
    }
  }

  /**
   * Retrieves the content feed specific to a club.
   * @param clubId - The ID of the club.
   * @param pagination - Pagination options.
   * @returns A paginated response containing the list of Posts.
   */
  async getClubFeed(
    clubId: string, 
    pagination: { limit?: number; offset?: number }
  ): Promise<PaginatedResponse<Post>> {
    try {
      const params = new URLSearchParams();
      if (pagination.limit) params.append('limit', pagination.limit.toString());
      if (pagination.offset) params.append('offset', pagination.offset.toString());

      const response = await api.get<PaginatedResponse<Post>>(
        `/clubs/${clubId}/feed`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching club feed:', error);
      throw new Error('Failed to fetch club feed.');
    }
  }

  // Convenience methods for client use - not in IClubRepository

  /**
   * Sends a request for the current user to join a club.
   * @param clubId - The ID of the club to join.
   * @returns The resulting ClubMembership object.
   */
  async joinClub(clubId: string): Promise<ClubMembership> {
    try {
      const response = await api.post<ClubMembership>(`/clubs/${clubId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining club:', error);
      throw new Error('Failed to join club.');
    }
  }

  /**
   * Removes the current user from a club.
   * @param clubId - The ID of the club to leave.
   * @returns Boolean indicating success or failure.
   */
  async leaveClub(clubId: string): Promise<boolean> {
    try {
      await api.post(`/clubs/${clubId}/leave`);
      return true;
    } catch (error) {
      console.error('Error leaving club:', error);
      return false;
    }
  }

  /**
   * Creates a post in a specific club.
   * @param clubId - The ID of the club.
   * @param postData - Data for the new post.
   * @returns The created Post object.
   */
  async createClubPost(clubId: string, postData: any): Promise<Post> {
    try {
      const response = await api.post<Post>(`/clubs/${clubId}/posts`, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating club post:', error);
      throw new Error('Failed to create club post.');
    }
  }
}
