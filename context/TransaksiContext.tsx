// context/TransaksiContext.tsx
import type { Transaksi } from '@/database/tipe'; // DIUBAH: path alias
import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import type { JSX, ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

interface TransaksiContextType {
  transaksi: Transaksi;
  setTransaksi: React.Dispatch<React.SetStateAction<Transaksi>>;
  daftarTransaksi: Transaksi[];
  tambahTransaksi: (transaksi: Transaksi) => void;
  hapusSatuTransaksi: (id: number) => Promise<void>;
  modalDompetTerlihat: boolean;
  modalKategoriTerlihat: boolean;
  modalDompetTujuanTerlihat: boolean; // BARU
  bukaModalDompet: () => void;
  tutupModalDompet: () => void;
  bukaModalKategori: () => void;
  tutupModalKategori: () => void;
  bukaModalDompetTujuan: () => void; // BARU
  tutupModalDompetTujuan: () => void; // BARU
  gantiTanggal: (event: DateTimePickerEvent, tanggalTerpilih?: Date) => void;
  tampilkanPemilihTanggal: () => void;
  tampilkanPemilihWaktu: () => void;
}

const TransaksiContext = createContext<TransaksiContextType | undefined>(undefined);

interface TransaksiProviderProps {
  children: ReactNode;
}

export const TransaksiProvider = ({ children }: TransaksiProviderProps): JSX.Element => {
  const [transaksi, setTransaksi] = useState<Transaksi>({
    id: Date.now(),
    jumlah: 0,
    keterangan: '',
    tanggal: new Date().toISOString(),
    tipe: 'pengeluaran', // BARU
    kategori_id: null,
    dompet_id: 0, // Ini akan diisi saat memilih dompet sumber
    dompet_tujuan_id: null, // BARU
    subkategori_id: null,
  });

  const [daftarTransaksi, setDaftarTransaksi] = useState<Transaksi[]>([]);

  const tambahTransaksi = (transaksiBaru: Transaksi): void => {
    const transaksiDenganId = { ...transaksiBaru, id: Date.now() };
    setDaftarTransaksi((daftarLama) => [...daftarLama, transaksiDenganId]);
  };

  const hapusSatuTransaksi = async (id: number): Promise<void> => {
    setDaftarTransaksi((daftarLama) => daftarLama.filter((item) => item.id !== id));
  };

  const [modalDompetTerlihat, setModalDompetTerlihat] = useState(false);
  const [modalKategoriTerlihat, setModalKategoriTerlihat] = useState(false);
  const [modalDompetTujuanTerlihat, setModalDompetTujuanTerlihat] = useState(false); // BARU

  const bukaModalDompet = (): void => setModalDompetTerlihat(true);
  const tutupModalDompet = (): void => setModalDompetTerlihat(false);

  const bukaModalKategori = (): void => setModalKategoriTerlihat(true);
  const tutupModalKategori = (): void => setModalKategoriTerlihat(false);

  // BARU: Fungsi untuk modal dompet tujuan
  const bukaModalDompetTujuan = (): void => setModalDompetTujuanTerlihat(true);
  const tutupModalDompetTujuan = (): void => setModalDompetTujuanTerlihat(false);

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
    tambahTransaksi,
    hapusSatuTransaksi,
    modalDompetTerlihat,
    modalKategoriTerlihat,
    modalDompetTujuanTerlihat, // BARU
    bukaModalDompet,
    tutupModalDompet,
    bukaModalKategori,
    tutupModalKategori,
    bukaModalDompetTujuan, // BARU
    tutupModalDompetTujuan, // BARU
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
