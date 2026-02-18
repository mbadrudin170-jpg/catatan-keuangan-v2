// screens/form-dompet/InputFormDompet.tsx
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useDompet } from '../../context/DompetContext';

export default function InputFormDompet() {
  // Gunakan state dan setter yang baru dari context: dataForm dan setDataForm
  const { dataForm, setDataForm } = useDompet();

  // Fungsi untuk menangani perubahan pada input nama dompet
  const handleNamaChange = (nama: string) => {
    setDataForm((dataSebelumnya) => ({
      ...dataSebelumnya,
      namaDompet: nama,
    }));
  };

  // Fungsi untuk menangani perubahan pada input saldo awal
  const handleSaldoChange = (saldo: string) => {
    // Format saldo dengan titik sebagai pemisah ribuan saat pengguna mengetik
    const saldoTanpaTitik = saldo.replace(/\./g, '');
    const saldoTerformat = saldoTanpaTitik.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setDataForm((dataSebelumnya) => ({
      ...dataSebelumnya,
      saldoAwal: saldoTerformat,
    }));
  };

  return (
    <View style={gaya.container}>
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Nama Dompet</Text>
        <TextInput
          style={gaya.input}
          placeholder="Contoh: Dompet Utama"
          value={dataForm.namaDompet}
          onChangeText={handleNamaChange}
        />
      </View>
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Saldo Awal (Rp)</Text>
        <TextInput
          style={gaya.input}
          placeholder="Contoh: 50.000"
          keyboardType="numeric"
          value={dataForm.saldoAwal}
          onChangeText={handleSaldoChange}
        />
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  grupInput: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});
