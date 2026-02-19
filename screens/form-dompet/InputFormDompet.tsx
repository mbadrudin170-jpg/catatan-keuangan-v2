// screens/form-dompet/InputFormDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { Dompet } from '@/database/tipe';
import ModalTipeDompet from './modal/ModalTipeDompet';

// Terima properti `dompet` untuk mode edit
export default function InputFormDompet({ dompet }: { dompet?: Dompet | null }) {
  // Ambil semua yang diperlukan dari context
  const { dataForm, setDataForm, bukaModalTipe } = useDompet();

  // Gunakan useEffect untuk mengisi form saat mode edit
  useEffect(() => {
    if (dompet) {
      setDataForm({
        namaDompet: dompet.nama,
        // Format saldo dari angka ke string dengan titik
        saldoAwal: dompet.saldo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        tipe: dompet.tipe,
        ikon: dompet.ikon, // tambahkan ikon
      });
    }
    // Tambahkan [dompet, setDataForm] sebagai dependensi
  }, [dompet, setDataForm]);

  const handleNamaChange = (nama: string) => {
    setDataForm((dataSebelumnya) => ({ ...dataSebelumnya, namaDompet: nama }));
  };

  const handleSaldoChange = (saldo: string) => {
    const saldoTanpaTitik = saldo.replace(/[^\d]/g, '');
    const saldoTerformat = saldoTanpaTitik.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setDataForm((dataSebelumnya) => ({ ...dataSebelumnya, saldoAwal: saldoTerformat }));
  };

  return (
    <View style={gaya.wadah}>
      {/* Tipe Dompet */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Tipe</Text>
        {/* Gunakan fungsi bukaModalTipe dari context */}
        <Pressable style={gaya.inputPilihan} onPress={bukaModalTipe}>
          {/* Tampilkan tipe yang dipilih dari context, atau placeholder jika kosong */}
          <Text style={gaya.teksInputPilihan}>{dataForm.tipe || 'Pilih Tipe'}</Text>
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
          value={dataForm.namaDompet}
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
            value={dataForm.saldoAwal}
            onChangeText={handleSaldoChange}
          />
        </View>
      </View>

      {/* Panggil ModalTipeDompet tanpa props */}
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
