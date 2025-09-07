# 📚 Manhwee

**Manhwee** adalah aplikasi web untuk **melacak daftar bacaan manhwa** dengan fitur CRUD, statistik bacaan, autentikasi sederhana, dan detail view interaktif.  
Dibuat sebagai bagian dari **Capstone Project - Student Developer Initiative (IBM x Hacktiv8)**.

---

## 🚀 Project Overview
Manhwee membantu pengguna:
- Membuat akun & login sederhana.
- Menambahkan, mengedit, dan menghapus daftar bacaan manhwa.
- Melihat detail lengkap tiap manhwa.
- Melihat status bacaan (Not Started, Reading, Completed, Dropped).
- Melihat statistik bacaan berupa grafik, progress, dan insights.
- Menyimpan data lokal menggunakan **localStorage**.

---

## 🛠️ Technologies Used
- **Frontend Framework**: React + TypeScript + Vite  
- **UI Styling**: Tailwind CSS + Framer Motion + Lucide Icons  
- **Charts & Visualization**: Recharts  
- **State Persistence**: LocalStorage (dummy auth + data manhwa)  
- **Deployment**: Vercel  

---

## ✨ Features
- 🔑 **Authentication**  
  - Signup & login sederhana (disimpan di localStorage).  
  - Dummy token session untuk proteksi halaman.

- 📋 **Dashboard**  
  - Tambah/Edit/Hapus manhwa.  
  - Sorting, filtering, dan pencarian.  
  - Context menu (klik kanan → Edit/Delete).  

- ➕ **Add/Edit Manhwa**  
  - Input detail manhwa: judul, author, status, type, genres, rating, cover, link, dll.  

- 🔍 **Detail Modal**  
  - Klik item untuk membuka modal dengan info lengkap.  
  - Menampilkan cover, judul, author, type, genres, status, rating, jumlah chapter, link, tanggal mulai/selesai, dan catatan.  
  - Cover bisa **di-reposition** dan disimpan secara lokal.  

- 📊 **Stats Page**  
  - Grafik *Completed per Month*.  
  - Pie chart progress bacaan (Completed, Reading, Not Started, Dropped).  
  - Achievements (contoh: “10 Manhwa Completed!”).  
  - Genre insights → rekomendasi genre favorit pengguna.

- 👤 **Profile (optional/dummy)**  
  - Placeholder profile user (username/email).  
  - Rencana menampilkan ringkasan progress & achievement.  

---

## 🤖 AI Support Explanation
Selama pengembangan, **IBM Granite AI** digunakan untuk:
- Membantu generate boilerplate React components (Dashboard, Stats, Form).  
- Menyusun template logic CRUD dan hooks dengan TypeScript.  
- Membuat draft kode chart (Recharts LineChart & PieChart).  
- Membantu menyusun struktur modal detail.  

> Catatan: AI hanya digunakan pada **fase pengembangan**, tidak disertakan dalam produk akhir.

---

## 📂 Setup Instructions
1. Clone repository ini:
   ```bash
   git clone https://github.com/febrinazahra13/manhwee.git