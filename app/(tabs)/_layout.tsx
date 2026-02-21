// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout(): React.ReactNode {
  return (
    <Tabs
      screenOptions={() => ({
        tabBarActiveTintColor: '#2196F3', // Warna ikon aktif
        tabBarInactiveTintColor: '#888', // Warna ikon tidak aktif
        tabBarStyle: {
          paddingBottom: 8, // Padding bawah untuk ikon dan label
          paddingTop: 3, // Padding atas untuk ikon dan label
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
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dompet"
        options={{
          title: 'Dompet',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="anggaran"
        options={{
          title: 'Anggaran',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="pie-chart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistik"
        options={{
          title: 'Statistik',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="stats-chart" color={color} size={size} />
          ),
        }}
      />
       <Tabs.Screen
        name="kategori"
        options={{
          title: 'Kategori',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="pricetags" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
