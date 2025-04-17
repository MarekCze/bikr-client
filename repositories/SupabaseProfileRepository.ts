import { User, Bike } from 'bikr-shared'; // Use User and Bike types
import { supabase } from '../services/supabase'; // Corrected path
import { IProfileRepository } from './IProfileRepository';

export class SupabaseProfileRepository implements IProfileRepository {
  async getProfile(userId: string): Promise<User | null> { // Use User type
    try {
      const { data, error } = await supabase
        .from('profiles') // Assuming 'profiles' table
        .select('*')
        .eq('id', userId)
        .single(); // Expecting only one profile per user ID

      if (error) {
        console.error('Error fetching profile:', error);
        if (error.code === 'PGRST116') { // PostgREST error code for "Resource not found"
          return null; // User might not have a profile yet
        }
        throw error;
      }

      return data as User; // Use User type
    } catch (err) {
      console.error('Unexpected error in getProfile:', err);
      throw err;
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User | null> { // Use User type
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting current user:', authError);
        throw authError || new Error('User not authenticated');
      }

      // Ensure the id is not part of the update payload if present
      const { id, ...updateData } = profileData;

      const { data, error } = await supabase
        .from('profiles') // Assuming 'profiles' table
        .update(updateData)
        .eq('id', user.id)
        .select() // Select the updated row
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      return data as User; // Use User type
    } catch (err) {
      console.error('Unexpected error in updateProfile:', err);
      throw err;
    }
  }

  async uploadAvatar(fileUri: string): Promise<string | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting current user for avatar upload:', authError);
        throw authError || new Error('User not authenticated');
      }

      // TODO: Convert fileUri (string) to Blob/File if required by Supabase upload.
      // This might involve fetching the file and creating a Blob.
      // Example (needs libraries like expo-file-system):
      // const response = await fetch(fileUri);
      // const blob = await response.blob();
      // For now, assume Supabase handles the URI or we pass a compatible object.
      const file = fileUri; // Placeholder - adjust based on actual needs

      const fileExt = fileUri.split('.').pop(); // Get file extension
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `public/avatars/${fileName}`; // Use public folder in bucket

      console.log(`Uploading avatar to: ${filePath}`);

      // Upload file to Supabase Storage (assuming 'avatars' bucket)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
            // cacheControl: '3600', // Optional: Cache control
            // upsert: false // Optional: Set to true to overwrite
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      console.log('Avatar uploaded successfully.');

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
          console.error('Could not get public URL for avatar');
          throw new Error('Could not get public URL for avatar');
      }

      const publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);

      // Optionally, update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl }) // Assuming 'avatar_url' column
        .eq('id', user.id);

      if (updateError) {
          // Log error but maybe don't throw? The file is uploaded.
          console.error('Error updating profile with avatar URL:', updateError);
      } else {
          console.log('Profile updated with new avatar URL.');
      }

      return publicUrl;

    } catch (err) {
      console.error('Unexpected error in uploadAvatar:', err);
      // Don't rethrow specific Supabase errors if already logged, maybe return null or throw generic
      return null;
    } // Correct closing brace for uploadAvatar try-catch
  } // Correct closing brace for uploadAvatar method

  async getGarage(): Promise<Bike[]> { // Correct start for getGarage method
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting current user for garage:', authError);
        throw authError || new Error('User not authenticated');
      }

      // Fetch bikes owned by the current user (assuming 'bikes' table and 'owner_id' column)
      const { data, error } = await supabase
        .from('bikes') // Assuming 'bikes' table name
        .select('*')
        .eq('owner_id', user.id); // Assuming 'owner_id' column

      if (error) {
        console.error('Error fetching garage bikes:', error);
        throw error;
      }

      return (data as Bike[]) || []; // Return fetched bikes or empty array if null

    } catch (err) {
      console.error('Unexpected error in getGarage:', err);
      throw err; // Rethrow other errors
    } // Correct closing brace for getGarage try-catch
  } // Correct closing brace for getGarage method

  async addBike(bikeData: Omit<Bike, 'id' | 'owner_id' | 'createdAt' | 'updatedAt'>): Promise<Bike | null> {
    // Note: Adjusted Omit to exclude fields typically generated by DB or not provided on creation
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error getting current user for adding bike:', authError);
        throw authError || new Error('User not authenticated');
      }

      const bikeToAdd = {
        ...bikeData,
        owner_id: user.id, // Add the owner_id
      };

      const { data, error } = await supabase
        .from('bikes') // Assuming 'bikes' table
        .insert(bikeToAdd)
        .select() // Select the newly inserted row
        .single(); // Expecting one row back

      if (error) {
        console.error('Error adding bike:', error);
        throw error;
      }

      return data as Bike;

    } catch (err) {
      console.error('Unexpected error in addBike:', err);
      throw err;
    } // <-- Add missing closing brace for addBike try-catch
  } // Correct closing brace for addBike method

  // Update method signature to match interface
  async updateBike(bikeData: Partial<Omit<Bike, 'id'>> & { id: string }): Promise<Bike | null> {
    try {
      // ID is guaranteed by the type signature now
      const { id, ...updateData } = bikeData; // Separate ID from the rest of the data

      // Ensure updateData is not empty if needed, though Supabase might handle it
      if (Object.keys(updateData).length === 0) {
          console.warn('updateBike called with no data to update besides ID.');
          // Optionally fetch and return the current bike data or return null/throw error
          // For now, proceed with the potentially empty update
      }

      const { data, error } = await supabase
        .from('bikes') // Assuming 'bikes' table
        .update(updateData)
        .eq('id', id) // Match the specific bike ID
        .select()
        .single();

      if (error) {
        console.error('Error updating bike:', error);
        throw error;
      }

      return data as Bike;

    } catch (err) {
      console.error('Unexpected error in updateBike:', err);
      throw err;
    }
  }

  async deleteBike(bikeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bikes') // Use 'bikes' table consistent with other methods
        .delete()
        .eq('id', bikeId);

      if (error) {
        console.error('Error deleting bike:', error);
        throw error;
      }
      console.log(`Bike with ID ${bikeId} deleted successfully.`);
    } catch (err) {
      console.error('Unexpected error in deleteBike:', err);
      throw err;
    }
  }
}
