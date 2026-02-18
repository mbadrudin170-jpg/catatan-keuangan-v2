// screens/form-dompet/HeaderFormDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderFormDompet() {
  return (
    <View style={gaya.wadah}>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={gaya.judul}>Form Dompet</Text>
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  judul: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
