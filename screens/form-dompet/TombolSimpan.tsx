// screens/form-dompet/TombolSimpan.tsx
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useDompet } from '../../context/DompetContext';

export default function TombolSimpan() {
  // Ambil fungsi yang dibutuhkan dari context
  const { simpanDompetBaru, setDataForm } = useDompet();

  // Buat fungsi handler untuk menangani beberapa aksi sekaligus
  const handleSimpan = async () => {
    try {
      // 1. Panggil fungsi untuk menyimpan data
      await simpanDompetBaru();

      // 2. Jika berhasil, kembali ke layar sebelumnya
      router.back();

      // 3. Bersihkan state form agar siap untuk input berikutnya
      setDataForm({
        namaDompet: '',
        saldoAwal: '',
        tipe: '',
        ikon: '',
      });
    } catch (error) {
      console.error('Gagal menyimpan dompet:', error);
      // Di sini bisa ditambahkan feedback ke pengguna jika terjadi error
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}
      onPress={handleSimpan} // Gunakan handler yang baru
    >
      <Text style={gaya.teksTombol}>Simpan</Text>
    </Pressable>
  );
}

const warna = {
  primer: '#3b82f6', // Biru modern
  putih: '#ffffff',
};

const gaya = StyleSheet.create({
  tombol: {
    backgroundColor: warna.primer,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24, // Beri jarak dari elemen di atasnya
    elevation: 2, // Bayangan untuk Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tombolDitekan: {
    opacity: 0.9, // Efek saat tombol ditekan
  },
  teksTombol: {
    color: warna.putih,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
