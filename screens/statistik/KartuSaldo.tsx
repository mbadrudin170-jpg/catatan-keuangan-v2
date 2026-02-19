// screens/statistik/KartuSaldo.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ─────────────────────────────────────────────
// TIPE INTERNAL
// ─────────────────────────────────────────────
interface KartuSaldoProps {
  saldo: number;
  pemasukan: number;
  pengeluaran: number;
}

// ─────────────────────────────────────────────
// KONSTANTA DESAIN
// ─────────────────────────────────────────────
const WARNA = {
  surface: '#FFFFFF',
  border: '#E2E8F0',
  hijau: '#16A34A',
  merah: '#DC2626',
  biru: '#2563EB',
  teksUtama: '#0F172A',
  teksSekunder: '#64748B',
};

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
const formatRupiah = (angka: number): string => {
  if (angka >= 1_000_000_000) return `Rp ${(angka / 1_000_000_000).toFixed(1)}M`;
  if (angka >= 1_000_000) return `Rp ${(angka / 1_000_000).toFixed(1)}Jt`;
  if (angka >= 1_000) return `Rp ${(angka / 1_000).toFixed(0)}Rb`;
  return `Rp ${angka}`;
};

const formatRupiahLengkap = (angka: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka);

// ─────────────────────────────────────────────
// KOMPONEN: KARTU SALDO UTAMA
// ─────────────────────────────────────────────
export const KartuSaldo = ({ saldo, pemasukan, pengeluaran }: KartuSaldoProps) => (
  <View style={styles.kartuSaldo}>
    <View style={styles.dekorasiSaldo1} />
    <View style={styles.dekorasiSaldo2} />

    <Text style={styles.labelSaldo}>Total Saldo</Text>
    <Text style={styles.nilaiSaldo}>{formatRupiahLengkap(saldo)}</Text>

    <View style={styles.barisKartuSaldo}>
      <View style={styles.itemKartuSaldo}>
        <View style={[styles.dotIndikator, { backgroundColor: WARNA.hijau }]} />
        <View>
          <Text style={styles.labelItemKartu}>Pemasukan</Text>
          <Text style={[styles.nilaiItemKartu, { color: WARNA.hijau }]}>
            {formatRupiah(pemasukan)}
          </Text>
        </View>
      </View>
      <View style={styles.pemisahVertikal} />
      <View style={styles.itemKartuSaldo}>
        <View style={[styles.dotIndikator, { backgroundColor: WARNA.merah }]} />
        <View>
          <Text style={styles.labelItemKartu}>Pengeluaran</Text>
          <Text style={[styles.nilaiItemKartu, { color: WARNA.merah }]}>
            {formatRupiah(pengeluaran)}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  kartuSaldo: {
    backgroundColor: WARNA.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: WARNA.border,
    overflow: 'hidden',
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  dekorasiSaldo1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${WARNA.biru}12`,
    top: -70,
    right: -50,
  },
  dekorasiSaldo2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: `${WARNA.hijau}10`,
    bottom: -40,
    left: 30,
  },
  labelSaldo: {
    fontSize: 12,
    color: WARNA.teksSekunder,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  nilaiSaldo: {
    fontSize: 32,
    fontWeight: '700',
    color: WARNA.teksUtama,
    letterSpacing: -1,
    marginBottom: 24,
  },
  barisKartuSaldo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemKartuSaldo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dotIndikator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  labelItemKartu: {
    fontSize: 11,
    color: WARNA.teksSekunder,
    marginBottom: 2,
  },
  nilaiItemKartu: {
    fontSize: 15,
    fontWeight: '700',
  },
  pemisahVertikal: {
    width: 1,
    height: 36,
    backgroundColor: WARNA.border,
    marginHorizontal: 16,
  },
});
