"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { uploadKycDocuments, type KYCStatus } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function KYCUploadForm() {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth()
  const [kycStatus, setKycStatus] = useState<KYCStatus | undefined>(user?.kycStatus)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (user) {
      setKycStatus(user.kycStatus)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const result = await uploadKycDocuments(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Dokumen KYC Diunggah", description: result.message })
      if (result.kycStatus) {
        setKycStatus(result.kycStatus)
      }
      refreshUser() // Refresh user data in context
    } else {
      toast({ title: "Gagal Mengunggah Dokumen", description: result.message, variant: "destructive" })
    }
  }

  const getStatusVariant = (status: KYCStatus) => {
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

  if (isAuthLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verifikasi KYC</CardTitle>
        <CardDescription>Unggah dokumen Anda untuk verifikasi akun.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Label>Status Verifikasi:</Label>
          <Badge variant={kycStatus ? getStatusVariant(kycStatus) : "outline"}>{kycStatus || "Memuat..."}</Badge>
        </div>

        {kycStatus === "Disetujui" ? (
          <p className="text-green-600">Akun Anda telah diverifikasi.</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {kycStatus === "Ditolak" && (
                <span className="text-destructive font-semibold">
                  Verifikasi Anda ditolak. Harap unggah ulang dokumen yang jelas dan valid.
                </span>
              )}
              Harap unggah salinan KTP/ID dan foto selfie Anda memegang KTP/ID.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="ktp">Upload KTP/ID</Label>
              <Input id="ktp" name="ktp" type="file" accept="image/*" required={kycStatus !== "Dalam proses"} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selfie">Upload Selfie dengan KTP/ID</Label>
              <Input id="selfie" name="selfie" type="file" accept="image/*" required={kycStatus !== "Dalam proses"} />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Mengunggah..." : "Unggah Dokumen"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
