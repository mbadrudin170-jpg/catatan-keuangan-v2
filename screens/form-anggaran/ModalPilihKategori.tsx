// ~/catatan-keuangan-v2/screens/form-anggaran/ModalPilihKategori.tsx
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnggaranLokal, dataDummyAnggaran } from '@/screens/anggaran/dataDummy';

interface ModalPilihKategoriProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectKategori: (kategori: AnggaranLokal) => void;
}

export default function ModalPilihKategori({
  isVisible,
  onClose,
  onSelectKategori,
}: ModalPilihKategoriProps) {
  const handlePilihKategori = (kategori: AnggaranLokal) => {
    onSelectKategori(kategori);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={gaya.modalWadah}>
        <View style={gaya.modalKonten}>
          <Text style={gaya.modalJudul}>Pilih Kategori Anggaran</Text>
          <FlatList
            data={dataDummyAnggaran}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handlePilihKategori(item)}
                style={gaya.itemKategori}
              >
                <Text style={gaya.teksKategori}>{item.nama_kategori}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={onClose} style={gaya.tombolBatal}>
            <Text style={gaya.teksTombolBatal}>Batal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const gaya = StyleSheet.create({
  modalWadah: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalKonten: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalJudul: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemKategori: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teksKategori: {
    fontSize: 18,
  },
  tombolBatal: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  teksTombolBatal: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold'
  },
});
