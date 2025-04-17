import { useState, useEffect } from 'react';
import { Button, ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { MMKV } from 'react-native-mmkv';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

// Required for Google auth in Expo
WebBrowser.maybeCompleteAuthSession();

// Storage instance for persisting session data
const storage = new MMKV();
const SESSION_KEY = 'user_session';

export interface UserSession {
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
      picture?: string;
      email?: string;
    };
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

const GoogleAuthTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const supabase = useSupabaseClient();

  // Configuration - Update these with your actual client IDs
  // These should be the OAuth client IDs from Google Cloud Console
  const ANDROID_CLIENT_ID = '647013814398-ma9hb1qd3ntt0579c53m35gb3ojun7q3.apps.googleusercontent.com';
  const IOS_CLIENT_ID = '647013814398-fln10cga1rj4hrp12ag9p79hcmkkp8vd.apps.googleusercontent.com'; // Updated with correct format
  const EXPO_CLIENT_ID = '647013814398-ma9hb1qd3ntt0579c53m35gb3ojun7q3.apps.googleusercontent.com'; // Using Android ID for Expo Go/development

  // Set up Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    clientId: EXPO_CLIENT_ID, // For web/Expo Go
    // Make sure these scopes match what you configured in Supabase
    scopes: ['profile', 'email'],
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = storage.getString(SESSION_KEY);
    if (savedSession) {
      try {
        setUserSession(JSON.parse(savedSession));
      } catch (e) {
        console.error('Failed to parse stored session:', e);
        storage.delete(SESSION_KEY);
      }
    }
  }, []);

  // Persist session when it changes
  useEffect(() => {
    if (userSession) {
      storage.set(SESSION_KEY, JSON.stringify(userSession));
    }
  }, [userSession]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prompt the user with Google's authentication flow
      const result = await promptAsync();

      if (result.type === 'success' && result.authentication && result.authentication.idToken) {
        // Exchange the Google auth token for a Supabase session
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: result.authentication.idToken,
        });

        if (error) throw error;
        
        // Store user data and session - handling possible undefined values
        const sessionData: UserSession = {
          user: {
            id: data.user?.id || '',
            email: data.user?.email || '',
            user_metadata: {
              full_name: data.user?.user_metadata?.full_name,
              avatar_url: data.user?.user_metadata?.avatar_url,
              name: data.user?.user_metadata?.name,
              picture: data.user?.user_metadata?.picture,
              email: data.user?.user_metadata?.email
            }
          },
          session: {
            access_token: data.session?.access_token || '',
            refresh_token: data.session?.refresh_token || '',
            expires_at: data.session?.expires_at || Math.floor(Date.now() / 1000) + 3600 // Default to 1 hour if undefined
          }
        };
        
        setUserSession(sessionData);
        console.log('Successfully signed in:', data.user);
      } else if (result.type === 'cancel') {
        setError('Authentication was cancelled');
      } else if (result.type === 'error') {
        setError(`Authentication error: ${result.error?.message || 'Unknown error'}`);
      } else {
        setError('Authentication failed - missing ID token');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local session data
      setUserSession(null);
      storage.delete(SESSION_KEY);
    } catch (err) {
      console.error('Sign out error:', err);
      Alert.alert('Sign Out Error', err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {userSession ? (
        <>
          <ThemedView style={styles.profileContainer}>
            <ThemedText type="subtitle">Signed in as:</ThemedText>
            <ThemedText>{userSession.user.email}</ThemedText>
            <ThemedText>
              {userSession.user.user_metadata.name || userSession.user.user_metadata.full_name || 'User'}
            </ThemedText>
          </ThemedView>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            disabled={loading}
          />
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button
              title="Sign in with Google"
              onPress={handleGoogleSignIn}
              disabled={loading || !request}
            />
          )}
        </>
      )}
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileContainer: {
    gap: 4,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  }
});

export default GoogleAuthTest;
