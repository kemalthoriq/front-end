import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function ArticlesPage() {
  const articles = [
    {
      id: "1",
      title: "Emas Digital vs. Emas Fisik: Mana yang Lebih Baik untuk Anda?",
      description: "Pahami perbedaan, kelebihan, dan kekurangan investasi emas digital dan fisik.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      link: "#",
    },
    {
      id: "2",
      title: "Tips Investasi Emas Jangka Panjang untuk Pemula",
      description: "Panduan lengkap untuk memulai investasi emas dan strategi untuk pertumbuhan jangka panjang.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      link: "#",
    },
    {
      id: "3",
      title: "Memahami Regulasi dan Keamanan Investasi Emas Digital",
      description: "Pelajari tentang lisensi, audit, dan langkah-langkah keamanan yang melindungi investasi Anda.",
      imageUrl: "/placeholder.svg?height=200&width=300",
      link: "#",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Artikel Edukasi & Blog</h1>

          <div className="text-center space-y-4 mb-12">
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Perluas pengetahuan Anda tentang investasi emas, pasar, dan tips keamanan dari para ahli kami.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.id}>
                <Link href={article.link}>
                  <Image
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Link>
                <CardHeader>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={article.link} className="text-primary hover:underline text-sm">
                    Baca Selengkapnya
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-muted-foreground">
            <p>Lebih banyak artikel akan segera hadir!</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
