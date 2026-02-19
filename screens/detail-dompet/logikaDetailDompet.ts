// screens/detail-dompet/logikaDetailDompet.ts
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { ambilSatuDompet } from '@/database/operasi'; // <-- BARU: Impor fungsi ambil data langsung
import type { Dompet } from '@/database/tipe';

interface TipeDetailDompetContext {
  dompet: Dompet | null;
  memuat: boolean;
  onHapus: () => void;
}

const DetailDompetContext = createContext<TipeDetailDompetContext | null>(null);

export function useDetailDompet(): TipeDetailDompetContext {
  const { id: idString } = useLocalSearchParams<{ id: string }>();
  const { hapusDompet } = useDompet(); // <-- DIUBAH: Hanya butuh hapusDompet dari context
  const router = useRouter();
  const [dompet, setDompet] = useState<Dompet | null>(null);
  const [memuat, setMemuat] = useState(true);

  const idNumerik = idString ? parseInt(idString, 10) : NaN;

  // DIUBAH: Menggunakan useEffect dengan async/await
  useEffect(() => {
    if (isNaN(idNumerik)) {
      setMemuat(false);
      return;
    }

    const muatData = async (): Promise<void> => {
      setMemuat(true);
      try {
        const dataDompet = await ambilSatuDompet(idNumerik);
        setDompet(dataDompet);
      } catch (error) {
        console.error('Gagal memuat detail dompet:', error);
        setDompet(null); // Atur ke null jika ada error
      } finally {
        setMemuat(false);
      }
    };

    void muatData();
  }, [idNumerik]);

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

export function useDetailDompetContext(): TipeDetailDompetContext {
  const konteks = useContext(DetailDompetContext);
  if (!konteks) {
    throw new Error('useDetailDompetContext harus digunakan di dalam DetailDompetProvider');
  }
  return konteks;
}

export const DetailDompetProvider = DetailDompetContext.Provider;
