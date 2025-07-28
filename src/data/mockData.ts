export interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  isAvailable: boolean
  rating?: number
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: number
  tableNumber: number
  items: OrderItem[]
  totalAmount: number
  paymentStatus: "PAID" | "UNPAID"
  orderStatus: "RECEIVED" | "PREPARING" | "COMPLETED"
  createdAt: string
  customerName?: string
  customerPhone?: string
  notes?: string
}

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    price: 25000,
    description: "Nasi goreng dengan telur, ayam suwir, dan acar",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan",
    isAvailable: true,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Ayam Bakar Madu",
    price: 35000,
    description: "Ayam bakar dengan bumbu madu dan sambal terasi",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan",
    isAvailable: true,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Mie Ayam Bakso",
    price: 20000,
    description: "Mie ayam dengan bakso dan pangsit goreng",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan",
    isAvailable: true,
    rating: 4.3,
  },
  {
    id: "4",
    name: "Gado-gado",
    price: 18000,
    description: "Sayuran segar dengan bumbu kacang",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan",
    isAvailable: true,
    rating: 4.2,
  },
  {
    id: "5",
    name: "Soto Ayam",
    price: 22000,
    description: "Soto ayam dengan nasi dan kerupuk",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan",
    isAvailable: true,
    rating: 4.6,
  },
  {
    id: "6",
    name: "Es Teh Manis",
    price: 8000,
    description: "Teh manis segar dengan es batu",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
    rating: 4.2,
  },
  {
    id: "7",
    name: "Jus Alpukat",
    price: 15000,
    description: "Jus alpukat segar dengan susu kental manis",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
    rating: 4.6,
  },
  {
    id: "8",
    name: "Es Jeruk",
    price: 10000,
    description: "Jeruk peras segar dengan es dan gula",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
    rating: 4.1,
  },
  {
    id: "9",
    name: "Kopi Hitam",
    price: 12000,
    description: "Kopi hitam robusta pilihan",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
    rating: 4.4,
  },
  {
    id: "10",
    name: "Cappuccino",
    price: 18000,
    description: "Kopi cappuccino dengan foam susu",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: "11",
    name: "Keripik Singkong",
    price: 12000,
    description: "Keripik singkong renyah dengan bumbu balado",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Cemilan",
    isAvailable: true,
    rating: 4.3,
  },
  {
    id: "12",
    name: "Pisang Goreng",
    price: 10000,
    description: "Pisang goreng crispy dengan gula halus",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Cemilan",
    isAvailable: true,
    rating: 4.0,
  },
  {
    id: "13",
    name: "Tahu Isi",
    price: 8000,
    description: "Tahu goreng isi sayuran dengan sambal kacang",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Cemilan",
    isAvailable: true,
    rating: 4.2,
  },
  {
    id: "14",
    name: "Es Krim Vanilla",
    price: 15000,
    description: "Es krim vanilla dengan topping coklat",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Dessert",
    isAvailable: true,
    rating: 4.5,
  },
  {
    id: "15",
    name: "Puding Coklat",
    price: 12000,
    description: "Puding coklat dengan whipped cream",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Dessert",
    isAvailable: true,
    rating: 4.3,
  },
]

// Generate realistic timestamps for today
const generateRecentTimestamp = (hoursAgo: number, minutesAgo = 0) => {
  const now = new Date()
  now.setHours(now.getHours() - hoursAgo)
  now.setMinutes(now.getMinutes() - minutesAgo)
  return now.toISOString()
}

