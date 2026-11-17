# Laporan Evaluasi Dokumen dan Aplikasi KemanaYa

Evaluasi teknologi implementasi dokumentasi dan pengujian

Tanggal evaluasi: 27 Oktober 2026  
Versi laporan: 1.1  
Jenis dokumen: Laporan evaluasi teknis  
Objek utama: `docs/Dokumentasi_Teknis_KemanaYa.docx`  
Sumber pembanding: kode frontend, kode backend, konfigurasi, pengujian otomatis, `README.md`, dan `docs/API-Publik.md` pada proyek KemanaYa.

## Ringkasan eksekutif

KemanaYa merupakan aplikasi berbagi tempat dan pemberian rating foto serta tempat. Implementasi aktif menggunakan React, JavaScript JSX, HTML, CSS, Vite, Laravel, Eloquent, dan REST API berformat JSON. SQLite tersedia untuk pengembangan lokal. Panduan deployment menjelaskan penggunaan Laravel di Vercel dengan PostgreSQL di Neon untuk API publik. Kedua lingkungan perlu dijelaskan terpisah agar pembaca tidak menganggap database lokal dan database publik merupakan penyimpanan yang sama.

Dokumen teknis sudah kuat sebagai bahan pembelajaran: membahas struktur komponen, props, callback, state, alur request, autentikasi, rating, profil dinamis, serta pertanyaan dan panduan jawaban mahasiswa. Penjelasan inti tersebut sesuai dengan kode yang diperiksa. Kekurangan terbesarnya adalah pembaruan dokumentasi belum seragam, bukti pengujian tersebar, dan dokumentasi operasional deployment belum sedalam pembahasan komponen frontend.

Aplikasi memiliki fondasi yang layak untuk demonstrasi akademik dan pengembangan lanjutan. Kelayakan produksi belum dapat disimpulkan dari build dan tes yang tersedia saja. Masih diperlukan pengujian browser menyeluruh, pengujian PostgreSQL terisolasi, pengukuran performa, pemulihan backup, dan evaluasi aksesibilitas. Penilaian ini bersifat kualitatif berdasarkan bukti proyek, bukan sertifikasi atau nilai resmi dari pengajar.

Hasil pemeriksaan menunjukkan build frontend berhasil, lima tes frontend lulus, dan sembilan tes backend lulus dengan 72 assertion. Pemeriksaan route mengonfirmasi sembilan endpoint API. Hasil ini mendukung penilaian terhadap skenario yang diuji; pengujian browser menyeluruh dan operasional produksi masih perlu dilengkapi.

Prioritas tindak lanjut adalah menyelaraskan dokumentasi lingkungan lokal dan publik, memastikan konfigurasi pengujian selalu terisolasi, serta membedakan nilai rating pribadi dari skor agregat pada antarmuka. Rincian temuan, sumber bukti, dan kriteria penyelesaian tersedia pada bagian 19.

## Daftar isi

1. Pendahuluan dan ruang lingkup
2. Metode evaluasi dan sumber bukti
3. Gambaran aplikasi dan batas fitur
4. Teknologi dan perangkat yang digunakan
5. Arsitektur dan alur kerja
6. Struktur kode dan komponen
7. Database dan kamus data
8. Dokumentasi REST API
9. Aturan rating dan rekomendasi
10. Profil dinamis dan pembaruan otomatis
11. Evaluasi keamanan dan validasi
12. Evaluasi antarmuka dan aksesibilitas
13. Evaluasi performa dan pemeliharaan
14. Evaluasi kualitas dokumen sumber
15. Hasil pengujian dan cakupan verifikasi
16. Panduan instalasi dan konfigurasi
17. Panduan pengguna
18. Dokumentasi operasional dan deployment
19. Daftar temuan dan rencana perbaikan
20. Paket bukti dokumentasi
21. Panduan presentasi dan tanya jawab
22. Kesimpulan dan kriteria penerimaan
23. Referensi internal dan glosarium

## 1 Pendahuluan dan ruang lingkup

### 1.1 Latar belakang

Sebuah aplikasi perlu dapat dijelaskan melalui dokumentasi yang sesuai dengan kode. Nama framework dalam dependency, fitur yang hanya berupa preferensi, dan data contoh mudah menimbulkan salah pengertian jika tidak dibedakan dari kemampuan yang benar-benar dijalankan. Pada KemanaYa, hal ini terutama berkaitan dengan paket Ionic yang masih tercantum, penggantian UI ke HTML/CSS, penggunaan URL foto, profil berbasis kontribusi, serta perbedaan database lokal dan deployment.

### 1.2 Tujuan

Evaluasi bertujuan menjelaskan teknologi yang digunakan dan tanggung jawabnya, memeriksa kesesuaian dokumen dengan implementasi, menilai kelengkapan dokumentasi, mencatat bukti hasil pengujian, serta menentukan pekerjaan lanjutan yang dapat diverifikasi. Laporan juga menyediakan materi yang dapat dipakai untuk menjelaskan proyek saat presentasi.

### 1.3 Lingkup pemeriksaan

Pemeriksaan mencakup dokumen Word, README, panduan API publik, manifest dependency, konfigurasi Vite/Ionic/Capacitor, halaman dan komponen React, lapisan fetch, route Laravel, middleware token, controller, model, service profil, migrasi database, konfigurasi CORS, entry point Vercel, dan source pengujian.

Pemeriksaan tidak mencakup audit akun Vercel/Neon, penagihan layanan, pemeriksaan rahasia environment, pengujian penetrasi, pengujian beban produksi, atau pengujian perangkat Android/iOS. Keberadaan panduan API publik membuktikan adanya dokumentasi deployment, tetapi tidak dengan sendirinya membuktikan uptime atau konfigurasi cloud saat evaluasi. Tidak dilakukan penulisan ke database publik.

### 1.4 Keluaran evaluasi

Keluaran utama adalah laporan evaluasi beserta dokumentasi teknis dan operasional yang terintegrasi. Setiap temuan dilengkapi sumber atau penjelasan dasar penilaiannya. Tindakan perbaikan kode disajikan sebagai rekomendasi dengan kriteria penyelesaian yang dapat diperiksa.

## 2 Metode evaluasi dan sumber bukti

### 2.1 Metode

Evaluasi dilakukan dengan membaca teks dokumen Word, membandingkannya dengan file implementasi, menelusuri alur data, dan menjalankan pemeriksaan build serta tes otomatis. Kesesuaian dinilai berdasarkan hubungan klaim dengan fungsi atau konfigurasi yang dapat ditunjukkan. Pemeriksaan isi Word menggunakan struktur teks OOXML; tata letak visual dokumen Word sumber tidak dinilai melalui render halaman.

### 2.2 Tingkat bukti

| Jenis bukti | Makna | Contoh |
| --- | --- | --- |
| Implementasi diperiksa | Perilaku ditemukan dalam source | Middleware memeriksa hash token dan kedaluwarsa |
| Pemeriksaan dijalankan | Perintah benar-benar dieksekusi saat evaluasi | Build Vite dan tes Vitest |
| Klaim dokumentasi | Tercatat pada dokumen proyek | Backend publik menggunakan Vercel dan Neon |
| Rekomendasi | Perbaikan yang belum diterapkan dalam evaluasi | Pagination dan pengujian browser |
| Belum diverifikasi | Memerlukan bukti tambahan | Uptime, performa nyata, aksesibilitas visual |

### 2.3 Sumber utama

| Kode | Sumber | Kegunaan |
| --- | --- | --- |
| S01 | `docs/Dokumentasi_Teknis_KemanaYa.docx` | Objek evaluasi materi teknis dan pembelajaran |
| S02 | `README.md` | Setup, alur, status fitur, riwayat pemeriksaan |
| S03 | `docs/API-Publik.md` | Kontrak penggunaan API publik dan deployment |
| S04 | `package.json`, `package-lock.json`, `backend/composer.json` | Identifikasi dependency dan alat build |
| S05 | `src/App.jsx`, `src/main.jsx`, `src/api.js` | Entry point, navigasi, sesi, dan request |
| S06 | `src/pages/`, `src/components/`, `src/styles.css` | Implementasi antarmuka dan perilaku fitur |
| S07 | `backend/routes/api.php`, `backend/bootstrap/app.php` | Routing, pembatasan request, respons error |
| S08 | `backend/app/Http/Controllers/`, `backend/app/Http/Middleware/ApiToken.php` | Validasi, autentikasi, dan operasi API |
| S09 | `backend/app/Services/ProfileSummary.php` | Aturan profil, level, badge, dan aktivitas |
| S10 | `backend/database/migrations/`, `backend/app/Models/` | Struktur dan integritas data |
| S11 | `src/**/*.test.*`, `backend/tests/` | Bukti cakupan tes yang tersedia |
| S12 | `backend/vercel.json`, `backend/api/index.php`, `backend/config/database.php` | Konfigurasi deployment dan pilihan database |

Semua path relatif terhadap root proyek `D:/ionic/Tugas_1`. Referensi internal memungkinkan pemeriksa menelusuri kesimpulan tanpa memerlukan akses rahasia akun cloud.

## 3 Gambaran aplikasi dan batas fitur

### 3.1 Tujuan aplikasi

KemanaYa membantu pengguna membagikan tempat menarik, melihat tempat dari komunitas, menilai foto dan kualitas tempat secara terpisah, serta melihat daftar tempat dengan skor tinggi. Profil mencerminkan kontribusi akun melalui statistik, level, badge, challenge, dan aktivitas.

### 3.2 Pengguna dan hak akses

