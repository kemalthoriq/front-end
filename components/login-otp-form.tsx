"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function LoginOtpForm() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()
  const { login } = useAuth() // Use login from AuthContext for session handling

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSendingOtp(true)
    // Simulate OTP request
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSendingOtp(false)
    if (email === "user@example.com") {
      // Mock success for user@example.com
      setOtpSent(true)
      toast({ title: "OTP Terkirim", description: "Kode OTP telah dikirim ke email Anda." })
    } else {
      toast({ title: "Gagal", description: "Email tidak terdaftar atau terjadi kesalahan.", variant: "destructive" })
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifyingOtp(true)
    // Simulate OTP verification and login
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsVerifyingOtp(false)

    if (email === "user@example.com" && otp === "123456") {
      // Mock successful login with OTP
      const success = await login(email, "password") // Use mock password for session
      if (success) {
        toast({ title: "Login Berhasil", description: "Anda berhasil masuk dengan OTP." })
        router.push("/dashboard")
      } else {
        toast({ title: "Login Gagal", description: "Terjadi kesalahan saat login.", variant: "destructive" })
      }
    } else {
      toast({ title: "Verifikasi Gagal", description: "Kode OTP tidak valid.", variant: "destructive" })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Login dengan OTP</CardTitle>
        <CardDescription>Masukkan email Anda untuk menerima kode OTP.</CardDescription>
      </CardHeader>
      <CardContent>
        {!otpSent ? (
          <form onSubmit={handleRequestOtp} className="grid gap-4">
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
            <Button type="submit" className="w-full" disabled={isSendingOtp}>
              {isSendingOtp ? "Mengirim OTP..." : "Kirim OTP"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline">
                Login dengan Kata Sandi
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otp">Kode OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Masukkan 6 digit OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
              {isVerifyingOtp ? "Memverifikasi..." : "Verifikasi & Login"}
            </Button>
            <Button variant="link" type="button" onClick={handleRequestOtp} disabled={isSendingOtp}>
              {isSendingOtp ? "Mengirim ulang..." : "Kirim Ulang OTP"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="underline">
                Login dengan Kata Sandi
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
