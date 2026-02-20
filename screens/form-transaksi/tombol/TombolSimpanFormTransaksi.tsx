// screens/form-transaksi/tombol/TombolSimpanFormTransaksi.tsx
import { useTransaksi } from '@/context/TransaksiContext';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TombolSimpanFormTransaksi() {
  const router = useRouter();
  const { transaksi, setTransaksi, tambahTransaksi } = useTransaksi();

  const apakahTombolNonaktif = (() => {
    // DIUBAH: Pengecekan disesuaikan untuk dompet_id yang bisa null
    if (transaksi.jumlah <= 0 || transaksi.dompet_id === null) {
      return true;
    }
    if (transaksi.tipe === 'transfer') {
      if (!transaksi.dompet_tujuan_id || transaksi.dompet_id === transaksi.dompet_tujuan_id) {
        return true;
      }
    } else {
      if (!transaksi.kategori_id) {
        return true;
      }
    }
    return false;
  })();

  const handleSimpan = async () => {
    if (apakahTombolNonaktif) return;

    try {
      await tambahTransaksi(transaksi);

      // DIUBAH: Reset form sekarang menggunakan null untuk dompet_id
      setTransaksi({
        id: Date.now(),
        jumlah: 0,
        keterangan: '',
        tanggal: new Date().toISOString(),
        tipe: 'pengeluaran',
        kategori_id: null,
        dompet_id: null, // Diganti dari 0 ke null
        dompet_tujuan_id: null,
        subkategori_id: null,
      });

      router.back();
    } catch (error: any) {
      console.error('Gagal menyimpan dari TombolSimpan:', error);
      Alert.alert('Gagal Menyimpan', error.message || 'Terjadi kesalahan yang tidak diketahui.');
    }
  };

  return (
    <View style={gaya.penampung}>
      {/** ask:  saat mau menyimpan muncul ini  Gagal menyimpan dari TombolSimpan: [Error: Call to function 'NativeStatement.finalizeAsync' has been rejected.
→ Caused by: Error code : FOREIGN KEY constraint failed] 

Code: construct.js
  2 | var setPrototypeOf = require("./setPrototypeOf.js");
  3 | function _construct(t, e, r) {
> 4 |   if (isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
    |                                                                 ^
  5 |   var o = [null];
  6 |   o.push.apply(o, e);
  7 |   var p = new (t.bind.apply(t, o))();
Call Stack
  construct (<native>)
  apply (<native>)
  _construct (node_modules/@babel/runtime/helpers/construct.js:4:65)
  Wrapper (node_modules/@babel/runtime/helpers/wrapNativeSuper.js:15:23)
  construct (<native>)
  _callSuper (node_modules/@babel/runtime/helpers/callSuper.js:5:108)
  constructor (node_modules/expo-modules-core/src/errors/CodedError.ts:11:5)
   
       baca dahulu file  GEMINI.md
      ini file terbaru yang sudah saya modifikasi jadi kamu gunakan data ini jangan gunakan data yang tersimpan di memori kamu
       selalu tulis kan jalur path file di paling atas setiap file
       tolong untuk penamaan variabel dan kunci usahakan gunakan bahasa indonesia terkecuali bahasa inggris nya yang sudah umum baru gunakana bahasa inggris nya
       */}
      <Pressable
        style={({ pressed }) => [
          gaya.tombol,
          apakahTombolNonaktif && gaya.tombolNonaktif,
          pressed && !apakahTombolNonaktif && gaya.tombolDitekan,
        ]}
        onPress={handleSimpan}
        disabled={apakahTombolNonaktif}
      >
        <Text style={gaya.teksTombol}>Simpan</Text>
      </Pressable>
    </View>
  );
}

const gaya = StyleSheet.create({
  penampung: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tombol: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  tombolDitekan: {
    backgroundColor: '#1976D2',
  },
  tombolNonaktif: {
    backgroundColor: '#ccc',
  },
  teksTombol: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
