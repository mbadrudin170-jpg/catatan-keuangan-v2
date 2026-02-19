// screens/form-dompet/FormDompetscreen.tsx
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderFormDompet from './HeaderFormDompet';
import InputFormDompet from './InputFormDompet';
import TombolSimpan from './TombolSimpan';

export default function HalamanFormDompet() {
  return (
    <SafeAreaView style={gaya.wadahAman}>
      <HeaderFormDompet />
      {/* Menggunakan ScrollView agar konten bisa digulir */}
      <ScrollView contentContainerStyle={gaya.kontenScroll}>
        <InputFormDompet />
        <TombolSimpan />
      </ScrollView>
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  wadahAman: {
    flex: 1,
    backgroundColor: 'white',
  },
  kontenScroll: {
    padding: 16,
  },
});
