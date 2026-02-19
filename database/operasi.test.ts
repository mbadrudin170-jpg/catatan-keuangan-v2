// database/operasi.test.ts
import * as dbOps from './operasi';
import db from './sqlite';

// Mocking modul sqlite
jest.mock('./sqlite', () => ({
  __esModule: true,
  default: {
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
  },
}));

describe('Operasi Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Tes Kategori ---
  describe('Kategori', () => {
    it('harus memanggil query INSERT kategori dengan parameter yang benar', async () => {
      await dbOps.tambahKategori('Internet', 'wifi', 'pengeluaran');

      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO kategori'),
        'Internet',
        'wifi',
        'pengeluaran'
      );
    });

    it('harus menggabungkan data kategori dan subkategori dengan benar (mapping)', async () => {
      // Mock data mentah dari DB
      const kategoriMentah = [{ id: 1, nama: 'Makan', ikon: 'fast-food', tipe: 'pengeluaran' }];
      const subkategoriMentah = [{ id: 10, nama: 'Kopi', kategori_id: 1 }];

      (db.getAllAsync as jest.Mock)
        .mockResolvedValueOnce(kategoriMentah) // Untuk ambilSemuaKategori
        .mockResolvedValueOnce(subkategoriMentah);

      const hasil = await dbOps.ambilSemuaKategori();

      expect(hasil[0].subkategori).toHaveLength(1);
      expect(hasil[0].subkategori[0].nama).toBe('Kopi');
    });
  });

  // --- Tes Dompet ---
  describe('Dompet', () => {
    it('harus menjalankan UPDATE dompet dengan saldo numerik yang benar', async () => {
      await dbOps.perbaruiDompet(1, 'Bank Utama', 150000, 'Bank', 'card');

      expect(db.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE dompet SET'),
        'Bank Utama',
        150000,
        'Bank',
        'card',
        1
      );
    });

    it('harus mengembalikan null jika dompet tidak ditemukan', async () => {
      (db.getFirstAsync as jest.Mock).mockResolvedValue(null);

      const hasil = await dbOps.ambilSatuDompet(99);
      expect(hasil).toBeNull();
    });
  });

  // --- Tes Transaksi ---
  describe('Transaksi', () => {
    it('harus menangani nilai null pada keterangan transaksi', async () => {
      const transaksiDummy = {
        jumlah: 20000,
        keterangan: undefined, // Skenario keterangan tidak diisi
        tanggal: '2026-02-20T00:00:00Z',
        tipe: 'pengeluaran',
        kategori_id: 5,
        dompet_id: 1,
        dompet_tujuan_id: null,
        subkategori_id: null,
      } as any;

      await dbOps.tambahSatuTransaksi(transaksiDummy);

      // Verifikasi bahwa parameter kedua (keterangan) dikirim sebagai null ke DB
      expect(db.runAsync).toHaveBeenCalledWith(
        expect.any(String),
        20000,
        null, // Hasil dari ?? null
        '2026-02-20T00:00:00Z',
        'pengeluaran',
        5,
        1,
        null,
        null
      );
    });
  });
});
