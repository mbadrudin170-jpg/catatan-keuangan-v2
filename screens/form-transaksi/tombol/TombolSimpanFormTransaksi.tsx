// screens/form-transaksi/tombol/TombolSimpanFormTransaksi.tsx
import { useTransaksi } from '@/context/TransaksiContext';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TombolSimpanFormTransaksi() {
  const router = useRouter();
  const { transaksi, setTransaksi, tambahTransaksi } = useTransaksi();

  // --- LOGIKA VALIDASI BARU ---
  const apakahTombolNonaktif = (() => {
    // Validasi dasar untuk semua tipe
    if (transaksi.jumlah <= 0 || !transaksi.dompet_id) {
      return true;
    }

    // Validasi spesifik untuk tipe transfer
    if (transaksi.tipe === 'transfer') {
      // Harus ada dompet tujuan DAN dompet asal tidak boleh sama dengan dompet tujuan
      if (!transaksi.dompet_tujuan_id || transaksi.dompet_id === transaksi.dompet_tujuan_id) {
        return true;
      }
    } else {
      // Validasi untuk pemasukan/pengeluaran
      if (!transaksi.kategori_id) {
        return true;
      }
    }

    // Jika semua validasi lolos
    return false;
  })();
  // --- AKHIR LOGIKA VALIDASI ---

  const handleSimpan = () => {
    if (apakahTombolNonaktif) return;

    tambahTransaksi(transaksi);

    // --- RESET FORM BARU ---
    setTransaksi({
      id: Date.now(),
      jumlah: 0,
      keterangan: '',
      tanggal: new Date().toISOString(),
      tipe: 'pengeluaran', // Reset ke tipe default
      kategori_id: null,
      dompet_id: 0,
      dompet_tujuan_id: null, // Reset dompet tujuan
      subkategori_id: null,
    });
    // --- AKHIR RESET FORM ---

    router.back();
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
