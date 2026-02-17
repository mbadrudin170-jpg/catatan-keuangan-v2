import { Stack } from 'expo-router';
import { KategoriProvider } from '../context/KategoriContext';

export default function RootLayout() {
  return (
    <KategoriProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="form-kategori" />
      </Stack>
    </KategoriProvider>
  );
}
