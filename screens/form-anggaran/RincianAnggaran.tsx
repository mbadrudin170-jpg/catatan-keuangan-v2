// ~/catatan-keuangan-v2/screens/form-anggaran/RincianAnggaran.tsx
import { SubKategoriDetail } from '@/screens/anggaran/dataDummy';
import { formatMataUang } from '@/utils/formatMataUang';
import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface RincianAnggaranProps {
  subKategoriList: SubKategoriDetail[];
  onUpdateSubKategori: Dispatch<SetStateAction<SubKategoriDetail[]>>;
  tipeAnggaran: 'flat' | 'persentase';
  totalAnggaran: number; // Prop baru
}

export default function RincianAnggaran({
  subKategoriList,
  onUpdateSubKategori,
  tipeAnggaran,
  totalAnggaran, // Prop baru
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
    <View style={gaya.wadah}>
      <Text style={gaya.judul}>Rincian Anggaran</Text>
      {subKategoriList.map((item, index) => {
        // Hitung nilai Rupiah untuk mode persentase
        const nilaiRupiah = tipeAnggaran === 'persentase' ? (item.jumlah / 100) * totalAnggaran : 0;

        return (
          <View key={index} style={gaya.itemWadah}>
            <Text style={gaya.namaTeks}>{item.nama}</Text>
            <View style={gaya.inputWadah}>
              {tipeAnggaran === 'flat' && <Text style={gaya.inputSimbol}>Rp</Text>}
              <TextInput
                style={gaya.input}
                value={item.jumlah > 0 ? item.jumlah.toLocaleString('id-ID') : ''}
                onChangeText={(text) => handleUpdateJumlah(text, index)}
                keyboardType="numeric"
                placeholder="0"
              />
              {tipeAnggaran === 'persentase' && <Text style={gaya.inputSimbol}>%</Text>}
            </View>
            {/* Tampilkan nilai Rupiah jika dalam mode persentase */}
            {tipeAnggaran === 'persentase' && (
              <Text style={gaya.infoRupiah}>{formatMataUang(nilaiRupiah)}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    gap: 12,
  },
  judul: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  itemWadah: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  namaTeks: {
    flex: 3,
    fontSize: 16,
    color: '#212529',
  },
  inputWadah: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
    textAlign: 'right',
  },
  inputSimbol: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  infoRupiah: {
    flex: 2, // Samakan dengan flex inputWadah
    textAlign: 'right',
    fontSize: 14,
    color: '#6c757d',
  },
});
