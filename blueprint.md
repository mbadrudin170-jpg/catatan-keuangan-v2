# Blueprint Proyek

Dokumen ini berisi daftar fitur yang telah diimplementasikan dan rencana pengembangan selanjutnya.

## Fitur yang Telah Selesai

### 1. Buat Anggaran
- **Deskripsi**: Fungsionalitas untuk membuat anggaran baru dengan dua mode: "flat" dan "persentase".
- **Detail Implementasi**:
    - **Mode Flat**: Pengguna dapat memasukkan jumlah anggaran untuk setiap sub-kategori secara langsung.
    - **Mode Persentase**: Pengguna dapat menentukan total anggaran, lalu mengalokasikan persentase untuk setiap sub-kategori. Nilai Rupiah yang sesuai akan ditampilkan secara dinamis.
    - **Periode**: Anggaran dapat diatur untuk periode bulanan, tahunan, atau sekali.
    - **Penyimpanan**: Anggaran dan rinciannya disimpan ke dalam database SQLite.
- **File Terkait**:
    - `screens/form-anggaran/ScreenFormAnggaran.tsx`
    - `screens/form-anggaran/useFormAnggaran.ts`
    - `screens/form-anggaran/InputFormAnggaran.tsx`
    - `screens/form-anggaran/RincianAnggaran.tsx`
    - `database/operasi.ts`

## Rencana Selanjutnya

### 1. Halaman Detail Anggaran
- **Deskripsi**: Membuat halaman yang menampilkan rincian dari anggaran yang telah dibuat.
- **Tugas**:
    - Menampilkan ringkasan anggaran (total, terpakai, sisa).
    - Menampilkan daftar sub-kategori beserta alokasi dan penggunaannya.
    - Menambahkan tombol untuk mengedit atau menghapus anggaran.

### 2. Fungsionalitas Edit Anggaran
- **Deskripsi**: Memungkinkan pengguna untuk mengubah anggaran yang sudah ada.

### 3. Fungsionalitas Hapus Anggaran
- **Deskripsi**: Memberikan kemampuan untuk menghapus anggaran yang tidak lagi diperlukan.
