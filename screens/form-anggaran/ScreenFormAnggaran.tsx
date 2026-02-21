// ~/catatan-keuangan-v2/screens/form-anggaran/ScreenFormAnggaran.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import HeaderFormAnggaran from './HeaderFormAnggaran';
import InputFormAnggaran from './InputFormAnggaran';

/**
 * @description Layar utama untuk membuat atau mengedit anggaran.
 */
export default function ScreenFormAnggaran() {
  return (
    <SafeAreaView style={gaya.container}>
      {/* Header Form */}
      <HeaderFormAnggaran />

      {/* Komponen Form Input */}
      <InputFormAnggaran />
    </SafeAreaView>
  );
}

const gaya = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
