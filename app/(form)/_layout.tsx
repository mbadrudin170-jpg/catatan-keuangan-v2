import { Stack } from 'expo-router';
import type { JSX } from 'react';

export default function FormLayout(): JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="form-dompet" />
      <Stack.Screen name="form-kategori" />
      <Stack.Screen name="form-transaksi" />
    </Stack>
  );
}
