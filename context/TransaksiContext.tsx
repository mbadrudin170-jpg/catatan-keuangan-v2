// context/TransaksiContext.tsx
import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { JSX, ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  ambilSemuaTransaksi,
  hapusSemuaTransaksi as dbHapusSemuaTransaksi,
  perbaruiSaldoDompet, // Langsung impor fungsi ini
  resetSemuaSaldoDompet,
  tambahSatuTransaksi as dbTambahTransaksi,
} from '@/database/operasi';
import type { Transaksi } from '@/database/tipe';
import { useDompet } from './DompetContext';
import { useKategori } from './KategoriContext';

type TipePilihanDompet = 'sumber' | 'tujuan';

interface TransaksiContextType {
  transaksi: Transaksi;
  setTransaksi: React.Dispatch<React.SetStateAction<Transaksi>>;
  semuaTransaksi: Transaksi[];
  memuat: boolean;
  muatUlangDaftarTransaksi: () => Promise<void>;
  tambahTransaksi: (transaksi: Transaksi) => Promise<void>;
  hapusSatuTransaksi: (id: number) => Promise<void>;
  hapusSemuaTransaksi: () => Promise<void>; // Tambah tipe
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

// Membuat context untuk transaksi agar bisa diakses di berbagai komponen.
const TransaksiContext = createContext<TransaksiContextType | undefined>(undefined);

interface TransaksiProviderProps {
  children: ReactNode;
  initialDaftarTransaksi?: Transaksi[];
}

// Komponen Provider yang akan membungkus aplikasi dan menyediakan state transaksi.
export const TransaksiProvider = ({
  children,
  initialDaftarTransaksi,
}: TransaksiProviderProps): JSX.Element => {
  const { muatUlangDaftarDompet, ambilDompetDenganId } = useDompet();
  const { semuaKategori } = useKategori();

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
    nama_kategori: null,
    nama_subkategori: null,
    nama_dompet: null,
    nama_dompet_tujuan: null,
  });

  const [semuaTransaksi, setSemuaTransaksi] = useState<Transaksi[]>(initialDaftarTransaksi || []);
  const [memuat, setMemuat] = useState(!initialDaftarTransaksi);

  const muatUlangDaftarTransaksi = useCallback(async (): Promise<void> => {
    setMemuat(true);
    try {
      const hasil = await ambilSemuaTransaksi();
      setSemuaTransaksi(hasil);
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

    const dompetSumber = ambilDompetDenganId(transaksiUntukSimpan.dompet_id);
    if (dompetSumber) {
      transaksiUntukSimpan.nama_dompet = dompetSumber.nama;
    }

    if (transaksiUntukSimpan.tipe === 'transfer' && transaksiUntukSimpan.dompet_tujuan_id) {
      const dompetTujuan = ambilDompetDenganId(transaksiUntukSimpan.dompet_tujuan_id);
      if (dompetTujuan) {
        transaksiUntukSimpan.nama_dompet_tujuan = dompetTujuan.nama;
      }
    }

    if (transaksiUntukSimpan.tipe !== 'transfer' && transaksiUntukSimpan.kategori_id) {
      const semuaSubkategori = semuaKategori.flatMap((k) => k.subkategori);
      const subkategoriDariId = semuaSubkategori.find(
        (s) => s.id === transaksiUntukSimpan.kategori_id
      );

      if (subkategoriDariId) {
        transaksiUntukSimpan.subkategori_id = subkategoriDariId.id;
        transaksiUntukSimpan.kategori_id = subkategoriDariId.kategori_id;
      }

      const kategoriInduk = semuaKategori.find((k) => k.id === transaksiUntukSimpan.kategori_id);
      if (kategoriInduk) {
        transaksiUntukSimpan.nama_kategori = kategoriInduk.nama;
        if (transaksiUntukSimpan.subkategori_id) {
          const subkategori = kategoriInduk.subkategori.find(
            (s) => s.id === transaksiUntukSimpan.subkategori_id
          );
          if (subkategori) {
            transaksiUntukSimpan.nama_subkategori = subkategori.nama;
          }
        }
      }
    }

    try {
      await dbTambahTransaksi(transaksiUntukSimpan);

      if (transaksiUntukSimpan.tipe === 'pemasukan') {
        await perbaruiSaldoDompet(transaksiUntukSimpan.dompet_id, transaksiUntukSimpan.jumlah);
      } else if (transaksiUntukSimpan.tipe === 'pengeluaran') {
        await perbaruiSaldoDompet(transaksiUntukSimpan.dompet_id, -transaksiUntukSimpan.jumlah);
      } else if (transaksiUntukSimpan.tipe === 'transfer') {
        if (transaksiUntukSimpan.dompet_tujuan_id) {
          await perbaruiSaldoDompet(transaksiUntukSimpan.dompet_id, -transaksiUntukSimpan.jumlah);
          await perbaruiSaldoDompet(
            transaksiUntukSimpan.dompet_tujuan_id,
            transaksiUntukSimpan.jumlah
          );
        }
      }

      await muatUlangDaftarTransaksi();
      await muatUlangDaftarDompet();
    } catch (error) {
      console.error('Gagal menambah transaksi:', error);
      throw error;
    }
  };

  const hapusSatuTransaksi = async (id: number): Promise<void> => {
    setSemuaTransaksi((daftarLama) => daftarLama.filter((item) => item.id !== id));
  };

  const hapusSemuaTransaksi = async (): Promise<void> => {
    try {
      await dbHapusSemuaTransaksi();
      await resetSemuaSaldoDompet();
      setSemuaTransaksi([]);
      await muatUlangDaftarDompet();
    } catch (error) {
      console.error('Gagal menghapus semua transaksi:', error);
      throw error;
    }
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
    semuaTransaksi,
    memuat,
    muatUlangDaftarTransaksi,
    tambahTransaksi,
    hapusSatuTransaksi,
    hapusSemuaTransaksi,
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
