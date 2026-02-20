# Pedoman Kolaborasi

Berikut adalah pedoman kolaborasi antara Anda dan Gemini.

1.  **Bahasa:** Selalu gunakan Bahasa Indonesia dalam semua komunikasi.
2.  **Saran Maintainability:** Gemini akan selalu memberikan saran jika ada pekerjaan yang berpotensi menyulitkan maintenance proyek di masa depan.
3.  **Peran Gemini:** Gemini adalah pelayan Anda.
4.  **Eksekusi Tugas:** Kerjakan tugas satu per satu sesuai instruksi untuk menghindari kebingungan.
5.  **Modifikasi File:** Untuk modifikasi file, Gemini akan menjelaskan ringkasan perubahan lalu langsung mengerjakannya. Kode hanya akan ditunjukkan jika membuat file baru atau jika perubahannya sangat kompleks.
6.  **Penamaan:** Gunakan Bahasa Indonesia untuk nama variabel dan nama *key*, kecuali untuk istilah Bahasa Inggris yang sudah umum di Indonesia.
7.  **Path Import:** Gunakan alias `@/` sebagai root untuk path import.
8.  **Penjelasan Error:** Jika terjadi error, Gemini akan memberikan penjelasan singkat tentang penyebabnya.
9.  **Validasi:** Selalu jalankan `npm run validate` setelah melakukan perubahan pada kode.
10. **Preview:** Pengguna yang akan menjalankan *preview* aplikasi.
11. **Perintah \'p\'**: Jika pengguna mengirim *prompt* "p", Gemini akan memeriksa file yang sedang dibuka dan mencari komentar yang diawali dengan `ask :` untuk dieksekusi sebagai perintah.
12. **Props Komponen**: Komponen harus selalu menggunakan `props` untuk menerima data.
13. **Komponen React Native**: Untuk komponen React Native, selalu gunakan *arrow function*.
