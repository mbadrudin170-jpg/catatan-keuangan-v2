
# Struktur Proyek

Berikut adalah struktur direktori dan file dari proyek ini:

```
.
├── app
│   ├── (detail)
│   │   ├── anggaran
│   │   │   └── [id].tsx
│   │   ├── dompet
│   │   │   └── [id].tsx
│   │   ├── _layout.tsx
│   │   └── transaksi
│   │       └── [id].tsx
│   ├── (form)
│   │   ├── form-anggaran.tsx
│   │   ├── form-dompet.tsx
│   │   ├── form-kategori.tsx
│   │   ├── form-transaksi.tsx
│   │   └── _layout.tsx
│   ├── index.tsx
│   ├── _layout.tsx
│   └── (tabs)
│       ├── anggaran.tsx
│       ├── dompet.tsx
│       ├── kategori.tsx
│       ├── _layout.tsx
│       ├── statistik.tsx
│       └── transaksi.tsx
├── app.json
├── assets
│   └── images
│       ├── android-icon-background.png
│       ├── android-icon-foreground.png
│       ├── android-icon-monochrome.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       ├── react-logo.png
│       └── splash-icon.png
├── babel.config.cjs
├── blueprint.md
├── context
│   ├── DompetContext.tsx
│   ├── KategoriContext.tsx
│   └── TransaksiContext.tsx
├── database
│   ├── operasi.ts
│   ├── sqlite.ts
│   └── tipe.ts
├── eslint.config.js
├── eslint.d.ts
├── expo-env.d.ts
├── firebase-debug.log
├── GEMINI.md
├── jest.config.cjs
├── jest.setup.js
├── LINK-GITHUB.md
├── __mocks__
│   ├── @
│   │   └── database
│   │       └── operasi.js
│   └── expo-sqlite.js
├── package.json
├── package-lock.json
├── PEDOMAN_KOLABORASI.md
├── README.md
├── screens
│   ├── anggaran
│   │   ├── dataDummy.ts
│   │   ├── HeaderAnggaran.tsx
│   │   ├── LIstAnggaran.tsx
│   │   ├── ScreenAnggaran.tsx
│   │   └── TombolTambahAnggaran.tsx
│   ├── detail-anggaran
│   │   └── ScreenDetailAnggaran.tsx
│   ├── detail-dompet
│   │   ├── HeaderDetailDompet.tsx
│   │   ├── KontenDetailDompet.tsx
│   │   ├── logikaDetailDompet.tsx
│   │   ├── RiwayatTransaksiPerDompet.tsx
│   │   ├── ScreenDetailDompet.tsx
│   │   ├── StatistikDompet.tsx
│   │   └── TombolHapusDetailDompet.tsx
│   ├── detail-transaksi
│   │   ├── HeaderDetailTransaksi.tsx
│   │   ├── logikaDetailTransaksi.ts
│   │   ├── ScreenDetailTransaksi.test.tsx
│   │   ├── ScreenDetailTransaksi.tsx
│   │   ├── TombolEditDetailTransaksi.tsx
│   │   └── TombolHapusDetailTransaksi.tsx
│   ├── dompet
│   │   ├── DompetScreen.tsx
│   │   ├── HeaderDompet.tsx
│   │   ├── ListDompet.tsx
│   │   ├── logikaDompet.ts
│   │   └── tombol
│   │       └── TombolTambahDompet.tsx
│   ├── form-anggaran
│   │   ├── HeaderFormAnggaran.tsx
│   │   ├── InputFormAnggaran.tsx
│   │   ├── ModalPilihKategori.tsx
│   │   ├── RincianAnggaran.tsx
│   │   ├── ScreenFormAnggaran.tsx
│   │   ├── TombolTipeAnggaran.tsx
│   │   └── useFormAnggaran.ts
│   ├── form-dompet
│   │   ├── HeaderFormDompet.tsx
│   │   ├── InputFormDompet.tsx
│   │   ├── modal
│   │   │   └── ModalTipeDompet.tsx
│   │   ├── ScreenFormDompet.tsx
│   │   └── TombolSimpan.tsx
│   ├── form-kategori
│   │   ├── FormKategoriScreen.tsx
│   │   ├── HeaderFormKategori.tsx
│   │   ├── ListKategori.tsx
│   │   ├── ListSubKategori.tsx
│   │   ├── TombolAksi.tsx
│   │   ├── TombolSimpan.tsx
│   │   ├── TombolTipe.tsx
│   │   └── useFormKategori.ts
│   ├── form-transaksi
│   │   ├── FormTransaksiScreen.tsx
│   │   ├── HeaderFormTransaksi.tsx
│   │   ├── InputFormTransaksi.tsx
│   │   ├── modal
│   │   │   ├── ModalPilihDompet.tsx
│   │   │   └── ModalPilihKategori.tsx
│   │   └── tombol
│   │       ├── TombolSimpanFormTransaksi.tsx
│   │       └── TombolTipeFormTransaksi.tsx
│   ├── kategori
│   │   ├── HeaderKategori.tsx
│   │   ├── KategoriScreen.tsx
│   │   ├── ListKategori.tsx
│   │   ├── LIstSubKategori.tsx
│   │   ├── TombolTambahKategori.tsx
│   │   ├── TombolTipe.tsx
│   │   └── useKategoriScreen.ts
│   ├── statistik
│   │   ├── DonutChart.tsx
│   │   ├── FilterPeriode.tsx
│   │   ├── GrafikBatang.tsx
│   │   ├── HalamanStatistik.tsx
│   │   ├── HeaderStatistik.tsx
│   │   ├── KartuSaldo.tsx
│   │   ├── konstanta.ts
│   │   ├── RingkasanDompet.tsx
│   │   ├── RingkasanKategori.tsx
│   │   ├── RingkasanKeuangan.tsx
│   │   ├── StatistikContext.tsx
│   │   ├── tipe.ts
│   │   ├── TransaksiTerakhir.tsx
│   │   └── util.ts
│   └── transaksi
│       ├── DaftarTransaksi.tsx
│       ├── HeaderTransaksi.tsx
│       ├── ItemTransaksi.tsx
│       ├── KartuTransaksi.tsx
│       └── TombolTambahTransaksi.tsx
├── tsconfig.json
└── utils
    ├── format
    │   ├── FormatAngka.ts
    │   ├── FormatJam.ts
    │   └── FormatTanggal.ts
    ├── formatMataUang.ts
    ├── i18n
    │   └── locales
    └── transaksi
        └── GrupTransaksi.ts
```
