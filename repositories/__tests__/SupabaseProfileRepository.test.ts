import { SupabaseProfileRepository } from '../SupabaseProfileRepository';
import { supabase } from '../../services/supabase'; // Adjust path as needed
import { User, Bike } from 'bikr-shared'; // Assuming types are correctly resolved now

// Define mocks for the chained methods returned by from()
const mockSupabaseQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  update: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  // Add other chained methods used by the repository if needed
};

// Mock the supabase client
jest.mock('../../services/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockSupabaseQueryBuilder), // from() returns the query builder mock
    auth: {
      getUser: jest.fn(),
    },
    // Mock storage separately if needed, assuming similar chaining
    storage: {
      from: jest.fn().mockReturnThis(), // Adjust if storage has different chaining
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    },
  },
}));

// Helper to reset mocks between tests
const resetMocks = () => {
  // Reset the main 'from' mock
  (supabase.from as jest.Mock).mockClear();
  // Reset mocks on the query builder object
  mockSupabaseQueryBuilder.select.mockClear().mockReturnThis();
  mockSupabaseQueryBuilder.eq.mockClear().mockReturnThis();
  mockSupabaseQueryBuilder.single.mockClear();
  mockSupabaseQueryBuilder.update.mockClear().mockReturnThis();
  mockSupabaseQueryBuilder.insert.mockClear().mockReturnThis();
  mockSupabaseQueryBuilder.delete.mockClear().mockReturnThis();
  // Reset auth mock
  (supabase.auth.getUser as jest.Mock).mockClear();
  // Reset storage mocks if used and necessary
};

