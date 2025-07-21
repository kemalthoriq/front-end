"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"

export interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const storedCart = localStorage.getItem("gold-ecommerce-cart")
    if (storedCart) {
      setItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("gold-ecommerce-cart", JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        toast({
          title: "Item diperbarui di keranjang",
          description: `${product.name} kuantitas diperbarui.`,
        })
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        toast({
          title: "Ditambahkan ke keranjang",
          description: `${product.name} telah ditambahkan ke keranjang Anda.`,
        })
        return [...prevItems, { ...product, quantity }]
      }
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prevItems) => {
      toast({
        title: "Item dihapus",
        description: "Item telah dihapus dari keranjang Anda.",
      })
      return prevItems.filter((item) => item.id !== id)
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        toast({
          title: "Item dihapus",
          description: "Item telah dihapus dari keranjang Anda.",
        })
        return prevItems.filter((item) => item.id !== id)
      }
      return prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    toast({
      title: "Keranjang dikosongkan",
      description: "Semua item telah dihapus dari keranjang Anda.",
    })
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
