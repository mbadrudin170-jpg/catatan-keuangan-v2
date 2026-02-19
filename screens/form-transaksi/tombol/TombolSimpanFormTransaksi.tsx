// screens/form-transaksi/tombol/TombolSimpanFormTransaksi.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router'; // <-- BARU: Impor router
import { useTransaksi } from '../../../context/TransaksiContext';

export default function TombolSimpanFormTransaksi() {
  const router = useRouter(); // <-- BARU: Inisialisasi router
  const { transaksi, setTransaksi, tambahTransaksi } = useTransaksi();

  const apakahTombolNonaktif =
    !transaksi.keterangan ||
    transaksi.jumlah === 0 ||
    transaksi.dompet_id === 0 ||
    transaksi.kategori_id === null;

  const handleSimpan = () => {
    if (apakahTombolNonaktif) return;

    tambahTransaksi(transaksi);

    // Mengosongkan state setelah disimpan
    setTransaksi({
      id: Date.now(),
      jumlah: 0,
      keterangan: '',
      tanggal: new Date().toISOString(),
      kategori_id: null,
      dompet_id: 0,
    });

    router.back(); // <-- BARU: Kembali ke layar sebelumnya
  };

  return (
    <View style={gaya.penampung}>
      <Pressable
        style={({ pressed }) => [
          gaya.tombol,
          apakahTombolNonaktif && gaya.tombolNonaktif,
          pressed && !apakahTombolNonaktif && gaya.tombolDitekan,
        ]}
        onPress={handleSimpan}
        disabled={apakahTombolNonaktif}
      >
        <Text style={gaya.teksTombol}>Simpan</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tombol: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  tombolDitekan: {
    backgroundColor: '#1976D2',
  },
  tombolNonaktif: {
    backgroundColor: '#ccc',
  },
  teksTombol: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
