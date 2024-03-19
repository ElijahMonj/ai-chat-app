import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import {User, onAuthStateChanged} from 'firebase/auth';

import AuthScreen from './AuthScreen';
import { FIREBASE_AUTH,FIREBASE_AUTH_WEB } from '@/FirebaseConfig';
import { Platform } from 'react-native';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [user,setUser] = useState<User | null>(null);
  useEffect(() => {
    if(Platform.OS === 'web'){
      onAuthStateChanged(FIREBASE_AUTH_WEB, (user) => {
        setUser(user);
      });
    }else{
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user);
      });
    }

  }, []);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (user) {
    return <RootLayoutNav />;
  }else{
    return <AuthScreen/>
  }
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="CharacterProfile" options={{ presentation: 'modal', title:"char" }} />
        
      </Stack>
    </ThemeProvider>
  );
}
