import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangePasswordForm } from "@/components/change-password-form"
import { DeleteAccountButton } from "@/components/delete-account-button"
import { LoginActivityTable } from "@/components/login-activity-table"
import { AccountPreferences } from "@/components/account-preferences"
import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Pengaturan Akun</h1>
          <AccountPreferences /> {/* New: Account Preferences */}
          <ChangePasswordForm />
          <LoginActivityTable /> {/* New: Login Activity Table */}
          <Card>
            <CardHeader>
              <CardTitle>Autentikasi Dua Faktor (2FA)</CardTitle>
              <CardDescription>Tambahkan lapisan keamanan ekstra ke akun Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fitur ini akan segera hadir.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Notifikasi Harga</CardTitle>
              <CardDescription>Atur notifikasi untuk pergerakan harga emas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/settings/price-alerts">Atur Notifikasi Harga</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Hapus Akun</CardTitle>
              <CardDescription>Tindakan ini tidak dapat dibatalkan.</CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountButton />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
