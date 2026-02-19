// context/DompetContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import db from '../database/sqlite';
import { Dompet } from '../database/tipe';

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
  muatDompetTunggal: (id: string) => Dompet | null;
  simpanDompetBaru: () => Promise<void>;
  perbaruiDompet: (id: string) => Promise<void>;
  hapusDompet: (id: string) => Promise<void>; // Tambahkan ini
  modalTipeTerlihat: boolean;
  bukaModalTipe: () => void;
  tutupModalTipe: () => void;
}

const DompetContext = createContext<ContextDompetType | undefined>(undefined);

export function DompetProvider({ children }: { children: ReactNode }) {
  const [dataForm, setDataForm] = useState<DataFormDompet>({
    namaDompet: '',
    saldoAwal: '',
    tipe: '',
    ikon: '',
  });
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);
  const [modalTipeTerlihat, setModalTipeTerlihat] = useState(false);
  const [memuat, setMemuat] = useState(true);

  const muatDaftarDompet = () => {
    setMemuat(true);
    try {
      const hasil: any[] = db.getAllSync('SELECT id, nama, saldo, tipe, ikon FROM dompet');
      const dataDompet: Dompet[] = hasil.map((item) => ({
        id: item.id.toString(),
        nama: item.nama,
        saldo: item.saldo,
        tipe: item.tipe,
        ikon: item.ikon,
      }));
      setDaftarDompet(dataDompet);
    } catch (error) {
      console.error('Gagal memuat daftar dompet:', error);
    } finally {
      setMemuat(false);
    }
  };

  const muatDompetTunggal = (id: string): Dompet | null => {
    try {
      const hasil: any = db.getFirstSync('SELECT * FROM dompet WHERE id = ?', id);
      return hasil ? { ...hasil, id: hasil.id.toString() } : null;
    } catch (error) {
      console.error(`Gagal memuat dompet dengan id ${id}:`, error);
      return null;
    }
  };

  const simpanDompetBaru = async () => {
    if (!dataForm.namaDompet.trim()) {
      alert('Nama dompet tidak boleh kosong.');
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

  const perbaruiDompet = async (id: string) => {
    if (!dataForm.namaDompet.trim()) {
      alert('Nama dompet tidak boleh kosong.');
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

  // Implementasi fungsi hapusDompet
  const hapusDompet = async (id: string) => {
    try {
      db.runSync('DELETE FROM dompet WHERE id = ?;', id);
      muatDaftarDompet(); // Refresh daftar setelah menghapus
    } catch (error) {
      console.error(`Gagal menghapus dompet dengan id ${id}:`, error);
      throw error;
    }
  };

  const bukaModalTipe = () => setModalTipeTerlihat(true);
  const tutupModalTipe = () => setModalTipeTerlihat(false);

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
        hapusDompet, // Sediakan fungsi hapus
        modalTipeTerlihat,
        bukaModalTipe,
        tutupModalTipe,
      }}
    >
      {children}
    </DompetContext.Provider>
  );
}

export const useDompet = () => {
  const context = useContext(DompetContext);
  if (context === undefined) {
    throw new Error('useDompet harus digunakan di dalam DompetProvider');
  }
  return context;
};
