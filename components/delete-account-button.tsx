"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { deleteAccount } from "@/lib/user-data"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"

export function DeleteAccountButton() {
  const { user, logout } = useAuth()
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsPending(true)
    const result = await deleteAccount()
    setIsPending(false)
    if (result.success) {
      toast({ title: "Akun Dihapus", description: result.message })
      await logout() // Clear session in context
      router.push("/") // Redirect to home
    } else {
      toast({ title: "Gagal Menghapus Akun", description: result.message, variant: "destructive" })
    }
  }

  if (!user) {
    return null // Only show if logged in
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          {isPending ? "Menghapus..." : "Hapus Akun"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda secara permanen dan menghapus data Anda
            dari server kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Hapus Akun
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