API menyediakan pembacaan daftar dan detail tempat tanpa autentikasi. Pembuatan tempat, pemberian rating, serta pembacaan dan perubahan profil sendiri memerlukan token. Antarmuka utama aplikasi saat ini mengarahkan pengguna melalui login/register terlebih dahulu; API publik dan alur UI memiliki cakupan akses yang berbeda.

Tidak ditemukan antarmuka administrator, moderasi konten, manajemen peran, atau endpoint penghapusan akun pada route aplikasi yang diperiksa.

### 3.3 Matriks status fitur

| Fitur | Status implementasi | Batas yang perlu dijelaskan |
| --- | --- | --- |
| Register dan login | Ada | Password dan email divalidasi backend |
| Pemulihan sesi | Ada | Mengandalkan token sesi tab dan `GET /me` |
| Explore Feed dan detail | Ada | Daftar belum dipaginasi |
| Add Spot | Ada | Foto berupa URL, tanpa unggah file |
| Rating foto dan tempat | Ada | Satu baris per akun per tempat |
| Recomend | Ada | Filter skor minimal 4.5 pada frontend |
| Edit profil | Ada | Hanya field yang diizinkan pada `/me` |
| Statistik, badge, level | Ada | Dihitung dari kontribusi database |
| Challenge tujuh hari | Ada | Memakai waktu pembaruan rating lengkap |
| Pembaruan profil | Ada | Polling REST 15 detik saat memenuhi kondisi |
| Notifikasi dashboard | Ada secara lokal | Hilang ketika state terkait dilepas |
| Preferensi settings | Ada sebagai data | Push, profil publik, dan compact belum memiliki efek layanan |
| Pencarian dan filter pengguna | Belum ada | Kategori pada form bukan fitur pencarian |
| Edit dan hapus tempat | Belum ada | Belum tersedia alur koreksi konten |
| Ulasan teks dan peta | Belum ada | Lokasi masih berupa teks |
| Firebase | Tidak diterapkan | Tidak digunakan sebagai database atau penyimpanan foto |
| Aplikasi native | Belum dibuktikan | Konfigurasi Capacitor tersedia; folder platform native belum tersedia |

## 4 Teknologi dan perangkat yang digunakan

### 4.1 Frontend

| Teknologi | Bukti versi atau konfigurasi | Fungsi dan evaluasi |
| --- | --- | --- |
| React dan React DOM | Deklarasi `^19.3.0` pada manifest | Membentuk komponen, mengelola state, dan memperbarui DOM |
| JavaScript JSX | File `.jsx` dan `.js` pada `src/` | Bahasa implementasi UI dan interaksi |
| HTML semantik | `header`, `nav`, `main`, `section`, `button`, `input` | Struktur antarmuka aktif |
| CSS lokal | `src/styles.css` | Layout, warna, responsivitas, focus, dan kontrol |
| Vite | Build teramati v8.3.4 | Server development dan bundling produksi |
| Plugin React Vite | Deklarasi `^6.1.2` | Integrasi transformasi React pada Vite |
| Fetch API | `src/api.js` | Komunikasi HTTP tanpa Axios |
| sessionStorage | Key `kemanaya_token` | Menyimpan token frontend dalam sesi tab |
| SVG inline | `src/icons.js`, `Icon.jsx` | Ikon lokal mengikuti `currentColor` |
| Vitest dan jsdom | Vitest teramati v4.0.18 | Tes request dan interaksi profil dalam DOM simulasi |

Versi berawalan `^` atau `~` adalah rentang dependency, bukan jaminan versi persis yang terpasang. Untuk reproduksi, gunakan lockfile dan catat keluaran alat pada mesin pengujian. Node yang teramati saat evaluasi adalah v24.21.0.

### 4.2 Backend

| Teknologi | Bukti | Fungsi |
| --- | --- | --- |
| PHP | Manifest mensyaratkan `^8.2`; runtime teramati 8.3.33 | Menjalankan Laravel dan proses API |
| Laravel | Manifest `laravel/framework: ^12.0` | Routing, validasi, middleware, respons, dan integrasi database |
| Eloquent ORM | Model User, Place, Rating | Mengakses tabel dan relasi melalui objek PHP |
| Composer | `composer.json` dan `composer.lock` | Pengelolaan dependency backend |
| PHPUnit | Manifest `^11.5.3` | Pengujian unit dan feature backend |
| Laravel Pint | Dependency development | Perapian gaya kode PHP; bukan pengganti tes fitur |
| Token acak khusus aplikasi | `AccountController` dan `ApiToken` | Autentikasi Bearer menggunakan hash SHA-256 |

Token aplikasi merupakan opaque token, bukan JWT dan bukan implementasi Sanctum. Penggunaan API Laravel tidak otomatis berarti aplikasi memakai salah satu paket autentikasi tersebut.

### 4.3 Penyimpanan dan deployment

SQLite dipakai sebagai pilihan pengembangan lokal dan pengujian terisolasi. Database berada pada file lokal ketika memakai konfigurasi development. PostgreSQL di Neon dicatat dalam panduan API publik sebagai database deployment. Vercel menjalankan entry point PHP dari `backend/api/index.php` berdasarkan `backend/vercel.json`.

Folder sementara runtime cloud dipakai untuk cache framework, view, session, dan log pada entry point tersebut. Folder sementara tidak boleh dianggap sebagai penyimpanan permanen data aplikasi. Kredensial database dan `APP_KEY` merupakan konfigurasi backend, tidak boleh dimasukkan ke variabel `VITE_*`.

### 4.4 Ionic dan Capacitor

Paket `@ionic/react`, `@ionic/react-router`, dan `ionicons` masih tercantum dalam dependency. Akan tetapi, source UI aktif menggunakan komponen buatan sendiri dan elemen HTML. Karena itu penyebutan yang paling tepat adalah aplikasi React/Vite yang masih memiliki konfigurasi dan dependency peninggalan Ionic, dengan konfigurasi Capacitor yang belum membuktikan tersedianya aplikasi native.

`capacitor.config.js` menggunakan `webDir: 'www'`. Identitas `io.ionic.starter` masih merupakan identitas awal yang perlu diganti sebelum distribusi native. React Router juga tercantum sebagai dependency, tetapi navigasi utama aktif menggunakan state `page`.

### 4.5 Alat dokumentasi dan pengujian manual

Markdown digunakan untuk README dan panduan API; Word digunakan untuk modul teknis mahasiswa. Postman, curl, dan browser Network dapat dipakai untuk merekam request/response. Ketersediaan Postman CLI pada perangkat tidak sama dengan bukti bahwa collection Postman sudah dibuat atau dijalankan. Evaluasi ini tidak mengklaim hasil Postman yang belum dieksekusi.

## 5 Arsitektur dan alur kerja

### 5.1 Pembagian tanggung jawab

Frontend menyajikan tampilan dan menerima input. `src/api.js` membentuk request, memasang header token, membaca respons JSON, dan memusatkan penanganan error. Laravel menentukan endpoint, memeriksa autentikasi dan validasi, menjalankan aturan bisnis, serta mengakses database. Database menyimpan akun, tempat, rating, dan token yang sudah di-hash.

```text
Pengguna
  -> halaman dan komponen React
  -> src/api.js dengan fetch dan Bearer token bila ada
  -> HTTP request JSON
  -> routes/api.php
  -> middleware token dan throttle sesuai route
  -> controller -> model atau ProfileSummary
  -> database lokal SQLite atau database deployment PostgreSQL
  -> respons JSON -> state React -> tampilan terbaru
```

### 5.2 Alur register dan login

LoginPage mengirim data ke endpoint register atau login. Register memvalidasi nama, email unik, password, dan kota opsional, lalu membuat akun. Password di-hash melalui cast model User. Login memeriksa password menggunakan `Hash::check`. Server membuat token dari `random_bytes(32)` lalu mengubahnya menjadi string hex. Hash SHA-256 token dan waktu kedaluwarsa disimpan di tabel `api_tokens`; token mentah dikirim ke klien.

App menyimpan token dan pengguna, lalu mengubah halaman ke dashboard. Pemulihan sesi memanggil `/me`. Saat respons 401 diterima, lapisan API menghapus token dan memancarkan event yang mengembalikan App ke login.

### 5.3 Alur penambahan tempat

Input form memperbarui state `newSpot`. Tombol Publish memanggil `publishSpot`. Setelah pemeriksaan field kosong pada frontend, request POST dikirim dengan token. Middleware menentukan pengguna yang masuk. Controller memvalidasi field, menetapkan `user_id` dari identitas tersebut, menyimpan Place, dan mengembalikan status 201. Frontend menambahkan tempat hasil respons ke feed, memilih tempat baru, membuat notifikasi lokal, dan mereset form.

### 5.4 Alur rating

RatingPicker menjalankan callback dengan nilai 1 sampai 5. Halaman mengirim salah satu atau kedua dimensi ke endpoint rating. Backend melakukan upsert berdasarkan pasangan pengguna dan tempat. Respons membawa skor agregat terbaru; frontend memperbarui feed dan detail. Pemeriksaan rekomendasi dilakukan lagi berdasarkan skor terbaru.

### 5.5 Alur logout

Pengguna membuka Profile, masuk Settings, lalu memilih Keluar akun. Frontend memanggil logout server. Server menghapus token yang dipakai request tersebut. Setelah berhasil, frontend menghapus sesi dan kembali ke login. Logout hanya mencabut token aktif; token dari login lain tetap berlaku sampai dicabut atau kedaluwarsa.

## 6 Struktur kode dan komponen

### 6.1 Peta file

