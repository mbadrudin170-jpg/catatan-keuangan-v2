// screens/detail-dompet/logikaDetailDompet.ts

import { useLocalSearchParams, useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import type { Dompet } from '@/database/tipe';

// Tipe untuk nilai yang akan disediakan oleh Context
interface TipeDetailDompetContext {
  dompet: Dompet | null;
  memuat: boolean;
  onHapus: () => void;
}

// 1. Membuat Context
const DetailDompetContext = createContext<TipeDetailDompetContext | null>(null);

// 2. Hook untuk memuat logika utama
export function useDetailDompet(): TipeDetailDompetContext {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const { muatDompetTunggal, hapusDompet } = useDompet();
  const router = useRouter();
  const [dompet, setDompet] = useState<Dompet | null>(null);
  const [memuat, setMemuat] = useState(true);

  const idNumerik = idString ? parseInt(idString, 10) : NaN;

  useEffect(() => {
    if (!isNaN(idNumerik)) {
      setMemuat(true);
      const dataDompet = muatDompetTunggal(idNumerik);
      setDompet(dataDompet);
      setMemuat(false);
    } else {
      // Jika ID tidak valid, berhenti memuat
      setMemuat(false);
    }
  }, [idNumerik, muatDompetTunggal]);

  const onHapus = (): void => {
    if (isNaN(idNumerik)) return;

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
          onPress: async (): Promise<void> => {
            try {
              await hapusDompet(idNumerik);
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
export function useDetailDompetContext(): TipeDetailDompetContext {
  const konteks = useContext(DetailDompetContext);
  if (!konteks) {
    throw new Error('useDetailDompetContext harus digunakan di dalam DetailDompetProvider');
  }
  return konteks;
}

// 4. Mengekspor Provider agar bisa digunakan oleh komponen induk
export const DetailDompetProvider = DetailDompetContext.Provider;
