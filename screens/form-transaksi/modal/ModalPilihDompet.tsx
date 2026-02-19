// screens/form-transaksi/modal/ModalPilihDompet.tsx
import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDompet } from '../../../context/DompetContext';
import { useTransaksi } from '../../../context/TransaksiContext';
import type { Dompet } from '../../../database/tipe';

interface Props {
  terlihat: boolean;
  saatTutup: () => void;
}

export default function ModalPilihDompet({ terlihat, saatTutup }: Props) {
  const { setTransaksi } = useTransaksi();
  const { daftarDompet } = useDompet();

  // --- DIPERBAIKI: Fungsi ini sekarang menerima objek Dompet dan mengatur dompet_id ---
  const handlePilihDompet = (dompet: Dompet) => {
    setTransaksi((transaksiLama) => ({
      ...transaksiLama,
      dompet_id: dompet.id, // Menyimpan ID (number), bukan nama (string)
    }));
    saatTutup(); // Menutup modal setelah memilih
  };

  const renderItem = ({ item }: { item: Dompet }) => (
    <Pressable
      // --- DIPERBAIKI: Meneruskan seluruh objek item ---
      onPress={() => handlePilihDompet(item)}
      android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
      style={({ pressed }) => [gaya.item, pressed && gaya.itemTekan]}
      accessibilityRole="button"
      accessibilityLabel={`Pilih dompet ${item.nama}`}
    >
      <View style={gaya.itemKiri}>
        <View style={gaya.bulat}>
          <Text style={gaya.bulatTeks}>{item.nama.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={gaya.teksItem}>{item.nama}</Text>
      </View>
      <Text style={gaya.ikonPanah}>›</Text>
    </Pressable>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={terlihat} onRequestClose={saatTutup}>
      <Pressable style={gaya.modalLatar} onPress={saatTutup}>
        <View style={gaya.modalKonten}>
          <View style={gaya.handleContainer}>
            <View style={gaya.handle} />
          </View>

          <Text style={gaya.judul}>Pilih Dompet</Text>

          <FlatList
            data={daftarDompet}
            renderItem={renderItem}
            // --- DIPERBAIKI: Konversi ID number ke string ---
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={gaya.kontenList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={gaya.kosong}>
                <Text style={gaya.teksKosong}>Belum ada dompet tersedia</Text>
              </View>
            }
          />
        </View>
      </Pressable>
    </Modal>
  );
}

// Gaya tidak berubah, jadi saya biarkan seperti adanya.
const warna = {
  primer: '#4F46E5',
  teksUtama: '#0f172a',
  teksSekunder: '#64748b',
  latar: '#ffffff',
  permukaan: '#fbfdff',
  garis: '#e6eef8',
};

const gaya = StyleSheet.create({
  modalLatar: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(2,6,23,0.45)',
  },
  modalKonten: {
    backgroundColor: warna.latar,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 30,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '58%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 12,
  },

  handleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 99,
    backgroundColor: '#e6eef8',
  },

  judul: {
    fontSize: 16,
    fontWeight: '700',
    color: warna.teksUtama,
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  kontenList: {
    paddingBottom: 8,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: warna.permukaan,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  itemTekan: {
    transform: [{ scale: 0.997 }],
    opacity: 0.95,
  },
  itemKiri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulat: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: warna.primer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  bulatTeks: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  teksItem: {
    fontSize: 15,
    color: warna.teksUtama,
    fontWeight: '600',
  },
  ikonPanah: {
    color: warna.teksSekunder,
    fontSize: 20,
    opacity: 0.7,
  },

  kosong: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  teksKosong: {
    color: warna.teksSekunder,
    fontSize: 14,
  },
});
