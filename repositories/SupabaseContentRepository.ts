import { IContentRepository } from './IContentRepository';
import { 
  Post, 
  CreatePostInput, 
  UpdatePostInput, 
  Comment, 
  CreateCommentInput, 
  Like 
} from '../../shared/src/types/post';
import { MediaUploadResult } from '../../shared/src/types/media';
import apiClient from '../services/api'; // Import the API client
import { supabase } from '../services/supabase'; // Keep for storage operations for now
import { SupabaseClient } from '@supabase/supabase-js'; // Keep for storage type if needed

// Helper function to handle API errors (can be expanded)
const handleApiError = (error: any, context: string) => {
  console.error(`API error in ${context}:`, error);
  // Re-throw the error or handle it as needed
  throw error;
};


export class SupabaseContentRepository implements IContentRepository {
  // Keep Supabase client instance specifically for storage until refactored
  private storageClient: SupabaseClient;

  constructor() {
    // Initialize storage client separately
    this.storageClient = supabase;
  }

  // --- Post Methods (using apiClient) ---

  async createPost(input: CreatePostInput, token: string): Promise<Post> {
    try {
      // Assuming apiClient.content.createPost exists and takes token
      // Note: The apiClient's createPost currently takes 'any', needs update to CreatePostInput
      return await apiClient.content.createPost(input, token);
    } catch (error) {
      handleApiError(error, 'create post');
      // Ensure function returns a value or throws
      throw error; // Re-throw after logging
    }
  }

  async getPostById(postId: string, token?: string): Promise<Post | null> {
    try {
      // API client might throw 404, which is handled by handleResponse
      // We return null explicitly if needed, but API client might just throw
      return await apiClient.content.getPostById(postId, token);
    } catch (error: any) {
      // Specifically handle 404 errors from the API client if needed
      if (error.status === 404) {
        return null; // Return null if post not found
      }
      handleApiError(error, `get post by ID ${postId}`);
      throw error; // Re-throw other errors
    }
  }

  async updatePost(postId: string, input: UpdatePostInput, token: string): Promise<Post> {
     try {
      // TODO: apiClient.content.updatePost needs to be implemented in api.ts
      // Placeholder implementation - assuming it exists
      // return await apiClient.content.updatePost(postId, input, token);
      console.warn('apiClient.content.updatePost not implemented yet in api.ts');
      throw new Error('Update post functionality via API client is not implemented.');
    } catch (error) {
      handleApiError(error, `update post ${postId}`);
      throw error;
    }
  }

  async deletePost(postId: string, token: string): Promise<void> {
     try {
      // TODO: apiClient.content.deletePost needs to be implemented in api.ts
      // Placeholder implementation - assuming it exists
      // await apiClient.content.deletePost(postId, token);
      console.warn('apiClient.content.deletePost not implemented yet in api.ts');
      throw new Error('Delete post functionality via API client is not implemented.');
    } catch (error) {
      handleApiError(error, `delete post ${postId}`);
      throw error;
    }
  }

  // --- Media Upload (keeping direct Supabase storage for now) ---
  async uploadMedia(file: any, postId?: string): Promise<MediaUploadResult> {
    // Implementation depends heavily on how 'file' is represented
    // (e.g., Blob, File, FormData from expo-image-picker/expo-document-picker)
    // Assuming 'file' has properties like 'uri', 'name', 'type'

    if (!file || !file.uri || !file.name) {
        throw new Error('Invalid file object provided for media upload.');
    }

    // Example using fetch to get blob from file URI (common in React Native/Expo)
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const filePath = `posts/${postId ? `${postId}/` : ''}${Date.now()}-${file.name}`; // Example path structure

    // Use the dedicated storageClient instance
    const { data, error } = await this.storageClient.storage
      .from('media') // Assuming 'media' bucket name
      .upload(filePath, blob, {
        cacheControl: '3600', // Example cache control
        upsert: false, // Don't overwrite existing files
        contentType: file.type || 'application/octet-stream', // Get content type if available
      });

    // Handle storage-specific error
    if (error) {
        console.error(`Supabase Storage error in uploadMedia:`, error.message);
        throw new Error(`Failed to upload media: ${error.message}`);
    }

    if (!data) {
        throw new Error('Failed to upload media, no data returned from storage API.');
    }

    // Construct the public URL or return necessary identifiers
    const { data: urlData } = this.storageClient.storage.from('media').getPublicUrl(data.path);

    return {
      url: urlData?.publicUrl || '', // The public URL of the uploaded file
      path: data.path, // The path within the bucket
      // Add other relevant details like file size, type, etc. if needed
    };
  }

