import { Stack } from 'expo-router';

export default function DetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Menyembunyikan header untuk semua screen di folder detail
      }}
    >
      <Stack.Screen name="dompet/[id]" />
    </Stack>
  );
}
