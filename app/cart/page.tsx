"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CartItem } from "@/components/cart-item"

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Keranjang Belanja Anda</h1>

          {items.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="mb-4">Keranjang Anda kosong.</p>
              <Button asChild>
                <Link href="/">Lanjutkan Belanja</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] hidden sm:table-cell">Produk</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-center">Kuantitas</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={clearCart}>
                    Kosongkan Keranjang
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Ringkasan Pesanan</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pengiriman</span>
                    <span>Gratis</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <Button asChild className="mt-6 w-full">
                  <Link href="/checkout">Lanjutkan ke Checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
