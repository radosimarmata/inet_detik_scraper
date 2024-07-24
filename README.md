# inet_detik_scraper
`inet_detik_scraper` adalah sebuah proyek web scraper yang dirancang untuk mengambil data berita dari situs web https://inet.detik.com. Proyek ini menggunakan Puppeteer untuk mengotomatisasi browser dan mengekstrak informasi dari halaman web.

## Fitur
Ekstraksi Data Berita: Mengambil judul berita, URL, gambar, dan tanggal dari halaman berita di https://inet.detik.com.
- Otomatisasi Browser: Menggunakan Puppeteer untuk mengontrol browser dan mengekstrak data secara otomatis.
Pengelolaan Tanggal: Memungkinkan pengambilan berita berdasarkan tanggal yang ditentukan, baik hari ini maupun tanggal yang diinput secara manual.
- Pengelompokan dan Penyimpanan: Mengelompokkan artikel berdasarkan tanggal dan menyimpannya dalam file JSON terpisah untuk kemudahan akses dan analisis.

## Prasyarat
Sebelum memulai, pastikan Anda memiliki [Node.js](https://nodejs.org/) dan [npm](https://www.npmjs.com/) terinstal di komputer Anda.

## Instalasi
1. **Clone Repository**
  Clone repository ini ke mesin lokal Anda:

  ```
  git clone https://github.com/radosimarmata/inet_detik_scraper.git
  ```

2. **Navigasi ke Direktori Proyek**
  Pindah ke direktori proyek:
  ```
  cd inet_detik_scraper
  ```

3. **Instal Dependensi**
  Instal dependensi yang diperlukan dengan npm:
  ```
  npm install
  ```

## Penggunaan
  Jalankan skrip scraping dengan perintah berikut:
  ```
  node index.js
  ```
  Skrip ini akan membuka browser, mengunjungi halaman https://inet.detik.com, dan mencetak data berita yang diambil ke results.

## Konfigurasi
Saat menjalankan skrip, Anda akan diminta untuk memilih opsi:
1. Hari Ini: Mengambil berita untuk hari ini.
2. Manual: Memasukkan tanggal secara manual dalam format YYYY-MM-DD.

## Struktur Folder
index.js: Skrip utama untuk menjalankan proses scraping.
results/: Folder tempat file JSON yang berisi data berita disimpan.

## Dukungan
Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buka issue di GitHub.