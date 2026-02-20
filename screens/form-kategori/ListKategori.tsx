// screens/form-kategori/ListKategori.tsx
import type { Kategori, TipeKategori } from '@/database/tipe';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TombolAksi from './TombolAksi';

interface ListKategoriProps {
  tipe: TipeKategori;
  daftarKategori: Kategori[];
  onKategoriSelect: (kategori: Kategori) => void;
  tambahKategori: (nama: string, ikon: string, tipe: TipeKategori) => void;
  hapusKategori: (id: number) => void;
}

const ListKategori: React.FC<ListKategoriProps> = ({
  tipe,
  daftarKategori,
  onKategoriSelect,
  tambahKategori,
}) => {
  const handleTambahKategori = (nama: string) => {
    // Menambahkan ikon default saat membuat kategori baru
    tambahKategori(nama, 'default-icon', tipe);
  };

  return (
    <View style={gaya.penampung}>
      <TombolAksi
        nama="Kategori"
        onTambah={handleTambahKategori}
        // Hapus belum diimplementasikan di UI ini, jadi kita berikan fungsi kosong
        onHapus={() => {}}
        placeholder="Nama Kategori Baru"
      />
      <Text style={gaya.teksJudul}>Pilih Kategori</Text>
      <ScrollView
        horizontal
        contentContainerStyle={gaya.kontenScrollView}
        showsHorizontalScrollIndicator={false}
      >
        {daftarKategori.map((kategori) => (
          <TouchableOpacity
            key={kategori.id}
            style={gaya.cip}
            onPress={() => onKategoriSelect(kategori)}
          >
            <Text style={gaya.teksCip}>{kategori.nama}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListKategori;

const gaya = StyleSheet.create({
  penampung: {
    marginVertical: 16,
  },
  teksJudul: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    paddingHorizontal: 8,
  },
  kontenScrollView: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cip: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  teksCip: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
});
