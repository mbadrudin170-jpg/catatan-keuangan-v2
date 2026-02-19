// screens/form-transaksi/tombol/TombolSimpanFormTransaksi.tsx
import { useTransaksi } from '@/context/TransaksiContext';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TombolSimpanFormTransaksi() {
  const router = useRouter();
  const { transaksi, setTransaksi, tambahTransaksi } = useTransaksi();

  const apakahTombolNonaktif = (() => {
    if (transaksi.jumlah <= 0 || !transaksi.dompet_id) {
      return true;
    }
    if (transaksi.tipe === 'transfer') {
      if (!transaksi.dompet_tujuan_id || transaksi.dompet_id === transaksi.dompet_tujuan_id) {
        return true;
      }
    } else {
      if (!transaksi.kategori_id) {
        return true;
      }
    }
    return false;
  })();

  // DIUBAH: Logika handleSimpan dibuat async dan dibungkus try...catch
  const handleSimpan = async () => {
    if (apakahTombolNonaktif) return;

    try {
      // 1. Tunggu proses penyimpanan selesai
      await tambahTransaksi(transaksi);

      // 2. Jika berhasil, reset form ke kondisi awal
      setTransaksi({
        id: Date.now(),
        jumlah: 0,
        keterangan: '',
        tanggal: new Date().toISOString(),
        tipe: 'pengeluaran',
        kategori_id: null,
        dompet_id: 0,
        dompet_tujuan_id: null,
        subkategori_id: null,
      });

      // 3. Navigasi kembali hanya setelah semua berhasil
      router.back();
    } catch (error: any) {
      // 4. Jika ada error (dari validasi di context), tampilkan ke pengguna
      console.error('Gagal menyimpan dari TombolSimpan:', error);
      Alert.alert('Gagal Menyimpan', error.message || 'Terjadi kesalahan yang tidak diketahui.');
    }
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
