// screens/form-kategori/ListKategori.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useKategori } from '../../context/KategoriContext';

export default function ListKategori() {
  const {
    daftarKategori,
    kategoriTerpilih,
    pilihKategori,
    tambahKategori,
    perbaruiKategori,
    hapusKategori,
  } = useKategori();

  const [sedangMenambah, setSedangMenambah] = useState(false);
  const [kategoriBaru, setKategoriBaru] = useState('');
  const [sedangMengedit, setSedangMengedit] = useState(false);
  const [teksEdit, setTeksEdit] = useState('');
  const [modalTerlihat, setModalTerlihat] = useState(false);

  // Ref untuk elemen pemicu dan state untuk posisi modal
  const pemicuRef = useRef(null);
  const [posisiModal, setPosisiModal] = useState({ top: 0, left: 0, width: 0 });

  const handleTambah = () => {
    if (kategoriBaru.trim() === '') return;
    tambahKategori(kategoriBaru);
    setKategoriBaru('');
    setSedangMenambah(false);
  };

  const handleMulaiEdit = () => {
    if (!kategoriTerpilih) return;
    setSedangMengedit(true);
    setTeksEdit(kategoriTerpilih.nama);
  };

  const handleSimpanEdit = () => {
    if (!kategoriTerpilih || teksEdit.trim() === '') return;
    perbaruiKategori(kategoriTerpilih.id, teksEdit);
    setSedangMengedit(false);
    setTeksEdit('');
  };

  const handleHapus = () => {
    if (!kategoriTerpilih) return;
    Alert.alert(
      'Hapus Kategori',
      `Yakin ingin menghapus "${kategoriTerpilih.nama}"? Sub-kategori terkait juga akan terhapus.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => hapusKategori(kategoriTerpilih.id),
        },
      ]
    );
  };

  const handlePilih = (idKategori: string) => {
    pilihKategori(idKategori);
    setModalTerlihat(false);
  };

  // Fungsi untuk mengukur layout dan menampilkan modal
  const tampilkanModal = () => {
    if (pemicuRef.current) {
      pemicuRef.current.measure((fx, fy, width, height, px, py) => {
        setPosisiModal({ top: py + height, left: px, width: width });
        setModalTerlihat(true);
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Kategori</Text>
        {!sedangMenambah && !sedangMengedit && (
          <Pressable
            style={styles.headerAddBtn}
            onPress={() => setSedangMenambah(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007BFF" />
            <Text style={styles.addButtonText}>Tambah</Text>
          </Pressable>
        )}
      </View>

      {sedangMenambah && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Input kategori baru..."
            value={kategoriBaru}
            onChangeText={setKategoriBaru}
            autoFocus
          />
          <View style={styles.inputActions}>
            <Pressable
              style={[styles.actionIconBtn, styles.saveButton]}
              onPress={handleTambah}
            >
              <Ionicons name="checkmark-outline" size={22} color="white" />
            </Pressable>
            <Pressable
              style={[styles.actionIconBtn, styles.cancelButton]}
              onPress={() => setSedangMenambah(false)}
            >
              <Ionicons name="close-outline" size={22} color="white" />
            </Pressable>
          </View>
        </View>
      )}

      {/* Container untuk pilihan kategori, sekarang memiliki ref */}
      <View style={styles.itemContainer}>
        {sedangMengedit ? (
          <TextInput
            style={[styles.itemText, styles.editInput]}
            value={teksEdit}
            onChangeText={setTeksEdit}
            autoFocus
          />
        ) : (
          <Pressable
            ref={pemicuRef}
            style={styles.selectorPressable}
            onPress={tampilkanModal} // <-- Panggil fungsi baru
            disabled={sedangMenambah}
          >
            <View>
              <Text style={styles.labelSmall}>Terpilih</Text>
              <Text style={styles.itemText}>
                {kategoriTerpilih?.nama || 'Pilih Kategori'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#666" />
          </Pressable>
        )}
        <View style={styles.itemActions}>
          {sedangMengedit ? (
            <>
              <Pressable style={styles.editBtn} onPress={handleSimpanEdit}>
                <Ionicons name="save-outline" size={20} color="#34C759" />
              </Pressable>
              <Pressable
                style={styles.deleteBtn}
                onPress={() => setSedangMengedit(false)}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={20}
                  color="#FF3B30"
                />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={styles.editBtn}
                onPress={handleMulaiEdit}
                disabled={sedangMenambah || !kategoriTerpilih}
              >
                <Ionicons name="create-outline" size={20} color="#007BFF" />
              </Pressable>
              <Pressable
                style={styles.deleteBtn}
                onPress={handleHapus}
                disabled={sedangMenambah || !kategoriTerpilih}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Modal yang sudah dimodifikasi menjadi Dropdown */}
      <Modal
        visible={modalTerlihat}
        transparent
        animationType="fade"
        onRequestClose={() => setModalTerlihat(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setModalTerlihat(false)}
        />
        <View
          style={[
            styles.dropdownContent,
            { top: posisiModal.top, left: posisiModal.left, width: posisiModal.width },
          ]}
        >
          <FlatList
            data={daftarKategori}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.modalItem,
                  pressed && styles.modalItemPressed,
                  item.id === kategoriTerpilih?.id && styles.modalItemActive,
                ]}
                onPress={() => handlePilih(item.id)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    item.id === kategoriTerpilih?.id &&
                      styles.modalItemTextActive,
                  ]}
                >
                  {item.nama}
                </Text>
                {item.id === kategoriTerpilih?.id && (
                  <Ionicons name="checkmark" size={18} color="#007BFF" />
                )}
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
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
  editInput: {
    height: 48,
    flex: 1,
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  selectorPressable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  labelSmall: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  itemText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#DDD',
    paddingLeft: 12,
  },
  editBtn: {
    padding: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'transparent', // <-- Latar belakang dibuat transparan
  },
  // Style baru untuk konten dropdown
  dropdownContent: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    maxHeight: 220,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemPressed: {
    backgroundColor: '#F5F5F5',
  },
  modalItemActive: {
    backgroundColor: '#F0F7FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#444',
  },
  modalItemTextActive: {
    color: '#007BFF',
    fontWeight: '600',
  },
});
