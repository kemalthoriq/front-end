'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getProductById, type Product } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams(); // Use useParams hook
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(params.id as string);
        if (!fetchedProduct) {
          notFound();
        }
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="container mx-auto">
            <div className="animate-pulse">
              <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
                <div className="h-[500px] bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link produk disalin ke clipboard');
      }
    } catch (error) {
      toast.error('Gagal membagikan produk');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'text-gray-300'
        }`}
      />
    ));
  };

  const images = product.images || [product.imageUrl];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-[500px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <Image
                  src={images[selectedImage] || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white">NEW</Badge>}
                  {product.isBestseller && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">BESTSELLER</Badge>
                  )}
                  {product.isOnSale && <Badge className="bg-red-500 hover:bg-red-600 text-white">SALE</Badge>}
                </div>
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                        selectedImage === index ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image || '/placeholder.svg'}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
                  <p className="text-lg text-muted-foreground mt-2">{product.brand}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">{renderStars(product.rating)}</div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} ulasan)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-primary">{formatPrice(product.price)}</div>
                  {product.originalPrice && (
                    <div className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Product Specs */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-sm">
                    {product.purity}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {product.weight}g
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {product.category}
                  </Badge>
                  {product.subcategory && (
                    <Badge variant="outline" className="text-sm">
                      {product.subcategory}
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground">{product.description}</p>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? `Tersedia (${product.stockQuantity} stok)` : 'Stok Habis'}
                  </span>
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={!product.inStock}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-20 text-center"
                        min="1"
                        max={product.stockQuantity}
                        disabled={!product.inStock}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        disabled={!product.inStock}
                      >
                        +
                      </Button>
                    </div>

                    <div className="text-lg font-semibold">Total: {formatPrice(product.price * quantity)}</div>
                  </div>

                  <div className="flex gap-3">
                    <Button size="lg" onClick={handleAddToCart} disabled={!product.inStock} className="flex-1">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Tambah ke Keranjang
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setIsLiked(!isLiked)}>
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Garansi Keaslian</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Gratis Ongkir</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                    <span>Tukar Tambah</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span>Bersertifikat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detail Produk</TabsTrigger>
                <TabsTrigger value="specs">Spesifikasi</TabsTrigger>
                <TabsTrigger value="reviews">Ulasan ({product.reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Produk</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>{product.description}</p>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.details.split(', ').map((detail, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Spesifikasi Teknis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Berat:</span>
                          <span>{product.weight}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Kemurnian:</span>
                          <span>{product.purity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Brand:</span>
                          <span>{product.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Kategori:</span>
                          <span>{product.category}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {product.subcategory && (
                          <div className="flex justify-between">
                            <span className="font-medium">Subkategori:</span>
                            <span>{product.subcategory}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="font-medium">Stok:</span>
                          <span>{product.stockQuantity} unit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Rating:</span>
                          <span>{product.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ulasan Pelanggan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Fitur ulasan akan segera hadir</p>
                      <p className="text-sm mt-2">
                        Rating saat ini: {product.rating}/5 dari {product.reviewCount} ulasan
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}