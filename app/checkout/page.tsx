"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [countdown, setCountdown] = useState(180) // 3 minutes in seconds
  const [paymentMethod, setPaymentMethod] = useState("va") // Default payment method

  useEffect(() => {
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tidak ada item di keranjang Anda untuk di-checkout.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          toast({
            title: "Waktu Habis",
            description: "Harga terkunci telah berakhir. Harap mulai proses checkout lagi.",
            variant: "destructive",
          })
          router.push("/cart") // Redirect back to cart if time runs out
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [items, router])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault()
    if (items.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tidak ada item di keranjang Anda untuk di-checkout.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    console.log("Pesanan ditempatkan:", { items, totalPrice, paymentMethod })
    toast({
      title: "Pesanan Berhasil!",
      description: `Pesanan Anda senilai $${totalPrice.toLocaleString()} telah berhasil ditempatkan.`,
    })
    clearCart()
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Checkout</h1>

          {items.length === 0 || countdown === 0 ? (
            <div className="text-center text-muted-foreground">
              <p className="mb-4">Keranjang Anda kosong atau waktu checkout habis. Tidak dapat melanjutkan checkout.</p>
              <Button onClick={() => router.push("/")}>Lanjutkan Belanja</Button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="mx-auto max-w-2xl space-y-6">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Informasi Pengiriman</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Textarea id="address" placeholder="123 Main St" required />
                  </div>
                  <div>
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" placeholder="New York" required />
                  </div>
                  <div>
                    <Label htmlFor="zip">Kode Pos</Label>
                    <Input id="zip" placeholder="10001" required />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Informasi Pembayaran</h2>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-muted-foreground">Harga terkunci selama:</p>
                  <span className="text-lg font-bold text-primary">{formatTime(countdown)}</span>
                </div>
                <Separator className="mb-4" />
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="va" id="va" />
                    <Label htmlFor="va">Virtual Account (BCA, Mandiri, BNI)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ewallet" id="ewallet" />
                    <Label htmlFor="ewallet">E-Wallet (OVO, GoPay, Dana)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="qris" id="qris" />
                    <Label htmlFor="qris">QRIS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="manual" id="manual" />
                    <Label htmlFor="manual">Transfer Bank Manual</Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "manual" && (
                  <div className="mt-4 p-4 border rounded-md bg-muted">
                    <p className="font-semibold mb-2">Detail Transfer Manual:</p>
                    <p className="text-sm">Bank: BCA</p>
                    <p className="text-sm">Nomor Rekening: 1234567890</p>
                    <p className="text-sm">Atas Nama: Toko Emas Gadjah</p>
                    <p className="text-sm mt-2 text-red-500">
                      Harap transfer tepat sebesar Rp {totalPrice.toLocaleString()} dalam waktu {formatTime(countdown)}.
                      Unggah bukti transfer setelah pembayaran.
                    </p>
                    <Button variant="outline" className="mt-4 w-full bg-transparent">
                      Unggah Bukti Transfer (Simulasi)
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Ringkasan Pesanan</h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} (x{item.quantity})
                      </span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Biaya Layanan</span>
                    <span>$0.00</span> {/* Placeholder for fees */}
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Selesaikan Pesanan
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
