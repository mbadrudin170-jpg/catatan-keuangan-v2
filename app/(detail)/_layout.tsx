import { Stack } from 'expo-router';
import type { JSX } from 'react';

export default function DetailLayout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Menyembunyikan header untuk semua screen di folder detail
      }}
    >
      <Stack.Screen name="dompet/[id]" />
      <Stack.Screen name="transaksi/[id]" />
    </Stack>
  );
}
