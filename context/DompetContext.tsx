// context/DompetContext.tsx
import type { JSX, ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import db from '../database/sqlite';
import type { Dompet } from '../database/tipe';

// Menggunakan kembali tipe ini untuk form edit juga
export interface DataFormDompet {
  namaDompet: string;
  saldoAwal: string; // Saldo direpresentasikan sebagai string di form
  tipe: string;
  ikon: string;
}

interface ContextDompetType {
  dataForm: DataFormDompet;
  setDataForm: React.Dispatch<React.SetStateAction<DataFormDompet>>;
  daftarDompet: Dompet[];
  memuat: boolean;
  muatDaftarDompet: () => void;
  muatDompetTunggal: (id: number) => Dompet | null;
  simpanDompetBaru: () => Promise<void>;
  perbaruiDompet: (id: number) => Promise<void>;
  hapusDompet: (id: number) => Promise<void>;
  modalTipeTerlihat: boolean;
  bukaModalTipe: () => void;
  tutupModalTipe: () => void;
}

const DompetContext = createContext<ContextDompetType | undefined>(undefined);

export function DompetProvider({ children }: { children: ReactNode }): JSX.Element {
  const [dataForm, setDataForm] = useState<DataFormDompet>({
    namaDompet: '',
    saldoAwal: '',
    tipe: '',
    ikon: '',
  });
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);
  const [modalTipeTerlihat, setModalTipeTerlihat] = useState(false);
  const [memuat, setMemuat] = useState(true);

  const muatDaftarDompet = (): void => {
    setMemuat(true);
    try {
      const hasil = db.getAllSync<Dompet>('SELECT id, nama, saldo, tipe, ikon FROM dompet');
      setDaftarDompet(hasil);
    } catch (error) {
      console.error('Gagal memuat daftar dompet:', error);
    } finally {
      setMemuat(false);
    }
  };

  const muatDompetTunggal = (id: number): Dompet | null => {
    try {
      const hasil = db.getFirstSync<Dompet>('SELECT * FROM dompet WHERE id = ?', id);
      return hasil ?? null;
    } catch (error) {
      console.error(`Gagal memuat dompet dengan id ${id}:`, error);
      return null;
    }
  };

  const simpanDompetBaru = async (): Promise<void> => {
    if (!dataForm.namaDompet.trim()) {
      Alert.alert('Validasi Gagal', 'Nama dompet tidak boleh kosong.');
      throw new Error('Nama dompet tidak boleh kosong.');
    }
    const saldoNumerik = parseFloat(dataForm.saldoAwal.replace(/[^0-9]/g, '')) || 0;
    try {
      db.runSync(
        'INSERT INTO dompet (nama, saldo, tipe, ikon) VALUES (?, ?, ?, ?);',
        dataForm.namaDompet.trim(),
        saldoNumerik,
        dataForm.tipe,
        dataForm.ikon
      );
      muatDaftarDompet();
    } catch (error) {
      console.error('Gagal menyimpan dompet baru:', error);
      throw error;
    }
  };

  const perbaruiDompet = async (id: number): Promise<void> => {
    if (!dataForm.namaDompet.trim()) {
      Alert.alert('Validasi Gagal', 'Nama dompet tidak boleh kosong.');
      throw new Error('Nama dompet tidak boleh kosong.');
    }
    const saldoNumerik = parseFloat(dataForm.saldoAwal.replace(/[^0-9]/g, '')) || 0;
    try {
      db.runSync(
        'UPDATE dompet SET nama = ?, saldo = ?, tipe = ?, ikon = ? WHERE id = ?;',
        dataForm.namaDompet.trim(),
        saldoNumerik,
        dataForm.tipe,
        dataForm.ikon,
        id
      );
      muatDaftarDompet();
    } catch (error) {
      console.error(`Gagal memperbarui dompet dengan id ${id}:`, error);
      throw error;
    }
  };

  const hapusDompet = async (id: number): Promise<void> => {
    try {
      db.runSync('DELETE FROM dompet WHERE id = ?;', id);
      muatDaftarDompet(); // Refresh daftar setelah menghapus
    } catch (error) {
      console.error(`Gagal menghapus dompet dengan id ${id}:`, error);
      throw error;
    }
  };

  const bukaModalTipe = (): void => setModalTipeTerlihat(true);
  const tutupModalTipe = (): void => setModalTipeTerlihat(false);

  useEffect(() => {
    muatDaftarDompet();
  }, []);

  return (
    <DompetContext.Provider
      value={{
        dataForm,
        setDataForm,
        daftarDompet,
        memuat,
        muatDaftarDompet,
        muatDompetTunggal,
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
