// screens/form-transaksi/InputFormTransaksi.tsx
import { useDompet } from '@/context/DompetContext'; // <-- BARU: Butuh untuk mendapatkan nama dompet
import { useKategori } from '@/context/KategoriContext'; // <-- BARU: Butuh untuk mendapatkan nama kategori
import { useTransaksi } from '@/context/TransaksiContext';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function InputFormTransaksi() {
  const {
    transaksi,
    setTransaksi,
    tampilkanPemilihTanggal,
    tampilkanPemilihWaktu,
    bukaModalKategori,
    bukaModalDompet,
  } = useTransaksi();

  const { daftarKategori } = useKategori();
  const { daftarDompet } = useDompet();

  // --- BARU: Fungsi untuk mendapatkan nama dari ID ---
  const namaKategori =
    daftarKategori.find((k) => k.id === transaksi.kategori_id)?.nama || 'Pilih Kategori';
  const namaDompet = daftarDompet.find((d) => d.id === transaksi.dompet_id)?.nama || 'Pilih Dompet';
  // --- END BARU ---

  return (
    <View style={gaya.penampung}>
      {/* Input Jumlah */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Jumlah</Text>
        <TextInput
          style={gaya.input}
          value={transaksi.jumlah.toString()} // Ubah ke string
          onChangeText={(teks) => setTransaksi((t) => ({ ...t, jumlah: Number(teks) || 0 }))}
          placeholder="Rp 0"
          keyboardType="numeric"
        />
      </View>

      {/* Input Keterangan */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Keterangan</Text>
        <TextInput
          style={gaya.input}
          value={transaksi.keterangan}
          onChangeText={(teks) => setTransaksi((t) => ({ ...t, keterangan: teks }))}
          placeholder="Contoh: Beli Kopi"
        />
      </View>

      {/* Pemilih Tanggal & Waktu */}
      <View style={gaya.grupInputHorizontal}>
        <Pressable style={gaya.pemilih} onPress={tampilkanPemilihTanggal}>
          <Ionicons name="calendar-outline" size={24} color="#555" />
          <Text>{format(new Date(transaksi.tanggal), 'dd MMM yyyy', { locale: id })}</Text>
        </Pressable>
        <Pressable style={gaya.pemilih} onPress={tampilkanPemilihWaktu}>
          <Ionicons name="time-outline" size={24} color="#555" />
          <Text>{format(new Date(transaksi.tanggal), 'HH:mm')}</Text>
        </Pressable>
      </View>

      {/* Pemilih Kategori */}
      <Pressable style={gaya.grupInput} onPress={bukaModalKategori}>
        <Text style={gaya.label}>Kategori</Text>
        <Text style={gaya.nilaiPemilih}>{namaKategori}</Text>
      </Pressable>

      {/* Pemilih Dompet */}
      <Pressable style={gaya.grupInput} onPress={bukaModalDompet}>
        <Text style={gaya.label}>Dompet</Text>
        <Text style={gaya.nilaiPemilih}>{namaDompet}</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  grupInput: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
  },
  grupInputHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pemilih: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    width: '48%',
  },
  nilaiPemilih: {
    fontSize: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
