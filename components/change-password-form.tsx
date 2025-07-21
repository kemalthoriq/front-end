"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { updatePassword } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

export function ChangePasswordForm() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Kesalahan", description: "Kata sandi baru tidak cocok.", variant: "destructive" })
      return
    }
    setIsPending(true)
    const formData = new FormData()
    formData.append("oldPassword", oldPassword)
    formData.append("newPassword", newPassword)
    const result = await updatePassword(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Berhasil", description: result.message })
      setOldPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } else {
      toast({ title: "Gagal", description: result.message, variant: "destructive" })
    }
  }

  if (isAuthLoading || !user) {
    return null // Or a skeleton
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ubah Kata Sandi</CardTitle>
        <CardDescription>Perbarui kata sandi akun Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="oldPassword">Kata Sandi Lama</Label>
            <Input
              id="oldPassword"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Kata Sandi Baru</Label>
            <Input
              id="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">Konfirmasi Kata Sandi Baru</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Memperbarui..." : "Ubah Kata Sandi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
