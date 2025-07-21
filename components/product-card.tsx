"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { Star, ShoppingCart, Eye, Heart } from "lucide-react"
import type { Product } from "@/lib/data"
import { useState } from "react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isLiked, setIsLiked] = useState(false)

  const handleAddToCart = () => {
    addItem(product, 1)
  }

  const handleToggleLike = () => {
    setIsLiked(!isLiked)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  return (
    <Card className="group relative overflow-hidden rounded-xl border-0 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">NEW</Badge>}
        {product.isBestseller && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1">BESTSELLER</Badge>
        )}
        {product.isOnSale && <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">SALE</Badge>}
      </div>

      {/* Like Button */}
      <button
        onClick={handleToggleLike}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
      </button>

      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" asChild className="backdrop-blur-sm">
            <Link href={`/products/${product.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Lihat
            </Link>
          </Button>
          <Button size="sm" onClick={handleAddToCart} className="backdrop-blur-sm">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Beli
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {product.purity}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.weight}g
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </CardDescription>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="text-xl font-bold text-primary">{formatPrice(product.price)}</div>
          {product.originalPrice && (
            <div className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
            {product.inStock ? `Stok: ${product.stockQuantity}` : "Habis"}
          </div>
          <Button onClick={handleAddToCart} disabled={!product.inStock} className="flex-1 max-w-[120px]">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Beli
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
