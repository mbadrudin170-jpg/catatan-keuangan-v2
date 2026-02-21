// ~/catatan-keuangan-v2/screens/form-anggaran/InputFormAnggaran.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { TipePeriode } from '@/database/tipe';
import type { AnggaranLokal, SubKategoriDetail } from '@/screens/anggaran/dataDummy';
import { formatMataUang } from '@/utils/formatMataUang';
import ModalPilihKategori from './ModalPilihKategori';
import RincianAnggaran from './RincianAnggaran';

interface Props {
  tipeAnggaran: 'flat' | 'persentase';
  kategori: AnggaranLokal | null;
  rincian: SubKategoriDetail[];
  periode: TipePeriode;
  totalAnggaran: number;
  modalKategoriTerbuka: boolean;
  kategoriList: AnggaranLokal[];
  onPilihPeriode: (periode: TipePeriode) => void;
  onUpdateRincian: Dispatch<SetStateAction<SubKategoriDetail[]>>;
  onSimpan: () => void;
  onBukaModalKategori: () => void;
  onTutupModalKategori: () => void;
  onPilihKategori: (kategori: AnggaranLokal) => void;
  onUbahTotalAnggaran: (nilai: number) => void;
}

export default function InputFormAnggaran({
  tipeAnggaran,
  kategori,
  rincian,
  periode,
  totalAnggaran,
  modalKategoriTerbuka,
  kategoriList,
  onPilihPeriode,
  onUpdateRincian,
  onSimpan,
  onBukaModalKategori,
  onTutupModalKategori,
  onPilihKategori,
  onUbahTotalAnggaran,
}: Props) {
  const isPersentaseMode = tipeAnggaran === 'persentase';

  // Hitung total persentase dari rincian
  const totalPersentaseRincian = rincian.reduce((total, item) => total + item.jumlah, 0);

  // Hitung sisa persentase
  const sisaPersentase = 100 - totalPersentaseRincian;

  return (
    <>
      <ScrollView style={gaya.wadah} contentContainerStyle={gaya.kontenWadah}>
        {/* Pemilih Kategori */}
        <View style={gaya.grupInput}>
          <Text style={gaya.label}>Kategori</Text>
          <Pressable style={gaya.pemilih} onPress={onBukaModalKategori}>
            <Text style={gaya.teksPemilih}>
              {kategori ? kategori.nama_kategori : 'Pilih Kategori'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6c757d" />
          </Pressable>
        </View>

        {/* Rincian Anggaran (muncul setelah kategori dipilih) */}
        {kategori && (
          <>
            <View style={gaya.grupInput}>
              <Text style={gaya.label}>Total Anggaran</Text>
              <TextInput
                style={[gaya.input, !isPersentaseMode && gaya.inputNonaktif]}
                value={formatMataUang(totalAnggaran)}
                editable={isPersentaseMode}
                keyboardType="numeric"
                onChangeText={(teks) => onUbahTotalAnggaran(Number(teks.replace(/[^0-9]/g, '')))}
                placeholder="Masukkan Total Anggaran"
              />
            </View>

            {/* Info Sisa Persentase (hanya mode persentase) */}
            {isPersentaseMode && (
              <View style={gaya.infoSisaWadah}>
                <Text style={gaya.infoSisaLabel}>Sisa alokasi persentase:</Text>
                <Text style={[gaya.infoSisaJumlah, sisaPersentase < 0 && gaya.peringatan]}>
                  {sisaPersentase}%
                </Text>
              </View>
            )}

            <RincianAnggaran
              subKategoriList={rincian}
              onUpdateSubKategori={onUpdateRincian}
              tipeAnggaran={tipeAnggaran}
              totalAnggaran={totalAnggaran}
            />

            {/* Peringatan jika total persentase melebihi 100% */}
            {isPersentaseMode && totalPersentaseRincian > 100 && (
              <Text style={gaya.peringatan}>
                Total persentase rincian ({totalPersentaseRincian}%) melebihi 100%.
              </Text>
            )}
          </>
        )}

        {/* Pemilih Periode */}
        <View style={gaya.grupInput}>
          <Text style={gaya.label}>Periode</Text>
          <View style={gaya.grupTombolPeriode}>
            <Pressable
              style={[gaya.tombolPeriode, periode === 'bulanan' && gaya.tombolPeriodeAktif]}
              onPress={() => onPilihPeriode('bulanan')}
            >
              <Text style={[gaya.teksPeriode, periode === 'bulanan' && gaya.teksPeriodeAktif]}>
                Bulanan
              </Text>
            </Pressable>
            <Pressable
              style={[gaya.tombolPeriode, periode === 'tahunan' && gaya.tombolPeriodeAktif]}
              onPress={() => onPilihPeriode('tahunan')}
            >
              <Text style={[gaya.teksPeriode, periode === 'tahunan' && gaya.teksPeriodeAktif]}>
                Tahunan
              </Text>
            </Pressable>
            <Pressable
              style={[gaya.tombolPeriode, periode === 'sekali' && gaya.tombolPeriodeAktif]}
              onPress={() => onPilihPeriode('sekali')}
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
        <Pressable style={gaya.tombolSimpan} onPress={onSimpan}>
          <Text style={gaya.teksTombolSimpan}>Simpan Anggaran</Text>
        </Pressable>
      </View>

      <ModalPilihKategori
        terlihat={modalKategoriTerbuka}
        onTutup={onTutupModalKategori}
        onPilih={onPilihKategori}
        kategoriList={kategoriList}
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
    paddingBottom: 120,
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
  peringatan: {
    color: '#dc3545', // Merah
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoSisaWadah: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 8,
    marginTop: 5, // Sedikit jarak dari atas
  },
  infoSisaLabel: {
    fontSize: 14,
    color: '#495057',
  },
  infoSisaJumlah: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745', // Hijau untuk nilai positif
  },
});
