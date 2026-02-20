import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import type { Kategori, Subkategori, Transaksi } from '@/database/tipe';
import { formatMataUang } from '@/utils/formatMataUang';

interface Props {
  transaksi: Transaksi;
}

export default function KartuTransaksi({ transaksi }: Props) {
  const { semuaKategori } = useKategori();
  const { daftarDompet } = useDompet();

  const semuaSubkategori = semuaKategori.flatMap((k: Kategori) => k.subkategori);
  const subkategori = semuaSubkategori.find((s: Subkategori) => s.id === transaksi.kategori_id);
  const kategoriInduk = semuaKategori.find((k: Kategori) => k.id === subkategori?.kategori_id);
  const dompet = daftarDompet.find((d) => d.id === transaksi.dompet_id);

  const namaKategori = subkategori?.nama || 'Lainnya';
  const namaDompet = dompet?.nama || '-';

  const isPemasukkan = kategoriInduk?.tipe === 'pemasukan';
  const warnaNominal = { color: isPemasukkan ? '#10b981' : '#ef4444' };
  const tanda = isPemasukkan ? '+' : '-';

  const bukaDetail = () => {
    router.push(`/transaksi/${transaksi.id}`);
  };

  return (
    <Pressable style={styles.wadah} onPress={bukaDetail}>
      <View style={styles.infoKiri}>
        <Text style={styles.teksNama} numberOfLines={1}>
          {transaksi.keterangan}
        </Text>
        <Text style={styles.teksKategori}>{`${namaKategori} · ${namaDompet}`}</Text>
      </View>
      <Text style={[styles.teksNominal, warnaNominal]}>
        {tanda} {formatMataUang(transaksi.jumlah)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wadah: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
