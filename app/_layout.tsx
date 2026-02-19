// app/_layout.tsx
import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DompetProvider } from '../context/DompetContext';
import { KategoriProvider } from '../context/KategoriContext';
import { TransaksiProvider } from '../context/TransaksiContext';
import { inisialisasiDB } from '../database/sqlite';

// Mencegah splash screen hilang secara otomatis
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbInisialisasi, setDbInisialisasi] = useState(false);

  useEffect(() => {
    async function setupAplikasi() {
      try {
        await inisialisasiDB();
        console.log('Inisialisasi DB dari _layout berhasil.');

        if (Platform.OS === 'android') {
          NavigationBar.setButtonStyleAsync('dark');
        }
      } catch (e) {
        console.error('Gagal melakukan setup aplikasi dari _layout:', e);
      } finally {
        setDbInisialisasi(true);
      }
    }

    setupAplikasi();
  }, []);

  const onLayoutRootView = useCallback(async () => {
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
