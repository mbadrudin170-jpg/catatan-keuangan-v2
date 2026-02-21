// screens/anggaran/ScreenAnggaran.tsx
import TombolTambahAnggaran from '@/screens/anggaran/TombolTambahAnggaran';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderAnggaran from './HeaderAnggaran';
import ListAnggaran from './LIstAnggaran';

export default function ScreenAnggaran() {
  return (
    <SafeAreaView style={gaya.penampung}>
      <View style={gaya.penampung}>
        <HeaderAnggaran />
        <ListAnggaran />
      </View>
      <TombolTambahAnggaran />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    flex: 1,
  },
});
