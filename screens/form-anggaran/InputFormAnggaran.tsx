// ~/catatan-keuangan-v2/screens/form-anggaran/InputFormAnggaran.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { TipePeriode } from '@/database/tipe';
import type { AnggaranLokal, SubKategoriDetail } from '@/screens/anggaran/dataDummy';
import { formatMataUang } from '@/utils/formatMataUang';
import ModalPilihKategori from './ModalPilihKategori';
import RincianAnggaran from './RincianAnggaran';

export default function InputFormAnggaran() {
  const [kategori, setKategori] = useState<AnggaranLokal | null>(null);
  const [rincian, setRincian] = useState<SubKategoriDetail[]>([]);
  const [periode, setPeriode] = useState<TipePeriode>('bulanan');
  const [modalKategoriTerbuka, setModalKategoriTerbuka] = useState(false);

  const totalAnggaran = rincian.reduce((total, item) => total + item.jumlah, 0);

  const handlePilihKategori = (kategoriTerpilih: AnggaranLokal) => {
    setKategori(kategoriTerpilih);
    // Perbaiki: Gunakan `subKategori` dan beri tipe pada parameter `sub`
    const rincianDiinisialisasi = kategoriTerpilih.subKategori.map((sub: { nama: string }) => ({
      nama: sub.nama,
      jumlah: 0,
      terpakai: 0,
      sisa: 0,
    }));
    setRincian(rincianDiinisialisasi);
    setModalKategoriTerbuka(false);
  };

  const handleSimpan = () => {
    console.log({
      namaKategori: kategori?.nama_kategori,
      totalAnggaran,
      periode,
      rincian,
    });
    alert('Simpan Anggaran');
  };

  return (
    <>
      <ScrollView style={gaya.wadah} contentContainerStyle={gaya.kontenWadah}>
        {/* Pemilih Kategori */}
        <View style={gaya.grupInput}>
          <Text style={gaya.label}>Kategori</Text>
          <Pressable style={gaya.pemilih} onPress={() => setModalKategoriTerbuka(true)}>
            <Text style={gaya.teksPemilih}>
              {kategori ? kategori.nama_kategori : 'Pilih Kategori'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6c757d" />
          </Pressable>
        </View>

        {/* Rincian Anggaran (muncul setelah kategori dipilih) */}
        {kategori && (
          <>
            <RincianAnggaran subKategoriList={rincian} onUpdateSubKategori={setRincian} />

            <View style={gaya.grupInput}>
              <Text style={gaya.label}>Total Anggaran</Text>
              <TextInput
                style={[gaya.input, gaya.inputNonaktif]}
                value={formatMataUang(totalAnggaran)}
                editable={false}
              />
            </View>
          </>
        )}

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
      </ScrollView>

      {/* Tombol Simpan (di luar ScrollView) */}
      <View style={gaya.wadahAksi}>
        <Pressable style={gaya.tombolSimpan} onPress={handleSimpan}>
          <Text style={gaya.teksTombolSimpan}>Simpan Anggaran</Text>
        </Pressable>
      </View>

      <ModalPilihKategori
        isVisible={modalKategoriTerbuka}
        onClose={() => setModalKategoriTerbuka(false)}
        onSelectKategori={handlePilihKategori}
      />
    </>
  );
}

const gaya = StyleSheet.create({
  wadah: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  kontenWadah: {
    padding: 20,
    gap: 20,
    paddingBottom: 120, // Tambah padding bawah agar tidak tertutup tombol simpan
  },
  grupInput: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#495057',
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
  inputNonaktif: {
    backgroundColor: '#E9ECEF',
    color: '#6C757D',
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
  },
  tombolPeriode: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
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
  wadahAksi: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#DEE2E6',
    backgroundColor: '#FFFFFF',
  },
  tombolSimpan: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  teksTombolSimpan: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
