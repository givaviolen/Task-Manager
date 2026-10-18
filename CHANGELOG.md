# Changelog

Semua perubahan penting pada proyek *Task Manager* dicatat di sini. Format mengacu pada [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/). Setiap versi berhubungan dengan satu iterasi pengembangan. Skenario uji (T1 sampai T25) dijelaskan di `docs/proposal.pdf`, dan prompt yang dipakai ada di `docs/prompts-log.md`.

## [Belum Dirilis]

### Rencana
- Edit tugas (nama, prioritas, deadline).
- Penyaringan dan pencarian tugas; opsi memindahkan tugas selesai ke bawah.
- Pembaruan penanda terlambat otomatis saat tanggal berganti ketika halaman masih terbuka.
- Dialog konfirmasi kustom dengan elemen `<dialog>`.
- Ekspor dan impor data dalam format JSON.
- Pengujian otomatis untuk fungsi pengurutan, tanggal, dan penyimpanan.

### Keterbatasan yang diketahui
- Data hanya tersimpan di `localStorage` pada satu peramban dan satu perangkat, dan dapat dilihat atau diubah lewat DevTools.
- Penanda "terlambat" dihitung saat tampilan digambar ulang, sehingga tidak berubah otomatis melewati tengah malam.
- Deadline yang sudah lewat tetap diterima saat menambah tugas (hanya diberi penanda).
- Tugas yang sudah selesai tetap tampil di posisi prioritasnya.

## [0.3.0] - [isi tanggal] — Iterasi 3: Penyempurnaan

### Ditambahkan
- Pengurutan otomatis: prioritas Tinggi, Sedang, Rendah, lalu deadline terdekat (`compareTasks`).
- Format tanggal Indonesia memakai `Intl.DateTimeFormat('id-ID')`, misalnya "25 Oktober 2026".
- Kotak centang "Selesai": judul tugas dicoret dan status tersimpan di `localStorage`.
- Dialog konfirmasi (`window.confirm`) sebelum tugas dihapus.
- Penanda deadline terlambat: tanggal berwarna merah disertai teks "(terlambat)". Tugas yang sudah selesai tidak ditandai terlambat.

### Diubah
- Urutan tampilan dihitung dari salinan array (`.slice().sort()`) sehingga urutan data asli tidak berubah.
- Parsing tanggal memakai `parseLocalDate` (zona waktu lokal) sebagai ganti `new Date('YYYY-MM-DD')`, untuk menghindari pergeseran satu hari di zona waktu lain, dan menolak tanggal yang tidak valid (misalnya 31 Februari).
- Data dari Iterasi 2 yang belum punya status `done` dianggap belum selesai, tanpa perlu migrasi.

### Diperbaiki
- T6: deadline yang sudah lewat tidak punya penanda.
- T7: tugas tidak berurutan.
- T10: format tanggal tidak ramah pembaca Indonesia.

### Pengujian
- T14 sampai T25 dijalankan dan lolos.

## [0.2.0] - [isi tanggal] — Iterasi 2: Perbaikan Bug dan Keamanan

### Ditambahkan
- Validasi masukan: nama tidak boleh kosong atau hanya spasi, deadline wajib diisi, pesan kesalahan tampil di halaman.
- Penyimpanan data ke `localStorage` (array objek, `JSON.stringify` dan `JSON.parse`) dengan penanganan galat `try/catch`.
- Tombol Hapus pada setiap tugas.
- Penanda prioritas berwarna dan pesan kosong ("Belum ada tugas").

### Diubah
- Penambahan tugas memakai formulir dengan event `submit` (Enter ikut berfungsi) dan `addEventListener`, menggantikan `onclick` di HTML.
- Tampilan digambar ulang dari array `tasks` melalui `renderTasks()` (*single source of truth*).
- Formulir dikosongkan dan fokus kembali ke kolom nama setelah tugas ditambahkan.

### Diperbaiki
- T1, T2: tugas kosong, hanya spasi, atau tanpa deadline dapat ditambahkan.
- T3: formulir tidak ter-reset setelah menambah tugas.
- T4: data hilang saat halaman dimuat ulang.
- T5: tidak ada cara menghapus tugas.

### Keamanan
- T8, T9: celah XSS ditutup dengan mengganti `innerHTML` menjadi `createElement` dan `textContent`.
- Kelas CSS prioritas dibatasi lewat whitelist (`PRIORITY_CLASS`), sehingga data yang dimanipulasi tidak merusak tampilan.

### Pengujian
- T11 sampai T13 dijalankan dan lolos.

## [0.1.0] - [isi tanggal] — Iterasi 1: Versi Awal

### Ditambahkan
- Formulir dengan kolom nama tugas, prioritas (Tinggi, Sedang, Rendah), deadline, dan tombol Tambah.
- Daftar tugas yang tampil di bawah formulir setelah ditambah.
- Gaya dasar (`style.css`).

### Masalah yang diketahui (ditemukan lewat T1 sampai T10)
- Tugas kosong atau tanpa deadline dapat ditambahkan.
- Formulir tidak ter-reset setelah penambahan.
- Data hilang saat halaman dimuat ulang.
- Rentan XSS karena data pengguna disisipkan lewat `innerHTML`.
- Tidak ada fitur hapus, tandai selesai, pengurutan, atau penanda deadline terlambat.
- Tanggal tampil dalam format mentah `YYYY-MM-DD`.
- Celah ini sengaja dipertahankan pada iterasi awal agar dapat diuji dan diperbaiki pada iterasi berikutnya.