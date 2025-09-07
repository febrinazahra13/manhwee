# 📚 Manhwee

**Manhwee** adalah aplikasi web untuk **melacak daftar bacaan manhwa** dengan fitur CRUD, statistik bacaan, autentikasi Firebase, dan detail view interaktif.  
Dibuat sebagai bagian dari **Capstone Project - Student Developer Initiative (IBM x Hacktiv8)**.

🌐 Live Demo → (https://manhwee.vercel.app/)  
📦 Repository → (https://github.com/febrinazahra13/manhwee)

---

## 🚀 Project Overview

Manhwee membantu pengguna:
- Membuat akun & login menggunakan **Firebase Authentication**.  
- Menambahkan, mengedit, dan menghapus daftar bacaan manhwa.  
- Melihat detail lengkap tiap manhwa dalam modal interaktif.  
- Melacak status bacaan: `Not Started`, `Reading`, `Completed`, `Dropped`.  
- Melihat statistik bacaan: grafik bulanan, pie chart progress, dan insights genre.  
- Menyimpan preferensi tambahan (misalnya posisi cover) menggunakan **localStorage**.  

---

## 🛠️ Technologies Used

- **Frontend Framework**: React + TypeScript + Vite  
- **UI Styling**: Tailwind CSS + Framer Motion + Lucide Icons  
- **Charts & Visualization**: Recharts  
- **Authentication & Database**: Firebase (Auth + Firestore)  
- **State Persistence (Tambahan)**: localStorage (untuk caching ringan)  
- **Deployment**: Vercel  

---

## ✨ Features

### 🔑 Authentication
- Signup & login menggunakan **Firebase Authentication**.  
- Session management & protected routes via `ProtectedRoute.tsx`.  

### 📋 Dashboard
- Tambah, edit, hapus manhwa.  
- Sorting, filtering, dan pencarian real-time.  
- Context menu (klik kanan → Edit/Delete).  

### ➕ Add/Edit Manhwa
- Input detail manhwa: judul, author, status, type, genres, rating, cover, link, dll.  

### 🔍 Detail Modal
- Klik item untuk membuka modal dengan info lengkap.  
- Menampilkan cover, judul, author, type, genres, status, rating, jumlah chapter, link, tanggal mulai/selesai, dan catatan.  
- Cover bisa **di-reposition** dan disimpan secara lokal.  

### 📊 Stats Page
- Grafik *Completed per Month*.  
- Pie chart progress bacaan (Completed, Reading, Not Started, Dropped).  
- Achievements (contoh: “10 Manhwa Completed!”).  
- Genre insights → rekomendasi genre favorit pengguna.  

### 👤 Profile (Optional / Dummy)
- Placeholder profile user (username/email).  
- Rencana menampilkan ringkasan progress & achievement.  

---

## 🤖 AI Support Explanation

Selama pengembangan, **IBM Granite AI** digunakan untuk:

- Generate boilerplate React components (Dashboard, Stats, Form).  
- Menyusun template logic CRUD dan hooks dengan TypeScript.  
- Membuat draft kode chart (Recharts LineChart & PieChart).  
- Menyusun struktur modal detail.  

> Catatan: AI hanya digunakan **pada fase pengembangan**, tidak disertakan dalam produk akhir.

---

## 📂 Project Structure

src/
│── components/           # Reusable UI components
│   ├── DetailModal.tsx
│   └── ProtectedRoute.tsx
│
│── hooks/                # Custom hooks
│   └── useLocalStorage.ts
│
│── pages/                # Halaman utama aplikasi
│   ├── Dashboard.tsx
│   ├── Landing.tsx
│   ├── NewManhwa.tsx
│   ├── Signup.tsx
│   └── Stats.tsx
│
│── types/                # TypeScript type definitions
│   └── connect-history-app.ts
│
│── App.tsx               # Root component
│── App.css               # Global CSS
│── index.css             # Tailwind base styles
│── main.tsx              # Entry point React
│── firebase.ts           # Firebase config (jika digunakan)
│── types.ts              # Shared types
│── vite-env.d.ts         # Vite typings
│
.eslint.config.js         # ESLint config
index.html                # HTML template
postcss.config.js         # PostCSS config
tailwind.config.js        # Tailwind config
tsconfig*.json            # TypeScript config
vite.config.ts            # Vite config
server.js                 # (opsional) server setup
package.json              # Project dependencies


---

## ⚡ Setup Instructions

1. Clone repository:
(```bash)
git clone https://github.com/febrinazahra13/manhwee.git
cd manhwee

2. Install dependencies:
npm install
atau
yarn install

3. Jalankan development server:
npm run dev

4. Buka browser di:
http://localhost:5173

## 📌 Deployment

Project ini sudah di-deploy menggunakan Vercel.
Untuk redeploy manual:
vercel --prod

## 🧑‍💻 Author
Mahdiyyah Febrinazahra
Capstone Project - Student Developer Initiative (IBM x Hacktiv8)