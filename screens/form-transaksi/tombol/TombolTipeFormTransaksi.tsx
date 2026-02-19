// screens/form-transaksi/tombol/TombolTipeFormTransaksi.tsx
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TipeTransaksi = 'Pemasukan' | 'Pengeluaran' | 'Transfer';

interface Props {
  onTipeChange: (tipe: TipeTransaksi) => void;
}

export default function TombolTipeFormTransaksi({ onTipeChange }: Props) {
  const [tipeAktif, aturTipeAktif] = useState<TipeTransaksi>('Pengeluaran');

  const daftarTombol: TipeTransaksi[] = ['Pemasukan', 'Pengeluaran', 'Transfer'];

  const handlePilihTipe = (tipe: TipeTransaksi) => {
    aturTipeAktif(tipe);
    onTipeChange(tipe);
  };

  return (
    <View style={gaya.wadah}>
      {daftarTombol.map((tipe) => {
        const warnaTipe = konfigurasiWarna[tipe];
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
              {tipe}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

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
  Pemasukan: {
    latarAktif: '#16a34a',
    latarNonAktif: '#f0fdf4',
    teksAktif: '#ffffff',
    teksNonAktif: '#166534',
    border: '#22c55e',
  },
  Pengeluaran: {
    latarAktif: '#dc2626',
    latarNonAktif: '#fef2f2',
    teksAktif: '#ffffff',
    teksNonAktif: '#7f1d1d',
    border: '#ef4444',
  },
  Transfer: {
    latarAktif: '#2563eb',
    latarNonAktif: '#eff6ff',
    teksAktif: '#ffffff',
    teksNonAktif: '#1e3a8a',
    border: '#3b82f6',
  },
};

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
