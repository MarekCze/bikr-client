import React from 'react';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

import AuthLayout from '../../components/auth/AuthLayout';
import SignInForm from '../../components/auth/SignInForm';
import { useAuth } from '../../hooks/useAuth';
import { signInSchema } from '../../components/auth/authSchemas';
import { ThemedView } from '../../components/ThemedView';
import { useAuthNavigation } from '../../components/auth/AuthNavigationHelper';

export default function SignInScreen() {
  const [loading, setLoading] = React.useState(false);
  const { signIn } = useAuth();
  const { navigateToResetPassword, navigateToSignUp } = useAuthNavigation();

  // Handle sign in form submission
  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      // Navigation will be handled by auth state change
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigateToResetPassword();
  };

  const handleCreateAccount = () => {
    navigateToSignUp();
  };

  return (
    <ThemedView style={styles.container}>
      <AuthLayout 
        title="Sign In" 
        subtitle="Welcome back! Sign in to your account"
      >
        <SignInForm
          onSubmit={handleSignIn}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleCreateAccount}
          loading={loading}
        />
      </AuthLayout>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
