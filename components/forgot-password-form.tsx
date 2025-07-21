"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { requestPasswordReset } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData()
    formData.append("email", email)
    const result = await requestPasswordReset(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Permintaan Terkirim", description: result.message })
    } else {
      toast({ title: "Gagal", description: result.message, variant: "destructive" })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Lupa Kata Sandi</CardTitle>
        <CardDescription>Masukkan email Anda untuk menerima link reset kata sandi.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Mengirim..." : "Kirim Link Reset"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="underline">
              Kembali ke Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
