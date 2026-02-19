// screens/statistik/HalamanStatistik.tsx
import {
  ambilSemuaDompet,
  ambilSemuaKategori,
  ambilSemuaTransaksi,
  dapatkanStatistik,
} from '@/database/operasi';
import { Dompet, Kategori, TipeTransaksi, Transaksi } from '@/database/tipe';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DataGrafikBatang,
  FilterPeriode as FilterPeriodeTipe,
  RingkasanKategori as RingkasanKategoriTipe,
} from './data';
import { FilterPeriode } from './FilterPeriode';
import { HeaderStatistik } from './HeaderStatistik';
import { WARNA } from './konstanta';
import { RingkasanDompet } from './RingkasanDompet';
import { RingkasanKategori } from './RingkasanKategori';
import { RingkasanKeuangan } from './RingkasanKeuangan';
import { TransaksiTerakhir } from './TransaksiTerakhir';

// ─────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
export const HalamanStatistik = () => {
  const [periode, setPeriode] = useState<FilterPeriodeTipe>('bulanan');
  const [offsetPeriode, setOffsetPeriode] = useState(0);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [dompet, setDompet] = useState<Dompet[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [statistik, setStatistik] = useState<{
    totalPemasukan: number;
    totalPengeluaran: number;
    ringkasanPengeluaran: RingkasanKategoriTipe[];
    ringkasanPemasukan: RingkasanKategoriTipe[];
    dataGrafik: DataGrafikBatang[];
  } | null>(null);
  const [tabKategori, setTabKategori] = useState<TipeTransaksi>('pengeluaran');

  const muatData = useCallback(async () => {
    const [k, d, t, s] = await Promise.all([
      ambilSemuaKategori(),
      ambilSemuaDompet(),
      ambilSemuaTransaksi(),
      dapatkanStatistik(periode, offsetPeriode),
    ]);
    setKategori(k);
    setDompet(d);
    setTransaksi(t);
    setStatistik(s);
  }, [periode, offsetPeriode]);

  useFocusEffect(
    useCallback(() => {
      muatData();
    }, [muatData])
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderStatistik />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <FilterPeriode
          periode={periode}
          offsetPeriode={offsetPeriode}
          onPeriodeChange={setPeriode}
          onOffsetPeriodeChange={setOffsetPeriode}
        />

        {statistik && (
          <RingkasanKeuangan
            totalPemasukan={statistik.totalPemasukan}
            totalPengeluaran={statistik.totalPengeluaran}
            dataGrafik={statistik.dataGrafik}
          />
        )}

        {statistik && (
          <RingkasanKategori
            tabAktif={tabKategori}
            onTabChange={setTabKategori}
            ringkasanAktif={
              tabKategori === 'pemasukan'
                ? statistik.ringkasanPemasukan
                : statistik.ringkasanPengeluaran
            }
            onPilihKategori={(k) => console.log('Pilih kategori:', k)} // Navigasi ke halaman detail
          />
        )}

        <RingkasanDompet dompet={dompet} />

        <TransaksiTerakhir transaksi={transaksi} kategori={kategori} dompet={dompet} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WARNA.bg,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
