# OrderIn - Sistem Pemesanan Makanan QR Code

Aplikasi web Single Page Application (SPA) untuk sistem pemesanan makanan modern dengan QR Code, dibangun menggunakan React dan TypeScript.

## 📱 Screenshots

### Untuk Pelanggan (Customer Interface)

#### Menu & Pemesanan
<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone-13-PRO-MAX-localhost%20%281%29-ZngR20saVSNGjgk0A4TfFBn6h6SHn6.png" alt="Customer Menu" width="300"/>
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone-13-PRO-MAX-localhost%20%282%29-vYvFHiJjxYX7IBR4woyy2Soc4f79z5.png" alt="Shopping Cart" width="300"/>
</div>

*Halaman menu interaktif dengan kategori dan keranjang belanja yang mudah digunakan*

#### Checkout & Status Pesanan
<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone-13-PRO-MAX-localhost%20%283%29-FNIAFQiOc9QjZlwanaThRek1Bhmyep.png" alt="Checkout Process" width="300"/>
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone-13-PRO-MAX-localhost%20%284%29-KqLWiG81dFyxUOPBHSx9yrn50xRkdC.png" alt="Order Status" width="300"/>
</div>

*Proses checkout dengan pilihan pembayaran dan tracking status pesanan real-time*

### Untuk Kasir (Cashier Interface)

<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPad-PRO-11-localhost-K4jR7ju3JhbFJyps9rYXJqww1z6Ho3.png" alt="Cashier Dashboard" width="600"/>
</div>

*Dashboard kasir dengan manajemen pesanan real-time, indikator urgency, dan statistik harian*

### Untuk Owner (Owner Interface)

#### Dashboard Analytics
<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPad-PRO-11-localhost%20%281%29-WjxcmXW59YMG2BWSnNh7VMOnGgApMg.png" alt="Owner Dashboard" width="600"/>
</div>

*Dashboard owner dengan analytics komprehensif, produk terlaris, dan laporan penjualan*

#### Menu Management
<div align="center">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPad-PRO-11-localhost%20%283%29-tP52IPn351thZIe9tmFzaWHoKrujzE.png" alt="Menu Management" width="600"/>
</div>

*Sistem manajemen menu dengan CRUD operations dan toggle ketersediaan*

## 🚀 Fitur Utama

### Untuk Pelanggan
- **Pemesanan Mandiri**: Scan QR Code di meja untuk mengakses menu
- **Menu Interaktif**: Tampilan menu dengan gambar, harga, dan deskripsi
- **Keranjang Belanja**: Kelola pesanan dengan mudah
- **Pembayaran Fleksibel**: Bayar online atau di kasir
- **Tracking Pesanan**: Pantau status pesanan real-time
- **Perhitungan Pajak**: Otomatis menghitung PPN 12%

### Untuk Kasir
- **Dashboard Real-time**: Monitor pesanan masuk secara langsung
- **Manajemen Pesanan**: Update status pesanan dan pembayaran
- **Indikator Urgency**: Visual alert untuk pesanan yang sudah lama menunggu
- **Laporan Harian**: Rekap penjualan dan transaksi
- **Notifikasi**: Alert untuk pesanan baru
- **Menu Management**: Kelola menu dan ketersediaan item

### Untuk Owner
- **Analytics Dashboard**: Analisis penjualan dan performa bisnis
- **Manajemen Menu**: CRUD menu dengan kategori dan ketersediaan
- **Laporan Komprehensif**: Data penjualan per periode
- **Top Products**: Analisis produk terlaris
- **Revenue Tracking**: Monitoring pendapatan real-time

## 🛠️ Tech Stack

- **Framework**: React 18 dengan TypeScript
- **Routing**: React Router DOM
- **UI Components**: shadcn/ui dengan Tailwind CSS
- **State Management**: React Context API + useReducer
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS dengan design system modern

## 📦 Instalasi

