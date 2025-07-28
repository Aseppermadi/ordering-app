"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../../contexts/CartContext"

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  isAvailable: boolean
  isBestSeller?: boolean
}

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    price: 25000,
    description: "Nasi goreng dengan telur, ayam suwir, dan acar",
    imageUrl: "/menu/nasi_goreng.jpg",
    category: "Makanan",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Ayam Bakar Madu",
    price: 35000,
    description: "Ayam bakar dengan bumbu madu dan sambal terasi",
    imageUrl: "/menu/ayam_bakar_madu.jpg",
    category: "Makanan",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Es Teh Manis",
    price: 8000,
    description: "Teh manis segar dengan es batu",
    imageUrl: "/menu/es_teh.jpg",
    category: "Minuman",
    isAvailable: true,
    isBestSeller: false,
  },
  {
    id: "4",
    name: "Jus Alpukat",
    price: 15000,
    description: "Jus alpukat segar dengan susu kental manis",
    imageUrl: "/menu/jus_alpukat.png",
    category: "Minuman",
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "5",
    name: "Keripik Singkong",
    price: 12000,
    description: "Keripik singkong renyah dengan bumbu balado",
    imageUrl: "/menu/keripik_singkong.jpg",
    category: "Cemilan",
    isAvailable: true,
    isBestSeller: false,
  },
]

const CustomerMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("Best Seller")
  const [searchQuery, setSearchQuery] = useState("")
  const { addItem, itemCount } = useCart()

  const categories = ["Best Seller", "Makanan", "Minuman", "Cemilan"]

  useEffect(() => {
    // Simulate API call
    setMenuItems(mockMenuItems)
    setFilteredItems(mockMenuItems.filter((item) => item.isBestSeller))
  }, [])

  useEffect(() => {
    let filtered = menuItems

    if (selectedCategory === "Best Seller") {
      filtered = filtered.filter((item) => item.isBestSeller)
    } else {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredItems(filtered)
  }, [menuItems, selectedCategory, searchQuery])

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">OrderIn</h1>
              <p className="text-sm text-gray-600">Pesan makanan favoritmu</p>
            </div>
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Categories */}
        <div className="py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  {/* Image Section */}
                  <Link to={`/product/${item.id}`} className="w-24 h-24 m-4 flex-shrink-0">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>

                  {/* Content Section */}
                  <div className="flex-1 p-4 pl-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          {item.isBestSeller && (
                            <Badge variant="default" className="text-xs bg-orange-500 hover:bg-orange-600">
                              Best Seller
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-green-600">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Section - Below Image */}
                <div className="px-4 pb-4">
                  <Button className="w-full" onClick={() => handleAddToCart(item)} disabled={!item.isAvailable}>
                    {item.isAvailable ? "Tambah ke Keranjang" : "Habis"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada menu yang ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerMenu
