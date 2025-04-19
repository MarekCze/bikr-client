import { SupabaseClubRepository } from '../SupabaseClubRepository';
import { api } from '../../services/api';
import { 
  Club, 
  ClubRole, 
  ClubMembershipStatus, 
  ClubPrivacy,
  ClubMembership, 
  CreateClubInput, 
  UpdateClubInput
} from 'bikr-shared';

// Mock the api module
jest.mock('../../services/api');
const mockApi = api as jest.Mocked<typeof api>;

describe('SupabaseClubRepository', () => {
  let repository: SupabaseClubRepository;
  
  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SupabaseClubRepository();
  });

  describe('createClub', () => {
    it('should make a POST request to /clubs with club data', async () => {
      // Arrange
      const userId = 'user-123';
      const clubData: CreateClubInput = {
        name: 'Test Riders',
        description: 'A club for testing',
        privacy: ClubPrivacy.PUBLIC
      };
      
      const mockClub: Club = {
        id: 'club-123',
        name: 'Test Riders',
        description: 'A club for testing',
        privacy: ClubPrivacy.PUBLIC,
        avatar_url: null,
        banner_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        member_count: 1,
        owner_id: userId
      };
      
      mockApi.post.mockResolvedValueOnce({ data: mockClub });

      // Act
      const result = await repository.createClub(userId, clubData);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith('/clubs', clubData);
      expect(result).toEqual(mockClub);
    });

    it('should throw an error when API call fails', async () => {
      // Arrange
      const userId = 'user-123';
      const clubData: CreateClubInput = {
        name: 'Test Riders',
        description: 'A club for testing',
        privacy: ClubPrivacy.PUBLIC
      };
      
      mockApi.post.mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(repository.createClub(userId, clubData)).rejects.toThrow('Failed to create club.');
      expect(mockApi.post).toHaveBeenCalledWith('/clubs', clubData);
    });
  });

  describe('getClubById', () => {
    it('should make a GET request to /clubs/:clubId', async () => {
      // Arrange
      const clubId = 'club-123';
      const mockClub: Club = {
        id: clubId,
        name: 'Test Riders',
        description: 'A club for testing',
        privacy: ClubPrivacy.PUBLIC,
        avatar_url: null,
        banner_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        member_count: 10,
        owner_id: 'user-123'
      };
      
      mockApi.get.mockResolvedValueOnce({ data: mockClub });

      // Act
      const result = await repository.getClubById(clubId);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/clubs/${clubId}`);
      expect(result).toEqual(mockClub);
    });

    it('should return null when API call fails', async () => {
      // Arrange
      const clubId = 'club-123';
      mockApi.get.mockRejectedValueOnce(new Error('Network error'));

      // Act
      const result = await repository.getClubById(clubId);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/clubs/${clubId}`);
      expect(result).toBeNull();
    });
  });

  describe('getClubs', () => {
    it('should make a GET request to /clubs with filters', async () => {
      // Arrange
      const filters = {
        search: 'riders',
        limit: 10,
        offset: 0,
        privacy: ClubPrivacy.PUBLIC
      };
      
      const mockResponse = {
        data: [
          {
            id: 'club-123',
            name: 'Test Riders',
            description: 'A club for testing',
            privacy: ClubPrivacy.PUBLIC,
            avatar_url: null,
            banner_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            member_count: 10,
            owner_id: 'user-123'
          }
        ],
        count: 1,
        hasMore: false
      };
      
      mockApi.get.mockResolvedValueOnce({ data: mockResponse });

      // Act
      const result = await repository.getClubs(filters);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith('/clubs', {
        params: expect.any(URLSearchParams)
      });
      
      // Verify all filters are passed
      const params = (mockApi.get.mock.calls[0][1] as any).params;
      expect(params.get('search')).toBe('riders');
      expect(params.get('limit')).toBe('10');
      expect(params.get('offset')).toBe('0');
      expect(params.get('privacy')).toBe(ClubPrivacy.PUBLIC);
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('joinClub', () => {
    it('should make a POST request to /clubs/:clubId/join', async () => {
      // Arrange
      const clubId = 'club-123';
      const mockMembership: ClubMembership = {
        club_id: clubId,
        user_id: 'user-123',
        role: ClubRole.MEMBER,
        status: ClubMembershipStatus.APPROVED,
        joined_at: new Date().toISOString()
      };
      
      mockApi.post.mockResolvedValueOnce({ data: mockMembership });

      // Act
      const result = await repository.joinClub(clubId);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(`/clubs/${clubId}/join`);
      expect(result).toEqual(mockMembership);
    });
  });

  describe('leaveClub', () => {
    it('should make a POST request to /clubs/:clubId/leave', async () => {
      // Arrange
      const clubId = 'club-123';
      mockApi.post.mockResolvedValueOnce({ data: {} });

      // Act
      const result = await repository.leaveClub(clubId);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(`/clubs/${clubId}/leave`);
      expect(result).toBe(true);
    });
  });

  describe('getClubMembers', () => {
    it('should make a GET request to /clubs/:clubId/members with filters', async () => {
      // Arrange
      const clubId = 'club-123';
      const filters = {
        limit: 20,
        offset: 0,
        role: ClubRole.MEMBER,
        status: ClubMembershipStatus.APPROVED,
        search: 'john'
      };
      
      const mockResponse = {
        data: [
          {
            clubId,
            userId: 'user-123',
            role: ClubRole.MEMBER,
            status: ClubMembershipStatus.APPROVED,
            joinedAt: new Date().toISOString()
          }
        ],
        count: 1,
        hasMore: false
      };
      
      mockApi.get.mockResolvedValueOnce({ data: mockResponse });

      // Act
      const result = await repository.getClubMembers(clubId, filters);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/clubs/${clubId}/members`, {
        params: expect.any(URLSearchParams)
      });
      
      // Verify all filters are passed
      const params = (mockApi.get.mock.calls[0][1] as any).params;
      expect(params.get('limit')).toBe('20');
      expect(params.get('offset')).toBe('0');
      expect(params.get('role')).toBe(ClubRole.MEMBER);
      expect(params.get('status')).toBe(ClubMembershipStatus.APPROVED);
      expect(params.get('search')).toBe('john');
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateClub', () => {
    it('should make a PUT request to /clubs/:clubId', async () => {
      // Arrange
      const clubId = 'club-123';
      const updateData: UpdateClubInput = {
        name: 'Updated Club Name',
        description: 'Updated description'
      };
      
      const mockClub: Club = {
        id: clubId,
        name: 'Updated Club Name',
        description: 'Updated description',
        privacy: ClubPrivacy.PUBLIC,
        avatar_url: null,
        banner_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        member_count: 10,
        owner_id: 'user-123'
      };
      
      mockApi.put.mockResolvedValueOnce({ data: mockClub });

      // Act
      const result = await repository.updateClub(clubId, updateData);

      // Assert
      expect(mockApi.put).toHaveBeenCalledWith(`/clubs/${clubId}`, updateData);
      expect(result).toEqual(mockClub);
    });
  });

  describe('deleteClub', () => {
    it('should make a DELETE request to /clubs/:clubId', async () => {
      // Arrange
      const clubId = 'club-123';
      mockApi.delete.mockResolvedValueOnce({ data: {} });

      // Act
      const result = await repository.deleteClub(clubId);

      // Assert
      expect(mockApi.delete).toHaveBeenCalledWith(`/clubs/${clubId}`);
      expect(result).toBe(true);
    });
  });

  describe('getClubFeed', () => {
    it('should make a GET request to /clubs/:clubId/feed with pagination', async () => {
      // Arrange
      const clubId = 'club-123';
      const pagination = {
        limit: 10,
        offset: 20
      };
      
      const mockResponse = {
        data: [
          {
            id: 'post-123',
            content: 'Test post',
            // ... other post properties
          }
        ],
        count: 1,
        hasMore: false
      };
      
      mockApi.get.mockResolvedValueOnce({ data: mockResponse });

      // Act
      const result = await repository.getClubFeed(clubId, pagination);

      // Assert
      expect(mockApi.get).toHaveBeenCalledWith(`/clubs/${clubId}/feed`, {
        params: expect.any(URLSearchParams)
      });
      
      // Verify pagination params
      const params = (mockApi.get.mock.calls[0][1] as any).params;
      expect(params.get('limit')).toBe('10');
      expect(params.get('offset')).toBe('20');
      
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createClubPost', () => {
    it('should make a POST request to /clubs/:clubId/posts', async () => {
      // Arrange
      const clubId = 'club-123';
      const postData = {
        content: 'Test post in club',
        type: 'text'
      };
      
      const mockPost = {
        id: 'post-123',
        content: 'Test post in club',
        type: 'text',
        // ... other post properties
      };
      
      mockApi.post.mockResolvedValueOnce({ data: mockPost });

      // Act
      const result = await repository.createClubPost(clubId, postData);

      // Assert
      expect(mockApi.post).toHaveBeenCalledWith(`/clubs/${clubId}/posts`, postData);
      expect(result).toEqual(mockPost);
    });
  });
});
