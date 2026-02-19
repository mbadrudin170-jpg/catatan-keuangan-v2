import { Stack } from 'expo-router';

export default function FormLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="form-dompet" />
      <Stack.Screen name="form-kategori" />
      <Stack.Screen name="form-transaksi" />
    </Stack>
  );
}
