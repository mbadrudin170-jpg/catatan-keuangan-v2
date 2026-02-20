// app/(tabs)/transaksi.tsx

import DaftarTransaksi from '@/screens/transaksi/DaftarTransaksi';
import HeaderTransaksi from '@/screens/transaksi/HeaderTransaksi';
import TombolTambahTransaksi from '@/screens/transaksi/TombolTambahTransaksi';
import { useTransaksi } from '@/context/TransaksiContext';
import { useKategori } from '@/context/KategoriContext';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Transaksi() {
  const { semuaTransaksi } = useTransaksi();
  const { semuaKategori } = useKategori();
  const router = useRouter();

  const handlePressItem = (id: number) => {
    router.push(`/(detail)/transaksi/${String(id)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTransaksi />
      <DaftarTransaksi
        transaksi={semuaTransaksi}
        kategori={semuaKategori}
        onPressItem={handlePressItem}
      />
      <TombolTambahTransaksi />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