| File atau folder | Tanggung jawab | Catatan evaluasi |
| --- | --- | --- |
| `src/main.jsx` | Memasang aplikasi React | Entry point frontend |
| `src/App.jsx` | Sesi dan pemilihan halaman | Navigasi belum berbasis URL |
| `src/api.js` | HTTP, JSON, token, error | Kontrak response dipusatkan |
| `src/pages/LoginPage.jsx` | Form autentikasi | Menggunakan callback ke App |
| `src/pages/DashboardPage.jsx` | Feed, Add Spot, detail, rating | Tanggung jawab cukup banyak dalam satu file |
| `src/pages/ProfilePage.jsx` | Profil, edit, settings, polling | Memiliki cleanup dan jeda saat edit |
| `src/components/` | Komponen yang dipakai ulang | Pemisahan tampilan dan proses cukup jelas |
| `src/data/spots.js` | Kategori dan referensi contoh | Feed aktif berasal dari API |
| `backend/routes/api.php` | Kontrak route | Sembilan endpoint API |
| `backend/app/Http/Controllers/` | Operasi akun dan tempat | Validasi berada pada controller |
| `backend/app/Services/ProfileSummary.php` | Ringkasan kontribusi | Aturan bisnis dapat ditelusuri terpisah |
| `backend/database/migrations/` | Skema database | Constraint membantu integritas rating |
| `www/` | Hasil build | Bukan lokasi sumber yang diedit |

### 6.2 Komponen yang dipakai ulang

| Komponen | Input utama | Fungsi |
| --- | --- | --- |
| Button | children, className, disabled, onClick, type | Tombol bersama dengan penerusan atribut |
| Icon | src dan className | SVG dekoratif |
| FormField | label, icon, children | Label dan kontrol input |
| Tag | children dan className | Chip kategori atau status |
| StatusMessage | children, className, role | Loading, error, kosong, dan pesan lain |
| Header | title serta callback aksi | Judul dan tombol halaman |
| SpotCard | spot, worthScore, isWorth, onOpen | Kartu feed dan pembuka detail |
| RecommendationCard | spot, score, onOpen | Ringkasan rekomendasi |
| SelectedSpotCard | spot | Informasi tempat yang dipilih |
| NotificationPanel | notifications dan onClose | Notifikasi lokal |
| ScoreGrid | spot dan worthScore | Skor Worth, Foto, Tempat |
| RatingPicker | label, value, onPick, disabled | Pilihan nilai 1 sampai 5 |

### 6.3 Pola pemrograman React

Props mengalir dari induk ke anak, sedangkan callback membawa interaksi kembali ke induk. Controlled input mengikat nilai form ke state dan memperbaruinya melalui `onChange`. Spread object mempertahankan field lain ketika satu field berubah. Daftar kartu menggunakan ID tempat sebagai key.

`useEffect` dipakai untuk efek samping seperti mengambil data dan memasang listener. `useMemo` menghitung daftar rekomendasi dari daftar tempat. `useRef` pada dashboard berfungsi sebagai pengunci request agar klik berulang tidak memulai operasi yang bertumpuk sebelum render berikutnya.

### 6.4 Evaluasi struktur

Komponen dasar sudah terpisah dan digunakan oleh halaman nyata. Struktur ini lebih mudah dipahami dibanding pengulangan markup pada setiap halaman. Pengembangan berikutnya dapat memisahkan logika feed, rating, dan penambahan tempat ke hook atau modul tersendiri jika ukuran DashboardPage terus bertambah. Pemisahan tersebut sebaiknya mengikuti kebutuhan pengembangan, bukan sekadar menambah jumlah file.

## 7 Database dan kamus data

### 7.1 Relasi utama

```text
users 1 ---- banyak places
users 1 ---- banyak ratings
places 1 --- banyak ratings
users 1 ---- banyak api_tokens

ratings memiliki pasangan unik user_id dan place_id
```

Foreign key pada tabel domain menggunakan penghapusan berantai. Artinya penghapusan user atau place pada tingkat database dapat menghapus data terkait. Walaupun endpoint hapus belum tersedia, dampak ini perlu dipahami sebelum membuat fitur administrasi.

### 7.2 Tabel users

| Field | Fungsi | Batas penting |
| --- | --- | --- |
| id | Identitas akun | Dipakai relasi dan autentikasi |
| name | Nama tampilan | Register dan update maksimal 100 karakter |
| email | Identitas login | Unik, format email, maksimal 255 karakter |
| password | Hash password | Input register 8 sampai 128 karakter |
| profile | JSON profil | city, title, category, challenge |
| settings | JSON preferensi | pushRecomend, publicProfile, compactFeed |
| timestamps dan field bawaan | Metadata Laravel | Bukan bukti fitur verifikasi email aktif |

### 7.3 Tabel places

| Field | Tipe konseptual | Fungsi |
| --- | --- | --- |
| id | Integer | Identitas tempat |
| user_id | Foreign key | Pemilik berdasarkan token |
| name | String | Nama tempat, maksimal input 255 karakter |
| location | String | Lokasi teks, maksimal input 255 karakter |
| category | String | Salah satu kategori yang ditentukan backend |
| description | Text | Deskripsi maksimal input 5000 karakter |
| image | Text | URL HTTP/HTTPS, maksimal input 2048 karakter |
| tags | JSON | Tag awal New Spot dan Komunitas |
| created_at, updated_at | Timestamp | Waktu pembuatan dan pembaruan |

Skor agregat tidak disimpan sebagai kolom permanen places pada migrasi domain yang diperiksa. Nilai tersebut dihitung dari ratings ketika resource API dibentuk.

### 7.4 Tabel ratings

| Field | Struktur | Fungsi |
| --- | --- | --- |
| id | Identitas baris | Primary key |
| user_id | Foreign key | Akun pemberi nilai |
| place_id | Foreign key | Tempat yang dinilai |
| photoScore | Decimal 2,1 nullable | Nilai foto |
| placeScore | Decimal 2,1 nullable | Nilai tempat |
| created_at, updated_at | Timestamp | Dasar aktivitas dan challenge |
| user_id + place_id | Unique constraint | Satu baris rating per akun per tempat |

API menerima nilai numerik 1 sampai 5, termasuk desimal yang lolos aturan numeric/between. UI hanya menyediakan bilangan bulat 1 sampai 5. Perbedaan domain input ini sebaiknya diputuskan secara eksplisit: mendukung nilai desimal dengan aturan presisi yang jelas, atau membatasi API menjadi integer agar sama dengan UI.

### 7.5 Tabel api_tokens

Tabel memuat ID, user_id, hash sepanjang 64 karakter yang unik, dan expires_at. Token berlaku tujuh hari sejak dibuat. Tabel menyimpan hash, bukan token mentah. Migrasi tidak menambahkan created_at atau updated_at pada tabel token tersebut. Tabel session/cache/jobs bawaan Laravel dapat tersedia tetapi tidak otomatis menunjukkan adanya fitur aplikasi yang memakai seluruh tabel tersebut.

## 8 Dokumentasi REST API

### 8.1 Alamat dan header

Alamat lokal: `http://127.0.0.1:8000/api`. Alamat publik yang dicatat pada panduan: `https://kemanaya-api.vercel.app/api`. Status layanan publik tidak diuji sebagai bagian hasil lokal laporan ini.

Gunakan `Accept: application/json`. Untuk body JSON tambahkan `Content-Type: application/json`. Endpoint terlindungi memerlukan `Authorization: Bearer <token>`. Jangan menyertakan token asli dalam laporan atau tangkapan layar.

### 8.2 Daftar endpoint

| Metode | Path setelah base URL | Akses | Input utama | Sukses |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Publik | name, email, password, city opsional | 201 |
| POST | `/auth/login` | Publik | email, password | 200 |
| POST | `/auth/logout` | Token | Tidak perlu body | 200 |
| GET | `/me` | Token | Tidak ada | 200 |
| PATCH | `/me` | Token | Field profil/settings yang diubah | 200 |
| GET | `/places` | Publik | Tidak ada parameter terimplementasi | 200 |
| GET | `/places/{id}` | Publik | ID numerik | 200 |
| POST | `/places` | Token | name, location, category, description, image | 201 |
| PUT | `/places/{id}/rating` | Token | photoScore dan/atau placeScore | 200 |

### 8.3 Contoh request

Contoh berikut merupakan data ilustratif untuk pengujian lokal, bukan data akun nyata.

```json
{
  "name": "Pengguna Uji",
  "email": "penguji@example.com",
  "password": "ganti-dengan-password-uji",
  "city": "Bandung"
}
```

Body pembuatan tempat:

```json
{
  "name": "Kafe Uji",
  "location": "Bandung",
  "category": "Kafe, hidden gem, low budget",
  "description": "Data pengujian lokal untuk laporan.",
  "image": "https://example.com/foto-uji.jpg"
}
```

Alamat `example.com` adalah placeholder. Contoh ini menjelaskan format URL yang valid, bukan menjamin file gambar tersedia. Untuk demonstrasi tampilan, gunakan URL gambar uji yang benar-benar dapat diakses.

```json
{ "photoScore": 5, "placeScore": 4 }
```

```json
{ "name": "Nama Baru", "settings": { "compactFeed": true } }
```

### 8.4 Bentuk respons

Daftar memakai `{"data":[...]}`. Detail dan perubahan tempat memakai `{"data":{...}}`. Register/login memakai data berisi token dan user. Profil menyertakan identitas, field profil, settings, stats, level, challengeProgress, badges, dan activities.

```json
{
  "data": null,
  "message": "Periksa kembali data yang diisi.",
  "errors": { "name": ["The name field is required."] }
}
```

