# inet_detik_scraper

`inet_detik_scraper` adalah sebuah proyek web scraper yang dirancang untuk mengambil data berita dari situs web Detik.com. Proyek ini menggunakan Puppeteer untuk mengotomatisasi browser dan mengekstrak informasi dari halaman web.

## Fitur

- Mengambil judul berita, URL, gambar, dan tanggal dari halaman Detik.com.
- Menggunakan Puppeteer untuk mengotomatisasi proses scraping.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki [Node.js](https://nodejs.org/) dan [npm](https://www.npmjs.com/) terinstal di komputer Anda.

## Instalasi

1. **Clone Repository**

  Clone repository ini ke mesin lokal Anda:

  ```bash
  git clone https://github.com/radosimarmata/inet_detik_scraper.git

2. **Navigasi ke Direktori Proyek**
  Pindah ke direktori proyek:
  ```bash
  cd inet_detik_scraper

3. **Instal Dependensi**
  Instal dependensi yang diperlukan dengan npm:
  ```bash
  npm install

## Penggunaan
  Jalankan skrip scraping dengan perintah berikut:

  ```bash
  node index.js
  ```
  Skrip ini akan membuka browser, mengunjungi halaman https://inet.detik.com/indeks, dan mencetak data berita yang diambil ke konsol.