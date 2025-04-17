import React from 'react';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

import AuthLayout from '../../components/auth/AuthLayout';
import NewPasswordForm from '../../components/auth/NewPasswordForm';
import { useAuth } from '../../hooks/useAuth';
import { newPasswordSchema } from '../../components/auth/authSchemas';
import { ThemedView } from '../../components/ThemedView';
import { useAuthNavigation } from '../../components/auth/AuthNavigationHelper';

export default function NewPasswordScreen() {
  const [loading, setLoading] = React.useState(false);
  const { updatePassword } = useAuth();

  // Handle new password form submission
  const { navigateToSignIn } = useAuthNavigation();

  const handleUpdatePassword = async (data: z.infer<typeof newPasswordSchema>) => {
    setLoading(true);
    try {
      await updatePassword(data.password);
      // After password reset, redirect to sign in
      navigateToSignIn();
    } catch (error) {
      console.error('Update password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AuthLayout 
        title="Set New Password" 
        subtitle="Create a new password for your account"
      >
        <NewPasswordForm
          onSubmit={handleUpdatePassword}
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
