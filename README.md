# KemanaYa

## Download dan instal Android

**[Download KemanaYa v1.0.1 APK](https://github.com/Jonathaneldokusuma/Kemana-Ya/raw/refs/heads/main/downloads/KemanaYa-v1.0.1.apk)**

1. Buka link APK dari HP Android, lalu unduh berkasnya.
2. Buka APK dan izinkan pemasangan dari browser/file manager jika Android memintanya.
3. Pilih **Instal** atau **Perbarui**, lalu buka KemanaYa dan login/daftar.

Mendukung Android 7.0 (API 24) atau lebih baru dan memerlukan internet untuk API.
APK v1.0.1 ini sudah ditandatangani (debug/testing), diverifikasi memakai apksigner,
dan berhasil dipasang di perangkat fisik. Berkas checksum tersedia di
[downloads/SHA256SUMS.txt](downloads/SHA256SUMS.txt).

API publik: `https://kemanaya-api.vercel.app/api`. Tidak perlu menjalankan backend
lokal untuk memakai APK ini. Akun tidak disertakan; gunakan akunmu atau daftar.

## Build dari source

Gunakan Node.js 22.12+ dan JDK 21, Android SDK Platform 36 serta Build Tools 36.
Jalankan `npm ci`, salin `.env.example` ke `.env`, lalu `npm run build` dan
`npx cap sync android`. Dari folder `android`, jalankan `./gradlew assembleDebug`
(Windows: `gradlew.bat assembleDebug`). APK berada di
`android/app/build/outputs/apk/debug/app-debug.apk`.

Build source di komputer lain memakai sertifikat debug komputer tersebut sehingga
sertifikatnya bisa berbeda dari APK unduhan. Kunci penandatanganan tidak disertakan
di repository.

## Ikon aplikasi Android

Ikon launcher, ikon bulat/adaptive dan splash screen memakai `logo.png` KemanaYa.
Untuk membuat ulang aset setelah mengganti logo, jalankan `npm run assets:android`,
lalu build Android. Logo diberi ruang aman agar tidak terpotong oleh bentuk ikon
launcher Android yang berbeda.

## Foto dari galeri

Form Tambah sekarang memakai **Pilih foto dari galeri**, tanpa kolom URL.
Aplikasi menampilkan dialog izin sebelum membuka Android Photo Picker; pengguna
memberikan akses ke foto yang dipilih, bukan seluruh galeri. Pada Android lama,
plugin memakai pemilih dokumen bawaan. Tidak perlu READ_MEDIA_IMAGES atau akses
penyimpanan luas. Menolak/membatalkan pemilihan tidak menghapus foto sebelumnya.

Foto diproses menjadi JPEG maksimal 1280 piksel dan 512 KiB, ditampilkan sebagai
preview dan disimpan bersama draf lokal. Foto baru dikirim sebagai multipart saat
Publish. Backend memeriksa isi gambar, format, ukuran file dan dimensi. Data foto
disimpan di database persisten; endpoint `/api/places/{id}/photo` menyajikan gambar,
sehingga foto tetap tersedia setelah deployment Vercel. Menghapus spot juga
menghapus data fotonya. API lama dengan URL gambar tetap didukung untuk kompatibilitas.

## Fitur jelajah dan koleksi

Ikon memakai satu set SVG outline 24px. Pemilik dapat memilih **Hapus spot saya**
dengan konfirmasi; API menolak penghapusan oleh akun lain. Tombol **Peta** membuka
peta OpenStreetMap di aplikasi. Saat menambah spot, atau membuka peta spot sendiri,
ketuk peta/geser pin lalu simpan titik koordinat. Koordinat manual juga tersedia.
Spot lama belum punya pin; pemilik perlu menandainya. Google Maps dan tautan
berbagi memakai koordinat tersimpan jika ada. Peta memerlukan internet.

- Tab **Jelajah**, **Tambah**, **Tersimpan**, dan **Profile** dengan tampilan mobile yang ringkas.
- **Simpan** menambahkan spot ke koleksi lokal per akun, tetap ada setelah aplikasi dibuka ulang. Data koleksi belum disinkronkan ke server.
- **Peta** menampilkan pin tersimpan; Google Maps mencari nama/alamat jika pin belum ditandai.
- **Bagikan** memakai menu berbagi jika tersedia, lalu clipboard atau tautan yang bisa disalin secara manual.
- **Beri aku ide** memilih acak dari hasil filter yang sedang ditampilkan. **Perbarui** mengambil ulang data API.
- Draf tambah spot tersimpan otomatis per akun pada perangkat, dipertahankan jika publish gagal, dan dikosongkan setelah berhasil.
- Setelah feed pernah dimuat, kegagalan memuat ulang menampilkan salinan lokal dengan pemberitahuan. Foto masih memerlukan jaringan/cache WebView; login, publish, dan rating memerlukan internet.

Koleksi, draf, dan feed cadangan disimpan di penyimpanan aplikasi. Menghapus data aplikasi juga menghapus data lokal tersebut.

## Izin perangkat Android

Build Android menyertakan izin kamera (`CAMERA`) dan mikrofon (`RECORD_AUDIO`).
Saat pertama dibuka, aplikasi menampilkan penjelasan dengan tombol **Lanjutkan**
untuk memunculkan dialog izin Android atau **Nanti** untuk melanjutkan tanpa izin.
Izin yang sudah diberikan tidak diminta ulang. Jika ditolak, aplikasi tetap berjalan
dan menyediakan pilihan membuka pengaturan izin aplikasi. Setelah memilih Nanti,
izin juga dapat diaktifkan melalui Pengaturan Android > Aplikasi > KemanaYa > Izin.

Form Tambah memilih foto dari galeri melalui pemilih foto Android. Pengambilan
foto langsung dengan kamera dan perekaman audio belum tersedia. Titik lokasi
dipilih manual di peta; notifikasi masih berupa panel dalam aplikasi.

Untuk memeriksa dialog, gunakan instalasi baru atau hapus data aplikasi (menghapus
sesi lokal), buka aplikasi, lalu coba Lanjutkan, izinkan/tolak, dan buka ulang.
Dialog pengantar hanya ditampilkan sekali selama data aplikasi tersimpan.

API publik: **https://kemanaya-api.vercel.app/api** (Vercel Hobby + Neon Free).
Lihat [panduan API publik](docs/API-Publik.md) untuk endpoint, autentikasi,
contoh penggunaan di web lain, dan deployment berikutnya. Konfigurasi frontend
workspace ini sudah memakai API publik; SQLite tetap tersedia untuk development lokal.

Aplikasi KemanaYa menggunakan React + Vite dengan elemen HTML biasa dan CSS, serta Laravel 12 REST API di `backend/`. Sesuai perubahan terbaru, komponen UI Ionic sudah diganti; navigasi berbasis state, koneksi API, dan output build `www/` tetap dipertahankan. Frontend memakai `fetch` melalui `src/api.js` tanpa dependency HTTP tambahan.

## Penjelasan arsitektur dan alur kerja

KemanaYa membantu pengguna membagikan tempat menarik dan menilai kualitas foto serta tempatnya. Frontend bertugas menampilkan halaman dan menerima input. Backend memvalidasi input, memeriksa identitas pengguna, menyimpan data, dan menghitung skor. Database menyimpan data agar tetap tersedia setelah halaman dimuat ulang atau server dijalankan kembali.

Alur komunikasi aplikasi:

```text
Pengguna -> Halaman React HTML -> src/api.js -> Laravel REST API -> SQLite
Pengguna <- Tampilan diperbarui <- Respons JSON <- Laravel REST API <- SQLite
```

Vite menjalankan server development dan membangun frontend. Laravel berjalan sebagai server terpisah. Karena alamat keduanya berbeda saat development, CORS pada Laravel mengizinkan request dari origin frontend yang terdaftar di `FRONTEND_URLS`. CORS mengatur akses browser; autentikasi tetap diperiksa melalui token.

### Alur penggunaan

1. Pengguna membuka aplikasi, kemudian mendaftar atau masuk. Laravel memeriksa data dan mengembalikan token beserta profil akun.
2. Frontend menyimpan token di `sessionStorage`. Request berikutnya menyertakan token melalui header `Authorization`. Ketika halaman dimuat ulang, frontend memanggil `/me` untuk memulihkan sesi yang masih berlaku.
3. Dashboard mengambil daftar tempat dari `/places`. Mengklik suatu spot mengambil detail terbaru dari `/places/{id}`.
4. Pada Tambah, pengguna mengisi nama, lokasi, kategori dan deskripsi, memilih foto galeri, serta menandai pin opsional. Saat Publish, foto dan data dikirim ke Laravel lalu disimpan bersama identitas pemilik spot.
5. Pengguna memilih rating foto atau tempat. Laravel menyimpan suara akun tersebut, menghitung ulang rata-rata, dan mengembalikan skor terbaru. Frontend memperbarui detail, feed, dan daftar Recomend.
6. Perubahan profil dan settings dikirim ke `/me`. Jika penyimpanan gagal, aplikasi menampilkan pesan error. Keluar akun mencabut token aktif dan mengembalikan pengguna ke halaman login.

### Contoh perhitungan rating

Misalkan akun A memberi rating foto 5 dan tempat 4, sedangkan akun B memberi rating foto 3 dan tempat 5. Rata-rata foto menjadi `(5 + 3) / 2 = 4`, sedangkan rata-rata tempat menjadi `(4 + 5) / 2 = 4.5`. Worth score menjadi `(4 + 4.5) / 2 = 4.25`, kemudian dibulatkan menjadi `4.3`. Spot ini belum masuk Recomend karena skor minimalnya `4.5`.

Jika akun A mengubah rating foto, sistem memperbarui suara milik akun A. Jumlah pemberi rating tetap dua orang. `ratingCount` menghitung akun yang sudah memberi setidaknya satu dimensi rating, sedangkan rata-rata setiap dimensi hanya memakai suara yang mengisi dimensi tersebut. Nilai yang belum diisi tidak dianggap suara nol; jika suatu dimensi sama sekali belum memiliki suara, skor dimensi yang ditampilkan adalah nol.

## Struktur folder dan fungsi file

| Lokasi | Penjelasan |
| --- | --- |
| `src/App.jsx` | Mengatur perpindahan halaman, pemulihan sesi, dan logout |
| `src/api.js` | Menentukan base URL API, mengirim JSON/token, serta menangani error request |
| `src/pages/LoginPage.jsx` | Form login dan register yang terhubung ke Laravel |
| `src/pages/DashboardPage.jsx` | Feed, detail, Add Spot, rating, dan Recomend |
| `src/pages/ProfilePage.jsx` | Profil pengguna, edit preferensi, settings, dan tombol keluar |
| `src/components/` | Komponen bersama, termasuk header, pemilih rating, dan tampilan skor |
| `src/data/spots.js` | Daftar kategori dan referensi data contoh lama; feed aktif menggunakan API |
| `src/styles.css` | Seluruh gaya tampilan dan kontrol HTML biasa |
| `backend/routes/api.php` | Daftar endpoint dan middleware yang melindunginya |
| `backend/app/Http/Controllers/AccountController.php` | Register, login, logout, serta pembacaan/perubahan profil sendiri |
| `backend/app/Http/Controllers/PlaceController.php` | Daftar/detail tempat, penambahan tempat, dan penyimpanan rating |
| `backend/app/Http/Middleware/ApiToken.php` | Memeriksa token dan waktu kedaluwarsanya sebelum mengakses endpoint terlindungi |
| `backend/app/Models/` | Model User, Place, dan Rating untuk membaca/menulis database |
| `backend/database/migrations/` | Definisi tabel, relasi, dan batas unik database |
| `backend/database/seeders/` | Pengisian data contoh secara opsional |
| `backend/config/cors.php` | Konfigurasi origin frontend yang diizinkan |
| `backend/config/spots.php` | Daftar kategori yang diterima validasi backend |
| `src/api.test.js` dan `backend/tests/` | Pengujian lapisan request frontend dan perilaku API backend |
| `www/` | Hasil build frontend; perubahan aplikasi dilakukan melalui `src/` |

## Data tersimpan dan data sementara

Akun, profil, settings, tempat, dan rating tersimpan di SQLite. Menutup halaman tidak menghapus data tersebut. Token frontend berada di `sessionStorage`, sehingga masa penyimpanannya mengikuti sesi tab browser. Token di server tetap memiliki batas berlaku tujuh hari dan dapat dicabut melalui logout.

Halaman yang sedang dibuka, spot yang sedang dipilih, pesan sukses/error, serta notifikasi dashboard berada di state React. Data sementara ini dapat kembali ke kondisi awal ketika komponen dilepas atau halaman dimuat ulang. Badge, statistik, dan aktivitas contoh belum menjadi catatan aktivitas pengguna sungguhan.

## Mengatasi kendala development

| Kendala | Pemeriksaan yang perlu dilakukan |
| --- | --- |
| Pesan tidak dapat menghubungi API | Pastikan Laravel berjalan, periksa `VITE_API_BASE_URL`, lalu restart Vite jika environment diubah |
| Request diblokir CORS | Cocokkan origin frontend dengan `FRONTEND_URLS`, lalu jalankan `php artisan config:clear` dari folder backend |
| Error tabel belum tersedia | Jalankan `php artisan migrate` dari folder backend dan pastikan file SQLite tersedia |
| Login akun contoh lama gagal | Login awal sebelumnya hanya simulasi; buat akun baru melalui Register |
| Feed kosong | Publish tempat baru atau jalankan seeder demo opsional |
| Spot tidak muncul di Recomend | Periksa worth score; spot baru belum memiliki rating dan ambang Recomend adalah 4.5 |
| Foto tidak muncul | Periksa internet, pilih ulang foto galeri, lalu publish. Foto spot lama berbasis URL masih bergantung pada penyedia gambar |
| Sesi kembali ke login | Token dapat kedaluwarsa atau tidak valid; masuk kembali untuk memperoleh token baru |

Untuk error internal, periksa `backend/storage/logs/laravel.log` secara lokal. Respons API hanya menampilkan pesan umum agar detail internal tidak dikirim ke pengguna.

## Fitur yang ditemukan dan dihubungkan

- Login/register kini autentikasi sungguhan; register memiliki nama, email, kota, password minimal 8 karakter. Tidak ada akun/password bawaan.
- Feed dan detail mengambil data API; Tambah menyimpan nama, lokasi, kategori, deskripsi, pin opsional dan foto dari galeri.
- Rating foto dan tempat terpisah, satu suara per akun per spot. Perubahan suara memperbarui baris yang sama. Rata-rata tiap dimensi dihitung server; worth score adalah rata-rata kedua skor yang dibulatkan satu desimal. Dimensi tanpa suara bernilai 0. Spot baru bernilai 0 sampai dinilai.
- Recomend tetap memakai aturan asli: worth score minimal 4.5, urut skor menurun di frontend.
- Profil (nama, title, kota, kategori favorit, challenge) dan tiga preferensi settings disimpan untuk akun yang masuk. Keluar tersedia di Profile → Settings; token dicabut di server.
- Loading, kosong, error jaringan/validasi, dan tombol muat ulang feed tersedia. Token kedaluwarsa mengembalikan pengguna ke login.

Belum ada UI pencarian/filter, ulasan teks, upload file, koordinat, atau edit/hapus spot dalam proyek awal; endpoint tersebut tidak ditambahkan. Notifikasi tetap lokal selama halaman dashboard aktif. Profil kini menghitung level, progress, badge, statistik, dan aktivitas dari data akun melalui API. Angka promosi pada login masih contoh tampilan asli. Preferensi settings tersimpan tetapi belum mengaktifkan push notification, profil publik, atau mode feed compact; efek tersebut juga belum diimplementasikan dalam proyek awal.

## Database dan keputusan Firebase

SQLite tersedia untuk development lokal dan Neon PostgreSQL dipakai pada API publik. Data relasional menggunakan batas unik rating serta foreign key. Foto terkompresi disimpan di database yang sama. Firebase belum digunakan.

Struktur aktual:

| Tabel | Data dan alasan |
| --- | --- |
| users | Nama, email unik, password hash, JSON profil dan settings sesuai form |
| places | ID, user_id pemilik, nama, lokasi teks, kategori, deskripsi, URL image, tags, timestamps |
| ratings | user_id + place_id unik, photoScore/placeScore nullable, timestamps; agregat dihitung saat membaca |
| api_tokens | SHA-256 token, user_id, expires_at; token mentah hanya dikirim saat login/register |

Tabel cache/jobs/session bawaan Laravel juga dibuat oleh migrasi standar. Tidak ada koleksi foto terpisah karena setiap spot saat ini hanya memakai satu URL. Kepemilikan berasal dari token, bukan input pengguna. Profil hanya bisa diperbarui lewat `/me`; rating selalu memakai ID pengguna yang masuk.

Jika nanti dibutuhkan upload ke Firebase Storage, buat Firebase project dan bucket, simpan service account **di luar repository**, lalu berikan path melalui environment backend. Gunakan Admin SDK PHP kompatibel, batasi MIME/ukuran file dan otorisasi upload di Laravel, dan simpan URL hasil upload pada `places.image`. Jangan meletakkan private key di `VITE_*`, kode, log, Postman collection, atau README. Jika seluruh database dipindahkan ke Firebase, rancang ulang transaksi rating, indeks, rules deny untuk akses klien langsung, dan migrasi data terlebih dahulu; tidak cukup mengganti `DB_CONNECTION`. Tidak ada variabel Firebase yang harus diisi untuk implementasi SQLite ini.

Referensi: [Laravel 12](https://laravel.com/docs/12.x), [Firebase Admin PHP](https://firebase-php.readthedocs.io/en/latest/), [Firebase database REST authentication](https://firebase.google.com/docs/database/rest/auth).

## Menjalankan aplikasi

Prasyarat: Node.js yang mendukung Vite 8 (lingkungan pengembangan menggunakan Node 24), npm, PHP 8.2+ (diuji 8.3), Composer 2, ekstensi PHP PDO SQLite, SQLite3, mbstring, openssl, XML, ctype, fileinfo, tokenizer, curl. Dependency backend terkunci di `backend/composer.lock`; frontend di `package-lock.json`.

Terminal frontend, dari root proyek:

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

Frontend: `http://localhost:5173`. Isi `.env` dengan `VITE_API_BASE_URL=http://127.0.0.1:8000/api`. Restart Vite setelah mengubah environment. Variabel frontend ini bukan secret.

Terminal backend:

```powershell
cd backend
composer install
Copy-Item .env.example .env
php artisan key:generate
New-Item -ItemType File -Path database/database.sqlite -Force
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

Lakukan copy environment dan pembuatan file database hanya saat setup awal. Pada workspace yang sudah disiapkan, cukup `php artisan serve`; jangan menimpa `.env` atau database yang sudah berisi data. Daftar akun melalui tab Register, lalu publish spot. Opsional data contoh dari aplikasi lama (khusus local/testing, idempotent):

```powershell
php artisan db:seed --class=DemoSpotSeeder
```

Seeder tersebut membuat akun fixture dengan password acak yang tidak dibagikan; bukan akun login demo. Database default tidak di-seed agar data contoh tidak dianggap data pengguna nyata.

Environment backend yang digunakan:

| Variabel | Nilai development / fungsi |
| --- | --- |
| APP_KEY | Dibuat `php artisan key:generate`, rahasia backend |
| APP_ENV | local |
| APP_DEBUG | false; API selalu menyembunyikan detail exception |
| APP_URL | http://127.0.0.1:8000 |
| DB_CONNECTION | sqlite |
| DB_DATABASE | Opsional path absolut SQLite; jika kosong memakai backend/database/database.sqlite |
| FRONTEND_URLS | http://localhost:5173,http://127.0.0.1:5173,http://localhost:8100,http://127.0.0.1:8100; origin dipisah koma tanpa spasi |
| CACHE_STORE | database; migrasi cache diperlukan untuk rate limit |

`.env`, database, vendor, dan secret storage diabaikan Git. Jangan commit credential. Untuk emulator/perangkat Ionic, ganti API URL dengan alamat host yang dapat diakses perangkat dan tambahkan origin sebenarnya ke `FRONTEND_URLS` (misalnya `capacitor://localhost` atau `http://localhost` sesuai konfigurasi platform). Server dapat di-bind ke `0.0.0.0` untuk pengujian jaringan lokal. Gunakan HTTPS saat deployment. Belum ada folder native Android/iOS; pengujian perangkat belum dilakukan.

## REST API

Base URL: `http://127.0.0.1:8000/api`. Kirim `Accept: application/json`, `Content-Type: application/json` untuk body JSON. Endpoint bertanda auth memakai `Authorization: Bearer <token>`. Token acak berlaku 7 hari, disimpan frontend di sessionStorage, dan dicabut saat logout. Password di-hash Laravel. Login/register dibatasi 10 request/menit per IP; endpoint terproteksi 120/menit per pengguna/IP. Tidak ada secret Firebase di frontend.

| Metode | Endpoint | Parameter/body | Fungsi/status sukses |
| --- | --- | --- | --- |
| POST | /auth/register | name, email, password, city opsional | Buat akun dan token, 201 |
| POST | /auth/login | email, password | Login dan token, 200 |
| POST | /auth/logout | auth; tanpa body | Cabut token aktif, 200 |
| GET | /me | auth | Profil akun, 200 |
| PATCH | /me | auth; field profil/settings yang diubah | Simpan profil sendiri, 200 |
| GET | /places | tanpa parameter | Seluruh spot terbaru dahulu, 200 |
| GET | /places/{id} | ID numerik | Detail dan skor agregat, 200 |
| POST | /places | auth; name, location, category, description, image | Publish, 201 |
| PUT | /places/{id}/rating | auth; photoScore dan/atau placeScore, numerik 1–5 | Simpan/perbarui suara sendiri, 200 |

Kategori harus sama persis dengan `src/data/spots.js` dan `backend/config/spots.php`, misalnya `Kafe, hidden gem, low budget`. Tidak ada query search/category/sort yang diterapkan pada API ini. Daftar belum dipaginasi; skala data besar perlu pagination dan agregasi SQL lebih lanjut.

Contoh register:

```json
{"name":"Ayu","email":"ayu@example.com","city":"Bandung","password":"password-pilihan-anda"}
```

Respons (token adalah placeholder):

```json
{"data":{"token":"<token-acak>","user":{"id":1,"email":"ayu@example.com","name":"Ayu","city":"Bandung","title":"","category":"","challenge":"","settings":{"pushRecomend":true,"publicProfile":true,"compactFeed":false}}}}
```

Contoh POST `/places`:

```json
{"name":"Kafe Sudut","location":"Bandung","category":"Kafe, hidden gem, low budget","description":"Tempat tenang untuk belajar.","image":"https://example.com/spot.jpg"}
```

Respons (timestamp contoh):

```json
{"data":{"id":1,"name":"Kafe Sudut","location":"Bandung","category":"Kafe, hidden gem, low budget","description":"Tempat tenang untuk belajar.","image":"https://example.com/spot.jpg","tags":["New Spot","Komunitas"],"ownerId":1,"photoScore":0,"placeScore":0,"rating":0,"ratingCount":0,"created_at":"2026-10-17T00:00:00.000000Z","updated_at":"2026-10-17T00:00:00.000000Z"}}
```

Contoh PUT `/places/1/rating`: `{"photoScore":5,"placeScore":4}`. Respons berbentuk `{"data":{...spot...}}` dengan skor terbaru; GET detail sama bentuknya dan GET daftar memakai `{"data":[...spot...]}`. PATCH `/me`: `{"name":"Ayu Explorer","city":"Jakarta","settings":{"compactFeed":true}}`, respons `{"data":{...profil...}}`. Logout: `{"data":null,"message":"Berhasil keluar."}`.

Error: 401 tanpa token/token kedaluwarsa, 404 ID tidak ada, 422 input salah/email terdaftar, 429 rate limit, 500 gangguan internal. Contoh validasi:

```json
{"data":null,"message":"Periksa kembali data yang diisi.","errors":{"name":["The name field is required."]}}
```

## Pemeriksaan dan Postman

```powershell
npm run build
npm test -- --run
cd backend
php artisan route:list --path=api
php artisan test
```

Tidak ada konfigurasi lint atau TypeScript pada proyek JSX awal. Build tetap menghasilkan `www/`; peringatan ukuran bundle Ionic masih perlu optimasi terpisah.

Di Postman buat environment lokal `baseUrl=http://127.0.0.1:8000/api`, `token` dan `placeId` kosong. Jalankan register, simpan `data.token` ke environment lokal, gunakan Bearer `{{token}}` pada request auth. Jalankan POST tempat, simpan `data.id` ke `placeId`, lalu GET daftar/detail, PUT rating, PATCH profil, dan logout. Ulangi GET `/me` dengan token lama: harus 401. Uji kategori salah atau skor 6: harus 422; ID tak ada: 404. Jangan export environment berisi token nyata. HTTP API juga dapat diuji dengan curl atau Postman CLI.

Pengujian otomatis backend memakai SQLite in-memory, mencakup register/login/logout, persistensi profil/settings, isolasi akun, kedaluwarsa token, validasi tempat, rata-rata dua pengguna, perubahan satu dimensi rating, data tidak ditemukan, dan CORS. Tes frontend memakai mock fetch untuk kontrak JSON, header token, error validasi/jaringan, dan reset sesi. Tes ini belum mencakup interaksi visual browser, perangkat native, atau layanan Firebase.

Hasil pemeriksaan implementasi: `npm run build` berhasil; `npm test -- --run` lulus 4 tes; `php artisan test` lulus 6 tes/41 assertion; route list menampilkan 9 endpoint API; Laravel Pint lulus pada file PHP yang diubah. HTTP smoke test terhadap server development juga lulus untuk daftar (4 spot demo), detail, `/me` tanpa token (401), dan preflight CORS. Seeder demo sudah dijalankan pada SQLite lokal workspace ini. Build sempat menampilkan peringatan bundle lebih dari 500 kB; build tetap berhasil.

Frontend yang dijalankan melalui Ionic CLI dapat memakai `http://localhost:8100`. Origin development port 5173 dan 8100 sudah diizinkan di konfigurasi CORS backend.

## Perubahan UI ke HTML dan CSS biasa

Seluruh halaman aktif sekarang memakai elemen HTML di JSX React, seperti `header`, `nav`, `main`, `section`, `button`, `label`, `input`, `select`, `option`, dan `textarea`. Tidak ada lagi import komponen `@ionic/react`, inisialisasi `setupIonicReact`, atau stylesheet Ionic di source aplikasi. React tetap digunakan untuk state, event, dan pembaruan tampilan; frontend tidak dipindahkan ke file HTML statis terpisah.

- `src/main.jsx`: entry React dan import CSS lokal.
- `src/App.jsx`, `src/components/Header.jsx`, dan `src/pages/`: elemen HTML menggantikan seluruh komponen `Ion*`.
- `src/styles.css`: layout, tombol, label/form, chip, pesan status, checkbox settings bergaya switch, focus keyboard, dan responsive breakpoint.
- `src/icons.js`: aset SVG statis dari ikon yang sebelumnya dipakai; ditampilkan melalui elemen `img`, bukan komponen Ionic.

Input menggunakan `onChange` dengan `event.target.value`; checkbox settings menggunakan `event.target.checked`. Label membungkus kontrol agar dapat dibaca teknologi bantu. Backend, endpoint, token, serta struktur database tetap sama. Paket Ionic lama masih tercatat dalam dependency proyek, tetapi tidak di-import atau dipakai oleh UI aktif. Perintah `npm start` dan `npm run build` tetap berlaku.

Setelah penggantian, build berhasil dan 4 tes lapisan API frontend lulus. Bundle JavaScript build saat pemeriksaan sekitar 266 kB (sebelumnya sekitar 1.36 MB). Dashboard juga berhasil terbaca pada tab browser lokal dengan data API; pemeriksaan interaksi visual lengkap dan perangkat native belum dilakukan.

## Komponen React yang dapat dipakai ulang

Komponen berikut ditambahkan di `src/components/` dan sudah digunakan oleh halaman aplikasi. Semuanya menghasilkan elemen HTML biasa dengan CSS lokal. Halaman tetap mengelola state dan request API, sedangkan komponen menerima data serta callback melalui props.

| File | Fungsi dan props utama |
| --- | --- |
| `Button.jsx` | Tombol bersama; menerima `children`, `className`, `disabled`, `onClick`, dan atribut tombol HTML lainnya. Default `type="button"` |
| `Icon.jsx` | Ikon SVG inline dekoratif; menerima `src` (geometri SVG lokal) dan `className`, memakai aria-hidden agar pembaca layar tidak mengulang ikon |
| `FormField.jsx` | Mengelompokkan label, ikon opsional, dan kontrol HTML; props `label`, `icon`, `children` |
| `Tag.jsx` | Label kategori/tag berbentuk chip; menerima `children` dan `className` |
| `StatusMessage.jsx` | Pesan loading, sukses, kosong, dan error; pesan biasa memakai role status, warna danger memakai role alert |
| `SpotCard.jsx` | Kartu Explore Feed berisi foto, deskripsi, skor, dan tombol detail; props `spot`, `worthScore`, `isWorth`, `onOpen` |
| `RecommendationCard.jsx` | Kartu ringkas Recomend; props `spot`, `score`, `onOpen` |
| `SelectedSpotCard.jsx` | Ringkasan spot terpilih dan tag; prop `spot`, tidak menampilkan kartu jika spot kosong |
| `NotificationPanel.jsx` | Panel daftar notifikasi dan tombol tutup; props `notifications`, `onClose` |

Komponen awal `Header`, `RatingPicker`, dan `ScoreGrid` tetap digunakan. Komponen baru dipakai di Login, Dashboard, Profile, Header, dan navigasi utama sesuai kebutuhan; bukan hanya file contoh yang belum terhubung.

Contoh penggunaan input dan tombol:

```jsx
import FormField from './components/FormField';
import Button from './components/Button';

<FormField label="Nama tempat">
  <input
    className="form-input"
    value={name}
    onChange={(event) => setName(event.target.value)}
  />
</FormField>
<Button className="color-secondary" disabled={busy} onClick={save}>
  Simpan
</Button>
```

Path import contoh di atas berlaku dari file di `src/`; sesuaikan menjadi `../components/` jika memanggil dari `src/pages/`. Variabel `name`, `busy`, `setName`, dan `save` dikelola oleh komponen halaman. Perubahan ini mempertahankan endpoint dan struktur database. Setelah penambahan komponen, build frontend dan 4 tes lapisan API frontend berhasil; tes API tersebut tidak menggantikan pengujian interaksi setiap komponen.

Perbaikan ikon: `src/icons.js` kini menyimpan geometri SVG beserta atribut garis secara eksplisit. `Icon.jsx` merender SVG inline agar warna mengikuti `currentColor`; ikon outline tidak bergantung pada stylesheet Ionic dan tidak lagi memakai filter warna gambar. Ukuran dasar 22 px, ikon chip 18 px.

## Profil akun dengan pembaruan otomatis

`GET /api/me` serta respons akun dari register/login/PATCH profil kini menyertakan `stats`, `level`, `challengeProgress`, `badges`, dan `activities`. Penghitungan berada di `backend/app/Services/ProfileSummary.php` dan hanya memakai kontribusi akun yang sedang masuk. Tidak ada migrasi baru.

- Akun baru mulai dari level 1, 0 tempat, 0 spot dirating, 0 badge, progress 0/3, dan aktivitas kosong.
- Ditemukan menghitung tempat yang dibagikan sendiri. Dirating menghitung spot berbeda yang sudah diberi minimal satu dimensi rating. Tidak ada klaim kunjungan fisik karena aplikasi belum mencatat kunjungan.
- Local Guide diperoleh setelah membagikan 1 tempat. Photo Scout setelah menilai foto 5 spot berbeda. Trusted Rater setelah menilai foto dan tempat pada 5 spot berbeda.
- Level adalah 1 + pembulatan ke bawah dari (jumlah upload + jumlah spot dengan rating foto dan tempat lengkap) / 5.
- Challenge menghitung maksimal 3 spot berbeda dengan rating foto dan tempat lengkap yang `updated_at` rating-nya berada dalam 7 hari terakhir. Mengubah rating memperbarui waktunya; memberi dua dimensi pada spot yang sama tetap dihitung satu. Catatan challenge pribadi tetap bisa diedit, terpisah dari target terukur ini.
- Aktivitas menampilkan maksimal 10 kontribusi terbaru berupa upload dan rating. Setiap spot punya satu entri rating terakhir per akun, bukan arsip semua perubahan rating. Waktu ditampilkan sesuai zona waktu browser.

`ProfilePage.jsx` memuat profil saat dibuka, melakukan polling setiap 15 detik saat tab terlihat, dan menyegarkan saat tab kembali aktif. Ini pembaruan berkala REST, bukan WebSocket. Polling dijeda selama edit/simpan agar draft tidak tertimpa dan dihentikan ketika profil dilepas. Setelah pengguna upload/rating lalu membuka Profile, data terbaru diambil dari backend.

Pengujian tambahan memeriksa akun kosong, isolasi data antar akun, rating satu dimensi, perubahan rating tanpa penggandaan, badge, level, challenge 7 hari, dan batas aktivitas. Tes UI memeriksa polling serta jeda saat edit. Hasil: 9 tes backend lulus dengan 72 assertion, 5 tes frontend lulus, dan build frontend berhasil. Preferensi push/profile publik/compact tetap hanya tersimpan; efek layanan tersebut belum tersedia. Dokumen Word di docs/Dokumentasi_Teknis_KemanaYa.docx sudah diperbarui menjadi 20 halaman, termasuk profil dinamis, polling 15 detik, aturan badge/level, dan 30 pertanyaan mahasiswa beserta panduan jawaban.
