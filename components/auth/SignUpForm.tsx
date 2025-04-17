import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { useThemeColor } from '../../hooks/useThemeColor';
import { signUpSchema } from './authSchemas';

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (data: SignUpFormValues) => Promise<void>;
  onSignIn: () => void;
  loading?: boolean;
}

// Simple password strength component
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: 'No password', color: '#dc3545' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    const strengthMap = [
      { label: 'Very weak', color: '#dc3545' },
      { label: 'Weak', color: '#ffc107' },
      { label: 'Fair', color: '#fd7e14' },
      { label: 'Good', color: '#20c997' },
      { label: 'Strong', color: '#198754' },
    ];
    
    return { 
      strength, 
      ...strengthMap[Math.min(strength, 4)] 
    };
  };
  
  const { strength, label, color } = getStrength();
  const percentage = (strength / 4) * 100;
  
  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBarContainer}>
        <View 
          style={[
            styles.strengthBar, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <ThemedText style={[styles.strengthLabel, { color }]}>{label}</ThemedText>
    </View>
  );
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  onSignIn,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  
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
              placeholder="Create a password"
              placeholderTextColor={placeholderColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="password-new"
              editable={!loading}
            />
          )}
        />
        {errors.password ? (
          <ThemedText style={styles.errorText}>{errors.password.message}</ThemedText>
        ) : (
          password.length > 0 && <PasswordStrengthIndicator password={password} />
        )}
      </View>

      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>Confirm Password</ThemedText>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBgColor, borderColor },
                errors.confirmPassword && styles.inputError,
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={placeholderColor}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="password-new"
              editable={!loading}
            />
          )}
        />
        {errors.confirmPassword && (
          <ThemedText style={styles.errorText}>{errors.confirmPassword.message}</ThemedText>
        )}
      </View>

      <View style={styles.formGroup}>
        <View style={styles.termsContainer}>
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#767577', true: primaryColor }}
                thumbColor="#f4f3f4"
                ios_backgroundColor="#767577"
                disabled={loading}
              />
            )}
          />
          <ThemedText style={styles.termsText}>
            I accept the Terms of Service and Privacy Policy
          </ThemedText>
        </View>
        {errors.acceptTerms && (
          <ThemedText style={styles.errorText}>{errors.acceptTerms.message}</ThemedText>
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
          <ThemedText style={styles.buttonText}>Create Account</ThemedText>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <ThemedText>Already have an account? </ThemedText>
        <TouchableOpacity onPress={onSignIn} disabled={loading}>
          <ThemedText type="link">Sign in</ThemedText>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  termsText: {
    flex: 1,
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
  strengthContainer: {
    marginTop: 4,
  },
  strengthBarContainer: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default SignUpForm;