Contoh di atas menggambarkan error validasi. Pesan per field dapat berasal dari bahasa bawaan validator Laravel, sedangkan pesan umum API berbahasa Indonesia. Konsistensi bahasa masih dapat diperbaiki.

### 8.5 Status dan pembatasan request

| Status | Arti pada aplikasi |
| --- | --- |
| 200 | Pembacaan atau perubahan berhasil |
| 201 | Akun atau tempat berhasil dibuat |
| 401 | Token tidak ada, tidak valid, atau kedaluwarsa |
| 403 | Pesan disiapkan untuk akses ditolak; bukan bukti adanya sistem peran |
| 404 | Data atau endpoint tidak ditemukan |
| 422 | Input tidak memenuhi validasi, termasuk login gagal |
| 429 | Pembatasan request tercapai |
| 500 | Gangguan internal dengan pesan umum |

Register/login berada pada grup throttle 10 request per menit. Endpoint terlindungi berada pada grup throttle 120 request per menit. Kedua GET tempat publik berada di luar grup throttle eksplisit pada `routes/api.php`. Perlindungan tambahan platform belum diverifikasi; jangan menganggap semua endpoint otomatis memiliki batas yang sama.

### 8.6 Kekurangan dokumentasi API

Kontrak masih disajikan sebagai tabel dan contoh, belum tersedia spesifikasi OpenAPI yang ditemukan dalam berkas utama. Contoh respons perlu diperbarui setelah profil dinamis ditambahkan. Pagination, filter, sorting, dan versi API belum didefinisikan sebagai kontrak yang diterapkan.

## 9 Aturan rating dan rekomendasi

### 9.1 Perhitungan aktual

Backend menghitung rata-rata `photoScore`, membulatkannya menjadi satu desimal, lalu melakukan langkah yang sama untuk `placeScore`. Worth score adalah rata-rata kedua hasil yang sudah dibulatkan tersebut, kemudian dibulatkan lagi menjadi satu desimal. Penjelasan ini perlu dipertahankan agar pembaca memahami adanya pembulatan pada dua tahap.

```text
F = round(rata-rata suara foto yang terisi, 1)
T = round(rata-rata suara tempat yang terisi, 1)
W = round((F + T) / 2, 1)
Recomend jika W >= 4.5
```

Nilai null tidak ikut rata-rata dimensi tersebut. Jika belum ada suara sama sekali pada satu dimensi, dimensi ditampilkan sebagai nol. `ratingCount` menghitung baris akun yang memberi minimal satu dimensi, bukan jumlah seluruh klik dan bukan jumlah suara lengkap.

### 9.2 Contoh

| Kondisi | Foto | Tempat | Worth | Recomend |
| --- | --- | --- | --- | --- |
| Belum ada rating | 0 | 0 | 0 | Tidak |
| Satu akun foto 5 saja | 5 | 0 | 2.5 | Tidak |
| A foto 5/tempat 4; B foto 3/tempat 5 | 4 | 4.5 | 4.3 | Tidak |
| Dua dimensi sama-sama 4.5 | 4.5 | 4.5 | 4.5 | Ya |
| Satu akun foto 5/tempat 5 | 5 | 5 | 5 | Ya |

### 9.3 Evaluasi kualitas rekomendasi

Aturan mudah dijelaskan dan sesuai kebutuhan demonstrasi. Namun belum ada batas minimal pemberi rating, sehingga satu akun dapat membuat tempat masuk rekomendasi dengan nilai sempurna. Tidak ditemukan larangan pemilik menilai tempat sendiri. Identitas kunjungan fisik juga tidak diverifikasi. Faktor tersebut merupakan keterbatasan kepercayaan skor, bukan bukti bahwa rata-rata dihitung salah.

Rekomendasi berikutnya adalah menentukan kebijakan jumlah minimum penilai, penilaian oleh pemilik, dan penanganan akun palsu. Perubahan aturan perlu disertai contoh perhitungan dan tes regresi. Frontend juga menghitung Worth dari dua skor, sehingga aturan berpotensi berbeda saat backend berubah; lebih baik satu kontrak nilai server menjadi acuan resmi.

## 10 Profil dinamis dan pembaruan otomatis

### 10.1 Aturan profil

| Elemen | Aturan |
| --- | --- |
| Ditemukan | Jumlah places milik akun |
| Dirating | Jumlah spot berbeda yang memiliki rating akun |
| Local Guide | Minimal satu tempat dibagikan |
| Photo Scout | Minimal lima spot memiliki nilai foto |
| Trusted Rater | Minimal lima spot memiliki dua dimensi rating |
| Level | `1 + intdiv(jumlah upload + jumlah rating lengkap, 5)` |
| Challenge | Maksimal tiga rating lengkap yang updated_at masih dalam tujuh hari terakhir |
| Aktivitas | Maksimal sepuluh kontribusi terbaru gabungan tempat dan rating |

Akun baru mulai dari level 1 dengan statistik nol, tanpa badge, tanpa aktivitas, dan challenge 0/3. Data dihitung dari akun yang terautentikasi, bukan angka contoh yang dapat diedit melalui PATCH profil.

### 10.2 Contoh perhitungan

Akun dengan dua upload, tiga spot dinilai lengkap, dan dua spot dinilai foto saja memiliki Ditemukan 2, Dirating 5, dan level 2. Local Guide dan Photo Scout terpenuhi, sedangkan Trusted Rater belum. Challenge menjadi 3/3 hanya jika tiga rating lengkap tersebut terakhir diperbarui dalam tujuh hari terakhir.

Jika seluruh rating lengkap terakhir diperbarui delapan hari lalu, challenge menjadi nol. Badge dan level tidak otomatis turun karena aturan keduanya tidak memakai batas tujuh hari. Riwayat rating adalah keadaan terakhir per tempat, bukan arsip setiap perubahan.

### 10.3 Polling

ProfilePage memuat data saat dibuka, setiap 15 detik saat tab terlihat, dan ketika fokus atau visibility kembali. Request dijaga agar tidak bertumpuk. Polling berhenti selama edit atau simpan, dan cleanup membatalkan fetch serta menghapus timer/listener saat effect berakhir.

Ini pembaruan berkala melalui REST. Data tidak dijamin muncul seketika seperti pesan push. Interval 15 detik berarti sekitar empat request per menit per profil yang terus terlihat, di luar request saat fokus dan pembukaan halaman. Angka tersebut merupakan estimasi dari interval kode, bukan hasil uji beban.

### 10.4 Evaluasi aturan challenge

Mengubah rating lama memperbarui updated_at, sehingga spot yang sama dapat kembali masuk challenge tujuh hari. Perilaku ini sesuai implementasi yang dijelaskan dokumen, tetapi perlu dipastikan sesuai tujuan produk. Jika target sebenarnya adalah menilai tempat baru, diperlukan field atau log lain untuk membedakan kontribusi pertama dengan pembaruan nilai.

## 11 Evaluasi keamanan dan validasi

### 11.1 Kontrol yang ditemukan

Password disimpan sebagai hash. Token dibuat dengan sumber acak dan hanya hash-nya disimpan server. Middleware memeriksa token dan batas waktu. Kepemilikan tempat berasal dari pengguna pada request. Profil selalu diarahkan ke akun sendiri. Input dibatasi berdasarkan field yang divalidasi. Detail exception internal diganti pesan umum pada API. Route autentikasi dan route sensitif memiliki throttle eksplisit.

Kontrol tersebut merupakan fondasi yang baik, tetapi pemeriksaan source dan tes fitur belum sama dengan audit keamanan menyeluruh.

### 11.2 Risiko dan perbaikan

| Area | Temuan | Tindakan yang disarankan |
| --- | --- | --- |
| Token frontend | sessionStorage dapat dibaca JavaScript pada origin yang sama | Cegah XSS dan evaluasi kebijakan script serta konten |
| Masa berlaku | Token berlaku tujuh hari | Dokumentasikan sesi dan tambahkan pengelolaan sesi bila diperlukan |
| Pencabutan token | Logout hanya token aktif | Sediakan cabut semua sesi jika masuk kebutuhan akun |
| Token kedaluwarsa | Pembersihan berkala belum ditemukan pada alur yang diperiksa | Buat kebijakan cleanup dan retensi |
| GET publik | Tidak berada di throttle eksplisit route | Tentukan batas baca publik dan uji perilaku 429 |
| URL gambar | Validasi skema tidak membuktikan URL berisi gambar yang tersedia | Tambahkan fallback dan kebijakan sumber gambar |
| CORS | Daftar origin berasal dari environment | Pisahkan kebijakan lokal dan publik dalam dokumen |
| Pemulihan akun | Reset password dan verifikasi email belum tersedia | Rancang sebelum pemakaian akun secara luas |

Backend hanya menyimpan URL gambar; tidak ditemukan fetch gambar oleh server pada controller tersebut. Karena itu keberadaan URL dari pengguna tidak cukup untuk menyimpulkan adanya SSRF pada alur ini. Risiko yang langsung relevan adalah gambar rusak, pelacakan oleh penyedia eksternal, dan konten gambar yang tidak dikelola aplikasi.

### 11.3 Validasi penting

Nama dan lokasi tempat wajib dengan maksimal 255 karakter; deskripsi wajib maksimal 5000; kategori harus cocok dengan konfigurasi; URL wajib memakai HTTP/HTTPS maksimal 2048. Rating memerlukan minimal satu dimensi dengan nilai numerik 1 sampai 5. Profil hanya menerima field tertentu; perubahan ID akun, email, statistik, dan level tidak diterapkan melalui PATCH `/me`.

