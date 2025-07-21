"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { verifyEmail } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function EmailVerificationForm() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData()
    formData.append("email", email)
    formData.append("otp", otp)
    const result = await verifyEmail(formData)
    setIsPending(false)
    if (result.success) {
      toast({ title: "Verifikasi Berhasil", description: result.message })
      router.push("/login") // Redirect to login after successful verification
    } else {
      toast({ title: "Verifikasi Gagal", description: result.message, variant: "destructive" })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
        <CardDescription>Masukkan email dan kode OTP yang dikirimkan kepada Anda.</CardDescription>
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
          <div className="grid gap-2">
            <Label htmlFor="otp">Kode OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Memverifikasi..." : "Verifikasi Email"}
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
