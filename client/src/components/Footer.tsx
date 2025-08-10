import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { t } from "@/lib/i18n";

export function Footer() {
  const { language } = useLanguage();

  const categories = [
    { uz: "Elektronika", ru: "Электроника", en: "Electronics" },
    { uz: "Kiyim-kechak", ru: "Одежда", en: "Clothing" },
    { uz: "Uy uchun", ru: "Для дома", en: "Home" },
    { uz: "Sport va dam olish", ru: "Спорт и отдых", en: "Sports & Recreation" },
    { uz: "Avtomobil", ru: "Автомобиль", en: "Automotive" },
  ];

  const customerService = [
    { uz: "Biz haqimizda", ru: "О нас", en: "About Us" },
    { uz: "Bog'lanish", ru: "Контакты", en: "Contact" },
    { uz: "FAQ", ru: "FAQ", en: "FAQ" },
    { uz: "Qaytarish siyosati", ru: "Политика возврата", en: "Return Policy" },
    { uz: "Maxfiylik siyosati", ru: "Политика конфиденциальности", en: "Privacy Policy" },
  ];

  const getText = (item: { uz: string; ru: string; en: string }) => {
    return item[language] || item.uz;
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">OptomSavdo</h3>
            <p className="text-gray-300 mb-6">
              {t("footer_description", language)}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 9.728-.896 9.728-.384 3.24-1.43 3.808-1.43 3.808-1.297.703-2.162-.319-2.162-.319l-3.056-2.24 1.44-1.728 1.92.96.896-3.84-4.48-3.36c-.128-.32.32-.48.32-.48l6.72-2.48c.8-.32 1.44.32 1.28 1.12z"/>
                </svg>
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">{t("categories", language)}</h4>
            <ul className="space-y-2 text-gray-300">
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {getText(category)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t("customer_service", language)}</h4>
            <ul className="space-y-2 text-gray-300">
              {customerService.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-colors">
                    {getText(service)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t("contact", language)}</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+998 (90) 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span>info@optomsavdo.uz</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>
                  {language === "uz" ? "Toshkent, Amir Temur ko'chasi" :
                   language === "ru" ? "Ташкент, улица Амир Темур" :
                   "Tashkent, Amir Temur Street"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-secondary" />
                <span>{t("online_service", language)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="font-semibold mb-4 text-center">{t("payment_methods", language)}</h4>
          <div className="flex justify-center items-center space-x-6 flex-wrap">
            <div className="bg-white rounded-lg p-3 m-1">
              <span className="text-blue-600 font-bold text-sm">UZCARD</span>
            </div>
            <div className="bg-white rounded-lg p-3 m-1">
              <span className="text-green-600 font-bold text-sm">HUMO</span>
            </div>
            <div className="bg-white rounded-lg p-3 m-1">
              <span className="text-blue-500 font-bold text-sm">PAYME</span>
            </div>
            <div className="bg-white rounded-lg p-3 m-1">
              <span className="text-purple-600 font-bold text-sm">CLICK</span>
            </div>
            <div className="bg-white rounded-lg p-3 m-1">
              <span className="text-blue-700 font-bold text-sm">VISA</span>
            </div>
            <div className="bg-white rounded-lg p-3 m-1">
              <span className="text-red-600 font-bold text-sm">MASTERCARD</span>
            </div>
          </div>
        </div>
        
        {/* Shipping Partners */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="font-semibold mb-4 text-center">{t("shipping_partners", language)}</h4>
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg p-3">
              <span className="text-red-600 font-bold text-lg">FARGO</span>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 OptomSavdo. {t("all_rights_reserved", language)}</p>
        </div>
      </div>
    </footer>
  );
}
