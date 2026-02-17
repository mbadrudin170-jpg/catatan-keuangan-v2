// screens/form-kategori/TombolTipe.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useKategori } from '../../context/KategoriContext';

// Komponen tidak lagi menerima props
export default function TombolTipe() {
  // Mengambil state dan fungsi langsung dari context
  const { tipeAktif, setTipeAktif } = useKategori();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.button,
          tipeAktif === 'Pemasukkan' && styles.activePemasukkan,
        ]}
        onPress={() => setTipeAktif('Pemasukkan')}
      >
        <Text
          style={[
            styles.buttonText,
            tipeAktif === 'Pemasukkan' && styles.textPemasukkan,
          ]}
        >
          Pemasukkan
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          tipeAktif === 'Pengeluaran' && styles.activePengeluaran,
        ]}
        onPress={() => setTipeAktif('Pengeluaran')}
      >
        <Text
          style={[
            styles.buttonText,
            tipeAktif === 'Pengeluaran' && styles.textPengeluaran,
          ]}
        >
          Pengeluaran
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 4,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePemasukkan: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activePengeluaran: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  textPemasukkan: {
    color: '#34C759',
  },
  textPengeluaran: {
    color: '#FF3B30',
  },
});
