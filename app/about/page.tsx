import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Tentang Kami</h1>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Visi & Misi Kami</h2>
              <p className="text-muted-foreground mb-4">
                Visi kami adalah menjadi platform investasi emas digital terkemuka yang memberdayakan individu untuk
                mengamankan masa depan finansial mereka melalui akses mudah dan aman ke emas.
              </p>
              <p className="text-muted-foreground mb-4">
                Misi kami adalah menyediakan platform yang transparan, real-time, dan terpercaya untuk pembelian,
                penjualan, dan penyimpanan emas digital, didukung oleh keamanan tingkat tinggi dan layanan pelanggan
                yang luar biasa.
              </p>
            </div>
            <div className="relative h-[300px] w-full rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=600" alt="Our Vision" layout="fill" objectFit="cover" />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Legalitas & Lisensi</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto">
              Toko Emas Gadjah beroperasi di bawah pengawasan ketat dan telah memperoleh semua lisensi yang diperlukan dari
              otoritas keuangan terkait untuk memastikan kepatuhan dan keamanan bagi pengguna kami. Kami berkomitmen
              untuk menjaga standar tertinggi dalam operasional dan perlindungan aset.
            </p>
            <div className="flex justify-center mt-6 gap-8">
              <Image src="/placeholder.svg?height=80&width=80" alt="License 1" width={80} height={80} />
              <Image src="/placeholder.svg?height=80&width=80" alt="License 2" width={80} height={80} />
              <Image src="/placeholder.svg?height=80&width=80" alt="License 3" width={80} height={80} />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Tim & Keamanan Sistem</h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto">
              Tim kami terdiri dari para ahli di bidang keuangan, teknologi, dan keamanan siber. Kami menggunakan
              teknologi enkripsi terkini dan praktik keamanan terbaik untuk melindungi data dan aset Anda. Keamanan
              adalah prioritas utama kami.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              <Card className="text-center">
                <CardContent className="flex flex-col items-center pt-6">
                  <Image
                    src="/placeholder-user.jpg"
                    alt="Team Member"
                    width={80}
                    height={80}
                    className="rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">Nama Anggota Tim</h3>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="flex flex-col items-center pt-6">
                  <Image
                    src="/placeholder-user.jpg"
                    alt="Team Member"
                    width={80}
                    height={80}
                    className="rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">Nama Anggota Tim</h3>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="flex flex-col items-center pt-6">
                  <Image
                    src="/placeholder-user.jpg"
                    alt="Team Member"
                    width={80}
                    height={80}
                    className="rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">Nama Anggota Tim</h3>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="flex flex-col items-center pt-6">
                  <Image
                    src="/placeholder-user.jpg"
                    alt="Team Member"
                    width={80}
                    height={80}
                    className="rounded-full mb-4"
                  />
                  <h3 className="font-semibold text-lg">Nama Anggota Tim</h3>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
