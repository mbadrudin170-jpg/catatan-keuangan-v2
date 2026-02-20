// context/TransaksiContext.tsx
import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { JSX, ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  ambilSemuaTransaksi,
  hapusSemuaTransaksi as dbHapusSemuaTransaksi, // Impor fungsi hapus semua
  tambahSatuTransaksi as dbTambahTransaksi,
} from '@/database/operasi';
import type { Transaksi } from '@/database/tipe';
import { useDompet } from './DompetContext';
import { useKategori } from './KategoriContext';

type TipePilihanDompet = 'sumber' | 'tujuan';

interface TransaksiContextType {
  transaksi: Transaksi;
  setTransaksi: React.Dispatch<React.SetStateAction<Transaksi>>;
  daftarTransaksi: Transaksi[];
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
  // Mengambil fungsi-fungsi yang berhubungan dengan dompet dari DompetContext.
  const { muatUlangDaftarDompet, tambahPemasukan, tambahPengeluaran, tambahTransfer, ambilDompetDenganId } =
    useDompet();
  // Mengambil daftar kategori dari KategoriContext.
  const { daftarKategori } = useKategori();

  // State untuk menampung data transaksi yang sedang dibuat atau diubah di form.
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

  // State untuk menyimpan daftar semua transaksi yang diambil dari database.
  const [daftarTransaksi, setDaftarTransaksi] = useState<Transaksi[]>(initialDaftarTransaksi || []);
  // State untuk menandakan apakah sedang ada proses pemuatan data (loading).
  const [memuat, setMemuat] = useState(!initialDaftarTransaksi);

  // Fungsi untuk memuat ulang daftar transaksi dari database.
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

  // Efek untuk memuat daftar transaksi saat komponen pertama kali dirender.
  useEffect(() => {
    if (!initialDaftarTransaksi) {
      void muatUlangDaftarTransaksi();
    }
  }, [initialDaftarTransaksi, muatUlangDaftarTransaksi]);

  // Fungsi untuk menambah satu transaksi baru, termasuk logika bisnis.
  const tambahTransaksi = async (transaksiInput: Transaksi): Promise<void> => {
    // Membuat salinan objek transaksi untuk dimodifikasi sebelum disimpan.
    const transaksiUntukSimpan = { ...transaksiInput };

    // Mengambil dan menyimpan nama dompet sumber.
    const dompetSumber = ambilDompetDenganId(transaksiUntukSimpan.dompet_id);
    if (dompetSumber) {
      transaksiUntukSimpan.nama_dompet = dompetSumber.nama;
    }

    // Jika transfer, ambil dan simpan nama dompet tujuan.
    if (transaksiUntukSimpan.tipe === 'transfer' && transaksiUntukSimpan.dompet_tujuan_id) {
      const dompetTujuan = ambilDompetDenganId(transaksiUntukSimpan.dompet_tujuan_id);
      if (dompetTujuan) {
        transaksiUntukSimpan.nama_dompet_tujuan = dompetTujuan.nama;
      }
    }

    // Jika bukan transfer, proses dan simpan nama kategori/subkategori.
    if (transaksiUntukSimpan.tipe !== 'transfer' && transaksiUntukSimpan.kategori_id) {
      const semuaSubkategori = daftarKategori.flatMap((k) => k.subkategori);
      const subkategoriDariId = semuaSubkategori.find(
        (s) => s.id === transaksiUntukSimpan.kategori_id
      );

      if (subkategoriDariId) {
        transaksiUntukSimpan.subkategori_id = subkategoriDariId.id;
        transaksiUntukSimpan.kategori_id = subkategoriDariId.kategori_id;
      }

      const kategoriInduk = daftarKategori.find((k) => k.id === transaksiUntukSimpan.kategori_id);
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
      // Menyimpan transaksi ke database.
      await dbTambahTransaksi(transaksiUntukSimpan);

      // Logika pembaruan saldo dompet setelah transaksi berhasil disimpan.
      if (transaksiUntukSimpan.tipe === 'pemasukan') {
        await tambahPemasukan(transaksiUntukSimpan.dompet_id, transaksiUntukSimpan.jumlah);
      } else if (transaksiUntukSimpan.tipe === 'pengeluaran') {
        await tambahPengeluaran(transaksiUntukSimpan.dompet_id, transaksiUntukSimpan.jumlah);
      } else if (transaksiUntukSimpan.tipe === 'transfer') {
        if (transaksiUntukSimpan.dompet_tujuan_id) {
          await tambahTransfer(
            transaksiUntukSimpan.dompet_id,
            transaksiUntukSimpan.dompet_tujuan_id,
            transaksiUntukSimpan.jumlah
          );
        }
      }

      // Memuat ulang daftar transaksi untuk menampilkan data terbaru.
      await muatUlangDaftarTransaksi();
    } catch (error) {
      console.error('Gagal menambah transaksi:', error);
      throw error;
    }
  };

