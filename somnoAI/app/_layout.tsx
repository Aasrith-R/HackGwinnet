import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import GradientBackground from '@/components/ui/GradientBackground';
import theme from '@/constants/theme';
import { AuthProvider, useAuth } from '@/lib/auth-context';

// Auth guard component to handle protected routes
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!user && !inAuthGroup) {
      // Redirect to sign in if not authenticated
      router.replace('/(auth)/signin');
    } else if (user && inAuthGroup) {
      // Redirect to main app if already authenticated
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const tokens = (theme as any).Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  // Start from DefaultTheme so required fields (fonts, etc.) are present
  const navTheme = {
    ...DefaultTheme,
    dark: colorScheme === 'dark',
    colors: {
      ...DefaultTheme.colors,
      primary: tokens.accent,
      background: tokens.background,
      card: tokens.card,
      text: tokens.text,
      border: tokens.muted,
      notification: tokens.accentSecondary,
    },
  };

  return (
    <AuthProvider>
      <GestureHandlerRootView style={styles.root}>
        <ThemeProvider value={navTheme}>
          <AuthGuard>
            <GradientBackground variant={colorScheme === 'dark' ? 'sleep' : 'wake'}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" redirect />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </GradientBackground>
          </AuthGuard>
        </ThemeProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
