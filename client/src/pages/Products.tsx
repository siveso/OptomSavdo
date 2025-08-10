import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Filter, Grid, List } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Parse URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';
  const initialCategory = urlParams.get('category') || '';
  const isNew = urlParams.get('isNew') === 'true';
  const featured = urlParams.get('featured') === 'true';

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", {
      search: searchQuery || initialSearch,
      categoryId: selectedCategory || initialCategory,
      isNew,
      featured,
      limit: 20,
    }],
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    window.history.pushState({}, '', `/products?${params.toString()}`);
  };

  const getCategoryName = (category: Category) => {
    if (language === "uz") return category.nameUz || category.name;
    if (language === "ru") return category.nameRu || category.name;
    return category.nameEn || category.name;
  };

  const sortedProducts = [...products].sort((a: Product, b: Product) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.retailPrice) - Number(b.retailPrice);
      case 'price-high':
        return Number(b.retailPrice) - Number(a.retailPrice);
      case 'rating':
        return Number(b.rating) - Number(a.rating);
      case 'newest':
      default:
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    }
  });

  const pageTitle = isNew 
    ? t("new_products", language)
    : featured 
    ? t("popular_products", language)
    : language === "uz" ? "Barcha mahsulotlar" 
    : language === "ru" ? "Все товары" 
    : "All Products";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
          <p className="text-slate-600">
            {products.length} {t("products", language)} {language === "uz" ? "topildi" : language === "ru" ? "найдено" : "found"}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t("search_placeholder", language)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("categories", language)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {language === "uz" ? "Barcha kategoriyalar" : 
                   language === "ru" ? "Все категории" : "All Categories"}
                </SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {getCategoryName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  {language === "uz" ? "Eng yangi" : 
                   language === "ru" ? "Самые новые" : "Newest"}
                </SelectItem>
                <SelectItem value="price-low">
                  {language === "uz" ? "Arzon narx" : 
                   language === "ru" ? "Дешевые" : "Price: Low to High"}
                </SelectItem>
                <SelectItem value="price-high">
                  {language === "uz" ? "Qimmat narx" : 
                   language === "ru" ? "Дорогие" : "Price: High to Low"}
                </SelectItem>
                <SelectItem value="rating">
                  {language === "uz" ? "Reyting bo'yicha" : 
                   language === "ru" ? "По рейтингу" : "Highest Rated"}
                </SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : sortedProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {sortedProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === "uz" ? "Mahsulotlar topilmadi" : 
               language === "ru" ? "Товары не найдены" : "No products found"}
            </h3>
            <p className="text-slate-600">
              {language === "uz" ? "Qidiruv so'zini o'zgartiring yoki filtrlarni qayta sozlang" : 
               language === "ru" ? "Измените поисковый запрос или настройте фильтры" : 
               "Try changing your search term or adjusting filters"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
