"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Clock, CreditCard, MapPin, Phone, User, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useOrder } from "../../contexts/OrderContext"
import { useToast } from "@/hooks/use-toast"

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrder()
  const { toast } = useToast()

  const [order, setOrder] = useState(orders.find((o) => o.id === orderId))
  const [notes, setNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const foundOrder = orders.find((o) => o.id === orderId)
    setOrder(foundOrder)
  }, [orders, orderId])

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
        return "bg-blue-100 text-blue-800"
      case "PREPARING":
        return "bg-yellow-100 text-yellow-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "Pesanan Diterima"
      case "PREPARING":
        return "Sedang Disiapkan"
      case "COMPLETED":
        return "Selesai"
      default:
        return status
    }
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "RECEIVED":
        return "PREPARING"
      case "PREPARING":
        return "COMPLETED"
      default:
        return null
    }
  }

  const getNextStatusText = (currentStatus: string) => {
    switch (currentStatus) {
      case "RECEIVED":
        return "Mulai Siapkan"
      case "PREPARING":
        return "Selesaikan Pesanan"
      default:
        return null
    }
  }

  const handleStatusUpdate = async (newStatus: "RECEIVED" | "PREPARING" | "COMPLETED") => {
    if (!order) return

    setIsUpdating(true)
    try {
      updateOrderStatus(order.id, newStatus)
      toast({
        title: "Status Diperbarui",
        description: `Status pesanan berhasil diubah ke ${getStatusText(newStatus)}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui status pesanan",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentUpdate = async () => {
    if (!order) return

    setIsUpdating(true)
    try {
      updatePaymentStatus(order.id, "PAID")
      toast({
        title: "Pembayaran Dikonfirmasi",
        description: "Status pembayaran berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui status pembayaran",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getEstimatedTime = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "15-20 menit"
      case "PREPARING":
        return "5-10 menit"
      case "COMPLETED":
        return "Siap diambil"
      default:
        return "-"
    }
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
          <Link to="/cashier/dashboard">
            <Button>Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const nextStatus = getNextStatus(order.orderStatus)
  const nextStatusText = getNextStatusText(order.orderStatus)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/cashier/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
            <p className="text-gray-600">Pesanan #{order.orderNumber}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status Pesanan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getStatusColor(order.orderStatus)} variant="secondary">
                    {getStatusText(order.orderStatus)}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Estimasi waktu</p>
                    <p className="font-medium">{getEstimatedTime(order.orderStatus)}</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 ${order.orderStatus === "RECEIVED" || order.orderStatus === "PREPARING" || order.orderStatus === "COMPLETED" ? "text-green-600" : "text-gray-400"}`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Pesanan Diterima</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {new Date(order.createdAt).toLocaleTimeString("id-ID")}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-3 ${order.orderStatus === "PREPARING" || order.orderStatus === "COMPLETED" ? "text-green-600" : "text-gray-400"}`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Sedang Disiapkan</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 ${order.orderStatus === "COMPLETED" ? "text-green-600" : "text-gray-400"}`}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Selesai</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  {nextStatus && (
                    <Button
                      onClick={() => handleStatusUpdate(nextStatus as "RECEIVED" | "PREPARING" | "COMPLETED")}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Memperbarui..." : nextStatusText}
                    </Button>
                  )}

                  {order.paymentStatus === "UNPAID" && (
                    <Button variant="outline" onClick={handlePaymentUpdate} disabled={isUpdating}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Tandai Sudah Bayar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Item Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Catatan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Tambah catatan internal</Label>
                    <Textarea
                      id="notes"
                      placeholder="Catatan untuk dapur atau informasi tambahan..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    Simpan Catatan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nomor Meja</p>
                    <p className="font-semibold">#{order.tableNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Waktu Pesan</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informasi Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Status Pembayaran</span>
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                      {order.paymentStatus === "PAID" ? "Sudah Dibayar" : "Belum Dibayar"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Metode Pembayaran</span>
                    <span className="font-medium">{order.paymentStatus === "PAID" ? "Online" : "Bayar di Kasir"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Pembayaran</span>
                    <span className="font-bold text-green-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                {order.paymentStatus === "UNPAID" && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-orange-900">Menunggu Pembayaran</p>
                        <p className="text-orange-700">
                          Pelanggan akan membayar di kasir dengan nomor pesanan #{order.orderNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Hubungi Pelanggan
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Print Struk
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  disabled={order.orderStatus !== "COMPLETED"}
                >
                  Tandai Selesai
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
