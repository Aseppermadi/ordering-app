"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Minus, Plus, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "../../contexts/CartContext"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  isAvailable: boolean
  rating?: number
  ingredients?: string[]
  nutritionInfo?: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
  customizations?: {
    spiceLevel?: string[]
    extras?: { name: string; price: number }[]
    size?: { name: string; price: number }[]
  }
}

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    price: 25000,
    description:
      "Nasi goreng dengan telur, ayam suwir, acar, dan kerupuk. Dimasak dengan bumbu rahasia yang khas dan menggunakan nasi berkualitas tinggi.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: "Makanan",
    isAvailable: true,
    rating: 4.5,
    ingredients: [
      "Nasi",
      "Telur",
      "Ayam suwir",
      "Bawang merah",
      "Bawang putih",
      "Kecap manis",
      "Cabai",
      "Acar",
      "Kerupuk",
    ],
    nutritionInfo: {
      calories: 450,
      protein: "18g",
      carbs: "65g",
      fat: "12g",
    },
    customizations: {
      spiceLevel: ["Tidak Pedas", "Pedas Sedang", "Pedas", "Extra Pedas"],
      extras: [
        { name: "Telur Mata Sapi", price: 5000 },
        { name: "Ayam Extra", price: 8000 },
        { name: "Kerupuk Extra", price: 3000 },
      ],
    },
  },
  {
    id: "2",
    name: "Ayam Bakar Madu",
    price: 35000,
    description:
      "Ayam bakar dengan bumbu madu dan sambal terasi. Dibakar dengan sempurna hingga kulitnya crispy dan dagingnya juicy.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: "Makanan",
    isAvailable: true,
    rating: 4.8,
    ingredients: ["Ayam", "Madu", "Bumbu bakar", "Sambal terasi", "Lalapan", "Nasi putih"],
    nutritionInfo: {
      calories: 520,
      protein: "35g",
      carbs: "25g",
      fat: "28g",
    },
    customizations: {
      spiceLevel: ["Tidak Pedas", "Pedas Sedang", "Pedas"],
      extras: [
        { name: "Nasi Extra", price: 5000 },
        { name: "Lalapan Extra", price: 4000 },
        { name: "Sambal Extra", price: 2000 },
      ],
    },
  },
]

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { addItem, itemCount } = useCart()
  const { toast } = useToast()

  const [product, setProduct] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("")
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([])
  const [selectedSize] = useState<{ name: string; price: number } | null>(null)

  useEffect(() => {
    // Simulate API call
    const foundProduct = mockMenuItems.find((item) => item.id === id)
    setProduct(foundProduct || null)

    // Set default selections
    if (foundProduct?.customizations?.spiceLevel) {
      setSelectedSpiceLevel(foundProduct.customizations.spiceLevel[0])
    }
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateBasePrice = () => {
    if (!product) return 0

    let basePrice = product.price

    // Add size price
    if (selectedSize) {
      basePrice += selectedSize.price
    }

    // Add extras price
    selectedExtras.forEach((extra) => {
      basePrice += extra.price
    })

    return basePrice
  }

  const calculateSubtotal = () => {
    return calculateBasePrice() * quantity
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.12 // PPN 12%
  }

  const calculateTotalPrice = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleExtraToggle = (extra: { name: string; price: number }) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((item) => item.name === extra.name)
      if (exists) {
        return prev.filter((item) => item.name !== extra.name)
      } else {
        return [...prev, extra]
      }
    })
  }

  const handleAddToCart = () => {
    if (!product) return

    // Create customization note
    let customizationNote = ""
    if (selectedSpiceLevel) {
      customizationNote += `Level Pedas: ${selectedSpiceLevel}`
    }
    if (selectedExtras.length > 0) {
      customizationNote += `, Extra: ${selectedExtras.map((e) => e.name).join(", ")}`
    }
    if (selectedSize) {
      customizationNote += `, Size: ${selectedSize.name}`
    }

    const cartItem = {
      id: `${product.id}_${Date.now()}`, // Unique ID for customized items
      name: product.name + (customizationNote ? ` (${customizationNote})` : ""),
      price: calculateBasePrice(), // Price per item including customizations (before tax)
      imageUrl: product.imageUrl,
    }

    // Add multiple items based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(cartItem)
    }

    toast({
      title: "Berhasil ditambahkan!",
      description: `${quantity}x ${product.name} telah ditambahkan ke keranjang`,
    })

    // Reset selections
    setQuantity(1)
    setSelectedExtras([])
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
          <Link to="/menu">
            <Button>Kembali ke Menu</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <Link to="/menu">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold">Detail Produk</h1>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>

        {/* Product Image */}
        <div className="aspect-video relative">
          <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-4 right-4">
            <Badge variant={product.isAvailable ? "default" : "secondary"}>
              {product.isAvailable ? "Tersedia" : "Habis"}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <Badge variant="outline">{product.category}</Badge>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-600">(128 ulasan)</span>
              </div>
            )}

            <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

            <div className="text-3xl font-bold text-green-600">{formatPrice(product.price)}</div>
            <p className="text-sm text-gray-500 mt-1">*Belum termasuk PPN 12%</p>
          </div>

          <Separator />

          {/* Ingredients */}
          {product.ingredients && (
            <div>
              <h3 className="font-semibold mb-3">Bahan-bahan</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Info */}
          {product.nutritionInfo && (
            <div>
              <h3 className="font-semibold mb-3">Informasi Nutrisi</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">{product.nutritionInfo.calories}</div>
                  <div className="text-sm text-gray-600">Kalori</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">{product.nutritionInfo.protein}</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">{product.nutritionInfo.carbs}</div>
                  <div className="text-sm text-gray-600">Karbohidrat</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-bold text-lg">{product.nutritionInfo.fat}</div>
                  <div className="text-sm text-gray-600">Lemak</div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Customizations */}
          {product.customizations && (
            <div className="space-y-4">
              <h3 className="font-semibold">Kustomisasi</h3>

              {/* Spice Level */}
              {product.customizations.spiceLevel && (
                <div>
                  <h4 className="font-medium mb-2">Level Pedas</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.customizations.spiceLevel.map((level) => (
                      <Button
                        key={level}
                        variant={selectedSpiceLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSpiceLevel(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {product.customizations.extras && (
                <div>
                  <h4 className="font-medium mb-2">Tambahan</h4>
                  <div className="space-y-2">
                    {product.customizations.extras.map((extra) => (
                      <div
                        key={extra.name}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedExtras.find((e) => e.name === extra.name)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleExtraToggle(extra)}
                      >
                        <span className="font-medium">{extra.name}</span>
                        <span className="text-green-600 font-semibold">+{formatPrice(extra.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Jumlah</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>PPN (12%)</span>
                    <span>{formatPrice(calculateTax())}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total Harga</span>
                    <span className="text-green-600">{formatPrice(calculateTotalPrice())}</span>
                  </div>
                  {selectedExtras.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Termasuk: {selectedExtras.map((e) => e.name).join(", ")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Button */}
            <Button className="w-full h-12 text-lg" onClick={handleAddToCart} disabled={!product.isAvailable}>
              {product.isAvailable ? (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Tambah ke Keranjang
                </>
              ) : (
                "Produk Tidak Tersedia"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
