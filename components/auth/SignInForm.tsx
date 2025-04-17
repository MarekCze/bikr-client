import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { signInSchema } from './authSchemas';

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSubmit: (data: SignInFormValues) => Promise<void>;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
  loading?: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({
  onSubmit,
  onForgotPassword,
  onCreateAccount,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const inputBgColor = useThemeColor({ light: '#fff', dark: '#1e1e1e' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'tabIconDefault');
  const placeholderColor = useThemeColor({ light: '#9BA1A6', dark: '#6c757d' }, 'tabIconDefault');
  const primaryColor = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');

  return (
    <View style={styles.container}>
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

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Password</ThemedText>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBgColor, borderColor },
                errors.password && styles.inputError,
              ]}
              placeholder="Your password"
              placeholderTextColor={placeholderColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              editable={!loading}
            />
          )}
        />
        {errors.password && (
          <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
        )}
      </View>

      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={onForgotPassword} disabled={loading}>
          <ThemedText type="link" style={styles.forgotPassword}>
            Forgot password?
          </ThemedText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>Sign In</ThemedText>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <ThemedText>Don't have an account? </ThemedText>
        <TouchableOpacity onPress={onCreateAccount} disabled={loading}>
          <ThemedText type="link">Create an account</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: -8,
  },
  forgotPassword: {
    fontSize: 14,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default SignInForm;
