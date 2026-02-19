// screens/form-transaksi/modal/ModalPilihKategori.tsx
import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useKategori } from '../../../context/KategoriContext';
import { useTransaksi } from '../../../context/TransaksiContext';
import { Kategori, Subkategori } from '../../../database/tipe';

interface Props {
  terlihat: boolean;
  saatTutup: () => void;
}

export default function ModalPilihKategori({ terlihat, saatTutup }: Props) {
  const { transaksi, setTransaksi } = useTransaksi();
  const { daftarKategori } = useKategori();
  const [kategoriAktif, setKategoriAktif] = useState<Kategori | null>(null);

  useEffect(() => {
    if (terlihat && daftarKategori.length > 0 && !kategoriAktif) {
      const kategoriAwal = daftarKategori.find(k => k.id === transaksi.kategori_id) || daftarKategori[0];
      setKategoriAktif(kategoriAwal);
    }
    if (!terlihat) {
      setKategoriAktif(null);
    }
  }, [terlihat, daftarKategori, kategoriAktif, transaksi.kategori_id]);

  // --- DIPERBAIKI: Menggunakan objek Subkategori dan mengatur kategori_id ---
  const handlePilihSubkategori = (subkategori: Subkategori) => {
    setTransaksi((transaksiLama) => ({
      ...transaksiLama,
      // Seharusnya ini adalah ID unik global, tapi untuk sekarang kita gunakan ID subkategori.
      // Ini mungkin perlu perbaikan di masa depan jika ID subkategori tidak unik.
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
              data={daftarKategori}
              // --- DIPERBAIKI: keyExtractor ke string ---
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
              // --- DIPERBAIKI: keyExtractor ke string ---
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={gaya.paddingList}
              renderItem={({ item }) => {
                // --- DIPERBAIKI: Logika pengecekan item aktif ---
                const adalahAktif = transaksi.kategori_id === item.id;

                return (
                  <Pressable
                    style={[gaya.item, adalahAktif && gaya.itemAktif]}
                    // --- DIPERBAIKI: Meneruskan seluruh objek item ---
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
                    {daftarKategori.length > 0 ? 'Tidak ada subkategori' : 'Tidak ada kategori'}
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


// Gaya tidak berubah, jadi saya biarkan seperti adanya.
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
