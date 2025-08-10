import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { 
  Laptop, 
  Shirt, 
  Home, 
  Dumbbell, 
  Gamepad2, 
  Leaf,
  Package,
  Car,
  Book,
  Utensils
} from "lucide-react";
import type { Category } from "@shared/schema";

const iconMap = {
  "fas fa-laptop": Laptop,
  "fas fa-tshirt": Shirt,
  "fas fa-home": Home,
  "fas fa-dumbbell": Dumbbell,
  "fas fa-gamepad": Gamepad2,
  "fas fa-leaf": Leaf,
  "fas fa-box": Package,
  "fas fa-car": Car,
  "fas fa-book": Book,
  "fas fa-utensils": Utensils,
};

const defaultCategories = [
  { id: "1", icon: "fas fa-laptop", nameUz: "Elektronika", nameRu: "Электроника", nameEn: "Electronics", productCount: 150 },
  { id: "2", icon: "fas fa-tshirt", nameUz: "Kiyim", nameRu: "Одежда", nameEn: "Clothing", productCount: 300 },
  { id: "3", icon: "fas fa-home", nameUz: "Uy uchun", nameRu: "Для дома", nameEn: "Home", productCount: 200 },
  { id: "4", icon: "fas fa-dumbbell", nameUz: "Sport", nameRu: "Спорт", nameEn: "Sports", productCount: 80 },
  { id: "5", icon: "fas fa-gamepad", nameUz: "O'yinlar", nameRu: "Игры", nameEn: "Games", productCount: 120 },
  { id: "6", icon: "fas fa-leaf", nameUz: "Organik", nameRu: "Органические", nameEn: "Organic", productCount: 90 },
];

export function FeaturedCategories() {
  const { language } = useLanguage();
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    retry: false,
  });

  // Use default categories if API fails or returns empty
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const getIconComponent = (iconClass: string) => {
    const IconComponent = iconMap[iconClass as keyof typeof iconMap] || Package;
    return IconComponent;
  };

  const getCategoryName = (category: any) => {
    if (language === "uz") return category.nameUz || category.name;
    if (language === "ru") return category.nameRu || category.name;
    return category.nameEn || category.name;
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
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
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{t("popular_categories", language)}</h3>
          <p className="text-xl text-slate-600">{t("popular_categories_desc", language)}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayCategories.slice(0, 6).map((category: any, index: number) => {
            const IconComponent = getIconComponent(category.icon);
            const colors = [
              "bg-primary bg-opacity-10 text-primary",
              "bg-secondary bg-opacity-10 text-secondary",
              "bg-accent bg-opacity-10 text-accent",
              "bg-red-500 bg-opacity-10 text-red-500",
              "bg-purple-500 bg-opacity-10 text-purple-500",
              "bg-green-500 bg-opacity-10 text-green-500",
            ];
            
            return (
              <div key={category.id} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <div className={`${colors[index % colors.length]} rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center group-hover:bg-opacity-20 transition-colors`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{getCategoryName(category)}</h4>
                <p className="text-sm text-slate-600">
                  {category.productCount || 0}+ {t("products", language)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
