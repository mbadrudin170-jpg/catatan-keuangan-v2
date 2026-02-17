// screens/form-kategori/ListSubKategori.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useKategori } from '../../context/KategoriContext';

export default function ListSubKategori() {
  const {
    daftarSubKategori, // Langsung gunakan data yang sudah difilter dari context
    kategoriTerpilih,
    idSubKategoriEdit,
    namaSubKategoriEdit,
    setNamaSubKategoriEdit,
    perbaruiSubKategori,
    setIdSubKategoriEdit,
    hapusSubKategori,
    tambahSubKategori,
  } = useKategori();

  const [sedangMenambah, setSedangMenambah] = useState(false);
  const [subKategoriBaru, setSubKategoriBaru] = useState('');

  const handleTambah = () => {
    if (subKategoriBaru.trim() === '' || !kategoriTerpilih) return;
    tambahSubKategori(subKategoriBaru);
    setSubKategoriBaru('');
    setSedangMenambah(false);
  };

  const handleMulaiEdit = (item: { id: string; nama: string }) => {
    setIdSubKategoriEdit(item.id);
    setNamaSubKategoriEdit(item.nama);
    setSedangMenambah(false); // Tutup form tambah jika sedang aktif
  };

  const handleBatalEdit = () => {
    setIdSubKategoriEdit(null);
    setNamaSubKategoriEdit('');
  };

  const handleSimpanEdit = () => {
    perbaruiSubKategori(); // Logika sudah dihandle di context
  }

  const renderItem = ({ item }: { item: { id: string; nama: string } }) => {
    const sedangMengeditItemIni = item.id === idSubKategoriEdit;

    if (sedangMengeditItemIni) {
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={namaSubKategoriEdit}
            onChangeText={setNamaSubKategoriEdit}
            autoFocus
            placeholder="Edit nama..."
          />
          <View style={styles.inputActions}>
            <Pressable style={[styles.actionIconBtn, styles.saveButton]} onPress={handleSimpanEdit}>
              <Ionicons name="checkmark-outline" size={22} color="white" />
            </Pressable>
            <Pressable style={[styles.actionIconBtn, styles.cancelButton]} onPress={handleBatalEdit}>
              <Ionicons name="close-outline" size={22} color="white" />
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.nama}</Text>
        <View style={styles.itemActions}>
          <Pressable style={styles.editBtn} onPress={() => handleMulaiEdit(item)} disabled={sedangMenambah || idSubKategoriEdit !== null}>
            <Ionicons name="create-outline" size={20} color="#007BFF" />
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={() => hapusSubKategori(item.id)} disabled={sedangMenambah || idSubKategoriEdit !== null}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Sub-Kategori</Text>
        {kategoriTerpilih && !sedangMenambah && idSubKategoriEdit === null && (
          <Pressable style={styles.headerAddBtn} onPress={() => setSedangMenambah(true)}>
            <Ionicons name="add-circle-outline" size={20} color="#007BFF" />
            <Text style={styles.addButtonText}>Tambah</Text>
          </Pressable>
        )}
      </View>

      {sedangMenambah && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Input sub-kategori baru..."
            value={subKategoriBaru}
            onChangeText={setSubKategoriBaru}
            autoFocus
          />
          <View style={styles.inputActions}>
            <Pressable style={[styles.actionIconBtn, styles.saveButton]} onPress={handleTambah}>
              <Ionicons name="checkmark-outline" size={22} color="white" />
            </Pressable>
            <Pressable style={[styles.actionIconBtn, styles.cancelButton]} onPress={() => setSedangMenambah(false)}>
              <Ionicons name="close-outline" size={22} color="white" />
            </Pressable>
          </View>
        </View>
      )}

      <FlatList
        data={daftarSubKategori}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {!kategoriTerpilih
                ? 'Pilih sebuah kategori terlebih dahulu.'
                : 'Belum ada sub-kategori. Silakan tambahkan.'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22, // Disesuaikan
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Disesuaikan
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
    flex: 1, // Memastikan teks tidak terpotong
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#DDD',
    paddingLeft: 12,
    marginLeft: 10, // Memberi jarak antara teks dan tombol
  },
  editBtn: {
    padding: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyContainer: {
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
