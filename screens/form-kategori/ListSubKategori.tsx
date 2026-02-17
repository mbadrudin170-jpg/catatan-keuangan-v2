// screens/form-kategori/ListSubKategori.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
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
    daftarSubKategori,
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

  // Filter sub-kategori berdasarkan kategori yang dipilih
  const subKategoriFilter = useMemo(() => {
    if (!kategoriTerpilih) return [];
    return daftarSubKategori.filter(
      (sub) => sub.idKategori === kategoriTerpilih.id
    );
  }, [daftarSubKategori, kategoriTerpilih]);

  const handleTambah = () => {
    if (subKategoriBaru.trim() === '' || !kategoriTerpilih) {
      return;
    }
    tambahSubKategori(subKategoriBaru);
    setSubKategoriBaru('');
    setSedangMenambah(false);
  };

  const renderItem = ({ item }: { item: { id: string; nama: string } }) => {
    const sedangMengedit = item.id === idSubKategoriEdit;

    return (
      <View
        style={[styles.itemContainer, sedangMengedit && styles.itemEditing]}
      >
        {sedangMengedit ? (
          <TextInput
            style={styles.itemInput}
            value={namaSubKategoriEdit}
            onChangeText={setNamaSubKategoriEdit}
            autoFocus
            placeholder="Edit nama sub kategori..."
          />
        ) : (
          <View style={styles.textWrapper}>
            <Text style={styles.itemText}>{item.nama}</Text>
          </View>
        )}

        <View style={styles.itemActions}>
          {sedangMengedit ? (
            <>
              <Pressable
                style={styles.actionIconBtn}
                onPress={perbaruiSubKategori}
              >
                <Ionicons name="checkmark-circle" size={26} color="#34C759" />
              </Pressable>
              <Pressable
                style={styles.actionIconBtn}
                onPress={() => setIdSubKategoriEdit(null)}
              >
                <Ionicons name="close-circle" size={26} color="#FF3B30" />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={styles.actionIconBtn}
                onPress={() => {
                  setIdSubKategoriEdit(item.id);
                  setNamaSubKategoriEdit(item.nama);
                }}
              >
                <Ionicons name="create-outline" size={22} color="#007BFF" />
              </Pressable>
              <Pressable
                style={styles.actionIconBtn}
                onPress={() => hapusSubKategori(item.id)}
              >
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Sub Kategori</Text>
        {kategoriTerpilih && !sedangMenambah && (
          <Pressable
            style={styles.headerAddBtn}
            onPress={() => setSedangMenambah(true)}
          >
            <Ionicons name="add-circle-outline" size={18} color="#007BFF" />
            <Text style={styles.addButtonText}>Tambah</Text>
          </Pressable>
        )}
      </View>

      {sedangMenambah && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Input sub kategori baru..."
            value={subKategoriBaru}
            onChangeText={setSubKategoriBaru}
            autoFocus
          />
          <View style={styles.inputActions}>
            <Pressable
              onPress={handleTambah}
              style={[styles.iconBtn, styles.saveButton]}
            >
              <Ionicons name="checkmark-outline" size={22} color="white" />
            </Pressable>
            <Pressable
              onPress={() => setSedangMenambah(false)}
              style={[styles.iconBtn, styles.cancelButton]}
            >
              <Ionicons name="close-outline" size={22} color="white" />
            </Pressable>
          </View>
        </View>
      )}

      <FlatList
        data={subKategoriFilter}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={idSubKategoriEdit} // re-render on edit change
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() =>
          !kategoriTerpilih ? (
            <Text style={styles.emptyText}>
              Pilih sebuah kategori terlebih dahulu.
            </Text>
          ) : (
            <Text style={styles.emptyText}>
              Belum ada sub-kategori. Silakan tambahkan.
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
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
    marginBottom: 20,
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
  iconBtn: {
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
    padding: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 10,
  },
  itemEditing: {
    borderColor: '#007BFF',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  textWrapper: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  itemInput: {
    flex: 1,
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
    paddingVertical: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 10,
  },
  actionIconBtn: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
