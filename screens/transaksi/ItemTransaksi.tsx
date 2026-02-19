// screens/transaksi/ItemTransaksi.tsx
import { StyleSheet, Text, View } from 'react-native';
import { useDompet } from '../../context/DompetContext';
import { useKategori } from '../../context/KategoriContext';
import type { Transaksi } from '../../database/tipe';
import { formatAngka } from '../../utils/format/FormatAngka';

interface Props {
  item: Transaksi;
}

export default function ItemTransaksi({ item }: Props) {
  const { daftarKategori } = useKategori();
  const { daftarDompet } = useDompet();

  // --- DIPERBAIKI: Cari objek kategori dan dompet berdasarkan ID ---
  const kategori = daftarKategori.find((k) => k.id === item.kategori_id);
  const dompet = daftarDompet.find((d) => d.id === item.dompet_id);

  const namaKategori = kategori?.nama || 'Lainnya';
  const namaDompet = dompet?.nama || '-';

  // --- DIPERBAIKI: Tentukan warna & tanda berdasarkan tipe kategori ---
  const isPemasukkan = kategori?.tipe === 'pemasukan';
  const warnaNominal = { color: isPemasukkan ? '#10b981' : '#ef4444' };
  const tanda = isPemasukkan ? '+' : '-';

  return (
    <View style={gaya.wadah}>
      <View style={gaya.infoKiri}>
        {/* --- DIPERBAIKI: Gunakan `keterangan` bukan `nama` --- */}
        <Text style={gaya.teksNama} numberOfLines={1}>
          {item.keterangan}
        </Text>
        {/* --- DIPERBAIKI: Tampilkan nama kategori dan dompet --- */}
        <Text style={gaya.teksKategori}>{`${namaKategori} · ${namaDompet}`}</Text>
      </View>
      {/* --- DIPERBAIKI: Gunakan `jumlah` dan format yang benar --- */}
      <Text style={[gaya.teksNominal, warnaNominal]}>
        {tanda} {formatAngka(item.jumlah)}
      </Text>
    </View>
  );
}

// Gaya dipercantik dengan tampilan modern
const gaya = StyleSheet.create({
  wadah: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 16,
    // Shadow modern & lebih lembut
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    // Border tipis untuk definisi
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  infoKiri: {
    flex: 1,
    marginRight: 12,
  },
  teksNama: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  teksKategori: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  teksNominal: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
});
