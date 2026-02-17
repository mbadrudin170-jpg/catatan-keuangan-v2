// screens/form-kategori/FormKategoriScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TombolSimpan from './TombolSimpan';

export default function FormKategoriScreen() {
  const [activeTab, setActiveTab] = useState('Pemasukkan');
  const [kategori, setKategori] = useState('');
  const [subkategori, setSubkategori] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const existingTransactions = await AsyncStorage.getItem('transactions');
      const transactions = existingTransactions
        ? JSON.parse(existingTransactions)
        : [];
      setTransactions(transactions);
    };
    fetchTransactions();
  }, []);

  const handleSave = async () => {
    if (!kategori || !subkategori) {
      Alert.alert('Error', 'Kategori dan Subkategori tidak boleh kosong');
      return;
    }

    try {
      const newTransaction = {
        id: new Date().getTime().toString(),
        type: activeTab,
        kategori,
        subkategori,
        timestamp: new Date(),
      };

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      Alert.alert('Sukses', 'Transaksi berhasil disimpan');
      setKategori('');
      setSubkategori('');
      // No need to call router.back() since the list is on the same screen.
    } catch (error) {
      console.error('Failed to save transaction', error);
      Alert.alert('Error', 'Gagal menyimpan transaksi');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedTransactions = transactions.filter((item) => item.id !== id);
      setTransactions(updatedTransactions);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      Alert.alert('Sukses', 'Transaksi berhasil dihapus');
    } catch (error) {
      console.error('Failed to delete transaction', error);
      Alert.alert('Error', 'Gagal menghapus transaksi');
    }
  };

  const renderItem = ({ item }: { item: { id: string, kategori: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.kategori}</Text>
      <View style={styles.itemActions}>
        <Pressable onPress={() => router.push(`/edit-kategori/${item.id}`)}>
          <Ionicons name="create-outline" size={24} color="blue" />
        </Pressable>
        <Pressable onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </Pressable>
        <Text style={styles.headerText}>Tambah Transaksi</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            activeTab === 'Pemasukkan' && styles.activeButton,
          ]}
          onPress={() => setActiveTab('Pemasukkan')}
        >
          <Text
            style={[
              styles.buttonText,
              activeTab === 'Pemasukkan' && styles.activeButtonText,
            ]}
          >
            Pemasukkan
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            activeTab === 'Pengeluaran' && styles.activeButton,
          ]}
          onPress={() => setActiveTab('Pengeluaran')}
        >
          <Text
            style={[
              styles.buttonText,
              activeTab === 'Pengeluaran' && styles.activeButtonText,
            ]}
          >
            Pengeluaran
          </Text>
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Kategori</Text>
        <TextInput
          style={styles.input}
          placeholder="input kategori"
          value={kategori}
          onChangeText={setKategori}
        />
        <Text style={styles.label}>Subkategori</Text>
        <TextInput
          style={styles.input}
          placeholder="input sub kategori"
          value={subkategori}
          onChangeText={setSubkategori}
        />
      </View>
       <TombolSimpan onPress={handleSave} />
      <FlatList
        data={transactions.filter(t => t.type === activeTab)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  activeButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  activeButtonText: {
    color: 'white',
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 15,
  }
});