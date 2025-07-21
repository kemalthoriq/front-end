"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { updateUserProfile, getUserProfile, type UserProfile } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileEditForm() {
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const fetchedProfile = await getUserProfile()
        setProfile(fetchedProfile)
      }
    }
    fetchProfile()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const result = await updateUserProfile(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Profil Diperbarui", description: result.message })
      refreshUser() // Refresh user data in context
    } else {
      toast({ title: "Gagal Memperbarui Profil", description: result.message, variant: "destructive" })
    }
  }

  if (isAuthLoading || !profile) {
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
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" /> {/* For phone number */}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Data Pribadi</CardTitle>
        <CardDescription>Perbarui informasi pribadi Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input id="fullName" name="fullName" defaultValue={profile.fullName} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={profile.email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">Nomor HP</Label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" defaultValue={profile.phoneNumber} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" name="address" defaultValue={profile.address} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={profile.dateOfBirth} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
