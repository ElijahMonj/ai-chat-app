import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import {User, onAuthStateChanged} from 'firebase/auth';
import { Text,View } from '@/components/Themed';
import AuthScreen from './AuthScreen';
import { FIREBASE_AUTH } from '@/FirebaseConfig';


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
  const [user,setUser] = useState<User | null | number>(0);
  useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user);
      });
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
  }else if(user===0){
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  else{
    return <AuthScreen/>
  }
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
        <Stack.Screen name="CharacterProfile" options={{ presentation: 'card', title:"Character" }} />
        <Stack.Screen name="conversation/[id]" options={{ presentation: 'card', title:"" }} />
        <Stack.Screen name="edit" options={{ presentation: 'card', title: "Edit Character"
        }} />
      </Stack>
    </ThemeProvider>
  );
}
