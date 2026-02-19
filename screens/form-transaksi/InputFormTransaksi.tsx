// screens/form-transaksi/InputFormTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
// DIUBAH: Impor useEffect untuk logika reset otomatis
import React, { useEffect, useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';

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

  // DIUBAH: Tambahkan useEffect untuk me-reset state saat tipe transaksi berubah.
  // Ini mencegah "state hantu" (misal: dompet_tujuan_id tersisa
  // saat beralih dari transfer ke pengeluaran) yang bisa menyebabkan error FOREIGN KEY.
  useEffect(() => {
    if (transaksi.tipe === 'transfer') {
      // Jika tipe baru adalah 'transfer', pastikan tidak ada sisa kategori.
      // Hanya panggil set state jika perlu untuk menghindari render berulang.
      if (transaksi.kategori_id !== null || transaksi.subkategori_id !== null) {
        setTransaksi((t) => ({ ...t, kategori_id: null, subkategori_id: null }));
      }
    } else {
      // Jika tipe baru adalah 'pemasukan' atau 'pengeluaran', pastikan tidak ada sisa dompet tujuan.
      if (transaksi.dompet_tujuan_id !== null) {
        setTransaksi((t) => ({ ...t, dompet_tujuan_id: null }));
      }
    }
  }, [transaksi, setTransaksi]);

  // Referensi untuk berpindah input
  const referensiInputKeterangan = useRef<TextInput>(null);

  const semuaSubkategori = daftarKategori.flatMap((k) => k.subkategori);
  const namaKategori =
    semuaSubkategori.find((s) => s.id === transaksi.kategori_id)?.nama || 'Pilih Kategori';

  const namaDompet = daftarDompet.find((d) => d.id === transaksi.dompet_id)?.nama || 'Pilih Dompet';
  const namaDompetTujuan =
    daftarDompet.find((d) => d.id === transaksi.dompet_tujuan_id)?.nama || 'Pilih Dompet Tujuan';

  return (
    <View style={gaya.penampung}>
      {/* Input Jumlah */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Jumlah</Text>
        <TextInput
          style={gaya.input}
          value={transaksi.jumlah ? transaksi.jumlah.toString() : ''}
          onChangeText={(teks) => setTransaksi((t) => ({ ...t, jumlah: Number(teks) || 0 }))}
          placeholder="Rp 0"
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => referensiInputKeterangan.current?.focus()}
          blurOnSubmit={false}
        />
      </View>

      {/* Input Keterangan */}
      <View style={gaya.grupInput}>
        <Text style={gaya.label}>Keterangan</Text>
        <TextInput
          ref={referensiInputKeterangan}
          style={gaya.input}
          value={transaksi.keterangan}
          onChangeText={(teks) => setTransaksi((t) => ({ ...t, keterangan: teks }))}
          placeholder="Contoh: Beli Kopi"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
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

      {/* Dompet Sumber */}
      <Pressable style={gaya.grupInput} onPress={() => bukaModalDompet('sumber')}>
        <Text style={gaya.label}>Dari Dompet</Text>
        <Text style={gaya.nilaiPemilih}>{namaDompet}</Text>
      </Pressable>

      {transaksi.tipe === 'transfer' ? (
        /* Dompet Tujuan (Hanya muncul jika tipe transfer) */
        <Pressable style={gaya.grupInput} onPress={() => bukaModalDompet('tujuan')}>
          <Text style={gaya.label}>Dompet Tujuan</Text>
          <Text style={gaya.nilaiPemilih}>{namaDompetTujuan}</Text>
        </Pressable>
      ) : (
        /* Kategori (Muncul jika tipe pemasukan/pengeluaran) */
        <Pressable style={gaya.grupInput} onPress={bukaModalKategori}>
          <Text style={gaya.label}>Kategori</Text>
          <Text style={gaya.nilaiPemilih}>{namaKategori}</Text>
        </Pressable>
      )}
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
    color: '#000',
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
