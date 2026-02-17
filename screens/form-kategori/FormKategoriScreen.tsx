// screens/form-kategori/FormKategoriScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KategoriProvider } from '../../context/KategoriContext';
import ListKategori from './ListKategori';
import ListSubKategori from './ListSubKategori';
import TombolSimpan from './TombolSimpan';
import TombolTipe from './TombolTipe';

// Komponen ini tidak perlu lagi mem-passing props ke TombolTipe
function FormKategoriContent() {
  const handleSave = () => {
    alert('Simpan!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Tambah Transaksi</Text>
      </View>

      {/* TombolTipe tidak lagi memerlukan props karena mengambil state dari context */}
      <TombolTipe />

      <ListKategori />
      <ListSubKategori />
      <TombolSimpan onPress={handleSave} />
    </SafeAreaView>
  );
}

export default function FormKategoriScreen() {
  return (
    <KategoriProvider>
      <FormKategoriContent />
    </KategoriProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  headerText: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
