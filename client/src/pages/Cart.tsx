import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
    retry: false,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulot miqdorini yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Muvaffaqiyatli",
        description: "Mahsulot savatdan o'chirildi",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Mahsulotni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Muvaffaqiyatli",
        description: "Savatcha tozalandi",
      });
    },
  });

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(price));
  };

  const getProductName = (product: any) => {
    if (language === "uz") return product.nameUz || product.name;
    if (language === "ru") return product.nameRu || product.name;
    return product.nameEn || product.name;
  };

  const calculateItemTotal = (item: any) => {
    const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return Number(price) * item.quantity;
  };

  const calculateGrandTotal = () => {
    return cartItems.reduce((total: number, item: any) => total + calculateItemTotal(item), 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === "uz" ? "Savatni ko'rish uchun tizimga kiring" :
               language === "ru" ? "Войдите в систему для просмотра корзины" :
               "Please log in to view your cart"}
            </h1>
            <Button asChild>
              <a href="/api/login">{t("login", language)}</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("cart", language)}</h1>
            <p className="text-slate-600">
              {cartItems.length} {language === "uz" ? "mahsulot" : language === "ru" ? "товаров" : "items"}
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("continue_shopping", language)}
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="w-24 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{t("cart_empty", language)}</h2>
            <p className="text-slate-600 mb-6">
              {language === "uz" ? "Savatchangiz bo'sh. Mahsulotlarni ko'rib chiqing!" :
               language === "ru" ? "Ваша корзина пуста. Посмотрите наши товары!" :
               "Your cart is empty. Check out our products!"}
            </p>
            <Link href="/products">
              <Button>{t("continue_shopping", language)}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.id}`}>
                      <img
                        src={item.product.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"}
                        alt={getProductName(item.product)}
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary cursor-pointer">
                          {getProductName(item.product)}
                        </h3>
                      </Link>
                      <p className="text-sm text-slate-600 mb-2">
                        {item.isWholesale ? (
                          <span className="text-accent font-medium">
                            {t("wholesale_price", language)} - {formatPrice(item.product.wholesalePrice)} {t("som", language)}
                          </span>
                        ) : (
                          <span>
                            {t("retail_price", language)} {formatPrice(item.product.retailPrice)} {t("som", language)}
                          </span>
                        )}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                            disabled={updateQuantityMutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItemMutation.mutate(item.id)}
                          disabled={removeItemMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {t("remove", language)}
                        </Button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(calculateItemTotal(item).toString())} {t("som", language)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                  onClick={() => clearCartMutation.mutate()}
                  disabled={clearCartMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === "uz" ? "Savatni tozalash" :
                   language === "ru" ? "Очистить корзину" :
                   "Clear Cart"}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-fit sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {language === "uz" ? "Buyurtma xulasasi" :
                 language === "ru" ? "Сводка заказа" :
                 "Order Summary"}
              </h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="flex-1 truncate pr-2">
                      {getProductName(item.product)} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(calculateItemTotal(item).toString())} {t("som", language)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t("cart_total", language)}</span>
                  <span className="text-primary">
                    {formatPrice(calculateGrandTotal().toString())} {t("som", language)}
                  </span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-primary text-white font-semibold hover:bg-blue-700 py-3">
                  {t("checkout", language)}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
