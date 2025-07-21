import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Lightbulb, Mail, MessageCircle } from "lucide-react"

export default function HelpCenterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Pusat Bantuan & Edukasi</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* FAQ Section */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <BookOpen className="h-6 w-6 text-muted-foreground" />
                <div>
                  <CardTitle>Pertanyaan Umum (FAQ)</CardTitle>
                  <CardDescription>Temukan jawaban cepat untuk pertanyaan yang sering diajukan.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>Apa perbedaan emas digital dan fisik?</AccordionTrigger>
                    <AccordionContent>
                      Emas digital adalah kepemilikan emas yang dicatat secara elektronik dan disimpan di brankas pihak
                      ketiga, memungkinkan transaksi yang cepat dan mudah. Emas fisik adalah batangan atau koin emas
                      yang Anda pegang secara langsung. Keduanya memiliki nilai yang sama, namun emas digital menawarkan
                      likuiditas dan kemudahan akses yang lebih tinggi.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>Bagaimana cara memastikan keamanan investasi saya?</AccordionTrigger>
                    <AccordionContent>
                      Kami menggunakan enkripsi canggih, autentikasi multi-faktor, dan penyimpanan emas di brankas yang
                      diasuransikan penuh. Kami juga mematuhi regulasi keuangan yang ketat.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>Apakah ada biaya tersembunyi?</AccordionTrigger>
                    <AccordionContent>
                      Tidak ada. Kami berkomitmen pada transparansi penuh. Semua biaya transaksi (beli, jual, tarik
                      fisik) akan ditampilkan dengan jelas sebelum Anda mengkonfirmasi transaksi.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Button asChild variant="link" className="mt-4 px-0">
                  <Link href="/faq">Lihat Semua FAQ</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Education Section */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="h-6 w-6 text-muted-foreground" />
                <div>
                  <CardTitle>Edukasi & Tips Investasi</CardTitle>
                  <CardDescription>Pelajari lebih lanjut tentang investasi emas dan tips keamanan.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Emas Digital vs. Fisik</h3>
                  <p className="text-muted-foreground text-sm">
                    Pahami perbedaan utama antara investasi emas digital dan fisik, serta mana yang paling cocok untuk
                    tujuan investasi Anda.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Tips Investasi Emas Aman</h3>
                  <ul className="list-disc pl-5 text-muted-foreground text-sm">
                    <li>Selalu gunakan platform terpercaya dan berlisensi.</li>
                    <li>Pahami biaya transaksi sebelum melakukan pembelian.</li>
                    <li>Diversifikasi portofolio investasi Anda.</li>
                    <li>Pantau pergerakan harga emas secara berkala.</li>
                  </ul>
                </div>
                <Button asChild variant="link" className="px-0">
                  <Link href="#">Baca Artikel Edukasi Lainnya (Segera Hadir)</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Customer Service */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Butuh Bantuan Lebih Lanjut?</h2>
            <p className="text-muted-foreground mb-6">Tim dukungan pelanggan kami siap membantu Anda.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" /> Kirim Pesan
                </Link>
              </Button>
              <Button variant="outline">
                <MessageCircle className="mr-2 h-4 w-4" /> Live Chat (Segera Hadir)
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
