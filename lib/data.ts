export interface Product {
  id: string
  name: string
  description: string
  price: number // USD per unit
  originalPrice?: number // For discount display
  imageUrl: string
  images?: string[] // Multiple images
  details: string
  category: string
  subcategory?: string
  weight: number // in grams
  purity: string // 24K, 22K, 18K, etc.
  brand: string
  inStock: boolean
  stockQuantity: number
  isNew?: boolean
  isBestseller?: boolean
  isOnSale?: boolean
  rating: number
  reviewCount: number
  tags: string[]
}

export const products: Product[] = [
  {
    id: "1",
    name: "Batangan Emas Antam 24K (1g)",
    description:
      "Batangan emas murni 24 karat dari PT Antam, bersertifikat resmi dan terjamin keasliannya. Investasi emas yang aman dan menguntungkan.",
    price: 75,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Batangan+Emas+1g",
    images: [
      "/placeholder.svg?height=400&width=600&text=Batangan+Emas+1g+Front",
      "/placeholder.svg?height=400&width=600&text=Batangan+Emas+1g+Back",
      "/placeholder.svg?height=400&width=600&text=Sertifikat+Antam",
    ],
    details: "Berat: 1 gram, Kemurnian: 99.99% (24K), Produsen: PT Antam, Dimensi: 15x8x0.8mm, Sertifikat: Ya",
    category: "Batangan",
    subcategory: "Antam",
    weight: 1,
    purity: "24K",
    brand: "Antam",
    inStock: true,
    stockQuantity: 50,
    isNew: false,
    isBestseller: true,
    isOnSale: false,
    rating: 4.9,
    reviewCount: 234,
    tags: ["investasi", "antam", "bersertifikat", "24k"],
  },
  {
    id: "2",
    name: "Batangan Emas Antam 24K (5g)",
    description:
      "Batangan emas murni 24 karat dari PT Antam dengan berat 5 gram. Pilihan investasi yang populer dengan likuiditas tinggi.",
    price: 375,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Batangan+Emas+5g",
    images: [
      "/placeholder.svg?height=400&width=600&text=Batangan+Emas+5g+Front",
      "/placeholder.svg?height=400&width=600&text=Batangan+Emas+5g+Back",
    ],
    details: "Berat: 5 gram, Kemurnian: 99.99% (24K), Produsen: PT Antam, Dimensi: 25x15x1.2mm, Sertifikat: Ya",
    category: "Batangan",
    subcategory: "Antam",
    weight: 5,
    purity: "24K",
    brand: "Antam",
    inStock: true,
    stockQuantity: 30,
    isNew: false,
    isBestseller: true,
    isOnSale: false,
    rating: 4.8,
    reviewCount: 189,
    tags: ["investasi", "antam", "bersertifikat", "24k"],
  },
  {
    id: "3",
    name: "Batangan Emas UBS 24K (10g)",
    description:
      "Batangan emas premium dari UBS Switzerland dengan kemurnian 99.99%. Diakui secara internasional dan mudah diperjualbelikan.",
    price: 750,
    originalPrice: 780,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Batangan+UBS+10g",
    images: [
      "/placeholder.svg?height=400&width=600&text=Batangan+UBS+10g+Front",
      "/placeholder.svg?height=400&width=600&text=Batangan+UBS+10g+Back",
    ],
    details: "Berat: 10 gram, Kemurnian: 99.99% (24K), Produsen: UBS Switzerland, Dimensi: 27x15x1.5mm, Sertifikat: Ya",
    category: "Batangan",
    subcategory: "UBS",
    weight: 10,
    purity: "24K",
    brand: "UBS",
    inStock: true,
    stockQuantity: 25,
    isNew: false,
    isBestseller: false,
    isOnSale: true,
    rating: 4.7,
    reviewCount: 156,
    tags: ["investasi", "ubs", "switzerland", "premium", "24k"],
  },
  {
    id: "4",
    name: "Cincin Emas 18K Solitaire Diamond",
    description:
      "Cincin emas 18 karat elegan dengan berlian solitaire 0.5 karat. Desain klasik yang sempurna untuk pertunangan atau hadiah istimewa.",
    price: 1200,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Cincin+Diamond+Solitaire",
    images: [
      "/placeholder.svg?height=400&width=600&text=Cincin+Diamond+Front",
      "/placeholder.svg?height=400&width=600&text=Cincin+Diamond+Side",
      "/placeholder.svg?height=400&width=600&text=Cincin+Diamond+Detail",
    ],
    details: "Bahan: Emas 18K, Batu: Berlian (0.5 karat), Ukuran: 6-10 (dapat disesuaikan), Potongan: Round Brilliant",
    category: "Perhiasan",
    subcategory: "Cincin",
    weight: 3.5,
    purity: "18K",
    brand: "Toko Emas Premium",
    inStock: true,
    stockQuantity: 8,
    isNew: true,
    isBestseller: false,
    isOnSale: false,
    rating: 4.9,
    reviewCount: 67,
    tags: ["perhiasan", "cincin", "berlian", "18k", "pertunangan"],
  },
  {
    id: "5",
    name: "Kalung Emas 22K Venetian Chain",
    description:
      "Kalung emas 22 karat dengan desain rantai Venetian yang elegan. Cocok untuk pemakaian sehari-hari maupun acara formal.",
    price: 650,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Kalung+Venetian+Chain",
    images: [
      "/placeholder.svg?height=400&width=600&text=Kalung+Venetian+Front",
      "/placeholder.svg?height=400&width=600&text=Kalung+Venetian+Detail",
    ],
    details: "Bahan: Emas 22K, Panjang: 50 cm, Berat: 12 gram, Jenis Rantai: Venetian, Gesper: Lobster Claw",
    category: "Perhiasan",
    subcategory: "Kalung",
    weight: 12,
    purity: "22K",
    brand: "Toko Emas Premium",
    inStock: true,
    stockQuantity: 15,
    isNew: false,
    isBestseller: true,
    isOnSale: false,
    rating: 4.6,
    reviewCount: 89,
    tags: ["perhiasan", "kalung", "22k", "venetian", "elegan"],
  },
  {
    id: "6",
    name: "Koin Emas American Eagle (1oz)",
    description:
      "Koin emas American Eagle 1 ons dengan kemurnian 22K. Koin resmi dari US Mint yang diakui secara internasional.",
    price: 2100,
    imageUrl: "/placeholder.svg?height=400&width=600&text=American+Eagle+Coin",
    images: [
      "/placeholder.svg?height=400&width=600&text=American+Eagle+Front",
      "/placeholder.svg?height=400&width=600&text=American+Eagle+Back",
    ],
    details: "Berat: 1 Troy Ounce (31.1g), Kemurnian: 91.67% (22K), Diameter: 32.7mm, Produsen: US Mint",
    category: "Koin",
    subcategory: "American Eagle",
    weight: 31.1,
    purity: "22K",
    brand: "US Mint",
    inStock: true,
    stockQuantity: 12,
    isNew: false,
    isBestseller: false,
    isOnSale: false,
    rating: 4.8,
    reviewCount: 145,
    tags: ["koin", "american eagle", "us mint", "22k", "investasi"],
  },
  {
    id: "7",
    name: "Anting Emas 14K Stud Earrings",
    description:
      "Anting stud emas 14 karat yang simpel dan elegan. Cocok untuk pemakaian sehari-hari dan mudah dipadukan dengan outfit apapun.",
    price: 280,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Anting+Stud+14K",
    images: [
      "/placeholder.svg?height=400&width=600&text=Anting+Stud+Front",
      "/placeholder.svg?height=400&width=600&text=Anting+Stud+Worn",
    ],
    details: "Bahan: Emas 14K, Jenis: Anting Stud, Berat: 1.5 gram (pasangan), Penutup: Push Back",
    category: "Perhiasan",
    subcategory: "Anting",
    weight: 1.5,
    purity: "14K",
    brand: "Toko Emas Premium",
    inStock: true,
    stockQuantity: 20,
    isNew: false,
    isBestseller: true,
    isOnSale: false,
    rating: 4.5,
    reviewCount: 203,
    tags: ["perhiasan", "anting", "14k", "stud", "simple"],
  },
  {
    id: "8",
    name: "Gelang Emas 18K Tennis Bracelet",
    description:
      "Gelang emas 18 karat dengan desain tennis bracelet yang mewah. Dihiasi dengan cubic zirconia berkualitas tinggi.",
    price: 890,
    originalPrice: 950,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Tennis+Bracelet",
    images: [
      "/placeholder.svg?height=400&width=600&text=Tennis+Bracelet+Front",
      "/placeholder.svg?height=400&width=600&text=Tennis+Bracelet+Detail",
    ],
    details: "Bahan: Emas 18K, Panjang: 18 cm, Berat: 8 gram, Batu: Cubic Zirconia, Gesper: Box Clasp",
    category: "Perhiasan",
    subcategory: "Gelang",
    weight: 8,
    purity: "18K",
    brand: "Toko Emas Premium",
    inStock: true,
    stockQuantity: 6,
    isNew: true,
    isBestseller: false,
    isOnSale: true,
    rating: 4.7,
    reviewCount: 34,
    tags: ["perhiasan", "gelang", "18k", "tennis", "mewah"],
  },
  {
    id: "9",
    name: "Liontin Emas 22K Pendant Heart",
    description:
      "Liontin emas 22 karat berbentuk hati dengan ukiran detail yang indah. Sempurna sebagai hadiah untuk orang terkasih.",
    price: 320,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Liontin+Heart+22K",
    images: [
      "/placeholder.svg?height=400&width=600&text=Liontin+Heart+Front",
      "/placeholder.svg?height=400&width=600&text=Liontin+Heart+Back",
    ],
    details: "Bahan: Emas 22K, Bentuk: Hati, Berat: 2.8 gram, Dimensi: 15x12mm, Rantai: Tidak termasuk",
    category: "Perhiasan",
    subcategory: "Liontin",
    weight: 2.8,
    purity: "22K",
    brand: "Toko Emas Premium",
    inStock: true,
    stockQuantity: 18,
    isNew: false,
    isBestseller: false,
    isOnSale: false,
    rating: 4.4,
    reviewCount: 78,
    tags: ["perhiasan", "liontin", "22k", "hati", "hadiah"],
  },
  {
    id: "10",
    name: "Koin Emas Maple Leaf (1oz)",
    description:
      "Koin emas Canadian Maple Leaf 1 ons dengan kemurnian 99.99%. Salah satu koin emas paling murni di dunia.",
    price: 2050,
    imageUrl: "/placeholder.svg?height=400&width=600&text=Maple+Leaf+Coin",
    images: [
      "/placeholder.svg?height=400&width=600&text=Maple+Leaf+Front",
      "/placeholder.svg?height=400&width=600&text=Maple+Leaf+Back",
    ],
    details: "Berat: 1 Troy Ounce (31.1g), Kemurnian: 99.99% (24K), Diameter: 30mm, Produsen: Royal Canadian Mint",
    category: "Koin",
    subcategory: "Maple Leaf",
    weight: 31.1,
    purity: "24K",
    brand: "Royal Canadian Mint",
    inStock: true,
    stockQuantity: 8,
    isNew: false,
    isBestseller: true,
    isOnSale: false,
    rating: 4.9,
    reviewCount: 167,
    tags: ["koin", "maple leaf", "canada", "24k", "murni"],
  },
]

