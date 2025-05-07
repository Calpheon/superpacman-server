# SUPERPACMAN

## Deskripsi Proyek

**SUPERPACMAN** adalah game multiplayer real-time berbasis web yang terinspirasi dari Pacman, di mana pemain bersaing mengumpulkan poin di papan permainan sambil menghindari kejaran ghost (hantu) yang dikendalikan oleh AI cerdas (Gemini-AI). Game ini menonjolkan fitur banner motivasi yang dibantu Gemini AI, leaderboard real-time, serta berbagai tip strategi untuk pemain.

Proyek ini terdiri dari dua bagian utama:
- **Frontend (client):** Dibangun dengan React + Vite, menampilkan papan permainan, leaderboard, dan fitur Gemini AI.
- **Backend (server):** Menggunakan Node.js, Express, dan Socket.IO untuk komunikasi real-time, manajemen state game, serta AI ghost logic.

---

## Struktur Direktori

```
SUPERPACMAN/
│
├── client/                # Frontend React
│   ├── src/               # Kode sumber React
│   │   ├── assets/        # Aset gambar dan statis
│   │   ├── components/    # Komponen UI (GameBoard, Leaderboard, dll)
│   │   ├── context/       # React Context API (GameContext)
│   │   ├── hooks/         # Custom hooks (useKeyboard)
│   │   ├── services/      # Service API (Gemini, socket)
│   │   ├── utils/         # Fungsi utilitas
│   │   ├── App.jsx        # Komponen utama
│   │   └── main.jsx       # Entry point
│   ├── public/            # File statis
│   ├── package.json       # Dependensi frontend
│   └── vite.config.js     # Konfigurasi Vite
│
├── server/                # Backend Node.js
│   ├── config/            # Konfigurasi server (socket)
│   ├── controllers/       # Handler socket events
│   ├── data/              # Data persistensi (leaderboard)
│   ├── gameLogic/         # Logika utama game
│   │   ├── gameState.js   # State management
│   │   ├── ghostAI.js     # Kecerdasan hantu
│   │   └── leaderboard.js # Pengelolaan skor
│   ├── routes/            # API routes
│   ├── index.js           # Entry point server
│   └── package.json       # Dependensi backend
│
├── README.md              # Dokumentasi utama
└── step-step.md           # Panduan step by step
```

---

## Cara Instalasi & Menjalankan Proyek

### 1. Prasyarat
- Node.js v18+ (disarankan)
- npm

### 2. Menjalankan Backend (Server)
Masuk ke folder `server` dan install dependensi:
```bash
cd server
npm install
```
Jalankan server:
```bash
npm run dev
```
Server akan berjalan di port **3001** (atau sesuai variabel `PORT`).

### 3. Menjalankan Frontend (Client)
Buka terminal baru, masuk ke folder `client`:
```bash
cd client
npm install
```
Jalankan aplikasi React:
```bash
npm run dev
```
Frontend akan berjalan di port **5173** (default Vite). Akses melalui browser di `http://localhost:5173`.

---

## Penjelasan Fitur Utama

### 1. **Game Board (Papan Permainan)**
- Grid 20x20, menampilkan posisi pemain sebagai PacMan dan ghost dengan desain visual menarik.
- Pemain dapat bergerak menggunakan tombol panah.
- Setiap kali pemain mengumpulkan semua titik, level meningkat dan hantu baru muncul.

### 2. **Leaderboard**
- Menampilkan peringkat pemain berdasarkan skor secara real-time.
- Menyimpan dan menampilkan skor tertinggi sepanjang masa.

### 3. **Motivational Banner dengan Gemini AI**
- Banner yang menampilkan pesan motivasi dan tips menggunakan Gemini API.
- Pesan disesuaikan dengan situasi game (skor, jumlah hantu, titik tersisa).

### 4. **GeminiCoach**
- Memberikan peringatan ketika ghost mendekat.
- Menyediakan tips taktis berdasarkan situasi permainan saat ini.

### 5. **AI Ghost**
- Ghost dengan 3 tipe personality: chaser, ambusher, patroller.
- AI menganalisis dan beradaptasi dengan pergerakan pemain.
- Peningkatan kesulitan progresif saat pemain naik level.

### 6. **Real-time Multiplayer**
- Pemain dapat join dengan nama unik.
- Semua aksi pemain di-broadcast ke semua client secara real-time.

---

## Arsitektur & Alur Data

1. **Pemain join** → frontend mengirim event `joinGame` ke backend.
2. **Pergerakan pemain** → frontend mengirim event `move` ke backend.
3. **Backend**:
   - Update posisi, skor, status pemain.
   - Update posisi ghost dengan AI.
   - Broadcast state terbaru ke semua client.
4. **Frontend**:
   - Render papan, leaderboard, dan banner motivasi.
   - Kirim context game ke Gemini API untuk mendapatkan pesan motivasi yang relevan.

---

## Penanganan Error & Edge Case

- **Validasi State:** Semua fungsi backend melakukan pengecekan null/undefined.
- **Regenerasi Point:** Titik baru di-generate saat pemain mengumpulkan semua titik.
- **Invulnerability:** Pemain mendapat periode invulnerability setelah kehilangan nyawa.
- **Fallback Gemini:** Sistem fallback pesan lokal jika Gemini API tidak merespons.
- **Retry Socket:** Koneksi socket akan mencoba tersambung ulang otomatis.

---

## Dependensi Utama

### Backend
- `express`: HTTP server
- `socket.io`: Real-time communication
- `cors`: Cross-origin resource sharing
- `nodemon`: Auto-restart development

### Frontend
- `react`, `react-dom`: UI library
- `socket.io-client`: Real-time client
- `vite`: Build tool

---

## Pengembangan & Standar Kode

- **Frontend**: Menggunakan React hooks, context API, dan komponen modular.
- **Backend**: Arsitektur modular dengan pemisahan jelas antar komponen.
- **Kode**: Fungsi diberi komentar JSDoc untuk dokumentasi inline.
- **Error Handling**: Penanganan error di setiap layer aplikasi.

---

## Potensi Pengembangan Lanjutan

- Power-up khusus seperti "pemakan hantu".
- Mode permainan kooperatif.
- Visualisasi prediksi pergerakan ghost.
- Sistem achievement dan level pemain.
- Leaderboard global dengan login/authentication.

---

**Catatan:**  
Jika ada pertanyaan lebih lanjut atau ingin kontribusi, silakan hubungi maintainer atau buka issue di repository ini.

---

Dokumentasi ini telah disusun berdasarkan analisis seluruh file dan struktur proyek. Jika ada perubahan besar pada kode, harap perbarui dokumentasi ini agar tetap relevan.