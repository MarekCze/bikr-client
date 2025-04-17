import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

// Load environment variables from Expo Constants (configured in app.json or app.config.js)
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase URL or anonymous key. Make sure they are set in .env or app.config.js');
}

// Create Supabase client
export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);
