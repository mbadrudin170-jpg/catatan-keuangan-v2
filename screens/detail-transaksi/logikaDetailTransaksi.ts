// screens/detail-transaksi/logikaDetailTransaksi.ts
import { useTransaksi } from '@/context/TransaksiContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

interface TipeLogikaDetailTransaksi {
  isLoading: boolean;
  hapusTransaksi: () => Promise<void>;
}

export function useLogikaDetailTransaksi(): TipeLogikaDetailTransaksi {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hapusSatuTransaksi } = useTransaksi();
  const [isLoading, setIsLoading] = useState(false);

  const hapusTransaksi = async (): Promise<void> => {
    if (!id) return;

    setIsLoading(true);
    try {
      await hapusSatuTransaksi(Number(id));
      router.back();
    } catch (error) {
      console.error('Gagal menghapus transaksi:', error);
      // Di sini bisa ditambahkan logika untuk menampilkan notifikasi error kepada pengguna
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, hapusTransaksi };
}