Frontend memberikan kenyamanan validasi, sedangkan backend menjadi penegak aturan. Request dari Postman atau klien lain tetap harus melalui aturan yang sama.

## 12 Evaluasi antarmuka dan aksesibilitas

### 12.1 Hal yang sudah baik

Source menggunakan elemen HTML semantik, label form, tombol dengan type eksplisit pada komponen bersama, alt gambar, aria-label untuk beberapa kontrol, aria-busy, serta pesan dengan role status atau alert. CSS menyediakan pengaturan focus dan responsive layout. Kontrol rating dapat dinonaktifkan selama operasi berlangsung.

Temuan ini menunjukkan dukungan dasar dari kode. Kesesuaian aksesibilitas penuh tetap memerlukan pemeriksaan interaksi keyboard, pembaca layar, kontras, pembesaran teks, dan tampilan perangkat.

### 12.2 Hal yang perlu diperbaiki

RatingPicker memakai nilai agregat sebagai nilai aktif tombol. Akibatnya pengguna dapat mengira angka terpilih adalah suara pribadinya, padahal merupakan rata-rata komunitas. Nilai agregat desimal seperti 4.5 tidak cocok persis dengan tombol integer sehingga tidak ada tombol yang aktif. API sebaiknya mengirim `myRating` secara terpisah, sedangkan UI menampilkan agregat dan pilihan pribadi sebagai informasi berbeda.

Kelompok tombol rating juga perlu nama yang jelas bagi pembaca layar serta status terpilih, misalnya melalui pola kontrol yang sesuai dan atribut `aria-pressed` bila memakai toggle button. Penerapan harus diuji dengan keyboard, bukan hanya ditambahkan sebagai atribut.

Form Add Spot memiliki isi awal contoh yang dapat langsung dikirim. Hal ini mempercepat demo tetapi berpotensi menghasilkan data yang tidak disengaja. Pertimbangkan form kosong dengan placeholder agar pengguna sadar sedang memasukkan kontribusi baru.

### 12.3 Skenario pemeriksaan visual

Periksa login/register, feed kosong dan berisi, detail, Add Spot, pesan error, profil baru, profil berkontribusi, edit, settings, dan logout. Gunakan viewport ponsel dan desktop, navigasi Tab/Enter, gambar gagal dimuat, koneksi lambat, dan pembesaran teks. Tidak ada hasil tangkapan layar yang diklaim telah diperoleh dalam evaluasi ini.

## 13 Evaluasi performa dan pemeliharaan

### 13.1 Hasil build yang terukur

Build frontend pada evaluasi menghasilkan JavaScript sekitar 259.18 kB atau gzip 79.39 kB, CSS 13.33 kB atau gzip 3.55 kB, logo 586.69 kB, serta index HTML 0.53 kB. Vite melaporkan 35 modul diproses dan build selesai sekitar 842 ms pada lingkungan evaluasi.

Angka ini merupakan ukuran aset build dan waktu bundling, bukan waktu muat pengguna, Core Web Vitals, kapasitas server, atau performa perangkat mobile. Foto eksternal belum termasuk ukuran aset lokal tersebut. Logo merupakan aset lokal terbesar yang terlihat sehingga layak dipertimbangkan untuk kompresi atau ukuran yang disesuaikan.

### 13.2 Backend dan skala data

Endpoint daftar memuat semua tempat beserta seluruh ratings ke memori melalui `with('ratings')->get()`. Eager loading menghindari pola query per tempat untuk relasi tersebut, tetapi volume data tetap bertambah mengikuti seluruh rating. Pagination dan agregasi database seperti count/average perlu dipertimbangkan sebelum dataset membesar.

ProfileSummary menjalankan beberapa query hitung dan mengambil aktivitas terbatas. Karena dipanggil ulang oleh polling, beban perlu diukur dengan banyak akun aktif. Jangan menambah cache tanpa mendefinisikan kapan data harus diperbarui setelah upload atau rating.

### 13.3 Pemeliharaan dependency

Dependency Ionic, router, dan react-scripts perlu diinventarisasi berdasarkan penggunaan nyata sebelum dihapus. Paket yang tidak masuk bundle belum tentu tidak menambah waktu instalasi atau beban pemeliharaan. ESLint tercantum tetapi manifest tidak menyediakan script lint. Belum ada bukti pipeline CI pada file utama yang diperiksa. Tambahkan pemeriksaan otomatis yang relevan, lalu tuliskan cara menjalankannya.

### 13.4 Navigasi dan ketersediaan layanan

Navigasi state cukup untuk prototipe, tetapi URL tidak mewakili halaman dan tombol Back browser tidak otomatis mengikuti perpindahan halaman. Deep link ke detail juga belum tersedia. Kebutuhan routing perlu ditentukan sebelum menambah fitur berbagi tautan.

API publik bergantung pada penyedia hosting dan database. Laporan tidak menetapkan biaya aktual atau jaminan gratis; informasi paket gratis pada panduan perlu dianggap informasi deployment yang harus diverifikasi pemilik ketika digunakan untuk keputusan operasional.

## 14 Evaluasi kualitas dokumen sumber

### 14.1 Kekuatan

Dokumen Word memiliki tujuan belajar yang jelas dan peta materi yang mudah diikuti. Penjelasan file terhubung dengan contoh kode. Props, callback, controlled input, state, route, middleware, controller, dan model dijelaskan dalam konteks aplikasi. Dokumen secara tepat membedakan token khusus dari JWT/Sanctum, URL foto dari upload file, dan polling dari realtime push.

Materi profil dinamis mencakup akun baru, aturan badge/level, challenge, cleanup polling, serta batas aktivitas. Tiga puluh pertanyaan, tugas praktik, panduan jawaban, dan rubrik membuat dokumen bermanfaat untuk belajar dan presentasi.

### 14.2 Kekurangan

| Aspek | Penilaian | Alasan |
| --- | --- | --- |
| Kejelasan tujuan | Baik | Sasaran mahasiswa dan pembelajaran disebutkan |
| Penjelasan komponen | Baik | Props, callback, komposisi, dan event terhubung ke file |
| Alur frontend ke backend | Baik | Request dapat ditelusuri sampai database |
| Aturan profil | Baik | Rumus dan batas kontribusi dijelaskan |
| Status deployment | Perlu revisi | Pengantar Word masih menonjolkan SQLite tanpa pemisahan Neon |
| Konsistensi versi dokumen | Perlu revisi | README memuat beberapa hasil pemeriksaan historis |
| Contoh respons akun | Perlu dilengkapi | Contoh ringkas lama tidak selalu menampilkan field profil baru |
| Bukti pengujian | Perlu dilengkapi | Perlu log bertanggal dan matriks cakupan terpadu |
| Dokumentasi operasional | Perlu dilengkapi | Backup, rollback, monitoring, dan pemulihan belum rinci |
| Tata letak Word | Belum dinilai | Tidak dilakukan render visual halaman sumber |

### 14.3 Ketidaksesuaian dan ambiguitas spesifik

Pertama, pengantar Word menyebut Laravel dan SQLite, sedangkan panduan API publik menyebut Vercel dan PostgreSQL Neon. Tambahkan dua konfigurasi lingkungan lengkap dengan arah koneksi frontend.

Kedua, README masih mengandung pernyataan lama bahwa badge/statistik/aktivitas belum nyata, lalu bagian berikutnya menyebut profil dinamis sudah dihitung dari database. Pernyataan lama perlu dipindahkan ke changelog atau dihapus dari penjelasan keadaan terkini.

Ketiga, README menampilkan hasil empat tes frontend dan enam tes backend pada bagian lama, lalu lima tes frontend dan sembilan tes backend pada pembaruan. Angka tersebut perlu diberi tanggal dan konteks atau diganti satu hasil terkini dengan riwayat terpisah.

Keempat, pembahasan peringatan bundle Ionic lama berada berdampingan dengan informasi UI HTML/CSS dan bundle baru. Kondisi lama perlu diberi label riwayat agar tidak dianggap masalah build yang sedang terjadi.

Kelima, CORS lokal dalam kode berbasis daftar origin, sedangkan panduan publik menyebut origin mana pun diizinkan. Ini dapat berlaku melalui environment deployment, tetapi dokumen harus menyebut perbedaan environment dan tidak menyiratkan kode default selalu wildcard.

Keenam, SQLite in-memory disebut sebagai cara tes, tetapi pilihan SQLite dan `:memory:` masih berupa komentar dalam `phpunit.xml`. Perintah tes yang terdokumentasi harus memastikan isolasi database secara eksplisit agar pembaca tidak mengandalkan konfigurasi yang belum aktif.

### 14.4 Struktur dokumentasi yang disarankan

Gunakan README sebagai pintu masuk singkat yang hanya menggambarkan keadaan terkini. Pisahkan panduan instalasi, arsitektur, API, database, pengujian, pengguna, deployment, troubleshooting, dan changelog. Modul Word dapat tetap dipakai untuk pembelajaran, dengan sumber fakta teknis mengacu ke kontrak dan dokumen yang sama.

Setiap perubahan fitur sebaiknya memiliki checklist: kontrak API berubah atau tidak, skema database berubah atau tidak, contoh respons berubah atau tidak, tes yang dijalankan, dan bagian dokumentasi yang diperbarui. Dengan demikian dokumentasi ikut menjadi bagian pekerjaan fitur.

## 15 Hasil pengujian dan cakupan verifikasi

### 15.1 Lingkungan evaluasi

Pemeriksaan dijalankan pada workspace Windows melalui PowerShell, dengan Node v24.21.0, PHP 8.3.33, Vite v8.3.4, dan Vitest v4.0.18. Tanggal laporan mengikuti 27 Oktober 2026 zona Asia/Jakarta. Tes backend ditujukan ke SQLite `:memory:` menggunakan environment proses agar tidak memakai database pengguna.

