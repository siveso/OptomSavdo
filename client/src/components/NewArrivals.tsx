import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import type { Product } from "@shared/schema";

export function NewArrivals() {
  const { language } = useLanguage();
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { isNew: true, limit: 3 }],
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-64"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-96"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="w-full h-56 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-3 mb-6">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{t("new_arrivals", language)}</h3>
            <p className="text-xl text-slate-600">{t("new_arrivals_desc", language)}</p>
          </div>
          <Button variant="ghost" className="text-primary font-semibold hover:text-blue-700 flex items-center space-x-2">
            <span>{t("view_all", language)}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group">
                <div className="relative overflow-hidden rounded-t-xl">
                  <img 
                    src={product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"}
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {language === "uz" ? "YANGI" : language === "ru" ? "НОВЫЙ" : "NEW"}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                    {language === "uz" ? product.nameUz || product.name : 
                     language === "ru" ? product.nameRu || product.name : 
                     product.nameEn || product.name}
                  </h4>
                  <p className="text-slate-600 mb-4">
                    {language === "uz" ? product.descriptionUz || product.description : 
                     language === "ru" ? product.descriptionRu || product.description : 
                     product.descriptionEn || product.description}
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">{t("retail_price", language)}</span>
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          {new Intl.NumberFormat('uz-UZ').format(Number(product.retailPrice))}
                        </span>
                        <span className="text-slate-600 ml-1">{t("som", language)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-accent bg-opacity-10 p-3 rounded-lg">
                      <span className="font-medium text-accent">
                        {t("wholesale_price", language)} ({product.wholesaleMinQuantity}+ {language === "uz" ? "dona" : language === "ru" ? "шт" : "pcs"}):
                      </span>
                      <div>
                        <span className="text-xl font-bold text-accent">
                          {new Intl.NumberFormat('uz-UZ').format(Number(product.wholesalePrice))}
                        </span>
                        <span className="text-accent ml-1">{t("som", language)}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-primary text-white py-3 font-semibold hover:bg-blue-700 transition-colors">
                    {t("view_product", language)}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">
                {language === "uz" ? "Yangi mahsulotlar topilmadi" : 
                 language === "ru" ? "Новые товары не найдены" : "No new products found"}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
