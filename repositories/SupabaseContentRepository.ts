import { supabase } from '../services/supabase';
import { IContentRepository } from './IContentRepository';
import { Post, CreatePostInput, UpdatePostInput } from '../../shared/src/types/post'; // Assuming types exist
import { MediaUploadResult } from '../../shared/src/types/media'; // Assuming type exists
import { SupabaseClient, PostgrestError } from '@supabase/supabase-js'; // Remove StorageError import

// Helper function to handle Supabase errors
const handleSupabaseError = (error: PostgrestError | Error | null, context: string) => { // Accept Error instead of StorageError
  if (error) {
    console.error(`Supabase error in ${context}:`, error.message);
    // Consider throwing a custom error or returning a specific result
    throw new Error(`Failed to ${context}: ${error.message}`);
  }
};

export class SupabaseContentRepository implements IContentRepository {
  private client: SupabaseClient;

  constructor() {
    this.client = supabase; // Use the initialized Supabase client
  }

  async createPost(input: CreatePostInput): Promise<Post> {
    const { data, error } = await this.client
      .from('posts') // Assuming 'posts' table name
      .insert([
        {
          user_id: input.userId, // Assuming user_id column
          content_type: input.contentType,
          text_content: input.textContent,
          poll_question: input.pollQuestion,
          // Add other relevant fields based on CreatePostInput and your 'posts' table schema
        },
      ])
      .select() // Select the newly created post
      .single(); // Expecting a single row back

    handleSupabaseError(error, 'create post');

    if (!data) {
      throw new Error('Failed to create post, no data returned.');
    }

    // TODO: Map Supabase result (data) to the Post type if necessary
    return data as Post;
  }

  async getPostById(postId: string): Promise<Post | null> {
    const { data, error } = await this.client
      .from('posts')
      .select('*') // Adjust columns as needed
      .eq('id', postId) // Assuming 'id' is the primary key column
      .maybeSingle(); // Returns single row or null

    handleSupabaseError(error, `get post by ID ${postId}`);

    // TODO: Map Supabase result (data) to the Post type if necessary
    return data ? (data as Post) : null;
  }

  async updatePost(postId: string, input: UpdatePostInput): Promise<Post> {
    const { data, error } = await this.client
      .from('posts')
      .update({
        text_content: input.textContent,
        // Add other updatable fields based on UpdatePostInput
        is_edited: true, // Mark as edited
      })
      .eq('id', postId)
      .select()
      .single();

    handleSupabaseError(error, `update post ${postId}`);

     if (!data) {
      throw new Error(`Failed to update post ${postId}, no data returned.`);
    }

    // TODO: Map Supabase result (data) to the Post type if necessary
    return data as Post;
  }

  async deletePost(postId: string): Promise<void> {
    const { error } = await this.client
      .from('posts')
      .delete()
      .eq('id', postId);

    handleSupabaseError(error, `delete post ${postId}`);
  }

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

    const { data, error } = await this.client.storage
      .from('media') // Assuming 'media' bucket name
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false, // Don't overwrite existing files with the same name
        contentType: file.type || 'application/octet-stream', // Get content type if available
      });

    handleSupabaseError(error, `upload media for post ${postId}`);

    if (!data) {
        throw new Error('Failed to upload media, no data returned from storage API.');
    }

    // Construct the public URL or return necessary identifiers
    const { data: urlData } = this.client.storage.from('media').getPublicUrl(data.path);

    return {
      url: urlData?.publicUrl || '', // The public URL of the uploaded file
      path: data.path, // The path within the bucket
      // Add other relevant details like file size, type, etc. if needed
    };
  }

  // Implement other methods like likePost, unlikePost if defined in IContentRepository
}
