"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { DialogDescription } from "@/components/ui/dialog"

import { DialogTitle } from "@/components/ui/dialog"

import { DialogHeader } from "@/components/ui/dialog"

import { DialogContent } from "@/components/ui/dialog"

import { Dialog } from "@/components/ui/dialog"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WalletOverview } from "@/components/wallet-overview"
import { MutasiTable } from "@/components/mutasi-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { topUpRupiah } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"

export default function WalletPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState<number | string>("")
  const [isTopUpPending, setIsTopUpPending] = useState(false)

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsTopUpPending(true)
    const formData = new FormData()
    formData.append("amount", String(topUpAmount))
    const result = await topUpRupiah(formData)
    setIsTopUpPending(false)
    if (result.success) {
      toast({ title: "Top Up Berhasil", description: result.message })
      setIsTopUpModalOpen(false)
      setTopUpAmount("")
      // Refresh wallet data in WalletOverview component (handled by its useEffect)
    } else {
      toast({ title: "Top Up Gagal", description: result.message, variant: "destructive" })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Wallet Saya</h1>
          <WalletOverview />
          <Card>
            <CardHeader>
              <CardTitle>Top Up Saldo Rupiah</CardTitle>
              <CardDescription>Tambahkan dana ke saldo rupiah Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsTopUpModalOpen(true)}>Top Up Sekarang</Button>
            </CardContent>
          </Card>
          <MutasiTable />
        </div>
      </main>
      <Footer />

      {/* Top Up Modal */}
      <Dialog open={isTopUpModalOpen} onOpenChange={setIsTopUpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Saldo Rupiah</DialogTitle>
            <DialogDescription>Masukkan jumlah yang ingin Anda tambahkan ke saldo Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTopUp} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="top-up-amount">Jumlah Top Up (Rp)</Label>
              <Input
                id="top-up-amount"
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="100000"
                min="10000"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isTopUpPending || Number(topUpAmount) <= 0}>
                {isTopUpPending ? "Memproses..." : "Top Up"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
