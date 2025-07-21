"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function AccountPreferences() {
  const [darkMode, setDarkMode] = useState(false) // Simulate dark mode preference
  const [language, setLanguage] = useState("id") // Simulate language preference
  const [transactionNotifications, setTransactionNotifications] = useState(true)
  const [priceNotifications, setPriceNotifications] = useState(true)

  const handleSavePreferences = () => {
    toast({ title: "Preferensi Disimpan", description: "Preferensi akun Anda telah diperbarui. (Simulasi)" })
    // In a real app, send these preferences to a server action
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi Akun</CardTitle>
        <CardDescription>Sesuaikan pengalaman Anda di Toko Emas Gadjah.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Mode Tampilan (Dark Mode)</Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={(checked) => {
              setDarkMode(checked)
              handleSavePreferences()
            }}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">Bahasa</Label>
          <Select
            value={language}
            onValueChange={(value) => {
              setLanguage(value)
              handleSavePreferences()
            }}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Pilih Bahasa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Bahasa Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <h3 className="text-lg font-semibold mt-2">Preferensi Notifikasi</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="transaction-notifications">Notifikasi Transaksi</Label>
            <Switch
              id="transaction-notifications"
              checked={transactionNotifications}
              onCheckedChange={(checked) => {
                setTransactionNotifications(checked)
                handleSavePreferences()
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="price-notifications">Notifikasi Harga</Label>
            <Switch
              id="price-notifications"
              checked={priceNotifications}
              onCheckedChange={(checked) => {
                setPriceNotifications(checked)
                handleSavePreferences()
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
