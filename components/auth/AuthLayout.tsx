import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#121212' }, 'background');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333333' }, 'tabIconDefault');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView 
          style={[
            styles.container, 
            { backgroundColor, borderColor }
          ]}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText style={styles.subtitle}>
                {subtitle}
              </ThemedText>
            )}
          </View>
          <View style={styles.formContainer}>
            {children}
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
    maxWidth: 500,
    alignSelf: 'center',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  formContainer: {
    padding: 24,
    gap: 16,
  },
});

export default AuthLayout;
