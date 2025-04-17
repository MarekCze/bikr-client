import { User, Bike } from 'bikr-shared'; // Use Bike type instead of Motorcycle

/**
 * Interface for managing user profile data on the client-side.
 * Interacts with the backend API to fetch and update user information.
 */
export interface IProfileRepository {
  /**
   * Fetches the user profile for a given user ID.
   * @param userId - The ID of the user whose profile to fetch.
   * @returns A promise that resolves with the user's profile data.
   */
  getProfile(userId: string): Promise<User | null>; // Use User type

  /**
   * Updates the current user's profile data.
   * @param profileData - Partial user data containing the fields to update.
   * @returns A promise that resolves with the updated user data.
   */
  updateProfile(profileData: Partial<User>): Promise<User | null>; // Use User type

  /**
   * Uploads a new avatar image for the current user.
   * @param file - The avatar image file (e.g., File object or URI string).
   * @returns A promise that resolves with the URL of the uploaded avatar.
   */
  uploadAvatar(file: any): Promise<string | null>; // Type 'any' for now, refine based on upload implementation

  /**
   * Fetches the list of bikes in the current user's garage.
   * @returns A promise that resolves with an array of bike data.
   */
  getGarage(): Promise<Bike[]>; // Use Bike type

  /**
   * Adds a new bike to the current user's garage.
   * @param bikeData - The data for the new bike.
   * @returns A promise that resolves with the newly added bike data.
   */
  addBike(bikeData: Omit<Bike, 'id' | 'owner_id'>): Promise<Bike | null>; // Use Bike type, assume owner_id exists or adjust Omit

  /**
   * Updates an existing bike in the current user's garage.
   * @param bikeData - The updated bike data, including its ID.
   * @returns A promise that resolves with the updated bike data.
   */
  updateBike(bikeData: Bike): Promise<Bike | null>; // Use Bike type

  /**
   * Deletes a bike from the current user's garage.
   * @param bikeId - The ID of the bike to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  deleteBike(bikeId: string): Promise<void>; // Parameter is just the ID
}
