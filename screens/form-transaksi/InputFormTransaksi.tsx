// screens/form-transaksi/InputFormTransaksi.tsx
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Transaksi } from '@/database/tipe';

// Definisikan state awal untuk transaksi baru agar mudah di-reset
const STATE_AWAL_TRANSAKSI: Transaksi = {
  id: Date.now(), // ID sementara, akan diganti saat disimpan
  jumlah: 0,
  keterangan: '',
  tanggal: new Date().toISOString(),
  tipe: 'pengeluaran', // Default
  kategori_id: null,
  subkategori_id: null,
  dompet_id: 0, // Akan diisi oleh pengguna
  dompet_tujuan_id: null,
  nama_kategori: null,
  nama_subkategori: null,
  nama_dompet: null,
  nama_dompet_tujuan: null,
};

export default function InputFormTransaksi() {
  const { id: idParams } = useLocalSearchParams<{ id?: string }>();
  const {
    transaksi,
    setTransaksi,
    daftarTransaksi, // Ambil daftar transaksi untuk mencari data edit
    tampilkanPemilihTanggal,
    tampilkanPemilihWaktu,
    bukaModalKategori,
    bukaModalDompet,
  } = useTransaksi();

  const { daftarKategori } = useKategori();
  const { daftarDompet } = useDompet();

  // EFEK BARU: Mengisi form saat mode edit atau me-reset saat mode baru
  useEffect(() => {
    if (idParams) {
      // MODE EDIT: Cari transaksi yang sesuai di daftar
      const transaksiUntukDiedit = daftarTransaksi.find((t) => t.id === Number(idParams));
      if (transaksiUntukDiedit) {
        // Jika ditemukan, isi state form dengan datanya
        setTransaksi(transaksiUntukDiedit);
      }
    } else {
      // MODE BARU: Reset state ke kondisi awal yang bersih
      setTransaksi(STATE_AWAL_TRANSAKSI);
    }

    // Cleanup: Saat komponen di-unmount, reset state untuk persiapan berikutnya
    return () => {
      setTransaksi(STATE_AWAL_TRANSAKSI);
    };
  }, [idParams, daftarTransaksi, setTransaksi]);

  // EFEK LAMA: Tetap ada untuk membersihkan state saat tipe transaksi diubah
  useEffect(() => {
    if (transaksi.tipe === 'transfer') {
      if (transaksi.kategori_id !== null || transaksi.subkategori_id !== null) {
        setTransaksi((t) => ({ ...t, kategori_id: null, subkategori_id: null }));
      }
    } else {
      if (transaksi.dompet_tujuan_id !== null) {
        setTransaksi((t) => ({ ...t, dompet_tujuan_id: null }));
      }
    }
  }, [transaksi.tipe, setTransaksi]); // Disederhanakan dependencies-nya

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
          value={transaksi.keterangan || ''} // Handle null value
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
