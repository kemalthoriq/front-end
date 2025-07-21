"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { login, register } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "register"
}

export function AuthDialog({ isOpen, onClose, initialTab = "login" }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  const [loginState, loginAction, isLoginPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await login(formData)
    if (result.success) {
      toast({ title: "Login Berhasil", description: result.message })
      onClose()
    } else {
      toast({ title: "Login Gagal", description: result.message, variant: "destructive" })
    }
    return result
  }, null)

  const [registerState, registerAction, isRegisterPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await register(formData)
      if (result.success) {
        toast({ title: "Registrasi Berhasil", description: result.message })
        setActiveTab("login") // Switch to login after successful registration
      } else {
        toast({ title: "Registrasi Gagal", description: result.message, variant: "destructive" })
      }
      return result
    },
    null,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{activeTab === "login" ? "Login" : "Daftar"}</DialogTitle>
          <DialogDescription>{activeTab === "login" ? "Masuk ke akun Anda." : "Buat akun baru."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {activeTab === "login" ? (
            <form action={loginAction} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div>
                <Label htmlFor="login-password">Kata Sandi</Label>
                <Input id="login-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoginPending}>
                {isLoginPending ? "Memproses..." : "Login"}
              </Button>
              <Button variant="link" className="w-full" onClick={() => setActiveTab("register")}>
                Belum punya akun? Daftar
              </Button>
            </form>
          ) : (
            <form action={registerAction} className="space-y-4">
              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div>
                <Label htmlFor="register-password">Kata Sandi</Label>
                <Input id="register-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isRegisterPending}>
                {isRegisterPending ? "Mendaftar..." : "Daftar"}
              </Button>
              <Button variant="link" className="w-full" onClick={() => setActiveTab("login")}>
                Sudah punya akun? Login
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
