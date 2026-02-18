// screens/form-dompet/FormDompetscreen.tsx
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderFormDompet from './HeaderFormDompet';
import Input from './InputFormDompet';
import TombolSimpan from './TombolSimpan';

export default function HalamanFormDompet() {
  return (
    <SafeAreaView style={style.wadahAman}>
      <HeaderFormDompet />
      <View style={style.konten}>
        <Input />
        <TombolSimpan />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  wadahAman: {
    flex: 1,
    backgroundColor: 'white',
  },
  konten: {
    padding: 16,
  },
});
