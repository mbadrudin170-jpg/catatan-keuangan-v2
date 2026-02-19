// ~/catatan-keuangan-v2/screens/detail-dompet/logikaDetailDompet.ts

import { useLocalSearchParams, useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { Dompet } from '@/database/tipe';

// Tipe untuk nilai yang akan disediakan oleh Context
interface TipeDetailDompetContext {
  dompet: Dompet | null;
  memuat: boolean;
  onHapus: () => void;
}

// 1. Membuat Context
const DetailDompetContext = createContext<TipeDetailDompetContext | null>(null);

// 2. Hook untuk memuat logika utama
export function useDetailDompet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { muatDompetTunggal, hapusDompet } = useDompet();
  const router = useRouter();
  const [dompet, setDompet] = useState<Dompet | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    if (id) {
      setMemuat(true);
      const dataDompet = muatDompetTunggal(id);
      setDompet(dataDompet);
      setMemuat(false);
    } else {
      setMemuat(false);
    }
  }, [id, muatDompetTunggal]);

  const onHapus = () => {
    if (!id) return;

    Alert.alert(
      'Hapus Dompet',
      'Apakah Anda yakin ingin menghapus dompet ini? Semua transaksi yang terkait juga akan terhapus.',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          // Menggunakan async/await untuk menangani Promise dengan benar
          onPress: async () => {
            try {
              await hapusDompet(id);
              router.back(); // Kembali jika berhasil
            } catch (error) {
              console.error('Gagal saat mencoba menghapus dompet:', error);
              Alert.alert('Gagal', 'Gagal menghapus dompet. Silakan coba lagi.');
            }
          },
        },
      ]
    );
  };

  return { dompet, memuat, onHapus };
}

// 3. Hook untuk komponen anak agar bisa mengakses Context
export function useDetailDompetContext() {
  const konteks = useContext(DetailDompetContext);
  if (!konteks) {
    throw new Error('useDetailDompetContext harus digunakan di dalam DetailDompetProvider');
  }
  return konteks;
}

// 4. Mengekspor Provider agar bisa digunakan oleh komponen induk
export const DetailDompetProvider = DetailDompetContext.Provider;
