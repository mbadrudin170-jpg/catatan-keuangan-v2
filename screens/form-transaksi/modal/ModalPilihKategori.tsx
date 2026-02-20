// screens/form-transaksi/modal/ModalPilihKategori.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Kategori, Subkategori } from '@/database/tipe';

// DIUBAH: Komponen tidak lagi menerima props, semua state diambil dari context.
export default function ModalPilihKategori() {
  const {
    transaksi,
    setTransaksi,
    modalKategoriTerlihat,
    tutupModalKategori,
  } = useTransaksi();
  const { semuaKategori } = useKategori();
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);

  // Memo untuk menyaring kategori berdasarkan tipe transaksi yang aktif.
  const kategoriTersaring = useMemo(() => {
    if (transaksi.tipe === 'transfer') return [];
    return semuaKategori.filter((k: Kategori) => k.tipe === transaksi.tipe);
  }, [semuaKategori, transaksi.tipe]);

  // DIUBAH: Logika efek disempurnakan untuk menangani perubahan tipe transaksi.
  useEffect(() => {
    if (!modalKategoriTerlihat) return;

    const subkategoriMasihValid = kategoriTersaring.some((k: Kategori) =>
      k.subkategori.some((s: Subkategori) => s.id === transaksi.kategori_id)
    );

    // Jika subkategori yang dipilih sebelumnya tidak lagi valid (karena tipe berubah)
    if (!subkategoriMasihValid) {
      // Reset pilihan subkategori di state global
      setTransaksi((prev) => ({ ...prev, kategori_id: null }));
      // Atur kategori aktif ke item pertama dari daftar baru, jika ada.
      setKategoriAktif(kategoriTersaring.length > 0 ? kategoriTersaring[0] : null);
    } else {
      // Jika masih valid, temukan dan atur kategori induknya sebagai yang aktif.
      const kategoriIndukSaatIni = kategoriTersaring.find((k: Kategori) =>
        k.subkategori.some((s: Subkategori) => s.id === transaksi.kategori_id)
      );
      setKategoriAktif(kategoriIndukSaatIni || null);
    }
  }, [modalKategoriTerlihat, kategoriTersaring]);

  const handlePilihSubkategori = (subkategori: Subkategori) => {
    setTransaksi((transaksiLama) => ({
      ...transaksiLama,
      kategori_id: subkategori.id,
    }));
    tutupModalKategori();
  };

  const subkategoriSaatIni = kategoriAktif?.subkategori || [];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalKategoriTerlihat}
      onRequestClose={tutupModalKategori}
    >
      <Pressable style={gaya.modalLatar} onPress={tutupModalKategori}>
        <Pressable style={gaya.modalKonten}>
          <View style={gaya.handleContainer}>
            <View style={gaya.handle} />
          </View>

          <View style={gaya.kolomKategori}>
            <Text style={gaya.judulKolom}>Kategori</Text>
            <FlatList
              data={kategoriTersaring}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={gaya.paddingList}
              renderItem={({ item }) => (
                <Pressable
                  style={[gaya.item, kategoriAktif?.id === item.id && gaya.itemAktif]}
                  onPress={() => setKategoriAktif(item)}
                >
                  <Text
                    style={[gaya.teksItem, kategoriAktif?.id === item.id && gaya.teksItemAktif]}
                  >
                    {item.nama}
                  </Text>
                </Pressable>
              )}
            />
          </View>

          <View style={gaya.kolomSubkategori}>
            <Text style={gaya.judulKolom}>Sub Kategori</Text>
            <FlatList
              data={subkategoriSaatIni}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={gaya.paddingList}
              renderItem={({ item }) => {
                const adalahAktif = transaksi.kategori_id === item.id;
                return (
                  <Pressable
                    style={[gaya.item, adalahAktif && gaya.itemAktif]}
                    onPress={() => handlePilihSubkategori(item)}
                  >
                    <Text style={[gaya.teksItem, adalahAktif && gaya.teksItemAktif]}>
                      {item.nama}
                    </Text>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={gaya.penampungKosong}>
                  <Text style={gaya.teksKosong}>
                    {kategoriTersaring.length > 0
                      ? 'Tidak ada subkategori'
                      : 'Pilih tipe transaksi dahulu'}
                  </Text>
                </View>
              }
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Gaya tidak berubah
const warna = {
  primer: '#4F46E5',
  teksUtama: '#0f172a',
  teksSekunder: '#64748b',
  garis: '#e6eef8',
  permukaan: '#fbfdff',
};

const gaya = StyleSheet.create({
  modalLatar: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(2,6,23,0.45)',
  },
  modalKonten: {
    height: '68%',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 12,
  },

  handleContainer: {
    position: 'absolute',
    top: 8,
    width: '100%',
    alignItems: 'center',
  },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#e6eef8',
  },

  kolomKategori: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: warna.garis,
    paddingTop: 24,
  },
  kolomSubkategori: {
    flex: 1.5,
    paddingTop: 24,
  },

  judulKolom: {
    fontSize: 15,
    fontWeight: '700',
    color: warna.teksUtama,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: warna.garis,
  },

  paddingList: {
    paddingVertical: 8,
  },

  item: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: warna.permukaan,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemAktif: {
    backgroundColor: '#eef2ff',
  },

  teksItem: {
    fontSize: 14,
    color: warna.teksUtama,
    fontWeight: '500',
  },
  teksItemAktif: {
    fontWeight: '700',
    color: warna.primer,
  },

  penampungKosong: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  teksKosong: {
    fontSize: 14,
    color: warna.teksSekunder,
  },
});
