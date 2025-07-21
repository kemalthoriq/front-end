import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PriceAlertSettings } from "@/components/price-alert-settings"

export default function PriceAlertsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Pengaturan Notifikasi Harga</h1>
          <PriceAlertSettings />
        </div>
      </main>
      <Footer />
    </div>
  )
}
