"use client"

import Link from "next/link"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Gem, Banknote, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserWallet, type Wallet as WalletType, addBankAccount, withdrawFunds } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { getGoldSpotPrice } from "@/lib/data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export function WalletOverview() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [wallet, setWallet] = useState<WalletType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isManageBankModalOpen, setIsManageBankModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState<number | string>("")
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>("")
  const [isWithdrawPending, setIsWithdrawPending] = useState(false)
  const [goldSpotPrice, setGoldSpotPrice] = useState<{ buy: number; sell: number } | null>(null)
  const [addBankOtp, setAddBankOtp] = useState("")
  const [addBankRequireOtp, setAddBankRequireOtp] = useState(false)
  const [isAddBankPending, setIsAddBankPending] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const fetchWalletData = async () => {
    if (user) {
      setIsLoading(true)
      const [userWallet, spotPrice] = await Promise.all([getUserWallet(), getGoldSpotPrice()])
      setWallet(userWallet)
      setGoldSpotPrice(spotPrice)
      setIsLoading(false)
    } else {
      setWallet(null)
      setGoldSpotPrice(null)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletData()
  }, [user])

  useEffect(() => {
    if (searchParams.get("action") === "withdraw" && user && wallet) {
      setIsWithdrawModalOpen(true)
    }
  }, [searchParams, user, wallet])

  const handleAddBankAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAddBankPending(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    formData.append("requireOtp", String(addBankRequireOtp))
    if (addBankRequireOtp) {
      formData.append("otp", addBankOtp)
    }

    const result = await addBankAccount(formData)
    setIsAddBankPending(false)
    if (result.success) {
      toast({ title: "Berhasil", description: result.message })
      setIsAddBankModalOpen(false)
      setAddBankOtp("")
      setAddBankRequireOtp(false)
      fetchWalletData() // Refresh wallet data
    } else {
      toast({ title: "Gagal", description: result.message, variant: "destructive" })
    }
  }

  const handleWithdrawFunds = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsWithdrawPending(true)
    const formData = new FormData()
    formData.append("amount", String(withdrawAmount))
    formData.append("bankAccountId", selectedBankAccountId)

    const result = await withdrawFunds(formData)
    setIsWithdrawPending(false)
    if (result.success) {
      toast({ title: "Penarikan Berhasil", description: result.message })
      setIsWithdrawModalOpen(false)
      setWithdrawAmount("")
      setSelectedBankAccountId("")
      fetchWalletData() // Refresh wallet data
    } else {
      toast({ title: "Penarikan Gagal", description: result.message, variant: "destructive" })
    }
  }

  const handleDeleteBankAccount = (accountId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus rekening bank ini? (Simulasi)")) {
      // In a real app, call a server action to delete
      toast({ title: "Rekening Dihapus", description: "Rekening bank berhasil dihapus. (Simulasi)" })
      fetchWalletData() // Refresh wallet data
    }
  }

  const rupiahEquivalent = wallet && goldSpotPrice ? wallet.goldGram * goldSpotPrice.buy : 0

  if (isAuthLoading || isLoading) {
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
        <p className="mb-4">Silakan login untuk melihat wallet Anda.</p>
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
          <CardTitle className="text-sm font-medium">Saldo Emas</CardTitle>
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
          <CardTitle className="text-sm font-medium">Aksi Wallet</CardTitle>
          <Banknote className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button onClick={() => setIsWithdrawModalOpen(true)} size="sm">
            Tarik Dana
          </Button>
          <Button onClick={() => setIsManageBankModalOpen(true)} size="sm" variant="outline">
            Kelola Rekening Bank
          </Button>
        </CardContent>
      </Card>

      {/* Add Bank Account Dialog */}
      <Dialog open={isAddBankModalOpen} onOpenChange={setIsAddBankModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Rekening Bank</DialogTitle>
            <DialogDescription>Masukkan detail rekening bank Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBankAccount} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bankName">Nama Bank</Label>
              <Input id="bankName" name="bankName" placeholder="Bank BCA" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountNumber">Nomor Rekening</Label>
              <Input id="accountNumber" name="accountNumber" placeholder="1234567890" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="accountHolder">Nama Pemilik Rekening</Label>
              <Input id="accountHolder" name="accountHolder" placeholder="John Doe" required />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireOtp"
                checked={addBankRequireOtp}
                onCheckedChange={(checked) => setAddBankRequireOtp(!!checked)}
              />
              <Label htmlFor="requireOtp">Verifikasi dengan OTP (opsional)</Label>
            </div>
            {addBankRequireOtp && (
              <div className="grid gap-2">
                <Label htmlFor="otp">Kode OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Masukkan OTP (misal: 123456)"
                  value={addBankOtp}
                  onChange={(e) => setAddBankOtp(e.target.value)}
                  required
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isAddBankPending}>
                {isAddBankPending ? "Menambah..." : "Tambah Rekening"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Withdraw Funds Dialog */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tarik Dana</DialogTitle>
            <DialogDescription>Tarik saldo rupiah Anda ke rekening bank.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdrawFunds} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="withdraw-amount">Jumlah Penarikan (Rp)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="100000"
                min="1"
                max={wallet?.rupiahBalance || 0}
                required
              />
              <p className="text-sm text-muted-foreground">
                Saldo tersedia: Rp {wallet?.rupiahBalance.toLocaleString("id-ID") || "0"}
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank-account">Pilih Rekening Bank</Label>
              <Select value={selectedBankAccountId} onValueChange={setSelectedBankAccountId} required>
                <SelectTrigger id="bank-account">
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
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={
                  isWithdrawPending ||
                  !selectedBankAccountId ||
                  !withdrawAmount ||
                  Number(withdrawAmount) <= 0 ||
                  Number(withdrawAmount) > (wallet?.rupiahBalance || 0)
                }
              >
                {isWithdrawPending ? "Memproses..." : "Tarik Dana"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Bank Accounts Dialog */}
      <Dialog open={isManageBankModalOpen} onOpenChange={setIsManageBankModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Kelola Rekening Bank</DialogTitle>
            <DialogDescription>Tambah atau hapus rekening bank Anda.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {wallet?.bankAccounts.length === 0 ? (
              <p className="text-center text-muted-foreground">Belum ada rekening bank yang terdaftar.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank</TableHead>
                    <TableHead>Nomor Rekening</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallet?.bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.bankName}</TableCell>
                      <TableCell>{account.accountNumber}</TableCell>
                      <TableCell>{account.accountHolder}</TableCell>
                      <TableCell>
                        <Badge variant={account.isVerified ? "default" : "secondary"}>
                          {account.isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBankAccount(account.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Hapus</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsManageBankModalOpen(false)
                setIsAddBankModalOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Tambah Rekening Baru
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
