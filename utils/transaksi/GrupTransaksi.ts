// utils/transaksi/GrupTransaksi.ts
import type { Transaksi, TipeTransaksi } from '@/database/tipe';
import { format, isSameDay, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

// Tipe untuk data yang sudah dikelompokkan yang akan digunakan oleh SectionList
export interface TransaksiGrup {
  tanggal: string; // Misal: "2024-01-24"
  total: number; // Total pemasukan/pengeluaran pada hari itu
  data: Transaksi[]; // Daftar transaksi pada hari itu
}

// Tipe untuk objek sementara yang digunakan untuk membangun grup
interface GrupSementara {
  [kunciTanggal: string]: {
    transaksi: Transaksi[];
    pemasukan: number;
    pengeluaran: number;
  };
}

/**
 * Mengelompokkan daftar transaksi berdasarkan hari.
 * @param daftarTransaksi - Array objek transaksi.
 * @param daftarKategori - Array objek kategori untuk menentukan tipe transaksi.
 * @returns Array objek TransaksiGrup yang siap digunakan oleh SectionList.
 */
export const grupTransaksiBerdasarkanTanggal = (
  daftarTransaksi: Transaksi[],
  daftarKategori: Array<{ id: number; tipe: TipeTransaksi }>
): TransaksiGrup[] => {
  if (!daftarTransaksi || daftarTransaksi.length === 0) {
    return [];
  }

  // 1. Buat peta (map) dari ID kategori ke tipe-nya untuk pencarian cepat
  const petaTipeKategori = new Map<number, TipeTransaksi>();
  for (const kategori of daftarKategori) {
    petaTipeKategori.set(kategori.id, kategori.tipe);
  }

  // 2. Kelompokkan transaksi ke dalam objek sementara
  const grupSementara = daftarTransaksi.reduce<GrupSementara>((acc, trx) => {
    const tanggalObj = parseISO(trx.tanggal);
    const kunciTanggal = format(tanggalObj, 'yyyy-MM-dd');

    if (!acc[kunciTanggal]) {
      acc[kunciTanggal] = { transaksi: [], pemasukan: 0, pengeluaran: 0 };
    }

    acc[kunciTanggal].transaksi.push(trx);

    // Tentukan tipe transaksi (pemasukan/pengeluaran) dan akumulasikan jumlahnya
    if (trx.tipe === 'transfer') {
      // Transfer dianggap sebagai pengeluaran dari dompet sumber
      acc[kunciTanggal].pengeluaran += trx.jumlah;
    } else if (trx.kategori_id) {
      const tipeKategori = petaTipeKategori.get(trx.kategori_id);
      if (tipeKategori === 'pemasukan') {
        acc[kunciTanggal].pemasukan += trx.jumlah;
      } else if (tipeKategori === 'pengeluaran') {
        acc[kunciTanggal].pengeluaran += trx.jumlah;
      }
    }

    return acc;
  }, {});

  // 3. Ubah objek sementara menjadi array format SectionList
  const hasilGrup = Object.keys(grupSementara).map((kunciTanggal) => {
    const grup = grupSementara[kunciTanggal];
    const totalHarian = grup.pemasukan - grup.pengeluaran;

    return {
      tanggal: kunciTanggal, // Format 'yyyy-MM-dd'
      total: totalHarian,
      data: grup.transaksi,
    };
  });

  // 4. Urutkan grup berdasarkan tanggal (terbaru di atas)
  return hasilGrup.sort((a, b) => {
    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  });
};
