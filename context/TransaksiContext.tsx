// context/TransaksiContext.tsx
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Transaksi } from '../database/tipe';

interface TransaksiContextType {
  transaksi: Transaksi;
  setTransaksi: React.Dispatch<React.SetStateAction<Transaksi>>;
  daftarTransaksi: Transaksi[];
  tambahTransaksi: (transaksi: Transaksi) => void;
  hapusSatuTransaksi: (id: number) => Promise<void>; // <-- BARU: Deklarasi fungsi hapus
  modalDompetTerlihat: boolean;
  modalKategoriTerlihat: boolean;
  bukaModalDompet: () => void;
  tutupModalDompet: () => void;
  bukaModalKategori: () => void;
  tutupModalKategori: () => void;
  gantiTanggal: (event: any, tanggalTerpilih?: Date) => void;
  tampilkanPemilihTanggal: () => void;
  tampilkanPemilihWaktu: () => void;
}

const TransaksiContext = createContext<TransaksiContextType | undefined>(undefined);

interface TransaksiProviderProps {
  children: ReactNode;
}

export const TransaksiProvider = ({ children }: TransaksiProviderProps) => {
  const [transaksi, setTransaksi] = useState<Transaksi>({
    id: Date.now(),
    jumlah: 0,
    keterangan: '',
    tanggal: new Date().toISOString(),
    kategori_id: null,
    dompet_id: 0,
  });

  const [daftarTransaksi, setDaftarTransaksi] = useState<Transaksi[]>([]);

  const tambahTransaksi = (transaksiBaru: Transaksi) => {
    const transaksiDenganId = { ...transaksiBaru, id: Date.now() };
    setDaftarTransaksi(daftarLama => [...daftarLama, transaksiDenganId]);
  };

  // <-- BARU: Implementasi fungsi untuk menghapus transaksi
  const hapusSatuTransaksi = async (id: number) => {
    setDaftarTransaksi(daftarLama => daftarLama.filter(item => item.id !== id));
  };

  const [modalDompetTerlihat, setModalDompetTerlihat] = useState(false);
  const [modalKategoriTerlihat, setModalKategoriTerlihat] = useState(false);

  const bukaModalDompet = () => setModalDompetTerlihat(true);
  const tutupModalDompet = () => setModalDompetTerlihat(false);

  const bukaModalKategori = () => setModalKategoriTerlihat(true);
  const tutupModalKategori = () => setModalKategoriTerlihat(false);

  const gantiTanggal = (event: any, tanggalTerpilih?: Date) => {
    const tanggalObj = tanggalTerpilih || new Date(transaksi.tanggal);
    setTransaksi((prev) => ({ ...prev, tanggal: tanggalObj.toISOString() }));
  };

  const tampilkanMode = (modeSaatIni: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: new Date(transaksi.tanggal),
      onChange: gantiTanggal,
      mode: modeSaatIni,
      is24Hour: true,
    });
  };

  const tampilkanPemilihTanggal = () => tampilkanMode('date');
  const tampilkanPemilihWaktu = () => tampilkanMode('time');

  const nilai = {
    transaksi,
    setTransaksi,
    daftarTransaksi,
    tambahTransaksi,
    hapusSatuTransaksi, // <-- BARU: Menyediakan fungsi hapus ke konteks
    modalDompetTerlihat,
    modalKategoriTerlihat,
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

export const useTransaksi = () => {
  const context = useContext(TransaksiContext);
  if (context === undefined) {
    throw new Error('useTransaksi harus digunakan di dalam TransaksiProvider');
  }
  return context;
};
