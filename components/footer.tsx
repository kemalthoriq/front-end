import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6 text-center text-sm text-muted-foreground">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
        <p>&copy; {new Date().getFullYear()} GoldMart. Semua hak dilindungi.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="transition-colors hover:text-primary">
            Kebijakan Privasi
          </Link>
          <Link href="#" className="transition-colors hover:text-primary">
            Syarat & Ketentuan
          </Link>
          <Link href="#" className="transition-colors hover:text-primary">
            Pengiriman
          </Link>
        </nav>
      </div>
    </footer>
  )
}
