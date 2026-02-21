// ~/catatan-keuangan-v2/screens/anggaran/ModalOpsi.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onHapus: () => void;
  onEdit: () => void;
}

export default function ModalOpsi({ visible, onClose, onHapus, onEdit }: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Latar belakang semi-transparan, menutup modal saat ditekan */}
      <Pressable style={gaya.latarBelakang} onPress={onClose}>
        <View style={gaya.kontenModal}>
          {/* Header Modal dengan Judul dan Tombol Tutup */}
          <View style={gaya.headerModal}>
            <Text style={gaya.judulModal}>Opsi</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close-outline" size={28} color="#6c757d" />
            </Pressable>
          </View>

          {/* Tombol Opsi Edit */}
          <Pressable style={gaya.wadahTombolOpsi} onPress={onEdit}>
            <Ionicons name="pencil-outline" size={24} color="#007bff" />
            <Text style={gaya.teksOpsi}>Edit</Text>
          </Pressable>

          {/* Tombol Opsi Hapus */}
          <Pressable style={gaya.wadahTombolOpsi} onPress={onHapus}>
            <Ionicons name="trash-outline" size={24} color="#dc3545" />
            <Text style={[gaya.teksOpsi, gaya.teksHapus]}>Hapus</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const gaya = StyleSheet.create({
  // Latar belakang yang menutupi seluruh layar
  latarBelakang: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Efek dim
  },
  // Kontener utama untuk konten modal
  kontenModal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3, // Shadow di bagian atas
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  // Header di dalam modal
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 15,
    marginBottom: 15,
  },
  judulModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  },
  // Penampung untuk setiap baris opsi (ikon + teks)
  wadahTombolOpsi: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  teksOpsi: {
    fontSize: 18,
    marginLeft: 15,
    color: '#495057',
  },
  teksHapus: {
    color: '#dc3545', // Warna merah untuk aksi hapus
  },
});
