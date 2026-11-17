# API publik KemanaYa

Base URL: **https://kemanaya-api.vercel.app/api**

## Upload foto galeri

`POST /places` menerima `multipart/form-data` dengan field `photo` (file JPEG,
PNG, atau WebP, maksimal 512 KiB dan dimensi maksimal 4096 x 4096), ditambah
name, location, category, description, serta latitude/longitude opsional. Sertakan
Bearer token; biarkan browser mengatur Content-Type beserta multipart boundary.
File diperiksa berdasarkan isi gambar. URL `image` lama masih diterima bila
tidak mengirim `photo`.

Respons `data.image` adalah URL `GET /places/{id}/photo` untuk upload baru.
Gambar tersedia publik seperti feed spot, tersimpan di database, dan terhapus
bersama spot. Respons gambar memakai Content-Type sesuai gambar dan nosniff.

## Pengelolaan spot dan pin lokasi

`DELETE /places/{id}` menghapus spot dan rating terkait. `PATCH /places/{id}/location`
menyimpan `{ "latitude": -6.9, "longitude": 107.6 }`. Kedua endpoint memerlukan
Bearer token pemilik spot; akun lain mendapat 403. Latitude harus -90 sampai 90
dan longitude -180 sampai 180. Field koordinat juga dapat dikirim saat membuat
spot dan dikembalikan pada daftar/detail; spot lama bernilai null sampai ditandai.

Migrasi `2026_11_17_000001_add_coordinates_to_places` sudah diterapkan ke Neon
production pada 17 November 2026 melalui SQL Editor (dua kolom numeric nullable
dan pencatatan migration). API publik sudah diperbarui, termasuk CORS DELETE.

Backend Laravel berjalan di Vercel Hobby dan database PostgreSQL di Neon Free.
Laptop tidak harus menyala. Biaya Rp0 selama akun menggunakan paket gratis
dan pemakaian tetap dalam kuota layanan. Ini bukan jaminan layanan gratis selamanya.

## Mengakses dari aplikasi atau web lain

```js
const API = 'https://kemanaya-api.vercel.app/api';
const response = await fetch(`${API}/places`, {
  headers: { Accept: 'application/json' },
});
const { data: places } = await response.json();
console.log(places);
```

Daftar tempat dan detail bisa dibaca tanpa login. Data awal kosong; tambahkan
tempat setelah mendaftar akun. Browser dari origin mana pun diizinkan melalui
CORS; endpoint penulisan tetap memerlukan token akun.

## Endpoint

| Metode | Path setelah base URL | Akses |
| --- | --- | --- |
| GET | `/places` | Publik |
| GET | `/places/{id}` | Publik |
| POST | `/auth/register` | Publik; nama, email, password minimal 8 karakter; city opsional |
| POST | `/auth/login` | Publik; email dan password |
| GET | `/me` | Bearer token |
| PATCH | `/me` | Bearer token |
| POST | `/places` | Bearer token |
| PUT | `/places/{id}/rating` | Bearer token |
| POST | `/auth/logout` | Bearer token |

Gunakan header `Accept: application/json` dan `Content-Type: application/json`
untuk body JSON. Register/login mengembalikan `data.token` dan `data.user`.
Token berlaku 7 hari dan dicabut saat logout. Jangan membagikan token pribadi.

```js
const loginResponse = await fetch(`${API}/auth/login`, {
  method: 'POST',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'email-akunmu', password: 'password-akunmu' }),
});
const login = await loginResponse.json();
if (!loginResponse.ok) throw new Error(login.message);

const profile = await fetch(`${API}/me`, {
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${login.data.token}`,
  },
});
console.log(await profile.json());
```

Body tambah tempat: `name`, `location`, `category`, `description`, `image`
(URL gambar HTTP/HTTPS). Category harus sama persis dengan salah satu nilai di
`backend/config/spots.php`, misalnya `Kafe, hidden gem, low budget`.
Body rating: `photoScore` dan/atau `placeScore`, angka antara 1 dan 5.

Respons sukses memakai `data`. Error validasi 422, belum login 401,
data tidak ditemukan 404, dan batas request 429. Register/login dibatasi
10 request/menit; endpoint akun dibatasi 120 request/menit per kebijakan backend.

## Aplikasi di workspace ini

File `.env` frontend sudah mengarah ke API publik. Vite perlu dimulai ulang
jika konfigurasi environment belum terambil. Build baru melalui `npm run build`.
Database SQLite lokal tidak dipindahkan: saat deployment database lokal kosong.

## Deploy perubahan berikutnya

Jalankan `npx vercel --prod` dari direktori `backend` menggunakan akun pemilik.
Konfigurasi ada di `backend/vercel.json` dan entry point `backend/api/index.php`.
Rahasia koneksi Neon dan APP_KEY disimpan sebagai environment Vercel;
jangan memasukkannya ke frontend atau repository.

Migrasi berikutnya dijalankan dari lingkungan tepercaya memakai PHP PDO PostgreSQL,
`DB_CONNECTION=pgsql`, `DB_URL` koneksi langsung Neon (non-pooling),
dan `DB_SSLMODE=require`, lalu `php artisan migrate --force`.
Jangan menjalankan tes yang mereset database terhadap database publik.

Dashboard Vercel: https://vercel.com/jonathaneldokusumas-projects/kemanaya-api

Dashboard Neon: https://console.neon.tech/app/projects/steep-band-90130180/branches/br-flat-haze-a1itp6o0
