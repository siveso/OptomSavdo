import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import type { Product } from "@shared/schema";

export function PopularProducts() {
  const { language } = useLanguage();
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true, limit: 4 }],
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-64"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-96"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t("popular_products", language)}</h3>
            <p className="text-xl text-slate-600">{t("popular_products_desc", language)}</p>
          </div>
          <Button variant="ghost" className="text-primary font-semibold hover:text-blue-700 flex items-center space-x-2">
            <span>{t("view_all", language)}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">
                {language === "uz" ? "Mahsulotlar topilmadi" : 
                 language === "ru" ? "Товары не найдены" : "No products found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
