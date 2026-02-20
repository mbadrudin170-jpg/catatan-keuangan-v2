// screens/statistik/FilterPeriode.tsx
import { Feather } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WARNA } from './konstanta';
import { useStatistik } from './StatistikContext';
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
  <TouchableOpacity style={[styles.chip, aktif && styles.chipAktif]} onPress={onTekan}>
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
  periode: FilterPeriodeTipe;
}

const NavigasiPeriode = ({
  label,
  onKiri,
  onKanan,
  bisaKanan,
  periode,
}: NavigasiPeriodeProps) => {
  // Navigasi tidak ditampilkan untuk 'semua' atau 'pilih tanggal'
  if (periode === 'semua' || periode === 'pilih tanggal') {
    return null;
  }
  
  return (
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
};

// ─────────────────────────────────────────────
// FILTER PERIODE - Tanpa Props, menggunakan Context
// ─────────────────────────────────────────────
export const FilterPeriode = () => {
  const {
    periode,
    setPeriode,
    offsetPeriode,
    setOffsetPeriode,
    rentangTanggal,
    setRentangTanggal,
  } = useStatistik();

  const [pickerTerlihat, setPickerTerlihat] = useState(false);
  const [pickerUntuk, setPickerUntuk] = useState<'mulai' | 'selesai'>('mulai');

  const bukaPemilihTanggal = (untuk: 'mulai' | 'selesai') => {
    setPickerUntuk(untuk);
    setPickerTerlihat(true);
  };

  const onUbahTanggal = (event: DateTimePickerEvent, tanggal?: Date) => {
    setPickerTerlihat(false);
    if (event.type === 'set' && tanggal) {
      const tanggalBaru = { ...rentangTanggal };
      if (pickerUntuk === 'mulai') {
        tanggalBaru.mulai = tanggal;
      } else {
        tanggalBaru.selesai = tanggal;
      }
      setRentangTanggal(tanggalBaru);
    }
  };

  const geserKiri = () => {
    setOffsetPeriode(offsetPeriode - 1);
  };
  const geserKanan = () => {
    if (offsetPeriode < 0) {
      setOffsetPeriode(offsetPeriode + 1);
    }
  };
  const bisaKanan = offsetPeriode < 0;

  const labelPeriodeAktif = getLabelPeriode(periode, offsetPeriode, rentangTanggal);

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
      
      {periode === 'pilih tanggal' && (
        <View style={styles.wadahPilihTanggal}>
            <Text style={styles.labelPilihTanggal}>Pilih Rentang:</Text>
            <TouchableOpacity onPress={() => bukaPemilihTanggal('mulai')} style={styles.inputTanggal}>
                <Text>{rentangTanggal.mulai.toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</Text>
            </TouchableOpacity>
            <Feather name="arrow-right" size={20} color={WARNA.TEKS_SEKUNDER} />
            <TouchableOpacity onPress={() => bukaPemilihTanggal('selesai')} style={styles.inputTanggal}>
                <Text>{rentangTanggal.selesai.toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}</Text>
            </TouchableOpacity>
        </View>
      )}

      {pickerTerlihat && (
        <DateTimePicker
          value={pickerUntuk === 'mulai' ? rentangTanggal.mulai : rentangTanggal.selesai}
          mode="date"
          display="default"
          onChange={onUbahTanggal}
        />
      )}

      <NavigasiPeriode
        label={labelPeriodeAktif}
        onKiri={geserKiri}
        onKanan={geserKanan}
        bisaKanan={bisaKanan}
        periode={periode}
      />
    </>
  );
};

const styles = StyleSheet.create({
  containerPeriode: {
    marginBottom: 16,
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
  wadahPilihTanggal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: WARNA.SURFACE,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
  },
  labelPilihTanggal: {
      fontSize: 14,
      fontWeight: '600',
      color: WARNA.TEKS_SEKUNDER
  },
  inputTanggal: {
    borderWidth: 1,
    borderColor: WARNA.BORDER,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
});

const config = {
  listTipeFilter: [
    'harian',
    'mingguan',
    'bulanan',
    'tahunan',
    'semua',
    'pilih tanggal',
  ] as FilterPeriodeTipe[],
};