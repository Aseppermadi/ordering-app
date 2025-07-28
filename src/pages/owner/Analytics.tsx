"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Calendar, DollarSign, ShoppingBag, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOrder } from "../../contexts/OrderContext"

const Analytics: React.FC = () => {
  const { orders, loadOrders } = useOrder()
  const [timeRange, setTimeRange] = useState("today")
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [] as { name: string; quantity: number; revenue: number }[],
    hourlyData: [] as { hour: string; orders: number; revenue: number }[],
    categoryData: [] as { category: string; quantity: number; revenue: number }[],
  })

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    calculateAnalytics()
  }, [orders, timeRange])

  const calculateAnalytics = () => {
    let filteredOrders = orders.filter((order) => order.paymentStatus === "PAID")

    // Filter by time range
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (timeRange) {
      case "today":
        filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) >= today)
        break
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) >= weekAgo)
        break
      case "month":
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) >= monthAgo)
        break
    }

    // Basic metrics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = filteredOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Top products
    const productStats: { [key: string]: { quantity: number; revenue: number } } = {}
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productStats[item.name]) {
          productStats[item.name] = { quantity: 0, revenue: 0 }
        }
        productStats[item.name].quantity += item.quantity
        productStats[item.name].revenue += item.price * item.quantity
      })
    })

    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Hourly data
    const hourlyStats: { [key: string]: { orders: number; revenue: number } } = {}
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00"
      hourlyStats[hour] = { orders: 0, revenue: 0 }
    }

    filteredOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours().toString().padStart(2, "0") + ":00"
      hourlyStats[hour].orders += 1
      hourlyStats[hour].revenue += order.totalAmount
    })

    const hourlyData = Object.entries(hourlyStats).map(([hour, stats]) => ({ hour, ...stats }))

    // Category data
    const categoryStats: { [key: string]: { quantity: number; revenue: number } } = {}
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Assume we can get category from item name or have it in the data
        const category = "Makanan" // This would come from actual menu data
        if (!categoryStats[category]) {
          categoryStats[category] = { quantity: 0, revenue: 0 }
        }
        categoryStats[category].quantity += item.quantity
        categoryStats[category].revenue += item.price * item.quantity
      })
    })

    const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({ category, ...stats }))

    setAnalytics({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts,
      hourlyData,
      categoryData,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTimeRangeText = () => {
    switch (timeRange) {
      case "today":
        return "Hari Ini"
      case "week":
        return "7 Hari Terakhir"
      case "month":
        return "30 Hari Terakhir"
      default:
        return "Hari Ini"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/owner/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Analisis penjualan dan performa bisnis</p>
            </div>
          </div>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">7 Hari Terakhir</SelectItem>
              <SelectItem value="month">30 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">{getTimeRangeText()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Pesanan yang sudah dibayar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Pesanan</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(analytics.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">Per transaksi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jam Puncak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.hourlyData.length > 0
                  ? analytics.hourlyData.reduce((max, current) => (current.orders > max.orders ? current : max)).hour
                  : "--:--"}
              </div>
              <p className="text-xs text-muted-foreground">Waktu tersibuk</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.quantity} terjual</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(product.revenue)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Belum ada data penjualan</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Sales */}
          <Card>
            <CardHeader>
              <CardTitle>Penjualan per Jam</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {analytics.hourlyData
                  .filter((data) => data.orders > 0)
                  .map((data) => (
                    <div key={data.hour} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">{data.hour}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{data.orders} pesanan</span>
                        <span className="text-sm font-medium">{formatPrice(data.revenue)}</span>
                      </div>
                    </div>
                  ))}
                {analytics.hourlyData.filter((data) => data.orders > 0).length === 0 && (
                  <p className="text-gray-500 text-center py-4">Belum ada data penjualan</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Periode {getTimeRangeText()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{formatPrice(analytics.totalRevenue)}</div>
                <p className="text-gray-600">Total Pendapatan</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.totalOrders}</div>
                <p className="text-gray-600">Total Transaksi</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analytics.topProducts.reduce((sum, product) => sum + product.quantity, 0)}
                </div>
                <p className="text-gray-600">Item Terjual</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics
