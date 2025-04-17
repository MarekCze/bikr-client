import React from 'react';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

import AuthLayout from '../../components/auth/AuthLayout';
import SignUpForm from '../../components/auth/SignUpForm';
import { useAuth } from '../../hooks/useAuth';
import { signUpSchema } from '../../components/auth/authSchemas';
import { ThemedView } from '../../components/ThemedView';
import { useAuthNavigation } from '../../components/auth/AuthNavigationHelper';

export default function SignUpScreen() {
  const [loading, setLoading] = React.useState(false);
  const { signUp } = useAuth();

  // Handle sign up form submission
  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password);
      // After signup, user needs to verify email
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use our navigation helper to navigate back to sign in
  const { navigateToSignIn } = useAuthNavigation();
  
  const handleSignIn = () => {
    navigateToSignIn();
  };

  return (
    <ThemedView style={styles.container}>
      <AuthLayout 
        title="Create Account" 
        subtitle="Sign up to start using bikR"
      >
        <SignUpForm
          onSubmit={handleSignUp}
          onSignIn={handleSignIn}
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
