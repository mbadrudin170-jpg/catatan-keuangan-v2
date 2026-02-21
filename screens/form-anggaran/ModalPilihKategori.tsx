import { Modal, Pressable, Text, View } from 'react-native';

interface dompet {
  id: number;
  nama: string;
  saldo: number;
  tipe?: string;
  ikon?: string;
}
const dummyDompet: dompet = {
  id: 1,
  nama: 'Cash',
  saldo: 1000000,
  tipe: 'Cash',
  ikon: 'cash',
};

interface ModalPilihKategoriProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectKategori: (kategori: string) => void;
}

export default function ModalPilihKategori({
  isVisible,
  onClose,
  onSelectKategori,
}: ModalPilihKategoriProps) {
  const categories = ['Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Lain-lain']; // Example categories

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Pilih Kategori</Text>
          {categories.map((category, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onSelectKategori(category);
                onClose();
              }}
              style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}
            >
              <Text style={{ fontSize: 18 }}>{category}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={onClose}
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: '#f0f0f0',
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: 'red' }}>Batal</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
