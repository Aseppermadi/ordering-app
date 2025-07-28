# OrderIn - Sistem Pemesanan Makanan QR Code

Aplikasi web Single Page Application (SPA) untuk sistem pemesanan makanan modern dengan QR Code, dibangun menggunakan React dan TypeScript.

## 🚀 Fitur Utama

### Untuk Pelanggan
- **Pemesanan Mandiri**: Scan QR Code di meja untuk mengakses menu
- **Menu Interaktif**: Tampilan menu dengan gambar, harga, dan deskripsi
- **Keranjang Belanja**: Kelola pesanan dengan mudah
- **Pembayaran Fleksibel**: Bayar online atau di kasir
- **Tracking Pesanan**: Pantau status pesanan real-time

### Untuk Kasir
- **Dashboard Real-time**: Monitor pesanan masuk secara langsung
- **Manajemen Pesanan**: Update status pesanan dan pembayaran
- **Laporan Harian**: Rekap penjualan dan transaksi
- **Notifikasi**: Alert untuk pesanan baru

### Untuk Owner
- **Analytics Dashboard**: Analisis penjualan dan performa bisnis
- **Manajemen Menu**: CRUD menu dengan kategori dan ketersediaan
- **Laporan Komprehensif**: Data penjualan per periode
- **Manajemen Akun**: Kelola akun kasir

## 🛠️ Tech Stack

- **Framework**: React 18 dengan TypeScript
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui dengan Tailwind CSS
- **State Management**: React Context API + useReducer
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Instalasi

1. Clone repository:
\`\`\`bash
git clone https://github.com/username/orderin-app.git
cd orderin-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Jalankan development server:
\`\`\`bash
npm run dev
\`\`\`

4. Buka browser dan akses `http://localhost:5173`

## 🔐 Demo Credentials

### Kasir
- Username: `cashier`
- Password: `cashier123`
- URL: `/cashier/login`

### Owner
- Username: `owner`
- Password: `owner123`
- URL: `/owner/login`

## 📱 Cara Penggunaan

### Untuk Pelanggan
1. Scan QR Code di meja (atau akses langsung ke `/`)
2. Browse menu dan pilih item yang diinginkan
3. Tambahkan ke keranjang dan lakukan checkout
4. Pilih metode pembayaran (online atau di kasir)
5. Pantau status pesanan di halaman tracking

### Untuk Kasir
1. Login di `/cashier/login`
2. Monitor pesanan masuk di dashboard
3. Update status pesanan (Diterima → Disiapkan → Selesai)
4. Proses pembayaran untuk pesanan "Bayar di Kasir"
5. Lihat laporan harian

### Untuk Owner
1. Login di `/owner/login`
2. Lihat analytics dan performa bisnis
3. Kelola menu (tambah, edit, hapus, toggle ketersediaan)
4. Analisis data penjualan per periode
5. Kelola akun kasir (fitur akan datang)


## 🎨 Design System

Aplikasi menggunakan design system yang terinspirasi dari GrabFood/GoFood dengan prinsip:
- **Mobile-First**: Dioptimalkan untuk pengalaman mobile
- **Clean & Modern**: Desain minimalis dengan white space yang cukup
- **Visual-First**: Menonjolkan gambar makanan berkualitas tinggi
- **Intuitive**: Alur yang jelas dari menu hingga pembayaran

## 🔄 State Management

Menggunakan React Context API dengan useReducer untuk:
- **AuthContext**: Manajemen autentikasi kasir dan owner
- **CartContext**: Manajemen keranjang belanja pelanggan
- **OrderContext**: Manajemen pesanan dan status

## 📊 API Integration

Aplikasi dirancang untuk berintegrasi dengan REST API backend dengan endpoint:
- `POST /api/auth/login` - Login kasir/owner
- `GET /api/menu` - Ambil data menu
- `POST /api/orders` - Buat pesanan baru
- `PATCH /api/orders/:id` - Update status pesanan
- `GET /api/analytics/summary` - Data analytics

## 🚀 Deployment

1. Build aplikasi:
\`\`\`bash
npm run build
\`\`\`

2. Deploy folder `dist` ke hosting pilihan (Vercel, Netlify, dll)

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**OrderIn** - Modernisasi sistem pemesanan makanan dengan teknologi QR Code 🍽️
