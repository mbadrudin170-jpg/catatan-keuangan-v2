// ~/catatan-keuangan-v2/screens/form-anggaran/RincianAnggaran.tsx
import { SubKategoriDetail } from '@/screens/anggaran/dataDummy';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface RincianAnggaranProps {
  subKategoriList: SubKategoriDetail[];
  onUpdateSubKategori: Dispatch<SetStateAction<SubKategoriDetail[]>>;
}

export default function RincianAnggaran({
  subKategoriList,
  onUpdateSubKategori,
}: RincianAnggaranProps) {
  const handleUpdate = (index: number, field: keyof SubKategoriDetail, value: string | number) => {
    const newList = subKategoriList.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdateSubKategori(newList);
  };

  const handleUpdateJumlah = (text: string, index: number) => {
    const newJumlah = parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
    handleUpdate(index, 'jumlah', newJumlah);
  };

  return (
    <View style={gaya.container}>
      <Text style={gaya.judul}>Rincian Anggaran</Text>
      {subKategoriList.map((item, index) => (
        <View key={index} style={gaya.itemContainer}>
          <Text style={gaya.namaTeks}>{item.nama}</Text>
          <TextInput
            style={[gaya.input, gaya.inputJumlah]}
            value={item.jumlah > 0 ? item.jumlah.toLocaleString('id-ID') : ''}
            onChangeText={(text) => handleUpdateJumlah(text, index)}
            keyboardType="numeric"
            placeholder="Rp 0"
          />
        </View>
      ))}
    </View>
  );
}

const gaya = StyleSheet.create({
  container: {
    gap: 12,
  },
  judul: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED4DA',
    fontSize: 16,
    color: '#212529',
  },
  namaTeks: {
    flex: 3,
    fontSize: 16,
    color: '#212529',
  },
  inputJumlah: {
    flex: 2,
    textAlign: 'right',
  },
});
