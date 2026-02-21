import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ambilSemuaAnggaranDenganRincian } from '@/database/operasi';
import type { Anggaran, RincianAnggaran } from '@/database/tipe';
import { formatMataUang } from '@/utils/formatMataUang';

export default function ScreenDetailAnggaran() {
  const { id } = useLocalSearchParams();
  const [anggaran, setAnggaran] = useState<Anggaran | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const muatAnggaran = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        // Ambil semua anggaran dan cari yang sesuai
        const semuaAnggaran = await ambilSemuaAnggaranDenganRincian();
        const anggaranDitemukan = semuaAnggaran.find(
          (a: Anggaran) => a.id === Number(id)
        );
        setAnggaran(anggaranDitemukan || null);
      } catch (error) {
        console.error('Gagal memuat detail anggaran:', error);
      } finally {
        setIsLoading(false);
      }
    };

    muatAnggaran();
  }, [id]);

  const totalTerpakai = 0; // Placeholder, akan diimplementasikan nanti
  const totalSisa = anggaran ? anggaran.total_anggaran - totalTerpakai : 0;

  return (
    <SafeAreaView style={gaya.container}>
      {/* Header */}
      <View style={gaya.header}>
        <Pressable onPress={() => router.back()} style={gaya.tombolKembali}>
          <Text style={gaya.teksTombolKembali}>{'<'}</Text>
        </Pressable>
        <Text style={gaya.judulHeader}>Detail Anggaran</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Konten */}
      <ScrollView contentContainerStyle={gaya.scrollViewContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
        ) : !anggaran ? (
          <View style={gaya.kontenPusat}>
            <Text style={gaya.teksInfo}>Anggaran tidak ditemukan.</Text>
          </View>
        ) : (
          <View style={gaya.konten}>
            {/* Info Umum */}
            <View style={gaya.kartuInfo}>
              <View style={gaya.barisInfoUmum}>
                <Text style={gaya.labelInfoUmum}>Kategori</Text>
                <Text style={gaya.nilaiInfoUmum}>{anggaran.nama_kategori}</Text>
              </View>
              <View style={gaya.garisPemisahTipis} />
              <View style={gaya.barisInfoUmum}>
                <Text style={gaya.labelInfoUmum}>Periode</Text>
                <Text style={gaya.nilaiInfoUmum}>{anggaran.periode}</Text>
              </View>
            </View>

            {/* Kartu Total Anggaran */}
            <View style={gaya.kartuTotalContainer}>
              <View style={gaya.barisTotal}>
                <Text style={gaya.labelTotal}>Total Anggaran</Text>
                <Text style={gaya.totalHijau}>
                  {formatMataUang(anggaran.total_anggaran)}
                </Text>
              </View>
              <View style={gaya.garisPemisahTipis} />
              <View style={gaya.barisTotal}>
                <Text style={gaya.labelTotal}>Total Terpakai</Text>
                <Text style={gaya.totalMerah}>{formatMataUang(totalTerpakai)}</Text>
              </View>
              <View style={gaya.garisPemisahTipis} />
              <View style={gaya.barisTotal}>
                <Text style={gaya.labelTotal}>Total Sisa</Text>
                <Text style={gaya.totalBiru}>{formatMataUang(totalSisa)}</Text>
              </View>
            </View>

            {/* Detail Sub-Kategori */}
            <View style={gaya.kartuInfo}>
              <Text style={gaya.labelInfo}>Rincian Sub-Kategori</Text>
              {anggaran.rincian?.map((sub: RincianAnggaran, index: number) => (
                <SubKategoriKartu key={index} rincian={sub} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Komponen untuk menampilkan setiap sub-kategori
const SubKategoriKartu = ({ rincian }: { rincian: RincianAnggaran }) => {
  const terpakai = 0; // Placeholder
  const sisa = rincian.jumlah - terpakai;

  return (
    <View style={gaya.subKategoriKontainer}>
      <Text style={gaya.subKategoriNama}>{rincian.nama_subkategori}</Text>
      <View style={gaya.subKategoriDetailRow}>
        <Text style={gaya.subKategoriLabel}>Anggaran:</Text>
        <Text style={gaya.subKategoriNilaiHijau}>{formatMataUang(rincian.jumlah)}</Text>
      </View>
      <View style={gaya.subKategoriDetailRow}>
        <Text style={gaya.subKategoriLabel}>Terpakai:</Text>
        <Text style={gaya.subKategoriNilaiMerah}>{formatMataUang(terpakai)}</Text>
      </View>
      <View style={gaya.subKategoriDetailRow}>
        <Text style={gaya.subKategoriLabel}>Sisa:</Text>
        <Text style={gaya.subKategoriNilaiBiru}>{formatMataUang(sisa)}</Text>
      </View>
    </View>
  );
};

const gaya = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE2E6',
    backgroundColor: 'white',
  },
  tombolKembali: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  teksTombolKembali: {
    fontSize: 24,
    color: '#007BFF',
  },
  judulHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  konten: {
    padding: 16,
    gap: 12,
  },
  kontenPusat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teksInfo: {
    fontSize: 16,
    color: '#6C757D',
  },
  kartuInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 8,
  },
  labelInfo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    marginBottom: 4,
  },
  barisInfoUmum: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  labelInfoUmum: {
    fontSize: 16,
    color: '#495057',
  },
  nilaiInfoUmum: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    textTransform: 'capitalize',
  },
  kartuTotalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 8,
  },
  barisTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  labelTotal: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '600',
  },
  totalHijau: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28A745',
  },
  totalMerah: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC3545',
  },
  totalBiru: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  subKategoriKontainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F5',
  },
  subKategoriNama: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 8,
  },
  subKategoriDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  subKategoriLabel: {
    fontSize: 14,
    color: '#6C757D',
  },
  subKategoriNilaiHijau: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28A745',
  },
  subKategoriNilaiMerah: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC3545',
  },
  subKategoriNilaiBiru: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  garisPemisahTipis: {
    height: 1,
    backgroundColor: '#F1F3F5',
    marginVertical: 4,
  },
});
