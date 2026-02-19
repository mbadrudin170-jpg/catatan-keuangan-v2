
// screens/statistik/FilterPeriode.tsx
import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FilterPeriode as FilterPeriodeTipe } from './data';
import { getLabelPeriode } from './util';
import { WARNA } from './konstanta';

// ─────────────────────────────────────────────
// CHIP PERIODE
// ─────────────────────────────────────────────
interface ChipPeriodeProps {
  label: string;
  aktif: boolean;
  onTekan: () => void;
}

const ChipPeriode = ({ label, aktif, onTekan }: ChipPeriodeProps) => (
  <TouchableOpacity
    style={[styles.chip, aktif && styles.chipAktif]}
    onPress={onTekan}
  >
    <Text style={[styles.teksChip, aktif && styles.teksChipAktif]}>
      {label}
    </Text>
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
      <Feather name="chevron-left" size={24} color={WARNA.teksSekunder} />
    </TouchableOpacity>
    <Text style={styles.labelPeriode}>{label}</Text>
    <TouchableOpacity onPress={onKanan} disabled={!bisaKanan} style={styles.tombolNavigasi}>
      <Feather name="chevron-right" size={24} color={bisaKanan ? WARNA.teksSekunder : WARNA.teksNonaktif} />
    </TouchableOpacity>
  </View>
);


// ─────────────────────────────────────────────
// FILTER PERIODE
// ─────────────────────────────────────────────
interface FilterPeriodeProps {
  periode: FilterPeriodeTipe;
  offsetPeriode: number;
  onPeriodeChange: (periode: FilterPeriodeTipe) => void;
  onOffsetPeriodeChange: (offset: number) => void;
}

export const FilterPeriode = ({ periode, offsetPeriode, onPeriodeChange, onOffsetPeriodeChange }: FilterPeriodeProps) => {
  const geserKiri = () => onOffsetPeriodeChange(offsetPeriode - 1);
  const geserKanan = () => {
    if (offsetPeriode < 0) onOffsetPeriodeChange(offsetPeriode + 1);
  };
  const bisaKanan = offsetPeriode < 0;

  const labelPeriodeAktif = getLabelPeriode(periode, offsetPeriode);

  const onUbahPeriode = (p: FilterPeriodeTipe) => {
    onPeriodeChange(p);
    onOffsetPeriodeChange(0); // reset ke periode sekarang
  };

  return (
    <>
      <View style={styles.containerPeriode}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollPeriodeContent}
        >
          {(['harian', 'mingguan', 'bulanan', 'tahunan', 'semua', 'kalender'] as FilterPeriodeTipe[]).map((p) => (
            <ChipPeriode
              key={p}
              label={p.charAt(0).toUpperCase() + p.slice(1)}
              aktif={periode === p}
              onTekan={() => onUbahPeriode(p as FilterPeriodeTipe)}
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
    backgroundColor: WARNA.surface,
    borderWidth: 1,
    borderColor: WARNA.border,
  },
  chipAktif: {
    backgroundColor: WARNA.utama,
    borderColor: WARNA.utama,
  },
  teksChip: {
    fontSize: 14,
    fontWeight: '600',
    color: WARNA.teksUtama,
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
    color: WARNA.teksUtama,
    width: 180,
    textAlign: 'center',
  },
});
