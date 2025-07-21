"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { getCategories, getSubcategories } from "@/lib/data"

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    search: string
    category: string
    subcategory: string
    priceRange: [number, number]
    purity: string
    sortBy: string
  }) => void
  currentFilters: {
    search: string
    category: string
    subcategory: string
    priceRange: [number, number]
    purity: string
    sortBy: string
  }
}

export function ProductFilters({ onFiltersChange, currentFilters }: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const categories = getCategories()
  const subcategories = getSubcategories(currentFilters.category)
  const purities = ["Semua", "24K", "22K", "18K", "14K"]
  const sortOptions = [
    { value: "name", label: "Nama A-Z" },
    { value: "price-low", label: "Harga Terendah" },
    { value: "price-high", label: "Harga Tertinggi" },
    { value: "rating", label: "Rating Tertinggi" },
    { value: "newest", label: "Terbaru" },
    { value: "bestseller", label: "Terlaris" },
  ]

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...currentFilters, [key]: value }

    // Reset subcategory when category changes
    if (key === "category") {
      newFilters.subcategory = "Semua"
    }

    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: "Semua",
      subcategory: "Semua",
      priceRange: [0, 3000],
      purity: "Semua",
      sortBy: "name",
    })
  }

  const activeFiltersCount = [
    currentFilters.search,
    currentFilters.category !== "Semua" ? currentFilters.category : null,
    currentFilters.subcategory !== "Semua" ? currentFilters.subcategory : null,
    currentFilters.purity !== "Semua" ? currentFilters.purity : null,
    currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 3000 ? "price" : null,
  ].filter(Boolean).length

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari & Filter Produk
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              <Filter className="h-4 w-4 mr-1" />
              {isExpanded ? "Sembunyikan" : "Filter"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk emas..."
            value={currentFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={currentFilters.category === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("category", category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Subcategory */}
            {currentFilters.category !== "Semua" && subcategories.length > 1 && (
              <div className="space-y-2">
                <Label>Subkategori</Label>
                <Select
                  value={currentFilters.subcategory}
                  onValueChange={(value) => handleFilterChange("subcategory", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Purity */}
            <div className="space-y-2">
              <Label>Kemurnian</Label>
              <Select value={currentFilters.purity} onValueChange={(value) => handleFilterChange("purity", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {purities.map((purity) => (
                    <SelectItem key={purity} value={purity}>
                      {purity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>
                Rentang Harga: ${currentFilters.priceRange[0]} - ${currentFilters.priceRange[1]}
              </Label>
              <Slider
                value={currentFilters.priceRange}
                onValueChange={(value) => handleFilterChange("priceRange", value as [number, number])}
                max={3000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Urutkan</Label>
              <Select value={currentFilters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
