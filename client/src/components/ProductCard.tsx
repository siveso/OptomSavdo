import { useState } from "react";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, isWholesale: boolean) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { language } = useLanguage();
  const [isWishlisted, setIsWishlisted] = useState(false);

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

  const discountPercentage = Math.round(
    ((Number(product.retailPrice) - Number(product.wholesalePrice)) / Number(product.retailPrice)) * 100
  );

  const handleAddToCart = (isWholesale: boolean = false) => {
    if (onAddToCart) {
      onAddToCart(product.id, isWholesale);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group">
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={product.images?.[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
          alt={getProductName()}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-red-500 text-white">
              {language === "uz" ? "YANGI" : language === "ru" ? "НОВЫЙ" : "NEW"}
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-secondary text-white">
              -{discountPercentage}%
            </Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-accent text-white">
              {language === "uz" ? "Hit" : language === "ru" ? "Хит" : "Hit"}
            </Badge>
          )}
        </div>
        
        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{getProductName()}</h4>
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{getProductDescription()}</p>
        
        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(Number(product.rating)) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-600">({product.reviewCount})</span>
          </div>
        </div>
        
        {/* Dual Pricing Display */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{t("retail_price", language)}</span>
            <div>
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.retailPrice)}</span>
              <span className="text-sm text-slate-600 ml-1">{t("som", language)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-accent bg-opacity-10 p-2 rounded-lg">
            <span className="text-sm font-medium text-accent">
              {t("wholesale_price", language)} ({product.wholesaleMinQuantity}+ {language === "uz" ? "dona" : language === "ru" ? "шт" : "pcs"}):
            </span>
            <div>
              <span className="text-lg font-bold text-accent">{formatPrice(product.wholesalePrice)}</span>
              <span className="text-sm text-accent ml-1">{t("som", language)}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary text-white font-semibold hover:bg-blue-700 transition-colors"
          onClick={() => handleAddToCart(false)}
        >
          {t("add_to_cart", language)}
        </Button>
      </div>
    </div>
  );
}
