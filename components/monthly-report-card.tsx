"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { getUserTransactions, getUserWallet, getGoals, type Transaction, type Wallet, type Goal } from "@/lib/user-data"
import { Skeleton } from "@/components/ui/skeleton"

export function MonthlyReportCard() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoadingData(true)
        const [fetchedTransactions, fetchedWallet, fetchedGoals] = await Promise.all([
          getUserTransactions(),
          getUserWallet(),
          getGoals(),
        ])
        setTransactions(fetchedTransactions)
        setWallet(fetchedWallet)
        setGoals(fetchedGoals)
        setIsLoadingData(false)
      } else {
        setTransactions([])
        setWallet(null)
        setGoals([])
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [user])

  const handleDownloadReport = () => {
    toast({
      title: "Unduh Laporan Bulanan",
      description: "Laporan Anda sedang disiapkan untuk diunduh. (Simulasi PDF)",
    })
    // In a real app, trigger an API call to generate and download the PDF
  }

  const totalBuyGold = transactions
    .filter((t) => t.type === "Pembelian" && t.status === "Selesai")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalSellGold = transactions
    .filter((t) => t.type === "Penjualan" && t.status === "Selesai")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawRupiah = transactions
    .filter((t) => t.type === "Tarik Dana" && t.status === "Selesai")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalGoalContributions = goals.reduce(
    (sum, goal) => sum + goal.installments.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0),
    0,
  )

  if (isAuthLoading || isLoadingData) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Laporan Bulanan</CardTitle>
          <CardDescription>Rekapitulasi aktivitas akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Silakan login untuk melihat laporan Anda.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Bulanan</CardTitle>
        <CardDescription>Rekapitulasi aktivitas akun Anda.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="font-medium">Saldo Emas Saat Ini:</p>
          <p className="text-right">{wallet?.goldGram.toFixed(2) || "0.00"} gram</p>
          <p className="font-medium">Saldo Rupiah Saat Ini:</p>
          <p className="text-right">Rp {wallet?.rupiahBalance.toLocaleString("id-ID") || "0"}</p>
        </div>

        <h3 className="text-lg font-semibold mt-2">Ringkasan Aktivitas</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>Total Pembelian Emas:</p>
          <p className="text-right">{totalBuyGold.toFixed(2)} gram</p>
          <p>Total Penjualan Emas:</p>
          <p className="text-right">{totalSellGold.toFixed(2)} gram</p>
          <p>Total Penarikan Dana:</p>
          <p className="text-right">Rp {totalWithdrawRupiah.toLocaleString("id-ID")}</p>
          <p>Total Kontribusi Goal:</p>
          <p className="text-right">{totalGoalContributions.toFixed(2)} gram</p>
        </div>

        <Button onClick={handleDownloadReport} className="w-full mt-4">
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan PDF
        </Button>
      </CardContent>
    </Card>
  )
}
