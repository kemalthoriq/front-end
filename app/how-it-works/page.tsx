import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, DollarSign, Gem, Repeat } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Cara Kerja Toko Emas Gadjah</h1>

          <div className="text-center space-y-4 mb-12">
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Memulai investasi emas digital Anda dengan Toko Emas Gadjah sangat mudah. Ikuti langkah-langkah sederhana ini:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>1. Beli Emas</CardTitle>
              </CardHeader>
              <CardContent>
                Mulai dengan membeli emas digital dalam jumlah kecil atau besar sesuai keinginan Anda. Pilih dari
                berbagai opsi pembayaran.
              </CardContent>
            </Card>
            <div className="flex items-center justify-center md:col-span-1">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <Card className="text-center">
              <CardHeader>
                <Gem className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>2. Simpan Aman</CardTitle>
              </CardHeader>
              <CardContent>
                Emas digital Anda disimpan dengan aman di brankas fisik yang diasuransikan penuh. Anda memiliki
                kepemilikan penuh atas emas Anda.
              </CardContent>
            </Card>
            <div className="flex items-center justify-center md:col-span-1">
              <ArrowRight className="h-8 w-8 text-muted-foreground" />
            </div>
            <Card className="text-center">
              <CardHeader>
                <Repeat className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>3. Tarik atau Jual</CardTitle>
              </CardHeader>
              <CardContent>
                Kapan saja Anda mau, Anda bisa menjual emas Anda kembali ke kami atau menariknya dalam bentuk emas
                fisik.
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Infografik Alur</h2>
            <div className="relative w-full h-[200px] md:h-[300px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              {/* Placeholder for an infographic image */}
              <p>Infografik Alur (Beli → Simpan → Tarik/Jual)</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
