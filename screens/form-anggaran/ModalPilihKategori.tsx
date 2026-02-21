import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { AnggaranLokal } from '@/screens/anggaran/dataDummy';

interface Props {
  terlihat: boolean;
  kategoriList: AnggaranLokal[]; // Terima daftar kategori sebagai props
  onPilih: (kategori: AnggaranLokal) => void;
  onTutup: () => void;
}

export default function ModalPilihKategori({
  terlihat,
  kategoriList,
  onPilih,
  onTutup,
}: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={terlihat}
      onRequestClose={onTutup}
    >
      <View style={gaya.modalOverlay}>
        <View style={gaya.modalKonten}>
          <Text style={gaya.modalJudul}>Pilih Kategori Anggaran</Text>
          <ScrollView>
            {kategoriList.map(kategori => (
              <Pressable
                key={kategori.id}
                style={gaya.itemKategori}
                onPress={() => onPilih(kategori)}
              >
                <Text style={gaya.teksItemKategori}>{kategori.nama_kategori}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={gaya.tombolTutup} onPress={onTutup}>
            <Text style={gaya.teksTombolTutup}>Batal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const gaya = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalKonten: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalJudul: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemKategori: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teksItemKategori: {
    fontSize: 16,
  },
  tombolTutup: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#DC3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  teksTombolTutup: {
    color: 'white',
    fontWeight: 'bold',
  },
});