// Mock Orders with realistic data
export const mockOrders: Order[] = [
  {
    id: "order_old_001",
    orderNumber: 95,
    tableNumber: 16,
    items: [
      { productId: "1", name: "Nasi Goreng Spesial", quantity: 1, price: 25000 },
      { productId: "6", name: "Es Teh Manis", quantity: 1, price: 8000 },
    ],
    totalAmount: 33000,
    paymentStatus: "UNPAID",
    orderStatus: "RECEIVED",
    createdAt: generateRecentTimestamp(1, 30), // 1.5 hours ago - CRITICAL
    customerName: "Pak Joko",
    customerPhone: "081234567888",
    notes: "Pesanan sudah lama menunggu",
  },
  {
    id: "order_old_002",
    orderNumber: 96,
    tableNumber: 17,
    items: [{ productId: "2", name: "Ayam Bakar Madu", quantity: 1, price: 35000 }],
    totalAmount: 35000,
    paymentStatus: "PAID",
    orderStatus: "PREPARING",
    createdAt: generateRecentTimestamp(0, 50), // 50 minutes ago - URGENT
    customerName: "Bu Siti",
    customerPhone: "081234567889",
  },
  {
    id: "order_old_003",
    orderNumber: 97,
    tableNumber: 18,
    items: [
      { productId: "3", name: "Mie Ayam Bakso", quantity: 2, price: 20000 },
      { productId: "8", name: "Es Jeruk", quantity: 2, price: 10000 },
    ],
    totalAmount: 60000,
    paymentStatus: "UNPAID",
    orderStatus: "RECEIVED",
    createdAt: generateRecentTimestamp(0, 35), // 35 minutes ago - URGENT
    customerName: "Keluarga Rahman",
    customerPhone: "081234567887",
    notes: "Mie ayam extra pedas",
  },
  {
    id: "order_001",
    orderNumber: 101,
    tableNumber: 5,
    items: [
      { productId: "1", name: "Nasi Goreng Spesial", quantity: 2, price: 25000 },
      { productId: "6", name: "Es Teh Manis", quantity: 2, price: 8000 },
    ],
    totalAmount: 66000,
    paymentStatus: "UNPAID",
    orderStatus: "RECEIVED",
    createdAt: generateRecentTimestamp(0, 5),
    customerName: "Budi Santoso",
    customerPhone: "081234567890",
    notes: "Nasi goreng tidak terlalu pedas",
  },
  {
    id: "order_002",
    orderNumber: 102,
    tableNumber: 3,
    items: [
      { productId: "2", name: "Ayam Bakar Madu", quantity: 1, price: 35000 },
      { productId: "7", name: "Jus Alpukat", quantity: 1, price: 15000 },
      { productId: "11", name: "Keripik Singkong", quantity: 1, price: 12000 },
    ],
    totalAmount: 62000,
    paymentStatus: "PAID",
    orderStatus: "PREPARING",
    createdAt: generateRecentTimestamp(0, 15),
    customerName: "Sari Dewi",
    customerPhone: "081234567891",
  },
  {
    id: "order_003",
    orderNumber: 103,
    tableNumber: 8,
    items: [
      { productId: "3", name: "Mie Ayam Bakso", quantity: 1, price: 20000 },
      { productId: "8", name: "Es Jeruk", quantity: 1, price: 10000 },
    ],
    totalAmount: 30000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(0, 25),
    customerName: "Ahmad Rizki",
    customerPhone: "081234567892",
  },
  {
    id: "order_004",
    orderNumber: 104,
    tableNumber: 12,
    items: [
      { productId: "4", name: "Gado-gado", quantity: 2, price: 18000 },
      { productId: "9", name: "Kopi Hitam", quantity: 2, price: 12000 },
      { productId: "12", name: "Pisang Goreng", quantity: 1, price: 10000 },
    ],
    totalAmount: 70000,
    paymentStatus: "UNPAID",
    orderStatus: "RECEIVED",
    createdAt: generateRecentTimestamp(0, 8),
    customerName: "Maya Sari",
    customerPhone: "081234567893",
    notes: "Gado-gado bumbu kacangnya banyak",
  },
  {
    id: "order_005",
    orderNumber: 105,
    tableNumber: 7,
    items: [
      { productId: "5", name: "Soto Ayam", quantity: 1, price: 22000 },
      { productId: "10", name: "Cappuccino", quantity: 1, price: 18000 },
    ],
    totalAmount: 40000,
    paymentStatus: "PAID",
    orderStatus: "PREPARING",
    createdAt: generateRecentTimestamp(0, 20),
    customerName: "Dedi Kurniawan",
    customerPhone: "081234567894",
  },
  {
    id: "order_006",
    orderNumber: 106,
    tableNumber: 2,
    items: [
      { productId: "1", name: "Nasi Goreng Spesial", quantity: 1, price: 25000 },
      { productId: "2", name: "Ayam Bakar Madu", quantity: 1, price: 35000 },
      { productId: "6", name: "Es Teh Manis", quantity: 2, price: 8000 },
      { productId: "14", name: "Es Krim Vanilla", quantity: 2, price: 15000 },
    ],
    totalAmount: 106000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(0, 45),
    customerName: "Rina Wati",
    customerPhone: "081234567895",
  },
  {
    id: "order_007",
    orderNumber: 107,
    tableNumber: 15,
    items: [
      { productId: "3", name: "Mie Ayam Bakso", quantity: 3, price: 20000 },
      { productId: "7", name: "Jus Alpukat", quantity: 2, price: 15000 },
      { productId: "13", name: "Tahu Isi", quantity: 2, price: 8000 },
    ],
    totalAmount: 106000,
    paymentStatus: "UNPAID",
    orderStatus: "RECEIVED",
    createdAt: generateRecentTimestamp(0, 3),
    customerName: "Keluarga Wijaya",
    customerPhone: "081234567896",
    notes: "Pesanan untuk 3 orang, mie ayam level pedas sedang",
  },
  {
    id: "order_008",
    orderNumber: 108,
    tableNumber: 6,
    items: [
      { productId: "4", name: "Gado-gado", quantity: 1, price: 18000 },
      { productId: "8", name: "Es Jeruk", quantity: 1, price: 10000 },
      { productId: "15", name: "Puding Coklat", quantity: 1, price: 12000 },
    ],
    totalAmount: 40000,
    paymentStatus: "PAID",
    orderStatus: "PREPARING",
    createdAt: generateRecentTimestamp(0, 12),
    customerName: "Lisa Permata",
    customerPhone: "081234567897",
  },
  {
    id: "order_009",
    orderNumber: 109,
    tableNumber: 10,
    items: [
      { productId: "5", name: "Soto Ayam", quantity: 2, price: 22000 },
      { productId: "9", name: "Kopi Hitam", quantity: 1, price: 12000 },
      { productId: "11", name: "Keripik Singkong", quantity: 1, price: 12000 },
    ],
    totalAmount: 68000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(1, 10),
    customerName: "Pak Harto",
    customerPhone: "081234567898",
  },
  {
    id: "order_010",
    orderNumber: 110,
    tableNumber: 4,
    items: [
      { productId: "2", name: "Ayam Bakar Madu", quantity: 1, price: 35000 },
      { productId: "10", name: "Cappuccino", quantity: 1, price: 18000 },
      { productId: "14", name: "Es Krim Vanilla", quantity: 1, price: 15000 },
    ],
    totalAmount: 68000,
    paymentStatus: "UNPAID",
    orderStatus: "RECEIVED",
    createdAt: generateRecentTimestamp(0, 1),
    customerName: "Indra Gunawan",
    customerPhone: "081234567899",
    notes: "Ayam bakar medium well",
  },
  // Orders from earlier today
  {
    id: "order_011",
    orderNumber: 111,
    tableNumber: 9,
    items: [
      { productId: "1", name: "Nasi Goreng Spesial", quantity: 1, price: 25000 },
      { productId: "6", name: "Es Teh Manis", quantity: 1, price: 8000 },
    ],
    totalAmount: 33000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(2, 30),
    customerName: "Tono Sukirman",
    customerPhone: "081234567800",
  },
  {
    id: "order_012",
    orderNumber: 112,
    tableNumber: 11,
    items: [
      { productId: "3", name: "Mie Ayam Bakso", quantity: 2, price: 20000 },
      { productId: "7", name: "Jus Alpukat", quantity: 1, price: 15000 },
      { productId: "12", name: "Pisang Goreng", quantity: 2, price: 10000 },
    ],
    totalAmount: 75000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(3, 15),
    customerName: "Keluarga Santoso",
    customerPhone: "081234567801",
  },
  {
    id: "order_013",
    orderNumber: 113,
    tableNumber: 1,
    items: [
      { productId: "5", name: "Soto Ayam", quantity: 1, price: 22000 },
      { productId: "9", name: "Kopi Hitam", quantity: 1, price: 12000 },
    ],
    totalAmount: 34000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(4, 0),
    customerName: "Wati Suharto",
    customerPhone: "081234567802",
  },
  {
    id: "order_014",
    orderNumber: 114,
    tableNumber: 13,
    items: [
      { productId: "4", name: "Gado-gado", quantity: 1, price: 18000 },
      { productId: "8", name: "Es Jeruk", quantity: 2, price: 10000 },
      { productId: "13", name: "Tahu Isi", quantity: 3, price: 8000 },
    ],
    totalAmount: 62000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(5, 20),
    customerName: "Grup Mahasiswa",
    customerPhone: "081234567803",
  },
  {
    id: "order_015",
    orderNumber: 115,
    tableNumber: 14,
    items: [
      { productId: "2", name: "Ayam Bakar Madu", quantity: 2, price: 35000 },
      { productId: "10", name: "Cappuccino", quantity: 2, price: 18000 },
      { productId: "15", name: "Puding Coklat", quantity: 2, price: 12000 },
    ],
    totalAmount: 130000,
    paymentStatus: "PAID",
    orderStatus: "COMPLETED",
    createdAt: generateRecentTimestamp(6, 45),
    customerName: "Pasangan Muda",
    customerPhone: "081234567804",
  },
]

