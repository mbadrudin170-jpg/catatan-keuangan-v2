// ~/catatan-keuangan-v2/screens/anggaran/ModalOpsi.tsx
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, View } from 'react-native';
export default function ModalOpsi() {
  return (
    <Modal>
      <View>
        <Pressable>
          <Ionicons name="logo-x" size={24} color="black" />
        </Pressable>

        <Pressable>
          <Text>hapus</Text>
        </Pressable>
        <Pressable>
          <Text>edit</Text>
        </Pressable>
      </View>
    </Modal>
  );
}
/** ask:  atur style nya dan tambahkan props 
 baca dahulu file  GEMINI.md
ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
 selalu tulis kan jalur path file di paling atas setiap file
 tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
 */