// screens/form-dompet/modal/ModalTipeDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useDompet, type FormDompet } from '@/context/DompetContext';

const daftarTipe = [
  { id: '1', nama: 'Tunai', ikon: 'cash-outline' },
  { id: '2', nama: 'Bank', ikon: 'business-outline' },
  { id: '3', nama: 'E-Wallet', ikon: 'wallet-outline' },
  { id: '4', nama: 'Pinjaman', ikon: 'card-outline' },
  { id: '5', nama: 'Lainnya', ikon: 'ellipsis-horizontal-outline' },
];

export default function ModalTipeDompet() {
  const { modalTipeTerlihat, tutupModalTipe, setFormDompet, formDompet } = useDompet();

  const handlePilihTipe = (tipe: { nama: string; ikon: string }) => {
    setFormDompet((dataSebelumnya: FormDompet) => ({
      ...dataSebelumnya,
      tipe: tipe.nama,
      ikon: tipe.ikon,
    }));
    tutupModalTipe();
  };

  return (
    <Modal
      visible={modalTipeTerlihat}
      transparent={true}
      animationType="fade"
      onRequestClose={tutupModalTipe}
    >
      <Pressable style={gaya.backdrop} onPress={tutupModalTipe} />

      <View style={gaya.wadahModal}>
        <View style={gaya.headerModal}>
          <Text style={gaya.judulModal}>Pilih Tipe Dompet</Text>
          <Pressable onPress={tutupModalTipe} style={gaya.tombolTutup}>
            <Ionicons name="close" size={24} color={warna.teksUtama} />
          </Pressable>
        </View>

        <View style={gaya.daftarPilihan}>
          {daftarTipe.map((item) => {
            const terpilih = formDompet.tipe === item.nama;
            return (
              <Pressable
                key={item.id}
                style={[gaya.itemPilihan, terpilih && gaya.itemPilihanTerpilih]}
                onPress={() => handlePilihTipe(item)}
              >
                <Ionicons
                  name={item.ikon as React.ComponentProps<typeof Ionicons>['name']}
                  size={22}
                  color={terpilih ? warna.primer : warna.teksSekunder}
                />
                <Text style={[gaya.teksItemPilihan, terpilih && gaya.teksItemPilihanTerpilih]}>
                  {item.nama}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

// ... (gaya tidak berubah)
const warna = {
  latar: '#ffffff',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  teksUtama: '#0f172a',
  teksSekunder: '#64748b',
  border: '#e2e8f0',
  primer: '#3b82f6', // Warna primer baru untuk item terpilih
  latarPrimer: '#eff6ff', // Latar belakang baru untuk item terpilih
};

const gaya = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: warna.backdrop,
  },
  wadahModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: warna.latar,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  judulModal: {
    fontSize: 20,
    fontWeight: '700',
    color: warna.teksUtama,
  },
  tombolTutup: {
    padding: 6,
    borderRadius: 99,
    backgroundColor: '#f1f5f9',
  },
  daftarPilihan: {
    marginTop: 8,
  },
  itemPilihan: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  itemPilihanTerpilih: {
    backgroundColor: warna.latarPrimer,
  },
  teksItemPilihan: {
    fontSize: 16,
    marginLeft: 16,
    color: warna.teksUtama,
    fontWeight: '500',
  },
  teksItemPilihanTerpilih: {
    color: warna.primer,
    fontWeight: '600',
  },
});
