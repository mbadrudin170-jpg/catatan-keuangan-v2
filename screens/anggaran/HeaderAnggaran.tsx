// screens/anggaran/HeaderAnggaran.tsx
import { StyleSheet, Text, View } from 'react-native';

export default function HeaderAnggaran() {
  return (
    <View style={gaya.penampungHeader}>
      <Text style={gaya.judulHeader}>Anggaran</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampungHeader: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    alignItems: 'center',
  },
  judulHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
});
