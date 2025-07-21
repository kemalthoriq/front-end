"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { getPriceAlerts, setPriceAlert, deletePriceAlert, type Notification } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"

export function PriceAlertSettings() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [targetPrice, setTargetPrice] = useState<number | string>("")
  const [alertType, setAlertType] = useState<"above" | "below">("above")
  const [isPending, setIsPending] = useState(false)
  const [alerts, setAlerts] = useState<Notification[]>([])
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true)

  const fetchAlerts = async () => {
    if (user) {
      setIsLoadingAlerts(true)
      const fetchedAlerts = await getPriceAlerts()
      setAlerts(fetchedAlerts)
      setIsLoadingAlerts(false)
    } else {
      setAlerts([])
      setIsLoadingAlerts(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof targetPrice !== "number" || targetPrice <= 0) {
      toast({ title: "Kesalahan", description: "Harga target tidak valid.", variant: "destructive" })
      return
    }
    setIsPending(true)
    const formData = new FormData()
    formData.append("targetPrice", String(targetPrice))
    formData.append("type", alertType)
    const result = await setPriceAlert(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Berhasil", description: result.message })
      setTargetPrice("")
      fetchAlerts() // Refresh list
    } else {
      toast({ title: "Gagal", description: result.message, variant: "destructive" })
    }
  }

  const handleDeleteAlert = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus notifikasi harga ini?")) {
      const result = await deletePriceAlert(id)
      if (result.success) {
        toast({ title: "Berhasil", description: result.message })
        fetchAlerts() // Refresh list
      } else {
        toast({ title: "Gagal", description: result.message, variant: "destructive" })
      }
    }
  }

  if (isAuthLoading || isLoadingAlerts) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi Harga</CardTitle>
          <CardDescription>Atur notifikasi untuk pergerakan harga emas.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Silakan login untuk mengatur notifikasi harga.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifikasi Harga</CardTitle>
        <CardDescription>Atur notifikasi untuk pergerakan harga emas.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 mb-8">
          <div className="grid gap-2">
            <Label htmlFor="targetPrice">Harga Target (Rp)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="1000"
              min="1"
              placeholder="950000"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number.parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="alertType">Jenis Notifikasi</Label>
            <Select value={alertType} onValueChange={(value: "above" | "below") => setAlertType(value)} required>
              <SelectTrigger id="alertType">
                <SelectValue placeholder="Pilih jenis notifikasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Ketika harga di atas</SelectItem>
                <SelectItem value="below">Ketika harga di bawah</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Setel Notifikasi"}
          </Button>
        </form>

        <h3 className="text-lg font-semibold mb-4">Notifikasi Aktif Anda</h3>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center">Belum ada notifikasi harga yang disetel.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Harga Target</TableHead>
                  <TableHead>Dibuat Pada</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.message.includes("di atas") ? "Di Atas" : "Di Bawah"}</TableCell>
                    <TableCell>
                      Rp{" "}
                      {alert.message
                        .match(/Rp (\d{1,3}(?:\.\d{3})*(?:,\d+)?)/)?.[1]
                        ?.replace(/\./g, "")
                        .toLocaleString("id-ID") || "N/A"}
                    </TableCell>
                    <TableCell>{new Date(alert.date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteAlert(alert.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Hapus Notifikasi</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
