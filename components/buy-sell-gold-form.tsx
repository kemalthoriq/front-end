"use client"

import Link from "next/link"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState, useRef } from "react"
import { buyGold, sellGold, getUserWallet, type Wallet as WalletType } from "@/lib/user-data"
import { getGoldSpotPrice } from "@/lib/data"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export function BuySellGoldForm() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("buy")
  const [gramAmount, setGramAmount] = useState<number | string>("")
  const [currentBuyPrice, setCurrentBuyPrice] = useState(0)
  const [currentSellPrice, setCurrentSellPrice] = useState(0)
  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [priceLockCountdown, setPriceLockCountdown] = useState(180) // 3 minutes
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [sellDestination, setSellDestination] = useState<"wallet" | "bank">("wallet")
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>("")

  const fetchPricesAndWallet = async () => {
    setIsLoadingPrices(true)
    const [spotPrice, userWallet] = await Promise.all([getGoldSpotPrice(), getUserWallet()])
    setCurrentBuyPrice(spotPrice.sell) // User buys at market sell price
    setCurrentSellPrice(spotPrice.buy) // User sells at market buy price
    setWallet(userWallet)
    setIsLoadingPrices(false)
  }

  useEffect(() => {
    fetchPricesAndWallet()
    // Start price lock countdown
    countdownIntervalRef.current = setInterval(() => {
      setPriceLockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current!)
          toast({
            title: "Harga Kedaluwarsa",
            description: "Harga emas telah diperbarui. Harap periksa kembali sebelum transaksi.",
            variant: "destructive",
          })
          fetchPricesAndWallet() // Refresh prices
          return 180 // Reset countdown
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [user])

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof gramAmount !== "number" || gramAmount <= 0) {
      toast({ title: "Kesalahan", description: "Jumlah gram tidak valid.", variant: "destructive" })
      return
    }
    setIsPending(true)
    const formData = new FormData()
    formData.append("gram", String(gramAmount))
    const result = await buyGold(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Pembelian Berhasil", description: result.message })
      setGramAmount("")
      fetchPricesAndWallet() // Refresh wallet data and prices
    } else {
      toast({ title: "Pembelian Gagal", description: result.message, variant: "destructive" })
    }
  }

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof gramAmount !== "number" || gramAmount <= 0) {
      toast({ title: "Kesalahan", description: "Jumlah gram tidak valid.", variant: "destructive" })
      return
    }
    setIsPending(true)
    const formData = new FormData()
    formData.append("gram", String(gramAmount))
    formData.append("destination", sellDestination)
    if (sellDestination === "bank") {
      formData.append("bankAccountId", selectedBankAccountId)
    }

    const result = await sellGold(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Penjualan Berhasil", description: result.message })
      setGramAmount("")
      fetchPricesAndWallet() // Refresh wallet data and prices
    } else {
      toast({ title: "Penjualan Gagal", description: result.message, variant: "destructive" })
    }
  }

  const estimatedBuyCost = typeof gramAmount === "number" ? gramAmount * currentBuyPrice : 0
  const estimatedSellReceive = typeof gramAmount === "number" ? gramAmount * currentSellPrice : 0
  const transactionFee = 0.005 // Example 0.5% fee
  const estimatedBuyFee = estimatedBuyCost * transactionFee
  const estimatedSellFee = estimatedSellReceive * transactionFee

  if (isAuthLoading || isLoadingPrices || !user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beli & Jual Emas</CardTitle>
        <CardDescription>Lakukan transaksi emas Anda dengan mudah.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">Harga terkunci selama:</p>
          <span className="text-lg font-bold text-primary">{formatCountdown(priceLockCountdown)}</span>
        </div>
        <Separator className="mb-4" />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Beli Emas</TabsTrigger>
            <TabsTrigger value="sell">Jual Emas</TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="mt-4">
            <form onSubmit={handleBuySubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="buy-gram">Jumlah Gram</Label>
                <Input
                  id="buy-gram"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.01"
                  value={gramAmount}
                  onChange={(e) => setGramAmount(Number.parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Harga Beli (per gram)</Label>
                <Input value={`Rp ${currentBuyPrice.toLocaleString("id-ID")}`} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Estimasi Biaya</Label>
                <Input value={`Rp ${estimatedBuyCost.toLocaleString("id-ID")}`} disabled />
                <p className="text-sm text-muted-foreground">
                  Biaya Transaksi: Rp {estimatedBuyFee.toLocaleString("id-ID")} (0.5%)
                </p>
                <p className="text-sm text-muted-foreground">
                  Saldo Rupiah Anda: Rp {wallet?.rupiahBalance.toLocaleString("id-ID") || "0"}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || estimatedBuyCost + estimatedBuyFee > (wallet?.rupiahBalance || 0)}
              >
                {isPending ? "Memproses..." : "Beli Emas"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="sell" className="mt-4">
            <form onSubmit={handleSellSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sell-gram">Jumlah Gram</Label>
                <Input
                  id="sell-gram"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.01"
                  value={gramAmount}
                  onChange={(e) => setGramAmount(Number.parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Harga Jual (per gram)</Label>
                <Input value={`Rp ${currentSellPrice.toLocaleString("id-ID")}`} disabled />
              </div>
              <div className="grid gap-2">
                <Label>Estimasi Diterima</Label>
                <Input value={`Rp ${estimatedSellReceive.toLocaleString("id-ID")}`} disabled />
                <p className="text-sm text-muted-foreground">
                  Biaya Transaksi: Rp {estimatedSellFee.toLocaleString("id-ID")} (0.5%)
                </p>
                <p className="text-sm text-muted-foreground">
                  Saldo Emas Anda: {wallet?.goldGram.toFixed(2) || "0.00"} gram
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sell-destination">Tujuan Dana</Label>
                <Select value={sellDestination} onValueChange={(value: "wallet" | "bank") => setSellDestination(value)}>
                  <SelectTrigger id="sell-destination">
                    <SelectValue placeholder="Pilih tujuan dana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wallet">Simpan di Wallet Rupiah</SelectItem>
                    <SelectItem value="bank">Tarik ke Rekening Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {sellDestination === "bank" && (
                <div className="grid gap-2">
                  <Label htmlFor="bank-account-select">Pilih Rekening Bank</Label>
                  <Select value={selectedBankAccountId} onValueChange={setSelectedBankAccountId} required>
                    <SelectTrigger id="bank-account-select">
                      <SelectValue placeholder="Pilih rekening bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {wallet?.bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.bankName} - {account.accountNumber} ({account.accountHolder})
                          {!account.isVerified && " (Belum Verifikasi)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {wallet?.bankAccounts.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Anda belum memiliki rekening bank. Tambahkan di halaman{" "}
                      <Link href="/wallet" className="underline">
                        Wallet
                      </Link>
                      .
                    </p>
                  )}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isPending ||
                  (typeof gramAmount === "number" && gramAmount > (wallet?.goldGram || 0)) ||
                  (sellDestination === "bank" && !selectedBankAccountId)
                }
              >
                {isPending ? "Memproses..." : "Jual Emas"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
