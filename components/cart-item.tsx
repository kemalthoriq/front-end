"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableCell, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { CartItem as CartItemType } from "@/context/cart-context"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">
        <Link href={`/products/${item.id}`} className="hover:underline">
          {item.name}
        </Link>
      </TableCell>
      <TableCell className="text-right">${item.price.toLocaleString()}</TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Kurangi kuantitas"
          >
            -
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            className="w-16 text-center"
            min="1"
            aria-label="Kuantitas"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Tambah kuantitas"
          >
            +
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">${(item.price * item.quantity).toLocaleString()}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} aria-label="Hapus item">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  )
}
