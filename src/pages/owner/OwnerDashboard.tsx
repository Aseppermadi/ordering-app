"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, LogOut, Menu, Settings, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "../../contexts/AuthContext"
import { useOrder } from "../../contexts/OrderContext"

const OwnerDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const { orders, loadOrders } = useOrder()
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [] as { name: string; quantity: number }[],
  })

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    // Calculate analytics
    const paidOrders = orders.filter((order) => order.paymentStatus === "PAID")
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = paidOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate top products
    const productCount: { [key: string]: number } = {}
    paidOrders.forEach((order) => {
      order.items.forEach((item) => {
        productCount[item.name] = (productCount[item.name] || 0) + item.quantity
      })
    })

    const topProducts = Object.entries(productCount)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts,
    })
  }, [orders])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Owner</h1>
            <p className="text-gray-600">Selamat datang, {user?.username}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/owner/menu">
              <Button variant="outline">
                <Menu className="h-4 w-4 mr-2" />
                Kelola Menu
              </Button>
            </Link>
            <Link to="/owner/analytics">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Dari {analytics.totalOrders} pesanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Pesanan yang sudah dibayar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Pesanan</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">Per transaksi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status Sistem</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-muted-foreground">Sistem berjalan normal</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {index + 1}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{product.quantity} terjual</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada data penjualan</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pesanan #{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        Meja {order.tableNumber} • {new Date(order.createdAt).toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                      <p className="text-sm text-gray-600">
                        {order.paymentStatus === "PAID" ? "Dibayar" : "Belum Bayar"}
                      </p>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-gray-500 text-center py-4">Belum ada pesanan</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/owner/menu">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Menu className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium">Kelola Menu</h3>
                  <p className="text-sm text-gray-600">Tambah, edit, atau hapus item menu</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/owner/analytics">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">Lihat Analytics</h3>
                  <p className="text-sm text-gray-600">Analisis penjualan dan performa</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Pengaturan</h3>
                <p className="text-sm text-gray-600">Kelola akun kasir dan sistem</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnerDashboard
