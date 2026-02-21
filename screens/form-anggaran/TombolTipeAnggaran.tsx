// ~/catatan-keuangan-v2/screens/form-anggaran/TombolTipeAnggaran.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  tipeAnggaran: 'flat' | 'persentase';
  setTipeAnggaran: (tipe: 'flat' | 'persentase') => void;
}

export default function TombolTipeAnggaran({ tipeAnggaran, setTipeAnggaran }: Props) {
  return (
    <View style={styles.wadah}>
      <Pressable
        style={[styles.tombol, tipeAnggaran === 'flat' ? styles.tombolAktif : {}]}
        onPress={() => setTipeAnggaran('flat')}
      >
        <Text style={tipeAnggaran === 'flat' ? styles.teksAktif : styles.teksNonaktif}>Flat</Text>
      </Pressable>
      <Pressable
        style={[styles.tombol, tipeAnggaran === 'persentase' ? styles.tombolAktif : {}]}
        onPress={() => setTipeAnggaran('persentase')}
      >
        <Text style={tipeAnggaran === 'persentase' ? styles.teksAktif : styles.teksNonaktif}>
          Persentase
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  tombol: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tombolAktif: {
    backgroundColor: '#007BFF',
  },
  teksAktif: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  teksNonaktif: {
    color: '#495057',
    fontWeight: '500',
  },
});
