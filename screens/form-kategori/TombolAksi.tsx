// screens/form-kategori/TombolAksi.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

interface TombolAksiProps {
  nama: string;
  placeholder: string;
  onTambah: (nama: string) => void;
  // onHapus tidak kita gunakan saat ini, tapi kita siapkan
  onHapus: (id: number) => void;
}

export default function TombolAksi({
  nama,
  placeholder,
  onTambah,
}: TombolAksiProps) {
  const [inputNilai, setInputNilai] = useState('');

  const handleTambah = () => {
    if (inputNilai.trim() === '') return; // Jangan tambah jika kosong
    onTambah(inputNilai);
    setInputNilai(''); // Reset input
  };

  return (
    <View style={gaya.wadah}>
      <Text style={gaya.label}>Tambah {nama} Baru</Text>
      <View style={gaya.grupInput}>
        <TextInput
          style={gaya.input}
          placeholder={placeholder}
          value={inputNilai}
          onChangeText={setInputNilai}
        />
        <Button title="Tambah" onPress={handleTambah} />
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grupInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: 'white',
  },
});
