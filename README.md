# 📦 Kafka + Node.js Setup Guide

## 🧱 Kafka Setup

### 1. Install Kafka versi 3.6.1

Unduh Kafka dari Apache Archive:
https://archive.apache.org/dist/kafka/3.6.1/kafka_2.13-3.6.1.tgz

---

### 2. Konfigurasi Kafka

Ikuti panduan konfigurasi Kafka pada Notion berikut:
👉 [KAFKA SETUP Guide](https://www.notion.so/KAFKA-SETUP-1ecf555aad7f800c825fe719c5c064f9)

---

### 3. Jalankan Kafka

Buka terminal dan jalankan sesuai instruksi pada notion

---

## 💄 Database Setup

1. Buat database sesuai dengan nama yang dibutuhkan oleh aplikasimu (misalnya `my_app_db`).
2. Tambahkan tabel-tabel yang dibutuhkan, misalnya `users`, `products`, dan lainnya sesuai skema proyek.

---

## 🔧 Node.js Setup

### 1. Install Dependency

npm install

---

### 2. Jalankan Aplikasi

Untuk mode development:

npm run dev
Atau:
npm start

---

## 🦪 Testing

### ♻ Test Kafka Request

Gunakan script berikut untuk mengirim bulk request ke Kafka:

node testBulkRequest.js

---

### 📡 Test API User Registration

Jalankan perintah `curl` di terminal untuk menguji endpoint:
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name": "User Test"}'

---

✅ Pastikan semua service (Kafka, database, dan Node.js app) berjalan dengan benar sebelum melakukan testing.