export async function getProducts(category?: string, subcategory?: string, search?: string): Promise<Product[]> {
  // Simulasi penundaan API
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = [...products]

  if (category && category !== "Semua") {
    filteredProducts = filteredProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  }

  if (subcategory && subcategory !== "Semua") {
    filteredProducts = filteredProducts.filter(
      (product) => product.subcategory?.toLowerCase() === subcategory.toLowerCase(),
    )
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  return filteredProducts
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // Simulasi penundaan API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products.find((product) => product.id === id)
}

export function getCategories(): string[] {
  return ["Semua", "Batangan", "Perhiasan", "Koin"]
}

export function getSubcategories(category: string): string[] {
  if (category === "Batangan") {
    return ["Semua", "Antam", "UBS"]
  } else if (category === "Perhiasan") {
    return ["Semua", "Cincin", "Kalung", "Anting", "Gelang", "Liontin"]
  } else if (category === "Koin") {
    return ["Semua", "American Eagle", "Maple Leaf"]
  }
  return ["Semua"]
}

export interface GoldPriceData {
  date: string
  buy: number // IDR per gram
  sell: number // IDR per gram
}

export async function getGoldPriceHistory(period: "7d" | "30d" | "6m" | "1y"): Promise<GoldPriceData[]> {
  await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate API call

  const today = new Date()
  const data: GoldPriceData[] = []
  let daysToGenerate = 0

  switch (period) {
    case "7d":
      daysToGenerate = 7
      break
    case "30d":
      daysToGenerate = 30
      break
    case "6m":
      daysToGenerate = 180 // Approx 6 months
      break
    case "1y":
      daysToGenerate = 365 // Approx 1 year
      break
    default:
      daysToGenerate = 7
  }

  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateString = date.toISOString().split("T")[0]
    // Simulate price fluctuation, more stable for longer periods
    const fluctuationFactor = period === "7d" ? 50000 : period === "30d" ? 30000 : 10000
    const basePrice = 900000 + Math.sin(i * 0.1) * fluctuationFactor + Math.random() * 5000
    data.push({
      date: dateString,
      buy: Math.round(basePrice - 5000),
      sell: Math.round(basePrice + 5000),
    })
  }
  return data.reverse() // Show oldest first
}

export async function getGoldSpotPrice(): Promise<{ buy: number; sell: number }> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const currentPrice = 950000 + Math.random() * 10000 // Simulate current price
  return {
    buy: Math.round(currentPrice - 5000),
    sell: Math.round(currentPrice + 5000),
  }
}
