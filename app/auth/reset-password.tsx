import React from 'react';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

import AuthLayout from '../../components/auth/AuthLayout';
import PasswordResetForm from '../../components/auth/PasswordResetForm';
import { useAuth } from '../../hooks/useAuth';
import { passwordResetSchema } from '../../components/auth/authSchemas';
import { ThemedView } from '../../components/ThemedView';
import { useAuthNavigation } from '../../components/auth/AuthNavigationHelper';

export default function ResetPasswordScreen() {
  const [loading, setLoading] = React.useState(false);
  const { resetPassword } = useAuth();

  // Handle password reset form submission
  const handleResetPassword = async (data: z.infer<typeof passwordResetSchema>) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      // Show a success message or redirect
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use our navigation helper to navigate back to sign in
  const { navigateToSignIn } = useAuthNavigation();
  
  const handleCancel = () => {
    navigateToSignIn();
  };

  return (
    <ThemedView style={styles.container}>
      <AuthLayout 
        title="Reset Password" 
        subtitle="We'll send you a link to reset your password"
      >
        <PasswordResetForm
          onSubmit={handleResetPassword}
          onCancel={handleCancel}
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
