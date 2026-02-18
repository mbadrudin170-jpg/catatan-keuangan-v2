// screens/form-dompet/FormDompetscreen.tsx
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderFormDompet from './HeaderFormDompet';

export default function HalamanFormDompet() {
  return (
    <SafeAreaView style={gaya.wadahAman}>
      <HeaderFormDompet />
      <View style={gaya.konten}>
        {/* Elemen form untuk dompet akan ditambahkan di sini */}
      </View>
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  wadahAman: {
    flex: 1,
    backgroundColor: 'white',
  },
  konten: {
    padding: 16,
  },
});
