import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { z } from 'zod';

import AuthLayout from './AuthLayout';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import PasswordResetForm from './PasswordResetForm';
import NewPasswordForm from './NewPasswordForm';
import { useAuth } from '../../hooks/useAuth';
import { signInSchema, signUpSchema, passwordResetSchema, newPasswordSchema } from './authSchemas';

type AuthView = 'signIn' | 'signUp' | 'forgotPassword' | 'newPassword';

const EmailPasswordAuth: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('signIn');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword, updatePassword } = useAuth();

  // Handle sign in form submission
  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      // No need to redirect - the auth state change will trigger navigation
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  // Handle password reset request
  const handlePasswordReset = async (data: z.infer<typeof passwordResetSchema>) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      // Show a success message or redirect
      setCurrentView('signIn');
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle new password submission after reset
  const handleNewPassword = async (data: z.infer<typeof newPasswordSchema>) => {
    setLoading(true);
    try {
      await updatePassword(data.password);
      // Redirect to sign in after successful password update
      setCurrentView('signIn');
    } catch (error) {
      console.error('Update password error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render different forms based on current view
  const renderAuthForm = () => {
    switch (currentView) {
      case 'signIn':
        return (
          <SignInForm
            onSubmit={handleSignIn}
            onForgotPassword={() => setCurrentView('forgotPassword')}
            onCreateAccount={() => setCurrentView('signUp')}
            loading={loading}
          />
        );
      case 'signUp':
        return (
          <SignUpForm
            onSubmit={handleSignUp}
            onSignIn={() => setCurrentView('signIn')}
            loading={loading}
          />
        );
      case 'forgotPassword':
        return (
          <PasswordResetForm
            onSubmit={handlePasswordReset}
            onCancel={() => setCurrentView('signIn')}
            loading={loading}
          />
        );
      case 'newPassword':
        return (
          <NewPasswordForm
            onSubmit={handleNewPassword}
            loading={loading}
          />
        );
    }
  };

  // Determine title and subtitle based on current view
  const getAuthLayoutProps = () => {
    switch (currentView) {
      case 'signIn':
        return {
          title: 'Sign In',
          subtitle: 'Welcome back! Sign in to your account',
        };
      case 'signUp':
        return {
          title: 'Create Account',
          subtitle: 'Sign up to start using bikR',
        };
      case 'forgotPassword':
        return {
          title: 'Reset Password',
          subtitle: 'We\'ll send you a link to reset your password',
        };
      case 'newPassword':
        return {
          title: 'Set New Password',
          subtitle: 'Create a new password for your account',
        };
    }
  };

  const { title, subtitle } = getAuthLayoutProps();

  return (
    <View style={styles.container}>
      <AuthLayout title={title} subtitle={subtitle}>
        {renderAuthForm()}
      </AuthLayout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default EmailPasswordAuth;
