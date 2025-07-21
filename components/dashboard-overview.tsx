"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Gem, Wallet } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { getUserWallet, getUserTransactions, type Wallet as WalletType, type Transaction } from "@/lib/user-data"
import { getGoldSpotPrice } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardOverview() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([])
  const [goldSpotPrice, setGoldSpotPrice] = useState<{ buy: number; sell: number } | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoadingData(true)
        const [userWallet, transactions, spotPrice] = await Promise.all([
          getUserWallet(),
          getUserTransactions(),
          getGoldSpotPrice(),
        ])
        setWallet(userWallet)
        setLatestTransactions(transactions.slice(0, 3)) // Show only latest 3
        setGoldSpotPrice(spotPrice)
        setIsLoadingData(false)
      } else {
        setWallet(null)
        setLatestTransactions([])
        setGoldSpotPrice(null)
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [user])

  const rupiahEquivalent = wallet && goldSpotPrice ? wallet.goldGram * goldSpotPrice.buy : 0

  if (isAuthLoading || isLoadingData) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[180px]" />
        <Skeleton className="h-[180px]" />
        <Skeleton className="h-[180px]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="mb-4">Silakan login untuk melihat dashboard Anda.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Saldo Emas</CardTitle>
          <Gem className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wallet?.goldGram.toFixed(2) || "0.00"} gram</div>
          <p className="text-xs text-muted-foreground">Setara Rp {rupiahEquivalent.toLocaleString("id-ID") || "0"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Rupiah</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {wallet?.rupiahBalance.toLocaleString("id-ID") || "0"}</div>
          <p className="text-xs text-muted-foreground">Dapat ditarik ke rekening bank Anda</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aksi Cepat</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild size="sm">
            <Link href="/transactions?action=buy">Beli Emas</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/transactions?action=sell">Jual Emas</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/wallet?action=withdraw">Tarik Dana</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
