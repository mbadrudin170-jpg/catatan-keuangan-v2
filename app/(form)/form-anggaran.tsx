// app/(form)/form-anggaran.tsx
import { View, StyleSheet } from 'react-native';
import HeaderFormAnggaran from '@/screens/form-anggaran/HeaderFormAnggaran';
import InputFormAnggaran from '@/screens/form-anggaran/InputFormAnggaran';

export default function HalamanFormAnggaran() {
  return (
    <View style={gaya.wadah}>
      <HeaderFormAnggaran />
      <InputFormAnggaran />
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
