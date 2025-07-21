import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Pertanyaan yang Sering Diajukan (FAQ)</h1>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Apa itu investasi emas digital?</AccordionTrigger>
                <AccordionContent>
                  Investasi emas digital adalah cara untuk membeli dan menyimpan emas tanpa perlu memegang emas fisik
                  secara langsung. Emas Anda disimpan di brankas yang aman dan Anda dapat membeli atau menjualnya kapan
                  saja melalui platform kami.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Apakah emas saya aman?</AccordionTrigger>
                <AccordionContent>
                  Ya, emas Anda disimpan di brankas yang diasuransikan penuh dan diaudit secara berkala oleh pihak
                  independen. Kami juga berlisensi dan diawasi oleh otoritas terkait.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Bagaimana cara membeli emas?</AccordionTrigger>
                <AccordionContent>
                  Setelah login, Anda dapat masuk ke halaman "Beli Emas", masukkan jumlah yang ingin Anda beli (dalam
                  rupiah atau gram), lalu lanjutkan ke pembayaran melalui metode yang tersedia.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Bisakah saya menarik emas fisik?</AccordionTrigger>
                <AccordionContent>
                  Tentu! Anda dapat mengajukan penarikan emas fisik melalui halaman "Tarik Emas Fisik". Emas akan
                  dicetak dan dikirimkan ke alamat Anda dengan biaya tambahan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Berapa biaya transaksinya?</AccordionTrigger>
                <AccordionContent>
                  Kami berkomitmen pada transparansi biaya. Detail biaya untuk setiap jenis transaksi (beli, jual,
                  tarik) akan ditampilkan dengan jelas sebelum Anda mengkonfirmasi transaksi.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Tidak menemukan jawaban Anda?</h2>
            <p className="text-muted-foreground mb-4">Jangan ragu untuk menghubungi tim dukungan pelanggan kami.</p>
            <Button asChild>
              <Link href="/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
