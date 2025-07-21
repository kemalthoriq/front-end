import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileEditForm } from "@/components/profile-edit-form"
import { KYCUploadForm } from "@/components/kyc-upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto py-8 grid gap-8">
          <h1 className="text-3xl font-bold">Profil Saya</h1>
          <ProfileEditForm />
          <KYCUploadForm />
          <Card>
            <CardHeader>
              <CardTitle>Tambah Rekening Bank</CardTitle>
              <CardDescription>Tambahkan rekening bank untuk penarikan dana.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Anda dapat mengelola rekening bank Anda di halaman{" "}
                <Link href="/wallet" className="underline">
                  Wallet
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
