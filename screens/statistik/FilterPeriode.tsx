// screens/statistik/FilterPeriode.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WARNA } from './konstanta';
import { useStatistik } from './StatistikContext'; // DIUBAH
import type { FilterPeriode as FilterPeriodeTipe } from './tipe';
import { getLabelPeriode } from './util';

// ─────────────────────────────────────────────
// CHIP PERIODE
// ─────────────────────────────────────────────
interface ChipPeriodeProps {
  label: string;
  aktif: boolean;
  onTekan: () => void;
}

const ChipPeriode = ({ label, aktif, onTekan }: ChipPeriodeProps) => (
  {/** ask:  untuk const ChipPeriode = ({ label, aktif, onTekan }: ChipPeriodeProps) => (
tolong tambahkan fungsi untuk menampilkan tanggal 
   baca dahulu file  GEMINI.md
  ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
   selalu tulis kan jalur path file di paling atas setiap file
   tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
   */}
  <TouchableOpacity
    style={[styles.chip, aktif && styles.chipAktif]}
    onPress={onTekan}
  >
    <Text style={[styles.teksChip, aktif && styles.teksChipAktif]}>{label}</Text>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// NAVIGASI PERIODE
// ─────────────────────────────────────────────
interface NavigasiPeriodeProps {
  label: string;
  onKiri: () => void;
  onKanan: () => void;
  bisaKanan: boolean;
}

const NavigasiPeriode = ({ label, onKiri, onKanan, bisaKanan }: NavigasiPeriodeProps) => (
  <View style={styles.navigasiContainer}>
    <TouchableOpacity onPress={onKiri} style={styles.tombolNavigasi}>
      <Feather name="chevron-left" size={24} color={WARNA.TEKS_SEKUNDER} />
    </TouchableOpacity>
    <Text style={styles.labelPeriode}>{label}</Text>
    <TouchableOpacity onPress={onKanan} disabled={!bisaKanan} style={styles.tombolNavigasi}>
      <Feather
        name="chevron-right"
        size={24}
        color={bisaKanan ? WARNA.TEKS_SEKUNDER : WARNA.TEKS_NONAKTIF}
      />
    </TouchableOpacity>
  </View>
);

// ─────────────────────────────────────────────
// FILTER PERIODE - Tanpa Props, menggunakan Context
// ─────────────────────────────────────────────
export const FilterPeriode = () => {
  // Ambil state dan fungsi dari context
  const { periode, setPeriode, offsetPeriode, setOffsetPeriode } = useStatistik();

  const geserKiri = () => setOffsetPeriode(offsetPeriode - 1);
  const geserKanan = () => {
    if (offsetPeriode < 0) setOffsetPeriode(offsetPeriode + 1);
  };
  const bisaKanan = offsetPeriode < 0;

  const labelPeriodeAktif = getLabelPeriode(periode, offsetPeriode);

  const onUbahPeriode = (p: FilterPeriodeTipe) => {
    setPeriode(p);
    setOffsetPeriode(0); // reset ke periode sekarang
  };


  return (
    <>
      <View style={styles.containerPeriode}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollPeriodeContent}
        >
          {config.listTipeFilter.map((p) => (
            <ChipPeriode
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              aktif={periode === p}
              onTekan={() => onUbahPeriode(p)}
            />
          ))}
        </ScrollView>
      </View>

      <NavigasiPeriode
        label={labelPeriodeAktif}
        onKiri={geserKiri}
        onKanan={geserKanan}
        bisaKanan={bisaKanan}
      />
    </>
  );
};

const styles = StyleSheet.create({
  containerPeriode: {
    marginBottom: 20,
    marginHorizontal: -20,
  },
  scrollPeriodeContent: {
    gap: 8,
    paddingHorizontal: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: WARNA.SURFACE,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
  },
  chipAktif: {
    backgroundColor: WARNA.UTAMA,
    borderColor: WARNA.UTAMA,
  },
  teksChip: {
    fontSize: 14,
    fontWeight: '600',
    color: WARNA.TEKS_UTAMA,
  },
  teksChipAktif: {
    color: 'white',
  },
  navigasiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  tombolNavigasi: {
    padding: 4,
  },
  labelPeriode: {
    fontSize: 15,
    fontWeight: '600',
    color: WARNA.TEKS_UTAMA,
    width: 180,
    textAlign: 'center',
  },
});

const config = {
  listTipeFilter: [
    'harian',
    'mingguan',
    'bulanan',
    'tahunan',
  ] as FilterPeriodeTipe[],
};
