"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { CheckCircle, Clock, CreditCard, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOrder } from "../../contexts/OrderContext"

const OrderStatus: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const { orders } = useOrder()
  const [order, setOrder] = useState(orders.find((o) => o.id === orderId))

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
        return "Siap Diambil"
      default:
        return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    return status === "PAID" ? "Sudah Dibayar" : "Belum Dibayar"
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Pesanan tidak ditemukan</p>
          <Link to="/menu">
            <Button>Kembali ke Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pesanan Berhasil!</h1>
          <p className="text-gray-600">
            Nomor Pesanan: <span className="font-semibold">#{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Status Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge className={getStatusColor(order.orderStatus)}>{getStatusText(order.orderStatus)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Pembayaran</span>
                <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                  {getPaymentStatusText(order.paymentStatus)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Meja</span>
                <span className="font-medium">#{order.tableNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        {order.paymentStatus === "UNPAID" && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-orange-900 mb-1">Pembayaran di Kasir</h3>
                  <p className="text-sm text-orange-700">
                    Silakan tunjukkan nomor pesanan <strong>#{order.orderNumber}</strong> ke kasir untuk melakukan
                    pembayaran.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link to="/menu" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              <Home className="h-4 w-4 mr-2" />
              Pesan Lagi
            </Button>
          </Link>
        </div>

        {/* Order Time */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Pesanan dibuat pada {new Date(order.createdAt).toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  )
}

export default OrderStatus
