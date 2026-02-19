// screens/form-transaksi/modal/ModalPilihKategori.tsx
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Kategori, Subkategori } from '@/database/tipe';

interface Props {
  terlihat: boolean;
  saatTutup: () => void;
}

export default function ModalPilihKategori({ terlihat, saatTutup }: Props) {
  const { transaksi, setTransaksi } = useTransaksi();
  const { daftarKategori } = useKategori();
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);

  const kategoriTersaring = useMemo(() => {
    if (transaksi.tipe === 'transfer') {
      return [];
    }
    return daftarKategori.filter((k) => k.tipe === transaksi.tipe);
  }, [daftarKategori, transaksi.tipe]);

  // DIUBAH: Logika efek dipecah menjadi dua untuk kejelasan dan keandalan.

  // Efek 1: Menangani logika saat modal DIBUKA.
  useEffect(() => {
    // Hanya berjalan saat modal menjadi terlihat DAN ada kategori untuk ditampilkan.
    if (terlihat && kategoriTersaring.length > 0) {
      // Coba cari kategori induk dari subkategori yang mungkin sudah dipilih.
      const kategoriIndukSaatIni = kategoriTersaring.find((k) =>
        k.subkategori.some((s) => s.id === transaksi.kategori_id)
      );

      // Jika ditemukan, jadikan itu aktif (mempertahankan pilihan saat buka/tutup).
      // Jika tidak (karena ganti tipe atau buka pertama kali), jadikan item PERTAMA
      // dari daftar yang valid sebagai yang aktif.
      setKategoriAktif(kategoriIndukSaatIni || kategoriTersaring[0]);
    }
  }, [terlihat, kategoriTersaring]); // Hanya bergantung pada visibilitas dan data yang disaring.

  // Efek 2: Menangani logika saat modal DITUTUP (pembersihan).
  useEffect(() => {
    if (!terlihat) {
      setKategoriAktif(null);
    }
  }, [terlihat]); // Hanya bergantung pada visibilitas.

  const handlePilihSubkategori = (subkategori: Subkategori) => {
    setTransaksi((transaksiLama) => ({
      ...transaksiLama,
      kategori_id: subkategori.id,
    }));
    saatTutup();
  };

  const subkategoriSaatIni = kategoriAktif?.subkategori || [];

  return (
    <Modal animationType="slide" transparent={true} visible={terlihat} onRequestClose={saatTutup}>
      <Pressable style={gaya.modalLatar} onPress={saatTutup}>
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

// Gaya tidak diubah
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
