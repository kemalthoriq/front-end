import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto grid gap-8 md:grid-cols-2 lg:gap-12">
          <Skeleton className="h-[400px] w-full rounded-lg md:h-[500px]" />
          <div className="flex flex-col justify-center">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/4 mb-2" />
            <Skeleton className="h-20 w-full mb-6" />
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full mb-8" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
