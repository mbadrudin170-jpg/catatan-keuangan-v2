// screens/form-dompet/TombolSimpan.tsx
import { Pressable, StyleSheet, Text } from 'react-native';
import { useDompet } from '../../context/DompetContext';

export default function TombolSimpan() {
  // Ambil fungsi simpanDompetBaru dari context yang sudah diperbarui
  const { simpanDompetBaru } = useDompet();

  return (
    // Panggil fungsi simpanDompetBaru saat tombol ditekan
    <Pressable style={gaya.tombol} onPress={simpanDompetBaru}>
      <Text style={gaya.teksTombol}>Simpan</Text>
    </Pressable>
  );
}

const gaya = StyleSheet.create({
  tombol: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  teksTombol: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
