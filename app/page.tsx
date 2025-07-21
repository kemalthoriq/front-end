"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HomepageSections } from "@/components/homepage-sections"
import { getProducts, type Product } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Grid3X3, List, ArrowUp } from "lucide-react"

export default function GoldShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    category: "Semua",
    subcategory: "Semua",
    priceRange: [0, 3000] as [number, number],
    purity: "Semua",
    sortBy: "name",
  })

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let fetchedProducts = await getProducts(filters.category, filters.subcategory, filters.search)

        // Apply purity filter
        if (filters.purity !== "Semua") {
          fetchedProducts = fetchedProducts.filter((p) => p.purity === filters.purity)
        }

        // Apply price range filter
        fetchedProducts = fetchedProducts.filter(
          (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1],
        )

        // Apply sorting
        fetchedProducts.sort((a, b) => {
          switch (filters.sortBy) {
            case "price-low":
              return a.price - b.price
            case "price-high":
              return b.price - a.price
            case "rating":
              return b.rating - a.rating
            case "newest":
              return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
            case "bestseller":
              return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)
            default:
              return a.name.localeCompare(b.name)
          }
        })

        setProducts(fetchedProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const ProductSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-56 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HomepageSections />

        <section className="container mx-auto py-12 md:py-16 lg:py-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Koleksi Emas Premium</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan berbagai pilihan emas berkualitas tinggi untuk investasi dan perhiasan. Semua produk bersertifikat
              dan terjamin keasliannya.
            </p>
          </div>

          <ProductFilters onFiltersChange={setFilters} currentFilters={filters} />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {loading ? "Memuat..." : `Menampilkan ${products.length} produk`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Produk tidak ditemukan</h3>
              <p className="text-muted-foreground mb-4">Coba ubah filter atau kata kunci pencarian Anda</p>
              <Button
                onClick={() =>
                  setFilters({
                    search: "",
                    category: "Semua",
                    subcategory: "Semua",
                    priceRange: [0, 3000],
                    purity: "Semua",
                    sortBy: "name",
                  })
                }
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 max-w-4xl mx-auto"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg" size="icon">
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
