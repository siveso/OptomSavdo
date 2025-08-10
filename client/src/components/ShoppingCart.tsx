import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
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

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(Number(price));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: any) => {
      const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
      return total + (Number(price) * item.quantity);
    }, 0);
  };

  const getProductName = (product: any) => {
    if (language === "uz") return product.nameUz || product.name;
    if (language === "ru") return product.nameRu || product.name;
    return product.nameEn || product.name;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">{t("cart", language)}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {language === "uz" ? "Savatni ko'rish uchun tizimga kiring" :
                 language === "ru" ? "Войдите в систему для просмотра корзины" :
                 "Please log in to view your cart"}
              </p>
              <Button onClick={() => window.location.href = "/api/login"}>
                {t("login", language)}
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">{t("cart_empty", language)}</p>
              <Button onClick={onClose}>
                {t("continue_shopping", language)}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <img 
                    src={item.product.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"} 
                    className="w-16 h-16 object-cover rounded" 
                    alt={getProductName(item.product)}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{getProductName(item.product)}</h4>
                    <p className="text-sm text-slate-600">
                      {formatPrice(item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice)} {t("som", language)}
                    </p>
                    {item.isWholesale && (
                      <span className="text-xs text-accent font-medium">
                        {language === "uz" ? "Optom narx" : language === "ru" ? "Оптовая цена" : "Wholesale price"}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                        disabled={updateQuantityMutation.isPending}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => updateQuantityMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        disabled={updateQuantityMutation.isPending}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => removeItemMutation.mutate(item.id)}
                      disabled={removeItemMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cartItems.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">{t("cart_total", language)}</span>
              <span className="text-xl font-bold">{formatPrice(calculateTotal().toString())} {t("som", language)}</span>
            </div>
            <Button className="w-full bg-primary text-white font-semibold hover:bg-blue-700">
              {t("checkout", language)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
