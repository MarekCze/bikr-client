import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ThemedText } from '../ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { passwordResetSchema } from './authSchemas';

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  onSubmit: (data: PasswordResetFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const inputBgColor = useThemeColor({ light: '#fff', dark: '#1e1e1e' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'tabIconDefault');
  const placeholderColor = useThemeColor({ light: '#9BA1A6', dark: '#6c757d' }, 'tabIconDefault');
  const primaryColor = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.instructions}>
        Enter your email address below, and we'll send you a link to reset your password.
      </ThemedText>
      
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBgColor, borderColor },
                errors.email && styles.inputError,
              ]}
              placeholder="Your email address"
              placeholderTextColor={placeholderColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              editable={!loading}
            />
          )}
        />
        {errors.email && (
          <ThemedText style={styles.errorText}>{errors.email.message}</ThemedText>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>Send Reset Link</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={loading}
      >
        <ThemedText type="link">Back to Sign In</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  instructions: {
    marginBottom: 16,
    lineHeight: 20,
  },
  formGroup: {
    width: '100%',
    gap: 4,
  },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 8,
  },
});

export default PasswordResetForm;
