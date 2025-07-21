"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BellOff, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getUserNotifications, markNotificationAsRead, clearAllNotifications, type Notification } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export function NotificationsList() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchNotifications = async () => {
    if (user) {
      setIsLoading(true)
      const fetchedNotifications = await getUserNotifications()
      setNotifications(fetchedNotifications)
      setIsLoading(false)
    } else {
      setNotifications([])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [user])

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result.success) {
      fetchNotifications() // Refresh list
    } else {
      toast({ title: "Gagal", description: "Gagal menandai notifikasi sebagai sudah dibaca.", variant: "destructive" })
    }
  }

  const handleClearAll = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua notifikasi?")) {
      const result = await clearAllNotifications()
      if (result.success) {
        toast({ title: "Berhasil", description: "Semua notifikasi telah dihapus." })
        fetchNotifications() // Refresh list
      } else {
        toast({ title: "Gagal", description: "Gagal menghapus semua notifikasi.", variant: "destructive" })
      }
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi Anda</CardTitle>
          <CardDescription>Pembaruan penting tentang akun dan transaksi Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Silakan login untuk melihat notifikasi.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notifikasi Anda</CardTitle>
          <CardDescription>Pembaruan penting tentang akun dan transaksi Anda.</CardDescription>
        </div>
        {notifications.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            <BellOff className="mr-2 h-4 w-4" /> Hapus Semua
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">Tidak ada notifikasi baru.</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-3 rounded-md ${notification.isRead ? "bg-muted/50" : "bg-primary-foreground border border-primary/10"}`}
              >
                <div className="flex-shrink-0">
                  {notification.type === "transaction" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {notification.type === "kyc" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  {notification.type === "price_alert" && <BellOff className="h-5 w-5 text-yellow-500" />}
                  {notification.type === "reminder" && <BellOff className="h-5 w-5 text-orange-500" />}
                  {notification.type === "system" && <BellOff className="h-5 w-5 text-gray-500" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${notification.isRead ? "text-muted-foreground" : "font-medium"}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.date).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {!notification.isRead && (
                    <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(notification.id)}>
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Tandai sudah dibaca</span>
                    </Button>
                  )}
                  {notification.link && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={notification.link}>Lihat</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
