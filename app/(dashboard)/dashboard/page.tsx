"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DashboardOverview } from "@/components/dashboard-overview"
import { GoldPriceChart } from "@/components/gold-price-chart"
import { TransactionHistoryTable } from "@/components/transaction-history-table"
import { BuySellGoldForm } from "@/components/buy-sell-gold-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Dashboard Anda</h1>
          <DashboardOverview />
          <KycStatusCard /> {/* New KYC Status Card */}
          <div className="grid gap-8 lg:grid-cols-2">
            <GoldPriceChart />
            <BuySellGoldForm />
          </div>
          <TransactionHistoryTable limit={5} /> {/* Show latest 5 transactions */}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function KycStatusCard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <Skeleton className="h-[120px] w-full" />
  }

  if (!user) {
    return null // Don't show if not logged in
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Disetujui":
        return "default"
      case "Dalam proses":
        return "secondary"
      case "Ditolak":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Verifikasi Akun (KYC)</CardTitle>
        <CardDescription>Pastikan akun Anda terverifikasi untuk fitur penuh.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge variant={getStatusVariant(user.kycStatus)}>{user.kycStatus}</Badge>
        </div>
        {user.kycStatus !== "Disetujui" && (
          <Button asChild size="sm">
            <Link href="/profile">Lengkapi Verifikasi</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