1. Clone repository:
```bash
git clone https://github.com/Aseppermadi/ordering-app.git
cd orderin-app
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

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
1. **Akses Menu**: Scan QR Code di meja atau akses langsung ke `/`
2. **Browse Menu**: Pilih kategori (Best Seller, Makanan, Minuman, Cemilan)
3. **Tambah ke Keranjang**: Klik "Tambah ke Keranjang" pada item yang diinginkan
4. **Review Pesanan**: Lihat keranjang dan sesuaikan quantity jika diperlukan
5. **Checkout**: Masukkan nomor meja dan pilih metode pembayaran
6. **Pembayaran**: Pilih bayar online atau di kasir
7. **Tracking**: Pantau status pesanan di halaman tracking

### Untuk Kasir
1. **Login**: Masuk di `/cashier/login`
2. **Monitor Pesanan**: Lihat pesanan masuk dengan indikator urgency
3. **Update Status**: Ubah status pesanan (Diterima → Disiapkan → Selesai)
4. **Proses Pembayaran**: Konfirmasi pembayaran untuk pesanan "Bayar di Kasir"
5. **Kelola Menu**: Akses menu management untuk update ketersediaan
6. **Lihat Detail**: Klik pesanan untuk melihat detail lengkap

### Untuk Owner
1. **Login**: Masuk di `/owner/login`
2. **Dashboard Analytics**: Lihat performa bisnis dan statistik penjualan
3. **Kelola Menu**: Tambah, edit, hapus, dan toggle ketersediaan menu
4. **Analisis Data**: Review produk terlaris dan tren penjualan
5. **Laporan**: Akses analytics untuk data penjualan per periode

## 🏗️ Struktur Project

```
src/
├── components/          # Komponen reusable
│   ├── ui/             # shadcn/ui components
│   └── ProtectedRoute.tsx
├── contexts/           # React Context untuk state management
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   └── OrderContext.tsx
├── pages/              # Halaman aplikasi
│   ├── customer/       # Halaman untuk pelanggan
│   │   ├── CustomerMenu.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   └── OrderStatus.tsx
│   ├── cashier/        # Halaman untuk kasir
│   │   ├── CashierLogin.tsx
│   │   ├── CashierDashboard.tsx
│   │   ├── CashierMenuManagement.tsx
│   │   └── OrderDetail.tsx
│   └── owner/          # Halaman untuk owner
│       ├── OwnerLogin.tsx
│       ├── OwnerDashboard.tsx
│       ├── MenuManagement.tsx
│       └── Analytics.tsx
├── data/               # Mock data dan types
├── hooks/              # Custom hooks
└── lib/                # Utilities dan helpers
```

## 🎨 Design System

Aplikasi menggunakan design system yang terinspirasi dari GrabFood/GoFood dengan prinsip:

- **Mobile-First**: Dioptimalkan untuk pengalaman mobile
- **Clean & Modern**: Desain minimalis dengan white space yang cukup
- **Visual-First**: Menonjolkan gambar makanan berkualitas tinggi
- **Intuitive**: Alur yang jelas dari menu hingga pembayaran
- **Responsive**: Tampilan optimal di semua device (mobile, tablet, desktop)
- **Accessibility**: Mengikuti best practices untuk aksesibilitas

## 🔄 State Management

Menggunakan React Context API dengan useReducer untuk:

- **AuthContext**: Manajemen autentikasi kasir dan owner
- **CartContext**: Manajemen keranjang belanja pelanggan dengan perhitungan pajak
- **OrderContext**: Manajemen pesanan dan status real-time

## 📊 Fitur Unggulan

### Sistem Urgency untuk Kasir
- **Indikator Visual**: Pesanan ditandai berdasarkan waktu tunggu
- **Color Coding**: Merah untuk kritis (>45 menit), Orange untuk urgent (>30 menit)
- **Auto Refresh**: Data pesanan diperbarui otomatis setiap 30 detik

### Perhitungan Pajak Otomatis
- **PPN 12%**: Otomatis menghitung dan menampilkan pajak
- **Transparent Pricing**: Breakdown harga yang jelas untuk pelanggan
- **Compliance**: Sesuai dengan ketentuan perpajakan yang berlaku

### Analytics Komprehensif
- **Real-time Data**: Statistik penjualan yang selalu update
- **Product Performance**: Analisis produk terlaris
- **Revenue Tracking**: Monitoring pendapatan per periode
- **Time-based Analysis**: Data penjualan per jam dan hari

## 📱 Responsive Design

- **Mobile**: Optimized untuk smartphone (320px - 768px)
- **Tablet**: Layout yang disesuaikan untuk tablet (768px - 1024px)
- **Desktop**: Full-featured experience untuk desktop (>1024px)

## 🚀 Deployment

1. Build aplikasi:
```bash
npm run build
```

2. Deploy folder `dist` ke hosting pilihan (Vercel, Netlify, dll)

## 🔮 Roadmap

- [ ] **Backend Integration**: Integrasi dengan REST API
- [ ] **Payment Gateway**: Integrasi dengan payment provider
- [ ] **Push Notifications**: Real-time notifications
- [ ] **QR Code Generator**: Generate QR code untuk meja
- [ ] **User Management**: Sistem manajemen user yang lebih lengkap
- [ ] **Multi-language**: Support bahasa Indonesia dan Inggris
- [ ] **PWA**: Progressive Web App capabilities
- [ ] **Print Integration**: Print receipt dan kitchen orders

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

