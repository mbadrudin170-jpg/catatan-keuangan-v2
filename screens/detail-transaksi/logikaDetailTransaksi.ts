// screens/detail-transaksi/logikaDetailTransaksi.ts
import { useTransaksi } from '@/context/TransaksiContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export function useLogikaDetailTransaksi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { hapusSatuTransaksi } = useTransaksi();
  const [isLoading, setIsLoading] = useState(false);

  const hapusTransaksi = async () => {
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
