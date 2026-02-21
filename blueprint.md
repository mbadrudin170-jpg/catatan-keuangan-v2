# Blueprint Proyek

Dokumen ini berisi daftar fitur yang telah diimplementasikan dan rencana pengembangan selanjutnya.

## Fitur yang Telah Selesai

### 1. Buat Anggaran

- **Deskripsi**: Fungsionalitas untuk membuat anggaran baru dengan dua mode: "flat" dan "persentase".
- **Detail Implementasi**:
  - **Mode Flat**: Pengguna dapat memasukkan jumlah anggaran untuk setiap sub-kategori secara langsung.
  - **Mode Persentase**: Pengguna dapat menentukan total anggaran, lalu mengalokasikan persentase untuk setiap sub-kategori.
  - **Periode**: Anggaran dapat diatur untuk berbagai periode (bulanan, tahunan, dll.).
  - **Penyimpanan**: Anggaran dan rinciannya disimpan ke dalam database SQLite.
- **File Terkait**:
  - `screens/form-anggaran/ScreenFormAnggaran.tsx`
  - `screens/form-anggaran/useFormAnggaran.ts`
  - `database/operasi.ts` (fungsi `tambahAnggaranDenganRincian`)

### 2. Halaman Detail dan Edit Anggaran

- **Deskripsi**: Menampilkan rincian dari anggaran yang telah dibuat dan menyediakan fungsionalitas untuk mengubahnya.
- **Detail Implementasi**:
  - Halaman detail menampilkan ringkasan anggaran (total, periode, nama kategori) dan rincian alokasi per sub-kategori.
  - Tombol "Edit" (ikon pensil) pada halaman detail akan mengarahkan pengguna ke formulir anggaran.
  - Formulir anggaran terisi otomatis dengan data yang ada saat dalam mode edit.
  - Pengguna dapat mengubah jumlah total, alokasi rincian, periode, dan tipe anggaran.
- **File Terkait**:
  - `screens/detail-anggaran/ScreenDetailAnggaran.tsx`
  - `app/(detail)/anggaran/[id].tsx`
  - `screens/form-anggaran/useFormAnggaran.ts`
  - `database/operasi.ts` (fungsi `ambilSatuAnggaranDenganRincian` dan `perbaruiAnggaranDenganRincian`)

## Rencana Selanjutnya

### 1. Fungsionalitas Hapus Anggaran

- **Deskripsi**: Memberikan kemampuan untuk menghapus anggaran yang tidak lagi diperlukan dari halaman daftar anggaran atau halaman detail.

### 2. Pelacakan Penggunaan Anggaran

- **Deskripsi**: Mengintegrasikan data transaksi untuk melacak penggunaan anggaran secara _real-time_.
- **Tugas**:
  - Menghitung dan menampilkan jumlah "Terpakai" dan "Sisa" pada halaman detail anggaran berdasarkan transaksi yang relevan.
  - Menampilkan visualisasi (misalnya, _progress bar_) untuk setiap sub-kategori dan total anggaran.
