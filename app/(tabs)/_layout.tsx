// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#2196F3', // Warna ikon aktif
        tabBarInactiveTintColor: '#888', // Warna ikon tidak aktif
        tabBarStyle: {
          height: 60, // Menambah tinggi tab bar
          paddingBottom: 8, // Padding bawah untuk ikon dan label
          paddingTop: 8, // Padding atas untuk ikon dan label
        },
        tabBarLabelStyle: {
          fontSize: 12, // Ukuran font untuk label
        },
        headerShown: false, // Menyembunyikan header default
      })}
    >
      <Tabs.Screen
        name="transaksi"
        options={{
          title: 'Transaksi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dompet"
        options={{
          title: 'Dompet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
