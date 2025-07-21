"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { getLoginActivities, logoutDevice, logoutAllDevices, type LoginActivity } from "@/lib/user-data"
import { useAuth } from "@/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

export function LoginActivityTable() {
  const { user, isLoading: isAuthLoading, logout } = useAuth()
  const [activities, setActivities] = useState<LoginActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchActivities = async () => {
    if (user) {
      setIsLoading(true)
      const fetchedActivities = await getLoginActivities()
      setActivities(fetchedActivities)
      setIsLoading(false)
    } else {
      setActivities([])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [user])

  const handleLogoutDevice = async (id: string, isCurrent: boolean) => {
    if (isCurrent) {
      if (confirm("Ini adalah sesi Anda saat ini. Apakah Anda yakin ingin keluar?")) {
        await logout() // Logout current session
      }
    } else {
      if (confirm("Apakah Anda yakin ingin mengeluarkan perangkat ini?")) {
        const result = await logoutDevice(id)
        if (result.success) {
          toast({ title: "Berhasil", description: result.message })
          fetchActivities() // Refresh list
        } else {
          toast({ title: "Gagal", description: result.message, variant: "destructive" })
        }
      }
    }
  }

  const handleLogoutAllDevices = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari semua perangkat lain? (Sesi saat ini akan tetap aktif)")) {
      const result = await logoutAllDevices()
      if (result.success) {
        toast({ title: "Berhasil", description: result.message })
        fetchActivities() // Refresh list
      } else {
        toast({ title: "Gagal", description: result.message, variant: "destructive" })
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
          <CardTitle>Aktivitas Login</CardTitle>
          <CardDescription>Lihat perangkat yang login ke akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Silakan login untuk melihat aktivitas login.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Aktivitas Login</CardTitle>
          <CardDescription>Lihat perangkat yang login ke akun Anda.</CardDescription>
        </div>
        {activities.length > 1 && (
          <Button variant="outline" size="sm" onClick={handleLogoutAllDevices}>
            <LogOut className="mr-2 h-4 w-4" /> Keluar dari Semua Perangkat Lain
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">Tidak ada aktivitas login.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Perangkat</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {activity.device} {activity.isCurrent && <span className="text-xs text-primary">(Saat Ini)</span>}
                    </TableCell>
                    <TableCell>{activity.location}</TableCell>
                    <TableCell>{activity.ipAddress}</TableCell>
                    <TableCell>{new Date(activity.timestamp).toLocaleString("id-ID")}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleLogoutDevice(activity.id, activity.isCurrent)}
                        disabled={activity.isCurrent && activities.length === 1} // Cannot log out if it's the only session
                      >
                        <LogOut className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Keluar</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
