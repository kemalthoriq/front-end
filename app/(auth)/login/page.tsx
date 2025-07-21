"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, setIsPending] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    const success = await login(email, password)
    setIsPending(false)
    if (success) {
      router.push("/dashboard") // Redirect to dashboard on successful login
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Masukkan email dan kata sandi Anda untuk masuk ke akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {/* CAPTCHA Placeholder */}
            <div className="grid gap-2">
              <Label htmlFor="captcha">Verifikasi (CAPTCHA)</Label>
              <Input id="captcha" placeholder="Masukkan kode di atas" />
              <p className="text-xs text-muted-foreground">
                {/* In a real app, this would be an image or reCAPTCHA widget */}[ CAPTCHA IMAGE / WIDGET HERE ]
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Memproses..." : "Login"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{" "}
              <Link href="/register" className="underline">
                Daftar
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/forgot-password" className="underline">
                Lupa Kata Sandi?
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Atau{" "}
              <Link href="/login-otp" className="underline">
                Login dengan OTP
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
