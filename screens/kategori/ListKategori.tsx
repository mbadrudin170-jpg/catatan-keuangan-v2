// screens/kategori/ListKategori.tsx
import type { Kategori, Subkategori } from '@/database/tipe';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListKategoriProps {
  daftarKategori: Kategori[];
  kategoriTerpilih: Kategori | null;
  onKategoriSelect: (kategori: Kategori) => void;
  daftarSubKategori: Subkategori[];
}

export const ListKategori: React.FC<ListKategoriProps> = ({
  daftarKategori,
  kategoriTerpilih,
  onKategoriSelect,
  daftarSubKategori,
}) => {
  const renderKategoriItem = ({ item }: { item: Kategori }) => {
    const isSelected = kategoriTerpilih?.id === item.id;

    return (
      <TouchableOpacity
        style={[gaya.itemKategori, isSelected && gaya.itemKategoriTerpilih]}
        activeOpacity={0.85}
        onPress={() => onKategoriSelect(item)}
      >
        <Text style={[gaya.teksKategori, isSelected && gaya.teksKategoriTerpilih]}>
          {item.nama}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSubKategoriItem = ({ item }: { item: Subkategori }) => {
    return (
      <View style={gaya.itemSubKategori}>
        <Text style={gaya.teksSubKategori}>{item.nama}</Text>
      </View>
    );
  };

  return (
    <View style={gaya.penampung}>
      <View style={gaya.penampungKategori}>
        <FlatList
          data={daftarKategori}
          renderItem={renderKategoriItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={gaya.teksKosong}>Belum ada kategori.</Text>}
        />
      </View>

      <View style={gaya.penampungSubKategori}>
        <Text style={gaya.judulSubKategori}>
          Sub-kategori untuk:{' '}
          <Text style={gaya.namaSubKategori}>{kategoriTerpilih?.nama || 'Pilih Kategori'}</Text>
        </Text>

        <FlatList
          data={daftarSubKategori}
          renderItem={renderSubKategoriItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={gaya.paddingList}
          ListEmptyComponent={<Text style={gaya.teksKosong}>Tidak ada sub-kategori.</Text>}
        />
      </View>
    </View>
  );
};

const warna = {
  primer: '#4F46E5',
  border: '#e2e8f0',
  latar: '#f8fafc',
  teksUtama: '#0f172a',
  teksSekunder: '#64748b',
  permukaan: '#ffffff',
};

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  penampungKategori: {
    maxHeight: '35%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
  },
  itemKategori: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: warna.border,
    marginBottom: 10,
    backgroundColor: warna.permukaan,
  },
  itemKategoriTerpilih: {
    backgroundColor: warna.primer,
    borderColor: warna.primer,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  teksKategori: {
    fontSize: 14,
    fontWeight: '600',
    color: warna.teksUtama,
  },
  teksKategoriTerpilih: {
    color: '#ffffff',
    fontWeight: '700',
  },
  penampungSubKategori: {
    flex: 1,
    paddingTop: 18,
  },
  judulSubKategori: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 14,
    color: warna.teksSekunder,
  },
  namaSubKategori: {
    color: warna.teksUtama,
    fontWeight: '700',
  },
  paddingList: {
    paddingBottom: 20,
  },
  itemSubKategori: {
    backgroundColor: warna.permukaan,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: warna.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  teksSubKategori: {
    fontSize: 15,
    fontWeight: '500',
    color: warna.teksUtama,
  },
  teksKosong: {
    textAlign: 'center',
    marginTop: 20,
    color: warna.teksSekunder,
    paddingHorizontal: 20,
    fontSize: 14,
  },
});
