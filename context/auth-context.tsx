"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getCurrentUser, login as serverLogin, register as serverRegister, logout as serverLogout } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import type { UserProfile } from "@/lib/user-data"

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<boolean>
  refreshUser: () => Promise<void> // Added for refreshing user data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    setIsLoading(true)
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      const result = await serverLogin(formData)
      if (result.success) {
        await refreshUser()
        toast({ title: "Login Berhasil", description: result.message })
        return true
      } else {
        toast({ title: "Login Gagal", description: result.message, variant: "destructive" })
        return false
      }
    },
    [refreshUser],
  )

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const formData = new FormData()
    formData.append("fullName", fullName)
    formData.append("email", email)
    formData.append("password", password)
    const result = await serverRegister(formData)
    if (result.success) {
      toast({ title: "Registrasi Berhasil", description: result.message })
      return true
    } else {
      toast({ title: "Registrasi Gagal", description: result.message, variant: "destructive" })
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    const result = await serverLogout()
    if (result.success) {
      setUser(null)
      toast({ title: "Berhasil Keluar", description: result.message })
    } else {
      toast({ title: "Gagal Keluar", description: "Terjadi kesalahan saat keluar.", variant: "destructive" })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
