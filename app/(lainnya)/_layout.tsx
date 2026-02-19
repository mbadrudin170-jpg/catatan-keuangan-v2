import { Stack } from 'expo-router';
import type { JSX } from 'react';

export default function LainnyaLayout(): JSX.Element {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="kategori" />
    </Stack>
  );
}
