// context/DompetContext.tsx
import type { JSX, ReactNode } from 'react';
// DIUBAH: Impor useCallback untuk stabilisasi fungsi
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  ambilSemuaDompet,
  ambilSatuDompet,
  tambahDompet as dbTambahDompet,
  perbaruiDompet as dbPerbaruiDompet,
  hapusDompet as dbHapusDompet,
} from '@/database/operasi';
import type { Dompet } from '@/database/tipe';

export interface FormDompet {
  nama: string;
  saldo: string;
  tipe: string;
  ikon: string;
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
  modalTipeTerlihat: boolean;
  bukaModalTipe: () => void;
  tutupModalTipe: () => void;
}

const DompetContext = createContext<ContextDompetType | undefined>(undefined);

export function DompetProvider({ children }: { children: ReactNode }): JSX.Element {
  const [formDompet, setFormDompet] = useState<FormDompet>({
    nama: '',
    saldo: '',
    tipe: '',
    ikon: '',
  });
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);
  const [modalTipeTerlihat, setModalTipeTerlihat] = useState(false);
  const [memuat, setMemuat] = useState(true);

  // DIUBAH: Bungkus dengan useCallback untuk mencegah pembuatan ulang fungsi
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
  }, []); // Dependensi kosong karena tidak bergantung pada state/props dari provider

  // DIUBAH: Bungkus dengan useCallback
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
  }, []); // Dependensi kosong karena setFormDompet dijamin stabil oleh React

  // DIUBAH: Bungkus dengan useCallback dan tambahkan dependensi
  const simpanDompetBaru = useCallback(async (): Promise<void> => {
    if (!formDompet.nama.trim()) {
      Alert.alert('Validasi Gagal', 'Nama dompet tidak boleh kosong.');
      throw new Error('Nama dompet tidak boleh kosong.');
    }
    const saldoNumerik = parseFloat(formDompet.saldo.replace(/[^0-9]/g, '')) || 0;
    try {
      await dbTambahDompet(
        formDompet.nama.trim(),
        saldoNumerik,
        formDompet.tipe,
        formDompet.ikon
      );
      await muatUlangDaftarDompet();
    } catch (error) {
      console.error('Gagal menyimpan dompet baru:', error);
      throw error;
    }
    // Dependensi: fungsi ini bergantung pada `formDompet` dan `muatUlangDaftarDompet`
  }, [formDompet, muatUlangDaftarDompet]);

  // DIUBAH: Bungkus dengan useCallback dan tambahkan dependensi
  const perbaruiDompet = useCallback(async (id: number): Promise<void> => {
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
        formDompet.tipe,
        formDompet.ikon
      );
      await muatUlangDaftarDompet();
    } catch (error) {
      console.error(`Gagal memperbarui dompet dengan id ${id}:`, error);
      throw error;
    }
    // Dependensi: fungsi ini bergantung pada `formDompet` dan `muatUlangDaftarDompet`
  }, [formDompet, muatUlangDaftarDompet]);

  // DIUBAH: Bungkus dengan useCallback dan tambahkan dependensi
  const hapusDompet = useCallback(async (id: number): Promise<void> => {
    try {
      await dbHapusDompet(id);
      await muatUlangDaftarDompet();
    } catch (error) {
      console.error(`Gagal menghapus dompet dengan id ${id}:`, error);
      throw error;
    }
  }, [muatUlangDaftarDompet]);

  // DIUBAH: Bungkus dengan useCallback untuk konsistensi
  const bukaModalTipe = useCallback((): void => setModalTipeTerlihat(true), []);
  const tutupModalTipe = useCallback((): void => setModalTipeTerlihat(false), []);

  useEffect(() => {
    void muatUlangDaftarDompet();
    // Dependensi di sini sudah benar karena muatUlangDaftarDompet sekarang stabil
  }, [muatUlangDaftarDompet]);

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
        modalTipeTerlihat,
        bukaModalTipe,
        tutupModalTipe,
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
