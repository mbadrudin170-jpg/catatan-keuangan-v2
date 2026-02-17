// screens/kategori/HeaderKategori.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HeaderKategori() {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </Pressable>
      <Text style={styles.headerText}>Kategori</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  headerText: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
});
