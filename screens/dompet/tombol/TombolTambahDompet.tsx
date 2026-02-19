// screens/dompet/tombol/TombolTambahDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export default function TombolTambahDompet() {
  const handleTekan = () => {
    // Mengarahkan pengguna ke halaman form untuk membuat dompet baru
    router.push('/(form)/form-dompet');
  };

  return (
    // Wadah ini memposisikan tombol di pojok kanan bawah
    <View style={gaya.wadah}>
      <Pressable
        style={({ pressed }) => [
          gaya.tombol,
          { opacity: pressed ? 0.8 : 1 }, // Memberi efek visual saat tombol ditekan
        ]}
        onPress={handleTekan}
      >
        <Ionicons name="add" size={32} color={warna.putih} />
      </Pressable>
    </View>
  );
}

// Palet warna untuk tombol
const warna = {
  primer: '#3b82f6', // Warna biru sebagai warna utama
  putih: '#ffffff',
};

// Kumpulan gaya untuk komponen
const gaya = StyleSheet.create({
  wadah: {
    position: 'absolute', // Membuat posisi mengambang relatif terhadap parent
    bottom: 30, // Jarak 30 piksel dari bawah
    right: 20, // Jarak 20 piksel dari kanan
  },
  tombol: {
    backgroundColor: warna.primer,
    width: 60,
    height: 60,
    borderRadius: 30, // Setengah dari lebar/tinggi untuk membuatnya jadi lingkaran sempurna
    justifyContent: 'center', // Ikon berada di tengah (vertikal)
    alignItems: 'center', // Ikon berada di tengah (horizontal)
    // Efek bayangan untuk tampilan modern di iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // Efek bayangan untuk tampilan modern di Android
    elevation: 8,
  },
});
