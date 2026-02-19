// screens/form-transaksi/tombol/TombolTipeFormTransaksi.tsx
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTransaksi } from '@/context/TransaksiContext';

type TipeTransaksi = 'pemasukan' | 'pengeluaran' | 'transfer';

// DIHAPUS: Prop `onTipeChange` tidak lagi diperlukan

export default function TombolTipeFormTransaksi() {
  // DIUBAH: Komponen sekarang langsung menggunakan context untuk membaca dan mengubah state
  const { transaksi, setTransaksi } = useTransaksi();
  const tipeAktif = transaksi.tipe;

  // DIHAPUS: `useState` lokal dihapus untuk menghilangkan duplikasi state

  const daftarTombol: TipeTransaksi[] = ['pemasukan', 'pengeluaran', 'transfer']; {
    /** ask:  kenapa saat berpindah tipe entah itu dari pemasukan ke pengeluaran atau pun sebalik nya kenapa contohnya dari saat dalam type pemasukan modal screens/form-transaksi/modal/ModalPilihKategori.tsx ini selalu menampilkan kosong
   baca dahulu file PEDOMAN_KOLABORASI.md
  ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
   selalu tulis kan jalur path file di paling atas setiap file
   tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
   */
  }

  // DIUBAH: Logika untuk mengubah tipe transaksi dan me-reset nilai terkait
  // sekarang terpusat di sini.
  const handlePilihTipe = (tipe: TipeTransaksi) => {
    setTransaksi((transaksiLama) => ({
      ...transaksiLama,
      tipe: tipe,
      // Reset kategori dan dompet tujuan setiap kali tipe diubah
      kategori_id: null,
      dompet_tujuan_id: null,
    }));
  };

  return (
    <View style={gaya.wadah}>
      {daftarTombol.map((tipe) => {
        const warnaTipe = konfigurasiWarna[tipe];
        // DIUBAH: `aktif` sekarang ditentukan oleh state dari context
        const aktif = tipeAktif === tipe;

        return (
          <Pressable
            key={tipe}
            style={({ pressed }) => [
              gaya.tombol,
              {
                backgroundColor: aktif ? warnaTipe.latarAktif : warnaTipe.latarNonAktif,
                borderColor: warnaTipe.border,
              },
              aktif && gaya.tombolAktif,
              pressed && gaya.tombolDitekan,
            ]}
            onPress={() => handlePilihTipe(tipe)}
          >
            <Text
              style={[
                gaya.teksTombol,
                {
                  color: aktif ? warnaTipe.teksAktif : warnaTipe.teksNonAktif,
                },
              ]}
            >
              {tipe.charAt(0).toUpperCase() + tipe.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// Konfigurasi warna tetap sama
const konfigurasiWarna: Record<
  TipeTransaksi,
  {
    latarAktif: string;
    latarNonAktif: string;
    teksAktif: string;
    teksNonAktif: string;
    border: string;
  }
> = {
  pemasukan: {
    latarAktif: '#16a34a',
    latarNonAktif: '#f0fdf4',
    teksAktif: '#ffffff',
    teksNonAktif: '#166534',
    border: '#22c55e',
  },
  pengeluaran: {
    latarAktif: '#dc2626',
    latarNonAktif: '#fef2f2',
    teksAktif: '#ffffff',
    teksNonAktif: '#7f1d1d',
    border: '#ef4444',
  },
  transfer: {
    latarAktif: '#2563eb',
    latarNonAktif: '#eff6ff',
    teksAktif: '#ffffff',
    teksNonAktif: '#1e3a8a',
    border: '#3b82f6',
  },
};

// Gaya tetap sama
const gaya = StyleSheet.create({
  wadah: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  tombol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  tombolAktif: {
    shadowOpacity: 0.18,
    elevation: 6,
  },

  tombolDitekan: {
    transform: [{ scale: 0.97 }],
  },

  teksTombol: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
