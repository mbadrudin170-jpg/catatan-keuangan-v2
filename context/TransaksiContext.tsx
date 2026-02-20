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
import { useKategori } from './KategoriContext'; // DIIMPOR: Untuk mengakses data kategori

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
  const { daftarKategori } = useKategori(); // BARU: Mendapatkan daftar kategori

  const [transaksi, setTransaksi] = useState<Transaksi>({
    id: Date.now(),
    jumlah: 0,
    keterangan: '',
    tanggal: new Date().toISOString(),
    tipe: 'pengeluaran',
    kategori_id: null,
    dompet_id: 0,
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

  const tambahTransaksi = async (transaksiInput: Transaksi): Promise<void> => {
    const transaksiUntukSimpan = { ...transaksiInput };

    // --- BLOK PERBAIKAN KATEGORI ---
    // Logika ini secara defensif memperbaiki jika ID subkategori salah ditempatkan di kategori_id
    if (transaksiUntukSimpan.tipe !== 'transfer' && transaksiUntukSimpan.kategori_id) {
      const kategoriInduk = daftarKategori.find((k) => k.id === transaksiUntukSimpan.kategori_id);

      if (!kategoriInduk) {
        const semuaSubkategori = daftarKategori.flatMap((k) => k.subkategori);
        const subkategori = semuaSubkategori.find((s) => s.id === transaksiUntukSimpan.kategori_id);

        if (subkategori) {
          transaksiUntukSimpan.subkategori_id = subkategori.id;
          transaksiUntukSimpan.kategori_id = subkategori.kategori_id;
        }
      }
    }
    // --- AKHIR BLOK PERBAIKAN ---

    if (transaksiUntukSimpan.jumlah <= 0) {
      Alert.alert('Input Tidak Valid', 'Jumlah transaksi harus lebih dari nol.');
      throw new Error('Jumlah transaksi tidak valid.');
    }
    if (transaksiUntukSimpan.dompet_id === 0) {
      Alert.alert('Input Tidak Valid', 'Anda harus memilih dompet sumber.');
      throw new Error('Dompet sumber tidak dipilih.');
    }

    if (transaksiUntukSimpan.tipe === 'transfer') {
      if (!transaksiUntukSimpan.dompet_tujuan_id) {
        Alert.alert('Input Tidak Valid', 'Anda harus memilih dompet tujuan.');
        throw new Error('Dompet tujuan tidak dipilih.');
      }
      if (transaksiUntukSimpan.dompet_id === transaksiUntukSimpan.dompet_tujuan_id) {
        Alert.alert('Input Tidak Valid', 'Dompet sumber dan tujuan tidak boleh sama.');
        throw new Error('Dompet sumber dan tujuan sama.');
      }
    } else {
      if (!transaksiUntukSimpan.kategori_id) {
        Alert.alert('Input Tidak Valid', 'Anda harus memilih kategori.');
        throw new Error('Kategori tidak dipilih.');
      }
    }

    try {
      await dbTambahTransaksi(transaksiUntukSimpan);

      switch (transaksiUntukSimpan.tipe) {
        case 'pemasukan':
          await tambahPemasukan(transaksiUntukSimpan.dompet_id, transaksiUntukSimpan.jumlah);
          break;
        case 'pengeluaran':
          await tambahPengeluaran(transaksiUntukSimpan.dompet_id, transaksiUntukSimpan.jumlah);
          break;
        case 'transfer':
          if (transaksiUntukSimpan.dompet_tujuan_id) {
            await tambahTransfer(
              transaksiUntukSimpan.dompet_id,
              transaksiUntukSimpan.dompet_tujuan_id,
              transaksiUntukSimpan.jumlah
            );
          }
          break;
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
