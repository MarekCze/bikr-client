import { PaginatedUsersResponse } from 'bikr-shared';

/**
 * Interface for social interaction operations (following, searching users).
 */
export interface ISocialRepository {
  /**
   * Follows a user.
   * @param userId - The ID of the user to follow.
   * @returns A promise that resolves when the operation is complete.
   */
  followUser(userId: string): Promise<void>;

  /**
   * Unfollows a user.
   * @param userId - The ID of the user to unfollow.
   * @returns A promise that resolves when the operation is complete.
   */
  unfollowUser(userId: string): Promise<void>;

  /**
   * Retrieves a paginated list of users following a specific user.
   * @param userId - The ID of the user whose followers are to be fetched.
   * @param page - The page number to retrieve (optional, defaults to 1).
   * @param limit - The number of items per page (optional, defaults to server setting).
   * @returns A promise that resolves with the paginated list of followers.
   */
  getFollowers(userId: string, page?: number, limit?: number): Promise<PaginatedUsersResponse>;

  /**
   * Retrieves a paginated list of users that a specific user is following.
   * @param userId - The ID of the user whose following list is to be fetched.
   * @param page - The page number to retrieve (optional, defaults to 1).
   * @param limit - The number of items per page (optional, defaults to server setting).
   * @returns A promise that resolves with the paginated list of users being followed.
   */
  getFollowing(userId: string, page?: number, limit?: number): Promise<PaginatedUsersResponse>;

  /**
   * Searches for users based on a query string.
   * @param query - The search term (e.g., username, full name).
   * @param page - The page number to retrieve (optional, defaults to 1).
   * @param limit - The number of items per page (optional, defaults to server setting).
   * @returns A promise that resolves with the paginated list of matching users.
   */
  searchUsers(query: string, page?: number, limit?: number): Promise<PaginatedUsersResponse>;
}
