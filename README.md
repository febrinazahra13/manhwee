# 📚 Manhwee

**Manhwee** is a web application for **tracking your manhwa reading list**, featuring CRUD functionality, reading statistics, Firebase authentication, and interactive detail views.  
Developed as part of the **Capstone Project - Student Developer Initiative (IBM x Hacktiv8)**.

🌐 Live Demo → [https://manhwee.vercel.app/]
📦 Repository → [https://github.com/febrinazahra13/manhwee]

---

## 🚀 Project Overview

Manhwee helps users to:  
- Create an account & log in using **Firebase Authentication**.  
- Add, edit, and delete manhwa in their reading list.  
- View full details of each manhwa in an interactive modal.  
- Track reading status: `Not Started`, `Reading`, `Completed`, `Dropped`.  
- Visualize reading statistics: monthly charts, progress pie chart, and genre insights.  
- Store additional preferences (e.g., cover position) using **localStorage**.  

---

## 🛠️ Technologies Used

- **Frontend Framework:** React + TypeScript + Vite  
- **UI Styling:** Tailwind CSS + Framer Motion + Lucide Icons  
- **Charts & Visualization:** Recharts  
- **Authentication & Database:** Firebase (Auth + Firestore)  
- **State Persistence (Optional):** localStorage  
- **Deployment:** Vercel  

---

## ✨ Features

### 🔑 Authentication
- Signup & login with **Firebase Authentication**.  
- Session management & protected routes via `ProtectedRoute.tsx`.  

### 📋 Dashboard
- Add, edit, and delete manhwa.  
- Real-time sorting, filtering, and search.  
- Context menu (right-click → Edit/Delete).  

### ➕ Add/Edit Manhwa
- Input manhwa details: title, author, status, type, genres, rating, cover, link, etc.  

### 🔍 Detail Modal
- Click a manhwa item to open a modal with full information.  
- Displays cover, title, author, type, genres, status, rating, chapters, link, start/finish dates, and notes.  
- Cover can be repositioned and stored locally.  

### 📊 Statistics Page
- Monthly "Completed per Month" chart.  
- Pie chart for reading progress (Completed, Reading, Not Started, Dropped).  
- Achievement badges (e.g., “10 Manhwa Completed!”).  
- Genre insights → recommended favorite genres.  

### 👤 Profile (Optional / Placeholder)
- User profile placeholder (username/email).  
- Plan to display summary of reading progress & achievements.  

---

## 🤖 AI Support

During development, **IBM Granite AI** and **ChatGPT (OpenAI)** were used to:  

- Generate boilerplate React components (Dashboard, Stats, Form).  
- Create TypeScript templates for CRUD logic and custom hooks.  
- Draft code for charts (Recharts LineChart & PieChart).  
- Structure the detail modal and interactive UI components.  

> Note: AI was used **only during the development phase** and is not included in the final product.  

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

1. Clone the repository:
(```bash)
git clone https://github.com/febrinazahra13/manhwee.git
cd manhwee

2. Install dependencies:
npm install
or
yarn install

3. Run the development server:
npm run dev

4. Open your browser at:
http://localhost:5173

## 📌 Deployment

The project is deployed via Vercel.
To redeploy manually:
vercel --prod

## 🧑‍💻 Author
Mahdiyyah Febrinazahra
Capstone Project - Student Developer Initiative (IBM x Hacktiv8)