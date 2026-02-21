# Blueprint Proyek

Dokumen ini menguraikan fitur yang sudah diimplementasikan dan rencana pengembangan selanjutnya untuk aplikasi Catatan Keuangan v2.

## Fitur yang Sudah Ada

- **Manajemen Kategori (CRUD):** Pengguna dapat menambah, melihat, mengubah, dan menghapus kategori pemasukan dan pengeluaran.
- **Manajemen Dompet (CRUD):** Pengguna dapat mengelola beberapa dompet, termasuk menambah, melihat, mengubah, dan menghapus.
- **Manajemen Transaksi (CRUD):** Pengguna dapat mencatat transaksi pemasukan dan pengeluaran, serta melihat, mengubah, dan menghapusnya.
- **Manajemen Anggaran (CRUD):**
  - Pengguna dapat melihat, mengubah, dan menghapus anggaran yang sudah ada.
  - **Form Pembuatan Anggaran:** Antarmuka (UI) untuk membuat anggaran baru telah selesai, termasuk pemilihan kategori dan input rincian anggaran dinamis per sub-kategori.
- **Statistik Keuangan:** Tampilan ringkasan statistik dasar (pemasukan, pengeluaran, saldo).
- **Tampilan Detail:**
  - **Detail Dompet:** Menampilkan rincian saldo dan riwayat transaksi per dompet.
  - **Detail Transaksi:** Menampilkan rincian lengkap untuk satu transaksi.
  - **Detail Anggaran:** Menampilkan rincian pagu, pemakaian, dan sisa untuk satu anggaran.

## Rencana Selanjutnya (Prioritas Logika)

- **Implementasi Penyimpanan Anggaran:** **(Prioritas utama saat ini)** Menyelesaikan logika untuk **menyimpan data** dari form anggaran baru (termasuk rincian sub-kategorinya) ke dalam database SQLite.
- **Filter Transaksi:** Menambahkan fungsionalitas untuk memfilter daftar transaksi berdasarkan rentang tanggal, kategori, dan dompet.
- **Pencarian Transaksi:** Menambahkan fitur pencarian untuk memudahkan pengguna menemukan transaksi spesifik.
- **Export Data:** Memungkinkan pengguna untuk mengekspor data keuangan mereka ke format CSV atau PDF.
- **Sinkronisasi Cloud:** Mengintegrasikan aplikasi dengan layanan cloud untuk pencadangan dan sinkronisasi data (misalnya, Google Drive atau Dropbox).
- **Autentikasi Pengguna:** Menambahkan sistem login untuk melindungi data pengguna.
- **Notifikasi Anggaran:** Memberikan notifikasi saat anggaran mendekati batas atau sudah terlampaui.