  // Fungsi untuk menghapus satu transaksi (saat ini hanya di state).
  const hapusSatuTransaksi = async (id: number): Promise<void> => {
    setDaftarTransaksi((daftarLama) => daftarLama.filter((item) => item.id !== id));
  };

  // Fungsi untuk menghapus SEMUA transaksi.
  const hapusSemuaTransaksi = async (): Promise<void> => {
    try {
      await dbHapusSemuaTransaksi(); // Panggil operasi DB
      setDaftarTransaksi([]); // Kosongkan state
      await muatUlangDaftarDompet(); // Sinkronkan ulang saldo dompet
    } catch (error) {
      console.error('Gagal menghapus semua transaksi:', error);
      throw error; // Lemparkan error agar bisa ditangani di komponen
    }
  };

  // State untuk mengontrol visibilitas modal pemilihan dompet.
  const [modalDompetTerlihat, setModalDompetTerlihat] = useState(false);
  // State untuk mengontrol visibilitas modal pemilihan kategori.
  const [modalKategoriTerlihat, setModalKategoriTerlihat] = useState(false);
  // State untuk membedakan apakah modal dompet dibuka untuk 'sumber' atau 'tujuan'.
  const [tipePilihanDompet, setTipePilihanDompet] = useState<TipePilihanDompet | null>(null);

  // Fungsi untuk membuka modal dompet.
  const bukaModalDompet = (tipe: TipePilihanDompet): void => {
    setTipePilihanDompet(tipe);
    setModalDompetTerlihat(true);
  };

  // Fungsi untuk menutup modal dompet.
  const tutupModalDompet = (): void => {
    setModalDompetTerlihat(false);
    setTipePilihanDompet(null);
  };

  // Fungsi untuk membuka modal kategori.
  const bukaModalKategori = (): void => setModalKategoriTerlihat(true);
  // Fungsi untuk menutup modal kategori.
  const tutupModalKategori = (): void => setModalKategoriTerlihat(false);

  // Fungsi callback untuk menangani perubahan tanggal/waktu dari picker.
  const gantiTanggal = (event: DateTimePickerEvent, tanggalTerpilih?: Date): void => {
    const tanggalObj = tanggalTerpilih || new Date(transaksi.tanggal);
    setTransaksi((prev) => ({ ...prev, tanggal: tanggalObj.toISOString() }));
  };

  // Fungsi internal untuk menampilkan picker Android (tanggal atau waktu).
  const tampilkanMode = (modeSaatIni: 'date' | 'time'): void => {
    DateTimePickerAndroid.open({
      value: new Date(transaksi.tanggal),
      onChange: gantiTanggal,
      mode: modeSaatIni,
      is24Hour: true,
    });
  };

  // Fungsi untuk menampilkan pemilih tanggal.
  const tampilkanPemilihTanggal = (): void => tampilkanMode('date');
  // Fungsi untuk menampilkan pemilih waktu.
  const tampilkanPemilihWaktu = (): void => tampilkanMode('time');

  // Objek yang berisi semua state dan fungsi yang akan disediakan oleh context.
  const nilai = {
    transaksi,
    setTransaksi,
    daftarTransaksi,
    memuat,
    muatUlangDaftarTransaksi,
    tambahTransaksi,
    hapusSatuTransaksi,
    hapusSemuaTransaksi, // Tambahkan ke nilai context
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

// Hook kustom untuk mempermudah penggunaan TransaksiContext.
export const useTransaksi = (): TransaksiContextType => {
  // Mengambil nilai dari context.
  const context = useContext(TransaksiContext);
  if (context === undefined) {
    throw new Error('useTransaksi harus digunakan di dalam TransaksiProvider');
  }
  return context;
};
