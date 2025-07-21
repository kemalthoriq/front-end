"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast({
      title: "Pesan Terkirim",
      description: "Terima kasih telah menghubungi kami. Kami akan segera membalas pesan Anda.",
    })
    setIsPending(false)
    // Reset form fields if needed
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8">
          <h1 className="mb-8 text-center text-3xl font-bold">Hubungi Kami</h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kirim Pesan kepada Kami</CardTitle>
                <CardDescription>Isi formulir di bawah ini dan kami akan menghubungi Anda kembali.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" placeholder="Nama Anda" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subjek</Label>
                    <Input id="subject" placeholder="Pertanyaan tentang akun" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Pesan Anda</Label>
                    <Textarea id="message" placeholder="Tulis pesan Anda di sini..." rows={5} required />
                  </div>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>support@gadjahhrd.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>+62 812 3456 7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Jl. WismaSarinadi S27-29</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Live Chat (Segera Hadir)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jam Operasional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>Senin - Jumat: 09:00 - 17:00 WIB</p>
                  <p>Sabtu: 09:00 - 13:00 WIB</p>
                  <p>Minggu & Hari Libur Nasional: Tutup</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
