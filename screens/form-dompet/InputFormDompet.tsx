// screens/form-dompet/InputFormDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import ModalTipeDompet from './modal/ModalTipeDompet';

export default function InputFormDompet() {
  const { formDompet, setFormDompet, bukaModalTipe } = useDompet();

  const handleNamaChange = (nama: string) => {
    setFormDompet((dataSebelumnya) => ({ ...dataSebelumnya, nama }));
  };

  // Fungsi untuk menangani perubahan saldo
  const handleSaldoChange = (teks: string) => {
    // Hanya mengizinkan angka dan menghapus format non-numerik
    const nilaiAngka = teks.replace(/[^0-9]/g, '');
    setFormDompet((dataSebelumnya) => ({
      ...dataSebelumnya,
      saldo: Number(nilaiAngka),
    }));
  };

  return (
    <View style={gaya.wadah}>
      {/* Tipe Dompet */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Tipe</Text>
        <Pressable style={gaya.inputPilihan} onPress={bukaModalTipe}>
          <Text style={gaya.teksInputPilihan}>
            {formDompet.tipe ? formDompet.tipe.charAt(0).toUpperCase() + formDompet.tipe.slice(1) : 'Pilih Tipe'}
          </Text>
          <Ionicons name="chevron-down" size={22} color={warna.teksSekunder} />
        </Pressable>
      </View>

      {/* Nama Dompet */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Nama Dompet</Text>
        <TextInput
          style={gaya.inputTeks}
          placeholder="Cth: Dompet Utama"
          placeholderTextColor="#94a3b8"
          value={formDompet.nama}
          onChangeText={handleNamaChange}
        />
      </View>

      {/* Saldo Awal - DITAMBAHKAN KEMBALI */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Saldo Awal</Text>
        <TextInput
          style={gaya.inputTeks}
          placeholder="Rp 0"
          placeholderTextColor="#94a3b8"
          keyboardType="numeric"
          value={formDompet.saldo ? `Rp ${formDompet.saldo.toLocaleString('id-ID')}` : ''}
          onChangeText={handleSaldoChange}
        />
      </View>

      <ModalTipeDompet />
    </View>
  );
}

const warna = {
  border: '#e2e8f0',
  teksUtama: '#0f172a',
  teksSekunder: '#64748b',
  latarInput: '#ffffff',
};

const gaya = StyleSheet.create({
  wadah: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 18,
  },
  grupInput: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: warna.teksSekunder,
    fontWeight: '600',
  },
  inputTeks: {
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: warna.teksUtama,
    backgroundColor: warna.latarInput,
  },
  inputPilihan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: warna.latarInput,
  },
  teksInputPilihan: {
    fontSize: 15,
    color: warna.teksUtama,
    fontWeight: '500',
  },
});
