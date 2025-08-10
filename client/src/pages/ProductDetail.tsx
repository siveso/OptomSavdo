import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Heart, Star, ShoppingCart, Minus, Plus, Play, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, Review } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", params.id],
    retry: false,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/products", params.id, "reviews"],
    retry: false,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        window.location.href = "/api/login";
        return;
      }
      await apiRequest("POST", "/api/cart", {
        productId: params.id,
        quantity,
        isWholesale,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: t("add_to_cart", language),
        description: language === "uz" ? "Mahsulot savatga qo'shildi" :
                     language === "ru" ? "Товар добавлен в корзину" :
                     "Product added to cart",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulotni savatga qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="w-full h-96 bg-gray-200 rounded-lg mb-4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-full h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "uz" ? "Mahsulot topilmadi" : 
               language === "ru" ? "Товар не найден" : "Product not found"}
            </h1>
            <Link href="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === "uz" ? "Mahsulotlarga qaytish" : 
                 language === "ru" ? "Вернуться к товарам" : "Back to products"}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getProductName = () => {
    if (language === "uz") return product.nameUz || product.name;
    if (language === "ru") return product.nameRu || product.name;
    return product.nameEn || product.name;
  };

  const getProductDescription = () => {
    if (language === "uz") return product.descriptionUz || product.description;
    if (language === "ru") return product.descriptionRu || product.description;
    return product.descriptionEn || product.description;
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(price));
  };

  const currentPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const totalPrice = Number(currentPrice) * quantity;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-primary">{t("home", language)}</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            {language === "uz" ? "Mahsulotlar" : language === "ru" ? "Товары" : "Products"}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{getProductName()}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={images[selectedImageIndex]}
                alt={getProductName()}
                className="w-full h-96 object-cover rounded-lg"
              />
              {product.videoUrl && (
                <Button
                  variant="secondary"
                  className="absolute bottom-4 right-4"
                  onClick={() => window.open(product.videoUrl, '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {language === "uz" ? "Video ko'rish" : 
                   language === "ru" ? "Смотреть видео" : "Watch Video"}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${getProductName()} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {product.isNew && (
                  <Badge className="bg-red-500 text-white">
                    {language === "uz" ? "YANGI" : language === "ru" ? "НОВЫЙ" : "NEW"}
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-accent text-white">
                    {language === "uz" ? "Hit" : language === "ru" ? "Хит" : "Hit"}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{getProductName()}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(Number(product.rating)) ? 'fill-current' : ''}`}
                    />
                  ))}
                </div>
                <span className="text-slate-600">({product.reviewCount} {language === "uz" ? "baho" : language === "ru" ? "отзывов" : "reviews"})</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceType"
                      checked={!isWholesale}
                      onChange={() => setIsWholesale(false)}
                      className="text-primary"
                    />
                    <span>{t("retail_price", language)}</span>
                  </label>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.retailPrice)} {t("som", language)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-accent bg-opacity-10 p-4 rounded-lg">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceType"
                      checked={isWholesale}
                      onChange={() => setIsWholesale(true)}
                      className="text-accent"
                    />
                    <span className="font-medium text-accent">
                      {t("wholesale_price", language)} ({product.wholesaleMinQuantity}+ {language === "uz" ? "dona" : language === "ru" ? "шт" : "pcs"})
                    </span>
                  </label>
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(product.wholesalePrice)} {t("som", language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">{t("quantity", language)}:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">
                  {language === "uz" ? "Jami narx" : language === "ru" ? "Общая стоимость" : "Total Price"}:
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalPrice.toString())} {t("som", language)}
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-primary text-white font-semibold hover:bg-blue-700"
                  onClick={() => addToCartMutation.mutate()}
                  disabled={addToCartMutation.isPending}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {addToCartMutation.isPending ? "..." : t("add_to_cart", language)}
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">
                {language === "uz" ? "Tavsif" : language === "ru" ? "Описание" : "Description"}
              </TabsTrigger>
              <TabsTrigger value="reviews">
                {language === "uz" ? "Sharhlar" : language === "ru" ? "Отзывы" : "Reviews"} ({reviews.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  {getProductDescription() || (
                    language === "uz" ? "Bu mahsulot haqida batafsil ma'lumot mavjud emas." :
                    language === "ru" ? "Подробная информация об этом товаре недоступна." :
                    "Detailed information about this product is not available."
                  )}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review: Review & { user: any }) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={review.user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                            alt={review.user?.firstName || "User"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold">{review.user?.firstName} {review.user?.lastName}</h4>
                            <div className="flex text-yellow-400">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">
                          {new Date(review.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600">
                      {language === "uz" ? "Hozircha sharhlar yo'q" :
                       language === "ru" ? "Пока нет отзывов" :
                       "No reviews yet"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
