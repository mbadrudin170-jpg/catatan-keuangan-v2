// screens/form-dompet/TombolSimpan.tsx
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useDompet } from '@/context/DompetContext';

export default function TombolSimpan() {
  // Ambil fungsi simpan universal dan state form dari konteks
  const { simpanDompetBaru, formDompet } = useDompet();

  const handleSimpan = async () => {
    try {
      // Panggil satu fungsi saja, logika edit/tambah sudah ada di dalam konteks
      await simpanDompetBaru();
      // Setelah berhasil, kembali ke layar sebelumnya
      router.back();
    } catch (error) {
      // Error logging tetap sama, tetapi lebih sederhana
      console.error(`Gagal menyimpan dompet:`, error);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}
      onPress={handleSimpan}
    >
      {/* Teks tombol dinamis berdasarkan keberadaan `id` di form state */}
      <Text style={gaya.teksTombol}>{formDompet.id ? 'Perbarui' : 'Simpan'}</Text>
    </Pressable>
  );
}

const warna = {
  primer: '#3b82f6',
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
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tombolDitekan: {
    opacity: 0.9,
  },
  teksTombol: {
    color: warna.putih,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
