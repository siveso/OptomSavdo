import { useState } from "react";
import { Link } from "wouter";
import { Search, Heart, ShoppingCart, User, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";
import { ShoppingCart as ShoppingCartComponent } from "./ShoppingCart";

export function Header() {
  const { isAuthenticated } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="border-b border-gray-100 py-2 text-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-slate-600">{t("free_shipping", language)}</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Language Selector */}
                <Select value={language} onValueChange={changeLanguage}>
                  <SelectTrigger className="border-none bg-transparent text-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uz">O'zbek</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-slate-600">|</span>
                {isAuthenticated ? (
                  <a href="/api/logout" className="text-slate-600 hover:text-primary">
                    Chiqish
                  </a>
                ) : (
                  <>
                    <a href="/api/login" className="text-slate-600 hover:text-primary">
                      {t("login", language)}
                    </a>
                    <a href="/api/login" className="text-slate-600 hover:text-primary">
                      {t("register", language)}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <h1 className="text-2xl font-bold text-primary">OptomSavdo</h1>
                  <span className="ml-2 text-sm text-secondary font-medium">
                    {language === "uz" ? "Eng yaxshi narxlar" : 
                     language === "ru" ? "Лучшие цены" : "Best prices"}
                  </span>
                </div>
              </Link>
              
              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder={t("search_placeholder", language)}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-3"
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-6">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Heart className="h-5 w-5" />
                  <span className="hidden sm:block">{t("wishlist", language)}</span>
                  <span className="bg-secondary text-white text-xs rounded-full px-1.5 py-0.5">3</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-1"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden sm:block">{t("cart", language)}</span>
                  <span className="bg-secondary text-white text-xs rounded-full px-1.5 py-0.5">2</span>
                </Button>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">{t("profile", language)}</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Button className="flex items-center space-x-2 bg-primary text-white">
                  <Menu className="h-4 w-4" />
                  <span>{t("categories", language)}</span>
                </Button>
                <Link href="/" className="text-slate-600 hover:text-primary font-medium">
                  {t("home", language)}
                </Link>
                <Link href="/discounts" className="text-slate-600 hover:text-primary font-medium">
                  {t("discounts", language)}
                </Link>
                <Link href="/wholesale" className="text-slate-600 hover:text-primary font-medium">
                  {t("wholesale", language)}
                </Link>
                <Link href="/products?isNew=true" className="text-slate-600 hover:text-primary font-medium">
                  {t("new_products", language)}
                </Link>
                <Link href="/contact" className="text-slate-600 hover:text-primary font-medium">
                  {t("contact", language)}
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="font-semibold text-slate-600">+998 (90) 123-45-67</span>
              </div>
            </div>
          </nav>
        </div>
      </header>
      
      <ShoppingCartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
