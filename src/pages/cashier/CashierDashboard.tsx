"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Bell, Clock, CreditCard, LogOut, RefreshCw, Search, Users, TrendingUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "../../contexts/AuthContext"
import { useOrder } from "../../contexts/OrderContext"
import { useToast } from "@/hooks/use-toast"

const CashierDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const { orders, updateOrderStatus, updatePaymentStatus, loadOrders, refreshOrders, isLoading } = useOrder()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    let filtered = orders.filter((order) => order.orderStatus !== "COMPLETED") // Exclude completed orders

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toString().includes(searchQuery) ||
          order.tableNumber.toString().includes(searchQuery) ||
          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerPhone?.includes(searchQuery),
      )
    }

    // Sort by oldest first (ascending order by createdAt)
    setFilteredOrders(filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))
  }, [orders, searchQuery])

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOrders()
      setLastRefresh(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [refreshOrders])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PREPARING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "Diterima"
      case "PREPARING":
        return "Disiapkan"
      case "COMPLETED":
        return "Selesai"
      default:
        return status
    }
  }

  const getUrgencyLevel = (createdAt: string) => {
    const now = new Date()
    const orderTime = new Date(createdAt)
    const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60))

    if (diffMinutes > 45) return "critical"
    if (diffMinutes > 30) return "urgent"
    if (diffMinutes > 15) return "warning"
    return "normal"
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "border-l-4 border-l-red-600 bg-red-100 shadow-lg"
      case "urgent":
        return "border-l-4 border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-4 border-l-orange-500 bg-orange-50"
      default:
        return "border-l-4 border-l-blue-500"
    }
  }

  const handleStatusUpdate = (orderId: string, newStatus: "RECEIVED" | "PREPARING" | "COMPLETED") => {
    updateOrderStatus(orderId, newStatus)

    if (newStatus === "COMPLETED") {
      toast({
        title: "Pesanan Selesai! 🎉",
        description: "Pesanan telah selesai dan dihapus dari daftar aktif",
      })
    } else {
      toast({
        title: "Status Diperbarui",
        description: `Status pesanan berhasil diubah ke ${getStatusText(newStatus)}`,
      })
    }
  }

  const handlePaymentUpdate = (orderId: string) => {
    updatePaymentStatus(orderId, "PAID")
    toast({
      title: "Pembayaran Dikonfirmasi",
      description: "Status pembayaran berhasil diperbarui",
    })
  }

  const handleManualRefresh = () => {
    refreshOrders()
    setLastRefresh(new Date())
    toast({
      title: "Data Diperbarui",
      description: "Pesanan terbaru telah dimuat",
    })
  }

  // Calculate statistics
  const activeOrders = orders.filter((order) => order.orderStatus !== "COMPLETED")
  const todayOrders = orders.filter((order) => {
    const today = new Date().toDateString()
    return new Date(order.createdAt).toDateString() === today
  })

  const todayRevenue = todayOrders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + order.totalAmount, 0)
  const unpaidOrders = orders.filter((order) => order.paymentStatus === "UNPAID")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Kasir</h1>
            <p className="text-gray-600">
              Selamat datang, <span className="font-medium">{user?.username}</span> • Terakhir diperbarui:{" "}
              {lastRefresh.toLocaleTimeString("id-ID")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleManualRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
              {unpaidOrders.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unpaidOrders.length}
                </Badge>
              )}
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesanan Aktif</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeOrders.filter((o) => o.orderStatus === "RECEIVED").length} baru,{" "}
                {activeOrders.filter((o) => o.orderStatus === "PREPARING").length} disiapkan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(todayRevenue)}</div>
              <p className="text-xs text-muted-foreground">Dari {todayOrders.length} pesanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibayar</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{unpaidOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {formatPrice(unpaidOrders.reduce((sum, order) => sum + order.totalAmount, 0))}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hari Ini</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{todayOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayOrders.filter((o) => o.orderStatus === "COMPLETED").length} selesai
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nomor pesanan, meja, nama, atau telepon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {filteredOrders.length} pesanan
              </Badge>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pesanan Masuk</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span>Kritis (&gt;45 menit)</span>
              <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
              <span>Urgent (&gt;30 menit)</span>
              <div className="w-3 h-3 bg-orange-500 rounded-full ml-4"></div>
              <span>Perhatian (&gt;15 menit)</span>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Memuat pesanan...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "Tidak ada pesanan ditemukan" : "Belum ada pesanan"}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? "Coba ubah kata kunci pencarian" : "Pesanan baru akan muncul di sini secara otomatis"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const urgency = getUrgencyLevel(order.createdAt)
              const orderTime = new Date(order.createdAt)
              const timeAgo = Math.floor((new Date().getTime() - orderTime.getTime()) / (1000 * 60))

              return (
                <Card
                  key={order.id}
                  className={`overflow-hidden transition-all hover:shadow-md ${getUrgencyColor(urgency)}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">Pesanan #{order.orderNumber}</h3>
                          <Badge className={`${getStatusColor(order.orderStatus)} border`}>
                            {getStatusText(order.orderStatus)}
                          </Badge>
                          <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                            {order.paymentStatus === "PAID" ? "Dibayar" : "Belum Bayar"}
                          </Badge>
                          {urgency === "critical" && (
                            <Badge variant="destructive" className="animate-pulse bg-red-600">
                              KRITIS!
                            </Badge>
                          )}
                          {urgency === "urgent" && (
                            <Badge variant="destructive" className="animate-pulse">
                              URGENT
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Meja:</span> #{order.tableNumber}
                          </div>
                          <div>
                            <span className="font-medium">Waktu:</span> {timeAgo} menit lalu
                          </div>
                          <div>
                            <span className="font-medium">Pelanggan:</span> {order.customerName || "Guest"}
                          </div>
                        </div>

                        {order.customerPhone && (
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Telepon:</span> {order.customerPhone}
                          </div>
                        )}

                        {order.notes && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-yellow-800">Catatan Khusus:</p>
                                <p className="text-sm text-yellow-700">{order.notes}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-green-600 mb-1">{formatPrice(order.totalAmount)}</div>
                        <div className="text-sm text-gray-500">{order.items.length} item</div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-900">Item Pesanan:</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="font-medium">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="text-gray-600">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {order.orderStatus === "RECEIVED" && (
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, "PREPARING")}>
                          <Clock className="h-4 w-4 mr-1" />
                          Mulai Siapkan
                        </Button>
                      )}

                      {order.orderStatus === "PREPARING" && (
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, "COMPLETED")}>
                          <Clock className="h-4 w-4 mr-1" />
                          Selesaikan
                        </Button>
                      )}

                      {order.paymentStatus === "UNPAID" && (
                        <Button size="sm" variant="outline" onClick={() => handlePaymentUpdate(order.id)}>
                          <CreditCard className="h-4 w-4 mr-1" />
                          Tandai Sudah Bayar
                        </Button>
                      )}

                      <Link to={`/cashier/order/${order.id}`}>
                        <Button size="sm" variant="ghost">
                          Detail Lengkap
                        </Button>
                      </Link>

                      {order.customerPhone && (
                        <Button size="sm" variant="ghost" className="text-blue-600">
                          Hubungi
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.orderStatus === "RECEIVED").length}
              </div>
              <p className="text-sm text-gray-600">Pesanan Baru</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.orderStatus === "PREPARING").length}
              </div>
              <p className="text-sm text-gray-600">Sedang Disiapkan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.orderStatus === "COMPLETED").length}
              </div>
              <p className="text-sm text-gray-600">Selesai Hari Ini</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CashierDashboard
