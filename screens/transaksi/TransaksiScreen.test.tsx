// screens/transaksi/TransaksiScreen.test.tsx
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import { useDompet } from '@/context/DompetContext';
import { useKategori } from '@/context/KategoriContext';
import { useTransaksi } from '@/context/TransaksiContext';
import type { Dompet, Kategori, Transaksi } from '@/database/tipe';
import TransaksiScreen from './TransaksiScreen';

jest.mock('@/context/TransaksiContext', () => ({ useTransaksi: jest.fn() }));
jest.mock('@/context/DompetContext', () => ({ useDompet: jest.fn() }));
jest.mock('@/context/KategoriContext', () => ({ useKategori: jest.fn() }));

const mockDaftarDompet: Dompet[] = [
  { id: 1, nama: 'Dompet Utama', saldo: 5000000, tipe: 'Reguler', ikon: 'wallet' },
];
const mockDaftarKategori: Kategori[] = [
  { id: 1, nama: 'Gaji', tipe: 'pemasukan', ikon: 'cash', subkategori: [] },
];
const mockDaftarTransaksi: Transaksi[] = [
  {
    id: 1,
    keterangan: 'Gaji Bulanan',
    jumlah: 5000000,
    tipe: 'pemasukan',
    tanggal: '2023-10-26',
    kategori_id: 1,
    dompet_id: 1,
    dompet_tujuan_id: null,
    subkategori_id: null,
  },
];

const renderWithNav = (component: React.ReactElement) => {
  return render(
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavigationContainer>{component}</NavigationContainer>
    </SafeAreaProvider>
  );
};

const setupMocks = ({
  transaksi = [],
  dompet = [],
  kategori = [],
  memuat = false,
}: {
  transaksi?: Transaksi[];
  dompet?: Dompet[];
  kategori?: Kategori[];
  memuat?: boolean;
}) => {
  (useTransaksi as jest.Mock).mockReturnValue({ daftarTransaksi: transaksi, memuat });
  (useDompet as jest.Mock).mockReturnValue({ daftarDompet: dompet });
  (useKategori as jest.Mock).mockReturnValue({ daftarKategori: kategori });
};

describe('TransaksiScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('harus merender daftar transaksi dengan benar', () => {
    setupMocks({
      transaksi: mockDaftarTransaksi,
      dompet: mockDaftarDompet,
      kategori: mockDaftarKategori,
    });
    renderWithNav(<TransaksiScreen />);

    expect(screen.getByText('Gaji Bulanan')).toBeTruthy();
    // Gunakan regex agar fleksibel terhadap spasi atau baris baru
    expect(screen.getByText(/5\.000\.000/)).toBeTruthy();
    expect(screen.getByText('Dompet Utama')).toBeTruthy();
  });

  it('harus memiliki tombol untuk menambah transaksi baru', () => {
    setupMocks({ transaksi: [] });
    renderWithNav(<TransaksiScreen />);
    expect(screen.getByTestId('tombol-tambah-transaksi')).toBeTruthy();
  });

  it('harus memiliki gaya latar belakang putih bersih', () => {
    setupMocks({ transaksi: [] });
    renderWithNav(<TransaksiScreen />);
    const container = screen.getByTestId('transaksi-screen-container');
    expect(container.props.style.backgroundColor).toBe('#fff');
  });

  it('harus menampilkan pesan saat tidak ada transaksi', () => {
    setupMocks({ transaksi: [] });
    renderWithNav(<TransaksiScreen />);
    expect(screen.getByText('Belum ada riwayat transaksi.')).toBeTruthy();
  });
});
