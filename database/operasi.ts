// database/operasi.ts
import db from './sqlite';
import { Kategori, Dompet, Transaksi } from './tipe';
import { sub, format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';

// ─────────────────────────────────────────────
// OPERASI KATEGORI
// ─────────────────────────────────────────────
export const ambilSemuaKategori = async (): Promise<Kategori[]> => {
  return await db.getAllAsync('SELECT * FROM kategori ORDER BY nama ASC;');
};

// ─────────────────────────────────────────────
// OPERASI DOMPET
// ─────────────────────────────────────────────
export const ambilSemuaDompet = async (): Promise<Dompet[]> => {
  return await db.getAllAsync('SELECT * FROM dompet ORDER BY nama ASC;');
};

// ─────────────────────────────────────────────
// OPERASI TRANSAKSI
// ─────────────────────────────────────────────
export const ambilSemuaTransaksi = async (): Promise<Transaksi[]> => {
  return await db.getAllAsync('SELECT * FROM transaksi ORDER BY tanggal DESC;');
};

// ─────────────────────────────────────────────
// OPERASI STATISTIK
// ─────────────────────────────────────────────
const getTanggalRange = (periode: string, offset: number) => {
  const now = new Date();
  let start, end;

  switch (periode) {
    case 'harian':
      const targetHarian = sub(now, { days: offset });
      start = format(targetHarian, 'yyyy-MM-dd 00:00:00');
      end = format(targetHarian, 'yyyy-MM-dd 23:59:59');
      break;
    case 'mingguan':
      const targetMingguan = sub(now, { weeks: offset });
      start = format(startOfWeek(targetMingguan), 'yyyy-MM-dd 00:00:00');
      end = format(endOfWeek(targetMingguan), 'yyyy-MM-dd 23:59:59');
      break;
    case 'bulanan':
      const targetBulanan = sub(now, { months: offset });
      start = format(startOfMonth(targetBulanan), 'yyyy-MM-dd 00:00:00');
      end = format(endOfMonth(targetBulanan), 'yyyy-MM-dd 23:59:59');
      break;
    case 'tahunan':
      const targetTahunan = sub(now, { years: offset });
      start = format(startOfYear(targetTahunan), 'yyyy-MM-dd 00:00:00');
      end = format(endOfYear(targetTahunan), 'yyyy-MM-dd 23:59:59');
      break;
    default: // 'semua'
      return { start: null, end: null };
  }
  return { start, end };
};


export const dapatkanStatistik = async (periode: string, offset: number) => {
  const { start, end } = getTanggalRange(periode, offset);
  const whereClause = start && end ? `WHERE t.tanggal BETWEEN '${start}' AND '${end}'` : '';

  const query = `
    SELECT
      k.tipe,
      SUM(t.jumlah) as total,
      k.nama as kategori_nama,
      k.ikon as kategori_ikon
    FROM transaksi t
    JOIN kategori k ON t.kategori_id = k.id
    ${whereClause}
    GROUP BY k.tipe, k.nama, k.ikon
  `;

  const results: any[] = await db.getAllAsync(query);

  let totalPemasukan = 0;
  let totalPengeluaran = 0;
  const ringkasanPemasukan: any[] = [];
  const ringkasanPengeluaran: any[] = [];

  results.forEach(row => {
    if (row.tipe === 'pemasukan') {
      totalPemasukan += row.total;
      ringkasanPemasukan.push({ nama: row.kategori_nama, ikon: row.kategori_ikon, jumlah: row.total });
    } else {
      totalPengeluaran += row.total;
      ringkasanPengeluaran.push({ nama: row.kategori_nama, ikon: row.kategori_ikon, jumlah: row.total });
    }
  });

  // Untuk dataGrafik, kita perlu query terpisah per hari/bulan tergantung periode
  // Ini hanyalah contoh sederhana, perlu disesuaikan
  const dataGrafik = [
    { label: 'Sen', pemasukan: 300, pengeluaran: 500 },
    { label: 'Sel', pemasukan: 500, pengeluaran: 200 },
    { label: 'Rab', pemasukan: 800, pengeluaran: 700 },
    { label: 'Kam', pemasukan: 400, pengeluaran: 600 },
    { label: 'Jum', pemasukan: 600, pengeluaran: 300 },
    { label: 'Sab', pemasukan: 200, pengeluaran: 100 },
    { label: 'Min', pemasukan: 100, pengeluaran: 400 },
  ];

  return {
    totalPemasukan,
    totalPengeluaran,
    ringkasanPemasukan,
    ringkasanPengeluaran,
    dataGrafik,
  };
};
