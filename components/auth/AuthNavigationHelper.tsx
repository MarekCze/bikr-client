import React, { createContext, useContext } from 'react';
import { useRouter } from 'expo-router';

// Define the navigation context interface
interface AuthNavigationContextType {
  navigateToSignIn: () => void;
  navigateToSignUp: () => void;
  navigateToResetPassword: () => void;
  navigateToNewPassword: () => void;
}

// Create a context for auth navigation
const AuthNavigationContext = createContext<AuthNavigationContextType | undefined>(undefined);

// Create a provider component
export const AuthNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // Create navigation functions that will work regardless of route structure
  const navigateToSignIn = () => {
    try {
      // Different ways to navigate since TypeScript can be strict about route paths
      router.replace('../auth/sign-in');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback options if the above doesn't work
      try {
        router.replace('/auth/sign-in' as any);
      } catch (e) {
        console.error('Fallback navigation failed:', e);
      }
    }
  };

  const navigateToSignUp = () => {
    try {
      router.push('../auth/sign-up');
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        router.push('/auth/sign-up' as any);
      } catch (e) {
        console.error('Fallback navigation failed:', e);
      }
    }
  };

  const navigateToResetPassword = () => {
    try {
      router.push('../auth/reset-password');
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        router.push('/auth/reset-password' as any);
      } catch (e) {
        console.error('Fallback navigation failed:', e);
      }
    }
  };

  const navigateToNewPassword = () => {
    try {
      router.push('../auth/new-password');
    } catch (error) {
      console.error('Navigation error:', error);
      try {
        router.push('/auth/new-password' as any);
      } catch (e) {
        console.error('Fallback navigation failed:', e);
      }
    }
  };

  const value = {
    navigateToSignIn,
    navigateToSignUp,
    navigateToResetPassword,
    navigateToNewPassword,
  };

  return (
    <AuthNavigationContext.Provider value={value}>
      {children}
    </AuthNavigationContext.Provider>
  );
};

// Create a hook for using the navigation context
export const useAuthNavigation = () => {
  const context = useContext(AuthNavigationContext);
  if (context === undefined) {
    throw new Error('useAuthNavigation must be used within an AuthNavigationProvider');
  }
  return context;
};
