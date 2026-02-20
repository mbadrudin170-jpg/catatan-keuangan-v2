// screens/detail-dompet/logikaDetailDompet.tsx
import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

import { useDompet } from '@/context/DompetContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Dompet, Transaksi } from '@/database/tipe';

interface DetailDompetContextType {
  dompet: Dompet | null;
  transaksiDompet: Transaksi[];
  memuat: boolean;
  modalTerlihat: boolean;
  saldo: number;
  pemasukan: number;
  pengeluaran: number;
  hapusDompet: (id: number) => Promise<void>;
  bukaModal: () => void;
  tutupModal: () => void;
}

const DetailDompetContext = createContext<DetailDompetContextType | undefined>(undefined);

export const DetailDompetProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const idNumerik = parseInt(id || '0', 10);

  const { ambilDompetDenganId, hapusDompet: hapusDompetDariKonteks, memuat: memuatDompet } = useDompet();
  const { semuaTransaksi, memuat: memuatTransaksi } = useTransaksi();

  const [modalTerlihat, setModalTerlihat] = useState(false);

  const dompet = useMemo(() => ambilDompetDenganId(idNumerik) || null, [ambilDompetDenganId, idNumerik]);

  const transaksiDompet = useMemo(() => {
    return semuaTransaksi.filter(
      (t: Transaksi) => t.dompet_id === idNumerik || t.dompet_tujuan_id === idNumerik
    );
  }, [semuaTransaksi, idNumerik]);

  const { pemasukan, pengeluaran } = useMemo(() => {
    let hitungPemasukan = 0;
    let hitungPengeluaran = 0;

    transaksiDompet.forEach((transaksi: Transaksi) => {
      if (transaksi.tipe === 'pemasukan' && transaksi.dompet_id === idNumerik) {
        hitungPemasukan += transaksi.jumlah;
      } else if (transaksi.tipe === 'pengeluaran' && transaksi.dompet_id === idNumerik) {
        hitungPengeluaran += transaksi.jumlah;
      } else if (transaksi.tipe === 'transfer') {
        if (transaksi.dompet_id === idNumerik) {
          hitungPengeluaran += transaksi.jumlah;
        }
        if (transaksi.dompet_tujuan_id === idNumerik) {
          hitungPemasukan += transaksi.jumlah;
        }
      }
    });

    return { pemasukan: hitungPemasukan, pengeluaran: hitungPengeluaran };
  }, [transaksiDompet, idNumerik]);

  const saldo = useMemo(() => {
    if (!dompet) return 0;
    // DIUBAH: Menggunakan `dompet.saldo` (saldo awal) sebagai dasar perhitungan
    return dompet.saldo + pemasukan - pengeluaran;
  }, [dompet, pemasukan, pengeluaran]);

  const bukaModal = useCallback(() => setModalTerlihat(true), []);
  const tutupModal = useCallback(() => setModalTerlihat(false), []);

  const hapusDompet = async (idHapus: number) => {
    await hapusDompetDariKonteks(idHapus);
    tutupModal();
  };

  const memuat = memuatDompet || memuatTransaksi;

  const nilai = useMemo(
    () => ({
      dompet,
      transaksiDompet,
      memuat,
      modalTerlihat,
      pemasukan,
      pengeluaran,
      saldo,
      hapusDompet,
      bukaModal,
      tutupModal,
    }),
    [dompet, transaksiDompet, memuat, modalTerlihat, pemasukan, pengeluaran, saldo, hapusDompet, bukaModal, tutupModal]
  );

  return <DetailDompetContext.Provider value={nilai}>{children}</DetailDompetContext.Provider>;
};

export const useDetailDompet = () => {
  const context = useContext(DetailDompetContext);
  if (context === undefined) {
    throw new Error('useDetailDompet harus digunakan di dalam DetailDompetProvider');
  }
  return context;
};
