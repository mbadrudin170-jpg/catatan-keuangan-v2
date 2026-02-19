// screens/form-dompet/TombolSimpan.tsx
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useDompet } from '@/context/DompetContext';

// Terima prop `idEdit` yang bisa berupa angka atau undefined
export default function TombolSimpan({ idEdit }: { idEdit?: number }) {
  const { simpanDompetBaru, perbaruiDompet } = useDompet();

  const handleSimpan = async () => {
    try {
      if (idEdit !== undefined) {
        // Jika ada idEdit, panggil fungsi perbarui
        await perbaruiDompet(idEdit);
      } else {
        // Jika tidak, panggil fungsi simpan baru
        await simpanDompetBaru();
      }
      // Setelah berhasil, kembali ke layar sebelumnya
      router.back();
    } catch (error) {
      // Pesan error lebih spesifik berdasarkan konteks
      const aksi = idEdit !== undefined ? 'memperbarui' : 'menyimpan';
      console.error(`Gagal ${aksi} dompet:`, error);
      // Di sini bisa ditambahkan feedback ke pengguna
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [gaya.tombol, pressed && gaya.tombolDitekan]}
      onPress={handleSimpan}
    >
      {/* Teks tombol dinamis berdasarkan mode (edit atau simpan) */}
      <Text style={gaya.teksTombol}>
        {idEdit !== undefined ? 'Perbarui' : 'Simpan'}
      </Text>
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
