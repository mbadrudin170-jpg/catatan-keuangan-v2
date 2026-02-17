import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { KategoriProvider } from '../context/KategoriContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }

    
  }, []);
  return (
    <KategoriProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="form-kategori" />
      </Stack>
      <StatusBar style="dark" />
    </KategoriProvider>
  );
}
