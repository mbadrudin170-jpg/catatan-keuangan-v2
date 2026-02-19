// screens/form-dompet/InputFormDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useDompet, type FormDompet } from '@/context/DompetContext'; // DIUBAH
import ModalTipeDompet from './modal/ModalTipeDompet';

// DIHAPUS: Komponen ini tidak lagi menerima props dompet
export default function InputFormDompet() {
  // DIUBAH: Menggunakan nama baru dari context
  const { formDompet, setFormDompet, bukaModalTipe } = useDompet();

  // DIHAPUS: useEffect untuk mengisi form telah dipindahkan ke level layar

  const handleNamaChange = (nama: string) => {
    // DIUBAH: Menggunakan properti 'nama' dan tipe eksplisit
    setFormDompet((dataSebelumnya: FormDompet) => ({ ...dataSebelumnya, nama }));
  };

  const handleSaldoChange = (saldo: string) => {
    const saldoTanpaTitik = saldo.replace(/[^\d]/g, '');
    const saldoTerformat = saldoTanpaTitik.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    // DIUBAH: Menggunakan properti 'saldo' dan tipe eksplisit
    setFormDompet((dataSebelumnya: FormDompet) => ({ ...dataSebelumnya, saldo: saldoTerformat }));
  };

  return (
    <View style={gaya.wadah}>
      {/* Tipe Dompet */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Tipe</Text>
        <Pressable style={gaya.inputPilihan} onPress={bukaModalTipe}>
          {/* DIUBAH: Menggunakan formDompet.tipe */}
          <Text style={gaya.teksInputPilihan}>{formDompet.tipe || 'Pilih Tipe'}</Text>
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
          value={formDompet.nama} // DIUBAH
          onChangeText={handleNamaChange}
        />
      </View>

      {/* Saldo Awal */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Saldo Awal</Text>
        <View style={gaya.wadahInputNominal}>
          <Text style={gaya.teksRp}>Rp</Text>
          <TextInput
            style={gaya.inputTeksNominal}
            placeholder="0"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={formDompet.saldo} // DIUBAH
            onChangeText={handleSaldoChange}
          />
        </View>
      </View>

      <ModalTipeDompet />
    </View>
  );
}

// ... (gaya tidak berubah)
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
  wadahInputNominal: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: warna.latarInput,
  },
  teksRp: {
    fontSize: 15,
    color: warna.teksSekunder,
    marginRight: 8,
    fontWeight: '600',
  },
  inputTeksNominal: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: warna.teksUtama,
  },
});
