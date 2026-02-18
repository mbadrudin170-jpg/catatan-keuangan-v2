// app/_layout.tsx
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { KategoriProvider } from '../context/KategoriContext';
import { DompetProvider } from '../context/DompetContext';
import { inisialisasiDB } from '../database/sqlite';

export default function RootLayout() {
  useEffect(() => {
    // Fungsi async untuk setup awal aplikasi
    const setupAplikasi = async () => {
      try {
        await inisialisasiDB();
        console.log("Inisialisasi DB dari _layout berhasil.");
      } catch (error) {
        console.error("Gagal melakukan setup aplikasi dari _layout:", error);
      }
    };

    setupAplikasi();

    // Mengatur style navigasi bar di Android
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, []); // Array kosong memastikan ini hanya berjalan sekali

  return (
    <KategoriProvider>
      <DompetProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="form-kategori" />
        </Stack>
        <StatusBar style="dark" />
      </DompetProvider>
    </KategoriProvider>
  );
}
