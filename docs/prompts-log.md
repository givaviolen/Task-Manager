# Log Prompt: Task Manager (Tugas I PABWE)

Dokumen ini mencatat prompt yang saya berikan kepada Claude selama pengembangan aplikasi *Task Manager*, hasil yang diperoleh, dan penilaian kualitas tiap prompt.

- **Alat AI:** Claude (Anthropic), melalui antarmuka chat claude.ai
- **Periode pengerjaan:** [isi tanggal mulai] sampai [isi tanggal selesai]
- **Catatan penulisan:** prompt P1 dan P3 dikutip sesuai teks yang dikirim. Prompt lainnya diringkas. Bukti teks asli ada pada tangkapan layar di `docs/screenshots/` (rujuk nama berkasnya di kolom "Bukti"). Penilaian kualitas adalah penilaian saya sendiri atas prompt saya.

## Ringkasan

| ID | Tahap | Tujuan prompt | Kualitas prompt | Hasil utama | Bukti |
|----|-------|---------------|-----------------|-------------|-------|
| P0 | Perencanaan | Meminta ide program, kerangka proposal, panduan simulasi, struktur repo | Baik | 3 ide program, outline 8 bab, struktur repo, draf README | [isi nama berkas] |
| P1 | Iterasi 1 | Membuat kode awal To-Do List dari prompt sederhana, serta mengkritik prompt itu | Kurang (disengaja, untuk dianalisis) | Kritik prompt, contoh prompt terstruktur, kode awal, panduan uji T1 sampai T10 | [isi nama berkas] |
| P2 | Iterasi 2 | Menambal bug dari hasil uji saya, menambah fitur hapus, meminta teori | Sangat baik | Kode perbaikan, penjelasan `textContent` dan `localStorage` | [isi nama berkas] |
| P3 | Iterasi 3 | Menambah pengurutan, format tanggal, tandai selesai, konfirmasi hapus, penanda terlambat | Sangat baik | Kode Iterasi 3, penjelasan sorting dan `Date`, uji T14 sampai T25 | [isi nama berkas] |
| P4 | Dokumentasi | Draf narasi Bab 1, 2, 7, 8 dan checklist GitHub | Baik | Draf bab dan checklist | [isi nama berkas] |
| P5 | Repositori | Meninjau draf `README.md` | Baik | Daftar koreksi README | [isi nama berkas] |
| P6 | Repositori | Meminta isi `prompts-log.md` dan `CHANGELOG.md` | Cukup | Dokumen ini dan `CHANGELOG.md` | [isi nama berkas] |

## Rincian

### P0: Perencanaan

**Tujuan.** Memahami pedoman tugas (PDF terlampir) dan merencanakan pengerjaan.

**Isi prompt (ringkasan).** Melampirkan pedoman tugas, lalu meminta empat hal berurutan: (1) tiga ide program web sederhana, (2) outline proposal yang memuat bagian analisis prompting, evaluasi kode, bug, perbaikan, dan alasan keputusan, (3) simulasi pemrograman bertahap dengan penjelasan yang bisa diverifikasi, (4) struktur repositori GitHub dan draf README.

**Hasil.** Tiga ide (Task Manager, Kalkulator Keuangan, Quiz App), outline proposal 8 bab, struktur repo, draf README. Saya memilih ide A (Task Manager).

**Evaluasi prompt.**
- Kelebihan: permintaan bernomor dan berurutan, mengaitkan langsung dengan kriteria penilaian.
- Kekurangan: empat permintaan sekaligus, padahal langkah 3 bergantung pada pilihan saya. Saya juga belum menyebut tingkat kemampuan, sehingga AI harus menanyakannya.

---

### P1: Iterasi 1, prompt awal

**Tujuan.** Mendapatkan kode awal sekaligus bahan analisis kualitas prompt.

**Isi prompt (kutipan):**

> Tolong buatkan saya aplikasi To-Do List pakai HTML, CSS, dan JS. Ada input untuk nama tugas, prioritas (tinggi, sedang, rendah), dan deadline. Lalu ada tombol tambah. Setelah ditambah, tugasnya muncul di bawah.

Pesan yang sama juga meminta: (1) kritik atas prompt tersebut beserta versi yang lebih baik, (2) kode dasar dengan celah yang dibiarkan agar bisa saya uji, (3) panduan pengujian.

**Hasil.** Daftar kekurangan prompt, contoh prompt terstruktur, kode `index.html`, `style.css`, `app.js` (Iterasi 1), dan tabel uji T1 sampai T10.

**Evaluasi prompt.** Kekurangan yang diidentifikasi: tidak ada peran dan konteks, aturan validasi, persistensi, batasan teknis, standar keamanan, fitur lanjutan, format keluaran, dan urutan tampilan yang jelas. Catatan kejujuran: celah pada kode Iterasi 1 sengaja dipertahankan atas permintaan saya agar dapat diuji.

**Temuan setelah uji.** Input kosong diterima, form tidak ter-reset, data hilang saat refresh, dan XSS lewat `innerHTML`.

---

### P2: Iterasi 2, perbaikan berdasarkan hasil uji

**Tujuan.** Memperbaiki bug yang saya temukan dan menambah fitur hapus.

**Isi prompt (ringkasan).** Saya melaporkan tiga kelompok temuan (validasi dan UX, persistensi, XSS) lengkap dengan tingkat keparahan dan hipotesis perbaikan masing-masing. Lalu meminta: (1) kode perbaikan HTML, CSS, JS, (2) fitur tombol hapus, (3) penjelasan teori `textContent` dibanding `innerHTML` dan alur `localStorage`.

