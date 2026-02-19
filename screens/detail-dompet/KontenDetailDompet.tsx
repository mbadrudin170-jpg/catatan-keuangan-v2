// screens/detail-dompet/KontenDetailDompet.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatAngka } from '@/utils/format/FormatAngka';
import { useDetailDompetContext } from './logikaDetailDompet';

export default function KontenDetailDompet() {
  const { dompet } = useDetailDompetContext();

  // Jika dompet belum ada (misal masih loading), jangan tampilkan apapun untuk mencegah error
  if (!dompet) {
    return null;
  }

  return (
    <View style={gaya.konten}>
      {/* Kartu Saldo Utama */}
      <View style={gaya.kartuInfo}>
        <View style={gaya.grupIkonNama}>
          <View style={[gaya.ikonWadah, { backgroundColor: warna.latarIkon }]}>
            <Ionicons name={(dompet.ikon as any) || 'wallet'} size={32} color={warna.primer} />
          </View>
          <Text style={gaya.teksNamaDompet}>{dompet.nama}</Text>
        </View>
        <Text style={gaya.teksSaldo}>{formatAngka(dompet.saldo)}</Text>
        <Text style={gaya.labelInfo}>Saldo Saat Ini</Text>
      </View>

      {/* Kartu Info Tambahan */}
      <View style={gaya.kartuInfo}>
        <View style={gaya.infoBaris}>
          <Text style={gaya.labelInfo}>Tipe Dompet</Text>
          <Text style={gaya.nilaiInfo}>{dompet.tipe}</Text>
        </View>
      </View>
    </View>
  );
}

const warna = {
  primer: '#3b82f6',
  putih: '#ffffff',
  teksUtama: '#1f2937',
  teksSekunder: '#6b7280',
  latarIkon: '#eff6ff',
};

const gaya = StyleSheet.create({
  konten: {
    padding: 20,
  },
  kartuInfo: {
    backgroundColor: warna.putih,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  grupIkonNama: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ikonWadah: {
    padding: 16,
    borderRadius: 99,
    marginBottom: 12,
  },
  teksNamaDompet: {
    fontSize: 24,
    fontWeight: 'bold',
    color: warna.teksUtama,
  },
  teksSaldo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: warna.primer,
  },
  labelInfo: {
    fontSize: 14,
    color: warna.teksSekunder,
    marginTop: 4,
  },
  infoBaris: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  nilaiInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: warna.teksUtama,
  },
});
