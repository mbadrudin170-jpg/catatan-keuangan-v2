// ~/catatan-keuangan-v2/screens/detail-dompet/TombolHapusDetailDompet.tsx

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDetailDompetContext } from './logikaDetailDompet';

export default function TombolHapusDetailDompet() {
  const { onHapus } = useDetailDompetContext();

  return (
    <View style={gaya.wadah}>
      <Pressable onPress={onHapus} style={gaya.tombol}>
        <Text style={gaya.teksTombol}>Hapus Dompet</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tombol: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  teksTombol: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
