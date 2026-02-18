// context/DompetContext.tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// Impor koneksi database dan tipe data dari Expo SQLite
import db from '../database/sqlite';

// Definisikan tipe untuk objek dompet dari database
// Nama properti disamakan dengan nama kolom di tabel untuk kemudahan
export interface Dompet {
  id: number;
  nama: string;
  saldo: number;
}

// Definisikan tipe untuk data yang dikelola di form
interface DataForm {
  namaDompet: string;
  saldoAwal: string;
}

// Definisikan tipe untuk nilai yang akan disediakan oleh Context
interface ContextDompetType {
  dataForm: DataForm;
  setDataForm: React.Dispatch<React.SetStateAction<DataForm>>;
  daftarDompet: Dompet[];
  muatDaftarDompet: () => Promise<void>;
  simpanDompetBaru: () => Promise<void>;
}

// Buat Context
const DompetContext = createContext<ContextDompetType | undefined>(undefined);

// Buat komponen Provider
export function DompetProvider({ children }: { children: ReactNode }) {
  // State untuk menampung data dari form input
  const [dataForm, setDataForm] = useState<DataForm>({
    namaDompet: '',
    saldoAwal: '',
  });

  // State untuk menampung daftar dompet dari database
  const [daftarDompet, setDaftarDompet] = useState<Dompet[]>([]);

  // Fungsi untuk memuat semua dompet dari database
  const muatDaftarDompet = async () => {
    try {
      const semuaDompet = await db.getAllAsync<Dompet>(
        'SELECT * FROM dompet ORDER BY nama ASC'
      );
      setDaftarDompet(semuaDompet);
      console.log('Daftar dompet berhasil dimuat.');
    } catch (error) {
      console.error('Gagal memuat daftar dompet:', error);
    }
  };

  // Fungsi untuk menyimpan dompet baru ke database, berdasarkan data dari form
  const simpanDompetBaru = async () => {
    const { namaDompet, saldoAwal } = dataForm;

    if (!namaDompet.trim()) {
      alert('Nama dompet tidak boleh kosong.');
      return;
    }

    // Ubah saldo dari string (misal: "10.000") menjadi angka
    const saldoNumerik = parseFloat(saldoAwal.replace(/\./g, '')) || 0;

    try {
      await db.runAsync('INSERT INTO dompet (nama, saldo) VALUES (?, ?);', [
        namaDompet.trim(),
        saldoNumerik,
      ]);
      console.log(`Dompet "${namaDompet.trim()}" berhasil disimpan.`);

      // Kosongkan form input setelah berhasil disimpan
      setDataForm({ namaDompet: '', saldoAwal: '' });

      // Muat ulang daftar dompet untuk menampilkan data terbaru secara real-time
      await muatDaftarDompet();
    } catch (error) {
      console.error('Gagal menyimpan dompet baru:', error);
      alert('Gagal menyimpan dompet. Mungkin nama dompet sudah ada?');
    }
  };

  // Muat daftar dompet saat provider pertama kali dirender
  useEffect(() => {
    muatDaftarDompet();
  }, []);

  const value = {
    dataForm,
    setDataForm,
    daftarDompet,
    muatDaftarDompet,
    simpanDompetBaru,
  };

  return (
    <DompetContext.Provider value={value}>{children}</DompetContext.Provider>
  );
}

// Buat custom hook untuk mempermudah penggunaan context
export function useDompet() {
  const context = useContext(DompetContext);
  if (context === undefined) {
    throw new Error(
      'useDompet harus digunakan di dalam lingkup DompetProvider'
    );
  }
  return context;
}
