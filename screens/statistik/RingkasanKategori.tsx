// screens/statistik/RingkasanKategori.tsx
import type { TipeTransaksi } from '@/database/tipe';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WARNA } from './konstanta';
import { useStatistik } from './StatistikContext';
import type { RingkasanKategori as RingkasanKategoriTipe } from './tipe';

// ─────────────────────────────────────────────
// ITEM KATEGORI
// ─────────────────────────────────────────────
interface ItemKategoriProps {
  ringkasan: RingkasanKategoriTipe;
  persentase: number;
  onTekan: () => void;
}

const ItemKategori = ({ ringkasan, persentase, onTekan }: ItemKategoriProps) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onTekan}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemIkon}>{ringkasan.ikon || '❓'}</Text>
      <Text style={styles.itemNama}>{ringkasan.nama}</Text>
    </View>
    <View style={styles.itemJumlahContainer}>
      <Text style={styles.itemJumlah}>Rp {ringkasan.total.toLocaleString('id-ID')}</Text>
      <View style={styles.persentaseBarContainer}>
        <View
          style={[
            styles.persentaseBar,
            {
              width: `${persentase}%`,
              backgroundColor: WARNA.BIRU,
            },
          ]}
        />
      </View>
    </View>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// TAB TIPE - DIPERBARUI
// ─────────────────────────────────────────────
interface TabTipeProps {
  // DIUBAH: Tipe dispesifikkan karena komponen ini hanya untuk pemasukan/pengeluaran
  aktif: 'pemasukan' | 'pengeluaran';
  onUbah: (tipe: 'pemasukan' | 'pengeluaran') => void;
}

const TabTipe = ({ aktif, onUbah }: TabTipeProps) => (
  <View style={styles.tabContainer}>
    <Pressable
      style={[styles.tab, aktif === 'pengeluaran' && { backgroundColor: WARNA.MERAH }]}
      onPress={() => onUbah('pengeluaran')}
    >
      <Text style={[styles.teksTab, aktif === 'pengeluaran' && styles.teksTabAktif]}>
        Pengeluaran
      </Text>
    </Pressable>
    <Pressable
      style={[styles.tab, aktif === 'pemasukan' && { backgroundColor: WARNA.HIJAU }]}
      onPress={() => onUbah('pemasukan')}
    >
      <Text style={[styles.teksTab, aktif === 'pemasukan' && styles.teksTabAktif]}>Pemasukan</Text>
    </Pressable>
  </View>
);

// ─────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
export const RingkasanKategori = () => {
  const { tabKategori, setTabKategori, ringkasanPemasukan, ringkasanPengeluaran } = useStatistik();

  const ringkasanAktif = tabKategori === 'pemasukan' ? ringkasanPemasukan : ringkasanPengeluaran;

  const onPilihKategori = (_kategori: RingkasanKategoriTipe) => {
    // Aksi ini bisa digunakan untuk navigasi ke detail kategori
  };

  const totalKeseluruhan = ringkasanAktif.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <View style={styles.seksi}>
      <Text style={styles.judulSeksi}>Berdasarkan Kategori</Text>
      {/* Perubahan di sini tidak error karena setTabKategori sudah sesuai tipenya */}
      <TabTipe aktif={tabKategori} onUbah={setTabKategori} />
      {ringkasanAktif.length === 0 ? (
        <View style={styles.kosong}>
          <Text style={styles.teksKosong}>Belum ada data pada periode ini</Text>
        </View>
      ) : (
        ringkasanAktif.map((r) => {
          const persentase = totalKeseluruhan > 0 ? (r.total / totalKeseluruhan) * 100 : 0;
          return (
            <ItemKategori
              key={r.id}
              ringkasan={r}
              persentase={persentase}
              onTekan={() => onPilihKategori(r)}
            />
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  seksi: {
    backgroundColor: WARNA.SURFACE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: WARNA.BORDER,
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  judulSeksi: {
    fontSize: 16,
    fontWeight: '700',
    color: WARNA.TEKS_UTAMA,
    marginBottom: 16,
  },
  kosong: {
    paddingVertical: 36,
    alignItems: 'center',
  },
  teksKosong: {
    fontSize: 14,
    color: WARNA.TEKS_TERSIER,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: WARNA.BG,
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
  teksTab: {
    fontSize: 13,
    fontWeight: '600',
    color: WARNA.TEKS_UTAMA,
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
    borderBottomColor: WARNA.BORDER,
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
    color: WARNA.TEKS_UTAMA,
  },
  itemJumlahContainer: {
    alignItems: 'flex-end',
  },
  itemJumlah: {
    fontSize: 14,
    fontWeight: '700',
    color: WARNA.TEKS_UTAMA,
    marginBottom: 4,
  },
  persentaseBarContainer: {
    height: 4,
    width: 60,
    backgroundColor: WARNA.BG,
    borderRadius: 2,
  },
  persentaseBar: {
    height: 4,
    borderRadius: 2,
  },
});