describe('SupabaseProfileRepository', () => {
  let repository: SupabaseProfileRepository;

  beforeEach(() => {
    resetMocks();
    repository = new SupabaseProfileRepository();
  });

  // --- getProfile Tests ---
  describe('getProfile', () => {
    const mockUserId = 'test-user-id';
    const mockProfile: User = {
      id: mockUserId,
      email: 'test@example.com',
      username: 'tester',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('should fetch and return a user profile successfully', async () => {
      // Correct: Mock the 'single' method on the query builder mock
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({ data: mockProfile, error: null });

      const profile = await repository.getProfile(mockUserId);

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockUserId);
      expect(mockSupabaseQueryBuilder.single).toHaveBeenCalledTimes(1);
      expect(profile).toEqual(mockProfile);
    });

    it('should return null if profile not found (PGRST116 error)', async () => {
      const notFoundError = { code: 'PGRST116', message: 'Resource not found' };
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({ data: null, error: notFoundError });

      const profile = await repository.getProfile(mockUserId);

      expect(profile).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockUserId);
    });

    it('should throw an error if Supabase fetch fails with other error', async () => {
      const genericError = new Error('Supabase fetch failed');
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({ data: null, error: genericError });

      await expect(repository.getProfile(mockUserId)).rejects.toThrow(genericError);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockUserId);
    });
  });

  // --- updateProfile Tests ---
  describe('updateProfile', () => {
    const mockUserId = 'current-user-id';
    const mockUpdateData: Partial<User> = { username: 'updated-tester' };
    const mockUpdatedProfile: User = {
      id: mockUserId,
      email: 'current@example.com',
      username: 'updated-tester',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    beforeEach(() => {
      // Mock successful auth user retrieval
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });
    });

    it('should update and return the user profile successfully', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({ data: mockUpdatedProfile, error: null });

      const profile = await repository.updateProfile(mockUpdateData);

      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseQueryBuilder.update).toHaveBeenCalledWith(mockUpdateData); // Ensure id is not passed
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockUserId);
      expect(mockSupabaseQueryBuilder.select).toHaveBeenCalledTimes(1); // Called on the result of update()
      expect(mockSupabaseQueryBuilder.single).toHaveBeenCalledTimes(1); // Called on the result of select()
      expect(profile).toEqual(mockUpdatedProfile);
    });

     it('should update profile even if input contains id', async () => {
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({ data: mockUpdatedProfile, error: null });
      const updateDataWithId = { ...mockUpdateData, id: 'some-other-id' }; // Include id

      await repository.updateProfile(updateDataWithId);

      expect(mockSupabaseQueryBuilder.update).toHaveBeenCalledWith(mockUpdateData); // id should be stripped
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockUserId);
    });

    it('should throw an error if Supabase update fails', async () => {
      const updateError = new Error('Supabase update failed');
      mockSupabaseQueryBuilder.single.mockResolvedValueOnce({ data: null, error: updateError });

      await expect(repository.updateProfile(mockUpdateData)).rejects.toThrow(updateError);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseQueryBuilder.update).toHaveBeenCalledWith(mockUpdateData);
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockUserId);
    });

    it('should throw an error if user is not authenticated', async () => {
      const authError = new Error('User not authenticated');
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null }, error: authError });

      await expect(repository.updateProfile(mockUpdateData)).rejects.toThrow(authError);
      expect(supabase.from).not.toHaveBeenCalled(); // Should not proceed to DB call
    });
  });

  // --- uploadAvatar Tests ---
  describe('uploadAvatar', () => {
    const mockUserId = 'avatar-user-id';
    const mockFileUri = 'file:///path/to/image.jpg';
    const mockPublicUrl = 'https://supabase.url/storage/v1/object/public/avatars/public/avatars/avatar-user-id-12345.jpg';
    const mockStorageError = new Error('Storage upload failed');
    const mockUpdateError = new Error('Profile update failed');

    // Declare the specific mock builder for profile updates in this scope
    let profileUpdateBuilderMock: {
        update: jest.Mock;
        eq: jest.Mock;
    };

    beforeEach(() => {
       // Initialize the mock builder for profile updates
       profileUpdateBuilderMock = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }), // Mock successful result by default
      };

      // Mock successful auth user retrieval by default
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUserId } },
        error: null,
      });
      // Mock successful storage upload by default
      (supabase.storage.from('avatars').upload as jest.Mock).mockResolvedValue({ error: null });
      // Mock successful public URL retrieval by default
      (supabase.storage.from('avatars').getPublicUrl as jest.Mock).mockReturnValue({ data: { publicUrl: mockPublicUrl } });
       // Mock successful profile update by default (chained mock)
      mockSupabaseQueryBuilder.update.mockReturnThis(); // update() returns builder
      mockSupabaseQueryBuilder.eq.mockReturnThis(); // eq() returns builder
      // Note: update doesn't return data directly, so no single() mock needed here unless we select()
      // Configure the main 'from' mock to return the specific builder for 'profiles' table
      (supabase.from as jest.Mock).mockImplementation((tableName) => {
        if (tableName === 'profiles') {
          return profileUpdateBuilderMock;
        }
        return mockSupabaseQueryBuilder; // Default for other tables
      });

       // Also reset the profileUpdateBuilderMock's methods
       profileUpdateBuilderMock.update.mockClear().mockReturnThis();
       profileUpdateBuilderMock.eq.mockClear().mockResolvedValue({ error: null });
    });


    it('should upload avatar, update profile, and return public URL successfully', async () => {
      const result = await repository.uploadAvatar(mockFileUri);

      expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(supabase.storage.from('avatars').upload).toHaveBeenCalledWith(expect.stringContaining(`public/avatars/${mockUserId}-`), mockFileUri, expect.any(Object));
      expect(supabase.storage.from('avatars').getPublicUrl).toHaveBeenCalledWith(expect.stringContaining(`public/avatars/${mockUserId}-`));
      expect(supabase.from).toHaveBeenCalledWith('profiles'); // Check if profile update was attempted
      // Check specific mocks for profile update chain (using the dedicated mock object)
      expect(profileUpdateBuilderMock.update).toHaveBeenCalledWith({ avatar_url: mockPublicUrl });
      expect(profileUpdateBuilderMock.eq).toHaveBeenCalledWith('id', mockUserId);
      expect(result).toBe(mockPublicUrl);
    });

    it('should return null if user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null }, error: new Error('Not authenticated') });
      const result = await repository.uploadAvatar(mockFileUri);
      expect(result).toBeNull();
      expect(supabase.storage.from).not.toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalledWith('profiles');
    });

     it('should return null if storage upload fails', async () => {
      (supabase.storage.from('avatars').upload as jest.Mock).mockResolvedValue({ error: mockStorageError });
      const result = await repository.uploadAvatar(mockFileUri);
      expect(result).toBeNull();
      expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(supabase.storage.from('avatars').upload).toHaveBeenCalled();
      expect(supabase.storage.from('avatars').getPublicUrl).not.toHaveBeenCalled(); // Shouldn't get URL if upload failed
      expect(supabase.from).not.toHaveBeenCalledWith('profiles'); // Shouldn't update profile if upload failed
    });

     it('should return null if getting public URL fails', async () => {
      (supabase.storage.from('avatars').getPublicUrl as jest.Mock).mockReturnValue({ data: { publicUrl: null } }); // Simulate failed URL retrieval
      const result = await repository.uploadAvatar(mockFileUri);
      expect(result).toBeNull();
       expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(supabase.storage.from('avatars').upload).toHaveBeenCalled();
      expect(supabase.storage.from('avatars').getPublicUrl).toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalledWith('profiles'); // Shouldn't update profile if URL failed
    });

     it('should return public URL even if profile update fails', async () => {
        // Mock profile update failure using the dedicated mock object
        profileUpdateBuilderMock.eq.mockResolvedValue({ error: mockUpdateError });

      const result = await repository.uploadAvatar(mockFileUri);

      expect(result).toBe(mockPublicUrl); // Should still return the URL
      expect(supabase.storage.from).toHaveBeenCalledWith('avatars');
      expect(supabase.storage.from('avatars').upload).toHaveBeenCalled();
      expect(supabase.storage.from('avatars').getPublicUrl).toHaveBeenCalled();
       // Check that profile update was attempted
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(profileUpdateBuilderMock.update).toHaveBeenCalledWith({ avatar_url: mockPublicUrl });
      expect(profileUpdateBuilderMock.eq).toHaveBeenCalledWith('id', mockUserId);
    });

  });


  describe('getGarage', () => {
    it.todo('should implement tests for fetching garage');
  });

  describe('addBike', () => {
    it.todo('should implement tests for adding a bike');
  });

  describe('updateBike', () => {
    it.todo('should implement tests for updating a bike');
  });

  // --- deleteBike Tests ---
  describe('deleteBike', () => {
    const mockBikeId = 'bike-to-delete-id';

    it('should call Supabase delete with the correct parameters on successful deletion', async () => {
      // Mock successful deletion (no error)
      mockSupabaseQueryBuilder.eq.mockResolvedValueOnce({ error: null }); // eq() is the final step in the delete chain here

      await repository.deleteBike(mockBikeId);

      expect(supabase.from).toHaveBeenCalledWith('bikes');
      expect(mockSupabaseQueryBuilder.delete).toHaveBeenCalledTimes(1);
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockBikeId);
    });

    it('should throw an error if Supabase delete fails', async () => {
      const deleteError = new Error('Supabase delete failed');
      // Mock failed deletion
      mockSupabaseQueryBuilder.eq.mockResolvedValueOnce({ error: deleteError });

      await expect(repository.deleteBike(mockBikeId)).rejects.toThrow(deleteError);

      expect(supabase.from).toHaveBeenCalledWith('bikes');
      expect(mockSupabaseQueryBuilder.delete).toHaveBeenCalledTimes(1);
      expect(mockSupabaseQueryBuilder.eq).toHaveBeenCalledWith('id', mockBikeId);
    });
  });
});
