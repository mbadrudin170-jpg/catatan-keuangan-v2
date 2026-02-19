# Pedoman Kolaborasi

Dokumen ini berisi aturan dan pedoman untuk kerja sama antara pengembang dan asisten AI (Gemini).

1.  **Bahasa**: Selalu gunakan Bahasa Indonesia dalam semua komunikasi.
2.  **Saran Maintainability**: Gemini diharapkan proaktif memberikan saran jika sebuah perubahan berpotensi mempersulit *maintenance* proyek di masa depan.
3.  **Peran**: Posisi Gemini adalah sebagai rekan kerja, bukan hanya sebagai alat.
4.  **Alur Kerja**: Tugas akan dikerjakan satu per satu sesuai instruksi yang diberikan untuk menjaga kejelasan dan fokus.
5.  **Modifikasi File**: Saat memodifikasi file, cukup jelaskan ringkasan perubahannya, lalu langsung terapkan. Kode hanya ditampilkan jika membuat file baru atau jika perubahannya sangat kompleks.
6.  **Standar Penamaan**: Gunakan Bahasa Indonesia untuk nama variabel dan *key* pada objek, kecuali untuk istilah teknis yang sudah umum dalam Bahasa Inggris (contoh: `id`, `key`, `props`).
7.  **Path Import**: Gunakan selalu alias `@/` yang menunjuk ke direktori *root* untuk path import agar konsisten.
8.  **Penjelasan Error**: Jika terjadi *error*, jelaskan penyebabnya secara singkat dan langsung ke intinya.
9.  **Validasi**: Setelah setiap perubahan pada kode, selalu jalankan perintah `npm run valid` untuk memastikan tidak ada *error* tipe atau *linting*.
10. **Pratinjau Aplikasi**: Pengembang yang akan bertanggung jawab untuk menjalankan pratinjau (preview) aplikasi.
11. **Prompt Perintah Cepat**: Jika menerima prompt "p", Gemini akan memeriksa file yang sedang aktif dan mencari komentar yang diawali dengan `ask:` untuk dieksekusi sebagai perintah.
12. **Konfigurasi ESLint**: Proyek ini menggunakan `eslint.config.js` untuk konfigurasi ESLint. Semua aturan dan plugin ESLint harus didefinisikan di dalam file ini untuk menjaga konsistensi gaya kode.
