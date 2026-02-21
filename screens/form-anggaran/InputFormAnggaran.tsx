// screens/form-anggaran/InputFormAnggaran.tsx
import type { TipePeriode } from '@/database/tipe';
import { formatMataUang } from '@/utils/formatMataUang';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ModalPilihKategori from './ModalPilihKategori';

export default function InputFormAnggaran() {
  const [jumlah, setJumlah] = useState('');
  const [kategori, setKategori] = useState(null);
  const [periode, setPeriode] = useState<TipePeriode>('bulanan');
  const [modalKategoriTerbuka, setModalKategoriTerbuka] = useState(false);

  const handlePilihKategori = (kategoriTerpilih) => {
    setKategori(kategoriTerpilih);
    setModalKategoriTerbuka(false);
  };

  return (
    <View style={gaya.wadah}>
      {/* Input Jumlah Anggaran */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Jumlah Anggaran</Text>
        <TextInput
          style={gaya.input}
          placeholder="Rp 0"
          keyboardType="numeric"
          value={jumlah ? formatMataUang(parseInt(jumlah, 10)) : ''}
          onChangeText={(teks) => setJumlah(teks.replace(/[^0-9]/g, ''))}
        />
      </View>

      {/* Pemilih Kategori */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Kategori</Text>
        <Pressable style={gaya.pemilih} onPress={() => setModalKategoriTerbuka(true)}>
          <Text style={gaya.teksPemilih}>{kategori ? kategori.nama : 'Pilih Kategori'}</Text>
          <Ionicons name="chevron-down" size={20} color="#6c757d" />
        </Pressable>
      </View>

      {/* Pemilih Periode */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Periode</Text>
        <View style={gaya.grupTombolPeriode}>
          <Pressable
            style={[gaya.tombolPeriode, periode === 'bulanan' && gaya.tombolPeriodeAktif]}
            onPress={() => setPeriode('bulanan')}
          >
            <Text style={[gaya.teksPeriode, periode === 'bulanan' && gaya.teksPeriodeAktif]}>
              Bulanan
            </Text>
          </Pressable>
          <Pressable
            style={[gaya.tombolPeriode, periode === 'tahunan' && gaya.tombolPeriodeAktif]}
            onPress={() => setPeriode('tahunan')}
          >
            <Text style={[gaya.teksPeriode, periode === 'tahunan' && gaya.teksPeriodeAktif]}>
              Tahunan
            </Text>
          </Pressable>
          <Pressable
            style={[gaya.tombolPeriode, periode === 'sekali' && gaya.tombolPeriodeAktif]}
            onPress={() => setPeriode('sekali')}
          >
            <Text style={[gaya.teksPeriode, periode === 'sekali' && gaya.teksPeriodeAktif]}>
              Sekali
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Tombol Simpan */}
      <Pressable style={gaya.tombolSimpan} onPress={() => alert('Simpan Anggaran')}>
        <Text style={gaya.teksTombolSimpan}>Simpan Anggaran</Text>
      </Pressable>

      <ModalPilihKategori
        isVisible={modalKategoriTerbuka}
        onClose={() => setModalKategoriTerbuka(false)}
        onSelectKategori={handlePilihKategori}
      />
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  grupInput: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  pemilih: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teksPemilih: {
    fontSize: 16,
  },
  grupTombolPeriode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tombolPeriode: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tombolPeriodeAktif: {
    backgroundColor: '#007bff',
  },
  teksPeriode: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: 'bold',
  },
  teksPeriodeAktif: {
    color: 'white',
  },
  tombolSimpan: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  teksTombolSimpan: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
