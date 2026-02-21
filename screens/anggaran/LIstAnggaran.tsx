// screens/form-anggaran/ListAnggaran.tsx
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
// import { useFocusEffect } from 'expo-router';
// import { ambilSemuaAnggaran } from '@/database/operasi';
import type { AnggaranLokal } from '@/screens/anggaran/dataDummy'; // Perbarui path impor
import { dataDummyAnggaran } from '@/screens/anggaran/dataDummy'; // Perbarui path impor
import { formatMataUang } from '@/utils/formatMataUang';
import { router } from 'expo-router';

export default function ListAnggaran() {
  // Gunakan data dummy sebagai state awal
  const [daftarAnggaran, setDaftarAnggaran] = useState<AnggaranLokal[]>(dataDummyAnggaran);
  // Set memuat ke false karena kita pakai data statis
  const [memuat, setMemuat] = useState(false);

  /* Nonaktifkan sementara untuk menggunakan data dummy
  useFocusEffect(
    useCallback(() => {
      const muatData = async () => {
        try {
          setMemuat(true);
          const data = await ambilSemuaAnggaran();
          setDaftarAnggaran(data);
        } catch (error) {
          console.error('Gagal memuat anggaran:', error);
        } finally {
          setMemuat(false);
        }
      };

      muatData();
    }, [])
  );
  */

  if (memuat) {
    return <ActivityIndicator size="large" color="#007bff" style={gaya.pusat} />;
  }

  if (daftarAnggaran.length === 0) {
    return (
      <View style={gaya.pusat}>
        <Text style={gaya.teksInfo}>Belum ada anggaran yang dibuat.</Text>
      </View>
    );
  }

  return (
    <View style={gaya.penampung}>
      {daftarAnggaran.map((anggaran) => (
        <Pressable
          key={anggaran.id}
          style={gaya.item}
          onPress={() =>
            router.push({ pathname: '/(detail)/anggaran/[id]', params: { id: anggaran.id } })
          }
        >
          <Text style={gaya.namaKategori}>{anggaran.nama_kategori}</Text>
          <View>
            <Text style={gaya.jumlah}>{formatMataUang(anggaran.jumlah)}</Text>
            <Text style={gaya.periode}>{anggaran.periode}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const gaya = StyleSheet.create({
  pusat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  teksInfo: {
    fontSize: 16,
    color: '#6c757d',
  },
  penampung: {
    padding: 16,
    gap: 12,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  namaKategori: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  jumlah: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    textAlign: 'right',
  },
  periode: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
