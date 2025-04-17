import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthNavigationProvider } from '../../components/auth/AuthNavigationHelper';

export default function AuthLayout() {
  return (
    <AuthNavigationProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="sign-in" 
          options={{ 
            headerShown: false,
            title: 'Sign In'
          }} 
        />
        <Stack.Screen 
          name="sign-up" 
          options={{ 
            headerShown: false,
            title: 'Sign Up'
          }} 
        />
        <Stack.Screen 
          name="reset-password" 
          options={{ 
            headerShown: false,
            title: 'Reset Password'
          }} 
        />
        <Stack.Screen 
          name="new-password" 
          options={{ 
            headerShown: false,
            title: 'New Password'
          }} 
        />
      </Stack>
    </AuthNavigationProvider>
  );
}
