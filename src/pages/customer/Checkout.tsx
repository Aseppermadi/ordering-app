"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, CreditCard, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "../../contexts/CartContext"
import { useOrder } from "../../contexts/OrderContext"
import { useToast } from "@/hooks/use-toast"

const Checkout: React.FC = () => {
  const [tableNumber, setTableNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [isProcessing, setIsProcessing] = useState(false)

  const { items, subtotal, tax, total, clearCart } = useCart()
  const { createOrder } = useOrder()
  const { toast } = useToast()
  const navigate = useNavigate()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmitOrder = async () => {
    if (!tableNumber) {
      toast({
        title: "Error",
        description: "Nomor meja harus diisi",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Keranjang kosong",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const order = await createOrder({
        tableNumber: Number.parseInt(tableNumber),
        items: orderItems,
        totalAmount: total, // Now includes tax
        paymentStatus: paymentMethod === "online" ? "PAID" : "UNPAID",
        orderStatus: "RECEIVED",
      })

      clearCart()

      if (paymentMethod === "online") {
        // Simulate payment gateway
        toast({
          title: "Pembayaran Berhasil",
          description: "Pesanan Anda sedang diproses",
        })
      } else {
        toast({
          title: "Pesanan Berhasil",
          description: `Silakan bayar di kasir dengan nomor pesanan ${order.orderNumber}`,
        })
      }

      navigate(`/order/${order.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat pesanan",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Keranjang kosong</p>
            <Link to="/menu">
              <Button>Kembali ke Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Checkout</h1>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>PPN (12%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Number */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Meja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Nomor Meja *</Label>
              <Input
                id="tableNumber"
                type="number"
                placeholder="Masukkan nomor meja"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Bayar Sekarang</div>
                    <div className="text-sm text-gray-500">Bayar online dengan e-wallet atau kartu</div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="cashier" id="cashier" />
                <Label htmlFor="cashier" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Bayar di Kasir</div>
                    <div className="text-sm text-gray-500">Bayar tunai atau kartu di kasir</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Informasi Pajak</p>
              <p>Harga sudah termasuk PPN 12% sesuai ketentuan yang berlaku.</p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button className="w-full h-12 text-lg" onClick={handleSubmitOrder} disabled={isProcessing}>
          {isProcessing ? "Memproses..." : paymentMethod === "online" ? "Bayar Sekarang" : "Buat Pesanan"}
        </Button>
      </div>
    </div>
  )
}

export default Checkout