**Hasil.** Kode Iterasi 2 dengan validasi, reset form, penyimpanan `localStorage` (`try/catch`), whitelist kelas prioritas, `textContent`, dan tombol hapus. Saya juga mendapat uji baru T11 sampai T13.

**Evaluasi prompt.** Prompt ini kuat karena saya membawa bukti (hasil uji), diagnosis, dan hipotesis sendiri, sehingga AI bisa mengevaluasi hipotesis saya, bukan menebak. Dua hal di luar hipotesis saya muncul dari AI: pesan kesalahan di halaman menggantikan `alert`, dan whitelist kelas prioritas.

---

### P3: Iterasi 3, penyempurnaan (prompt terstruktur)

**Tujuan.** Menutup celah T6, T7, T10 dan menambah fitur lanjutan.

**Isi prompt (kutipan, dirapikan):**

> **Peran:** Kamu adalah mentor pemrograman web.
> **Tujuan:** Menyempurnakan aplikasi Task Manager pada Iterasi 3 dengan menambahkan fitur lanjutan dan memperbaiki celah UX (T6, T7, T10).
> **Batasan teknis:** Tetap gunakan HTML, CSS, dan JavaScript vanilla tanpa library eksternal. Lanjutkan dari kode Iterasi 2.
> **Fitur:** (1) Pengurutan: prioritas Tinggi di atas, jika sama urutkan deadline terdekat. (2) Format tanggal Indonesia, misalnya "25 Oktober 2026". (3) Tandai selesai dengan teks dicoret dan status tersimpan di `localStorage`. (4) Konfirmasi hapus dengan `window.confirm`. (5) Penanda visual jika deadline sudah lewat.
> **Format jawaban:** (1) kode HTML, CSS, JS terbaru, (2) penjelasan logika sorting, (3) penjelasan manipulasi `Date` untuk format dan pengecekan deadline, (4) hal yang harus diuji.

**Hasil.** Kode Iterasi 3, penjelasan `compareTasks` dan `.slice().sort()`, penjelasan `parseLocalDate` (menghindari pergeseran zona waktu), `Intl.DateTimeFormat`, `setHours(0, 0, 0, 0)`, serta tabel uji T14 sampai T25.

**Evaluasi prompt.** Prompt terbaik dalam proyek ini: peran, tujuan, batasan, spesifikasi fitur yang terukur, dan format jawaban semuanya jelas. Hasilnya langsung bisa diverifikasi karena setiap fitur punya kriteria yang dapat diuji.

---

### P4: Dokumentasi proposal

**Isi prompt (ringkasan).** Meminta draf narasi akademik Bab 1, 2, 7, 8 (dengan poin wajib: `textContent`, `try/catch`, whitelist, `.slice().sort()`), lalu checklist final GitHub. Bab 3 sampai 6 saya susun sendiri.

**Hasil.** Draf empat bab dan checklist. Saya menyesuaikan draf dengan pengalaman saya sebelum menggabungkannya ke proposal.

**Evaluasi prompt.** Baik karena poin wajib disebut eksplisit dan pembagian kerja jelas (bab mana yang saya tulis sendiri).

---

### P5: Tinjauan README

**Isi prompt (ringkasan).** Menempelkan draf `README.md` dan meminta tinjauan: kelengkapan, kesesuaian dengan proposal, kesiapan push.

**Hasil.** Koreksi untuk format Markdown, NIM, klaim yang terlalu kuat ("aman", "responsif", "validasi tanggal"), dan ketidaksesuaian tabel iterasi dengan proposal.

**Evaluasi prompt.** Baik, karena meminta pemeriksaan konsistensi antara dua dokumen, bukan sekadar penilaian umum.

---

### P6: Dokumen pendukung repositori

**Isi prompt (ringkasan).** Meminta isi `prompts-log.md` dan `CHANGELOG.md`.

**Hasil.** Dokumen ini dan `CHANGELOG.md`.

**Evaluasi prompt.** Cukup. Prompt singkat dan tidak menyebut format atau tingkat detail, jadi AI menyusun isinya dari percakapan. Karena itu bagian bertanda `[isi ...]` harus saya lengkapi dan saya periksa kebenarannya terhadap riwayat chat.

## Perbandingan Kualitas Prompt: P1 dibanding P3

| Unsur prompt | P1 (Iterasi 1) | P3 (Iterasi 3) |
|---|---|---|
| Peran | Tidak ada | Ada (mentor pemrograman web) |
| Tujuan dan konteks | Tidak ada | Ada (menutup T6, T7, T10) |
| Batasan teknis | Sebagian (HTML, CSS, JS) | Ada (vanilla, tanpa library, lanjut dari Iterasi 2) |
| Spesifikasi fitur | Umum | Terperinci dan terukur (5 fitur) |
| Aturan validasi | Tidak ada | Tidak relevan (sudah ditangani di Iterasi 2) |
| Format jawaban | Tidak ada | Ada (4 butir) |
| Permintaan bahan uji | Tidak ada | Ada |

## Pelajaran dari Proses Prompting

1. Prompt yang tidak menyebut validasi, penyimpanan, dan keamanan menghasilkan kode yang berfungsi pada alur normal tetapi rapuh pada kasus tepi.
2. Prompt paling efektif membawa **bukti** (hasil uji) dan **hipotesis** sendiri, bukan hanya meminta "perbaiki".
3. Meminta format jawaban (kode, penjelasan, daftar uji) membuat hasil mudah diverifikasi dan didokumentasikan.
4. AI membantu mempercepat, tetapi pengujian di peramban dan keputusan akhir tetap tanggung jawab saya.