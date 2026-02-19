// screens/form-kategori/ListSubKategori.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useKategori } from '../../context/KategoriContext';
import type { Kategori, Subkategori } from '../../database/tipe'; // Impor Subkategori

interface Props {
  kategoriTerpilih: Kategori | null;
}

export default function ListSubKategori({ kategoriTerpilih }: Props) {
  const { daftarKategori, tambahSubkategori, hapusSubkategori, perbaruiSubkategori } =
    useKategori();

  const [sedangMenambah, setSedangMenambah] = useState(false);
  const [inputBaru, setInputBaru] = useState('');
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const [teksEdit, setTeksEdit] = useState('');

  const kategoriSaatIni = kategoriTerpilih
    ? daftarKategori.find((k) => k.id === kategoriTerpilih.id)
    : null;

  const daftarSub = kategoriSaatIni?.subkategori || [];

  const handleTambah = async () => {
    const inputDibersihkan = inputBaru.trim();
    if (inputDibersihkan === '' || !kategoriSaatIni) return;

    const sudahAda = daftarSub.some(
      (sub: Subkategori) => sub.nama.toLowerCase() === inputDibersihkan.toLowerCase()
    );

    if (sudahAda) {
      Alert.alert(
        'Nama Duplikat',
        `Sub-kategori "${inputDibersihkan}" sudah ada.`
      );
      return;
    }
    try {
      await tambahSubkategori(kategoriSaatIni.id, inputDibersihkan);
      setInputBaru('');
      setSedangMenambah(false);
    } catch (error) {
      console.error('Gagal menambah sub-kategori:', error);
      Alert.alert('Error', 'Gagal menambahkan sub-kategori baru.');
    }
  };

  const handleBatalTambah = () => {
    setInputBaru('');
    setSedangMenambah(false);
  };

  const handleMulaiEdit = (id: number, nama: string) => {
    setIdEdit(id);
    setTeksEdit(nama);
  };

  const handleBatalEdit = () => {
    setIdEdit(null);
    setTeksEdit('');
  };

  const handleSimpanEdit = async () => {
    const teksEditDibersihkan = teksEdit.trim();
    if (teksEditDibersihkan === '' || idEdit === null || !kategoriSaatIni) return;

    const sudahAda = daftarSub.some(
      (sub: Subkategori) => sub.nama.toLowerCase() === teksEditDibersihkan.toLowerCase() && sub.id !== idEdit
    );

    if (sudahAda) {
      Alert.alert('Nama Duplikat', `Nama "${teksEditDibersihkan}" sudah digunakan.`);
      return;
    }

    try {
      await perbaruiSubkategori(kategoriSaatIni.id, idEdit, teksEditDibersihkan);
      handleBatalEdit();
    } catch (error) {
      console.error('Gagal memperbarui sub-kategori:', error);
      Alert.alert('Error', 'Gagal memperbarui sub-kategori.');
    }
  };

  const handleHapus = (idSub: number) => {
    if (!kategoriSaatIni) return;
    const sub = daftarSub.find((s: Subkategori) => s.id === idSub);
    if (!sub) return;

    Alert.alert('Hapus Sub-Kategori', `Yakin ingin menghapus "${sub.nama}"?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            if (kategoriSaatIni) {
              await hapusSubkategori(kategoriSaatIni.id, idSub);
            }
          } catch (error) {
            console.error('Gagal menghapus sub-kategori:', error);
            Alert.alert('Error', 'Gagal menghapus sub-kategori.');
          }
        },
      },
    ]);
  };

  if (!kategoriSaatIni) {
    return (
      <View style={gaya.pembungkusKosong}>
        <Text style={gaya.teksKosong}>Pilih sebuah kategori terlebih dahulu.</Text>
      </View>
    );
  }

  return (
    <View style={gaya.pembungkus}>
      <View style={gaya.tajuk}>
        <Text style={gaya.judul}>Sub-Kategori</Text>
        {!sedangMenambah && (
          <Pressable
            style={({ pressed }) => [gaya.tombolAksiTajuk, pressed && gaya.tombolTekan]}
            onPress={() => setSedangMenambah(true)}
          >
            <Ionicons name="add" size={16} color="#0B74FF" />
            <Text style={gaya.teksAksiTajuk}>Tambah</Text>
          </Pressable>
        )}
      </View>

      {sedangMenambah && (
        <View style={gaya.penampungInput}>
          <TextInput
            style={gaya.input}
            placeholder={`Nama sub-kategori baru...`}
            placeholderTextColor="#9CA3AF"
            value={inputBaru}
            onChangeText={setInputBaru}
            autoFocus
          />
          <Pressable
            onPress={handleTambah}
            style={({ pressed }) => [gaya.iconAksi, pressed && gaya.iconAksiTekan]}
          >
            <Ionicons name="checkmark-circle" size={34} color="#10B981" />
          </Pressable>
          <Pressable
            onPress={handleBatalTambah}
            style={({ pressed }) => [gaya.iconAksi, pressed && gaya.iconAksiTekan]}
          >
            <Ionicons name="close-circle" size={34} color="#EF4444" />
          </Pressable>
        </View>
      )}

      <FlatList
        data={daftarSub}
        extraData={daftarSub}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={gaya.penampungItem}>
            {idEdit === item.id ? (
              <TextInput
                value={teksEdit}
                onChangeText={setTeksEdit}
                style={gaya.inputEdit}
                placeholder="Ubah nama..."
                placeholderTextColor="#9CA3AF"
                autoFocus
                onBlur={handleBatalEdit}
              />
            ) : (
              <Text style={gaya.teksItem}>{item.nama}</Text>
            )}
            <View style={gaya.aksiItem}>
              {idEdit === item.id ? (
                <Pressable
                  onPress={handleSimpanEdit}
                  style={({ pressed }) => [gaya.aksiIcon, pressed && gaya.iconAksiTekan]}
                >
                  <Ionicons name="save-outline" size={20} color="#10B981" />
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={() => handleMulaiEdit(item.id, item.nama)}
                    style={({ pressed }) => [gaya.aksiIcon, pressed && gaya.iconAksiTekan]}
                  >
                    <Ionicons name="create-outline" size={20} color="#0B74FF" />
                  </Pressable>
                  <Pressable
                    onPress={() => handleHapus(item.id)}
                    style={({ pressed }) => [gaya.aksiIcon, pressed && gaya.iconAksiTekan]}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                </>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={gaya.teksKosong}>Belum ada sub-kategori.</Text>}
      />
    </View>
  );
}
const gaya = StyleSheet.create({
  pembungkus: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    padding: 20,
  },
  pembungkusKosong: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F6F7FB',
  },
  tajuk: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  judul: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1724',
  },
  tombolAksiTajuk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6F0FF',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tombolTekan: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  teksAksiTajuk: {
    color: '#0B74FF',
    fontWeight: '600',
    fontSize: 14,
  },
  penampungInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0F1724',
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputEdit: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#0F1724',
  },
  penampungItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#0b1220',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  teksItem: {
    flex: 1,
    fontSize: 16,
    color: '#0F1724',
  },
  aksiItem: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
  },
  aksiIcon: {
    padding: 6,
    borderRadius: 8,
  },
  iconAksi: {
    padding: 6,
    borderRadius: 8,
  },
  iconAksiTekan: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  teksKosong: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 20,
    fontSize: 15,
  },
});
