// screens/form-transaksi/modal/ModalPilihDompet.tsx
import React, { useMemo } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Dompet } from '@/database/tipe';

interface Props {
  // DIHAPUS: Prop 'terlihat' dan 'saatTutup' tidak lagi diperlukan karena
  // state dikelola secara terpusat oleh TransaksiContext.
}

// DIUBAH: Komponen tidak lagi menerima props `terlihat` dan `saatTutup`.
export default function ModalPilihDompet() {
  // DIUBAH: Mengambil semua state dan fungsi yang relevan dari context.
  const { transaksi, setTransaksi, modalDompetTerlihat, tutupModalDompet, tipePilihanDompet } = useTransaksi();
  const { daftarDompet } = useDompet();

  // DIUBAH: Logika daftar dompet yang akan ditampilkan dibuat lebih cerdas.
  const daftarDompetTersedia = useMemo(() => {
    // Jika modal dibuka untuk memilih dompet tujuan,
    if (tipePilihanDompet === 'tujuan') {
      // saring daftar dompet untuk MENGECUALIKAN dompet yang sudah dipilih sebagai sumber.
      return daftarDompet.filter((d) => d.id !== transaksi.dompet_id);
    }
    // Jika tidak (misalnya untuk dompet sumber), tampilkan semua dompet.
    return daftarDompet;
  }, [tipePilihanDompet, daftarDompet, transaksi.dompet_id]);

  // DIUBAH: Fungsi ini sekarang menangani kedua kasus (sumber dan tujuan).
  const handlePilihDompet = (dompet: Dompet) => {
    setTransaksi((transaksiLama) => ({
      ...transaksiLama,
      // Secara dinamis menentukan field mana yang akan diupdate berdasarkan `tipePilihanDompet`.
      ...(tipePilihanDompet === 'sumber'
        ? { dompet_id: dompet.id }
        : { dompet_tujuan_id: dompet.id }),
    }));
    tutupModalDompet(); // Menutup modal setelah memilih
  };

  const renderItem = ({ item }: { item: Dompet }) => (
    <Pressable
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

  // Menentukan judul modal secara dinamis
  const judulModal = tipePilihanDompet === 'tujuan' ? 'Pilih Dompet Tujuan' : 'Pilih Dompet';

  return (
    // DIUBAH: Properti `visible` dan `onRequestClose` sekarang menggunakan state dari context.
    <Modal animationType="slide" transparent={true} visible={modalDompetTerlihat} onRequestClose={tutupModalDompet}>
      <Pressable style={gaya.modalLatar} onPress={tutupModalDompet}>
        <View style={gaya.modalKonten}>
          <View style={gaya.handleContainer}>
            <View style={gaya.handle} />
          </View>

          <Text style={gaya.judul}>{judulModal}</Text>

          <FlatList
            data={daftarDompetTersedia} // DIUBAH: Menggunakan daftar yang sudah disaring
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={gaya.kontenList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={gaya.kosong}>
                <Text style={gaya.teksKosong}>Tidak ada dompet tersedia</Text>
              </View>
            }
          />
        </View>
      </Pressable>
    </Modal>
  );
}

// Gaya tidak berubah
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
