// screens/transaksi/DaftarTransaksi.tsx
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTransaksi } from '../../context/TransaksiContext';
import ItemTransaksi from './ItemTransaksi';

export default function DaftarTransaksi() {
  const { daftarTransaksi } = useTransaksi();

  if (daftarTransaksi.length === 0) {
    return (
      <View style={gaya.penampungKosong}>
        <Text style={gaya.teksKosong}>Belum ada riwayat transaksi.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={daftarTransaksi}
      renderItem={({ item }) => <ItemTransaksi item={item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={gaya.daftar}
      showsVerticalScrollIndicator={false}
    />
  );
}

const gaya = StyleSheet.create({
  daftar: {
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  penampungKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  teksKosong: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94a3b8',
    textAlign: 'center',
    letterSpacing: -0.2,
    backgroundColor: '#ffffff',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
});
