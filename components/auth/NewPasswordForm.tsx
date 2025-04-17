import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { ThemedText } from '../ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { newPasswordSchema } from './authSchemas';

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

interface NewPasswordFormProps {
  onSubmit: (data: NewPasswordFormValues) => Promise<void>;
  loading?: boolean;
}

// Simple password strength component - same as in SignUpForm
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

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  
  const inputBgColor = useThemeColor({ light: '#fff', dark: '#1e1e1e' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'tabIconDefault');
  const placeholderColor = useThemeColor({ light: '#9BA1A6', dark: '#6c757d' }, 'tabIconDefault');
  const primaryColor = useThemeColor({ light: '#0a7ea4', dark: '#0a7ea4' }, 'tint');

  return (
    <View style={styles.container}>
      <ThemedText style={styles.instructions}>
        Create a new password for your account. For security, your password should be at least 8 characters and include uppercase, lowercase, and numbers.
      </ThemedText>
      
      <View style={styles.formGroup}>
        <ThemedText style={styles.label}>New Password</ThemedText>
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
              placeholder="Create a new password"
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
        <ThemedText style={styles.label}>Confirm New Password</ThemedText>
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
              placeholder="Confirm your new password"
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

      <TouchableOpacity
        style={[styles.button, { backgroundColor: primaryColor }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <ThemedText style={styles.buttonText}>Update Password</ThemedText>
        )}
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

export default NewPasswordForm;
