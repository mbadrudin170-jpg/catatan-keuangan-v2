// screens/dompet/DompetScreen.tsx
import { useDompet } from '@/context/DompetContext';
import HeaderDompet from '@/screens/dompet/HeaderDompet';
import ListDompet from '@/screens/dompet/ListDompet';
import TombolTambahDompet from '@/screens/dompet/tombol/TombolTambahDompet';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DompetScreen() {
  const { daftarDompet } = useDompet();

  const handleDompetPress = (id: number) => {
    router.push(`/dompet/${id}`);
  };

  return (
    <SafeAreaView style={gaya.wadahUtama}>
      <HeaderDompet />
      <ListDompet dompet={daftarDompet} onPress={handleDompetPress} />
      <TombolTambahDompet />
    </SafeAreaView>
  );
}

// Palet warna untuk layar ini
const warna = {
  latar: '#ffffff', // Warna latar putih bersih
};

// Kumpulan gaya untuk layar ini
const gaya = StyleSheet.create({
  wadahUtama: {
    flex: 1, // Memastikan wadah mengisi seluruh layar
    backgroundColor: warna.latar,
  },
});
