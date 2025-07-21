"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Shield, LineChart, DollarSign, Gem } from "lucide-react"
import { GoldPriceChart } from "./gold-price-chart"
import { useEffect, useState } from "react"
import { getGoldSpotPrice } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export function HomepageSections() {
  const [spotPrice, setSpotPrice] = useState<{ buy: number; sell: number } | null>(null)
  const [isLoadingSpotPrice, setIsLoadingSpotPrice] = useState(true)

  useEffect(() => {
    const fetchSpotPrice = async () => {
      setIsLoadingSpotPrice(true)
      const price = await getGoldSpotPrice()
      setSpotPrice(price)
      setIsLoadingSpotPrice(false)
    }
    fetchSpotPrice()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Investasi Emas Digital Aman & Real-time
            </h1>
            <p className="text-lg md:text-xl">
              Mulai menabung emas sekarang dan nikmati kemudahan transaksi dengan harga terbaik.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row justify-center">
              <Button asChild className="bg-white text-yellow-600 hover:bg-gray-100">
                <Link href="/register">Mulai Nabung Emas Sekarang</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-yellow-600 bg-transparent"
              >
                <Link href="/how-it-works">Pelajari Cara Kerjanya</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gold Price Banner */}
      <section className="w-full py-8 bg-yellow-700 text-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-around gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Harga Emas Hari Ini</h2>
            <p className="text-sm text-yellow-200">Update Real-time</p>
          </div>
          {isLoadingSpotPrice ? (
            <div className="flex gap-4">
              <Skeleton className="h-16 w-32" />
              <Skeleton className="h-16 w-32" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8">
              <div className="text-center">
                <p className="text-sm">Harga Beli (per gram)</p>
                <p className="text-3xl font-bold">Rp {spotPrice?.buy.toLocaleString("id-ID")}</p>
              </div>
              <div className="text-center">
                <p className="text-sm">Harga Jual (per gram)</p>
                <p className="text-3xl font-bold">Rp {spotPrice?.sell.toLocaleString("id-ID")}</p>
              </div>
            </div>
          )}
          <Button
            asChild
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-yellow-700 bg-transparent"
          >
            <Link href="/login">Login untuk membeli</Link>
          </Button>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Mengapa Memilih GoldMart?</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Kami menyediakan platform investasi emas yang aman, transparan, dan mudah diakses untuk semua.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Shield className="h-8 w-8 text-yellow-600" />
                <CardTitle>Aman & Terpercaya</CardTitle>
              </CardHeader>
              <CardContent>
                Emas Anda disimpan di brankas yang aman dan diasuransikan. Kami berlisensi dan diawasi oleh otoritas
                terkait.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Clock className="h-8 w-8 text-yellow-600" />
                <CardTitle>Harga Real-time</CardTitle>
              </CardHeader>
              <CardContent>
                Dapatkan harga beli dan jual emas yang diperbarui secara real-time, memastikan transparansi penuh.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
                <CardTitle>Mudah Digunakan</CardTitle>
              </CardHeader>
              <CardContent>
                Antarmuka intuitif kami membuat pembelian, penjualan, dan penarikan emas menjadi sangat mudah.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <LineChart className="h-8 w-8 text-yellow-600" />
                <CardTitle>Analisis Harga</CardTitle>
              </CardHeader>
              <CardContent>
                Pantau pergerakan harga emas dengan grafik interaktif untuk membantu keputusan investasi Anda.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <CardTitle>Biaya Transparan</CardTitle>
              </CardHeader>
              <CardContent>
                Tidak ada biaya tersembunyi. Semua biaya transaksi dijelaskan dengan jelas di muka.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Gem className="h-8 w-8 text-yellow-600" />
                <CardTitle>Emas Fisik & Digital</CardTitle>
              </CardHeader>
              <CardContent>
                Fleksibilitas untuk menyimpan emas secara digital atau menariknya dalam bentuk fisik.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Apa Kata Pengguna Kami</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Dengar langsung dari komunitas investor kami yang puas.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">
                  "GoldMart membuat investasi emas menjadi sangat mudah. Saya suka fitur harga real-time dan kemudahan
                  penarikan."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">JD</span>
                  </span>
                  <div>
                    <p className="font-semibold">Joko D.</p>
                    <p className="text-sm text-muted-foreground">Investor Emas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">
                  "Saya selalu ingin menabung emas, tapi prosesnya rumit. GoldMart mengubah itu! Sangat
                  direkomendasikan."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">SA</span>
                  </span>
                  <div>
                    <p className="font-semibold">Siti A.</p>
                    <p className="text-sm text-muted-foreground">Pengguna Baru</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">
                  "Fitur tabungan emas sangat membantu saya mencapai target investasi. Progress bar-nya memotivasi!"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">BW</span>
                  </span>
                  <div>
                    <p className="font-semibold">Budi W.</p>
                    <p className="text-sm text-muted-foreground">Penabung Emas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gold Price Chart Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Grafik Harga Emas 30 Hari</h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Pantau pergerakan harga emas historis untuk membuat keputusan investasi yang lebih baik.
            </p>
          </div>
          <GoldPriceChart />
        </div>
      </section>
    </>
  )
}
