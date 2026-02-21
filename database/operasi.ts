// database/operasi.ts
import { db } from './sqlite';
import type { Anggaran, Kategori, Subkategori, Dompet, Transaksi, RincianAnggaran } from './tipe';

// =================================================================================
// OPERASI KATEGORI & SUBKATEGORI
// =================================================================================

export const ambilSemuaKategori = async (): Promise<Kategori[]> => {
  return await db.getAllAsync<Kategori>('SELECT * FROM kategori ORDER BY nama;');
};

export const ambilSemuaSubkategori = async (): Promise<Subkategori[]> => {
  return await db.getAllAsync<Subkategori>('SELECT * FROM subkategori;');
};

export const tambahSatuKategori = async (
  kategori: Pick<Kategori, 'nama' | 'tipe' | 'ikon'>
): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('INSERT INTO kategori (nama, tipe, ikon) VALUES (?, ?, ?);', [
    kategori.nama,
    kategori.tipe,
    kategori.ikon || null,
  ]);
};

export const tambahSatuSubkategori = async (
  subkategori: Pick<Subkategori, 'nama' | 'kategori_id'>
): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('INSERT INTO subkategori (nama, kategori_id) VALUES (?, ?);', [
    subkategori.nama,
    subkategori.kategori_id,
  ]);
};

export const perbaruiSatuKategori = async (
  kategori: Pick<Kategori, 'id' | 'nama' | 'tipe' | 'ikon'>
): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('UPDATE kategori SET nama = ?, tipe = ?, ikon = ? WHERE id = ?;', [
    kategori.nama,
    kategori.tipe,
    kategori.ikon || null,
    kategori.id,
  ]);
};

export const perbaruiSatuSubkategori = async (
  subkategori: Pick<Subkategori, 'id' | 'nama'>
): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('UPDATE subkategori SET nama = ? WHERE id = ?;', [
    subkategori.nama,
    subkategori.id,
  ]);
};

export const hapusSatuKategori = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('DELETE FROM kategori WHERE id = ?;', [id]);
};

export const hapusSatuSubkategori = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('DELETE FROM subkategori WHERE id = ?;', [id]);
};

// =================================================================================
// OPERASI DOMPET
// =================================================================================

export const ambilSemuaDompet = async (): Promise<Dompet[]> => {
  return await db.getAllAsync<Dompet>('SELECT * FROM dompet ORDER BY nama;');
};

export const tambahSatuDompet = async (
  dompet: Omit<Dompet, 'id'>
): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync(
    'INSERT INTO dompet (nama, saldo, tipe, ikon) VALUES (?, ?, ?, ?);',
    [dompet.nama, dompet.saldo, dompet.tipe, dompet.ikon]
  );
};

export const perbaruiSatuDompet = async (
  dompet: Omit<Dompet, 'saldo'>
): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('UPDATE dompet SET nama = ?, tipe = ?, ikon = ? WHERE id = ?;', [
    dompet.nama,
    dompet.tipe,
    dompet.ikon,
    dompet.id,
  ]);
};

export const perbaruiSaldoDompet = async (id: number, jumlah: number): Promise<void> => {
  await db.runAsync('UPDATE dompet SET saldo = saldo + ? WHERE id = ?;', [jumlah, id]);
};

export const resetSemuaSaldoDompet = async (): Promise<void> => {
  await db.runAsync('UPDATE dompet SET saldo = 0;');
};

export const hapusSatuDompet = async (id: number): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('DELETE FROM dompet WHERE id = ?;', [id]);
};

export const hapusSemuaDompet = async (): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('DELETE FROM dompet;');
};

// =================================================================================
// OPERASI TRANSAKSI
// =================================================================================

export const ambilSemuaTransaksi = async (): Promise<Transaksi[]> => {
  return await db.getAllAsync<Transaksi>('SELECT * FROM transaksi ORDER BY tanggal DESC;');
};

