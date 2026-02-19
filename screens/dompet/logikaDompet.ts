import { useDompet } from '@/context/DompetContext';
import type { Dompet } from '@/database/tipe';
import { useMemo } from 'react';

export const useLogikaDompet = () => {
  const { daftarDompet, memuat } = useDompet();

  const seksiData = useMemo(() => {
    // Mengelompokkan dompet berdasarkan tipenya
    const dompetDikelompokkan = daftarDompet.reduce((acc, dompet) => {
      // Jika dompet.tipe tidak ada, kelompokkan ke dalam 'Lainnya'
      const tipe = dompet.tipe || 'Lainnya';
      if (!acc[tipe]) {
        acc[tipe] = [];
      }
      acc[tipe].push(dompet);
      return acc;
    }, {} as Record<string, Dompet[]>);

    // Membuat data untuk SectionList, termasuk menghitung total saldo per seksi
    return Object.keys(dompetDikelompokkan).map((tipe) => {
      const daftarDompetTipeIni = dompetDikelompokkan[tipe];
      const totalSaldo = daftarDompetTipeIni.reduce((total, dompet) => total + dompet.saldo, 0);
      return {
        judul: tipe,
        data: daftarDompetTipeIni,
        total: totalSaldo,
      };
    });
  }, [daftarDompet]);

  return { seksiData, memuat, daftarDompet };
};
