"use client"

import Link from "next/link"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { getUserWallet, type Wallet } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export function PhysicalGoldWithdrawalForm() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [isLoadingWallet, setIsLoadingWallet] = useState(true)

  const [weight, setWeight] = useState<string>("")
  const [goldType, setGoldType] = useState<string>("")
  const [recipientName, setRecipientName] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isPending, setIsPending] = useState(false)

  const availableWeights = ["0.5", "1", "5", "10", "100"] // in grams
  const goldTypes = ["Antam", "UBS", "LM"]

  // Mock costs
  const shippingCost = 50000 // IDR
  const mintingFeePerGram = 10000 // IDR
  const insuranceFee = 25000 // IDR - New: Insurance fee

  useEffect(() => {
    const fetchWallet = async () => {
      if (user) {
        setIsLoadingWallet(true)
        const userWallet = await getUserWallet()
        setWallet(userWallet)
        setIsLoadingWallet(false)
      }
    }
    fetchWallet()
  }, [user])

  const totalGram = Number.parseFloat(weight) || 0
  const totalMintingFee = totalGram * mintingFeePerGram
  const totalCost = shippingCost + totalMintingFee + insuranceFee // Added insurance fee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk melakukan penarikan emas fisik.",
        variant: "destructive",
      })
      return
    }
    if (totalGram === 0 || totalGram > (wallet?.goldGram || 0)) {
      toast({
        title: "Error",
        description: "Jumlah gram tidak valid atau saldo emas tidak mencukupi.",
        variant: "destructive",
      })
      return
    }

    setIsPending(true)
    // Simulate API call for physical gold withdrawal
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Permintaan Penarikan Emas Fisik",
      description: `Permintaan penarikan ${totalGram} gram emas (${goldType}) ke alamat Anda sedang diproses. Total biaya: Rp ${totalCost.toLocaleString("id-ID")}.`,
    })

    // In a real app, update user's gold balance and add a transaction
    // For now, just reset form
    setWeight("")
    setGoldType("")
    setRecipientName("")
    setAddress("")
    setCity("")
    setZipCode("")
    setPhoneNumber("")
    setIsPending(false)
    // Refresh wallet data
    const updatedWallet = await getUserWallet()
    setWallet(updatedWallet)
  }

  if (isAuthLoading || isLoadingWallet) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="mb-4">Silakan login untuk menarik emas fisik Anda.</p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarik Emas Fisik</CardTitle>
        <CardDescription>Ubah emas digital Anda menjadi emas fisik dan kirimkan ke alamat Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="current-gold-balance">Saldo Emas Anda</Label>
            <Input id="current-gold-balance" value={`${wallet?.goldGram.toFixed(2) || "0.00"} gram`} disabled />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="weight">Pilih Berat (gram)</Label>
              <Select value={weight} onValueChange={setWeight} required>
                <SelectTrigger id="weight">
                  <SelectValue placeholder="Pilih berat" />
                </SelectTrigger>
                <SelectContent>
                  {availableWeights.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w} gram
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gold-type">Jenis Emas</Label>
              <Select value={goldType} onValueChange={setGoldType} required>
                <SelectTrigger id="gold-type">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  {goldTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-4">Alamat Pengiriman</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="recipient-name">Nama Penerima</Label>
              <Input
                id="recipient-name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone-number">Nomor Telepon</Label>
              <Input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Kota</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zip-code">Kode Pos</Label>
              <Input id="zip-code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-4">Ringkasan Biaya</h3>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Berat Emas</span>
              <span>{totalGram.toFixed(2)} gram</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Cetak ({mintingFeePerGram.toLocaleString("id-ID")}/gram)</span>
              <span>Rp {totalMintingFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pengiriman</span>
              <span>Rp {shippingCost.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Asuransi</span>
              <span>Rp {insuranceFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Biaya</span>
              <span>Rp {totalCost.toLocaleString("id-ID")}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Estimasi waktu kirim: 3-5 hari kerja.</p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || totalGram === 0 || totalGram > (wallet?.goldGram || 0)}
          >
            {isPending ? "Memproses..." : "Konfirmasi Tarik Emas Fisik"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
