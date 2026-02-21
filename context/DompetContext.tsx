// context/DompetContext.tsx
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  ambilSemuaDompet,
  hapusSatuDompet,
  hapusSemuaDompet as hapusSemuaDompetDariDb,
  perbaruiSaldoDompet,
  perbaruiSatuDompet,
  tambahSatuDompet,
} from '@/database/operasi';
import type { Dompet } from '@/database/tipe';

// Tipe untuk data yang ada di dalam form dompet.
export type FormDompet = Partial<Omit<Dompet, 'id'> & { id?: number; saldo?: number }>;

const initialFormDompet: FormDompet = {
  nama: '',
  tipe: 'tunai',
  ikon: 'cash',
  saldo: 0,
};

interface DompetContextType {
  daftarDompet: Dompet[];
  tambahDompet: (dompet: Omit<Dompet, 'id'>) => Promise<void>;
  perbaruiDompet: (dompet: Omit<Dompet, 'saldo'>) => Promise<void>;
  hapusDompet: (id: number) => Promise<void>;
  tambahPemasukan: (id: number, jumlah: number) => Promise<void>;
  tambahPengeluaran: (id: number, jumlah: number) => Promise<void>;
  tambahTransfer: (idSumber: number, idTujuan: number, jumlah: number) => Promise<void>;
  ambilDompetDenganId: (id: number) => Dompet | undefined;
  memuat: boolean;
  formDompet: FormDompet;
  setFormDompet: Dispatch<SetStateAction<FormDompet>>;
  modalTipeTerlihat: boolean;
  bukaModalTipe: () => void;
  tutupModalTipe: () => void;
  muatDompetUntukForm: (id: number) => void;
  simpanDompetBaru: () => Promise<void>;
  hapusSemuaDompet: () => Promise<void>;
  muatUlangDaftarDompet: () => Promise<void>;
}

const DompetContext = createContext<DompetContextType | undefined>(undefined);

export const DompetProvider = ({ children }: { children: ReactNode }) => {
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [formDompet, setFormDompet] = useState<FormDompet>(initialFormDompet);
  const [modalTipeTerlihat, setModalTipeTerlihat] = useState(false);

  const muatUlangDaftarDompet = useCallback(async () => {
    setMemuat(true);
    try {
      const dompet = await ambilSemuaDompet();
      setDaftarDompet(dompet);
    } catch (error) {
      console.error('Gagal memuat dompet:', error);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    void muatUlangDaftarDompet();
  }, [muatUlangDaftarDompet]);

  const tambahDompet = async (dompet: Omit<Dompet, 'id'>) => {
    await tambahSatuDompet(dompet);
    await muatUlangDaftarDompet();
  };

  const perbaruiDompet = async (dompet: Omit<Dompet, 'saldo'>) => {
    await perbaruiSatuDompet(dompet);
    await muatUlangDaftarDompet();
  };

  const hapusDompet = async (id: number) => {
    await hapusSatuDompet(id);
    await muatUlangDaftarDompet();
  };

  const hapusSemuaDompet = async () => {
    await hapusSemuaDompetDariDb();
    await muatUlangDaftarDompet();
  };

  const tambahPemasukan = async (id: number, jumlah: number) => {
    await perbaruiSaldoDompet(id, jumlah);
    await muatUlangDaftarDompet();
  };

  const tambahPengeluaran = async (id: number, jumlah: number) => {
    await perbaruiSaldoDompet(id, -jumlah);
    await muatUlangDaftarDompet();
  };

  const tambahTransfer = async (idSumber: number, idTujuan: number, jumlah: number) => {
    await perbaruiSaldoDompet(idSumber, -jumlah);
    await perbaruiSaldoDompet(idTujuan, jumlah);
    await muatUlangDaftarDompet();
  };

  const ambilDompetDenganId = useCallback(
    (id: number) => {
      return daftarDompet.find((d) => d.id === id);
    },
    [daftarDompet]
  );

  // --- Logika Form ---
  const bukaModalTipe = () => setModalTipeTerlihat(true);
  const tutupModalTipe = () => setModalTipeTerlihat(false);

  const muatDompetUntukForm = useCallback(
    (id: number) => {
      const dompet = ambilDompetDenganId(id);
      if (dompet) {
        setFormDompet(dompet);
      }
    },
    [ambilDompetDenganId]
  );

  const simpanDompetBaru = async () => {
    const { id, nama, tipe, ikon, saldo } = formDompet;

    if (!nama || !tipe || !ikon) {
      console.error('Form tidak lengkap');
      return;
    }

    if (id) {
      // Perbarui dompet yang ada
      await perbaruiDompet({ id, nama, tipe, ikon });
    } else {
      // Tambah dompet baru
      await tambahDompet({ nama, tipe, ikon, saldo: saldo || 0 });
    }
    setFormDompet(initialFormDompet); // Reset form setelah simpan
  };

  const nilai = useMemo(
    () => ({
      daftarDompet,
      tambahDompet,
      perbaruiDompet,
      hapusDompet,
      tambahPemasukan,
      tambahPengeluaran,
      tambahTransfer,
      ambilDompetDenganId,
      memuat,
      formDompet,
      setFormDompet,
      modalTipeTerlihat,
      bukaModalTipe,
      tutupModalTipe,
      muatDompetUntukForm,
      simpanDompetBaru,
      hapusSemuaDompet,
      muatUlangDaftarDompet,
    }),
    [
      daftarDompet,
      ambilDompetDenganId,
      memuat,
      formDompet,
      modalTipeTerlihat,
      muatUlangDaftarDompet,
    ]
  );

  return <DompetContext.Provider value={nilai}>{children}</DompetContext.Provider>;
};

export const useDompet = () => {
  const context = useContext(DompetContext);
  if (context === undefined) {
    throw new Error('useDompet harus digunakan di dalam DompetProvider');
  }
  return context;
};