### 15.2 Pemeriksaan yang dijalankan

| Pemeriksaan | Hasil | Arti |
| --- | --- | --- |
| `npm run build` | Berhasil | Source dapat dibundel menjadi aset `www/` |
| `npm test -- --run` | Lima tes lulus dalam dua file | Kontrak request dan satu skenario polling profil lolos |
| `php artisan test` dengan SQLite in-memory | Sembilan tes lulus, 72 assertion | Skenario backend yang tersedia lolos pada database uji |
| `php artisan route:list --path=api` | Sembilan route | Kontrak metode dan path sesuai tabel API |
| Pemeriksaan isi Word dan source | Dilakukan | Mendukung evaluasi kesesuaian materi |
| Browser menyeluruh dan native | Tidak dijalankan | Tidak ada klaim semua interaksi visual lulus |
| Uji produksi dan beban | Tidak dijalankan | Tidak ada klaim kapasitas atau uptime |

### 15.3 Cakupan frontend

Empat tes `src/api.test.js` memeriksa pengiriman JSON dan Bearer token, pengambilan payload.data, pesan validasi backend, penghapusan sesi dan event ketika 401, serta pesan kegagalan jaringan. Satu tes `ProfilePage.test.jsx` memeriksa keadaan profil kosong, pembaruan setelah 15 detik, penghentian polling saat edit, dan pengambilan ulang setelah Cancel.

Tes profil memakai jsdom dan mock API; tes tersebut tidak menghubungi server produksi atau membuktikan tampilan di browser nyata. Lima tes bukan persentase cakupan kode dan tidak berarti seluruh fitur memiliki pengujian UI.

### 15.4 Cakupan backend yang tersedia pada source

`KemanaYaTest` memeriksa register/login/logout, persistensi settings, akses tanpa token, kategori tidak valid, rating dua akun, perubahan dimensi tanpa penggandaan, skor di luar batas, detail tidak ditemukan, isolasi profil, token kedaluwarsa, dan preflight CORS.

`ProfileSummaryTest` memeriksa akun kosong, kontribusi akun sendiri, rating parsial dan lengkap, perlindungan statistik dari perubahan input, badge, level, challenge yang keluar dari tujuh hari, serta batas sepuluh aktivitas. Dua tes Example bawaan juga ada; tes `true is true` memiliki nilai pembuktian fitur yang sangat kecil.

### 15.5 Matriks uji tambahan

| ID | Skenario | Hasil yang diharapkan | Status evaluasi |
| --- | --- | --- | --- |
| U01 | Register email baru | 201, token, profil awal kosong | Ada tes backend |
| U02 | Register email sama | 422, tidak membuat akun baru | Perlu bukti kasus khusus |
| U03 | Password login salah | 422, tanpa sesi baru | Ada tes backend |
| U04 | `/me` tanpa token | 401 | Perlu hasil kasus langsung bila untuk lampiran |
| U05 | Token kedaluwarsa | 401 dan frontend reset | Ada tes terpisah backend/frontend |
| U06 | Kategori salah | 422 | Ada tes backend |
| U07 | Rating satu dimensi | Dimensi lain tetap | Ada tes backend |
| U08 | Akun kedua memberi rating | Rata-rata benar, jumlah dua | Ada tes backend |
| U09 | Skor 6 atau 7 | 422 | Skor 7 ada pada tes backend |
| U10 | ID tidak ada | 404 | Ada tes backend |
| U11 | Tab disembunyikan | Polling tidak mengirim request | Perlu tes kasus khusus |
| U12 | Edit selama lebih dari 15 detik | Draft tetap, polling dijeda | Ada tes profil |
| U13 | Rating pribadi berbeda dari agregat | UI membedakan keduanya | Perlu perubahan kontrak/UI |
| U14 | Banyak tempat dan rating | Latensi serta memori terukur | Belum diuji |
| U15 | Database PostgreSQL terisolasi | Migrasi dan tes domain lulus | Belum diuji |
| U16 | Pemulihan backup | Data kembali sesuai target | Belum diuji |
| U17 | Keyboard dan pembaca layar | Semua fitur dapat dioperasikan | Belum diuji menyeluruh |
| U18 | Klik cepat publish/rating | Tidak menggandakan operasi tak disengaja | Pengunci ada, perlu tes browser |

### 15.6 Catatan hasil backend

Tes backend selesai dengan sembilan tes lulus dan 72 assertion; durasi yang dilaporkan runner 25.61 detik. Daftar route menampilkan sembilan endpoint yang sesuai dengan bagian 8. Dua dari sembilan tes merupakan Example bawaan; tujuh tes lainnya berada pada KemanaYaTest dan ProfileSummaryTest. Angka ini tidak boleh dipresentasikan sebagai sembilan skenario end-to-end browser.

Perintah dijalankan dari folder backend dengan environment proses `APP_ENV=testing`, `DB_CONNECTION=sqlite`, dan `DB_DATABASE=:memory:`. Tidak digunakan perintah migrasi reset terhadap database publik. Untuk pengulangan di lingkungan lain, pastikan `DB_URL` dan cache konfigurasi juga tidak mengarahkan koneksi ke database nyata. Hasil SQLite ini belum membuktikan kompatibilitas seluruh operasi pada PostgreSQL.

## 16 Panduan instalasi dan konfigurasi

### 16.1 Prasyarat

Siapkan Node/npm yang kompatibel dengan lockfile proyek, PHP sesuai syarat Composer, Composer, serta ekstensi PHP yang dibutuhkan Laravel dan driver database. Untuk SQLite lokal diperlukan PDO SQLite/SQLite3. Untuk PostgreSQL diperlukan driver PDO PostgreSQL. Menjalankan backend dan frontend memerlukan terminal terpisah.

### 16.2 Instalasi frontend

Dari root proyek:

```powershell
npm ci
```

Untuk setup awal, salin `.env.example` menjadi `.env` hanya bila `.env` belum tersedia. Pilih base URL secara sadar: lokal atau publik. Untuk mode lokal gunakan:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

```powershell
npm start
```

Restart Vite setelah environment berubah. Nilai `VITE_*` masuk ke frontend dan tidak cocok untuk rahasia. Port yang lazim dicatat proyek adalah 5173; gunakan alamat yang benar-benar dicetak Vite jika port tersebut sudah digunakan.

### 16.3 Instalasi backend lokal

```powershell
cd backend
composer install
```

Pada setup awal, buat `.env` dari contoh hanya jika belum ada. Gunakan `APP_ENV=local`, `APP_DEBUG=false`, `DB_CONNECTION=sqlite`, dan database lokal yang dituju. Pastikan `DB_URL` tidak mengarah ke deployment ketika menjalankan mode SQLite lokal, karena konfigurasi database juga membaca variabel tersebut.

```powershell
php artisan key:generate
```

Jalankan pembuatan key hanya untuk instalasi baru yang memang belum memiliki key. Buat file database hanya bila belum ada, lalu jalankan migrasi pada database lokal yang telah dipastikan:

