// context/DompetContext.tsx
import type { JSX, ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  ambilSatuDompet,
  ambilSemuaDompet,
  hapusDompet as dbHapusDompet,
  // Mengimpor fungsi baru
  hapusSemuaDompet as dbHapusSemuaDompet,
  perbaruiDompet as dbPerbaruiDompet,
  tambahDompet as dbTambahDompet,
} from '@/database/operasi';
import type { Dompet } from '@/database/tipe';

export interface FormDompet {
  nama: string;
  saldo: string;
  tipe: string;
  ikon: string;
}

interface DompetProviderProps {
  children: ReactNode;
  initialDaftarDompet?: Dompet[];
}

interface ContextDompetType {
  formDompet: FormDompet;
  setFormDompet: React.Dispatch<React.SetStateAction<FormDompet>>;
  daftarDompet: Dompet[];
  memuat: boolean;
  muatUlangDaftarDompet: () => Promise<void>;
  muatDompetUntukForm: (id: number) => Promise<void>;
  simpanDompetBaru: () => Promise<void>;
  perbaruiDompet: (id: number) => Promise<void>;
  hapusDompet: (id: number) => Promise<void>;
  // Menambahkan fungsi baru ke tipe konteks
  hapusSemuaDompet: () => Promise<void>;
  modalTipeTerlihat: boolean;
  bukaModalTipe: () => void;
  tutupModalTipe: () => void;
  tambahPemasukan: (dompetId: number, jumlah: number) => Promise<void>;
  tambahPengeluaran: (dompetId: number, jumlah: number) => Promise<void>;
  tambahTransfer: (dompetAsalId: number, dompetTujuanId: number, jumlah: number) => Promise<void>;
}

const DompetContext = createContext<ContextDompetType | undefined>(undefined);