  // --- Comment Methods (using apiClient) ---

  async createComment(postId: string, input: CreateCommentInput, token: string): Promise<Comment> {
    try {
      return await apiClient.content.createComment(postId, input, token);
    } catch (error) {
      handleApiError(error, `create comment for post ${postId}`);
      throw error;
    }
  }

  async getCommentsByPostId(postId: string, limit?: number, offset?: number, token?: string): Promise<Comment[]> {
    try {
      return await apiClient.content.getCommentsByPostId(postId, token, limit, offset);
    } catch (error) {
      handleApiError(error, `get comments for post ${postId}`);
      throw error;
    }
  }

  async updateComment(commentId: string, content: string, token: string): Promise<Comment> {
    try {
      return await apiClient.content.updateComment(commentId, content, token);
    } catch (error) {
      handleApiError(error, `update comment ${commentId}`);
      throw error;
    }
  }

  async deleteComment(commentId: string, token: string): Promise<void> {
    try {
      // apiClient returns boolean, but interface expects void
      await apiClient.content.deleteComment(commentId, token);
    } catch (error) {
      handleApiError(error, `delete comment ${commentId}`);
      throw error;
    }
  }

  async likeComment(commentId: string, token: string): Promise<void> {
    try {
      await apiClient.content.likeComment(commentId, token);
    } catch (error) {
      handleApiError(error, `like comment ${commentId}`);
      throw error;
    }
  }

  async unlikeComment(commentId: string, token: string): Promise<void> {
    try {
      await apiClient.content.unlikeComment(commentId, token);
    } catch (error) {
      handleApiError(error, `unlike comment ${commentId}`);
      throw error;
    }
  }

  async getCommentLikes(commentId: string, limit?: number, offset?: number, token?: string): Promise<Like[]> {
     try {
      // TODO: apiClient.content.getCommentLikes needs to be implemented in api.ts
      // Placeholder implementation - assuming it exists
      // return await apiClient.content.getCommentLikes(commentId, token, limit, offset);
      console.warn('apiClient.content.getCommentLikes not implemented yet in api.ts');
      throw new Error('Get comment likes functionality via API client is not implemented.');
    } catch (error) {
      handleApiError(error, `get likes for comment ${commentId}`);
      throw error;
    }
  }

  // --- Post Like Methods (using apiClient) ---
  async likePost(postId: string, token: string): Promise<void> {
    try {
      await apiClient.content.likePost(postId, token);
    } catch (error) {
      handleApiError(error, `like post ${postId}`);
      throw error;
    }
  }

  async unlikePost(postId: string, token: string): Promise<void> {
    try {
      await apiClient.content.unlikePost(postId, token);
    } catch (error) {
      handleApiError(error, `unlike post ${postId}`);
      throw error;
    }
  }

   async getPostLikes(postId: string, limit?: number, offset?: number, token?: string): Promise<Like[]> {
     try {
      // Note: apiClient.content.getPostLikes returns any[], needs update to Like[]
      const likesData = await apiClient.content.getPostLikes(postId, token, limit, offset);
      // Basic type assertion, consider more robust validation/mapping
      return likesData as Like[];
    } catch (error) {
      handleApiError(error, `get likes for post ${postId}`);
      throw error;
    }
  }

}