export const tambahSatuTransaksi = async (transaksi: Transaksi): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync(
    `INSERT INTO transaksi (id, tipe, jumlah, keterangan, tanggal, kategori_id, subkategori_id, dompet_id, dompet_tujuan_id, nama_kategori, nama_subkategori, nama_dompet, nama_dompet_tujuan) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      transaksi.id,
      transaksi.tipe,
      transaksi.jumlah,
      transaksi.keterangan,
      transaksi.tanggal,
      transaksi.kategori_id,
      transaksi.subkategori_id,
      transaksi.dompet_id,
      transaksi.dompet_tujuan_id,
      transaksi.nama_kategori,
      transaksi.nama_subkategori,
      transaksi.nama_dompet,
      transaksi.nama_dompet_tujuan,
    ]
  );
};

export const hapusSemuaTransaksi = async (): Promise<SQLite.SQLiteRunResult> => {
  return await db.runAsync('DELETE FROM transaksi;');
};

// =================================================================================
// OPERASI ANGGARAN
// =================================================================================

export const ambilSemuaAnggaran = async (): Promise<Anggaran[]> => {
  // Query ini menggabungkan anggaran dengan kategori untuk mendapatkan nama kategori
  return await db.getAllAsync<Anggaran>(`
    SELECT a.id, a.total_anggaran, a.tipe, a.periode, a.tanggal_mulai, a.kategori_id, k.nama as nama_kategori
    FROM anggaran a
    JOIN kategori k ON a.kategori_id = k.id
    ORDER BY a.tanggal_mulai DESC;
  `);
};

export const ambilSatuAnggaranDenganRincian = async (
  id: number
): Promise<(Anggaran & { rincian: RincianAnggaran[] }) | null> => {
  const anggaran = await db.getFirstAsync<Anggaran>(
    'SELECT * FROM anggaran WHERE id = ?;',
    id
  );
  if (!anggaran) return null;

  const rincian = await db.getAllAsync<RincianAnggaran>(
    'SELECT * FROM rincian_anggaran WHERE anggaran_id = ?;',
    id
  );
  return { ...anggaran, rincian };
};

export const tambahAnggaranDenganRincian = async (
  anggaran: Omit<Anggaran, 'id' | 'nama_kategori'>,
  rincian: Omit<RincianAnggaran, 'id' | 'anggaran_id'>[]
): Promise<void> => {
  const hasil = await db.runAsync(
    'INSERT INTO anggaran (total_anggaran, tipe, periode, tanggal_mulai, kategori_id) VALUES (?, ?, ?, ?, ?);',
    [
      anggaran.total_anggaran,
      anggaran.tipe,
      anggaran.periode,
      anggaran.tanggal_mulai,
      anggaran.kategori_id,
    ]
  );
  const anggaranId = hasil.lastInsertRowId;

  for (const item of rincian) {
    await db.runAsync(
      'INSERT INTO rincian_anggaran (anggaran_id, subkategori_id, jumlah) VALUES (?, ?, ?);',
      [anggaranId, item.subkategori_id, item.jumlah]
    );
  }
};

export const perbaruiAnggaranDenganRincian = async (
  anggaran: Omit<Anggaran, 'nama_kategori'>,
  rincian: RincianAnggaran[]
): Promise<void> => {
  await db.runAsync(
    'UPDATE anggaran SET total_anggaran = ?, tipe = ?, periode = ?, tanggal_mulai = ?, kategori_id = ? WHERE id = ?;',
    [
      anggaran.total_anggaran,
      anggaran.tipe,
      anggaran.periode,
      anggaran.tanggal_mulai,
      anggaran.kategori_id,
      anggaran.id,
    ]
  );

  // Hapus rincian lama
  await db.runAsync('DELETE FROM rincian_anggaran WHERE anggaran_id = ?;', anggaran.id);

  // Tambah rincian baru
  for (const item of rincian) {
    await db.runAsync(
      'INSERT INTO rincian_anggaran (anggaran_id, subkategori_id, jumlah) VALUES (?, ?, ?);',
      [anggaran.id, item.subkategori_id, item.jumlah]
    );
  }
};


// =================================================================================
// INISIALISASI DATA DEFAULT (SEEDING)
// =================================================================================

export const inisialisasiDataDefault = async (): Promise<void> => {
  try {
    // 1. Cek apakah kategori sudah ada
    const kategoriAda = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM kategori;');
    if (kategoriAda && kategoriAda.count > 0) {
      console.log('Data default sudah ada, proses seeding dilewati.');
      return;
    }

    console.log('Memulai proses seeding data default...');

    // 2. Buat Kategori dan Subkategori
    const { lastInsertRowId: gajiId } = await tambahSatuKategori({ nama: 'Gaji', tipe: 'pemasukan', ikon: 'cash' });
    const { lastInsertRowId: hadiahId } = await tambahSatuKategori({ nama: 'Hadiah', tipe: 'pemasukan', ikon: 'gift' });

    const { lastInsertRowId: makananId } = await tambahSatuKategori({ nama: 'Makanan & Minuman', tipe: 'pengeluaran', ikon: 'fast-food' });
    await tambahSatuSubkategori({ nama: 'Makan Siang', kategori_id: makananId });
    await tambahSatuSubkategori({ nama: 'Kopi', kategori_id: makananId });

    const { lastInsertRowId: transportId } = await tambahSatuKategori({ nama: 'Transportasi', tipe: 'pengeluaran', ikon: 'train' });
    await tambahSatuSubkategori({ nama: 'Bensin', kategori_id: transportId });
    await tambahSatuSubkategori({ nama: 'Parkir', kategori_id: transportId });
    
    const { lastInsertRowId: belanjaId } = await tambahSatuKategori({ nama: 'Belanja', tipe: 'pengeluaran', ikon: 'cart' });
    await tambahSatuSubkategori({ nama: 'Pakaian', kategori_id: belanjaId });
    await tambahSatuSubkategori({ nama: 'Elektronik', kategori_id: belanjaId });

    // 3. Buat Dompet
    const { lastInsertRowId: dompetTunaiId } = await tambahSatuDompet({ nama: 'Dompet Tunai', saldo: 500000, tipe: 'tunai', ikon: 'wallet' });
    const { lastInsertRowId: rekeningBcaId } = await tambahSatuDompet({ nama: 'Rekening BCA', saldo: 5000000, tipe: 'bank', ikon: 'card' });

    // 4. Buat Transaksi
    // Pemasukan
    await tambahSatuTransaksi({
      id: Date.now() + 1,
      tipe: 'pemasukan',
      jumlah: 5000000,
      keterangan: 'Gaji bulanan',
      tanggal: new Date().toISOString(),
      kategori_id: gajiId,
      subkategori_id: null,
      dompet_id: rekeningBcaId,
      dompet_tujuan_id: null,
      nama_kategori: 'Gaji',
      nama_subkategori: null,
      nama_dompet: 'Rekening BCA',
      nama_dompet_tujuan: null,
    });

    // Pengeluaran
    await tambahSatuTransaksi({
      id: Date.now() + 2,
      tipe: 'pengeluaran',
      jumlah: 25000,
      keterangan: 'Kopi susu',
      tanggal: new Date().toISOString(),
      kategori_id: makananId,
      subkategori_id: (await db.getFirstAsync<Subkategori>('SELECT id FROM subkategori WHERE nama = ? AND kategori_id = ?;', ['Kopi', makananId]))?.id || null,
      dompet_id: dompetTunaiId,
      dompet_tujuan_id: null,
      nama_kategori: 'Makanan & Minuman',
      nama_subkategori: 'Kopi',
      nama_dompet: 'Dompet Tunai',
      nama_dompet_tujuan: null,
    });
    
    await tambahSatuTransaksi({
      id: Date.now() + 3,
      tipe: 'pengeluaran',
      jumlah: 150000,
      keterangan: 'Isi bensin motor',
      tanggal: new Date().toISOString(),
      kategori_id: transportId,
      subkategori_id: (await db.getFirstAsync<Subkategori>('SELECT id FROM subkategori WHERE nama = ? AND kategori_id = ?;', ['Bensin', transportId]))?.id || null,
      dompet_id: dompetTunaiId,
      dompet_tujuan_id: null,
      nama_kategori: 'Transportasi',
      nama_subkategori: 'Bensin',
      nama_dompet: 'Dompet Tunai',
      nama_dompet_tujuan: null,
    });

    // Transfer
    await tambahSatuTransaksi({
      id: Date.now() + 4,
      tipe: 'transfer',
      jumlah: 200000,
      keterangan: 'Tarik tunai dari ATM',
      tanggal: new Date().toISOString(),
      kategori_id: null,
      subkategori_id: null,
      dompet_id: rekeningBcaId,
      dompet_tujuan_id: dompetTunaiId,
      nama_kategori: null,
      nama_subkategori: null,
      nama_dompet: 'Rekening BCA',
      nama_dompet_tujuan: 'Dompet Tunai',
    });

    // Perbarui saldo dompet berdasarkan transaksi
    await perbaruiSaldoDompet(rekeningBcaId, 5000000); // Gaji
    await perbaruiSaldoDompet(dompetTunaiId, -25000); // Kopi
    await perbaruiSaldoDompet(dompetTunaiId, -150000); // Bensin
    await perbaruiSaldoDompet(rekeningBcaId, -200000); // Transfer keluar
    await perbaruiSaldoDompet(dompetTunaiId, 200000); // Transfer masuk


    console.log('Proses seeding data default selesai.');
  } catch (error) {
    console.error('Gagal melakukan seeding data default:', error);
    // Jangan lemparkan error agar aplikasi tetap berjalan meskipun seeding gagal
  }
};

