import { Post, CreatePostInput, UpdatePostInput } from '../../shared/src/types/post'; // Assuming types exist in shared package
import { MediaUploadResult } from '../../shared/src/types/media'; // Assuming type exists

/**
 * Interface for managing content data (posts, media).
 */
export interface IContentRepository {
  /**
   * Creates a new post.
   * @param input - Data for the new post.
   * @returns The created post.
   */
  createPost(input: CreatePostInput): Promise<Post>;

  /**
   * Retrieves a post by its ID.
   * @param postId - The ID of the post to retrieve.
   * @returns The post data or null if not found.
   */
  getPostById(postId: string): Promise<Post | null>;

  /**
   * Updates an existing post.
   * @param postId - The ID of the post to update.
   * @param input - Data to update the post with.
   * @returns The updated post.
   */
  updatePost(postId: string, input: UpdatePostInput): Promise<Post>;

  /**
   * Deletes a post by its ID.
   * @param postId - The ID of the post to delete.
   * @returns A promise that resolves when the post is deleted.
   */
  deletePost(postId: string): Promise<void>;

  /**
   * Uploads media associated with a post.
   * @param file - The media file to upload (e.g., File object or similar representation).
   * @param postId - Optional ID of the post to associate the media with.
   * @returns Information about the uploaded media.
   */
  uploadMedia(file: any, postId?: string): Promise<MediaUploadResult>; // 'any' type for file needs refinement based on actual upload mechanism

  // Add other relevant methods as needed, e.g., liking/unliking posts, reporting content, etc.
  // likePost(postId: string, userId: string): Promise<void>;
  // unlikePost(postId: string, userId: string): Promise<void>;
}