// Analytics data
export const mockAnalytics = {
  todayStats: {
    totalRevenue: mockOrders
      .filter((order) => order.paymentStatus === "PAID")
      .reduce((sum, order) => sum + order.totalAmount, 0),
    totalOrders: mockOrders.filter((order) => order.paymentStatus === "PAID").length,
    pendingOrders: mockOrders.filter((order) => order.orderStatus !== "COMPLETED").length,
    completedOrders: mockOrders.filter((order) => order.orderStatus === "COMPLETED").length,
  },
  topProducts: [
    { name: "Nasi Goreng Spesial", quantity: 4, revenue: 100000 },
    { name: "Ayam Bakar Madu", quantity: 4, revenue: 140000 },
    { name: "Mie Ayam Bakso", quantity: 6, revenue: 120000 },
    { name: "Es Teh Manis", quantity: 5, revenue: 40000 },
    { name: "Jus Alpukat", quantity: 4, revenue: 60000 },
  ],
  hourlyData: [
    { hour: "08:00", orders: 2, revenue: 67000 },
    { hour: "09:00", orders: 3, revenue: 95000 },
    { hour: "10:00", orders: 1, revenue: 34000 },
    { hour: "11:00", orders: 2, revenue: 192000 },
    { hour: "12:00", orders: 4, revenue: 268000 },
    { hour: "13:00", orders: 3, revenue: 176000 },
    { hour: "14:00", orders: 1, revenue: 40000 },
  ],
}
