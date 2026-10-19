# Task Manager Web App — Tugas I PABWE

Repositori ini dikembangkan untuk memenuhi Tugas I Mata Kuliah **11S3133 Pengembangan Aplikasi Berbasis Web** di Institut Teknologi Del. Proyek ini mengimplementasikan aplikasi *Task Manager* sederhana dengan memanfaatkan AI generatif (Claude) sebagai asisten pemrograman secara iteratif.

## Identitas Pembuat
* **Nama:** Giva Violen Pardede
* **NIM:** 11S24054
* **Program Studi:** S1 Informatika, Institut Teknologi Del

## Deskripsi Program
Aplikasi *Task Manager* berbasis web ini dirancang untuk membantu pengguna mengelola daftar tugas harian, lengkap dengan fitur pengaturan prioritas (Tinggi, Sedang, Rendah), tenggat waktu (*deadline*), penyimpanan lokal (`localStorage`) dengan penanganan galat, penanda otomatis untuk tugas yang terlambat, serta fitur centang selesai dan konfirmasi hapus.

## Fitur Utama
- **Manajemen Tugas:** Tambah, hapus, dan tandai selesai tugas harian.
- **Validasi Input:** Pencegahan input nama tugas kosong atau hanya spasi, serta pembersihan data secara aman.
- **Prioritas & Urutan Otomatis:** Tugas diurutkan secara otomatis berdasarkan tingkat prioritas dan *deadline* terdekat.
- **Format Tanggal Lokal:** Menggunakan format bahasa Indonesia (`Intl.DateTimeFormat`) dengan penanganan zona waktu lokal.
- **Persistensi Data:** Data tersimpan di `localStorage` dengan penanganan galat (*error handling*).
- **Keamanan:** Memitigasi celah keamanan *Cross-Site Scripting* (XSS) dengan menggunakan `textContent` alih-alih `innerHTML`.

## Teknologi yang Digunakan
- HTML5 (Struktur)
- CSS3 (Desain antarmuka)
- JavaScript Vanilla / ES6+ (Logika Pemrograman & DOM Manipulation)

## Cara Menjalankan Proyek
1. Clone repositori:
```bash
   git clone [https://github.com/](https://github.com/)givaviolen/Task-Manager.git
   cd Task-Manager
```
2. Buka `src/index.html` di peramban (Chrome, Firefox, Edge, dll.). Tidak perlu instalasi.

## Struktur Direktori
```
Taks-Manager/
├── README.md
├── CHANGELOG.md
├── src/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
└── docs/
    ├── 11S24054_tugas-1.pdf
    ├── prompts-log.md
    └── screenshots/
```

## Ringkasan Iterasi Pengembangan
| Iterasi | Fokus Utama | Status |
|---|---|---|
| 1 | Kode awal dari prompt sederhana; celah (XSS, validasi, data hilang saat refresh) sengaja dipertahankan untuk diuji | Selesai |
| 2 | Validasi input, reset formulir, penyimpanan `localStorage` dengan penanganan galat, perbaikan XSS (`textContent`), tombol hapus | Selesai |
| 3 | Pengurutan otomatis, format tanggal Indonesia, tandai selesai, konfirmasi hapus, penanda deadline terlambat | Selesai |

## Catatan Penggunaan AI
Aplikasi ini dikembangkan dengan bantuan Claude sebagai asisten pemrograman. Seluruh prompt dicatat di [`docs/prompts-log.md`](docs/prompts-log.md), dan seluruh kode diuji sendiri oleh penulis (skenario uji T1 sampai T25, lihat [`docs/proposal.pdf`](docs/proposal.pdf)).