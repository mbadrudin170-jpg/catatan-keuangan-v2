// screens/statistik/RingkasanKategori.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TipeTransaksi, Kategori } from '@/database/tipe';
import { RingkasanKategori as RingkasanKategoriTipe } from './data';
import { WARNA } from './konstanta';

// ─────────────────────────────────────────────
// ITEM KATEGORI
// ─────────────────────────────────────────────
interface ItemKategoriProps {
  ringkasan: RingkasanKategoriTipe;
  indeks: number;
  onTekan: () => void;
}

const ItemKategori = ({ ringkasan, indeks, onTekan }: ItemKategoriProps) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onTekan}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemIkon}>{ringkasan.kategori.ikon || '❓'}</Text>
      <Text style={styles.itemNama}>{ringkasan.kategori.nama}</Text>
    </View>
    <View style={styles.itemJumlahContainer}>
      <Text style={styles.itemJumlah}>
        Rp {ringkasan.total.toLocaleString('id-ID')}
      </Text>
      <View style={styles.persentaseBarContainer}>
        <View
          style={[
            styles.persentaseBar,
            {
              width: `${ringkasan.persentase}%`,
              backgroundColor: WARNA.biru, // Warna bisa disesuaikan
            },
          ]}
        />
      </View>
    </View>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// TAB TIPE
// ─────────────────────────────────────────────
interface TabTipeProps {
  aktif: TipeTransaksi;
  onUbah: (tipe: TipeTransaksi) => void;
}

const TabTipe = ({ aktif, onUbah }: TabTipeProps) => (
  <View style={styles.tabContainer}>
    <TouchableOpacity
      style={[styles.tab, aktif === 'pengeluaran' && styles.tabAktif]}
      onPress={() => onUbah('pengeluaran')}
    >
      <Text style={[styles.teksTab, aktif === 'pengeluaran' && styles.teksTabAktif]}>
        Pengeluaran
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tab, aktif === 'pemasukan' && styles.tabAktif]}
      onPress={() => onUbah('pemasukan')}
    >
      <Text style={[styles.teksTab, aktif === 'pemasukan' && styles.teksTabAktif]}>
        Pemasukan
      </Text>
    </TouchableOpacity>
  </View>
);


interface RingkasanKategoriProps {
  tabAktif: TipeTransaksi;
  onTabChange: (tab: TipeTransaksi) => void;
  ringkasanAktif: RingkasanKategoriTipe[];
  onPilihKategori: (kategori: Kategori) => void;
}

export const RingkasanKategori = ({ tabAktif, onTabChange, ringkasanAktif, onPilihKategori }: RingkasanKategoriProps) => (
  <View style={styles.seksi}>
    <Text style={styles.judulSeksi}>Berdasarkan Kategori</Text>
    <TabTipe aktif={tabAktif} onUbah={onTabChange} />
    {ringkasanAktif.length === 0 ? (
      <View style={styles.kosong}>
        <Text style={styles.teksKosong}>Belum ada data pada periode ini</Text>
      </View>
    ) : (
      ringkasanAktif.map((r, i) => (
        <ItemKategori
          key={r.kategori.id}
          ringkasan={r}
          indeks={i}
          onTekan={() => onPilihKategori(r.kategori)}
        />
      ))
    )}
  </View>
);

const styles = StyleSheet.create({
 seksi: {
    backgroundColor: WARNA.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: WARNA.border,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  judulSeksi: {
    fontSize: 16,
    fontWeight: '700',
    color: WARNA.teksUtama,
    marginBottom: 16,
  },
  kosong: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  teksKosong: {
    fontSize: 14,
    color: WARNA.teksTersier,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: WARNA.bg,
    borderRadius: 99,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 99,
    alignItems: 'center',
  },
  tabAktif: {
    backgroundColor: WARNA.utama,
  },
  teksTab: {
    fontSize: 13,
    fontWeight: '600',
    color: WARNA.teksUtama,
  },
  teksTabAktif: {
    color: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WARNA.border,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIkon: {
    fontSize: 18,
  },
  itemNama: {
    fontSize: 14,
    fontWeight: '600',
    color: WARNA.teksUtama,
  },
  itemJumlahContainer: {
    alignItems: 'flex-end',
  },
  itemJumlah: {
    fontSize: 14,
    fontWeight: '700',
    color: WARNA.teksUtama,
    marginBottom: 4,
  },
  persentaseBarContainer: {
    height: 4,
    width: 60, // Sesuaikan lebar bar
    backgroundColor: WARNA.bg,
    borderRadius: 2,
  },
  persentaseBar: {
    height: 4,
    borderRadius: 2,
  },
});
