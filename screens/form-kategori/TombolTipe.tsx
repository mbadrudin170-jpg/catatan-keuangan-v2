// screens/form-kategori/TombolTipe.tsx
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

interface TombolTipeProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TombolTipe({ activeTab, setActiveTab }: TombolTipeProps) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[
          styles.button,
          activeTab === 'Pemasukkan' && styles.activePemasukkan,
        ]}
        onPress={() => setActiveTab('Pemasukkan')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'Pemasukkan' && styles.textPemasukkan,
          ]}
        >
          Pemasukkan
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          activeTab === 'Pengeluaran' && styles.activePengeluaran,
        ]}
        onPress={() => setActiveTab('Pengeluaran')}
      >
        <Text
          style={[
            styles.buttonText,
            activeTab === 'Pengeluaran' && styles.textPengeluaran,
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
  // Style khusus saat Pemasukkan aktif
  activePemasukkan: {
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  // Style khusus saat Pengeluaran aktif
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
  // Warna teks hijau untuk Pemasukkan
  textPemasukkan: {
    color: '#34C759',
  },
  // Warna teks merah untuk Pengeluaran
  textPengeluaran: {
    color: '#FF3B30',
  },
});