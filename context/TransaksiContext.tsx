// context/TransaksiContext.tsx
import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { JSX, ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { ambilSemuaTransaksi, tambahSatuTransaksi as dbTambahTransaksi } from '@/database/operasi';
import type { Transaksi } from '@/database/tipe';
import { useDompet } from './DompetContext';

type TipePilihanDompet = 'sumber' | 'tujuan';

interface TransaksiContextType {
  transaksi: Transaksi;
  setTransaksi: React.Dispatch<React.SetStateAction<Transaksi>>;
  daftarTransaksi: Transaksi[];
  memuat: boolean;
  muatUlangDaftarTransaksi: () => Promise<void>;
  tambahTransaksi: (transaksi: Transaksi) => Promise<void>;
  hapusSatuTransaksi: (id: number) => Promise<void>;
  modalDompetTerlihat: boolean;
  modalKategoriTerlihat: boolean;
  tipePilihanDompet: TipePilihanDompet | null;
  bukaModalDompet: (tipe: TipePilihanDompet) => void;
  tutupModalDompet: () => void;
  bukaModalKategori: () => void;
  tutupModalKategori: () => void;
  gantiTanggal: (event: DateTimePickerEvent, tanggalTerpilih?: Date) => void;
  tampilkanPemilihTanggal: () => void;
  tampilkanPemilihWaktu: () => void;
}

const TransaksiContext = createContext<TransaksiContextType | undefined>(undefined);

interface TransaksiProviderProps {
  children: ReactNode;
  initialDaftarTransaksi?: Transaksi[];
}

export const TransaksiProvider = ({
  children,
  initialDaftarTransaksi,
}: TransaksiProviderProps): JSX.Element => {
  const { tambahPemasukan, tambahPengeluaran, tambahTransfer } = useDompet();

  const [transaksi, setTransaksi] = useState<Transaksi>({
    id: Date.now(),
    jumlah: 0,
    keterangan: '',
    tanggal: new Date().toISOString(),
    tipe: 'pengeluaran',
    kategori_id: null,
    dompet_id: null,
    dompet_tujuan_id: null,
    subkategori_id: null,
  });

  const [daftarTransaksi, setDaftarTransaksi] = useState<Transaksi[]>(initialDaftarTransaksi || []);
  const [memuat, setMemuat] = useState(!initialDaftarTransaksi);

  const muatUlangDaftarTransaksi = useCallback(async (): Promise<void> => {
    setMemuat(true);
    try {
      const hasil = await ambilSemuaTransaksi();
      setDaftarTransaksi(hasil);
    } catch (error) {
      console.error('Gagal memuat daftar transaksi:', error);
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    if (!initialDaftarTransaksi) {
      void muatUlangDaftarTransaksi();
    }
  }, [initialDaftarTransaksi, muatUlangDaftarTransaksi]);

  const tambahTransaksi = async (transaksiBaru: Transaksi): Promise<void> => {
    if (transaksiBaru.jumlah <= 0) {
      Alert.alert('Input Tidak Valid', 'Jumlah transaksi harus lebih dari nol.');
      throw new Error('Jumlah transaksi tidak valid.');
    }
    if (transaksiBaru.dompet_id === null) {
      Alert.alert('Input Tidak Valid', 'Anda harus memilih dompet sumber.');
      throw new Error('Dompet sumber tidak dipilih.');
    }

    if (transaksiBaru.tipe === 'transfer') {
      if (!transaksiBaru.dompet_tujuan_id) {
        Alert.alert('Input Tidak Valid', 'Anda harus memilih dompet tujuan untuk transfer.');
        throw new Error('Dompet tujuan tidak dipilih untuk transfer.');
      }
      if (transaksiBaru.dompet_id === transaksiBaru.dompet_tujuan_id) {
        Alert.alert('Input Tidak Valid', 'Dompet sumber dan tujuan tidak boleh sama.');
        throw new Error('Dompet sumber dan tujuan sama.');
      }
    } else {
      // DIUBAH: Menambahkan validasi untuk memastikan kategori dipilih
      if (transaksiBaru.kategori_id === null) {
        Alert.alert('Input Tidak Valid', 'Anda harus memilih kategori.');
        throw new Error('Kategori tidak dipilih.');
      }
    }

    try {
      await dbTambahTransaksi(transaksiBaru);

      if (transaksiBaru.dompet_id !== null) {
        switch (transaksiBaru.tipe) {
          case 'pemasukan':
            await tambahPemasukan(transaksiBaru.dompet_id, transaksiBaru.jumlah);
            break;
          case 'pengeluaran':
            await tambahPengeluaran(transaksiBaru.dompet_id, transaksiBaru.jumlah);
            break;
          case 'transfer':
            if (transaksiBaru.dompet_tujuan_id !== null) {
              await tambahTransfer(
                transaksiBaru.dompet_id,
                transaksiBaru.dompet_tujuan_id,
                transaksiBaru.jumlah
              );
            }
            break;
        }
      }
      await muatUlangDaftarTransaksi();
    } catch (error) {
      console.error('Gagal menambah transaksi dan memperbarui saldo:', error);
      throw error;
    }
  };

  const hapusSatuTransaksi = async (id: number): Promise<void> => {
    setDaftarTransaksi((daftarLama) => daftarLama.filter((item) => item.id !== id));
  };

  const [modalDompetTerlihat, setModalDompetTerlihat] = useState(false);
  const [modalKategoriTerlihat, setModalKategoriTerlihat] = useState(false);
  const [tipePilihanDompet, setTipePilihanDompet] = useState<TipePilihanDompet | null>(null);

  const bukaModalDompet = (tipe: TipePilihanDompet): void => {
    setTipePilihanDompet(tipe);
    setModalDompetTerlihat(true);
  };

  const tutupModalDompet = (): void => {
    setModalDompetTerlihat(false);
    setTipePilihanDompet(null);
  };

  const bukaModalKategori = (): void => setModalKategoriTerlihat(true);
  const tutupModalKategori = (): void => setModalKategoriTerlihat(false);

  const gantiTanggal = (event: DateTimePickerEvent, tanggalTerpilih?: Date): void => {
    const tanggalObj = tanggalTerpilih || new Date(transaksi.tanggal);
    setTransaksi((prev) => ({ ...prev, tanggal: tanggalObj.toISOString() }));
  };

  const tampilkanMode = (modeSaatIni: 'date' | 'time'): void => {
    DateTimePickerAndroid.open({
      value: new Date(transaksi.tanggal),
      onChange: gantiTanggal,
      mode: modeSaatIni,
      is24Hour: true,
    });
  };

  const tampilkanPemilihTanggal = (): void => tampilkanMode('date');
  const tampilkanPemilihWaktu = (): void => tampilkanMode('time');

  const nilai = {
    transaksi,
    setTransaksi,
    daftarTransaksi,
    memuat,
    muatUlangDaftarTransaksi,
    tambahTransaksi,
    hapusSatuTransaksi,
    modalDompetTerlihat,
    modalKategoriTerlihat,
    tipePilihanDompet,
    bukaModalDompet,
    tutupModalDompet,
    bukaModalKategori,
    tutupModalKategori,
    gantiTanggal,
    tampilkanPemilihTanggal,
    tampilkanPemilihWaktu,
  };

  return <TransaksiContext.Provider value={nilai}>{children}</TransaksiContext.Provider>;
};

export const useTransaksi = (): TransaksiContextType => {
  const context = useContext(TransaksiContext);
  if (context === undefined) {
    throw new Error('useTransaksi harus digunakan di dalam TransaksiProvider');
  }
  return context;
};
