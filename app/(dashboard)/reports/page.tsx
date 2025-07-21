import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MonthlyReportCard } from "@/components/monthly-report-card"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Laporan & Rekapitulasi</h1>
          <MonthlyReportCard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
