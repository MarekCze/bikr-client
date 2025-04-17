import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { MMKV } from 'react-native-mmkv';
import { Alert } from 'react-native';

// Initialize MMKV storage for session persistence
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

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();
  
  // Load session from storage on initialization
  useEffect(() => {
    loadSession();
    
    // Set up subscription to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (newSession) {
          // Format session data in consistent structure
          const sessionData: UserSession = {
            user: {
              id: newSession.user?.id || '',
              email: newSession.user?.email || '',
              user_metadata: {
                full_name: newSession.user?.user_metadata?.full_name,
                avatar_url: newSession.user?.user_metadata?.avatar_url,
                name: newSession.user?.user_metadata?.name,
                picture: newSession.user?.user_metadata?.picture,
                email: newSession.user?.user_metadata?.email
              }
            },
            session: {
              access_token: newSession.access_token || '',
              refresh_token: newSession.refresh_token || '',
              expires_at: newSession.expires_at || Math.floor(Date.now() / 1000) + 3600
            }
          };
          
          setSession(sessionData);
          storage.set(SESSION_KEY, JSON.stringify(sessionData));
        } else {
          setSession(null);
          storage.delete(SESSION_KEY);
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase.auth]);
  
  // Load session from MMKV storage
  const loadSession = async () => {
    try {
      const storedSession = storage.getString(SESSION_KEY);
      if (storedSession) {
        setSession(JSON.parse(storedSession));
      }
      
      // Also check Supabase current session
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data?.session) {
        // Format session data
        const sessionData: UserSession = {
          user: {
            id: data.session.user?.id || '',
            email: data.session.user?.email || '',
            user_metadata: {
              full_name: data.session.user?.user_metadata?.full_name,
              avatar_url: data.session.user?.user_metadata?.avatar_url,
              name: data.session.user?.user_metadata?.name,
              picture: data.session.user?.user_metadata?.picture,
              email: data.session.user?.user_metadata?.email
            }
          },
          session: {
            access_token: data.session.access_token || '',
            refresh_token: data.session.refresh_token || '',
            expires_at: data.session.expires_at || Math.floor(Date.now() / 1000) + 3600
          }
        };
        
        setSession(sessionData);
        storage.set(SESSION_KEY, JSON.stringify(sessionData));
      }
    } catch (err) {
      console.error('Error loading auth session:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading session');
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email/password
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user && !data.user.confirmed_at) {
        // User needs to verify their email
        Alert.alert(
          'Verification Required',
          'Please check your email for a verification link to complete sign up.'
        );
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      Alert.alert('Sign Up Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid login credentials';
      setError(errorMessage);
      Alert.alert('Sign In Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'bikr://reset-password',
      });
      
      if (error) throw error;
      
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for a password reset link'
      );
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(errorMessage);
      Alert.alert('Reset Password Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update password after reset
  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
      Alert.alert(
        'Password Updated',
        'Your password has been successfully updated'
      );
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      Alert.alert('Update Password Error', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out current user
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local session data
      storage.delete(SESSION_KEY);
      setSession(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      console.error('Sign out error:', errorMessage);
      Alert.alert('Sign Out Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    session,
    user: session?.user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
}
