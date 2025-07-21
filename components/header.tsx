"use client"
import Link from "next/link"
import Image from "next/image"
import {
  Package2,
  Search,
  ShoppingCart,
  LayoutDashboard,
  User,
  Wallet,
  Goal,
  History,
  Settings,
  Bell,
  BookOpen,
  LifeBuoy,
  Gem,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { getUserNotifications, markNotificationAsRead, type Notification } from "@/lib/user-data"

export function Header() {
  const { totalItems } = useCart()
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length

  const fetchNotifications = async () => {
    if (user) {
      const fetchedNotifications = await getUserNotifications()
      setNotifications(fetchedNotifications)
    } else {
      setNotifications([])
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 10000) // Refresh notifications every 10 seconds
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id)
      fetchNotifications() // Refresh to update read status
    }
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const categories = ["Semua", "Batangan", "Perhiasan", "Koin", "Nugget"]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span>GoldMart</span>
                </Link>
                <Link
                  href="/"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Produk
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground w-full justify-start"
                    >
                      Kategori
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category} asChild>
                        <Link href={`/?category=${category}`}>{category}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link
                  href="/articles"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <BookOpen className="h-5 w-5" />
                  Artikel Edukasi
                </Link>
                <Link
                  href="/help"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LifeBuoy className="h-5 w-5" />
                  Pusat Bantuan
                </Link>
                <Link
                  href="/contact"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LifeBuoy className="h-5 w-5" />
                  Kontak Kami
                </Link>
                {user && (
                  <>
                    <Link
                      href="/dashboard"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      Profil
                    </Link>
                    <Link
                      href="/wallet"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Wallet className="h-5 w-5" />
                      Wallet
                    </Link>
                    <Link
                      href="/goals"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Goal className="h-5 w-5" />
                      Goals
                    </Link>
                    <Link
                      href="/transactions"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <History className="h-5 w-5" />
                      Transaksi
                    </Link>
                    <Link
                      href="/withdraw-physical"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Gem className="h-5 w-5" />
                      Tarik Emas Fisik
                    </Link>
                    <Link
                      href="/notifications"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Bell className="h-5 w-5" />
                      Notifikasi
                      {unreadNotificationsCount > 0 && (
                        <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/settings"
                      className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="h-5 w-5" />
                      Pengaturan
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span>GoldMart</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Produk
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-medium transition-colors hover:text-primary">
                Kategori
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link href={`/?category=${category}`}>{category}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/articles" className="transition-colors hover:text-primary">
            Artikel Edukasi
          </Link>
          <Link href="/how-it-works" className="transition-colors hover:text-primary">
            Cara Kerja
          </Link>
          <Link href="/about" className="transition-colors hover:text-primary">
            Tentang Kami
          </Link>
          <Link href="/faq" className="transition-colors hover:text-primary">
            FAQ
          </Link>
          <Link href="/contact" className="transition-colors hover:text-primary">
            Kontak
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className="transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link href="/wallet" className="transition-colors hover:text-primary">
                Wallet
              </Link>
            </>
          )}
        </nav>
        <div className="relative mx-4 hidden flex-1 max-w-md md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Cari produk emas..." className="w-full pl-8" />
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifikasi</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifikasi ({unreadNotificationsCount} Baru)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <DropdownMenuItem disabled>Tidak ada notifikasi.</DropdownMenuItem>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex flex-col items-start gap-1 ${!notification.isRead ? "font-medium bg-accent" : ""}`}
                    >
                      <p className="text-sm line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.date).toLocaleDateString("id-ID")}{" "}
                        {new Date(notification.date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/notifications">Lihat Semua Notifikasi</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Keranjang Belanja</span>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border">
                <Image
                  src="/placeholder-user.jpg"
                  width="32"
                  height="32"
                  className="rounded-full"
                  alt="Avatar Pengguna"
                />
                <span className="sr-only">Alihkan menu pengguna</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user ? `Halo, ${user.fullName || user.email.split("@")[0]}` : "Akun Saya"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoading ? (
                <DropdownMenuItem disabled>Memuat...</DropdownMenuItem>
              ) : user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/goals">Goals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transactions">Transaksi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/withdraw-physical">Tarik Emas Fisik</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications">Notifikasi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Pengaturan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Keluar</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => router.push("/login")}>Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/register")}>Daftar</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
