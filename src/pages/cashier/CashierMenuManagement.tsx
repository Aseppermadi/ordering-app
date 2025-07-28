"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Edit, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  isAvailable: boolean
}

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    price: 25000,
    description: "Nasi goreng dengan telur, ayam suwir, dan acar",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan Utama",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Ayam Bakar Madu",
    price: 35000,
    description: "Ayam bakar dengan bumbu madu dan sambal terasi",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Makanan Utama",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Es Teh Manis",
    price: 8000,
    description: "Teh manis segar dengan es batu",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Jus Alpukat",
    price: 15000,
    description: "Jus alpukat segar dengan susu kental manis",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Minuman",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Keripik Singkong",
    price: 12000,
    description: "Keripik singkong renyah dengan bumbu balado",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Cemilan",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Pisang Goreng",
    price: 10000,
    description: "Pisang goreng crispy dengan gula halus",
    imageUrl: "/placeholder.svg?height=200&width=300",
    category: "Cemilan",
    isAvailable: false,
  },
]

const CashierMenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    imageUrl: "",
  })
  const { toast } = useToast()

  const categories = ["Makanan Utama", "Minuman", "Cemilan", "Dessert"]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        category: item.category,
        imageUrl: item.imageUrl,
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        imageUrl: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      })
      return
    }

    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      price: Number.parseInt(formData.price),
      description: formData.description,
      category: formData.category,
      imageUrl: formData.imageUrl || `/placeholder.svg?height=200&width=300&query=${formData.name}`,
      isAvailable: editingItem?.isAvailable ?? true,
    }

    if (editingItem) {
      setMenuItems((items) => items.map((item) => (item.id === editingItem.id ? newItem : item)))
      toast({
        title: "Berhasil",
        description: "Menu berhasil diperbarui",
      })
    } else {
      setMenuItems((items) => [...items, newItem])
      toast({
        title: "Berhasil",
        description: "Menu baru berhasil ditambahkan",
      })
    }

    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setMenuItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Berhasil",
      description: "Menu berhasil dihapus",
    })
  }

  const handleToggleAvailability = (id: string) => {
    setMenuItems((items) => items.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)))

    const item = menuItems.find((item) => item.id === id)
    if (item) {
      toast({
        title: "Status Diperbarui",
        description: `${item.name} ${!item.isAvailable ? "tersedia" : "tidak tersedia"}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/cashier/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kelola Menu</h1>
              <p className="text-gray-600">Tambah, edit, dan kelola ketersediaan menu</p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Menu" : "Tambah Menu Baru"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Menu *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama menu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Harga *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    placeholder="Masukkan harga"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Masukkan deskripsi menu"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL Gambar</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="Masukkan URL gambar (opsional)"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingItem ? "Perbarui" : "Tambah"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{menuItems.length}</div>
              <p className="text-sm text-gray-600">Total Menu</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {menuItems.filter((item) => item.isAvailable).length}
              </div>
              <p className="text-sm text-gray-600">Tersedia</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {menuItems.filter((item) => !item.isAvailable).length}
              </div>
              <p className="text-sm text-gray-600">Tidak Tersedia</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
              <p className="text-sm text-gray-600">Kategori</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col h-full">
              <div className="aspect-square relative">
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant={item.isAvailable ? "default" : "secondary"} className="text-xs">
                    {item.isAvailable ? "Tersedia" : "Habis"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-3 flex flex-col flex-1">
                <div className="flex-1 mb-3">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-1 min-h-[1.25rem]">{item.name}</h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2 min-h-[2rem]">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-green-600">{formatPrice(item.price)}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleToggleAvailability(item.id)}
                      title={item.isAvailable ? "Tandai tidak tersedia" : "Tandai tersedia"}
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="h-3 w-3 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleOpenDialog(item)}
                      title="Edit menu"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                      title="Hapus menu"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 mb-4">Belum ada menu yang ditambahkan</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Menu Pertama
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default CashierMenuManagement
