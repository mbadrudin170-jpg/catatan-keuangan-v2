// screens/form-kategori/ListKategori.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import type { Kategori } from '../../database/tipe';

interface ListKategoriProps {
  onKategoriSelect: (kategori: Kategori | null) => void;
  tipe: 'pemasukan' | 'pengeluaran';
}

export default function ListKategori({ onKategoriSelect, tipe }: ListKategoriProps) {
  const { daftarKategori, tambahKategori, hapusKategori } = useKategori();

  const [kategoriTerpilih, setKategoriTerpilih] = useState<Kategori | null>(null);
  const [sedangMenambah, setSedangMenambah] = useState(false);
  const [inputKategoriBaru, setInputKategoriBaru] = useState('');
  const [modalTerlihat, setModalTerlihat] = useState(false);

  const pemicuRef = useRef<View>(null);
  const [posisiModal, setPosisiModal] = useState({ top: 0, left: 0, width: 0 });

  // DIPERBAIKI: Filter kategori berdasarkan tipe yang aktif
  const kategoriDifilter = useMemo(
    () => daftarKategori.filter((k) => k.tipe === tipe),
    [daftarKategori, tipe]
  );

  // DIPERBAIKI: Reset pilihan kategori saat tipe berubah
  useEffect(() => {
    setKategoriTerpilih(null);
    onKategoriSelect(null);
  }, [tipe, onKategoriSelect]);

  const handlePilih = (kategori: Kategori) => {
    setKategoriTerpilih(kategori);
    onKategoriSelect(kategori);
    setModalTerlihat(false);
  };

  const handleTambah = async () => {
    const namaKategori = inputKategoriBaru.trim();
    if (namaKategori === '') return;

    const sudahAda = kategoriDifilter.some(
      (k) => k.nama.toLowerCase() === namaKategori.toLowerCase()
    );

    if (sudahAda) {
      Alert.alert('Nama Duplikat', `Kategori "${namaKategori}" sudah ada untuk tipe ini.`);
      return;
    }

    try {
      await tambahKategori(namaKategori, 'pricetag-outline', tipe);
      setInputKategoriBaru('');
      setSedangMenambah(false);
    } catch (error) {
      console.error('Gagal menambah kategori:', error);
      Alert.alert('Error', 'Gagal menambahkan kategori baru.');
    }
  };

  const handleHapus = () => {
    if (!kategoriTerpilih) return;
    Alert.alert('Hapus Kategori', `Yakin ingin menghapus "${kategoriTerpilih.nama}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            if (kategoriTerpilih) {
              await hapusKategori(kategoriTerpilih.id);
              // Reset pilihan setelah hapus
              setKategoriTerpilih(null);
              onKategoriSelect(null);
            }
          } catch (error) {
            console.error('Gagal menghapus kategori:', error);
            Alert.alert('Error', 'Gagal menghapus kategori.');
          }
        },
      },
    ]);
  };

  const tampilkanModal = () => {
    if (pemicuRef.current) {
      pemicuRef.current.measure((_fx, _fy, width, height, px, py) => {
        setPosisiModal({ top: py + height + 8, left: px, width });
        setModalTerlihat(true);
      });
    }
  };

  return (
    <View style={gaya.pembungkus}>
      <View style={gaya.tajuk}>
        <Text style={gaya.judul}>Kategori</Text>
        {!sedangMenambah && (
          <Pressable style={gaya.tombolTambah} onPress={() => setSedangMenambah(true)}>
            <Ionicons name="add" size={16} color="#0B74FF" />
            <Text style={gaya.teksTombolTambah}>Tambah</Text>
          </Pressable>
        )}
      </View>

      {sedangMenambah ? (
        <View style={gaya.penampungInput}>
          <TextInput
            style={gaya.input}
            placeholder="Nama Kategori Baru..."
            placeholderTextColor="#9CA3AF"
            value={inputKategoriBaru}
            onChangeText={setInputKategoriBaru}
            autoFocus
          />
          <Pressable
            onPress={handleTambah}
            style={({ pressed }) => [gaya.iconAksi, pressed && gaya.iconAksiTekan]}
          >
            <Ionicons name="checkmark-circle" size={34} color="#10B981" />
          </Pressable>
          <Pressable
            onPress={() => setSedangMenambah(false)}
            style={({ pressed }) => [gaya.iconAksi, pressed && gaya.iconAksiTekan]}
          >
            <Ionicons name="close-circle" size={34} color="#EF4444" />
          </Pressable>
        </View>
      ) : (
        <View>
          <Pressable
            ref={pemicuRef as React.Ref<View>}
            onPress={tampilkanModal}
            style={gaya.pemicuDropdown}
          >
            <Text style={gaya.teksDropdown}>{kategoriTerpilih?.nama || 'Pilih Kategori'}</Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </Pressable>
          {kategoriTerpilih && (
            <Pressable style={gaya.tombolHapus} onPress={handleHapus}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text style={gaya.teksTombolHapus}>Hapus Kategori Terpilih</Text>
            </Pressable>
          )}
        </View>
      )}

      <Modal
        visible={modalTerlihat}
        transparent
        animationType="fade"
        onRequestClose={() => setModalTerlihat(false)}
      >
        <Pressable style={gaya.latarBelakangModal} onPress={() => setModalTerlihat(false)} />
        <View
          style={[
            gaya.kontenDropdown,
            {
              top: posisiModal.top,
              left: posisiModal.left,
              width: Math.max(posisiModal.width, 220),
            },
          ]}
        >
          <FlatList
            // DIPERBAIKI: Gunakan daftar kategori yang sudah difilter
            data={kategoriDifilter}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  gaya.itemModal,
                  pressed && gaya.itemModalDitekan,
                  item.id === kategoriTerpilih?.id && gaya.itemModalAktif,
                ]}
                onPress={() => handlePilih(item)}
              >
                <Text
                  style={[
                    gaya.teksItemModal,
                    item.id === kategoriTerpilih?.id && gaya.teksItemModalAktif,
                  ]}
                >
                  {item.nama}
                </Text>
                {item.id === kategoriTerpilih?.id && (
                  <Ionicons name="checkmark" size={18} color="#0B74FF" />
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={gaya.kosongWrapper}>
                <Text style={gaya.teksKosong}>Tidak ada kategori untuk tipe ini.</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
}

const gaya = StyleSheet.create({
  pembungkus: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  tajuk: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  judul: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  tombolTambah: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0F2FF',
  },
  teksTombolTambah: {
    color: '#0B74FF',
    fontWeight: '600',
    fontSize: 14,
  },
  penampungInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: '#FBFDFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconAksi: {
    padding: 4,
    borderRadius: 20,
  },
  iconAksiTekan: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  pemicuDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  teksDropdown: {
    fontSize: 16,
    color: '#111827',
  },
  tombolHapus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FFF7F7',
  },
  teksTombolHapus: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  latarBelakangModal: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.18)',
  },
  kontenDropdown: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E9EE',
    maxHeight: 260,
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  itemModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  itemModalDitekan: {
    backgroundColor: '#F8FAFC',
  },
  itemModalAktif: {
    backgroundColor: '#F0F7FF',
  },
  teksItemModal: {
    fontSize: 16,
    color: '#111827',
  },
  teksItemModalAktif: {
    color: '#0B74FF',
    fontWeight: '600',
  },
  kosongWrapper: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teksKosong: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