```powershell
if (-not (Test-Path -LiteralPath 'database/database.sqlite')) {
    New-Item -ItemType File -Path 'database/database.sqlite'
}
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Jangan menggunakan perintah pembentukan ulang database pada data pengguna. Seeder demo bersifat opsional untuk lingkungan lokal/test; bukan akun login bawaan untuk produksi.

### 16.4 Konfigurasi utama

| Variabel | Lingkungan | Fungsi |
| --- | --- | --- |
| VITE_API_BASE_URL | Frontend | Alamat API yang akan dipanggil browser |
| APP_KEY | Backend | Kunci aplikasi, disimpan rahasia |
| APP_ENV | Backend | Identitas lingkungan aplikasi |
| APP_DEBUG | Backend | Pengaturan debug framework |
| APP_URL | Backend | Alamat dasar backend |
| DB_CONNECTION | Backend | Memilih SQLite atau PostgreSQL |
| DB_DATABASE | Backend | File SQLite atau nama database sesuai driver |
| DB_URL | Backend | URL koneksi; jangan tampilkan nilai rahasia |
| DB_SSLMODE | PostgreSQL | Kebijakan TLS koneksi database |
| FRONTEND_URLS | Backend | Daftar origin browser yang diizinkan |
| CACHE_STORE | Backend | Penyimpanan cache termasuk kebutuhan limiter |

### 16.5 Pemeriksaan setelah setup

Pastikan GET daftar mengembalikan JSON, buat akun uji lokal, tambahkan tempat, beri rating, buka profil, dan logout. Periksa Network jika respons gagal. Jalankan build dan tes. Untuk tes backend, pastikan `.env.testing` atau environment proses mengarah ke database uji yang terisolasi dan tidak memiliki `DB_URL` produksi. Jangan menjalankan tes RefreshDatabase pada database publik.

## 17 Panduan pengguna

### 17.1 Membuat akun dan masuk

Buka aplikasi dan pilih Register. Masukkan nama, email, password minimal delapan karakter, serta kota bila diperlukan. Setelah berhasil, aplikasi membuka dashboard. Untuk akun yang sudah ada gunakan Login. Jika muncul error, periksa pesan field dan koneksi API.

### 17.2 Melihat tempat dan memberi nilai

Pilih tempat dari Explore Feed atau Recomend. Halaman mengambil detail terbaru. Pilih nilai foto dan/atau tempat. Nilai yang dikirim disimpan untuk akun yang sedang masuk. Memberi nilai ulang pada tempat sama memperbarui suara sebelumnya. Skor komunitas dapat berbeda dari suara pribadi.

### 17.3 Menambahkan tempat

Buka Add Spot. Isi nama, lokasi, kategori, URL foto yang dapat diakses, dan deskripsi. Periksa seluruh isi sebelum Publish karena form memiliki contoh nilai awal. Setelah berhasil, tempat muncul pada feed. Menempelkan URL gambar tidak mengunggah file ke server KemanaYa.

### 17.4 Mengelola profil

Buka Profile untuk melihat kontribusi. Pilih Edit untuk mengubah data pribadi yang tersedia, lalu Save atau Cancel. Pembaruan berkala berhenti selama edit agar draft tidak tertimpa. Jumlah Dirating menunjukkan kontribusi rating, bukan bukti pernah mengunjungi tempat.

### 17.5 Pengaturan dan keluar

Preferensi pada Settings disimpan otomatis ke backend. Label pada UI menjelaskan bahwa pengiriman push, halaman profil publik, dan mode compact belum tersedia. Keluar akun mencabut token aktif dan membuka login kembali. Jika jaringan gagal saat logout, pesan error ditampilkan dan pengguna dapat mencoba lagi.

## 18 Dokumentasi operasional dan deployment

### 18.1 Lingkungan

| Lingkungan | Frontend | Backend | Database | Tujuan |
| --- | --- | --- | --- | --- |
| Lokal | Vite development | Laravel development server | SQLite | Pengembangan dan demo lokal |
| Pengujian | Vitest/jsdom atau browser uji | Laravel testing | SQLite in-memory atau PostgreSQL uji | Pemeriksaan terisolasi |
| Deployment menurut panduan | Aplikasi yang memakai API publik | PHP di Vercel | PostgreSQL Neon | Akses lintas perangkat tanpa laptop backend aktif |

Panduan yang tersedia belum cukup untuk menyimpulkan di mana frontend produksi di-host. Konfigurasi frontend yang mengarah ke API publik juga tidak otomatis mempublikasikan frontend.

### 18.2 Prosedur rilis yang perlu dibakukan

Sebelum rilis, jalankan tes, build, pemeriksaan kontrak API, dan migrasi pada database uji yang sesuai. Catat versi atau identitas source yang dirilis. Verifikasi environment backend dan CORS tanpa menampilkan rahasia. Siapkan backup sebelum migrasi yang mengubah data. Deploy oleh pemilik akun, lalu lakukan smoke test read-only dan alur akun uji yang telah disepakati.

Perintah deploy pada panduan adalah `npx vercel --prod` dari folder backend. Laporan ini tidak menjalankan deploy. Rilis harus memiliki catatan hasil, waktu, perubahan skema, dan langkah pemulihan. Jika belum ada Git repository pada folder kerja, tentukan mekanisme versi source sebelum mengandalkan commit sebagai identitas rilis; pemeriksaan `git status` saat evaluasi menunjukkan folder ini bukan repository Git.

### 18.3 Backup dan pemulihan

Tentukan siapa yang bertanggung jawab terhadap backup, jadwal, retensi, lokasi penyimpanan, dan batas kehilangan data yang dapat diterima. Untuk SQLite, backup harus memperhatikan konsistensi file ketika aplikasi sedang menulis. Untuk database cloud, gunakan mekanisme backup yang sesuai layanan dan uji restore ke lingkungan terpisah. Keberadaan fitur backup penyedia tidak membuktikan restore aplikasi berhasil.

### 18.4 Monitoring

Pantau status API, error rate, latensi, penggunaan database, dan kegagalan login berulang. Log harus membantu diagnosis tanpa menyimpan password atau token mentah. Pada deployment serverless, log file sementara tidak boleh menjadi satu-satunya jejak insiden. Dokumentasikan lokasi dashboard/log dan alur eskalasi pemilik aplikasi.

### 18.5 Troubleshooting

| Kendala | Kemungkinan penyebab | Langkah pemeriksaan |
| --- | --- | --- |
| Tidak dapat menghubungi API | Backend mati atau base URL salah | Buka endpoint daftar dan periksa Network |
| Diblokir CORS | Origin belum diizinkan | Cocokkan protokol, host, port, dan FRONTEND_URLS |
| Error tabel | Migrasi belum berjalan atau database salah | Verifikasi target koneksi sebelum migrasi |
| Login kembali | Token berakhir atau sesi tab hilang | Masuk ulang; periksa status 401 |
| Foto rusak | URL tidak tersedia atau bukan gambar | Buka URL uji dan gunakan fallback gambar |
| Recomend kosong | Skor di bawah 4.5 | Periksa dua dimensi dan aturan pembulatan |
| Profil tidak segera berubah | Interval polling atau tab tersembunyi | Buka kembali profil, periksa GET /me |
| Setting tersimpan tetapi tampilan sama | Efek fiturnya belum diterapkan | Ikuti status fitur yang dijelaskan UI |
| 429 | Batas request tercapai | Kurangi frekuensi; periksa kebijakan limiter |

## 19 Daftar temuan dan rencana perbaikan

### 19.1 Definisi prioritas

Prioritas tinggi berarti perlu diselesaikan sebelum hasil dipakai sebagai bukti kesiapan rilis atau sebelum penggunaan data nyata diperluas. Prioritas sedang berarti penting untuk kualitas dan pertumbuhan penggunaan. Prioritas rendah berarti penyempurnaan yang dapat dijadwalkan setelah kebutuhan inti. Prioritas ini merupakan penilaian teknis untuk proyek, bukan skor risiko formal.

### 19.2 Register temuan

| ID | Prioritas | Temuan | Bukti | Kriteria selesai |
| --- | --- | --- | --- | --- |
| T01 | Tinggi | Dokumentasi database lokal/publik belum seragam | S01, S02, S03, S12 | Dua lingkungan dijelaskan konsisten |
| T02 | Tinggi | Konfigurasi database tes belum dipastikan melalui phpunit.xml | S11 dan konfigurasi tes | Perintah tes selalu memakai database terisolasi |
| T03 | Tinggi | Rating aktif UI berasal dari agregat | S06 RatingPicker dan DashboardPage | Suara pribadi dibedakan dari agregat dan diuji |
| T04 | Sedang | Semua tempat dan rating dimuat pada daftar | S08 PlaceController | Pagination dan agregat database teruji |
| T05 | Sedang | Rekomendasi dapat terbentuk dari satu akun | S06 dan S08 | Kebijakan minimum penilai ditentukan |
| T06 | Sedang | GET publik tidak memiliki throttle route eksplisit | S07 | Kebijakan limiter baca disepakati dan diuji |
| T07 | Sedang | Pernyataan lama README bercampur dengan kondisi kini | S02 | Ringkasan terkini tunggal dan changelog terpisah |
| T08 | Sedang | Belum ada bukti browser dan PostgreSQL terisolasi | S11 | Laporan uji lintas lapisan tersedia |
| T09 | Sedang | Operasional backup dan rollback belum terbukti | S03 dan S12 | Restore dan pemulihan rilis diuji |
| T10 | Sedang | Aksesibilitas rating belum lengkap | S06 RatingPicker | Nama kelompok, status pilihan, keyboard diuji |
| T11 | Sedang | Belum ada edit/hapus dan moderasi tempat | S07 | Kebijakan koreksi konten disepakati |
| T12 | Rendah | Paket lama dan metadata starter masih ada | S04, konfigurasi Capacitor | Dependency dan metadata sesuai penggunaan |
| T13 | Rendah | Logo build sekitar 586.69 kB | Hasil build | Aset dioptimalkan dengan kualitas sesuai |
| T14 | Sedang | Rating desimal API dan integer UI berbeda | S08 dan S06 | Domain nilai dan presisi tertulis serta diuji |
| T15 | Sedang | Update rating lama dapat memenuhi challenge lagi | S09 | Definisi challenge dikonfirmasi dan dijelaskan |
| T16 | Rendah | Navigasi state tanpa deep link | S05 | Routing diterapkan bila dibutuhkan produk |
| T17 | Sedang | Kontrak API belum menjadi OpenAPI dan collection uji | S03, S07 | Kontrak serta contoh terverifikasi tersedia |

### 19.3 Urutan pengerjaan

Tahap pertama menyelaraskan dokumentasi keadaan terkini dan memastikan isolasi pengujian. Tahap kedua memperbaiki pemisahan rating pribadi dan agregat, serta menambah tes untuk kasus batas. Tahap ketiga mengukur kebutuhan pagination, limiter publik, dan optimasi aset. Tahap keempat melengkapi bukti browser, PostgreSQL, aksesibilitas, backup, dan rollback sebelum menyatakan kesiapan penggunaan luas.

Penanggung jawab dapat dibagi menjadi frontend untuk tampilan dan tes UI, backend untuk kontrak/rating/database, dokumentasi untuk konsistensi materi, dan pemilik deployment untuk konfigurasi cloud serta pemulihan. Nama orang dan tenggat perlu diisi berdasarkan pembagian tim yang sebenarnya.

## 20 Paket bukti dokumentasi

### 20.1 Daftar bukti yang disarankan

| Kode bukti | Isi | Cara memperoleh | Status |
| --- | --- | --- | --- |
| B01 | Manifest dependency | Lampirkan package/composer tanpa rahasia | Sumber tersedia |
| B02 | Diagram arsitektur | Tunjukkan alur frontend ke database | Skema teks ada pada laporan |
| B03 | Daftar route | `php artisan route:list --path=api` | Dicatat bersama pemeriksaan backend |
| B04 | Log build | Keluaran npm run build | Ringkasan hasil ada |
| B05 | Log tes frontend | Keluaran Vitest | Lima tes lulus |
| B06 | Log tes backend | Keluaran artisan test terisolasi | Lihat hasil akhir backend |
| B07 | Layar login/register | Browser lokal tanpa data sensitif | Perlu direkam |
| B08 | Feed dan detail | Browser dengan data uji | Perlu direkam |
| B09 | Add Spot sebelum/sesudah | Form, request, respons 201 | Perlu direkam |
| B10 | Rating dua akun | Bukti perubahan agregat dan jumlah | Perlu rekaman manual atau log tes terstruktur |
| B11 | Profil nol dan berkontribusi | Respons /me dan tampilan | Perlu direkam |
| B12 | Polling saat edit | Network dan draft lebih dari 15 detik | Tes simulasi ada; rekaman browser belum |
| B13 | Error 401/404/422 | Request dan respons yang disamarkan | Perlu lampiran request |
| B14 | Deployment dan restore | Catatan rilis dan uji pemulihan | Belum tersedia sebagai bukti evaluasi |

### 20.2 Format pencatatan bukti

Setiap bukti sebaiknya memuat ID, tanggal, lingkungan lokal/test/publik, tujuan, langkah, data uji, hasil diharapkan, hasil aktual, status, dan file lampiran. Jangan menyertakan password, token, cookie, URL koneksi database, private key, atau data pribadi akun lain. Tangkapan layar hanya diperlukan jika benar-benar memperlihatkan perilaku yang sedang dibuktikan.

Nama berkas dapat memakai pola `B09_AddSpot_Lokal_20261027.png` dan log teks terkait. Pastikan status hasil aktual tidak diisi sebelum pengujian dilakukan. Untuk data contoh, beri keterangan ilustrasi agar tidak dianggap bukti eksekusi.

### 20.3 Rancangan urutan Postman

Gunakan environment lokal dengan `baseUrl`, `token`, dan `placeId`. Jalankan register, simpan token hasil respons, buat tempat, simpan ID tempat, baca daftar/detail, beri rating foto lalu tempat, ubah profil, baca profil, logout, dan pastikan token lama ditolak. Tambahkan kasus kategori salah, skor di luar batas, dan ID tidak ada.

Ekspektasi status harus dijadikan assertion. Untuk perhitungan dua akun, siapkan dua identitas uji dan simpan tokennya secara terpisah. Ekspor collection dengan placeholder; jangan ekspor environment yang berisi token aktif. Ini rancangan dokumentasi pengujian, bukan klaim collection telah dibuat atau dijalankan.

## 21 Panduan presentasi dan tanya jawab

### 21.1 Alur presentasi

Mulai dengan masalah yang diselesaikan KemanaYa dan fitur yang sudah ada. Jelaskan stack aktif, lalu tunjukkan satu alur lengkap dari tombol Publish ke route, middleware, controller, model, dan database. Lanjutkan dengan contoh rating dua akun dan aturan rekomendasi. Tunjukkan profil dinamis serta jeda polling saat edit. Akhiri dengan hasil tes aktual dan pekerjaan yang masih perlu dilakukan.

### 21.2 Jawaban singkat untuk pertanyaan penting

**Aplikasi ini menggunakan apa saja?** React dan Vite pada frontend, JavaScript JSX dengan HTML/CSS dan SVG, fetch untuk REST API, Laravel/PHP untuk backend, Eloquent untuk data, SQLite lokal, serta PostgreSQL Neon menurut panduan deployment publik.

**Apakah Ionic masih digunakan?** Paket dan konfigurasi masih ada, tetapi komponen UI aktif menggunakan HTML/CSS dalam React. Jangan menyebut semua tampilan sebagai komponen Ionic.

**Apakah Firebase digunakan?** Belum. Foto ditampilkan dari URL yang disimpan, sedangkan data aplikasi berada pada database relasional.

**Apakah token ini JWT?** Bukan. Server membuat token acak, menyimpan hash SHA-256 dan waktu kedaluwarsa, lalu middleware mencocokkan hash token Bearer.

**Bagaimana satu akun tidak menggandakan suara?** Tabel ratings memiliki constraint unik user_id dan place_id. Upsert memperbarui baris yang sama ketika akun menilai ulang.

**Bagaimana rekomendasi dipilih?** Frontend memfilter Worth minimal 4.5 lalu mengurutkannya menurun. Worth berasal dari rata-rata dua skor agregat dengan pembulatan satu desimal.

**Apakah data profil realtime?** Profil menggunakan polling REST sekitar 15 detik saat tab aktif dan tidak sedang edit/simpan. Ini tidak menjamin perubahan seketika.

**Apakah statistik menunjukkan kunjungan?** Tidak. Ditemukan menghitung tempat yang dibagikan, Dirating menghitung spot yang dinilai. Aplikasi belum memverifikasi kunjungan fisik.

**Apakah tes lulus berarti siap produksi?** Belum. Tes yang tersedia membuktikan skenario tertentu. Browser menyeluruh, PostgreSQL, beban, backup, dan pemulihan masih perlu bukti tambahan.

### 21.3 Saran penggunaan rubrik

Rubrik pada dokumen Word dapat dipakai untuk mengukur pemahaman komponen/event, alur REST API, data/autentikasi, praktik pengujian, serta ketepatan penjelasan. Pertahankan total bobot yang disepakati pengajar. Hasil evaluasi teknis pada laporan ini tidak otomatis menjadi nilai mahasiswa atau nilai kelulusan proyek.

## 22 Kesimpulan dan kriteria penerimaan

Dokumen teknis KemanaYa sudah menjelaskan struktur dan alur inti aplikasi dengan baik serta menyediakan materi pembelajaran yang cukup luas. Implementasi memiliki pemisahan frontend/backend yang jelas, validasi server, autentikasi berbasis token, rating per akun, dan profil dinamis berdasarkan kontribusi.

Revisi dokumentasi paling mendesak adalah penyelarasan SQLite lokal dengan PostgreSQL deployment, pemisahan riwayat lama dari kondisi terkini, dan pencatatan hasil tes yang terisolasi. Dari sisi aplikasi, pemisahan rating pribadi dengan skor agregat merupakan perbaikan pengalaman pengguna yang paling jelas ditemukan pada source. Pagination, kebijakan rekomendasi, limiter publik, dan pembuktian operasional menjadi pekerjaan berikutnya.

Laporan dapat dinyatakan lengkap untuk evaluasi akademik ketika teknologi aktif dan batas fitur dijelaskan secara konsisten, alur request dapat ditunjukkan pada kode, hasil pengujian memiliki tanggal dan lingkungan, contoh data tidak dianggap bukti aktual, serta lampiran demonstrasi memperlihatkan perilaku yang benar-benar diuji. Pernyataan kesiapan produksi perlu menunggu bukti pengujian dan operasional tambahan.

## 23 Referensi internal dan glosarium

### 23.1 Referensi internal

Rujukan utama adalah S01 sampai S12 pada bagian 2.3. Untuk menelusuri autentikasi, buka `AccountController.php`, `ApiToken.php`, dan `User.php`. Untuk rating, buka `PlaceController.php` dan migrasi domain. Untuk profil, buka `ProfileSummary.php`, `ProfilePage.jsx`, dan pengujiannya. Untuk perbedaan lokal dan publik, bandingkan `README.md`, `docs/API-Publik.md`, `backend/vercel.json`, dan `backend/config/database.php`.

Referensi dokumentasi vendor yang sudah dicantumkan proyek dapat digunakan untuk studi lanjutan, misalnya dokumentasi Laravel 12. Laporan ini tidak menjadikan penelusuran dokumentasi vendor terbaru sebagai bukti versi atau status deployment aktual.

### 23.2 Glosarium

| Istilah | Penjelasan |
| --- | --- |
| API | Antarmuka yang memungkinkan program berkomunikasi |
| REST API | API HTTP dengan resource dan metode operasi |
| JSON | Format pertukaran data berbasis teks |
| JSX | Sintaks penulisan struktur komponen dalam JavaScript |
| Props | Input yang diberikan induk kepada komponen anak |
| Callback | Fungsi yang dikirim untuk dijalankan ketika interaksi terjadi |
| State | Data dalam memori komponen yang memengaruhi tampilan |
| Hook | Fungsi React untuk state, effect, memo, dan kebutuhan terkait |
| Middleware | Pemeriksaan/proses pada jalur request sebelum atau sesudah handler |
| Controller | Bagian backend yang menangani operasi endpoint |
| ORM | Pemetaan tabel database ke objek aplikasi |
| Migration | Definisi perubahan struktur database yang dapat dijalankan |
| Seeder | Pengisi data awal atau data contoh |
| Foreign key | Relasi yang menegakkan hubungan antartabel |
| Unique constraint | Aturan yang mencegah nilai atau kombinasi nilai ganda |
| Upsert | Membuat baris baru atau memperbarui baris yang sudah ada |
| Hash | Hasil fungsi satu arah untuk pembandingan, bukan enkripsi yang dibuka kembali |
| Bearer token | Token akses yang dikirim melalui header Authorization |
| CORS | Kebijakan akses lintas origin pada browser |
| Polling | Pengambilan data ulang secara berkala |
| Mock | Pengganti terkendali untuk dependency saat pengujian |
| Smoke test | Pemeriksaan singkat jalur penting setelah setup atau rilis |
| Regression test | Tes untuk memastikan perilaku lama tetap berjalan setelah perubahan |
| Rollback | Mengembalikan rilis atau perubahan ke keadaan sebelumnya |
| Restore | Memulihkan data dari backup |
| Deployment | Menempatkan aplikasi pada lingkungan layanan |
