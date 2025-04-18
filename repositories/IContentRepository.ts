import { 
  Post, 
  CreatePostInput, 
  UpdatePostInput, 
  Comment, 
  CreateCommentInput, 
  Like 
} from '../../shared/src/types/post'; // Assuming types exist in shared package
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

  // --- Comment Methods ---

  /**
   * Creates a new comment on a post.
   * @param postId - The ID of the post to comment on.
   * @param input - Data for the new comment.
   * @returns The created comment.
   */
  createComment(postId: string, input: CreateCommentInput): Promise<Comment>;

  /**
   * Retrieves comments for a specific post.
   * @param postId - The ID of the post.
   * @param limit - Optional limit for pagination.
   * @param offset - Optional offset for pagination.
   * @returns A list of comments.
   */
  getCommentsByPostId(postId: string, limit?: number, offset?: number): Promise<Comment[]>;

  /**
   * Updates an existing comment.
   * @param commentId - The ID of the comment to update.
   * @param content - The new content for the comment.
   * @returns The updated comment.
   */
  updateComment(commentId: string, content: string): Promise<Comment>;

  /**
   * Deletes a comment by its ID.
   * @param commentId - The ID of the comment to delete.
   * @returns A promise that resolves when the comment is deleted.
   */
  deleteComment(commentId: string): Promise<void>;

  /**
   * Likes a comment.
   * @param commentId - The ID of the comment to like.
   * @returns A promise that resolves when the comment is liked.
   */
  likeComment(commentId: string): Promise<void>;

  /**
   * Unlikes a comment.
   * @param commentId - The ID of the comment to unlike.
   * @returns A promise that resolves when the comment is unliked.
   */
  unlikeComment(commentId: string): Promise<void>;

  /**
   * Retrieves likes for a specific comment.
   * @param commentId - The ID of the comment.
   * @param limit - Optional limit for pagination.
   * @param offset - Optional offset for pagination.
   * @returns A list of likes.
   */
  getCommentLikes(commentId: string, limit?: number, offset?: number): Promise<Like[]>;

  // Add other relevant methods as needed, e.g., liking/unliking posts, reporting content, etc.
  // likePost(postId: string, userId: string): Promise<void>;
  // unlikePost(postId: string, userId: string): Promise<void>;
}
