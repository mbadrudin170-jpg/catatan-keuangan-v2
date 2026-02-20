import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Transaksi, Kategori, Subkategori } from '@/database/tipe';

export function useDetailTransaksi() {
  // 1. Ambil ID transaksi dari parameter URL
  const { id: transaksiId } = useLocalSearchParams<{ id: string }>();

  // 2. Ambil data global dari context
  const { semuaTransaksi } = useTransaksi();
  const { semuaKategori } = useKategori();
  const { daftarDompet } = useDompet();

  // 3. Gunakan `useMemo` untuk menghitung data turunan.
  //    Ini akan mencegah kalkulasi ulang yang tidak perlu setiap kali render.
  const dataTransaksi = useMemo(() => {
    if (!transaksiId) return null;

    // Cari transaksi berdasarkan ID
    const transaksi = semuaTransaksi.find((t: Transaksi) => t.id === Number(transaksiId));
    if (!transaksi) return null;

    // Tentukan tipe transaksi untuk logika kondisional
    const isPemasukkan = transaksi.tipe === 'pemasukan';
    const isTransfer = transaksi.tipe === 'transfer';

    // Cari detail dompet dan kategori
    const dompet = daftarDompet.find((d) => d.id === transaksi.dompet_id);
    const dompetTujuan = isTransfer
      ? daftarDompet.find((d) => d.id === transaksi.dompet_tujuan_id)
      : undefined;

    let namaKategori = 'Lainnya';
    if (!isTransfer) {
      const semuaSubkategori: Subkategori[] = semuaKategori.flatMap((k: Kategori) => k.subkategori);
      const subkategori = semuaSubkategori.find((s: Subkategori) => s.id === transaksi.kategori_id);
      if (subkategori) {
        namaKategori = subkategori.nama;
      }
    }

    // Tentukan warna dan simbol berdasarkan tipe transaksi
    let warnaNominal = '#ef4444'; // Pengeluaran (default)
    let tanda = '-';
    if (isPemasukkan) {
      warnaNominal = '#10b981';
      tanda = '+';
    } else if (isTransfer) {
      warnaNominal = '#3b82f6';
      tanda = ''; // Transfer tidak pakai tanda
    }

    return {
      transaksi,
      isPemasukkan,
      isTransfer,
      namaDompet: dompet?.nama || '-',
      namaDompetTujuan: dompetTujuan?.nama,
      namaKategori,
      warnaNominal,
      tanda,
    };
  }, [transaksiId, semuaTransaksi, semuaKategori, daftarDompet]);

  return dataTransaksi;
}