export function DompetProvider({ children, initialDaftarDompet }: DompetProviderProps): JSX.Element {
  const [formDompet, setFormDompet] = useState<FormDompet>({
    nama: '',
    saldo: '',
    tipe: '',
    ikon: '',
  });
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>(initialDaftarDompet || []);
  const [modalTipeTerlihat, setModalTipeTerlihat] = useState(false);
  const [memuat, setMemuat] = useState(!initialDaftarDompet);

  const muatUlangDaftarDompet = useCallback(async (): Promise<void> => {
    setMemuat(true);
    try {
      const hasil = await ambilSemuaDompet();
      setDaftarDompet(hasil);
    } catch (error) {
      console.error('Gagal memuat daftar dompet:', error);
    } finally {
      setMemuat(false);
    }
  }, []);

  const muatDompetUntukForm = useCallback(async (id: number): Promise<void> => {
    try {
      const dompet = await ambilSatuDompet(id);
      if (dompet) {
        setFormDompet({
          nama: dompet.nama,
          saldo: String(dompet.saldo),
          tipe: dompet.tipe ?? '',
          ikon: dompet.ikon ?? '',
        });
      }
    } catch (error) {
      console.error(`Gagal memuat dompet dengan id ${id}:`, error);
    }
  }, []);

  const simpanDompetBaru = useCallback(async (): Promise<void> => {
    if (!formDompet.nama.trim()) {
      Alert.alert('Validasi Gagal', 'Nama dompet tidak boleh kosong.');
      throw new Error('Nama dompet tidak boleh kosong.');
    }
    const saldoNumerik = parseFloat(formDompet.saldo.replace(/[^0-9]/g, '')) || 0;
    try {
      await dbTambahDompet(formDompet.nama.trim(), saldoNumerik, formDompet.tipe, formDompet.ikon);
      await muatUlangDaftarDompet();
    } catch (error) {
      console.error('Gagal menyimpan dompet baru:', error);
      throw error;
    }
  }, [formDompet, muatUlangDaftarDompet]);

  const perbaruiDompet = useCallback(
    async (id: number): Promise<void> => {
      if (!formDompet.nama.trim()) {
        Alert.alert('Validasi Gagal', 'Nama dompet tidak boleh kosong.');
        throw new Error('Nama dompet tidak boleh kosong.');
      }
      const saldoNumerik = parseFloat(formDompet.saldo.replace(/[^0-9]/g, '')) || 0;
      try {
        await dbPerbaruiDompet(
          id,
          formDompet.nama.trim(),
          saldoNumerik,
          formDompet.tipe ?? '',
          formDompet.ikon ?? ''
        );
        await muatUlangDaftarDompet();
      } catch (error) {
        console.error(`Gagal memperbarui dompet dengan id ${id}:`, error);
        throw error;
      }
    },
    [formDompet, muatUlangDaftarDompet]
  );

  const hapusDompet = useCallback(
    async (id: number): Promise<void> => {
      try {
        await dbHapusDompet(id);
        await muatUlangDaftarDompet();
      } catch (error) {
        console.error(`Gagal menghapus dompet dengan id ${id}:`, error);
        throw error;
      }
    },
    [muatUlangDaftarDompet]
  );

  // Implementasi fungsi hapus semua dompet
  const hapusSemuaDompet = useCallback(async (): Promise<void> => {
    try {
      await dbHapusSemuaDompet();
      await muatUlangDaftarDompet(); // Memuat ulang daftar yang sekarang kosong
    } catch (error) {
      console.error('Gagal menghapus semua dompet:', error);
      throw error;
    }
  }, [muatUlangDaftarDompet]);

  const tambahPemasukan = useCallback(
    async (dompetId: number, jumlah: number): Promise<void> => {
      try {
        const dompet = await ambilSatuDompet(dompetId);
        if (!dompet) throw new Error('Dompet tidak ditemukan');
        const saldoBaru = dompet.saldo + jumlah;
        await dbPerbaruiDompet(
          dompet.id,
          dompet.nama,
          saldoBaru,
          dompet.tipe ?? '',
          dompet.ikon ?? ''
        );
        await muatUlangDaftarDompet();
      } catch (error) {
        console.error('Gagal menambah pemasukan:', error);
        throw error;
      }
    },
    [muatUlangDaftarDompet]
  );

  const tambahPengeluaran = useCallback(
    async (dompetId: number, jumlah: number): Promise<void> => {
      try {
        const dompet = await ambilSatuDompet(dompetId);
        if (!dompet) throw new Error('Dompet tidak ditemukan');
        const saldoBaru = dompet.saldo - jumlah;
        await dbPerbaruiDompet(
          dompet.id,
          dompet.nama,
          saldoBaru,
          dompet.tipe ?? '',
          dompet.ikon ?? ''
        );
        await muatUlangDaftarDompet();
      } catch (error) {
        console.error('Gagal menambah pengeluaran:', error);
        throw error;
      }
    },
    [muatUlangDaftarDompet]
  );

  const tambahTransfer = useCallback(
    async (dompetAsalId: number, dompetTujuanId: number, jumlah: number): Promise<void> => {
      try {
        const dompetAsal = await ambilSatuDompet(dompetAsalId);
        if (!dompetAsal) throw new Error('Dompet asal tidak ditemukan');

        const dompetTujuan = await ambilSatuDompet(dompetTujuanId);
        if (!dompetTujuan) throw new Error('Dompet tujuan tidak ditemukan');

        const saldoBaruAsal = dompetAsal.saldo - jumlah;
        const saldoBaruTujuan = dompetTujuan.saldo + jumlah;

        await dbPerbaruiDompet(
          dompetAsal.id,
          dompetAsal.nama,
          saldoBaruAsal,
          dompetAsal.tipe ?? '',
          dompetAsal.ikon ?? ''
        );
        await dbPerbaruiDompet(
          dompetTujuan.id,
          dompetTujuan.nama,
          saldoBaruTujuan,
          dompetTujuan.tipe ?? '',
          dompetTujuan.ikon ?? ''
        );

        await muatUlangDaftarDompet();
      } catch (error) {
        console.error('Gagal melakukan transfer:', error);
        throw error;
      }
    },
    [muatUlangDaftarDompet]
  );

  const bukaModalTipe = useCallback((): void => setModalTipeTerlihat(true), []);
  const tutupModalTipe = useCallback((): void => setModalTipeTerlihat(false), []);

  useEffect(() => {
    if (!initialDaftarDompet) {
      void muatUlangDaftarDompet();
    }
  }, [muatUlangDaftarDompet, initialDaftarDompet]);

  return (
    <DompetContext.Provider
      value={{
        formDompet,
        setFormDompet,
        daftarDompet,
        memuat,
        muatUlangDaftarDompet,
        muatDompetUntukForm,
        simpanDompetBaru,
        perbaruiDompet,
        hapusDompet,
        // Menyediakan fungsi baru melalui konteks
        hapusSemuaDompet,
        modalTipeTerlihat,
        bukaModalTipe,
        tutupModalTipe,
        tambahPemasukan,
        tambahPengeluaran,
        tambahTransfer,
      }}
    >
      {children}
    </DompetContext.Provider>
  );
}

export const useDompet = (): ContextDompetType => {
  const context = useContext(DompetContext);
  if (context === undefined) {
    throw new Error('useDompet harus digunakan di dalam DompetProvider');
  }
  return context;
};
