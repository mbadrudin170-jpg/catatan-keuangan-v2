// app/_layout.tsx
import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { JSX } from 'react';

import { DompetProvider } from '@/context/DompetContext';
import { KategoriProvider } from '@/context/KategoriContext';
import { TransaksiProvider } from '@/context/TransaksiContext';
import { inisialisasiDB } from '@/database/sqlite';

// Mencegah splash screen hilang secara otomatis
void SplashScreen.preventAutoHideAsync();

export default function RootLayout(): JSX.Element | null {
  const [dbInisialisasi, setDbInisialisasi] = useState(false);

  useEffect(() => {
    async function setupAplikasi(): Promise<void> {
      try {
        await inisialisasiDB();

        if (Platform.OS === 'android') {
          await NavigationBar.setButtonStyleAsync('dark');
          await NavigationBar.setBackgroundColorAsync('#FFFFFF');
        }
      } catch (e) {
        // Gagal melakukan setup aplikasi dari _layout
      } finally {
        setDbInisialisasi(true);
      }
    }

    void setupAplikasi();
  }, []);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (dbInisialisasi) {
      await SplashScreen.hideAsync();
    }
  }, [dbInisialisasi]);

  if (!dbInisialisasi) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <TransaksiProvider>
          <KategoriProvider>
            <DompetProvider>
              <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />

                {/* Definisikan rute untuk form di sini agar bisa diakses */}
                <Stack.Screen name="(form)" />
                <Stack.Screen name="(detail)" />
                <Stack.Screen name="(lainnya)" />
              </Stack>
              <StatusBar style="dark" />
            </DompetProvider>
          </KategoriProvider>
        </TransaksiProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
