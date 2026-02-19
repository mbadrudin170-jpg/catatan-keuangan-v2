import { Stack } from 'expo-router';

export default function LainnyaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="kategori" />
    </Stack>
  );
}
