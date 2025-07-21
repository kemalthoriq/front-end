import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PhysicalGoldWithdrawalForm } from "@/components/physical-gold-withdrawal-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"

export default function WithdrawPhysicalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Tarik Emas Fisik</h1>
          <PhysicalGoldWithdrawalForm />

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Truck className="h-6 w-6 text-muted-foreground" />
              <div>
                <CardTitle>Status Pengiriman Terakhir</CardTitle>
                <CardDescription>Pantau status penarikan emas fisik Anda.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Belum ada pengiriman emas fisik yang aktif.</p>
              {/* In a real app, display actual shipment status, tracking number, and courier */}
              {/* Example:
              <div className="grid gap-2">
                <p><strong>Status:</strong> <Badge variant="secondary">Dikirim</Badge></p>
                <p><strong>No. Resi:</strong> ABC123XYZ</p>
                <p><strong>Ekspedisi:</strong> JNE</p>
                <p className="text-sm text-muted-foreground">Estimasi tiba: 2 hari lagi</p>
              </div>
              */}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
